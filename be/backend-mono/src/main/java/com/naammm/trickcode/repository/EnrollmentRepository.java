package com.naammm.trickcode.repository;

import com.naammm.trickcode.domain.Enrollment;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Enrollment entity.
 */
@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long>, JpaSpecificationExecutor<Enrollment> {
    @Query("select enrollment from Enrollment enrollment where enrollment.user.login = ?#{authentication.name}")
    List<Enrollment> findByUserIsCurrentUser();

    default Optional<Enrollment> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Enrollment> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Enrollment> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select enrollment from Enrollment enrollment left join fetch enrollment.user left join fetch enrollment.course",
        countQuery = "select count(enrollment) from Enrollment enrollment"
    )
    Page<Enrollment> findAllWithToOneRelationships(Pageable pageable);

    @Query("select enrollment from Enrollment enrollment left join fetch enrollment.user left join fetch enrollment.course")
    List<Enrollment> findAllWithToOneRelationships();

    @Query(
        "select enrollment from Enrollment enrollment left join fetch enrollment.user left join fetch enrollment.course where enrollment.id =:id"
    )
    Optional<Enrollment> findOneWithToOneRelationships(@Param("id") Long id);

    /**
     * Check if a user is enrolled in a course
     */
    @Query("select case when count(e) > 0 then true else false end from Enrollment e where e.user.login = :login and e.course.id = :courseId")
    boolean existsByUserLoginAndCourseId(@Param("login") String login, @Param("courseId") Long courseId);

    /**
     * Find enrollments by current user with eager-loaded course (paginated)
     */
    @Query(
        value = "select e from Enrollment e left join fetch e.user left join fetch e.course where e.user.login = ?#{authentication.name}",
        countQuery = "select count(e) from Enrollment e where e.user.login = ?#{authentication.name}"
    )
    Page<Enrollment> findByCurrentUserWithCourse(Pageable pageable);

    long countByCourseId(Long courseId);

    @Query("select e from Enrollment e left join fetch e.user left join fetch e.course where e.course.id in :courseIds order by e.enrolledAt desc")
    List<Enrollment> findByCourseIdInOrderByEnrolledAtDesc(@Param("courseIds") List<Long> courseIds);

    @Query("select e from Enrollment e where e.course.id in :courseIds and e.enrolledAt >= :startDate")
    List<Enrollment> findByCourseIdInAndEnrolledAtGreaterThanEqual(@Param("courseIds") List<Long> courseIds, @Param("startDate") Instant startDate);
}
