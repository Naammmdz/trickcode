package com.naammm.course.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class CourseCriteriaTest {

    @Test
    void newCourseCriteriaHasAllFiltersNullTest() {
        var courseCriteria = new CourseCriteria();
        assertThat(courseCriteria).is(criteriaFiltersAre(Objects::isNull));
    }

    @Test
    void courseCriteriaFluentMethodsCreatesFiltersTest() {
        var courseCriteria = new CourseCriteria();

        setAllFilters(courseCriteria);

        assertThat(courseCriteria).is(criteriaFiltersAre(Objects::nonNull));
    }

    @Test
    void courseCriteriaCopyCreatesNullFilterTest() {
        var courseCriteria = new CourseCriteria();
        var copy = courseCriteria.copy();

        assertThat(courseCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::isNull)),
            criteria -> assertThat(criteria).isEqualTo(courseCriteria)
        );
    }

    @Test
    void courseCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var courseCriteria = new CourseCriteria();
        setAllFilters(courseCriteria);

        var copy = courseCriteria.copy();

        assertThat(courseCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::nonNull)),
            criteria -> assertThat(criteria).isEqualTo(courseCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var courseCriteria = new CourseCriteria();

        assertThat(courseCriteria).hasToString("CourseCriteria{}");
    }

    private static void setAllFilters(CourseCriteria courseCriteria) {
        courseCriteria.id();
        courseCriteria.title();
        courseCriteria.price();
        courseCriteria.oldPrice();
        courseCriteria.level();
        courseCriteria.status();
        courseCriteria.thumbnailUrl();
        courseCriteria.videoPreviewUrl();
        courseCriteria.instructorId();
        courseCriteria.rejectionReason();
        courseCriteria.createdAt();
        courseCriteria.updatedAt();
        courseCriteria.publishedAt();
        courseCriteria.sectionsId();
        courseCriteria.distinct();
    }

    private static Condition<CourseCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getTitle()) &&
                condition.apply(criteria.getPrice()) &&
                condition.apply(criteria.getOldPrice()) &&
                condition.apply(criteria.getLevel()) &&
                condition.apply(criteria.getStatus()) &&
                condition.apply(criteria.getThumbnailUrl()) &&
                condition.apply(criteria.getVideoPreviewUrl()) &&
                condition.apply(criteria.getInstructorId()) &&
                condition.apply(criteria.getRejectionReason()) &&
                condition.apply(criteria.getCreatedAt()) &&
                condition.apply(criteria.getUpdatedAt()) &&
                condition.apply(criteria.getPublishedAt()) &&
                condition.apply(criteria.getSectionsId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<CourseCriteria> copyFiltersAre(CourseCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getTitle(), copy.getTitle()) &&
                condition.apply(criteria.getPrice(), copy.getPrice()) &&
                condition.apply(criteria.getOldPrice(), copy.getOldPrice()) &&
                condition.apply(criteria.getLevel(), copy.getLevel()) &&
                condition.apply(criteria.getStatus(), copy.getStatus()) &&
                condition.apply(criteria.getThumbnailUrl(), copy.getThumbnailUrl()) &&
                condition.apply(criteria.getVideoPreviewUrl(), copy.getVideoPreviewUrl()) &&
                condition.apply(criteria.getInstructorId(), copy.getInstructorId()) &&
                condition.apply(criteria.getRejectionReason(), copy.getRejectionReason()) &&
                condition.apply(criteria.getCreatedAt(), copy.getCreatedAt()) &&
                condition.apply(criteria.getUpdatedAt(), copy.getUpdatedAt()) &&
                condition.apply(criteria.getPublishedAt(), copy.getPublishedAt()) &&
                condition.apply(criteria.getSectionsId(), copy.getSectionsId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
