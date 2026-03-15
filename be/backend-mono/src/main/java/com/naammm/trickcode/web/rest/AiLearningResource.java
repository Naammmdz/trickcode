package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.service.AiLearningService;
import com.naammm.trickcode.service.ProSubscriptionService;
import com.naammm.trickcode.service.dto.AiLearningRequest;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for AI-powered learning features (Student Pro only).
 */
@RestController
@RequestMapping("/api/ai/learning")
public class AiLearningResource {

    private static final Logger LOG = LoggerFactory.getLogger(AiLearningResource.class);
    private static final int MAX_REQUESTS_PER_MINUTE = 5;

    private final AiLearningService aiLearningService;
    private final ProSubscriptionService proSubscriptionService;
    private final ConcurrentHashMap<String, long[]> rateLimitMap = new ConcurrentHashMap<>();

    public AiLearningResource(AiLearningService aiLearningService, ProSubscriptionService proSubscriptionService) {
        this.aiLearningService = aiLearningService;
        this.proSubscriptionService = proSubscriptionService;
    }

    /**
     * POST /api/ai/learning/code-hint — Get a hint for a code challenge.
     */
    @PostMapping("/code-hint")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getCodeHint(@Valid @RequestBody AiLearningRequest request) {
        ResponseEntity<Map<String, Object>> check = checkProAndRateLimit();
        if (check != null) return check;

        try {
            Map<String, Object> result = aiLearningService.getCodeHint(
                request.getSourceCode(), request.getLanguage(), request.getQuestion()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/ai/learning/explain-fail — Explain why a test case failed.
     */
    @PostMapping("/explain-fail")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> explainFailure(@Valid @RequestBody AiLearningRequest request) {
        ResponseEntity<Map<String, Object>> check = checkProAndRateLimit();
        if (check != null) return check;

        try {
            Map<String, Object> result = aiLearningService.explainTestFailure(
                request.getSourceCode(), request.getLanguage(),
                request.getTestInput(), request.getExpectedOutput(), request.getActualOutput()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/ai/learning/ask-code — Ask a question about code.
     */
    @PostMapping("/ask-code")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> askCodeQuestion(@Valid @RequestBody AiLearningRequest request) {
        ResponseEntity<Map<String, Object>> check = checkProAndRateLimit();
        if (check != null) return check;

        if (request.getQuestion() == null || request.getQuestion().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "question is required"));
        }

        try {
            Map<String, Object> result = aiLearningService.askCodeQuestion(
                request.getSourceCode(), request.getLanguage(), request.getQuestion()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/ai/learning/ask-quiz — Ask AI to explain a quiz question.
     */
    @PostMapping("/ask-quiz")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> askQuizQuestion(@Valid @RequestBody AiLearningRequest request) {
        ResponseEntity<Map<String, Object>> check = checkProAndRateLimit();
        if (check != null) return check;

        try {
            Map<String, Object> result = aiLearningService.askQuizQuestion(
                request.getQuizQuestion(), request.getStudentAnswer(),
                request.getCorrectAnswer(), request.getQuestion()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Pro check + rate limit ─────────────────────────────────────

    private ResponseEntity<Map<String, Object>> checkProAndRateLimit() {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();

        if (!proSubscriptionService.isStudentPro(login)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Pro subscription required. Upgrade to Student Pro to use AI learning features."));
        }

        long now = System.currentTimeMillis();
        long windowMs = 60_000L;

        long[] bucket = rateLimitMap.compute(login, (key, existing) -> {
            if (existing == null || (now - existing[1]) > windowMs) {
                return new long[]{1, now};
            }
            existing[0]++;
            return existing;
        });

        if (bucket[0] > MAX_REQUESTS_PER_MINUTE) {
            LOG.warn("Rate limit exceeded for user: {}", login);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(Map.of("error", "Rate limit exceeded. Please wait before sending more requests."));
        }
        return null;
    }
}
