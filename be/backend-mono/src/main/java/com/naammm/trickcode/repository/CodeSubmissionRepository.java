package com.naammm.trickcode.repository;

import com.naammm.trickcode.domain.CodeSubmission;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, Long> {

    @Query("SELECT cs FROM CodeSubmission cs WHERE cs.user.login = ?#{authentication.name} AND cs.lesson.id = :lessonId ORDER BY cs.submittedAt DESC")
    List<CodeSubmission> findByCurrentUserAndLesson(@Param("lessonId") Long lessonId, Pageable pageable);

    @Query("SELECT cs FROM CodeSubmission cs WHERE cs.user.login = ?#{authentication.name} ORDER BY cs.submittedAt DESC")
    List<CodeSubmission> findByCurrentUser(Pageable pageable);

    @Query("SELECT COUNT(cs) FROM CodeSubmission cs WHERE cs.user.login = ?#{authentication.name} AND cs.lesson.id = :lessonId AND cs.status = 'ACCEPTED'")
    long countAcceptedByCurrentUserAndLesson(@Param("lessonId") Long lessonId);
}
