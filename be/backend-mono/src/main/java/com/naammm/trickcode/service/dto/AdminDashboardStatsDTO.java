package com.naammm.trickcode.service.dto;

import com.naammm.trickcode.domain.enumeration.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * DTO for holding statistics for the admin dashboard.
 */
public class AdminDashboardStatsDTO {

    private long totalUsers;
    private long totalCourses;
    private long pendingCourses;
    private BigDecimal totalRevenue;
    private List<RecentUserDTO> recentUsers;
    private List<RecentOrderDTO> recentOrders;

    // Getters and Setters

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getPendingCourses() {
        return pendingCourses;
    }

    public void setPendingCourses(long pendingCourses) {
        this.pendingCourses = pendingCourses;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<RecentUserDTO> getRecentUsers() {
        return recentUsers;
    }

    public void setRecentUsers(List<RecentUserDTO> recentUsers) {
        this.recentUsers = recentUsers;
    }

    public List<RecentOrderDTO> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<RecentOrderDTO> recentOrders) {
        this.recentOrders = recentOrders;
    }

    /**
     * A simplified DTO for displaying recent user registrations.
     */
    public static class RecentUserDTO {

        private String login;
        private String email;
        private Instant createdDate;

        public RecentUserDTO(String login, String email, Instant createdDate) {
            this.login = login;
            this.email = email;
            this.createdDate = createdDate;
        }

        public String getLogin() {
            return login;
        }

        public void setLogin(String login) {
            this.login = login;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Instant getCreatedDate() {
            return createdDate;
        }

        public void setCreatedDate(Instant createdDate) {
            this.createdDate = createdDate;
        }
    }

    /**
     * A simplified DTO for displaying recent orders.
     */
    public static class RecentOrderDTO {

        private Long id;
        private String userLogin;
        private String courseTitle;
        private BigDecimal totalAmount;
        private OrderStatus status;
        private Instant createdDate;

        public RecentOrderDTO(Long id, String userLogin, String courseTitle, BigDecimal totalAmount, OrderStatus status, Instant createdDate) {
            this.id = id;
            this.userLogin = userLogin;
            this.courseTitle = courseTitle;
            this.totalAmount = totalAmount;
            this.status = status;
            this.createdDate = createdDate;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUserLogin() {
            return userLogin;
        }

        public void setUserLogin(String userLogin) {
            this.userLogin = userLogin;
        }

        public String getCourseTitle() {
            return courseTitle;
        }

        public void setCourseTitle(String courseTitle) {
            this.courseTitle = courseTitle;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }

        public OrderStatus getStatus() {
            return status;
        }

        public void setStatus(OrderStatus status) {
            this.status = status;
        }

        public Instant getCreatedDate() {
            return createdDate;
        }

        public void setCreatedDate(Instant createdDate) {
            this.createdDate = createdDate;
        }
    }
}
