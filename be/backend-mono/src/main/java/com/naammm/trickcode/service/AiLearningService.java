package com.naammm.trickcode.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * AI Learning Service — provides AI-powered hints, explanations, and Q&A for Student Pro users.
 */
@Service
public class AiLearningService {

    private static final Logger LOG = LoggerFactory.getLogger(AiLearningService.class);

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-3.1-flash-lite-preview}")
    private String geminiModel;

    @Value("${gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiLearningService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Generate a hint for a code challenge (no direct answer).
     */
    public Map<String, Object> getCodeHint(String sourceCode, String language, String problemDescription) {
        String prompt = """
            You are a programming tutor. A student is working on a coding challenge.
            
            Problem: %s
            Language: %s
            Student's current code:
            ```
            %s
            ```
            
            Give a helpful HINT to guide them toward the solution. Rules:
            - Do NOT provide the full solution or direct code answer
            - Point out the general approach or algorithm they should consider
            - If their code has a logical error, hint at WHERE the issue might be (not the fix)
            - Keep it concise (2-4 sentences)
            - Respond in the same language as the problem description
            """.formatted(
            problemDescription != null ? problemDescription : "Not provided",
            language,
            sourceCode != null ? sourceCode : "// No code yet"
        );

        String response = callGemini(prompt);
        return Map.of("hint", response);
    }

    /**
     * Explain why a test case failed.
     */
    public Map<String, Object> explainTestFailure(
        String sourceCode, String language,
        String testInput, String expectedOutput, String actualOutput
    ) {
        String prompt = """
            You are a programming tutor. A student's code failed a test case.
            
            Language: %s
            
            Student's code:
            ```
            %s
            ```
            
            Test case:
            - Input: %s
            - Expected output: %s
            - Actual output: %s
            
            Explain WHY the code produces the wrong output for this test case. Rules:
            - Trace through the code logic step by step with the given input
            - Explain what the code does vs what it SHOULD do
            - Do NOT provide the corrected code
            - Suggest what concept or approach to reconsider
            - Keep it clear and educational
            - Respond in Vietnamese
            """.formatted(
            language,
            sourceCode,
            testInput != null ? testInput : "None",
            expectedOutput != null ? expectedOutput : "N/A",
            actualOutput != null ? actualOutput : "N/A"
        );

        String response = callGemini(prompt);
        return Map.of("explanation", response);
    }

    /**
     * Answer a free-form question about code.
     */
    public Map<String, Object> askCodeQuestion(String sourceCode, String language, String question) {
        String prompt = """
            You are a helpful programming tutor. A student has a question about their code.
            
            Language: %s
            
            Student's code:
            ```
            %s
            ```
            
            Student's question: %s
            
            Answer the question helpfully. Rules:
            - Be educational — explain concepts, don't just give code
            - If they ask for the solution directly, guide them instead
            - Use examples if helpful
            - Keep response concise but thorough
            - Respond in the same language as the question
            """.formatted(
            language,
            sourceCode != null ? sourceCode : "// No code provided",
            question
        );

        String response = callGemini(prompt);
        return Map.of("answer", response);
    }

    /**
     * Explain a quiz question in detail.
     */
    public Map<String, Object> askQuizQuestion(
        String quizQuestion, String studentAnswer, String correctAnswer, String userQuestion
    ) {
        String prompt = """
            You are an educational tutor. A student just answered a quiz question and wants to understand it better.
            
            Quiz question: %s
            Student's answer: %s
            Correct answer: %s
            
            Student asks: %s
            
            Provide a detailed, educational explanation. Rules:
            - Explain WHY the correct answer is correct
            - If the student got it wrong, explain the misconception
            - Provide context and background knowledge
            - Use simple, clear language
            - Respond in the same language as the quiz question
            """.formatted(
            quizQuestion != null ? quizQuestion : "Not provided",
            studentAnswer != null ? studentAnswer : "Not provided",
            correctAnswer != null ? correctAnswer : "Not provided",
            userQuestion != null ? userQuestion : "Please explain this question in detail"
        );

        String response = callGemini(prompt);
        return Map.of("explanation", response);
    }

    // ─── Gemini API call (text response, no JSON parsing) ───────────

    private String callGemini(String prompt) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            throw new IllegalStateException("Gemini API key is not configured");
        }

        String url = geminiApiUrl + "/" + geminiModel + ":generateContent";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", geminiApiKey);

        Map<String, Object> body = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        List<Map<String, String>> parts = new ArrayList<>();
        parts.add(Map.of("text", prompt));
        content.put("parts", parts);
        contents.add(content);
        body.put("contents", contents);

        // Text output, moderate temperature
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("topP", 0.9);
        generationConfig.put("maxOutputTokens", 2048);
        body.put("generationConfig", generationConfig);

        try {
            String jsonBody = objectMapper.writeValueAsString(body);
            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

            if (response.getBody() == null) {
                throw new IllegalStateException("Empty response from Gemini API");
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.get("candidates");
            if (candidates == null || !candidates.isArray() || candidates.isEmpty()) {
                throw new IllegalStateException("No candidates in Gemini response");
            }

            return candidates.get(0).get("content").get("parts").get(0).get("text").asText();

        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            LOG.error("Gemini API call failed: {}", e.getMessage());
            throw new IllegalStateException("AI service unavailable: " + e.getMessage(), e);
        }
    }
}
