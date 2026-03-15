package com.naammm.trickcode.repository;

import com.naammm.trickcode.domain.InstructorApplication;
import com.naammm.trickcode.domain.enumeration.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstructorApplicationRepository extends JpaRepository<InstructorApplication, Long> {

    List<InstructorApplication> findAllByOrderByCreatedAtDesc();

    List<InstructorApplication> findAllByStatusOrderByCreatedAtDesc(ApplicationStatus status);

    Optional<InstructorApplication> findTopByUserLoginOrderByCreatedAtDesc(String login);

    boolean existsByUserLoginAndStatusIn(String login, List<ApplicationStatus> statuses);
}
