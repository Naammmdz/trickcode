package com.naammm.trickcode.service;

import com.naammm.trickcode.domain.LessonProgress;
import com.naammm.trickcode.repository.LessonProgressRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.naammm.trickcode.domain.LessonProgress}.
 */
@Service
@Transactional
public class LessonProgressService {

    private static final Logger LOG = LoggerFactory.getLogger(LessonProgressService.class);

    private final LessonProgressRepository lessonProgressRepository;

    public LessonProgressService(LessonProgressRepository lessonProgressRepository) {
        this.lessonProgressRepository = lessonProgressRepository;
    }

    /**
     * Save a lessonProgress.
     *
     * @param lessonProgress the entity to save.
     * @return the persisted entity.
     */
    public LessonProgress save(LessonProgress lessonProgress) {
        LOG.debug("Request to save LessonProgress : {}", lessonProgress);
        return lessonProgressRepository.save(lessonProgress);
    }

    /**
     * Update a lessonProgress.
     *
     * @param lessonProgress the entity to save.
     * @return the persisted entity.
     */
    public LessonProgress update(LessonProgress lessonProgress) {
        LOG.debug("Request to update LessonProgress : {}", lessonProgress);
        return lessonProgressRepository.save(lessonProgress);
    }

    /**
     * Partially update a lessonProgress.
     *
     * @param lessonProgress the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<LessonProgress> partialUpdate(LessonProgress lessonProgress) {
        LOG.debug("Request to partially update LessonProgress : {}", lessonProgress);

        return lessonProgressRepository
            .findById(lessonProgress.getId())
            .map(existingLessonProgress -> {
                if (lessonProgress.getCompletedAt() != null) {
                    existingLessonProgress.setCompletedAt(lessonProgress.getCompletedAt());
                }
                if (lessonProgress.getIsCompleted() != null) {
                    existingLessonProgress.setIsCompleted(lessonProgress.getIsCompleted());
                }

                return existingLessonProgress;
            })
            .map(lessonProgressRepository::save);
    }

    /**
     * Get all the lessonProgresses.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<LessonProgress> findAll() {
        LOG.debug("Request to get all LessonProgresses");
        return lessonProgressRepository.findAll();
    }

    /**
     * Get all the lessonProgresses with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<LessonProgress> findAllWithEagerRelationships(Pageable pageable) {
        return lessonProgressRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one lessonProgress by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<LessonProgress> findOne(Long id) {
        LOG.debug("Request to get LessonProgress : {}", id);
        return lessonProgressRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the lessonProgress by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete LessonProgress : {}", id);
        lessonProgressRepository.deleteById(id);
    }
}
