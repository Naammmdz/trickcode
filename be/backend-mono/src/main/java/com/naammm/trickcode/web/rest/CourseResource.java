package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.domain.Course;
import com.naammm.trickcode.domain.User;
import com.naammm.trickcode.domain.enumeration.CourseStatus;
import com.naammm.trickcode.repository.CourseRepository;
import com.naammm.trickcode.repository.UserRepository;
import com.naammm.trickcode.service.CourseAccessService;
import com.naammm.trickcode.service.CourseQueryService;
import com.naammm.trickcode.service.CourseService;
import com.naammm.trickcode.service.criteria.CourseCriteria;
import com.naammm.trickcode.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.service.filter.LongFilter;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import tech.jhipster.service.filter.StringFilter;

/**
 * REST controller for managing {@link com.naammm.trickcode.domain.Course}.
 */
@RestController
@RequestMapping("/api/courses")
public class CourseResource {

    private static final Logger LOG = LoggerFactory.getLogger(CourseResource.class);

    private static final String ENTITY_NAME = "course";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CourseService courseService;

    private final CourseRepository courseRepository;

    private final CourseQueryService courseQueryService;

    private final UserRepository userRepository;

    private final CourseAccessService courseAccessService;

    public CourseResource(CourseService courseService, CourseRepository courseRepository, CourseQueryService courseQueryService, UserRepository userRepository, CourseAccessService courseAccessService) {
        this.courseService = courseService;
        this.courseRepository = courseRepository;
        this.courseQueryService = courseQueryService;
        this.userRepository = userRepository;
        this.courseAccessService = courseAccessService;
    }

    /**
     * {@code POST  /courses} : Create a new course.
     *
     * @param course the course to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new course, or with status {@code 400 (Bad Request)} if the course has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) throws URISyntaxException {
        LOG.debug("REST request to save Course : {}", course);
        if (course.getId() != null) {
            throw new BadRequestAlertException("A new course cannot already have an ID", ENTITY_NAME, "idexists");
        }
        course = courseService.save(course);
        return ResponseEntity.created(new URI("/api/courses/" + course.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, course.getId().toString()))
            .body(course);
    }

    /**
     * {@code PUT  /courses/:id} : Updates an existing course.
     *
     * @param id the id of the course to save.
     * @param course the course to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course,
     * or with status {@code 400 (Bad Request)} if the course is not valid,
     * or with status {@code 500 (Internal Server Error)} if the course couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Course course
    ) throws URISyntaxException {
        LOG.debug("REST request to update Course : {}, {}", id, course);
        if (course.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, course.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        course = courseService.update(course);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, course.getId().toString()))
            .body(course);
    }

    /**
     * {@code PATCH  /courses/:id} : Partial updates given fields of an existing course, field will ignore if it is null
     *
     * @param id the id of the course to save.
     * @param course the course to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course,
     * or with status {@code 400 (Bad Request)} if the course is not valid,
     * or with status {@code 404 (Not Found)} if the course is not found,
     * or with status {@code 500 (Internal Server Error)} if the course couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Course> partialUpdateCourse(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Course course
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Course partially : {}, {}", id, course);
        if (course.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, course.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Course> result = courseService.partialUpdate(course);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, course.getId().toString())
        );
    }

    /**
     * {@code GET  /courses} : get all the courses.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courses in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Course>> getAllCourses(
        CourseCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get Courses by criteria: {}", criteria);

        Page<Course> page = courseQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /courses/count} : count all the courses.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countCourses(CourseCriteria criteria) {
        LOG.debug("REST request to count Courses by criteria: {}", criteria);
        return ResponseEntity.ok().body(courseQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /courses/:id} : get the "id" course.
     *
     * @param id the id of the course to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the course, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Course : {}", id);
        Optional<Course> course = courseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(course);
    }

    /**
     * {@code GET  /courses/:id/access} : check if current user has access to course content.
     *
     * @param id the id of the course to check access.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and body containing access info.
     */
    @GetMapping("/{id}/access")
    public ResponseEntity<CourseAccessResponse> checkCourseAccess(@PathVariable("id") Long id) {
        LOG.debug("REST request to check access to Course : {}", id);
        boolean hasAccess = courseAccessService.hasAccessToCourse(id);
        boolean isAdmin = courseAccessService.isAdmin();
        boolean isStaff = courseAccessService.isStaff();
        boolean isEnrolled = courseAccessService.isEnrolled(id);
        boolean isInstructor = courseAccessService.isInstructor(id);
        
        return ResponseEntity.ok(new CourseAccessResponse(hasAccess, isAdmin, isStaff, isEnrolled, isInstructor));
    }

    /**
     * Inner class for course access response
     */
    public static class CourseAccessResponse {
        private boolean hasAccess;
        private boolean isAdmin;
        private boolean isStaff;
        private boolean isEnrolled;
        private boolean isInstructor;

        public CourseAccessResponse(boolean hasAccess, boolean isAdmin, boolean isStaff, boolean isEnrolled, boolean isInstructor) {
            this.hasAccess = hasAccess;
            this.isAdmin = isAdmin;
            this.isStaff = isStaff;
            this.isEnrolled = isEnrolled;
            this.isInstructor = isInstructor;
        }

        public boolean isHasAccess() {
            return hasAccess;
        }

        public void setHasAccess(boolean hasAccess) {
            this.hasAccess = hasAccess;
        }

        public boolean isAdmin() {
            return isAdmin;
        }

        public void setAdmin(boolean admin) {
            isAdmin = admin;
        }

        public boolean isStaff() {
            return isStaff;
        }

        public void setStaff(boolean staff) {
            isStaff = staff;
        }

        public boolean isEnrolled() {
            return isEnrolled;
        }

        public void setEnrolled(boolean enrolled) {
            isEnrolled = enrolled;
        }

        public boolean isInstructor() {
            return isInstructor;
        }

        public void setInstructor(boolean instructor) {
            isInstructor = instructor;
        }
    }

    /**
     * {@code GET  /courses/public} : get all published courses for public/marketplace.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of published courses in body.
     */
    @GetMapping("/public")
    public ResponseEntity<List<Course>> getPublicCourses(
        CourseCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get public Courses by criteria: {}", criteria);
        
        // Force status to PUBLISHED only
        if (criteria.getStatus() == null) {
            criteria.setStatus(new CourseCriteria.CourseStatusFilter());
        }
        criteria.getStatus().setEquals(CourseStatus.PUBLISHED);
        
        Page<Course> page = courseQueryService.findByCriteriaWithEagerRelationships(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /courses/my-courses} : get all courses of current instructor.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of instructor's courses in body.
     */
    @GetMapping("/my-courses")
    public ResponseEntity<List<Course>> getMyInstructorCourses(
        CourseCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get my instructor Courses by criteria: {}", criteria);
        
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> user = userRepository.findOneByLogin(login);
        
        if (user.isEmpty()) {
            return ResponseEntity.ok().body(List.of());
        }
        
        // Filter by instructor ID
        if (criteria.getInstructorId() == null) {
            criteria.setInstructorId(new LongFilter());
        }
        criteria.getInstructorId().setEquals(user.get().getId());
        
        Page<Course> page = courseQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code DELETE  /courses/:id} : delete the "id" course.
     *
     * @param id the id of the course to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Course : {}", id);
        courseService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code POST  /courses/:id/approve} : approve and publish a course.
     *
     * @param id the id of the course to approve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course.
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<Course> approveCourse(@PathVariable("id") Long id) {
        LOG.debug("REST request to approve Course : {}", id);
        Optional<Course> courseOptional = courseService.findOne(id);
        
        if (courseOptional.isEmpty()) {
            throw new BadRequestAlertException("Course not found", ENTITY_NAME, "idnotfound");
        }
        
        Course course = courseOptional.get();
        course.setStatus(CourseStatus.PUBLISHED);
        course.setPublishedAt(Instant.now());
        course.setRejectionReason(null); // Clear any previous rejection reason
        
        Course result = courseService.update(course);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, course.getId().toString()))
            .body(result);
    }

    /**
     * {@code POST  /courses/:id/reject} : reject a course with reason.
     *
     * @param id the id of the course to reject.
     * @param request the rejection request containing reason.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course.
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<Course> rejectCourse(@PathVariable("id") Long id, @RequestBody RejectCourseRequest request) {
        LOG.debug("REST request to reject Course : {} with reason: {}", id, request.getReason());
        Optional<Course> courseOptional = courseService.findOne(id);
        
        if (courseOptional.isEmpty()) {
            throw new BadRequestAlertException("Course not found", ENTITY_NAME, "idnotfound");
        }
        
        if (request.getReason() == null || request.getReason().trim().isEmpty()) {
            throw new BadRequestAlertException("Rejection reason is required", ENTITY_NAME, "reasonrequired");
        }
        
        Course course = courseOptional.get();
        course.setStatus(CourseStatus.REJECTED);
        course.setRejectionReason(request.getReason());
        
        Course result = courseService.update(course);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, course.getId().toString()))
            .body(result);
    }

    /**
     * {@code POST  /courses/:id/publish} : publish a course.
     *
     * @param id the id of the course to publish.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course.
     */
    @PostMapping("/{id}/publish")
    public ResponseEntity<Course> publishCourse(@PathVariable("id") Long id) {
        LOG.debug("REST request to publish Course : {}", id);
        Optional<Course> courseOptional = courseService.findOne(id);
        
        if (courseOptional.isEmpty()) {
            throw new BadRequestAlertException("Course not found", ENTITY_NAME, "idnotfound");
        }
        
        Course course = courseOptional.get();
        course.setStatus(CourseStatus.PUBLISHED);
        if (course.getPublishedAt() == null) {
            course.setPublishedAt(Instant.now());
        }
        
        Course result = courseService.update(course);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, course.getId().toString()))
            .body(result);
    }

    /**
     * {@code POST  /courses/:id/unpublish} : unpublish a course (set to draft).
     *
     * @param id the id of the course to unpublish.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated course.
     */
    @PostMapping("/{id}/unpublish")
    public ResponseEntity<Course> unpublishCourse(@PathVariable("id") Long id) {
        LOG.debug("REST request to unpublish Course : {}", id);
        Optional<Course> courseOptional = courseService.findOne(id);
        
        if (courseOptional.isEmpty()) {
            throw new BadRequestAlertException("Course not found", ENTITY_NAME, "idnotfound");
        }
        
        Course course = courseOptional.get();
        course.setStatus(CourseStatus.DRAFT);
        
        Course result = courseService.update(course);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, course.getId().toString()))
            .body(result);
    }

    /**
     * Request body for rejecting a course
     */
    public static class RejectCourseRequest {
        private String reason;

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }
}
