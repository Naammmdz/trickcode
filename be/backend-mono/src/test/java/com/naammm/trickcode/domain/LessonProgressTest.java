package com.naammm.trickcode.domain;

import static com.naammm.trickcode.domain.EnrollmentTestSamples.*;
import static com.naammm.trickcode.domain.LessonProgressTestSamples.*;
import static com.naammm.trickcode.domain.LessonTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.naammm.trickcode.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LessonProgressTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LessonProgress.class);
        LessonProgress lessonProgress1 = getLessonProgressSample1();
        LessonProgress lessonProgress2 = new LessonProgress();
        assertThat(lessonProgress1).isNotEqualTo(lessonProgress2);

        lessonProgress2.setId(lessonProgress1.getId());
        assertThat(lessonProgress1).isEqualTo(lessonProgress2);

        lessonProgress2 = getLessonProgressSample2();
        assertThat(lessonProgress1).isNotEqualTo(lessonProgress2);
    }

    @Test
    void lessonTest() {
        LessonProgress lessonProgress = getLessonProgressRandomSampleGenerator();
        Lesson lessonBack = getLessonRandomSampleGenerator();

        lessonProgress.setLesson(lessonBack);
        assertThat(lessonProgress.getLesson()).isEqualTo(lessonBack);

        lessonProgress.lesson(null);
        assertThat(lessonProgress.getLesson()).isNull();
    }

    @Test
    void enrollmentTest() {
        LessonProgress lessonProgress = getLessonProgressRandomSampleGenerator();
        Enrollment enrollmentBack = getEnrollmentRandomSampleGenerator();

        lessonProgress.setEnrollment(enrollmentBack);
        assertThat(lessonProgress.getEnrollment()).isEqualTo(enrollmentBack);

        lessonProgress.enrollment(null);
        assertThat(lessonProgress.getEnrollment()).isNull();
    }
}
