package com.naammm.course.domain;

import static com.naammm.course.domain.CourseTestSamples.*;
import static com.naammm.course.domain.SectionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.naammm.course.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CourseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Course.class);
        Course course1 = getCourseSample1();
        Course course2 = new Course();
        assertThat(course1).isNotEqualTo(course2);

        course2.setId(course1.getId());
        assertThat(course1).isEqualTo(course2);

        course2 = getCourseSample2();
        assertThat(course1).isNotEqualTo(course2);
    }

    @Test
    void sectionsTest() {
        Course course = getCourseRandomSampleGenerator();
        Section sectionBack = getSectionRandomSampleGenerator();

        course.addSections(sectionBack);
        assertThat(course.getSections()).containsOnly(sectionBack);
        assertThat(sectionBack.getCourse()).isEqualTo(course);

        course.removeSections(sectionBack);
        assertThat(course.getSections()).doesNotContain(sectionBack);
        assertThat(sectionBack.getCourse()).isNull();

        course.sections(new HashSet<>(Set.of(sectionBack)));
        assertThat(course.getSections()).containsOnly(sectionBack);
        assertThat(sectionBack.getCourse()).isEqualTo(course);

        course.setSections(new HashSet<>());
        assertThat(course.getSections()).doesNotContain(sectionBack);
        assertThat(sectionBack.getCourse()).isNull();
    }
}
