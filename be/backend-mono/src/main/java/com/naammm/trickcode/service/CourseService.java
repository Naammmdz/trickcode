package com.naammm.trickcode.service;

import com.naammm.trickcode.domain.Course;
import com.naammm.trickcode.repository.CourseRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.naammm.trickcode.domain.Course}.
 */
@Service
@Transactional
public class CourseService {

    private static final Logger LOG = LoggerFactory.getLogger(CourseService.class);

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    /**
     * Save a course.
     *
     * @param course the entity to save.
     * @return the persisted entity.
     */
    public Course save(Course course) {
        LOG.debug("Request to save Course : {}", course);
        return courseRepository.save(course);
    }

    /**
     * Update a course.
     *
     * @param course the entity to save.
     * @return the persisted entity.
     */
    public Course update(Course course) {
        LOG.debug("Request to update Course : {}", course);
        return courseRepository.save(course);
    }

    /**
     * Partially update a course.
     *
     * @param course the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Course> partialUpdate(Course course) {
        LOG.debug("Request to partially update Course : {}", course);

        return courseRepository
            .findById(course.getId())
            .map(existingCourse -> {
                if (course.getTitle() != null) {
                    existingCourse.setTitle(course.getTitle());
                }
                if (course.getDescription() != null) {
                    existingCourse.setDescription(course.getDescription());
                }
                if (course.getPrice() != null) {
                    existingCourse.setPrice(course.getPrice());
                }
                if (course.getOldPrice() != null) {
                    existingCourse.setOldPrice(course.getOldPrice());
                }
                if (course.getLevel() != null) {
                    existingCourse.setLevel(course.getLevel());
                }
                if (course.getStatus() != null) {
                    existingCourse.setStatus(course.getStatus());
                }
                if (course.getThumbnailUrl() != null) {
                    existingCourse.setThumbnailUrl(course.getThumbnailUrl());
                }
                if (course.getVideoPreviewUrl() != null) {
                    existingCourse.setVideoPreviewUrl(course.getVideoPreviewUrl());
                }
                if (course.getRejectionReason() != null) {
                    existingCourse.setRejectionReason(course.getRejectionReason());
                }
                if (course.getCreatedAt() != null) {
                    existingCourse.setCreatedAt(course.getCreatedAt());
                }
                if (course.getUpdatedAt() != null) {
                    existingCourse.setUpdatedAt(course.getUpdatedAt());
                }
                if (course.getPublishedAt() != null) {
                    existingCourse.setPublishedAt(course.getPublishedAt());
                }

                return existingCourse;
            })
            .map(courseRepository::save);
    }

    /**
     * Get one course by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Course> findOne(Long id) {
        LOG.debug("Request to get Course : {}", id);
        return courseRepository.findById(id);
    }

    /**
     * Delete the course by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Course : {}", id);
        courseRepository.deleteById(id);
    }
}
