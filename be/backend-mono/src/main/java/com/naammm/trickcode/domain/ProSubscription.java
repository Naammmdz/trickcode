package com.naammm.trickcode.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.naammm.trickcode.domain.enumeration.ProPlanType;
import com.naammm.trickcode.domain.enumeration.ProSubscriptionStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pro Subscription — tracks monthly AI subscription for users.
 */
@Entity
@Table(name = "pro_subscription", indexes = {
    @Index(name = "idx_pro_sub_user_status", columnList = "user_id, status"),
})
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProSubscription implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false, length = 30)
    private ProPlanType planType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ProSubscriptionStatus status;

    @NotNull
    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @NotNull
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "authorities" }, allowSetters = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user", "course" }, allowSetters = true)
    private Order order;

    // ─── Getters / Setters ──────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProPlanType getPlanType() { return planType; }
    public void setPlanType(ProPlanType planType) { this.planType = planType; }

    public ProSubscriptionStatus getStatus() { return status; }
    public void setStatus(ProSubscriptionStatus status) { this.status = status; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public boolean isActive() {
        return status == ProSubscriptionStatus.ACTIVE && expiresAt.isAfter(Instant.now());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProSubscription)) return false;
        return getId() != null && getId().equals(((ProSubscription) o).getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "ProSubscription{" +
            "id=" + id +
            ", planType=" + planType +
            ", status=" + status +
            ", startedAt=" + startedAt +
            ", expiresAt=" + expiresAt +
            '}';
    }
}
