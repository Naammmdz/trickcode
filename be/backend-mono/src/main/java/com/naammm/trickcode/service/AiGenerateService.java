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

@Service
public class AiGenerateService {

    private static final Logger LOG = LoggerFactory.getLogger(AiGenerateService.class);

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-3.1-flash-lite-preview}")
    private String geminiModel;

    @Value("${gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiGenerateService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> generateQuiz(
        String courseTitle,
        String courseDescription,
        String lessonTitle,
        String customPrompt,
        int questionCount,
        String language
    ) {
        validateApiKey();

        String prompt = buildQuizPrompt(courseTitle, courseDescription, lessonTitle, customPrompt, questionCount, language);
        String response = callGemini(prompt);
        return parseJsonResponse(response, "quiz");
    }

    public Map<String, Object> generateCode(
        String courseTitle,
        String courseDescription,
        String lessonTitle,
        String customPrompt,
        int testCaseCount,
        String language
    ) {
        validateApiKey();

        String prompt = buildCodePrompt(courseTitle, courseDescription, lessonTitle, customPrompt, testCaseCount, language);
        String response = callGemini(prompt);
        return parseJsonResponse(response, "code challenge");
    }

    private void validateApiKey() {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            throw new IllegalStateException("Gemini API key is not configured. Set GEMINI_API_KEY environment variable.");
        }
    }

    private String buildQuizPrompt(
        String courseTitle,
        String courseDescription,
        String lessonTitle,
        String customPrompt,
        int questionCount,
        String language
    ) {
        String lang = "vi".equals(language) ? "Vietnamese" : "English";

        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert educator creating quiz questions for an online programming course.\n\n");
        sb.append("COURSE CONTEXT:\n");
        sb.append("- Course Title: ").append(courseTitle != null ? courseTitle : "N/A").append("\n");
        sb.append("- Course Description: ").append(courseDescription != null ? courseDescription : "N/A").append("\n");
        sb.append("- Lesson Title: ").append(lessonTitle != null ? lessonTitle : "N/A").append("\n\n");

        if (customPrompt != null && !customPrompt.isBlank()) {
            sb.append("ADDITIONAL INSTRUCTIONS FROM INSTRUCTOR:\n");
            sb.append(customPrompt).append("\n\n");
        }

        sb.append("TASK: Generate exactly ").append(questionCount).append(" multiple-choice quiz questions.\n");
        sb.append("Language: Write all question text and options in ").append(lang).append(".\n\n");
        sb.append("IMPORTANT: Respond ONLY with valid JSON (no markdown, no code fences, no extra text).\n");
        sb.append("Response format:\n");
        sb.append("{\n");
        sb.append("  \"questions\": [\n");
        sb.append("    {\n");
        sb.append("      \"id\": \"q1\",\n");
        sb.append("      \"question\": \"Question text here\",\n");
        sb.append("      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n");
        sb.append("      \"correctAnswer\": 0,\n");
        sb.append("      \"explanation\": \"Why this answer is correct\"\n");
        sb.append("    }\n");
        sb.append("  ]\n");
        sb.append("}\n\n");
        sb.append("Rules:\n");
        sb.append("- Each question MUST have exactly 4 options\n");
        sb.append("- correctAnswer is 0-indexed (0=first option, 1=second, etc.)\n");
        sb.append("- id must be unique: q1, q2, q3...\n");
        sb.append("- Questions should test understanding, not just memorization\n");
        sb.append("- Include a mix of easy, medium, and hard questions\n");
        sb.append("- Explanation should be concise but helpful\n");

        return sb.toString();
    }

    private String buildCodePrompt(
        String courseTitle,
        String courseDescription,
        String lessonTitle,
        String customPrompt,
        int testCaseCount,
        String language
    ) {
        String lang = "vi".equals(language) ? "Vietnamese" : "English";

        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert programming instructor creating a coding challenge for an online course.\n\n");
        sb.append("COURSE CONTEXT:\n");
        sb.append("- Course Title: ").append(courseTitle != null ? courseTitle : "N/A").append("\n");
        sb.append("- Course Description: ").append(courseDescription != null ? courseDescription : "N/A").append("\n");
        sb.append("- Lesson Title: ").append(lessonTitle != null ? lessonTitle : "N/A").append("\n\n");

        if (customPrompt != null && !customPrompt.isBlank()) {
            sb.append("ADDITIONAL INSTRUCTIONS FROM INSTRUCTOR:\n");
            sb.append(customPrompt).append("\n\n");
        }

        sb.append("TASK: Generate a coding challenge with ").append(testCaseCount).append(" test cases.\n");
        sb.append("Language for descriptions: ").append(lang).append(".\n\n");
        sb.append("IMPORTANT: Respond ONLY with valid JSON (no markdown, no code fences, no extra text).\n");
        sb.append("Response format:\n");
        sb.append("{\n");
        sb.append("  \"problemDescription\": \"# Problem Title\\n\\nDescription in markdown...\",\n");
        sb.append("  \"functionName\": \"functionName\",\n");
        sb.append("  \"initialCode\": {\n");
        sb.append("    \"python\": \"def functionName(param):\\n    pass\",\n");
        sb.append("    \"javascript\": \"function functionName(param) {\\n\\n}\",\n");
        sb.append("    \"java\": \"class Solution {\\n    public ReturnType functionName(ParamType param) {\\n\\n    }\\n}\"\n");
        sb.append("  },\n");
        sb.append("  \"testCases\": [\n");
        sb.append("    {\n");
        sb.append("      \"input\": \"param = value\",\n");
        sb.append("      \"expected\": \"expectedResult\"\n");
        sb.append("    }\n");
        sb.append("  ]\n");
        sb.append("}\n\n");
        sb.append("Rules:\n");
        sb.append("- problemDescription should be clear, well-formatted Markdown\n");
        sb.append("- functionName must be a valid identifier (camelCase)\n");
        sb.append("- initialCode must compile/run without errors (function signature only, body empty)\n");
        sb.append("- For Java, use class Solution with the method inside\n");
        sb.append("- Test case input format: \"paramName = value\" (one param per line if multiple)\n");
        sb.append("- expected should be the exact console output of the correct solution\n");
        sb.append("- Include edge cases in test data\n");
        sb.append("- Problem difficulty should match the course level\n");

        return sb.toString();
    }

    private String callGemini(String prompt) {
        String url = geminiApiUrl + "/" + geminiModel + ":generateContent";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-goog-api-key", geminiApiKey);

        Map<String, Object> body = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        List<Map<String, Object>> parts = new ArrayList<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        parts.add(part);
        content.put("parts", parts);
        contents.add(content);
        body.put("contents", contents);

        // Generation config for reliable JSON output
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("topP", 0.9);
        generationConfig.put("maxOutputTokens", 8192);
        generationConfig.put("responseMimeType", "application/json");
        body.put("generationConfig", generationConfig);

        try {
            String jsonBody = objectMapper.writeValueAsString(body);
            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);

            LOG.debug("Calling Gemini API: {}", url);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

            if (response.getBody() == null) {
                throw new IllegalStateException("Empty response from Gemini API");
            }

            // Parse Gemini response to extract text
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.get("candidates");
            if (candidates == null || !candidates.isArray() || candidates.isEmpty()) {
                throw new IllegalStateException("No candidates in Gemini response");
            }

            JsonNode firstCandidate = candidates.get(0);
            JsonNode contentNode = firstCandidate.get("content");
            if (contentNode == null) {
                throw new IllegalStateException("No content in Gemini candidate");
            }

            JsonNode partsNode = contentNode.get("parts");
            if (partsNode == null || !partsNode.isArray() || partsNode.isEmpty()) {
                throw new IllegalStateException("No parts in Gemini content");
            }

            String text = partsNode.get(0).get("text").asText();
            LOG.debug("Gemini raw response text length: {}", text.length());

            return text;

        } catch (Exception e) {
            LOG.error("Gemini API call failed: {}", e.getMessage());
            throw new IllegalStateException("Gemini API call failed: " + e.getMessage(), e);
        }
    }

    private String cleanJsonResponse(String raw) {
        String cleaned = raw.trim();
        // Remove markdown code fences if present
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseJsonResponse(String rawResponse, String contextLabel) {
        try {
            String cleaned = cleanJsonResponse(rawResponse);
            return objectMapper.readValue(cleaned, Map.class);
        } catch (Exception e) {
            LOG.error("Failed to parse {} JSON response: {}", contextLabel, e.getMessage());
            LOG.debug("Raw response: {}", rawResponse);
            throw new IllegalStateException("AI returned invalid " + contextLabel + " format. Please try again.", e);
        }
    }
}
