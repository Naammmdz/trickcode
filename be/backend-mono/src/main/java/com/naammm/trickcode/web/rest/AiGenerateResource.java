package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.service.AiGenerateService;
import com.naammm.trickcode.service.dto.GenerateCodeRequest;
import com.naammm.trickcode.service.dto.GenerateQuizRequest;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiGenerateResource {

    private static final Logger LOG = LoggerFactory.getLogger(AiGenerateResource.class);

    private static final int MAX_REQUESTS_PER_MINUTE = 5;

    private final AiGenerateService aiGenerateService;

    // Simple in-memory rate limiter: user -> [count, windowStart]
    private final ConcurrentHashMap<String, long[]> rateLimitMap = new ConcurrentHashMap<>();

    public AiGenerateResource(AiGenerateService aiGenerateService) {
        this.aiGenerateService = aiGenerateService;
    }

    @PostMapping("/generate-quiz")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_INSTRUCTOR', 'ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> generateQuiz(@Valid @RequestBody GenerateQuizRequest request) {
        LOG.debug("REST request to generate quiz via AI");

        ResponseEntity<Map<String, Object>> rateLimited = checkRateLimit();
        if (rateLimited != null) return rateLimited;

        try {
            Map<String, Object> result = aiGenerateService.generateQuiz(
                request.getCourseTitle(),
                request.getCourseDescription(),
                request.getLessonTitle(),
                request.getCustomPrompt(),
                request.getQuestionCount(),
                request.getLanguage()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            LOG.error("Quiz generation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/generate-code")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_INSTRUCTOR', 'ROLE_STAFF')")
    public ResponseEntity<Map<String, Object>> generateCode(@Valid @RequestBody GenerateCodeRequest request) {
        LOG.debug("REST request to generate code challenge via AI");

        ResponseEntity<Map<String, Object>> rateLimited = checkRateLimit();
        if (rateLimited != null) return rateLimited;

        try {
            Map<String, Object> result = aiGenerateService.generateCode(
                request.getCourseTitle(),
                request.getCourseDescription(),
                request.getLessonTitle(),
                request.getCustomPrompt(),
                request.getTestCaseCount(),
                request.getLanguage()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            LOG.error("Code challenge generation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Simple rate limiter (per user, sliding window 60s) ─────────

    private ResponseEntity<Map<String, Object>> checkRateLimit() {
        String user = SecurityContextHolder.getContext().getAuthentication().getName();
        long now = System.currentTimeMillis();
        long windowMs = 60_000L;

        long[] bucket = rateLimitMap.compute(user, (key, existing) -> {
            if (existing == null || (now - existing[1]) > windowMs) {
                // New window
                return new long[]{1, now};
            }
            existing[0]++;
            return existing;
        });

        if (bucket[0] > MAX_REQUESTS_PER_MINUTE) {
            LOG.warn("Rate limit exceeded for user: {}", user);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(Map.of("error", "Rate limit exceeded. Please wait before generating more content."));
        }
        return null;
    }
}
