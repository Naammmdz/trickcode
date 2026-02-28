package com.naammm.trickcode.service.criteria;

import com.naammm.trickcode.domain.enumeration.CourseLevel;
import com.naammm.trickcode.domain.enumeration.CourseStatus;
import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.naammm.trickcode.domain.Course} entity. This class is used
 * in {@link com.naammm.trickcode.web.rest.CourseResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /courses?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CourseCriteria implements Serializable, Criteria {

    /**
     * Class for filtering CourseLevel
     */
    public static class CourseLevelFilter extends Filter<CourseLevel> {

        public CourseLevelFilter() {}

        public CourseLevelFilter(CourseLevelFilter filter) {
            super(filter);
        }

        @Override
        public CourseLevelFilter copy() {
            return new CourseLevelFilter(this);
        }
    }

    /**
     * Class for filtering CourseStatus
     */
    public static class CourseStatusFilter extends Filter<CourseStatus> {

        public CourseStatusFilter() {}

        public CourseStatusFilter(CourseStatusFilter filter) {
            super(filter);
        }

        @Override
        public CourseStatusFilter copy() {
            return new CourseStatusFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter title;

    private BigDecimalFilter price;

    private BigDecimalFilter oldPrice;

    private CourseLevelFilter level;

    private CourseStatusFilter status;

    private StringFilter thumbnailUrl;

    private StringFilter videoPreviewUrl;

    private StringFilter rejectionReason;

    private InstantFilter createdAt;

    private InstantFilter updatedAt;

    private InstantFilter publishedAt;

    private LongFilter sectionsId;

    private LongFilter instructorId;

    private LongFilter categoriesId;

    private Boolean distinct;

    public CourseCriteria() {}

    public CourseCriteria(CourseCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.title = other.optionalTitle().map(StringFilter::copy).orElse(null);
        this.price = other.optionalPrice().map(BigDecimalFilter::copy).orElse(null);
        this.oldPrice = other.optionalOldPrice().map(BigDecimalFilter::copy).orElse(null);
        this.level = other.optionalLevel().map(CourseLevelFilter::copy).orElse(null);
        this.status = other.optionalStatus().map(CourseStatusFilter::copy).orElse(null);
        this.thumbnailUrl = other.optionalThumbnailUrl().map(StringFilter::copy).orElse(null);
        this.videoPreviewUrl = other.optionalVideoPreviewUrl().map(StringFilter::copy).orElse(null);
        this.rejectionReason = other.optionalRejectionReason().map(StringFilter::copy).orElse(null);
        this.createdAt = other.optionalCreatedAt().map(InstantFilter::copy).orElse(null);
        this.updatedAt = other.optionalUpdatedAt().map(InstantFilter::copy).orElse(null);
        this.publishedAt = other.optionalPublishedAt().map(InstantFilter::copy).orElse(null);
        this.sectionsId = other.optionalSectionsId().map(LongFilter::copy).orElse(null);
        this.instructorId = other.optionalInstructorId().map(LongFilter::copy).orElse(null);
        this.categoriesId = other.optionalCategoriesId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public CourseCriteria copy() {
        return new CourseCriteria(this);
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

    public BigDecimalFilter getPrice() {
        return price;
    }

    public Optional<BigDecimalFilter> optionalPrice() {
        return Optional.ofNullable(price);
    }

    public BigDecimalFilter price() {
        if (price == null) {
            setPrice(new BigDecimalFilter());
        }
        return price;
    }

    public void setPrice(BigDecimalFilter price) {
        this.price = price;
    }

    public BigDecimalFilter getOldPrice() {
        return oldPrice;
    }

    public Optional<BigDecimalFilter> optionalOldPrice() {
        return Optional.ofNullable(oldPrice);
    }

    public BigDecimalFilter oldPrice() {
        if (oldPrice == null) {
            setOldPrice(new BigDecimalFilter());
        }
        return oldPrice;
    }

    public void setOldPrice(BigDecimalFilter oldPrice) {
        this.oldPrice = oldPrice;
    }

    public CourseLevelFilter getLevel() {
        return level;
    }

    public Optional<CourseLevelFilter> optionalLevel() {
        return Optional.ofNullable(level);
    }

    public CourseLevelFilter level() {
        if (level == null) {
            setLevel(new CourseLevelFilter());
        }
        return level;
    }

    public void setLevel(CourseLevelFilter level) {
        this.level = level;
    }

    public CourseStatusFilter getStatus() {
        return status;
    }

    public Optional<CourseStatusFilter> optionalStatus() {
        return Optional.ofNullable(status);
    }

    public CourseStatusFilter status() {
        if (status == null) {
            setStatus(new CourseStatusFilter());
        }
        return status;
    }

    public void setStatus(CourseStatusFilter status) {
        this.status = status;
    }

    public StringFilter getThumbnailUrl() {
        return thumbnailUrl;
    }

    public Optional<StringFilter> optionalThumbnailUrl() {
        return Optional.ofNullable(thumbnailUrl);
    }

    public StringFilter thumbnailUrl() {
        if (thumbnailUrl == null) {
            setThumbnailUrl(new StringFilter());
        }
        return thumbnailUrl;
    }

    public void setThumbnailUrl(StringFilter thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public StringFilter getVideoPreviewUrl() {
        return videoPreviewUrl;
    }

    public Optional<StringFilter> optionalVideoPreviewUrl() {
        return Optional.ofNullable(videoPreviewUrl);
    }

    public StringFilter videoPreviewUrl() {
        if (videoPreviewUrl == null) {
            setVideoPreviewUrl(new StringFilter());
        }
        return videoPreviewUrl;
    }

    public void setVideoPreviewUrl(StringFilter videoPreviewUrl) {
        this.videoPreviewUrl = videoPreviewUrl;
    }

    public StringFilter getRejectionReason() {
        return rejectionReason;
    }

    public Optional<StringFilter> optionalRejectionReason() {
        return Optional.ofNullable(rejectionReason);
    }

    public StringFilter rejectionReason() {
        if (rejectionReason == null) {
            setRejectionReason(new StringFilter());
        }
        return rejectionReason;
    }

    public void setRejectionReason(StringFilter rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public InstantFilter getCreatedAt() {
        return createdAt;
    }

    public Optional<InstantFilter> optionalCreatedAt() {
        return Optional.ofNullable(createdAt);
    }

    public InstantFilter createdAt() {
        if (createdAt == null) {
            setCreatedAt(new InstantFilter());
        }
        return createdAt;
    }

    public void setCreatedAt(InstantFilter createdAt) {
        this.createdAt = createdAt;
    }

    public InstantFilter getUpdatedAt() {
        return updatedAt;
    }

    public Optional<InstantFilter> optionalUpdatedAt() {
        return Optional.ofNullable(updatedAt);
    }

    public InstantFilter updatedAt() {
        if (updatedAt == null) {
            setUpdatedAt(new InstantFilter());
        }
        return updatedAt;
    }

    public void setUpdatedAt(InstantFilter updatedAt) {
        this.updatedAt = updatedAt;
    }

    public InstantFilter getPublishedAt() {
        return publishedAt;
    }

    public Optional<InstantFilter> optionalPublishedAt() {
        return Optional.ofNullable(publishedAt);
    }

    public InstantFilter publishedAt() {
        if (publishedAt == null) {
            setPublishedAt(new InstantFilter());
        }
        return publishedAt;
    }

    public void setPublishedAt(InstantFilter publishedAt) {
        this.publishedAt = publishedAt;
    }

    public LongFilter getSectionsId() {
        return sectionsId;
    }

    public Optional<LongFilter> optionalSectionsId() {
        return Optional.ofNullable(sectionsId);
    }

    public LongFilter sectionsId() {
        if (sectionsId == null) {
            setSectionsId(new LongFilter());
        }
        return sectionsId;
    }

    public void setSectionsId(LongFilter sectionsId) {
        this.sectionsId = sectionsId;
    }

    public LongFilter getInstructorId() {
        return instructorId;
    }

    public Optional<LongFilter> optionalInstructorId() {
        return Optional.ofNullable(instructorId);
    }

    public LongFilter instructorId() {
        if (instructorId == null) {
            setInstructorId(new LongFilter());
        }
        return instructorId;
    }

    public void setInstructorId(LongFilter instructorId) {
        this.instructorId = instructorId;
    }

    public LongFilter getCategoriesId() {
        return categoriesId;
    }

    public Optional<LongFilter> optionalCategoriesId() {
        return Optional.ofNullable(categoriesId);
    }

    public LongFilter categoriesId() {
        if (categoriesId == null) {
            setCategoriesId(new LongFilter());
        }
        return categoriesId;
    }

    public void setCategoriesId(LongFilter categoriesId) {
        this.categoriesId = categoriesId;
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
        final CourseCriteria that = (CourseCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(title, that.title) &&
            Objects.equals(price, that.price) &&
            Objects.equals(oldPrice, that.oldPrice) &&
            Objects.equals(level, that.level) &&
            Objects.equals(status, that.status) &&
            Objects.equals(thumbnailUrl, that.thumbnailUrl) &&
            Objects.equals(videoPreviewUrl, that.videoPreviewUrl) &&
            Objects.equals(rejectionReason, that.rejectionReason) &&
            Objects.equals(createdAt, that.createdAt) &&
            Objects.equals(updatedAt, that.updatedAt) &&
            Objects.equals(publishedAt, that.publishedAt) &&
            Objects.equals(sectionsId, that.sectionsId) &&
            Objects.equals(instructorId, that.instructorId) &&
            Objects.equals(categoriesId, that.categoriesId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(
            id,
            title,
            price,
            oldPrice,
            level,
            status,
            thumbnailUrl,
            videoPreviewUrl,
            rejectionReason,
            createdAt,
            updatedAt,
            publishedAt,
            sectionsId,
            instructorId,
            categoriesId,
            distinct
        );
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CourseCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalTitle().map(f -> "title=" + f + ", ").orElse("") +
            optionalPrice().map(f -> "price=" + f + ", ").orElse("") +
            optionalOldPrice().map(f -> "oldPrice=" + f + ", ").orElse("") +
            optionalLevel().map(f -> "level=" + f + ", ").orElse("") +
            optionalStatus().map(f -> "status=" + f + ", ").orElse("") +
            optionalThumbnailUrl().map(f -> "thumbnailUrl=" + f + ", ").orElse("") +
            optionalVideoPreviewUrl().map(f -> "videoPreviewUrl=" + f + ", ").orElse("") +
            optionalRejectionReason().map(f -> "rejectionReason=" + f + ", ").orElse("") +
            optionalCreatedAt().map(f -> "createdAt=" + f + ", ").orElse("") +
            optionalUpdatedAt().map(f -> "updatedAt=" + f + ", ").orElse("") +
            optionalPublishedAt().map(f -> "publishedAt=" + f + ", ").orElse("") +
            optionalSectionsId().map(f -> "sectionsId=" + f + ", ").orElse("") +
            optionalInstructorId().map(f -> "instructorId=" + f + ", ").orElse("") +
            optionalCategoriesId().map(f -> "categoriesId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
