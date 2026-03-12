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
    private final com.naammm.trickcode.repository.LessonRepository lessonRepository;
    private final com.naammm.trickcode.repository.EnrollmentRepository enrollmentRepository;
    private final UserService userService;

    public LessonProgressService(
        LessonProgressRepository lessonProgressRepository,
        com.naammm.trickcode.repository.LessonRepository lessonRepository,
        com.naammm.trickcode.repository.EnrollmentRepository enrollmentRepository,
        UserService userService
    ) {
        this.lessonProgressRepository = lessonProgressRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userService = userService;
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

    /**
     * Mark a lesson as completed for the current user.
     */
    @Transactional
    public Optional<LessonProgress> completeLesson(Long lessonId) {
        LOG.debug("Request to complete lesson : {}", lessonId);
        com.naammm.trickcode.domain.User currentUser = userService.getUserWithAuthorities().orElse(null);
        if (currentUser == null) return Optional.empty();

        com.naammm.trickcode.domain.Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null) return Optional.empty();

        List<LessonProgress> existing = lessonProgressRepository.findByUserIsCurrentUser();
        LessonProgress progress = existing.stream()
            .filter(lp -> lp.getLesson() != null && lp.getLesson().getId().equals(lessonId))
            .findFirst()
            .orElseGet(() -> {
                LessonProgress lp = new LessonProgress();
                lp.setUser(currentUser);
                lp.setLesson(lesson);
                return lp;
            });

        // if already completed, just return
        if (Boolean.TRUE.equals(progress.getIsCompleted())) {
            return Optional.of(progress);
        }

        progress.setIsCompleted(true);
        progress.setCompletedAt(java.time.Instant.now());

        // find enrollment
        Long courseId = lesson.getSection() != null && lesson.getSection().getCourse() != null
            ? lesson.getSection().getCourse().getId() : null;

        if (courseId != null) {
            com.naammm.trickcode.domain.Enrollment enrollment = enrollmentRepository.findByUserIsCurrentUser().stream()
                .filter(e -> e.getCourse() != null && e.getCourse().getId().equals(courseId))
                .findFirst().orElse(null);
            if (enrollment != null) {
                progress.setEnrollment(enrollment);
            }
        }

        return Optional.of(lessonProgressRepository.save(progress));
    }

    /**
     * Get the learning progress of the current user for a specific course.
     */
    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getCourseProgress(Long courseId) {
        LOG.debug("Request to get progress for course : {}", courseId);
        com.naammm.trickcode.domain.User currentUser = userService.getUserWithAuthorities().orElse(null);
        if (currentUser == null) {
            return java.util.Map.of(
                "totalLessons", 0,
                "completedLessons", 0,
                "progressPercent", 0
            );
        }

        // 1. Get total lessons in the course
        long totalLessons = lessonRepository.countBySectionCourseId(courseId);

        // 2. Get completed lessons for this user in this course
        // We fetch all progress for the user and filter down.
        // It's reasonably efficient assuming progress per user is not massive.
        // Alternatively, we could add a custom JPQL query in LessonProgressRepository.
        List<LessonProgress> allProgress = lessonProgressRepository.findByUserIsCurrentUser();
        
        long completedLessons = allProgress.stream()
            .filter(lp -> Boolean.TRUE.equals(lp.getIsCompleted()))
            .filter(lp -> lp.getLesson() != null)
            .filter(lp -> {
                com.naammm.trickcode.domain.Lesson l = lp.getLesson();
                return l.getSection() != null &&
                       l.getSection().getCourse() != null &&
                       l.getSection().getCourse().getId().equals(courseId);
            })
            .count();

        int progressPercent = totalLessons == 0 ? 0 : (int) Math.round((double) completedLessons / totalLessons * 100);

        List<Long> completedLessonIds = allProgress.stream()
            .filter(lp -> Boolean.TRUE.equals(lp.getIsCompleted()))
            .filter(lp -> lp.getLesson() != null)
            .filter(lp -> {
                com.naammm.trickcode.domain.Lesson l = lp.getLesson();
                return l.getSection() != null &&
                       l.getSection().getCourse() != null &&
                       l.getSection().getCourse().getId().equals(courseId);
            })
            .map(lp -> lp.getLesson().getId())
            .toList();

        return java.util.Map.of(
            "courseId", courseId,
            "totalLessons", totalLessons,
            "completedLessons", completedLessons,
            "progressPercent", progressPercent,
            "completedLessonIds", completedLessonIds
        );
    }
}
