package com.naammm.trickcode.service;

import com.naammm.trickcode.domain.*; // for static metamodels
import com.naammm.trickcode.domain.Course;
import com.naammm.trickcode.repository.CourseRepository;
import com.naammm.trickcode.service.criteria.CourseCriteria;
import jakarta.persistence.criteria.JoinType;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Course} entities in the database.
 * The main input is a {@link CourseCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link Course} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class CourseQueryService extends QueryService<Course> {

    private static final Logger LOG = LoggerFactory.getLogger(CourseQueryService.class);

    private final CourseRepository courseRepository;

    public CourseQueryService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    /**
     * Return a {@link Page} of {@link Course} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Course> findByCriteria(CourseCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Course> specification = createSpecification(criteria);
        return courseRepository.findAll(specification, page);
    }

    /**
     * Return a {@link Page} of {@link Course} with eagerly loaded relationships (categories, instructor).
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities with eager relationships.
     */
    @Transactional(readOnly = true)
    public Page<Course> findByCriteriaWithEagerRelationships(CourseCriteria criteria, Pageable page) {
        LOG.debug("find by criteria with eager relationships : {}, page: {}", criteria, page);
        final Specification<Course> specification = createSpecification(criteria);
        Page<Course> result = courseRepository.findAll(specification, page);
        result.getContent().forEach(course -> {
            Hibernate.initialize(course.getCategories());
            Hibernate.initialize(course.getInstructor());
        });
        return result;
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(CourseCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Course> specification = createSpecification(criteria);
        return courseRepository.count(specification);
    }

    /**
     * Function to convert {@link CourseCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Course> createSpecification(CourseCriteria criteria) {
        Specification<Course> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            specification = Specification.allOf(
                Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : null,
                buildRangeSpecification(criteria.getId(), Course_.id),
                buildStringSpecification(criteria.getTitle(), Course_.title),
                buildRangeSpecification(criteria.getPrice(), Course_.price),
                buildRangeSpecification(criteria.getOldPrice(), Course_.oldPrice),
                buildSpecification(criteria.getLevel(), Course_.level),
                buildSpecification(criteria.getStatus(), Course_.status),
                buildStringSpecification(criteria.getThumbnailUrl(), Course_.thumbnailUrl),
                buildStringSpecification(criteria.getVideoPreviewUrl(), Course_.videoPreviewUrl),
                buildStringSpecification(criteria.getRejectionReason(), Course_.rejectionReason),
                buildRangeSpecification(criteria.getCreatedAt(), Course_.createdAt),
                buildRangeSpecification(criteria.getUpdatedAt(), Course_.updatedAt),
                buildRangeSpecification(criteria.getPublishedAt(), Course_.publishedAt),
                buildSpecification(criteria.getSectionsId(), root -> root.join(Course_.sections, JoinType.LEFT).get(Section_.id)),
                buildSpecification(criteria.getInstructorId(), root -> root.join(Course_.instructor, JoinType.LEFT).get(User_.id)),
                buildSpecification(criteria.getCategoriesId(), root -> root.join(Course_.categories, JoinType.LEFT).get(Category_.id))
            );
        }
        return specification;
    }
}
