package com.naammm.course.service;

import com.naammm.course.domain.Lesson;
import com.naammm.course.repository.LessonRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.naammm.course.domain.Lesson}.
 */
@Service
@Transactional
public class LessonService {

    private static final Logger LOG = LoggerFactory.getLogger(LessonService.class);

    private final LessonRepository lessonRepository;

    public LessonService(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    /**
     * Save a lesson.
     *
     * @param lesson the entity to save.
     * @return the persisted entity.
     */
    public Lesson save(Lesson lesson) {
        LOG.debug("Request to save Lesson : {}", lesson);
        return lessonRepository.save(lesson);
    }

    /**
     * Update a lesson.
     *
     * @param lesson the entity to save.
     * @return the persisted entity.
     */
    public Lesson update(Lesson lesson) {
        LOG.debug("Request to update Lesson : {}", lesson);
        return lessonRepository.save(lesson);
    }

    /**
     * Partially update a lesson.
     *
     * @param lesson the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Lesson> partialUpdate(Lesson lesson) {
        LOG.debug("Request to partially update Lesson : {}", lesson);

        return lessonRepository
            .findById(lesson.getId())
            .map(existingLesson -> {
                if (lesson.getTitle() != null) {
                    existingLesson.setTitle(lesson.getTitle());
                }
                if (lesson.getType() != null) {
                    existingLesson.setType(lesson.getType());
                }
                if (lesson.getOrderIndex() != null) {
                    existingLesson.setOrderIndex(lesson.getOrderIndex());
                }
                if (lesson.getDurationSeconds() != null) {
                    existingLesson.setDurationSeconds(lesson.getDurationSeconds());
                }
                if (lesson.getIsPreview() != null) {
                    existingLesson.setIsPreview(lesson.getIsPreview());
                }
                if (lesson.getVideoUrl() != null) {
                    existingLesson.setVideoUrl(lesson.getVideoUrl());
                }
                if (lesson.getCaptionUrl() != null) {
                    existingLesson.setCaptionUrl(lesson.getCaptionUrl());
                }
                if (lesson.getMarkdownContent() != null) {
                    existingLesson.setMarkdownContent(lesson.getMarkdownContent());
                }
                if (lesson.getQuizConfig() != null) {
                    existingLesson.setQuizConfig(lesson.getQuizConfig());
                }
                if (lesson.getCodeChallengeConfig() != null) {
                    existingLesson.setCodeChallengeConfig(lesson.getCodeChallengeConfig());
                }

                return existingLesson;
            })
            .map(lessonRepository::save);
    }

    /**
     * Get one lesson by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Lesson> findOne(Long id) {
        LOG.debug("Request to get Lesson : {}", id);
        return lessonRepository.findById(id);
    }

    /**
     * Delete the lesson by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Lesson : {}", id);
        lessonRepository.deleteById(id);
    }
}
