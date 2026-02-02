package com.naammm.course.service;

import com.naammm.course.domain.*; // for static metamodels
import com.naammm.course.domain.Lesson;
import com.naammm.course.repository.LessonRepository;
import com.naammm.course.service.criteria.LessonCriteria;
import jakarta.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Lesson} entities in the database.
 * The main input is a {@link LessonCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link Lesson} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class LessonQueryService extends QueryService<Lesson> {

    private static final Logger LOG = LoggerFactory.getLogger(LessonQueryService.class);

    private final LessonRepository lessonRepository;

    public LessonQueryService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    /**
     * Return a {@link Page} of {@link Lesson} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Lesson> findByCriteria(LessonCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Lesson> specification = createSpecification(criteria);
        return lessonRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(LessonCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Lesson> specification = createSpecification(criteria);
        return lessonRepository.count(specification);
    }

    /**
     * Function to convert {@link LessonCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Lesson> createSpecification(LessonCriteria criteria) {
        Specification<Lesson> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            specification = Specification.allOf(
                Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : null,
                buildRangeSpecification(criteria.getId(), Lesson_.id),
                buildStringSpecification(criteria.getTitle(), Lesson_.title),
                buildSpecification(criteria.getType(), Lesson_.type),
                buildRangeSpecification(criteria.getOrderIndex(), Lesson_.orderIndex),
                buildRangeSpecification(criteria.getDurationSeconds(), Lesson_.durationSeconds),
                buildSpecification(criteria.getIsPreview(), Lesson_.isPreview),
                buildStringSpecification(criteria.getVideoUrl(), Lesson_.videoUrl),
                buildStringSpecification(criteria.getCaptionUrl(), Lesson_.captionUrl),
                buildSpecification(criteria.getSectionId(), root -> root.join(Lesson_.section, JoinType.LEFT).get(Section_.id))
            );
        }
        return specification;
    }
}
