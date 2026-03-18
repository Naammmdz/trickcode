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
        RestTemplate restTemplate,
        ObjectMapper objectMapper,
        LessonRepository lessonRepository,
        UserRepository userRepository,
        CodeSubmissionRepository codeSubmissionRepository,
        LessonProgressRepository lessonProgressRepository,
        EnrollmentRepository enrollmentRepository
    ) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
        this.codeSubmissionRepository = codeSubmissionRepository;
        this.lessonProgressRepository = lessonProgressRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // ─── Run Code (no test cases, just execute) ─────────────────────

    public Map<String, Object> runCode(String sourceCode, String language, String stdin) {
        return runCode(sourceCode, language, stdin, null);
    }

    /**
     * Run code with optional lesson context.
     * When lessonId is provided, wraps LeetCode-style code with the first test case
     * so that languages requiring an entry point (e.g. Java) work correctly.
     */
    public Map<String, Object> runCode(String sourceCode, String language, String stdin, Long lessonId) {
        String codeToRun = sourceCode;
        String stdinToUse = stdin != null ? stdin : "";

        if (lessonId != null) {
            try {
                Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
                if (lesson != null && lesson.getCodeChallengeConfig() != null) {
                    JsonNode config = objectMapper.readTree(lesson.getCodeChallengeConfig());
                    String functionName = config.has("functionName") && !config.get("functionName").isNull()
                        ? config.get("functionName").asText() : null;
                    JsonNode testCasesNode = config.get("testCases");

                    // Auto-detect functionName from student code if missing in config
                    if ((functionName == null || functionName.isBlank()) && "java".equals(language)) {
                        functionName = detectJavaFunctionName(sourceCode);
                        LOG.info("Auto-detected functionName from code: {}", functionName);
                    }
                    if ((functionName == null || functionName.isBlank()) && "python".equals(language)) {
                        functionName = detectPythonFunctionName(sourceCode);
                    }
                    if ((functionName == null || functionName.isBlank()) && "javascript".equals(language)) {
                        functionName = detectJSFunctionName(sourceCode);
                    }

                    if (functionName != null && !functionName.isBlank() && testCasesNode != null && testCasesNode.isArray() && testCasesNode.size() > 0) {
                        String firstInput = testCasesNode.get(0).get("input").asText();
                        codeToRun = wrapCode(sourceCode, language, functionName, firstInput);
                        stdinToUse = "";
                    }
                }
            } catch (Exception e) {
                LOG.warn("Could not wrap code for Run with lesson {}: {}", lessonId, e.getMessage(), e);
            }
        }

        return callJDoodle(codeToRun, language, stdinToUse);
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

        String functionName = config.has("functionName") && !config.get("functionName").isNull()
            ? config.get("functionName").asText() : null;
        // Auto-detect if missing
        if (functionName == null || functionName.isBlank()) {
            if ("java".equals(language)) functionName = detectJavaFunctionName(sourceCode);
            else if ("python".equals(language)) functionName = detectPythonFunctionName(sourceCode);
            else if ("javascript".equals(language)) functionName = detectJSFunctionName(sourceCode);
        }
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
                statusId = statusMap.get("id") != null ? Integer.parseInt(statusMap.get("id").toString()) : 0;
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
                int mem = Integer.parseInt(result.get("memory").toString());
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
        String paramCall;
        String normalizedInput = testInput;

        if (paramNames.isEmpty()) {
            // Bare value input (e.g., "[1,2,3,4,5]" without variable name)
            // Detect param names from method signature in student code
            List<String> methodParams = extractMethodParamNames(studentCode, functionName, language);
            if (!methodParams.isEmpty()) {
                // Use actual param names from method signature
                paramNames = methodParams;
                // Build normalized input with param names
                String[] inputLines = testInput.split("\n");
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < Math.min(inputLines.length, paramNames.size()); i++) {
                    if (sb.length() > 0) sb.append("\n");
                    sb.append(paramNames.get(i)).append(" = ").append(inputLines[i].trim());
                }
                normalizedInput = sb.toString();
            } else {
                // Fallback: single arg
                paramNames = List.of("arg0");
                normalizedInput = "arg0 = " + testInput.trim();
            }
        }
        paramCall = String.join(", ", paramNames);

        return switch (language) {
            case "python" -> wrapPython(studentCode, functionName, normalizedInput, paramCall);
            case "javascript" -> wrapJavaScript(studentCode, functionName, normalizedInput, paramCall);
            case "java" -> wrapJava(studentCode, functionName, normalizedInput, paramCall);
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
        boolean usesListNode = code.contains("ListNode");
        boolean usesTreeNode = code.contains("TreeNode");

        // Parse method signature to extract return type and param types
        String returnType = "";
        Map<String, String> paramTypes = new java.util.LinkedHashMap<>();
        for (String line : code.split("\n")) {
            String t = line.trim();
            if (t.contains(funcName) && t.contains("(") && t.contains(")")
                && !t.startsWith("//") && !t.startsWith("*")) {
                int fi = t.indexOf(funcName);
                String before = t.substring(0, fi).trim();
                String[] words = before.split("\\s+");
                if (words.length > 0) returnType = words[words.length - 1];
                int ps = t.indexOf('(', fi);
                int pe = t.indexOf(')', ps);
                if (ps >= 0 && pe > ps) {
                    String params = t.substring(ps + 1, pe).trim();
                    if (!params.isEmpty()) {
                        for (String p : params.split(",")) {
                            String[] parts = p.trim().split("\\s+");
                            if (parts.length >= 2)
                                paramTypes.put(parts[parts.length - 1], parts[parts.length - 2]);
                        }
                    }
                }
                break;
            }
        }

        String cleanCode = code.replace("public class Solution", "class Solution");
        // Remove outer "class Solution { ... }" wrapper, keep only the method body
        // We'll put Solution as a static inner class of Main

        StringBuilder sb = new StringBuilder();
        sb.append("import java.util.*;\n\n");
        sb.append("public class Main {\n\n");

        // Inject LeetCode helper classes as static inner classes
        if (usesListNode) {
            sb.append("    static class ListNode {\n")
              .append("        int val;\n")
              .append("        ListNode next;\n")
              .append("        ListNode() {}\n")
              .append("        ListNode(int val) { this.val = val; }\n")
              .append("        ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n")
              .append("    }\n\n");
        }
        if (usesTreeNode) {
            sb.append("    static class TreeNode {\n")
              .append("        int val;\n")
              .append("        TreeNode left;\n")
              .append("        TreeNode right;\n")
              .append("        TreeNode() {}\n")
              .append("        TreeNode(int val) { this.val = val; }\n")
              .append("        TreeNode(int val, TreeNode left, TreeNode right) {\n")
              .append("            this.val = val; this.left = left; this.right = right;\n")
              .append("        }\n")
              .append("    }\n\n");
        }

        // Embed Solution as static inner class
        // Replace "class Solution" with "static class Solution"
        String innerSolution = cleanCode.replace("class Solution", "static class Solution");
        // Indent each line by 4 spaces
        for (String solLine : innerSolution.split("\n")) {
            sb.append("    ").append(solLine).append("\n");
        }

        sb.append("\n");

        // Helper conversion methods
        if (usesListNode) {
            sb.append("    static ListNode toList(int[] a) {\n")
              .append("        if (a.length == 0) return null;\n")
              .append("        ListNode d = new ListNode(0), c = d;\n")
              .append("        for (int v : a) { c.next = new ListNode(v); c = c.next; }\n")
              .append("        return d.next;\n")
              .append("    }\n");
            sb.append("    static String fromList(ListNode n) {\n")
              .append("        if (n == null) return \"[]\";\n")
              .append("        StringBuilder s = new StringBuilder(\"[\");\n")
              .append("        while (n != null) { if (s.length() > 1) s.append(\",\"); s.append(n.val); n = n.next; }\n")
              .append("        return s.append(\"]\").toString();\n")
              .append("    }\n");
        }
        if (usesTreeNode) {
            sb.append("    static TreeNode toTree(String[] a) {\n")
              .append("        if (a.length == 0 || a[0].equals(\"null\")) return null;\n")
              .append("        TreeNode root = new TreeNode(Integer.parseInt(a[0]));\n")
              .append("        Queue<TreeNode> q = new LinkedList<>(); q.add(root);\n")
              .append("        int i = 1;\n")
              .append("        while (!q.isEmpty() && i < a.length) {\n")
              .append("            TreeNode cur = q.poll();\n")
              .append("            if (i < a.length && !a[i].equals(\"null\")) { cur.left = new TreeNode(Integer.parseInt(a[i])); q.add(cur.left); } i++;\n")
              .append("            if (i < a.length && !a[i].equals(\"null\")) { cur.right = new TreeNode(Integer.parseInt(a[i])); q.add(cur.right); } i++;\n")
              .append("        }\n")
              .append("        return root;\n")
              .append("    }\n");
            sb.append("    static String fromTree(TreeNode root) {\n")
              .append("        if (root == null) return \"[]\";\n")
              .append("        List<String> res = new ArrayList<>();\n")
              .append("        Queue<TreeNode> q = new LinkedList<>(); q.add(root);\n")
              .append("        while (!q.isEmpty()) {\n")
              .append("            TreeNode n = q.poll();\n")
              .append("            if (n == null) { res.add(\"null\"); continue; }\n")
              .append("            res.add(String.valueOf(n.val));\n")
              .append("            q.add(n.left); q.add(n.right);\n")
              .append("        }\n")
              .append("        while (res.size() > 0 && res.get(res.size()-1).equals(\"null\")) res.remove(res.size()-1);\n")
              .append("        return \"[\" + String.join(\",\", res) + \"]\";\n")
              .append("    }\n");
        }

        sb.append("\n    public static void main(String[] args) {\n");
        sb.append("        Solution sol = new Solution();\n");

        // Build variable declarations with type-aware conversion
        for (String line : testInput.split("\n")) {
            line = line.trim();
            if (line.isEmpty()) continue;
            int eqIdx = line.indexOf('=');
            if (eqIdx > 0) {
                String varName = line.substring(0, eqIdx).trim();
                String value = line.substring(eqIdx + 1).trim();
                String declaredType = paramTypes.get(varName);

                if ("ListNode".equals(declaredType)) {
                    if (value.equals("[]") || value.equals("null")) {
                        sb.append("        ListNode ").append(varName).append(" = null;\n");
                    } else {
                        sb.append("        ListNode ").append(varName).append(" = toList(new int[]")
                          .append(value.replace("[", "{").replace("]", "}"))
                          .append(");\n");
                    }
                } else if ("TreeNode".equals(declaredType)) {
                    if (value.equals("[]") || value.equals("null")) {
                        sb.append("        TreeNode ").append(varName).append(" = null;\n");
                    } else {
                        // Convert [1,null,2,3] to String array for BFS construction
                        String inner = value.substring(1, value.length() - 1);
                        sb.append("        TreeNode ").append(varName).append(" = toTree(new String[]{");
                        for (String item : inner.split(",")) {
                            sb.append("\"").append(item.trim()).append("\",");
                        }
                        sb.setLength(sb.length() - 1); // remove trailing comma
                        sb.append("});\n");
                    }
                } else {
                    String javaType = inferJavaType(value);
                    String javaValue = convertToJavaValue(value, javaType);
                    sb.append("        ").append(javaType).append(" ").append(varName)
                      .append(" = ").append(javaValue).append(";\n");
                }
            }
        }

        // Print result with proper type conversion
        String call = "sol." + funcName + "(" + paramCall + ")";
        if ("ListNode".equals(returnType)) {
            sb.append("        System.out.println(fromList(").append(call).append("));\n");
        } else if ("TreeNode".equals(returnType)) {
            sb.append("        System.out.println(fromTree(").append(call).append("));\n");
        } else if (returnType.endsWith("[][]")) {
            sb.append("        System.out.println(Arrays.deepToString(").append(call).append(").replace(\" \", \"\"));\n");
        } else if (returnType.endsWith("[]")) {
            sb.append("        System.out.println(Arrays.toString(").append(call).append(").replace(\" \", \"\"));\n");
        } else {
            sb.append("        System.out.println(").append(call).append(");\n");
        }

        sb.append("    }\n");
        sb.append("}\n");
        return sb.toString();
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

    /**
     * Extract parameter names from the method signature in student code.
     * E.g., "public ListNode reverseList(ListNode head)" → ["head"]
     */
    private List<String> extractMethodParamNames(String code, String funcName, String language) {
        List<String> names = new ArrayList<>();
        if ("java".equals(language)) {
            for (String line : code.split("\n")) {
                String t = line.trim();
                if (t.contains(funcName) && t.contains("(") && t.contains(")")
                    && !t.startsWith("//") && !t.startsWith("*")) {
                    int ps = t.indexOf('(');
                    int pe = t.indexOf(')', ps);
                    if (ps >= 0 && pe > ps) {
                        String params = t.substring(ps + 1, pe).trim();
                        if (!params.isEmpty()) {
                            for (String p : params.split(",")) {
                                String[] parts = p.trim().split("\\s+");
                                if (parts.length >= 2) names.add(parts[parts.length - 1]);
                            }
                        }
                    }
                    break;
                }
            }
        } else if ("python".equals(language)) {
            for (String line : code.split("\n")) {
                String t = line.trim();
                if (t.startsWith("def " + funcName) && t.contains("(") && t.contains(")")) {
                    int ps = t.indexOf('(');
                    int pe = t.indexOf(')', ps);
                    String params = t.substring(ps + 1, pe).trim();
                    for (String p : params.split(",")) {
                        String name = p.trim().split(":")[0].trim().split("=")[0].trim();
                        if (!name.isEmpty() && !name.equals("self")) names.add(name);
                    }
                    break;
                }
            }
        } else if ("javascript".equals(language)) {
            for (String line : code.split("\n")) {
                String t = line.trim();
                if (t.contains(funcName) && t.contains("(") && t.contains(")")) {
                    int ps = t.indexOf('(');
                    int pe = t.indexOf(')', ps);
                    String params = t.substring(ps + 1, pe).trim();
                    for (String p : params.split(",")) {
                        String name = p.trim().split("=")[0].trim();
                        if (!name.isEmpty()) names.add(name);
                    }
                    break;
                }
            }
        }
        return names;
    }

    private String inferJavaType(String value) {
        value = value.trim();
        if (value.equals("null")) return "String";
        if (value.startsWith("[")) {
            // Array — check contents
            String inner = value.substring(1, value.length() - 1).trim();
            if (inner.isEmpty()) return "int[]";
            if (inner.contains("\"")) return "String[]";
            if (inner.contains("'")) return "char[]";
            if (inner.contains(".")) return "double[]";
            // Check if any element exceeds int range
            try {
                for (String item : inner.split(",")) {
                    long val = Long.parseLong(item.trim());
                    if (val > Integer.MAX_VALUE || val < Integer.MIN_VALUE) return "long[]";
                }
            } catch (NumberFormatException ignored) {}
            return "int[]";
        }
        if (value.startsWith("\"")) return "String";
        if (value.startsWith("'") && value.endsWith("'") && value.length() == 3) return "char";
        if (value.equals("true") || value.equals("false")) return "boolean";
        if (value.contains(".")) return "double";
        try {
            long parsed = Long.parseLong(value);
            if (parsed > Integer.MAX_VALUE || parsed < Integer.MIN_VALUE) return "long";
            return "int";
        } catch (NumberFormatException e) {
            return "String";
        }
    }

    private String convertToJavaValue(String value, String type) {
        if (value.trim().equals("null")) return "null";
        if (type.equals("char")) {
            // 'a' → 'a' (already valid Java)
            return value.trim();
        }
        if (type.endsWith("[]")) {
            // Convert [1,2,3] to new int[]{1,2,3}
            String inner = value.substring(1, value.length() - 1);
            return "new " + type + "{" + inner + "}";
        }
        if (type.equals("long")) {
            return value.trim() + "L";
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
                throw new IllegalStateException("Empty response from JDoodle");
            }

            // Map JDoodle format back to a Judge0-like structure to keep existing frontend logic working
            Map<String, Object> mappedResult = new HashMap<>();
            String output = jdoodleResult.get("output") != null ? jdoodleResult.get("output").toString() : "";

            if (jdoodleResult.get("cpuTime") != null) {
                mappedResult.put("time", jdoodleResult.get("cpuTime"));
            }
            if (jdoodleResult.get("memory") != null) {
                mappedResult.put("memory", jdoodleResult.get("memory"));
            }

            Map<String, Object> statusMap = new HashMap<>();
            Number statusCode = (Number) jdoodleResult.get("statusCode");

            if (statusCode != null && statusCode.intValue() == 200) {
                // JDoodle returns 200 for successful API calls, but output may contain errors
                // Detect compile/runtime errors from output content
                if (isCompileError(output, language)) {
                    statusMap.put("id", 6); // COMPILE_ERROR
                    mappedResult.put("compile_output", output);
                } else if (isRuntimeError(output, language)) {
                    statusMap.put("id", 7); // RUNTIME_ERROR
                    mappedResult.put("stderr", output);
                } else {
                    statusMap.put("id", 3); // ACCEPTED (ran successfully)
                    mappedResult.put("stdout", output);
                }
            } else {
                statusMap.put("id", 4); // API-level failure
                Object errorObj = jdoodleResult.get("error");
                if (errorObj != null && !errorObj.toString().trim().isEmpty()) {
                    mappedResult.put("stderr", "JDoodle API Error: " + errorObj);
                } else {
                    mappedResult.put("stderr", output);
                }
            }
            mappedResult.put("status", statusMap);

            return mappedResult;

        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            LOG.error("JDoodle API call failed: {}", e.getMessage());
            throw new IllegalStateException("JDoodle unavailable: " + e.getMessage(), e);
        }
    }

    private boolean isCompileError(String output, String language) {
        if (output == null || output.isBlank()) return false;
        String lower = output.toLowerCase();
        return switch (language.toLowerCase()) {
            case "java" -> lower.contains("error:") && (lower.contains(".java:") || lower.contains("cannot find symbol")
                || lower.contains("class, interface") || lower.contains("illegal start"));
            case "python" -> lower.contains("syntaxerror:") || lower.contains("indentationerror:");
            case "javascript" -> lower.contains("syntaxerror:");
            default -> false;
        };
    }

    private boolean isRuntimeError(String output, String language) {
        if (output == null || output.isBlank()) return false;
        String lower = output.toLowerCase();
        return switch (language.toLowerCase()) {
            case "java" -> lower.contains("exception in thread") || lower.contains("at java.")
                || lower.contains("at com.") || lower.contains("nullpointerexception");
            case "python" -> lower.contains("traceback (most recent call last)") || lower.contains("error:")
                && !lower.contains("syntaxerror:") && !lower.contains("indentationerror:");
            case "javascript" -> (lower.contains("typeerror:") || lower.contains("referenceerror:")
                || lower.contains("rangeerror:")) && !lower.contains("syntaxerror:");
            default -> false;
        };
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

    /**
     * Auto-detect function name from Java code by finding the first public method in Solution class.
     * Pattern: public ReturnType methodName(...)
     */
    private String detectJavaFunctionName(String code) {
        for (String line : code.split("\n")) {
            String t = line.trim();
            if (t.startsWith("public ") && t.contains("(") && !t.contains("class ")) {
                // e.g. "public ListNode reverseList(ListNode head) {"
                int parenIdx = t.indexOf('(');
                String beforeParen = t.substring(0, parenIdx).trim();
                String[] words = beforeParen.split("\\s+");
                if (words.length >= 2) {
                    return words[words.length - 1]; // last word before ( is the method name
                }
            }
        }
        return null;
    }

    /**
     * Auto-detect function name from Python code.
     * Pattern: def functionName(...)
     */
    private String detectPythonFunctionName(String code) {
        for (String line : code.split("\n")) {
            String t = line.trim();
            if (t.startsWith("def ") && t.contains("(")) {
                int defEnd = 4; // after "def "
                int parenIdx = t.indexOf('(');
                return t.substring(defEnd, parenIdx).trim();
            }
        }
        return null;
    }

    /**
     * Auto-detect function name from JavaScript code.
     * Pattern: function functionName(...) or const functionName = ...
     */
    private String detectJSFunctionName(String code) {
        for (String line : code.split("\n")) {
            String t = line.trim();
            if (t.startsWith("function ") && t.contains("(")) {
                int start = 9; // after "function "
                int parenIdx = t.indexOf('(');
                return t.substring(start, parenIdx).trim();
            }
            if (t.startsWith("var ") || t.startsWith("let ") || t.startsWith("const ")) {
                int eqIdx = t.indexOf('=');
                if (eqIdx > 0) {
                    String varPart = t.substring(t.indexOf(' ') + 1, eqIdx).trim();
                    if (t.contains("function") || t.contains("=>")) {
                        return varPart;
                    }
                }
            }
        }
        return null;
    }
}
