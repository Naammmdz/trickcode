package com.naammm.trickcode.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class LessonProgressTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static LessonProgress getLessonProgressSample1() {
        return new LessonProgress().id(1L);
    }

    public static LessonProgress getLessonProgressSample2() {
        return new LessonProgress().id(2L);
    }

    public static LessonProgress getLessonProgressRandomSampleGenerator() {
        return new LessonProgress().id(longCount.incrementAndGet());
    }
}
