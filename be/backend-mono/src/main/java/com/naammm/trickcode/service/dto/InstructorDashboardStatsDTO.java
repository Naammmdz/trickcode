package com.naammm.trickcode.service.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class InstructorDashboardStatsDTO {

    private long totalCourses;
    private long publishedCourses;
    private long pendingCourses;
    private long draftCourses;
    private long totalStudents;
    private BigDecimal totalRevenue;
    private List<RecentEnrollmentDTO> recentEnrollments;
    private List<CourseStatDTO> courseStats;

    // Getters and Setters

    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    public long getPublishedCourses() { return publishedCourses; }
    public void setPublishedCourses(long publishedCourses) { this.publishedCourses = publishedCourses; }

    public long getPendingCourses() { return pendingCourses; }
    public void setPendingCourses(long pendingCourses) { this.pendingCourses = pendingCourses; }

    public long getDraftCourses() { return draftCourses; }
    public void setDraftCourses(long draftCourses) { this.draftCourses = draftCourses; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public List<RecentEnrollmentDTO> getRecentEnrollments() { return recentEnrollments; }
    public void setRecentEnrollments(List<RecentEnrollmentDTO> recentEnrollments) { this.recentEnrollments = recentEnrollments; }

    public List<CourseStatDTO> getCourseStats() { return courseStats; }
    public void setCourseStats(List<CourseStatDTO> courseStats) { this.courseStats = courseStats; }

    public static class RecentEnrollmentDTO {
        private String userLogin;
        private String userEmail;
        private String courseTitle;
        private Long courseId;
        private Instant enrolledAt;

        public RecentEnrollmentDTO(String userLogin, String userEmail, String courseTitle, Long courseId, Instant enrolledAt) {
            this.userLogin = userLogin;
            this.userEmail = userEmail;
            this.courseTitle = courseTitle;
            this.courseId = courseId;
            this.enrolledAt = enrolledAt;
        }

        public String getUserLogin() { return userLogin; }
        public void setUserLogin(String userLogin) { this.userLogin = userLogin; }
        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
        public String getCourseTitle() { return courseTitle; }
        public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public Instant getEnrolledAt() { return enrolledAt; }
        public void setEnrolledAt(Instant enrolledAt) { this.enrolledAt = enrolledAt; }
    }

    public static class CourseStatDTO {
        private Long courseId;
        private String courseTitle;
        private String status;
        private String level;
        private BigDecimal price;
        private long enrollmentCount;
        private BigDecimal revenue;
        private String thumbnailUrl;

        public CourseStatDTO(Long courseId, String courseTitle, String status, String level, BigDecimal price, long enrollmentCount, BigDecimal revenue, String thumbnailUrl) {
            this.courseId = courseId;
            this.courseTitle = courseTitle;
            this.status = status;
            this.level = level;
            this.price = price;
            this.enrollmentCount = enrollmentCount;
            this.revenue = revenue;
            this.thumbnailUrl = thumbnailUrl;
        }

        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        public String getCourseTitle() { return courseTitle; }
        public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public long getEnrollmentCount() { return enrollmentCount; }
        public void setEnrollmentCount(long enrollmentCount) { this.enrollmentCount = enrollmentCount; }
        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
        public String getThumbnailUrl() { return thumbnailUrl; }
        public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    }
}
