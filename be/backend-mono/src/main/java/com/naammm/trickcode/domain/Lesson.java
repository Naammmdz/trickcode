package com.naammm.trickcode.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.naammm.trickcode.domain.enumeration.LessonType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Lesson.
 */
@Entity
@Table(name = "lesson")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Lesson implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private LessonType type;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "is_preview")
    private Boolean isPreview;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "caption_url")
    private String captionUrl;

    @Lob
    @Column(name = "markdown_content")
    private String markdownContent;

    @Lob
    @Column(name = "quiz_config")
    private String quizConfig;

    @Lob
    @Column(name = "code_challenge_config")
    private String codeChallengeConfig;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "lessons", "course" }, allowSetters = true)
    private Section section;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Lesson id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Lesson title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LessonType getType() {
        return this.type;
    }

    public Lesson type(LessonType type) {
        this.setType(type);
        return this;
    }

    public void setType(LessonType type) {
        this.type = type;
    }

    public Integer getOrderIndex() {
        return this.orderIndex;
    }

    public Lesson orderIndex(Integer orderIndex) {
        this.setOrderIndex(orderIndex);
        return this;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Integer getDurationSeconds() {
        return this.durationSeconds;
    }

    public Lesson durationSeconds(Integer durationSeconds) {
        this.setDurationSeconds(durationSeconds);
        return this;
    }

    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public Boolean getIsPreview() {
        return this.isPreview;
    }

    public Lesson isPreview(Boolean isPreview) {
        this.setIsPreview(isPreview);
        return this;
    }

    public void setIsPreview(Boolean isPreview) {
        this.isPreview = isPreview;
    }

    public String getVideoUrl() {
        return this.videoUrl;
    }

    public Lesson videoUrl(String videoUrl) {
        this.setVideoUrl(videoUrl);
        return this;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getCaptionUrl() {
        return this.captionUrl;
    }

    public Lesson captionUrl(String captionUrl) {
        this.setCaptionUrl(captionUrl);
        return this;
    }

    public void setCaptionUrl(String captionUrl) {
        this.captionUrl = captionUrl;
    }

    public String getMarkdownContent() {
        return this.markdownContent;
    }

    public Lesson markdownContent(String markdownContent) {
        this.setMarkdownContent(markdownContent);
        return this;
    }

    public void setMarkdownContent(String markdownContent) {
        this.markdownContent = markdownContent;
    }

    public String getQuizConfig() {
        return this.quizConfig;
    }

    public Lesson quizConfig(String quizConfig) {
        this.setQuizConfig(quizConfig);
        return this;
    }

    public void setQuizConfig(String quizConfig) {
        this.quizConfig = quizConfig;
    }

    public String getCodeChallengeConfig() {
        return this.codeChallengeConfig;
    }

    public Lesson codeChallengeConfig(String codeChallengeConfig) {
        this.setCodeChallengeConfig(codeChallengeConfig);
        return this;
    }

    public void setCodeChallengeConfig(String codeChallengeConfig) {
        this.codeChallengeConfig = codeChallengeConfig;
    }

    public Section getSection() {
        return this.section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public Lesson section(Section section) {
        this.setSection(section);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Lesson)) {
            return false;
        }
        return getId() != null && getId().equals(((Lesson) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Lesson{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", type='" + getType() + "'" +
            ", orderIndex=" + getOrderIndex() +
            ", durationSeconds=" + getDurationSeconds() +
            ", isPreview='" + getIsPreview() + "'" +
            ", videoUrl='" + getVideoUrl() + "'" +
            ", captionUrl='" + getCaptionUrl() + "'" +
            ", markdownContent='" + getMarkdownContent() + "'" +
            ", quizConfig='" + getQuizConfig() + "'" +
            ", codeChallengeConfig='" + getCodeChallengeConfig() + "'" +
            "}";
    }
}
