package com.naammm.trickcode.domain;

import static com.naammm.trickcode.domain.LessonTestSamples.*;
import static com.naammm.trickcode.domain.SectionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.naammm.trickcode.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LessonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Lesson.class);
        Lesson lesson1 = getLessonSample1();
        Lesson lesson2 = new Lesson();
        assertThat(lesson1).isNotEqualTo(lesson2);

        lesson2.setId(lesson1.getId());
        assertThat(lesson1).isEqualTo(lesson2);

        lesson2 = getLessonSample2();
        assertThat(lesson1).isNotEqualTo(lesson2);
    }

    @Test
    void sectionTest() {
        Lesson lesson = getLessonRandomSampleGenerator();
        Section sectionBack = getSectionRandomSampleGenerator();

        lesson.setSection(sectionBack);
        assertThat(lesson.getSection()).isEqualTo(sectionBack);

        lesson.section(null);
        assertThat(lesson.getSection()).isNull();
    }
}
