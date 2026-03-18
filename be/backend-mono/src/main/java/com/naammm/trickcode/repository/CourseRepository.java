package com.naammm.trickcode.repository;

import com.naammm.trickcode.domain.Course;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import com.naammm.trickcode.domain.enumeration.CourseStatus;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Course entity.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, JpaSpecificationExecutor<Course> {
    @Query("select course from Course course where course.instructor.login = ?#{authentication.name}")
    List<Course> findByInstructorIsCurrentUser();

    default Optional<Course> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Course> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Course> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct course from Course course left join fetch course.instructor left join fetch course.categories",
        countQuery = "select count(distinct course) from Course course"
    )
    Page<Course> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct course from Course course left join fetch course.instructor left join fetch course.categories")
    List<Course> findAllWithToOneRelationships();

    @Query("select course from Course course left join fetch course.instructor left join fetch course.categories where course.id =:id")
    Optional<Course> findOneWithToOneRelationships(@Param("id") Long id);

    long countByStatus(CourseStatus status);

    long countByInstructorLoginAndStatus(String login, CourseStatus status);

    long countByInstructorLogin(String login);

    List<Course> findAllByInstructorLogin(String login);

    List<Course> findAllByStatus(CourseStatus status);
}
