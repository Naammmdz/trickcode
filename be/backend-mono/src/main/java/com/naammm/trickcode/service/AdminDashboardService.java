package com.naammm.trickcode.service;

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
import java.util.TreeMap;
import java.util.stream.Collectors;
import com.naammm.trickcode.domain.Course;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final OrderRepository orderRepository;

    public AdminDashboardService(UserRepository userRepository, CourseRepository courseRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.orderRepository = orderRepository;
    }

    public AdminDashboardStatsDTO getDashboardStats() {
        AdminDashboardStatsDTO stats = new AdminDashboardStatsDTO();

        // Key Metrics
        stats.setTotalUsers(userRepository.count());
        stats.setTotalCourses(courseRepository.count());
        stats.setPendingCourses(courseRepository.countByStatus(CourseStatus.PENDING));

        BigDecimal totalRevenue = orderRepository.sumTotalAmountByStatus(OrderStatus.COMPLETED).orElse(BigDecimal.ZERO);
        stats.setTotalRevenue(totalRevenue);

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
                .map(order ->
                    new AdminDashboardStatsDTO.RecentOrderDTO(
                        order.getId(),
                        order.getUser() != null ? order.getUser().getLogin() : "N/A",
                        order.getCourse() != null ? order.getCourse().getTitle() : "N/A",
                        order.getTotalAmount(),
                        order.getStatus(),
                        order.getCreatedAt()
                    )
                )
                .toList()
        );

        return stats;
    }

    public ChartDataDTO getChartData() {
        Instant startDate = Instant.now().minus(30, ChronoUnit.DAYS);
        ZoneId zoneId = ZoneId.systemDefault();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;

        // 1. Daily Revenue (Java Aggregation)
        // Fetch raw orders
        List<Order> orders = orderRepository.findAllByStatusAndCreatedAtGreaterThanEqual(OrderStatus.COMPLETED, startDate);
        
        // Group by Date and Sum Amount
        Map<String, BigDecimal> revenueMap = orders.stream()
            .collect(Collectors.groupingBy(
                order -> LocalDate.ofInstant(order.getCreatedAt(), zoneId).format(formatter),
                Collectors.reducing(BigDecimal.ZERO, Order::getTotalAmount, BigDecimal::add)
            ));

        // Ensure all days are present (optional, but good for charts) -> TreeMap for sorting
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
