package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.service.payment.VnPayPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for VNPay payment flow.
 */
@RestController
@RequestMapping("/api/payments/vnpay")
public class VnPayPaymentResource {

    private static final Logger LOG = LoggerFactory.getLogger(VnPayPaymentResource.class);

    private final VnPayPaymentService vnPayPaymentService;

    public VnPayPaymentResource(VnPayPaymentService vnPayPaymentService) {
        this.vnPayPaymentService = vnPayPaymentService;
    }

    /**
     * POST /api/payments/vnpay/create
     * Create a VNPay payment for a course.
     * Request body: { courseId: 123, bankCode?: "VNPAYQR" | "VNBANK" | "INTCARD" | "NCB" }
     */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        LOG.debug("REST request to create VNPay payment");
        Object courseIdObj = payload.get("courseId");
        if (courseIdObj == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing courseId"));
        }
        Long courseId;
        try {
            courseId = Long.valueOf(courseIdObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid courseId"));
        }

        String bankCode = null;
        Object bankCodeObj = payload.get("bankCode");
        if (bankCodeObj != null && !bankCodeObj.toString().isBlank()) {
            bankCode = bankCodeObj.toString().trim();
        }

        String clientIp = getClientIp(request);
        try {
            var result = vnPayPaymentService.createPaymentForCourse(courseId, clientIp, bankCode);
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", result.orderId());
            response.put("txnRef", result.txnRef());
            response.put("paymentUrl", result.paymentUrl());
            return ResponseEntity.ok(response);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            LOG.error("Failed to create VNPay payment", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Internal error"));
        }
    }

    /**
     * GET /api/payments/vnpay/return
     * VNPay browser return endpoint.
     * Query params are provided by VNPay.
     */
    @GetMapping("/return")
    public ResponseEntity<Map<String, Object>> handleReturn(HttpServletRequest request) {
        LOG.debug("VNPay return callback");
        Map<String, String> params = request.getParameterMap().entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue()[0]));

        var result = vnPayPaymentService.handleReturn(params);
        Map<String, Object> response = new HashMap<>();
        response.put("signatureValid", result.signatureValid());
        response.put("txnRef", result.txnRef());
        response.put("responseCode", result.responseCode());
        response.put("orderStatus", result.orderStatus() != null ? result.orderStatus().name() : null);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/payments/vnpay/ipn
     * VNPay IPN (server-to-server) endpoint.
     * Body: form-urlencoded params from VNPay.
     */
    @PostMapping(value = "/ipn", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> handleIpn(@RequestParam Map<String, String> params) {
        LOG.debug("VNPay IPN callback: {}", params);
        var result = vnPayPaymentService.handleIpn(params);
        return ResponseEntity.ok(result.RspCode() + "|" + result.Message());
    }

    private String getClientIp(HttpServletRequest request) {
        // Try to get real IP from headers (for reverse proxy/load balancer)
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            String ip = xForwardedFor.split(",")[0].trim();
            // Prefer IPv4 if both IPv6 and IPv4 are present
            if (ip.contains(":") && ip.contains(".")) {
                return ip.substring(ip.lastIndexOf(":") + 1).trim();
            }
            return ip;
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }

        // Fallback to remote address, but prefer IPv4
        String remoteAddr = request.getRemoteAddr();
        if (remoteAddr != null && remoteAddr.startsWith("0:0:0:0:0:0:0:1")) {
            return "127.0.0.1"; // Convert IPv6 localhost to IPv4
        }
        return remoteAddr;
    }
}