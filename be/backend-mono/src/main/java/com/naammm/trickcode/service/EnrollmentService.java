package com.naammm.trickcode.service;

import com.naammm.trickcode.domain.Enrollment;
import com.naammm.trickcode.repository.EnrollmentRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.naammm.trickcode.domain.Enrollment}.
 */
@Service
@Transactional
public class EnrollmentService {

    private static final Logger LOG = LoggerFactory.getLogger(EnrollmentService.class);

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    /**
     * Save a enrollment.
     *
     * @param enrollment the entity to save.
     * @return the persisted entity.
     */
    public Enrollment save(Enrollment enrollment) {
        LOG.debug("Request to save Enrollment : {}", enrollment);
        return enrollmentRepository.save(enrollment);
    }

    /**
     * Update a enrollment.
     *
     * @param enrollment the entity to save.
     * @return the persisted entity.
     */
    public Enrollment update(Enrollment enrollment) {
        LOG.debug("Request to update Enrollment : {}", enrollment);
        return enrollmentRepository.save(enrollment);
    }

    /**
     * Partially update a enrollment.
     *
     * @param enrollment the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Enrollment> partialUpdate(Enrollment enrollment) {
        LOG.debug("Request to partially update Enrollment : {}", enrollment);

        return enrollmentRepository
            .findById(enrollment.getId())
            .map(existingEnrollment -> {
                if (enrollment.getEnrolledAt() != null) {
                    existingEnrollment.setEnrolledAt(enrollment.getEnrolledAt());
                }
                if (enrollment.getCompletedAt() != null) {
                    existingEnrollment.setCompletedAt(enrollment.getCompletedAt());
                }
                if (enrollment.getStatus() != null) {
                    existingEnrollment.setStatus(enrollment.getStatus());
                }

                return existingEnrollment;
            })
            .map(enrollmentRepository::save);
    }

    /**
     * Get all the enrollments with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Enrollment> findAllWithEagerRelationships(Pageable pageable) {
        return enrollmentRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one enrollment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Enrollment> findOne(Long id) {
        LOG.debug("Request to get Enrollment : {}", id);
        return enrollmentRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the enrollment by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Enrollment : {}", id);
        enrollmentRepository.deleteById(id);
    }
}
