package com.naammm.trickcode.service;

import com.naammm.trickcode.domain.Order;
import com.naammm.trickcode.domain.User;
import com.naammm.trickcode.domain.enumeration.CourseStatus;
import com.naammm.trickcode.domain.enumeration.OrderStatus;
import com.naammm.trickcode.repository.CourseRepository;
import com.naammm.trickcode.repository.EnrollmentRepository;
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
import java.util.TreeMap;
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
    private final EnrollmentRepository enrollmentRepository;
    private final ProSubscriptionService proSubscriptionService;

    public AdminDashboardService(UserRepository userRepository, CourseRepository courseRepository,
                                  OrderRepository orderRepository, EnrollmentRepository enrollmentRepository,
                                  ProSubscriptionService proSubscriptionService) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.orderRepository = orderRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.proSubscriptionService = proSubscriptionService;
    }

    public AdminDashboardStatsDTO getDashboardStats() {
        AdminDashboardStatsDTO stats = new AdminDashboardStatsDTO();

        // Key Metrics
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCourses(courseRepository.count());
        stats.setPendingCourses(courseRepository.countByStatus(CourseStatus.PENDING));

        // Course Revenue (USD) — calculated from course.price × enrollment count
        List<Course> allCourses = courseRepository.findAll();
        BigDecimal courseRevenue = allCourses.stream()
            .map(course -> {
                BigDecimal price = course.getPrice() != null ? course.getPrice() : BigDecimal.ZERO;
                long enrolls = enrollmentRepository.countByCourseId(course.getId());
                return price.multiply(BigDecimal.valueOf(enrolls));
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Subscription Revenue (USD) — from completed subscription orders
        List<Order> completedOrders = orderRepository.findAllByStatusAndCreatedAtGreaterThanEqual(
            OrderStatus.COMPLETED, java.time.Instant.EPOCH);
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

    public ChartDataDTO getChartData() {
        Instant startDate = Instant.now().minus(30, ChronoUnit.DAYS);
        ZoneId zoneId = ZoneId.systemDefault();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;

        // 1. Daily Revenue in USD
        List<Order> orders = orderRepository.findAllByStatusAndCreatedAtGreaterThanEqual(OrderStatus.COMPLETED, startDate);

        Map<String, BigDecimal> revenueMap = orders.stream()
            .collect(Collectors.groupingBy(
                order -> LocalDate.ofInstant(order.getCreatedAt(), zoneId).format(formatter),
                Collectors.reducing(BigDecimal.ZERO, order -> {
                    if (order.isSubscriptionOrder()) {
                        return proSubscriptionService.getPriceUsd(order.getSubscriptionType());
                    } else if (order.getCourse() != null && order.getCourse().getPrice() != null) {
                        return order.getCourse().getPrice();
                    }
                    return BigDecimal.ZERO;
                }, BigDecimal::add)
            ));

        Map<String, BigDecimal> sortedRevenue = new TreeMap<>(revenueMap);

        List<ChartDataDTO.DataPoint> dailyRevenue = sortedRevenue.entrySet().stream()
            .map(entry -> new ChartDataDTO.DataPoint(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        // 2. Daily Signups (Java Aggregation)
        List<User> users = userRepository.findAllByCreatedDateGreaterThanEqual(startDate);
        
        Map<String, Long> signupsMap = users.stream()
            .collect(Collectors.groupingBy(
                user -> LocalDate.ofInstant(user.getCreatedDate(), zoneId).format(formatter),
                Collectors.counting()
            ));

        Map<String, Long> sortedSignups = new TreeMap<>(signupsMap);

        List<ChartDataDTO.DataPoint> dailySignups = sortedSignups.entrySet().stream()
            .map(entry -> new ChartDataDTO.DataPoint(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

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

        return new ChartDataDTO(dailyRevenue, dailySignups, coursesByLevel, coursesByStatus);
    }
}
