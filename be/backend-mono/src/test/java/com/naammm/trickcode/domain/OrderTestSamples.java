package com.naammm.trickcode.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class OrderTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Order getOrderSample1() {
        return new Order().id(1L).paymentMethod("paymentMethod1").transactionId("transactionId1");
    }

    public static Order getOrderSample2() {
        return new Order().id(2L).paymentMethod("paymentMethod2").transactionId("transactionId2");
    }

    public static Order getOrderRandomSampleGenerator() {
        return new Order()
            .id(longCount.incrementAndGet())
            .paymentMethod(UUID.randomUUID().toString())
            .transactionId(UUID.randomUUID().toString());
    }
}
