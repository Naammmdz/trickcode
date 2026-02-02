package com.naammm.course.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CourseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Course getCourseSample1() {
        return new Course()
            .id(1L)
            .title("title1")
            .thumbnailUrl("thumbnailUrl1")
            .videoPreviewUrl("videoPreviewUrl1")
            .instructorId(1L)
            .rejectionReason("rejectionReason1");
    }

    public static Course getCourseSample2() {
        return new Course()
            .id(2L)
            .title("title2")
            .thumbnailUrl("thumbnailUrl2")
            .videoPreviewUrl("videoPreviewUrl2")
            .instructorId(2L)
            .rejectionReason("rejectionReason2");
    }

    public static Course getCourseRandomSampleGenerator() {
        return new Course()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .thumbnailUrl(UUID.randomUUID().toString())
            .videoPreviewUrl(UUID.randomUUID().toString())
            .instructorId(longCount.incrementAndGet())
            .rejectionReason(UUID.randomUUID().toString());
    }
}
