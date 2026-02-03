package com.naammm.trickcode.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class SectionCriteriaTest {

    @Test
    void newSectionCriteriaHasAllFiltersNullTest() {
        var sectionCriteria = new SectionCriteria();
        assertThat(sectionCriteria).is(criteriaFiltersAre(Objects::isNull));
    }

    @Test
    void sectionCriteriaFluentMethodsCreatesFiltersTest() {
        var sectionCriteria = new SectionCriteria();

        setAllFilters(sectionCriteria);

        assertThat(sectionCriteria).is(criteriaFiltersAre(Objects::nonNull));
    }

    @Test
    void sectionCriteriaCopyCreatesNullFilterTest() {
        var sectionCriteria = new SectionCriteria();
        var copy = sectionCriteria.copy();

        assertThat(sectionCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::isNull)),
            criteria -> assertThat(criteria).isEqualTo(sectionCriteria)
        );
    }

    @Test
    void sectionCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var sectionCriteria = new SectionCriteria();
        setAllFilters(sectionCriteria);

        var copy = sectionCriteria.copy();

        assertThat(sectionCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::nonNull)),
            criteria -> assertThat(criteria).isEqualTo(sectionCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var sectionCriteria = new SectionCriteria();

        assertThat(sectionCriteria).hasToString("SectionCriteria{}");
    }

    private static void setAllFilters(SectionCriteria sectionCriteria) {
        sectionCriteria.id();
        sectionCriteria.title();
        sectionCriteria.orderIndex();
        sectionCriteria.lessonsId();
        sectionCriteria.courseId();
        sectionCriteria.distinct();
    }

    private static Condition<SectionCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getTitle()) &&
                condition.apply(criteria.getOrderIndex()) &&
                condition.apply(criteria.getLessonsId()) &&
                condition.apply(criteria.getCourseId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<SectionCriteria> copyFiltersAre(SectionCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getTitle(), copy.getTitle()) &&
                condition.apply(criteria.getOrderIndex(), copy.getOrderIndex()) &&
                condition.apply(criteria.getLessonsId(), copy.getLessonsId()) &&
                condition.apply(criteria.getCourseId(), copy.getCourseId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
