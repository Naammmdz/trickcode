package com.naammm.trickcode.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.naammm.trickcode.domain.enumeration.SubmissionStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CodeSubmission — tracks each student code submission against a lesson.
 */
@Entity
@Table(name = "code_submission", indexes = {
    @Index(name = "idx_code_sub_user_lesson", columnList = "user_id, lesson_id"),
    @Index(name = "idx_code_sub_user", columnList = "user_id"),
})
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CodeSubmission implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "language", nullable = false, length = 30)
    private String language;

    @Lob
    @Column(name = "source_code", nullable = false)
    private String sourceCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30)
    private SubmissionStatus status;

    @Column(name = "tests_passed")
    private Integer testsPassed;

    @Column(name = "tests_total")
    private Integer testsTotal;

    @Column(name = "execution_time")
    private Double executionTime;

    @Column(name = "memory_used")
    private Integer memoryUsed;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "section" }, allowSetters = true)
    private Lesson lesson;

    // ─── Getters / Setters ──────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getSourceCode() { return sourceCode; }
    public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }

    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }

    public Integer getTestsPassed() { return testsPassed; }
    public void setTestsPassed(Integer testsPassed) { this.testsPassed = testsPassed; }

    public Integer getTestsTotal() { return testsTotal; }
    public void setTestsTotal(Integer testsTotal) { this.testsTotal = testsTotal; }

    public Double getExecutionTime() { return executionTime; }
    public void setExecutionTime(Double executionTime) { this.executionTime = executionTime; }

    public Integer getMemoryUsed() { return memoryUsed; }
    public void setMemoryUsed(Integer memoryUsed) { this.memoryUsed = memoryUsed; }

    public Instant getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Lesson getLesson() { return lesson; }
    public void setLesson(Lesson lesson) { this.lesson = lesson; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CodeSubmission)) return false;
        return getId() != null && getId().equals(((CodeSubmission) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "CodeSubmission{" +
            "id=" + id +
            ", language='" + language + '\'' +
            ", status=" + status +
            ", testsPassed=" + testsPassed +
            ", testsTotal=" + testsTotal +
            ", executionTime=" + executionTime +
            ", memoryUsed=" + memoryUsed +
            ", submittedAt=" + submittedAt +
            '}';
    }
}
