package com.naammm.trickcode.repository;

import com.naammm.trickcode.domain.Lesson;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Lesson entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long>, JpaSpecificationExecutor<Lesson> {
    long countBySectionCourseId(Long courseId);
    java.util.List<Lesson> findBySectionCourseId(Long courseId);
}
