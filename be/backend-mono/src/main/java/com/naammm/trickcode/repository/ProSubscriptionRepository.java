package com.naammm.trickcode.repository;

import com.naammm.trickcode.domain.ProSubscription;
import com.naammm.trickcode.domain.enumeration.ProPlanType;
import com.naammm.trickcode.domain.enumeration.ProSubscriptionStatus;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProSubscriptionRepository extends JpaRepository<ProSubscription, Long> {

    @Query("SELECT ps FROM ProSubscription ps WHERE ps.user.login = :login AND ps.status = :status AND ps.expiresAt > :now ORDER BY ps.expiresAt DESC")
    List<ProSubscription> findActiveByLogin(
        @Param("login") String login,
        @Param("status") ProSubscriptionStatus status,
        @Param("now") Instant now
    );

    @Query("SELECT ps FROM ProSubscription ps WHERE ps.user.login = :login AND ps.planType = :planType AND ps.status = :status AND ps.expiresAt > :now")
    Optional<ProSubscription> findActiveByLoginAndPlan(
        @Param("login") String login,
        @Param("planType") ProPlanType planType,
        @Param("status") ProSubscriptionStatus status,
        @Param("now") Instant now
    );

    @Query("SELECT ps FROM ProSubscription ps WHERE ps.user.login = ?#{authentication.name} ORDER BY ps.expiresAt DESC")
    List<ProSubscription> findByCurrentUser();

    boolean existsByOrderId(Long orderId);
}
