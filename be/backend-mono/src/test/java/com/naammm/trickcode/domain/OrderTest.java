package com.naammm.trickcode.domain;

import static com.naammm.trickcode.domain.CourseTestSamples.*;
import static com.naammm.trickcode.domain.OrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.naammm.trickcode.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Order.class);
        Order order1 = getOrderSample1();
        Order order2 = new Order();
        assertThat(order1).isNotEqualTo(order2);

        order2.setId(order1.getId());
        assertThat(order1).isEqualTo(order2);

        order2 = getOrderSample2();
        assertThat(order1).isNotEqualTo(order2);
    }

    @Test
    void courseTest() {
        Order order = getOrderRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        order.setCourse(courseBack);
        assertThat(order.getCourse()).isEqualTo(courseBack);

        order.course(null);
        assertThat(order.getCourse()).isNull();
    }
}
