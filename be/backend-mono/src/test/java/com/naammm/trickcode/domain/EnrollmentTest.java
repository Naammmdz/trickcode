package com.naammm.trickcode.domain;

import static com.naammm.trickcode.domain.CourseTestSamples.*;
import static com.naammm.trickcode.domain.EnrollmentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.naammm.trickcode.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EnrollmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Enrollment.class);
        Enrollment enrollment1 = getEnrollmentSample1();
        Enrollment enrollment2 = new Enrollment();
        assertThat(enrollment1).isNotEqualTo(enrollment2);

        enrollment2.setId(enrollment1.getId());
        assertThat(enrollment1).isEqualTo(enrollment2);

        enrollment2 = getEnrollmentSample2();
        assertThat(enrollment1).isNotEqualTo(enrollment2);
    }

    @Test
    void courseTest() {
        Enrollment enrollment = getEnrollmentRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        enrollment.setCourse(courseBack);
        assertThat(enrollment.getCourse()).isEqualTo(courseBack);

        enrollment.course(null);
        assertThat(enrollment.getCourse()).isNull();
    }
}
