package com.naammm.trickcode.service.dto;

import jakarta.validation.constraints.*;

public class GenerateCodeRequest {

    @Size(max = 200, message = "courseTitle must not exceed 200 characters")
    private String courseTitle = "";

    @Size(max = 2000, message = "courseDescription must not exceed 2000 characters")
    private String courseDescription = "";

    @Size(max = 200, message = "lessonTitle must not exceed 200 characters")
    private String lessonTitle = "";

    @Size(max = 2000, message = "customPrompt must not exceed 2000 characters")
    private String customPrompt = "";

    @Min(value = 1, message = "testCaseCount must be at least 1")
    @Max(value = 10, message = "testCaseCount must not exceed 10")
    private int testCaseCount = 3;

    @Pattern(regexp = "^(vi|en)$", message = "language must be 'vi' or 'en'")
    private String language = "vi";

    // ─── Getters / Setters ──────────────────────────────────────────

    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }

    public String getCourseDescription() { return courseDescription; }
    public void setCourseDescription(String courseDescription) { this.courseDescription = courseDescription; }

    public String getLessonTitle() { return lessonTitle; }
    public void setLessonTitle(String lessonTitle) { this.lessonTitle = lessonTitle; }

    public String getCustomPrompt() { return customPrompt; }
    public void setCustomPrompt(String customPrompt) { this.customPrompt = customPrompt; }

    public int getTestCaseCount() { return testCaseCount; }
    public void setTestCaseCount(int testCaseCount) { this.testCaseCount = testCaseCount; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
