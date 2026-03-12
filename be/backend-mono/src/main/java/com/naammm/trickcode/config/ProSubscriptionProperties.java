package com.naammm.trickcode.config;

import java.math.BigDecimal;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "pro-subscription")
public class ProSubscriptionProperties {

    private BigDecimal studentPriceUsd = new BigDecimal("9.99");
    private BigDecimal instructorPriceUsd = new BigDecimal("19.99");
    private int durationDays = 30;

    public BigDecimal getStudentPriceUsd() { return studentPriceUsd; }
    public void setStudentPriceUsd(BigDecimal studentPriceUsd) { this.studentPriceUsd = studentPriceUsd; }

    public BigDecimal getInstructorPriceUsd() { return instructorPriceUsd; }
    public void setInstructorPriceUsd(BigDecimal instructorPriceUsd) { this.instructorPriceUsd = instructorPriceUsd; }

    public int getDurationDays() { return durationDays; }
    public void setDurationDays(int durationDays) { this.durationDays = durationDays; }
}
