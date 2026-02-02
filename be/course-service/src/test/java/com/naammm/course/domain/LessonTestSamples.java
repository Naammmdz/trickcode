package com.naammm.course.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LessonTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Lesson getLessonSample1() {
        return new Lesson().id(1L).title("title1").orderIndex(1).durationSeconds(1).videoUrl("videoUrl1").captionUrl("captionUrl1");
    }

    public static Lesson getLessonSample2() {
        return new Lesson().id(2L).title("title2").orderIndex(2).durationSeconds(2).videoUrl("videoUrl2").captionUrl("captionUrl2");
    }

    public static Lesson getLessonRandomSampleGenerator() {
        return new Lesson()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .orderIndex(intCount.incrementAndGet())
            .durationSeconds(intCount.incrementAndGet())
            .videoUrl(UUID.randomUUID().toString())
            .captionUrl(UUID.randomUUID().toString());
    }
}
