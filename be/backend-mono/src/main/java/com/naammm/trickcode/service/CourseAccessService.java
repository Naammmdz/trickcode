package com.naammm.trickcode.service;

import com.naammm.trickcode.domain.Course;
import com.naammm.trickcode.repository.CourseRepository;
import com.naammm.trickcode.repository.EnrollmentRepository;
import com.naammm.trickcode.security.AuthoritiesConstants;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service for checking course access permissions
 */
@Service
@Transactional(readOnly = true)
public class CourseAccessService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public CourseAccessService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    /**
     * Check if current user has access to view course content
     * @param courseId the course ID
     * @return true if user is admin, instructor of the course, or enrolled
     */
    public boolean hasAccessToCourse(Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String login = authentication.getName();

        // Admin or Staff has access to all courses
        if (isAdminOrStaff()) {
            return true;
        }

        // Check if user is the instructor
        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isPresent() && course.get().getInstructor() != null 
            && login.equals(course.get().getInstructor().getLogin())) {
            return true;
        }

        // Check if user is enrolled
        return enrollmentRepository.existsByUserLoginAndCourseId(login, courseId);
    }

    /**
     * Check if current user is admin
     */
    public boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority(AuthoritiesConstants.ADMIN));
    }

    /**
     * Check if current user is staff
     */
    public boolean isStaff() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority(AuthoritiesConstants.STAFF));
    }

    /**
     * Check if current user is admin or staff (both have course management permissions)
     */
    public boolean isAdminOrStaff() {
        return isAdmin() || isStaff();
    }

    /**
     * Check if current user is enrolled in a course
     */
    public boolean isEnrolled(Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String login = authentication.getName();
        return enrollmentRepository.existsByUserLoginAndCourseId(login, courseId);
    }

    /**
     * Check if current user is the instructor of the course
     */
    public boolean isInstructor(Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        String login = authentication.getName();
        Optional<Course> course = courseRepository.findById(courseId);
        return course.isPresent() && course.get().getInstructor() != null 
            && login.equals(course.get().getInstructor().getLogin());
    }
}
