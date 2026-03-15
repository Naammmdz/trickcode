package com.naammm.trickcode.service.dto;

import jakarta.validation.constraints.*;

public class GenerateQuizRequest {

    @Size(max = 200, message = "courseTitle must not exceed 200 characters")
    private String courseTitle = "";

    @Size(max = 2000, message = "courseDescription must not exceed 2000 characters")
    private String courseDescription = "";

    @Size(max = 200, message = "lessonTitle must not exceed 200 characters")
    private String lessonTitle = "";

    @Size(max = 2000, message = "customPrompt must not exceed 2000 characters")
    private String customPrompt = "";

    @Min(value = 1, message = "questionCount must be at least 1")
    @Max(value = 20, message = "questionCount must not exceed 20")
    private int questionCount = 5;

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

    public int getQuestionCount() { return questionCount; }
    public void setQuestionCount(int questionCount) { this.questionCount = questionCount; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
