package com.naammm.trickcode.service;

import com.naammm.trickcode.domain.InstructorApplication;
import com.naammm.trickcode.domain.User;
import com.naammm.trickcode.domain.enumeration.ApplicationStatus;
import com.naammm.trickcode.repository.InstructorApplicationRepository;
import com.naammm.trickcode.repository.UserRepository;
import com.naammm.trickcode.security.AuthoritiesConstants;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import com.naammm.trickcode.domain.Authority;

@Service
@Transactional
public class InstructorApplicationService {

    private final InstructorApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public InstructorApplicationService(InstructorApplicationRepository applicationRepository,
                                         UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    private String getCurrentLogin() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    /**
     * Submit a new application. Fails if user already has a pending/approved one.
     */
    public InstructorApplication submit(String fullName, String bio, String experience, String motivation) {
        String login = getCurrentLogin();
        if (applicationRepository.existsByUserLoginAndStatusIn(login,
                List.of(ApplicationStatus.PENDING, ApplicationStatus.APPROVED))) {
            throw new IllegalStateException("You already have an active application.");
        }

        User user = userRepository.findOneByLogin(login)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        InstructorApplication app = new InstructorApplication();
        app.setUser(user);
        app.setFullName(fullName);
        app.setBio(bio);
        app.setExperience(experience);
        app.setMotivation(motivation);
        app.setStatus(ApplicationStatus.PENDING);
        app.setCreatedAt(Instant.now());

        return applicationRepository.save(app);
    }

    /**
     * Get the current user's latest application.
     */
    @Transactional(readOnly = true)
    public Optional<InstructorApplication> getMyApplication() {
        return applicationRepository.findTopByUserLoginOrderByCreatedAtDesc(getCurrentLogin());
    }

    /**
     * Admin: get all applications.
     */
    @Transactional(readOnly = true)
    public List<InstructorApplication> getAllApplications() {
        return applicationRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Admin: approve an application — sets ROLE_INSTRUCTOR on the user.
     */
    public InstructorApplication approve(Long applicationId) {
        InstructorApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Only pending applications can be approved.");
        }

        app.setStatus(ApplicationStatus.APPROVED);
        app.setReviewedAt(Instant.now());
        app.setReviewedBy(getCurrentLogin());

        // Add ROLE_INSTRUCTOR to the user
        User user = app.getUser();
        Authority instructorAuth = new Authority();
        instructorAuth.setName(AuthoritiesConstants.INSTRUCTOR);
        user.getAuthorities().add(instructorAuth);
        userRepository.save(user);

        return applicationRepository.save(app);
    }

    /**
     * Admin: reject an application with reason.
     */
    public InstructorApplication reject(Long applicationId, String reason) {
        InstructorApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        if (app.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("Only pending applications can be rejected.");
        }

        app.setStatus(ApplicationStatus.REJECTED);
        app.setRejectionReason(reason);
        app.setReviewedAt(Instant.now());
        app.setReviewedBy(getCurrentLogin());

        return applicationRepository.save(app);
    }
}
