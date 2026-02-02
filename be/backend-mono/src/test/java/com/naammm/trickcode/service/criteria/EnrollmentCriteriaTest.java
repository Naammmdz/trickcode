package com.naammm.trickcode.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class EnrollmentCriteriaTest {

    @Test
    void newEnrollmentCriteriaHasAllFiltersNullTest() {
        var enrollmentCriteria = new EnrollmentCriteria();
        assertThat(enrollmentCriteria).is(criteriaFiltersAre(Objects::isNull));
    }

    @Test
    void enrollmentCriteriaFluentMethodsCreatesFiltersTest() {
        var enrollmentCriteria = new EnrollmentCriteria();

        setAllFilters(enrollmentCriteria);

        assertThat(enrollmentCriteria).is(criteriaFiltersAre(Objects::nonNull));
    }

    @Test
    void enrollmentCriteriaCopyCreatesNullFilterTest() {
        var enrollmentCriteria = new EnrollmentCriteria();
        var copy = enrollmentCriteria.copy();

        assertThat(enrollmentCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::isNull)),
            criteria -> assertThat(criteria).isEqualTo(enrollmentCriteria)
        );
    }

    @Test
    void enrollmentCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var enrollmentCriteria = new EnrollmentCriteria();
        setAllFilters(enrollmentCriteria);

        var copy = enrollmentCriteria.copy();

        assertThat(enrollmentCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::nonNull)),
            criteria -> assertThat(criteria).isEqualTo(enrollmentCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var enrollmentCriteria = new EnrollmentCriteria();

        assertThat(enrollmentCriteria).hasToString("EnrollmentCriteria{}");
    }

    private static void setAllFilters(EnrollmentCriteria enrollmentCriteria) {
        enrollmentCriteria.id();
        enrollmentCriteria.enrolledAt();
        enrollmentCriteria.completedAt();
        enrollmentCriteria.status();
        enrollmentCriteria.userId();
        enrollmentCriteria.courseId();
        enrollmentCriteria.distinct();
    }

    private static Condition<EnrollmentCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getEnrolledAt()) &&
                condition.apply(criteria.getCompletedAt()) &&
                condition.apply(criteria.getStatus()) &&
                condition.apply(criteria.getUserId()) &&
                condition.apply(criteria.getCourseId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<EnrollmentCriteria> copyFiltersAre(EnrollmentCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getEnrolledAt(), copy.getEnrolledAt()) &&
                condition.apply(criteria.getCompletedAt(), copy.getCompletedAt()) &&
                condition.apply(criteria.getStatus(), copy.getStatus()) &&
                condition.apply(criteria.getUserId(), copy.getUserId()) &&
                condition.apply(criteria.getCourseId(), copy.getCourseId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
