package com.naammm.trickcode.service;

import com.naammm.trickcode.config.ProSubscriptionProperties;
import com.naammm.trickcode.domain.Order;
import com.naammm.trickcode.domain.ProSubscription;
import com.naammm.trickcode.domain.User;
import com.naammm.trickcode.domain.enumeration.ProPlanType;
import com.naammm.trickcode.domain.enumeration.ProSubscriptionStatus;
import com.naammm.trickcode.repository.ProSubscriptionRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProSubscriptionService {

    private static final Logger LOG = LoggerFactory.getLogger(ProSubscriptionService.class);

    private final ProSubscriptionRepository subscriptionRepository;
    private final ProSubscriptionProperties properties;

    public ProSubscriptionService(ProSubscriptionRepository subscriptionRepository, ProSubscriptionProperties properties) {
        this.subscriptionRepository = subscriptionRepository;
        this.properties = properties;
    }

    /**
     * Check if user has any active Pro subscription.
     */
    @Transactional(readOnly = true)
    public boolean isProUser(String login) {
        return !subscriptionRepository.findActiveByLogin(login, ProSubscriptionStatus.ACTIVE, Instant.now()).isEmpty();
    }

    /**
     * Check if user has active Student Pro.
     */
    @Transactional(readOnly = true)
    public boolean isStudentPro(String login) {
        return subscriptionRepository.findActiveByLoginAndPlan(
            login, ProPlanType.STUDENT_PRO, ProSubscriptionStatus.ACTIVE, Instant.now()
        ).isPresent();
    }

    /**
     * Check if user has active Instructor Pro.
     */
    @Transactional(readOnly = true)
    public boolean isInstructorPro(String login) {
        return subscriptionRepository.findActiveByLoginAndPlan(
            login, ProPlanType.INSTRUCTOR_PRO, ProSubscriptionStatus.ACTIVE, Instant.now()
        ).isPresent();
    }

    /**
     * Get current subscription info for a user.
     */
    @Transactional(readOnly = true)
    public Optional<ProSubscription> getCurrentSubscription(String login) {
        List<ProSubscription> active = subscriptionRepository.findActiveByLogin(login, ProSubscriptionStatus.ACTIVE, Instant.now());
        return active.isEmpty() ? Optional.empty() : Optional.of(active.get(0));
    }

    /**
     * Activate a Pro subscription after successful payment.
     */
    public ProSubscription activateSubscription(User user, ProPlanType planType, Order order) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(properties.getDurationDays(), ChronoUnit.DAYS);

        // Check if there's an existing active subscription of same type → extend it
        Optional<ProSubscription> existing = subscriptionRepository.findActiveByLoginAndPlan(
            user.getLogin(), planType, ProSubscriptionStatus.ACTIVE, now
        );

        if (existing.isPresent()) {
            // Extend from current expiry date
            ProSubscription sub = existing.get();
            Instant newExpiry = sub.getExpiresAt().plus(properties.getDurationDays(), ChronoUnit.DAYS);
            sub.setExpiresAt(newExpiry);
            sub.setOrder(order);
            LOG.info("Extended {} subscription for user {} until {}", planType, user.getLogin(), newExpiry);
            return subscriptionRepository.save(sub);
        }

        ProSubscription subscription = new ProSubscription();
        subscription.setUser(user);
        subscription.setPlanType(planType);
        subscription.setStatus(ProSubscriptionStatus.ACTIVE);
        subscription.setStartedAt(now);
        subscription.setExpiresAt(expiresAt);
        subscription.setOrder(order);

        LOG.info("Activated {} subscription for user {} until {}", planType, user.getLogin(), expiresAt);
        return subscriptionRepository.save(subscription);
    }

    /**
     * Get price for a plan type (in USD).
     */
    public BigDecimal getPriceUsd(ProPlanType planType) {
        return switch (planType) {
            case STUDENT_PRO -> properties.getStudentPriceUsd();
            case INSTRUCTOR_PRO -> properties.getInstructorPriceUsd();
        };
    }

    /**
     * Get plan info for API response.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getPlansInfo() {
        return Map.of(
            "plans", List.of(
                Map.of(
                    "type", "STUDENT_PRO",
                    "priceUsd", properties.getStudentPriceUsd(),
                    "durationDays", properties.getDurationDays(),
                    "features", List.of("AI Code Hints", "AI Explain Failures", "AI Ask Questions (Code & Quiz)")
                ),
                Map.of(
                    "type", "INSTRUCTOR_PRO",
                    "priceUsd", properties.getInstructorPriceUsd(),
                    "durationDays", properties.getDurationDays(),
                    "features", List.of("AI Generate Quiz", "AI Generate Code Challenges")
                )
            )
        );
    }
}
