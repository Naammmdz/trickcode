package com.naammm.trickcode.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.naammm.trickcode.domain.CodeSubmission;
import com.naammm.trickcode.domain.Enrollment;
import com.naammm.trickcode.domain.Lesson;
import com.naammm.trickcode.domain.LessonProgress;
import com.naammm.trickcode.domain.User;
import com.naammm.trickcode.domain.enumeration.SubmissionStatus;
import com.naammm.trickcode.repository.CodeSubmissionRepository;
import com.naammm.trickcode.repository.EnrollmentRepository;
import com.naammm.trickcode.repository.LessonProgressRepository;
import com.naammm.trickcode.repository.LessonRepository;
import com.naammm.trickcode.repository.UserRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
public class CodeExecutionService {

    private static final Logger LOG = LoggerFactory.getLogger(CodeExecutionService.class);

    @Value("${jdoodle.client-id:}")
    private String jdoodleClientId;

    @Value("${jdoodle.client-secret:}")
    private String jdoodleClientSecret;

    @Value("${jdoodle.api-url:https://api.jdoodle.com/v1/execute}")
    private String jdoodleApiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final CodeSubmissionRepository codeSubmissionRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CodeExecutionService(
        LessonRepository lessonRepository,
        UserRepository userRepository,
        CodeSubmissionRepository codeSubmissionRepository,
        LessonProgressRepository lessonProgressRepository,
        EnrollmentRepository enrollmentRepository
    ) {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
        this.codeSubmissionRepository = codeSubmissionRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // ─── Run Code (no test cases, just execute) ─────────────────────

    public Map<String, Object> runCode(String sourceCode, String language, String stdin) {
        return callJDoodle(sourceCode, language, stdin != null ? stdin : "");
    }

    // ─── Submit Code (run against test cases + save submission) ─────

    public Map<String, Object> submitCode(Long lessonId, String sourceCode, String language) {
        Lesson lesson = lessonRepository.findById(lessonId)
            .orElseThrow(() -> new IllegalArgumentException("Lesson not found: " + lessonId));

        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findOneByLogin(login)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Parse challenge config
        JsonNode config;
        try {
            config = objectMapper.readTree(lesson.getCodeChallengeConfig());
        } catch (Exception e) {
            throw new IllegalStateException("Invalid codeChallengeConfig for lesson " + lessonId, e);
        }

        String functionName = config.has("functionName") ? config.get("functionName").asText() : null;
        JsonNode testCasesNode = config.get("testCases");
        if (testCasesNode == null || !testCasesNode.isArray()) {
            throw new IllegalStateException("No test cases found for lesson " + lessonId);
        }

        List<Map<String, Object>> testResults = new ArrayList<>();
        int passedCount = 0;
        double totalTime = 0;
        int maxMemory = 0;
        SubmissionStatus overallStatus = SubmissionStatus.ACCEPTED;

        for (JsonNode tc : testCasesNode) {
            String input = tc.get("input").asText();
            String expected = tc.get("expected").asText().trim();

            // Wrap student code with runner for this test case
            String wrappedCode = wrapCode(sourceCode, language, functionName, input);
            Map<String, Object> result = callJDoodle(wrappedCode, language, "");

            int statusId = 0;
            if (result.get("status") instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> statusMap = (Map<String, Object>) result.get("status");
                statusId = statusMap.get("id") != null ? ((Number) statusMap.get("id")).intValue() : 0;
            }

            String actualRaw = "";
            if (result.get("stdout") != null) actualRaw = result.get("stdout").toString();
            else if (result.get("stderr") != null) actualRaw = result.get("stderr").toString();
            else if (result.get("compile_output") != null) actualRaw = result.get("compile_output").toString();

            String actual = actualRaw.trim();
            boolean passed = statusId == 3 && actual.equals(expected);

            if (passed) passedCount++;

            if (result.get("time") != null) {
                totalTime += Double.parseDouble(result.get("time").toString());
            }
            if (result.get("memory") != null) {
                int mem = ((Number) result.get("memory")).intValue();
                maxMemory = Math.max(maxMemory, mem);
            }

            // Determine status for failed test
            if (!passed && overallStatus == SubmissionStatus.ACCEPTED) {
                overallStatus = mapJudge0Status(statusId);
            }

            Map<String, Object> tcResult = new HashMap<>();
            tcResult.put("input", input);
            tcResult.put("expected", expected);
            tcResult.put("actual", actual);
            tcResult.put("passed", passed);
            tcResult.put("statusId", statusId);
            testResults.add(tcResult);
        }

        // Save submission
        CodeSubmission submission = new CodeSubmission();
        submission.setLanguage(language);
        submission.setSourceCode(sourceCode);
        submission.setStatus(overallStatus);
        submission.setTestsPassed(passedCount);
        submission.setTestsTotal(testCasesNode.size());
        submission.setExecutionTime(Math.round(totalTime * 1000.0) / 1000.0);
        submission.setMemoryUsed(maxMemory);
        submission.setSubmittedAt(Instant.now());
        submission.setUser(user);
        submission.setLesson(lesson);
        codeSubmissionRepository.save(submission);

        // Auto-complete lesson progress if all tests passed
        if (passedCount == testCasesNode.size()) {
            markLessonCompleted(user, lesson);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("submissionId", submission.getId());
        response.put("testsPassed", passedCount);
        response.put("testsTotal", testCasesNode.size());
        response.put("overallStatus", overallStatus.name());
        response.put("executionTime", submission.getExecutionTime());
        response.put("memoryUsed", maxMemory);
        response.put("testCaseResults", testResults);
        return response;
    }

    // ─── Get submission history ─────────────────────────────────────

    @Transactional(readOnly = true)
    public List<CodeSubmission> getSubmissionHistory(Long lessonId, int limit) {
        return codeSubmissionRepository.findByCurrentUserAndLesson(
            lessonId,
            org.springframework.data.domain.PageRequest.of(0, limit)
        );
    }

    // ─── Code wrapping logic ────────────────────────────────────────

    String wrapCode(String studentCode, String language, String functionName, String testInput) {
        if (functionName == null || functionName.isBlank()) {
            // No function name → just run as-is (fallback)
            return studentCode;
        }

        // Extract param names from test input (e.g., "n = 2" → ["n"], "nums = [1,2,3]" → ["nums"])
        List<String> paramNames = extractParamNames(testInput);
        String paramCall = String.join(", ", paramNames);

        return switch (language) {
            case "python" -> wrapPython(studentCode, functionName, testInput, paramCall);
            case "javascript" -> wrapJavaScript(studentCode, functionName, testInput, paramCall);
            case "java" -> wrapJava(studentCode, functionName, testInput, paramCall);
            default -> studentCode;
        };
    }

    private String wrapPython(String code, String funcName, String testInput, String paramCall) {
        // Replace null with None for Python
        String pyInput = testInput.replace("null", "None").replace("true", "True").replace("false", "False");
        return code + "\n\n# === Auto-generated runner ===\n" + pyInput + "\nprint(" + funcName + "(" + paramCall + "))\n";
    }

    private String wrapJavaScript(String code, String funcName, String testInput, String paramCall) {
        // Prepend each assignment line with 'let '
        StringBuilder jsInput = new StringBuilder();
        for (String line : testInput.split("\n")) {
            line = line.trim();
            if (!line.isEmpty()) {
                jsInput.append("let ").append(line).append(";\n");
            }
        }
        return code + "\n\n// === Auto-generated runner ===\n" + jsInput + "console.log(" + funcName + "(" + paramCall + "));\n";
    }

    private String wrapJava(String code, String funcName, String testInput, String paramCall) {
        // Parse Java initial code to extract method return type and param types
        // For MVP: wrap with a Main class, convert input to typed Java declarations
        StringBuilder javaInput = new StringBuilder();
        for (String line : testInput.split("\n")) {
            line = line.trim();
            if (line.isEmpty()) continue;
            // Extract variable name and value
            int eqIdx = line.indexOf('=');
            if (eqIdx > 0) {
                String varName = line.substring(0, eqIdx).trim();
                String value = line.substring(eqIdx + 1).trim();
                String javaType = inferJavaType(value);
                String javaValue = convertToJavaValue(value, javaType);
                javaInput.append("        ").append(javaType).append(" ").append(varName).append(" = ").append(javaValue).append(";\n");
            }
        }

        // Remove 'public' from Solution class if present (Java allows only one public class)
        String cleanCode = code.replace("public class Solution", "class Solution");

        return "import java.util.*;\n\n" + cleanCode +
            "\n\npublic class Main {\n" +
            "    public static void main(String[] args) {\n" +
            "        Solution sol = new Solution();\n" +
            javaInput +
            "        System.out.println(sol." + funcName + "(" + paramCall + "));\n" +
            "    }\n" +
            "}\n";
    }

    private List<String> extractParamNames(String testInput) {
        List<String> names = new ArrayList<>();
        for (String line : testInput.split("\n")) {
            line = line.trim();
            if (line.isEmpty()) continue;
            int eqIdx = line.indexOf('=');
            if (eqIdx > 0) {
                names.add(line.substring(0, eqIdx).trim());
            }
        }
        return names;
    }

    private String inferJavaType(String value) {
        value = value.trim();
        if (value.startsWith("[")) {
            // Array — check contents
            String inner = value.substring(1, value.length() - 1).trim();
            if (inner.isEmpty()) return "int[]";
            if (inner.contains("\"")) return "String[]";
            if (inner.contains(".")) return "double[]";
            return "int[]";
        }
        if (value.startsWith("\"")) return "String";
        if (value.equals("true") || value.equals("false")) return "boolean";
        if (value.contains(".")) return "double";
        try {
            Long.parseLong(value);
            return "int";
        } catch (NumberFormatException e) {
            return "String";
        }
    }

    private String convertToJavaValue(String value, String type) {
        if (type.endsWith("[]")) {
            // Convert [1,2,3] to new int[]{1,2,3}
            String inner = value.substring(1, value.length() - 1);
            return "new " + type + "{" + inner + "}";
        }
        return value;
    }

    // ─── JDoodle API call ────────────────────────────────────────────

    private String getJDoodleLanguage(String language) {
        return switch (language.toLowerCase()) {
            case "python" -> "python3";
            case "javascript" -> "nodejs";
            case "java" -> "java";
            default -> "python3";
        };
    }

    private String getJDoodleVersionIndex(String language) {
        return switch (language.toLowerCase()) {
            case "python" -> "4"; // Python 3.9.9
            case "javascript" -> "4"; // Node.js 17.1.0
            case "java" -> "4"; // JDK 17.0.1
            default -> "4";
        };
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> callJDoodle(String sourceCode, String language, String stdin) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> body = new HashMap<>();
        body.put("clientId", jdoodleClientId);
        body.put("clientSecret", jdoodleClientSecret);
        body.put("script", sourceCode);
        body.put("language", getJDoodleLanguage(language));
        body.put("versionIndex", getJDoodleVersionIndex(language));
        if (stdin != null && !stdin.isEmpty()) {
            body.put("stdin", stdin);
        }

        try {
            String jsonBody = objectMapper.writeValueAsString(body);
            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);
            ResponseEntity<Map> response = restTemplate.exchange(jdoodleApiUrl, HttpMethod.POST, request, Map.class);
            Map<String, Object> jdoodleResult = response.getBody();

            if (jdoodleResult == null) {
                return Map.of("error", "Empty response from JDoodle");
            }

            // Map JDoodle format back to a Judge0-like structure to keep existing frontend logic working
            Map<String, Object> mappedResult = new HashMap<>();
            
            if (jdoodleResult.get("output") != null) {
                mappedResult.put("stdout", jdoodleResult.get("output"));
            }
            if (jdoodleResult.get("cpuTime") != null) {
                mappedResult.put("time", jdoodleResult.get("cpuTime"));
            }
            if (jdoodleResult.get("memory") != null) {
                mappedResult.put("memory", jdoodleResult.get("memory"));
            }
            
            Map<String, Object> statusMap = new HashMap<>();
            Number statusCode = (Number) jdoodleResult.get("statusCode");
            if (statusCode != null && statusCode.intValue() == 200) {
                 statusMap.put("id", 3); // ACCEPTED maps to 3
            } else {
                 statusMap.put("id", 4); // Fail
                 Object errorObj = jdoodleResult.get("error");
                 if (errorObj != null && !errorObj.toString().trim().isEmpty()) {
                     mappedResult.put("stderr", "JDoodle API Error: " + errorObj);
                 } else if (jdoodleResult.get("output") != null) {
                     mappedResult.remove("stdout");
                     mappedResult.put("stderr", jdoodleResult.get("output"));
                 }
            }
            mappedResult.put("status", statusMap);

            return mappedResult;

        } catch (Exception e) {
            LOG.error("JDoodle API call failed: {}", e.getMessage());
            return Map.of("error", "JDoodle unavailable: " + e.getMessage());
        }
    }

    private SubmissionStatus mapJudge0Status(int statusId) {
        return switch (statusId) {
            case 3 -> SubmissionStatus.ACCEPTED;
            case 4 -> SubmissionStatus.WRONG_ANSWER;
            case 5 -> SubmissionStatus.TIME_LIMIT_EXCEEDED;
            case 6 -> SubmissionStatus.COMPILE_ERROR;
            case 7, 8, 9, 10, 11, 12 -> SubmissionStatus.RUNTIME_ERROR;
            default -> SubmissionStatus.INTERNAL_ERROR;
        };
    }

    // ─── LessonProgress auto-complete ───────────────────────────────

    private void markLessonCompleted(User user, Lesson lesson) {
        // Check if already marked complete
        List<LessonProgress> existing = lessonProgressRepository.findByUserIsCurrentUser();
        boolean alreadyDone = existing.stream()
            .anyMatch(lp -> lp.getLesson() != null && lp.getLesson().getId().equals(lesson.getId()) && Boolean.TRUE.equals(lp.getIsCompleted()));
        if (alreadyDone) return;

        // Find enrollment for this course
        Long courseId = lesson.getSection() != null && lesson.getSection().getCourse() != null
            ? lesson.getSection().getCourse().getId() : null;

        Enrollment enrollment = null;
        if (courseId != null) {
            enrollment = enrollmentRepository.findByUserIsCurrentUser().stream()
                .filter(e -> e.getCourse() != null && e.getCourse().getId().equals(courseId))
                .findFirst().orElse(null);
        }

        // Find existing progress or create new
        LessonProgress progress = existing.stream()
            .filter(lp -> lp.getLesson() != null && lp.getLesson().getId().equals(lesson.getId()))
            .findFirst()
            .orElseGet(() -> {
                LessonProgress lp = new LessonProgress();
                lp.setUser(user);
                lp.setLesson(lesson);
                return lp;
            });

        progress.setIsCompleted(true);
        progress.setCompletedAt(Instant.now());
        if (enrollment != null) progress.setEnrollment(enrollment);
        lessonProgressRepository.save(progress);

        LOG.info("Auto-completed lesson {} for user {}", lesson.getId(), user.getLogin());
    }
}
