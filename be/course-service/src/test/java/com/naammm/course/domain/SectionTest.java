package com.naammm.course.domain;

import static com.naammm.course.domain.CourseTestSamples.*;
import static com.naammm.course.domain.LessonTestSamples.*;
import static com.naammm.course.domain.SectionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.naammm.course.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SectionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Section.class);
        Section section1 = getSectionSample1();
        Section section2 = new Section();
        assertThat(section1).isNotEqualTo(section2);

        section2.setId(section1.getId());
        assertThat(section1).isEqualTo(section2);

        section2 = getSectionSample2();
        assertThat(section1).isNotEqualTo(section2);
    }

    @Test
    void lessonsTest() {
        Section section = getSectionRandomSampleGenerator();
        Lesson lessonBack = getLessonRandomSampleGenerator();

        section.addLessons(lessonBack);
        assertThat(section.getLessons()).containsOnly(lessonBack);
        assertThat(lessonBack.getSection()).isEqualTo(section);

        section.removeLessons(lessonBack);
        assertThat(section.getLessons()).doesNotContain(lessonBack);
        assertThat(lessonBack.getSection()).isNull();

        section.lessons(new HashSet<>(Set.of(lessonBack)));
        assertThat(section.getLessons()).containsOnly(lessonBack);
        assertThat(lessonBack.getSection()).isEqualTo(section);

        section.setLessons(new HashSet<>());
        assertThat(section.getLessons()).doesNotContain(lessonBack);
        assertThat(lessonBack.getSection()).isNull();
    }

    @Test
    void courseTest() {
        Section section = getSectionRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        section.setCourse(courseBack);
        assertThat(section.getCourse()).isEqualTo(courseBack);

        section.course(null);
        assertThat(section.getCourse()).isNull();
    }
}
