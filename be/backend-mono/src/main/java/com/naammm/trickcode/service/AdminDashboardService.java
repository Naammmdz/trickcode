package com.naammm.trickcode.service;

import com.naammm.trickcode.config.PaymentProperties;
import com.naammm.trickcode.domain.Order;
import com.naammm.trickcode.domain.User;
import com.naammm.trickcode.domain.enumeration.CourseStatus;
import com.naammm.trickcode.domain.enumeration.OrderStatus;
import com.naammm.trickcode.repository.CourseRepository;
import com.naammm.trickcode.repository.OrderRepository;
import com.naammm.trickcode.repository.UserRepository;
import com.naammm.trickcode.service.dto.AdminDashboardStatsDTO;
import java.math.BigDecimal;
import com.naammm.trickcode.service.dto.ChartDataDTO;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;
import com.naammm.trickcode.domain.Course;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AdminDashboardService {

    private static final BigDecimal PLATFORM_COMMISSION_RATE = new BigDecimal("0.20"); // 20%

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final OrderRepository orderRepository;
    private final ProSubscriptionService proSubscriptionService;
    private final BigDecimal vndToUsdRate;

    public AdminDashboardService(UserRepository userRepository, CourseRepository courseRepository,
                                  OrderRepository orderRepository,
                                  ProSubscriptionService proSubscriptionService,
                                  PaymentProperties paymentProperties) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.orderRepository = orderRepository;
        this.proSubscriptionService = proSubscriptionService;
        BigDecimal usdToVnd = paymentProperties.getUsdToVndRate() != null
            ? paymentProperties.getUsdToVndRate() : BigDecimal.valueOf(25000);
        this.vndToUsdRate = BigDecimal.ONE.divide(usdToVnd, 10, java.math.RoundingMode.HALF_UP);
    }

    /** Convert order VND amount back to USD */
    private BigDecimal toUsd(Order order) {
        BigDecimal amount = order.getTotalAmount();
        if (amount == null) return BigDecimal.ZERO;
        return amount.multiply(vndToUsdRate).setScale(2, java.math.RoundingMode.HALF_UP);
    }

    public AdminDashboardStatsDTO getDashboardStats() {
        AdminDashboardStatsDTO stats = new AdminDashboardStatsDTO();

        // Key Metrics
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCourses(courseRepository.count());
        stats.setPendingCourses(courseRepository.countByStatus(CourseStatus.PENDING));

        // All completed orders — single source of truth for revenue
        List<Order> completedOrders = orderRepository.findAllByStatusAndCreatedAtGreaterThanEqual(
            OrderStatus.COMPLETED, Instant.EPOCH);

        // Course Revenue (USD) — from completed course orders (stored in VND, convert back)
        BigDecimal courseRevenue = completedOrders.stream()
            .filter(order -> !order.isSubscriptionOrder())
            .map(this::toUsd)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Subscription Revenue (USD) — from completed subscription orders
        BigDecimal subscriptionRevenue = completedOrders.stream()
            .filter(Order::isSubscriptionOrder)
            .map(order -> proSubscriptionService.getPriceUsd(order.getSubscriptionType()))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Commission: 20% of course revenue + 100% of subscription revenue
        BigDecimal courseCommission = courseRevenue.multiply(PLATFORM_COMMISSION_RATE);
        BigDecimal platformCommission = courseCommission.add(subscriptionRevenue);
        BigDecimal instructorPayouts = courseRevenue.subtract(courseCommission);
        BigDecimal totalRevenue = courseRevenue.add(subscriptionRevenue);

        stats.setCourseRevenue(courseRevenue);
        stats.setSubscriptionRevenue(subscriptionRevenue);
        stats.setTotalRevenue(totalRevenue);
        stats.setPlatformCommission(platformCommission);
        stats.setInstructorPayouts(instructorPayouts);

        // Recent Activity
        List<User> recentUsers = userRepository.findTop5ByOrderByCreatedDateDesc();
        stats.setRecentUsers(
            recentUsers
                .stream()
                .map(user -> new AdminDashboardStatsDTO.RecentUserDTO(user.getLogin(), user.getEmail(), user.getCreatedDate()))
                .toList()
        );

        List<Order> recentOrders = orderRepository.findTop5ByOrderByIdDesc();
        stats.setRecentOrders(
            recentOrders
                .stream()
                .map(order -> {
                    String title;
                    BigDecimal displayAmount;
                    if (order.isSubscriptionOrder()) {
                        title = order.getSubscriptionType().name().replace("_", " ") + " Subscription";
                        displayAmount = proSubscriptionService.getPriceUsd(order.getSubscriptionType());
                    } else {
                        title = order.getCourse() != null ? order.getCourse().getTitle() : "N/A";
                        displayAmount = order.getCourse() != null && order.getCourse().getPrice() != null
                            ? order.getCourse().getPrice() : BigDecimal.ZERO;
                    }
                    return new AdminDashboardStatsDTO.RecentOrderDTO(
                        order.getId(),
                        order.getUser() != null ? order.getUser().getLogin() : "N/A",
                        title,
                        displayAmount,
                        order.getStatus(),
                        order.getCreatedAt()
                    );
                })
                .toList()
        );

        return stats;
    }

    public ChartDataDTO getChartData(int days) {
        Instant startDate = Instant.now().minus(days, ChronoUnit.DAYS);
        ZoneId zoneId = ZoneId.systemDefault();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;

        // 1. Daily Revenue in USD
        List<Order> orders = orderRepository.findAllByStatusAndCreatedAtGreaterThanEqual(OrderStatus.COMPLETED, startDate);

        Map<String, BigDecimal> revenueMap = orders.stream()
            .collect(Collectors.groupingBy(
                order -> LocalDate.ofInstant(order.getCreatedAt(), zoneId).format(formatter),
                Collectors.reducing(BigDecimal.ZERO, this::toUsd, BigDecimal::add)
            ));

        List<ChartDataDTO.DataPoint> dailyRevenue = fillMissingDates(revenueMap, days, zoneId, formatter);

        // 2. Daily Signups
        List<User> users = userRepository.findAllByCreatedDateGreaterThanEqual(startDate);

        Map<String, Long> signupsMap = users.stream()
            .collect(Collectors.groupingBy(
                user -> LocalDate.ofInstant(user.getCreatedDate(), zoneId).format(formatter),
                Collectors.counting()
            ));

        List<ChartDataDTO.DataPoint> dailyActivity = fillMissingDates(signupsMap, days, zoneId, formatter);

        // 3. Courses by Level
        List<Course> allCourses = courseRepository.findAll();
        Map<String, Long> levelMap = allCourses.stream()
            .filter(c -> c.getLevel() != null)
            .collect(Collectors.groupingBy(c -> c.getLevel().name(), Collectors.counting()));
        
        List<ChartDataDTO.DataPoint> coursesByLevel = levelMap.entrySet().stream()
            .map(entry -> new ChartDataDTO.DataPoint(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        // 4. Courses by Status
        Map<String, Long> statusMap = allCourses.stream()
            .filter(c -> c.getStatus() != null)
            .collect(Collectors.groupingBy(c -> c.getStatus().name(), Collectors.counting()));

        List<ChartDataDTO.DataPoint> coursesByStatus = statusMap.entrySet().stream()
            .map(entry -> new ChartDataDTO.DataPoint(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        return new ChartDataDTO(dailyRevenue, dailyActivity, coursesByLevel, coursesByStatus);
    }

    /**
     * Fill missing dates in a time-series map, producing a continuous DataPoint list.
     */
    private <V extends Number> List<ChartDataDTO.DataPoint> fillMissingDates(
        Map<String, V> dataMap, int days, ZoneId zoneId, DateTimeFormatter formatter
    ) {
        LocalDate today = LocalDate.now(zoneId);
        LocalDate start = today.minusDays(days);
        List<ChartDataDTO.DataPoint> result = new java.util.ArrayList<>();
        for (LocalDate d = start; !d.isAfter(today); d = d.plusDays(1)) {
            String key = d.format(formatter);
            V val = dataMap.get(key);
            result.add(new ChartDataDTO.DataPoint(key, val != null ? val : 0));
        }
        return result;
    }
}
