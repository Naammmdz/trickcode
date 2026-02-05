package com.naammm.trickcode.config;

import java.math.BigDecimal;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "payment")
public class PaymentProperties {

    /**
     * Fixed exchange rate to convert USD prices to VND for VNPay payments.
     */
    private BigDecimal usdToVndRate = BigDecimal.valueOf(25000);

    public BigDecimal getUsdToVndRate() {
        return usdToVndRate;
    }

    public void setUsdToVndRate(BigDecimal usdToVndRate) {
        this.usdToVndRate = usdToVndRate;
    }
}
