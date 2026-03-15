package com.naammm.trickcode.service.payment;

import com.naammm.trickcode.config.PaymentProperties;
import com.naammm.trickcode.config.ProSubscriptionProperties;
import com.naammm.trickcode.config.VnPayProperties;
import com.naammm.trickcode.domain.Course;
import com.naammm.trickcode.domain.Enrollment;
import com.naammm.trickcode.domain.Order;
import com.naammm.trickcode.domain.User;
import com.naammm.trickcode.domain.enumeration.OrderStatus;
import com.naammm.trickcode.domain.enumeration.ProPlanType;
import com.naammm.trickcode.repository.CourseRepository;
import com.naammm.trickcode.repository.EnrollmentRepository;
import com.naammm.trickcode.repository.OrderRepository;
import com.naammm.trickcode.repository.UserRepository;
import com.naammm.trickcode.repository.ProSubscriptionRepository;
import com.naammm.trickcode.service.ProSubscriptionService;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class VnPayPaymentService {

    private static final Logger LOG = LoggerFactory.getLogger(VnPayPaymentService.class);

    private static final DateTimeFormatter VN_PAY_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss").withZone(
        ZoneId.of("Asia/Ho_Chi_Minh")
    );

    private final VnPayProperties vnPayProperties;
    private final PaymentProperties paymentProperties;
    private final ProSubscriptionProperties proSubscriptionProperties;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final VnPayTransactionClient vnPayTransactionClient;
    private final ProSubscriptionService proSubscriptionService;
    private final ProSubscriptionRepository subscriptionRepository;

    public VnPayPaymentService(
        VnPayProperties vnPayProperties,
        PaymentProperties paymentProperties,
        ProSubscriptionProperties proSubscriptionProperties,
        CourseRepository courseRepository,
        UserRepository userRepository,
        OrderRepository orderRepository,
        EnrollmentRepository enrollmentRepository,
        VnPayTransactionClient vnPayTransactionClient,
        ProSubscriptionService proSubscriptionService,
        ProSubscriptionRepository subscriptionRepository
    ) {
        this.vnPayProperties = vnPayProperties;
        this.paymentProperties = paymentProperties;
        this.proSubscriptionProperties = proSubscriptionProperties;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.vnPayTransactionClient = vnPayTransactionClient;
        this.proSubscriptionService = proSubscriptionService;
        this.subscriptionRepository = subscriptionRepository;
    }

    public CreatePaymentResult createPaymentForCourse(Long courseId, String clientIp, String bankCode) {
        User user = getCurrentUser().orElseThrow(() -> new IllegalStateException("Current user not found"));
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        if (enrollmentRepository.existsByUserLoginAndCourseId(user.getLogin(), courseId)) {
            throw new IllegalStateException("User already enrolled");
        }

        Order order = new Order();
        order.setUser(user);
        order.setCourse(course);
        order.setCreatedAt(Instant.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod("VNPAY");
        order.setPaymentProvider("VNPAY");

        BigDecimal amountUsd = course.getPrice();
        if (amountUsd == null) {
            amountUsd = BigDecimal.ZERO;
        }

        BigDecimal rate = paymentProperties.getUsdToVndRate() != null ? paymentProperties.getUsdToVndRate() : BigDecimal.valueOf(25000);
        // VNPay expects VND. Convert from USD to VND and round to whole VND.
        BigDecimal amountVnd = amountUsd.multiply(rate).setScale(0, java.math.RoundingMode.HALF_UP);
        order.setTotalAmount(amountVnd);

        String txnRef = generateTxnRef(order, user, course);
        order.setPaymentTxnRef(txnRef);

        if (amountVnd.compareTo(BigDecimal.ZERO) <= 0) {
            order.setStatus(OrderStatus.COMPLETED);
            order.setPaidAt(Instant.now());
            order.setVnpayResponseCode("00");
            order.setVnpayTransactionNo("FREE");
            order = orderRepository.save(order);
            fulfillOrder(order);
            return new CreatePaymentResult(order.getId(), txnRef, "/my-courses");
        }

        order = orderRepository.save(order);

        String paymentUrl = buildPaymentUrl(order, clientIp, bankCode);
        return new CreatePaymentResult(order.getId(), txnRef, paymentUrl);
    }

    /**
     * Create VNPay payment for Pro subscription purchase.
     */
    public CreatePaymentResult createPaymentForSubscription(ProPlanType planType, String clientIp, String bankCode) {
        User user = getCurrentUser().orElseThrow(() -> new IllegalStateException("Current user not found"));

        BigDecimal priceUsd = proSubscriptionService.getPriceUsd(planType);
        BigDecimal rate = paymentProperties.getUsdToVndRate() != null ? paymentProperties.getUsdToVndRate() : BigDecimal.valueOf(25000);
        BigDecimal amountVnd = priceUsd.multiply(rate).setScale(0, java.math.RoundingMode.HALF_UP);

        Order order = new Order();
        order.setUser(user);
        order.setCourse(null); // Not a course purchase
        order.setSubscriptionType(planType);
        order.setCreatedAt(Instant.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentMethod("VNPAY");
        order.setPaymentProvider("VNPAY");
        order.setTotalAmount(amountVnd);

        String txnRef = UUID.randomUUID().toString().replace("-", "");
        order.setPaymentTxnRef(txnRef);
        order = orderRepository.save(order);

        String paymentUrl = buildPaymentUrl(order, clientIp, bankCode);
        return new CreatePaymentResult(order.getId(), txnRef, paymentUrl);
    }

    public IpnHandleResult handleIpn(Map<String, String> params) {
        String txnRef = params.get("vnp_TxnRef");
        if (txnRef == null || txnRef.isBlank()) {
            return IpnHandleResult.fail("01", "Missing vnp_TxnRef");
        }

        boolean valid = VnPayCrypto.verifySecureHash(params, vnPayProperties.getHashSecret());
        if (!valid) {
            return IpnHandleResult.fail("97", "Invalid signature");
        }

        Optional<Order> orderOpt = orderRepository.findOneByPaymentTxnRef(txnRef);
        if (orderOpt.isEmpty()) {
            return IpnHandleResult.fail("01", "Order not found");
        }

        Order order = orderOpt.get();

        String responseCode = params.get("vnp_ResponseCode");
        String vnpAmountStr = params.get("vnp_Amount");
        String vnpTransactionNo = params.get("vnp_TransactionNo");

        if (vnpAmountStr == null || vnpAmountStr.isBlank()) {
            return IpnHandleResult.fail("04", "Missing amount");
        }

        long expected = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();
        long received;
        try {
            received = Long.parseLong(vnpAmountStr);
        } catch (NumberFormatException e) {
            return IpnHandleResult.fail("04", "Invalid amount");
        }

        if (expected != received) {
            return IpnHandleResult.fail("04", "Amount mismatch");
        }

        // Idempotency: if already completed, acknowledge success.
        if (order.getStatus() == OrderStatus.COMPLETED) {
            return IpnHandleResult.ok();
        }

        order.setVnpayResponseCode(responseCode);
        order.setVnpayTransactionNo(vnpTransactionNo);
        order.setTransactionId(vnpTransactionNo);

        if ("00".equals(responseCode)) {
            order.setStatus(OrderStatus.COMPLETED);
            order.setPaidAt(Instant.now());
            orderRepository.save(order);

            fulfillOrder(order);
            return IpnHandleResult.ok();
        }

        order.setStatus(OrderStatus.FAILED);
        orderRepository.save(order);
        return IpnHandleResult.ok();
    }

    public ReturnResult handleReturn(Map<String, String> params) {
        boolean valid = VnPayCrypto.verifySecureHash(params, vnPayProperties.getHashSecret());
        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");

        if (!valid) {
            return new ReturnResult(false, txnRef, responseCode, null, null);
        }

        if (txnRef != null && !txnRef.isBlank() && "00".equals(responseCode)) {
            Optional<Order> orderOpt = orderRepository.findOneByPaymentTxnRef(txnRef);
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();

                // If IPN is not delivered (sandbox instability), confirm by QueryDR
                if (order.getStatus() == OrderStatus.PENDING) {
                    String transDate = params.get("vnp_PayDate");
                    String orderInfo = params.getOrDefault("vnp_OrderInfo", "Order " + order.getId());
                    String clientIp = params.getOrDefault("vnp_IpAddr", "127.0.0.1");

                    if (transDate != null && !transDate.isBlank()) {
                        VnPayTransactionClient.QueryDrResponse q = vnPayTransactionClient.queryDr(txnRef, transDate, orderInfo, clientIp);

                        boolean queryOk = "00".equals(q.responseCode()) && "00".equals(q.transactionStatus());
                        if (queryOk) {
                            long expected = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();
                            long received = -1;
                            try {
                                if (q.amount() != null) {
                                    received = Long.parseLong(q.amount());
                                }
                            } catch (NumberFormatException ignore) {}

                            if (received == expected) {
                                order.setStatus(OrderStatus.COMPLETED);
                                order.setPaidAt(Instant.now());
                                if (q.transactionNo() != null && !q.transactionNo().isBlank()) {
                                    order.setVnpayTransactionNo(q.transactionNo());
                                    order.setTransactionId(q.transactionNo());
                                }
                                order.setVnpayResponseCode("00");
                                orderRepository.save(order);
                                fulfillOrder(order);
                            }
                        }
                    }
                }
            }
        }

        OrderStatus status = null;
        String orderType = null;
        if (txnRef != null && !txnRef.isBlank()) {
            Optional<Order> finalOrder = orderRepository.findOneByPaymentTxnRef(txnRef);
            if (finalOrder.isPresent()) {
                status = finalOrder.get().getStatus();
                orderType = finalOrder.get().isSubscriptionOrder()
                    ? finalOrder.get().getSubscriptionType().name()
                    : "COURSE";
            }
        }
        return new ReturnResult(true, txnRef, responseCode, status, orderType);
    }

    private void fulfillOrder(Order order) {
        if (order.isSubscriptionOrder()) {
            fulfillSubscription(order);
        } else {
            fulfillEnrollment(order);
        }
    }

    private void fulfillSubscription(Order order) {
        if (order.getUser() == null || order.getSubscriptionType() == null) return;
        // Eagerly fetch user to avoid LazyInitializationException in IPN context
        User user = userRepository.findById(order.getUser().getId()).orElse(null);
        if (user == null) return;
        // Idempotency: check if this exact order already activated a subscription
        if (subscriptionRepository.existsByOrderId(order.getId())) {
            LOG.info("Subscription already activated for order {}, skipping", order.getId());
            return;
        }
        proSubscriptionService.activateSubscription(user, order.getSubscriptionType(), order);
    }

    private void fulfillEnrollment(Order order) {
        if (order.getUser() == null || order.getCourse() == null) {
            return;
        }
        String login = order.getUser().getLogin();
        Long courseId = order.getCourse().getId();
        if (login == null || courseId == null) {
            return;
        }

        if (enrollmentRepository.existsByUserLoginAndCourseId(login, courseId)) {
            return;
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(order.getUser());
        enrollment.setCourse(order.getCourse());
        enrollment.setEnrolledAt(Instant.now());
        enrollment.setStatus("ACTIVE");
        enrollmentRepository.save(enrollment);
    }

    private String buildPaymentUrl(Order order, String clientIp, String bankCode) {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnPayProperties.getTmnCode());
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", order.getPaymentTxnRef());
        params.put("vnp_OrderInfo", "Order " + order.getId());
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnPayProperties.getReturnUrl());
        params.put("vnp_IpAddr", clientIp);
        // Optional bankCode: VNPAYQR | VNBANK | INTCARD | NCB | null (let VNPay choose)
        if (bankCode != null && !bankCode.isBlank()) {
            params.put("vnp_BankCode", bankCode);
        }
        Instant now = Instant.now();
        params.put("vnp_CreateDate", VN_PAY_DATE_FORMAT.format(now));
        params.put("vnp_ExpireDate", VN_PAY_DATE_FORMAT.format(now.plusSeconds(15 * 60)));

        long amount = order.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();
        params.put("vnp_Amount", String.valueOf(amount));

        // Build secure hash like VNPay demo (exclude vnp_SecureHashType and vnp_IpnUrl)
        Map<String, String> hashParams = new HashMap<>(params);
        hashParams.remove("vnp_SecureHashType");
        hashParams.remove("vnp_IpnUrl");
        String hashData = VnPayQuery.buildHashData(hashParams);
        String secureHash = VnPayCrypto.hmacSha512(vnPayProperties.getHashSecret(), hashData);

        // Send vnp_SecureHashType and vnp_IpnUrl in query
        params.put("vnp_SecureHashType", "HMACSHA512");
        String query = VnPayQuery.buildQueryString(params);
        return vnPayProperties.getPayUrl() + "?" + query + "&vnp_SecureHash=" + secureHash;
    }

    private String generateTxnRef(Order order, User user, Course course) {
        // Unique enough for most cases; also protected by DB unique constraint.
        return UUID.randomUUID().toString().replace("-", "");
    }

    private Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        return userRepository.findOneByLogin(authentication.getName());
    }

    public record CreatePaymentResult(Long orderId, String txnRef, String paymentUrl) {}

    public record ReturnResult(boolean signatureValid, String txnRef, String responseCode, OrderStatus orderStatus, String orderType) {}

    public record IpnHandleResult(String RspCode, String Message) {
        public static IpnHandleResult ok() {
            return new IpnHandleResult("00", "Confirm Success");
        }

        public static IpnHandleResult fail(String code, String message) {
            return new IpnHandleResult(code, message);
        }
    }
}
