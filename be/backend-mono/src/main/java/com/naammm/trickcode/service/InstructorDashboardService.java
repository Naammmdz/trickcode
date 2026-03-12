package com.naammm.trickcode.service;

import com.naammm.trickcode.domain.Course;
import com.naammm.trickcode.domain.Enrollment;
import com.naammm.trickcode.domain.Order;
import com.naammm.trickcode.domain.enumeration.CourseStatus;
import com.naammm.trickcode.domain.enumeration.OrderStatus;
import com.naammm.trickcode.repository.CourseRepository;
import com.naammm.trickcode.repository.EnrollmentRepository;
import com.naammm.trickcode.repository.OrderRepository;
import com.naammm.trickcode.service.dto.ChartDataDTO;
import com.naammm.trickcode.service.dto.InstructorDashboardStatsDTO;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class InstructorDashboardService {

    private static final BigDecimal INSTRUCTOR_SHARE = new BigDecimal("0.80"); // 80% to instructor

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final OrderRepository orderRepository;

    public InstructorDashboardService(CourseRepository courseRepository, EnrollmentRepository enrollmentRepository, OrderRepository orderRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.orderRepository = orderRepository;
    }

    private String getCurrentUserLogin() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private List<Long> getInstructorCourseIds(String login) {
        return courseRepository.findAllByInstructorLogin(login)
            .stream()
            .map(Course::getId)
            .collect(Collectors.toList());
    }

    public InstructorDashboardStatsDTO getStats() {
        String login = getCurrentUserLogin();
        InstructorDashboardStatsDTO stats = new InstructorDashboardStatsDTO();

        stats.setTotalCourses(courseRepository.countByInstructorLogin(login));
        stats.setPublishedCourses(courseRepository.countByInstructorLoginAndStatus(login, CourseStatus.PUBLISHED));
        stats.setPendingCourses(courseRepository.countByInstructorLoginAndStatus(login, CourseStatus.PENDING));
        stats.setDraftCourses(courseRepository.countByInstructorLoginAndStatus(login, CourseStatus.DRAFT));

        List<Long> courseIds = getInstructorCourseIds(login);

        if (courseIds.isEmpty()) {
            stats.setTotalStudents(0);
            stats.setTotalRevenue(BigDecimal.ZERO);
            stats.setRecentEnrollments(Collections.emptyList());
            stats.setCourseStats(Collections.emptyList());
            return stats;
        }

        // Total students (unique enrollments across all courses)
        long totalStudents = courseIds.stream()
            .mapToLong(enrollmentRepository::countByCourseId)
            .sum();
        stats.setTotalStudents(totalStudents);

        // Fetch instructor's courses
        List<Course> courses = courseRepository.findAllByInstructorLogin(login);

        // Total gross revenue (course price * enrollments)
        BigDecimal grossRevenue = courses.stream()
            .map(course -> {
                BigDecimal price = course.getPrice() != null ? course.getPrice() : BigDecimal.ZERO;
                long enrolls = enrollmentRepository.countByCourseId(course.getId());
                return price.multiply(BigDecimal.valueOf(enrolls));
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        // Instructor net revenue (80%)
        stats.setTotalRevenue(grossRevenue.multiply(INSTRUCTOR_SHARE));

        // Recent enrollments (last 10)
        List<Enrollment> recentEnrollments = enrollmentRepository.findByCourseIdInOrderByEnrolledAtDesc(courseIds);
        stats.setRecentEnrollments(
            recentEnrollments.stream()
                .limit(10)
                .map(e -> new InstructorDashboardStatsDTO.RecentEnrollmentDTO(
                    e.getUser() != null ? e.getUser().getLogin() : "N/A",
                    e.getUser() != null ? e.getUser().getEmail() : "N/A",
                    e.getCourse() != null ? e.getCourse().getTitle() : "N/A",
                    e.getCourse() != null ? e.getCourse().getId() : null,
                    e.getEnrolledAt()
                ))
                .toList()
        );

        // Per-course stats
        stats.setCourseStats(
            courses.stream().map(course -> {
                long enrollCount = enrollmentRepository.countByCourseId(course.getId());
                BigDecimal price = course.getPrice() != null ? course.getPrice() : BigDecimal.ZERO;
                BigDecimal courseRevenue = price.multiply(BigDecimal.valueOf(enrollCount)).multiply(INSTRUCTOR_SHARE);
                return new InstructorDashboardStatsDTO.CourseStatDTO(
                    course.getId(),
                    course.getTitle(),
                    course.getStatus() != null ? course.getStatus().name() : "DRAFT",
                    course.getLevel() != null ? course.getLevel().name() : null,
                    course.getPrice(),
                    enrollCount,
                    courseRevenue,
                    course.getThumbnailUrl()
                );
            }).toList()
        );

        return stats;
    }

    public ChartDataDTO getChartData() {
        String login = getCurrentUserLogin();
        List<Long> courseIds = getInstructorCourseIds(login);

        Instant startDate = Instant.now().minus(30, ChronoUnit.DAYS);
        ZoneId zoneId = ZoneId.systemDefault();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;

        if (courseIds.isEmpty()) {
            return new ChartDataDTO(
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList(),
                Collections.emptyList()
            );
        }

        // 1. Daily Revenue (calculated from course price * enrollments per day)
        List<Course> courses = courseRepository.findAllByInstructorLogin(login);
        List<Enrollment> allEnrollments = enrollmentRepository.findByCourseIdInAndEnrolledAtGreaterThanEqual(courseIds, startDate);
        Map<Long, BigDecimal> coursePriceMap = courses.stream()
            .collect(Collectors.toMap(Course::getId, c -> c.getPrice() != null ? c.getPrice() : BigDecimal.ZERO));
        Map<String, BigDecimal> revenueMap = allEnrollments.stream()
            .collect(Collectors.groupingBy(
                e -> LocalDate.ofInstant(e.getEnrolledAt(), zoneId).format(formatter),
                Collectors.reducing(BigDecimal.ZERO,
                    e -> coursePriceMap.getOrDefault(e.getCourse() != null ? e.getCourse().getId() : 0L, BigDecimal.ZERO).multiply(INSTRUCTOR_SHARE),
                    BigDecimal::add)
            ));
        Map<String, BigDecimal> sortedRevenue = new TreeMap<>(revenueMap);
        List<ChartDataDTO.DataPoint> dailyRevenue = sortedRevenue.entrySet().stream()
            .map(entry -> new ChartDataDTO.DataPoint(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        // 2. Daily Enrollments
        Map<String, Long> enrollmentMap = allEnrollments.stream()
            .collect(Collectors.groupingBy(
                e -> LocalDate.ofInstant(e.getEnrolledAt(), zoneId).format(formatter),
                Collectors.counting()
            ));
        Map<String, Long> sortedEnrollments = new TreeMap<>(enrollmentMap);
        List<ChartDataDTO.DataPoint> dailyEnrollments = sortedEnrollments.entrySet().stream()
            .map(entry -> new ChartDataDTO.DataPoint(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        // 3. Courses by Level
        Map<String, Long> levelMap = courses.stream()
            .filter(c -> c.getLevel() != null)
            .collect(Collectors.groupingBy(c -> c.getLevel().name(), Collectors.counting()));
        List<ChartDataDTO.DataPoint> coursesByLevel = levelMap.entrySet().stream()
            .map(entry -> new ChartDataDTO.DataPoint(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        // 4. Courses by Status
        Map<String, Long> statusMap = courses.stream()
            .filter(c -> c.getStatus() != null)
            .collect(Collectors.groupingBy(c -> c.getStatus().name(), Collectors.counting()));
        List<ChartDataDTO.DataPoint> coursesByStatus = statusMap.entrySet().stream()
            .map(entry -> new ChartDataDTO.DataPoint(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());

        return new ChartDataDTO(dailyRevenue, dailyEnrollments, coursesByLevel, coursesByStatus);
    }

    /**
     * Get payout/transaction data for the instructor (completed orders for their courses).
     */
    public List<InstructorDashboardStatsDTO.CourseStatDTO> getPayoutData() {
        String login = getCurrentUserLogin();
        List<Course> courses = courseRepository.findAllByInstructorLogin(login);

        return courses.stream().map(course -> {
            long enrollCount = enrollmentRepository.countByCourseId(course.getId());
            BigDecimal price = course.getPrice() != null ? course.getPrice() : BigDecimal.ZERO;
            BigDecimal courseRevenue = price.multiply(BigDecimal.valueOf(enrollCount)).multiply(INSTRUCTOR_SHARE);
            return new InstructorDashboardStatsDTO.CourseStatDTO(
                course.getId(),
                course.getTitle(),
                course.getStatus() != null ? course.getStatus().name() : "DRAFT",
                course.getLevel() != null ? course.getLevel().name() : null,
                course.getPrice(),
                enrollCount,
                courseRevenue,
                course.getThumbnailUrl()
            );
        }).toList();
    }

    /**
     * Get all enrollments for the instructor's courses with student details.
     */
    public List<InstructorDashboardStatsDTO.RecentEnrollmentDTO> getAllEnrollments() {
        String login = getCurrentUserLogin();
        List<Long> courseIds = getInstructorCourseIds(login);

        if (courseIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Enrollment> enrollments = enrollmentRepository.findByCourseIdInOrderByEnrolledAtDesc(courseIds);
        return enrollments.stream()
            .map(e -> new InstructorDashboardStatsDTO.RecentEnrollmentDTO(
                e.getUser() != null ? e.getUser().getLogin() : "N/A",
                e.getUser() != null ? e.getUser().getEmail() : "N/A",
                e.getCourse() != null ? e.getCourse().getTitle() : "N/A",
                e.getCourse() != null ? e.getCourse().getId() : null,
                e.getEnrolledAt()
            ))
            .toList();
    }
}
