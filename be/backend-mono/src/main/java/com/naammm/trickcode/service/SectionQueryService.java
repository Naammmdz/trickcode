package com.naammm.trickcode.service;

import com.naammm.trickcode.domain.*; // for static metamodels
import com.naammm.trickcode.domain.Section;
import com.naammm.trickcode.repository.SectionRepository;
import com.naammm.trickcode.service.criteria.SectionCriteria;
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
 * Service for executing complex queries for {@link Section} entities in the database.
 * The main input is a {@link SectionCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link Section} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class SectionQueryService extends QueryService<Section> {

    private static final Logger LOG = LoggerFactory.getLogger(SectionQueryService.class);

    private final SectionRepository sectionRepository;

    public SectionQueryService(SectionRepository sectionRepository) {
        this.sectionRepository = sectionRepository;
    }

    /**
     * Return a {@link Page} of {@link Section} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Section> findByCriteria(SectionCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Section> specification = createSpecification(criteria);
        return sectionRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(SectionCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Section> specification = createSpecification(criteria);
        return sectionRepository.count(specification);
    }

    /**
     * Function to convert {@link SectionCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Section> createSpecification(SectionCriteria criteria) {
        Specification<Section> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            specification = Specification.allOf(
                Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : null,
                buildRangeSpecification(criteria.getId(), Section_.id),
                buildStringSpecification(criteria.getTitle(), Section_.title),
                buildRangeSpecification(criteria.getOrderIndex(), Section_.orderIndex),
                buildSpecification(criteria.getLessonsId(), root -> root.join(Section_.lessons, JoinType.LEFT).get(Lesson_.id)),
                buildSpecification(criteria.getCourseId(), root -> root.join(Section_.course, JoinType.LEFT).get(Course_.id))
            );
        }
        return specification;
    }
}
