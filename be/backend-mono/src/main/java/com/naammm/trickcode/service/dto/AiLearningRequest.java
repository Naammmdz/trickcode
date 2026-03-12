package com.naammm.trickcode.service.dto;

import jakarta.validation.constraints.*;

public class AiLearningRequest {

    @NotNull(message = "type is required")
    @Pattern(regexp = "^(code-hint|explain-fail|ask-code|ask-quiz)$", message = "type must be code-hint, explain-fail, ask-code, or ask-quiz")
    private String type;

    private Long lessonId;

    @Size(max = 10000, message = "sourceCode must not exceed 10000 characters")
    private String sourceCode;

    @Size(max = 50, message = "language must not exceed 50 characters")
    private String language;

    @Size(max = 2000, message = "question must not exceed 2000 characters")
    private String question;

    // For explain-fail
    @Size(max = 500)
    private String testInput;
    @Size(max = 500)
    private String expectedOutput;
    @Size(max = 500)
    private String actualOutput;

    // For ask-quiz
    @Size(max = 1000)
    private String quizQuestion;
    @Size(max = 500)
    private String studentAnswer;
    @Size(max = 500)
    private String correctAnswer;

    // ─── Getters / Setters ──────────────────────────────────────────

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getLessonId() { return lessonId; }
    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getTestInput() { return testInput; }
    public void setTestInput(String testInput) { this.testInput = testInput; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public String getActualOutput() { return actualOutput; }
    public void setActualOutput(String actualOutput) { this.actualOutput = actualOutput; }

    public String getQuizQuestion() { return quizQuestion; }
    public void setQuizQuestion(String quizQuestion) { this.quizQuestion = quizQuestion; }

    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
}
