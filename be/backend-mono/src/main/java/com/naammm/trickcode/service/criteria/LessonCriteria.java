package com.naammm.trickcode.service.criteria;

import com.naammm.trickcode.domain.enumeration.LessonType;
import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.naammm.trickcode.domain.Lesson} entity. This class is used
 * in {@link com.naammm.trickcode.web.rest.LessonResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /lessons?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LessonCriteria implements Serializable, Criteria {

    /**
     * Class for filtering LessonType
     */
    public static class LessonTypeFilter extends Filter<LessonType> {

        public LessonTypeFilter() {}

        public LessonTypeFilter(LessonTypeFilter filter) {
            super(filter);
        }

        @Override
        public LessonTypeFilter copy() {
            return new LessonTypeFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter title;

    private LessonTypeFilter type;

    private IntegerFilter orderIndex;

    private IntegerFilter durationSeconds;

    private BooleanFilter isPreview;

    private StringFilter videoUrl;

    private StringFilter captionUrl;

    private LongFilter sectionId;

    private Boolean distinct;

    public LessonCriteria() {}

    public LessonCriteria(LessonCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.title = other.optionalTitle().map(StringFilter::copy).orElse(null);
        this.type = other.optionalType().map(LessonTypeFilter::copy).orElse(null);
        this.orderIndex = other.optionalOrderIndex().map(IntegerFilter::copy).orElse(null);
        this.durationSeconds = other.optionalDurationSeconds().map(IntegerFilter::copy).orElse(null);
        this.isPreview = other.optionalIsPreview().map(BooleanFilter::copy).orElse(null);
        this.videoUrl = other.optionalVideoUrl().map(StringFilter::copy).orElse(null);
        this.captionUrl = other.optionalCaptionUrl().map(StringFilter::copy).orElse(null);
        this.sectionId = other.optionalSectionId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public LessonCriteria copy() {
        return new LessonCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public Optional<LongFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public LongFilter id() {
        if (id == null) {
            setId(new LongFilter());
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getTitle() {
        return title;
    }

    public Optional<StringFilter> optionalTitle() {
        return Optional.ofNullable(title);
    }

    public StringFilter title() {
        if (title == null) {
            setTitle(new StringFilter());
        }
        return title;
    }

    public void setTitle(StringFilter title) {
        this.title = title;
    }

    public LessonTypeFilter getType() {
        return type;
    }

    public Optional<LessonTypeFilter> optionalType() {
        return Optional.ofNullable(type);
    }

    public LessonTypeFilter type() {
        if (type == null) {
            setType(new LessonTypeFilter());
        }
        return type;
    }

    public void setType(LessonTypeFilter type) {
        this.type = type;
    }

    public IntegerFilter getOrderIndex() {
        return orderIndex;
    }

    public Optional<IntegerFilter> optionalOrderIndex() {
        return Optional.ofNullable(orderIndex);
    }

    public IntegerFilter orderIndex() {
        if (orderIndex == null) {
            setOrderIndex(new IntegerFilter());
        }
        return orderIndex;
    }

    public void setOrderIndex(IntegerFilter orderIndex) {
        this.orderIndex = orderIndex;
    }

    public IntegerFilter getDurationSeconds() {
        return durationSeconds;
    }

    public Optional<IntegerFilter> optionalDurationSeconds() {
        return Optional.ofNullable(durationSeconds);
    }

    public IntegerFilter durationSeconds() {
        if (durationSeconds == null) {
            setDurationSeconds(new IntegerFilter());
        }
        return durationSeconds;
    }

    public void setDurationSeconds(IntegerFilter durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public BooleanFilter getIsPreview() {
        return isPreview;
    }

    public Optional<BooleanFilter> optionalIsPreview() {
        return Optional.ofNullable(isPreview);
    }

    public BooleanFilter isPreview() {
        if (isPreview == null) {
            setIsPreview(new BooleanFilter());
        }
        return isPreview;
    }

    public void setIsPreview(BooleanFilter isPreview) {
        this.isPreview = isPreview;
    }

    public StringFilter getVideoUrl() {
        return videoUrl;
    }

    public Optional<StringFilter> optionalVideoUrl() {
        return Optional.ofNullable(videoUrl);
    }

    public StringFilter videoUrl() {
        if (videoUrl == null) {
            setVideoUrl(new StringFilter());
        }
        return videoUrl;
    }

    public void setVideoUrl(StringFilter videoUrl) {
        this.videoUrl = videoUrl;
    }

    public StringFilter getCaptionUrl() {
        return captionUrl;
    }

    public Optional<StringFilter> optionalCaptionUrl() {
        return Optional.ofNullable(captionUrl);
    }

    public StringFilter captionUrl() {
        if (captionUrl == null) {
            setCaptionUrl(new StringFilter());
        }
        return captionUrl;
    }

    public void setCaptionUrl(StringFilter captionUrl) {
        this.captionUrl = captionUrl;
    }

    public LongFilter getSectionId() {
        return sectionId;
    }

    public Optional<LongFilter> optionalSectionId() {
        return Optional.ofNullable(sectionId);
    }

    public LongFilter sectionId() {
        if (sectionId == null) {
            setSectionId(new LongFilter());
        }
        return sectionId;
    }

    public void setSectionId(LongFilter sectionId) {
        this.sectionId = sectionId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public Optional<Boolean> optionalDistinct() {
        return Optional.ofNullable(distinct);
    }

    public Boolean distinct() {
        if (distinct == null) {
            setDistinct(true);
        }
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final LessonCriteria that = (LessonCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(title, that.title) &&
            Objects.equals(type, that.type) &&
            Objects.equals(orderIndex, that.orderIndex) &&
            Objects.equals(durationSeconds, that.durationSeconds) &&
            Objects.equals(isPreview, that.isPreview) &&
            Objects.equals(videoUrl, that.videoUrl) &&
            Objects.equals(captionUrl, that.captionUrl) &&
            Objects.equals(sectionId, that.sectionId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, type, orderIndex, durationSeconds, isPreview, videoUrl, captionUrl, sectionId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LessonCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalTitle().map(f -> "title=" + f + ", ").orElse("") +
            optionalType().map(f -> "type=" + f + ", ").orElse("") +
            optionalOrderIndex().map(f -> "orderIndex=" + f + ", ").orElse("") +
            optionalDurationSeconds().map(f -> "durationSeconds=" + f + ", ").orElse("") +
            optionalIsPreview().map(f -> "isPreview=" + f + ", ").orElse("") +
            optionalVideoUrl().map(f -> "videoUrl=" + f + ", ").orElse("") +
            optionalCaptionUrl().map(f -> "captionUrl=" + f + ", ").orElse("") +
            optionalSectionId().map(f -> "sectionId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
