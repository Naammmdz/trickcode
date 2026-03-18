package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.domain.CodeSubmission;
import com.naammm.trickcode.service.CodeExecutionService;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for code execution and submission.
 */
@RestController
@RequestMapping("/api/code")
public class CodeExecutionResource {

    private static final Logger LOG = LoggerFactory.getLogger(CodeExecutionResource.class);

    private final CodeExecutionService codeExecutionService;

    public CodeExecutionResource(CodeExecutionService codeExecutionService) {
        this.codeExecutionService = codeExecutionService;
    }

    /**
     * POST /api/code/run : Execute code without test cases (free run).
     */
    @PostMapping("/run")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> runCode(@RequestBody Map<String, Object> request) {
        LOG.debug("REST request to run code");
        String sourceCode = (String) request.get("sourceCode");
        String language = request.getOrDefault("language", "python").toString();
        String stdin = request.getOrDefault("stdin", "").toString();
        Object lessonIdObj = request.get("lessonId");

        if (sourceCode == null || sourceCode.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "sourceCode is required"));
        }

        Long lessonId = null;
        if (lessonIdObj != null) {
            try {
                lessonId = Long.valueOf(lessonIdObj.toString());
            } catch (NumberFormatException ignored) {}
        }

        try {
            Map<String, Object> result = codeExecutionService.runCode(sourceCode, language, stdin, lessonId);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            LOG.error("Code run failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/code/submit : Submit code against lesson test cases.
     */
    @PostMapping("/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> submitCode(@RequestBody Map<String, Object> request) {
        LOG.debug("REST request to submit code");
        String sourceCode = (String) request.get("sourceCode");
        String language = (String) request.getOrDefault("language", "python");
        Object lessonIdObj = request.get("lessonId");

        if (sourceCode == null || sourceCode.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "sourceCode is required"));
        }
        if (lessonIdObj == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "lessonId is required"));
        }

        try {
            Long lessonId = Long.valueOf(lessonIdObj.toString());
            Map<String, Object> result = codeExecutionService.submitCode(lessonId, sourceCode, language);
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            LOG.error("Code submission failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/code/submissions/{lessonId} : Get submission history for a lesson.
     */
    @GetMapping("/submissions/{lessonId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CodeSubmission>> getSubmissions(
        @PathVariable Long lessonId,
        @RequestParam(defaultValue = "20") int limit
    ) {
        LOG.debug("REST request to get submissions for lesson {}", lessonId);
        int safeLimit = Math.min(Math.max(limit, 1), 50);
        List<CodeSubmission> submissions = codeExecutionService.getSubmissionHistory(lessonId, safeLimit);
        return ResponseEntity.ok(submissions);
    }
}
