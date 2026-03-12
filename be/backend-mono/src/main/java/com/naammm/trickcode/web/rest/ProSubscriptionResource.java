package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.domain.ProSubscription;
import com.naammm.trickcode.domain.enumeration.ProPlanType;
import com.naammm.trickcode.service.ProSubscriptionService;
import com.naammm.trickcode.service.payment.VnPayPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
public class ProSubscriptionResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProSubscriptionResource.class);

    private final ProSubscriptionService subscriptionService;
    private final VnPayPaymentService vnPayPaymentService;

    public ProSubscriptionResource(
        ProSubscriptionService subscriptionService,
        VnPayPaymentService vnPayPaymentService
    ) {
        this.subscriptionService = subscriptionService;
        this.vnPayPaymentService = vnPayPaymentService;
    }

    /**
     * GET /api/subscriptions/plans — Get available Pro plans and pricing.
     */
    @GetMapping("/plans")
    public ResponseEntity<Map<String, Object>> getPlans() {
        return ResponseEntity.ok(subscriptionService.getPlansInfo());
    }

    /**
     * GET /api/subscriptions/status — Get current user's subscription status.
     */
    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getStatus() {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<ProSubscription> sub = subscriptionService.getCurrentSubscription(login);

        if (sub.isPresent()) {
            ProSubscription s = sub.get();
            return ResponseEntity.ok(Map.of(
                "isPro", true,
                "planType", s.getPlanType(),
                "status", s.getStatus(),
                "expiresAt", s.getExpiresAt().toString(),
                "isStudentPro", subscriptionService.isStudentPro(login),
                "isInstructorPro", subscriptionService.isInstructorPro(login)
            ));
        }

        return ResponseEntity.ok(Map.of(
            "isPro", false,
            "isStudentPro", false,
            "isInstructorPro", false
        ));
    }

    /**
     * POST /api/subscriptions/purchase — Create VNPay payment for Pro subscription.
     */
    @PostMapping("/purchase")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> purchase(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        LOG.debug("REST request to purchase Pro subscription");

        String planTypeStr = request.get("planType");
        if (planTypeStr == null || planTypeStr.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "planType is required (STUDENT_PRO or INSTRUCTOR_PRO)"));
        }

        ProPlanType planType;
        try {
            planType = ProPlanType.valueOf(planTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid planType. Must be STUDENT_PRO or INSTRUCTOR_PRO"));
        }

        // Extract real IP from request (X-Forwarded-For for nginx/reverse proxy)
        String clientIp = httpRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = httpRequest.getRemoteAddr();
        } else {
            clientIp = clientIp.split(",")[0].trim();
        }
        String bankCode = request.get("bankCode");

        try {
            VnPayPaymentService.CreatePaymentResult result =
                vnPayPaymentService.createPaymentForSubscription(planType, clientIp, bankCode);

            return ResponseEntity.ok(Map.of(
                "orderId", result.orderId(),
                "txnRef", result.txnRef(),
                "paymentUrl", result.paymentUrl()
            ));
        } catch (Exception e) {
            LOG.error("Subscription purchase failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
