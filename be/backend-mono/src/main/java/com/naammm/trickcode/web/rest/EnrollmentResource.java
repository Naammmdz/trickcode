package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.domain.Enrollment;
import com.naammm.trickcode.repository.EnrollmentRepository;
import com.naammm.trickcode.service.EnrollmentQueryService;
import com.naammm.trickcode.service.EnrollmentService;
import com.naammm.trickcode.service.criteria.EnrollmentCriteria;
import com.naammm.trickcode.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.naammm.trickcode.domain.Enrollment}.
 */
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentResource {

    private static final Logger LOG = LoggerFactory.getLogger(EnrollmentResource.class);

    private static final String ENTITY_NAME = "enrollment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EnrollmentService enrollmentService;

    private final EnrollmentRepository enrollmentRepository;

    private final EnrollmentQueryService enrollmentQueryService;

    public EnrollmentResource(
        EnrollmentService enrollmentService,
        EnrollmentRepository enrollmentRepository,
        EnrollmentQueryService enrollmentQueryService
    ) {
        this.enrollmentService = enrollmentService;
        this.enrollmentRepository = enrollmentRepository;
        this.enrollmentQueryService = enrollmentQueryService;
    }

    /**
     * {@code POST  /enrollments} : Create a new enrollment.
     *
     * @param enrollment the enrollment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new enrollment, or with status {@code 400 (Bad Request)} if the enrollment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Enrollment> createEnrollment(@Valid @RequestBody Enrollment enrollment) throws URISyntaxException {
        LOG.debug("REST request to save Enrollment : {}", enrollment);
        if (enrollment.getId() != null) {
            throw new BadRequestAlertException("A new enrollment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        enrollment = enrollmentService.save(enrollment);
        return ResponseEntity.created(new URI("/api/enrollments/" + enrollment.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, enrollment.getId().toString()))
            .body(enrollment);
    }

    /**
     * {@code PUT  /enrollments/:id} : Updates an existing enrollment.
     *
     * @param id the id of the enrollment to save.
     * @param enrollment the enrollment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated enrollment,
     * or with status {@code 400 (Bad Request)} if the enrollment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the enrollment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Enrollment> updateEnrollment(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Enrollment enrollment
    ) throws URISyntaxException {
        LOG.debug("REST request to update Enrollment : {}, {}", id, enrollment);
        if (enrollment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, enrollment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!enrollmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        enrollment = enrollmentService.update(enrollment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, enrollment.getId().toString()))
            .body(enrollment);
    }

    /**
     * {@code PATCH  /enrollments/:id} : Partial updates given fields of an existing enrollment, field will ignore if it is null
     *
     * @param id the id of the enrollment to save.
     * @param enrollment the enrollment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated enrollment,
     * or with status {@code 400 (Bad Request)} if the enrollment is not valid,
     * or with status {@code 404 (Not Found)} if the enrollment is not found,
     * or with status {@code 500 (Internal Server Error)} if the enrollment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Enrollment> partialUpdateEnrollment(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Enrollment enrollment
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Enrollment partially : {}, {}", id, enrollment);
        if (enrollment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, enrollment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!enrollmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Enrollment> result = enrollmentService.partialUpdate(enrollment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, enrollment.getId().toString())
        );
    }

    /**
     * {@code GET  /enrollments} : get all the enrollments.
     *
     * @param pageable the pagination information.
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of enrollments in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Enrollment>> getAllEnrollments(
        EnrollmentCriteria criteria,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get Enrollments by criteria: {}", criteria);

        Page<Enrollment> page = enrollmentQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET /enrollments/my} : get enrollments of current user (eager load course).
     */
    @GetMapping("/my")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get my Enrollments");
        Page<Enrollment> page = enrollmentRepository.findAllWithEagerRelationships(pageable);
        List<Enrollment> mine = page.getContent().stream().filter(e -> e.getUser() != null && e.getUser().getLogin() != null)
            .filter(e -> e.getUser().getLogin().equals(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName()))
            .toList();
        return ResponseEntity.ok().body(mine);
    }

    /**
     * {@code GET  /enrollments/count} : count all the enrollments.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/count")
    public ResponseEntity<Long> countEnrollments(EnrollmentCriteria criteria) {
        LOG.debug("REST request to count Enrollments by criteria: {}", criteria);
        return ResponseEntity.ok().body(enrollmentQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /enrollments/:id} : get the "id" enrollment.
     *
     * @param id the id of the enrollment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the enrollment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Enrollment> getEnrollment(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Enrollment : {}", id);
        Optional<Enrollment> enrollment = enrollmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(enrollment);
    }

    /**
     * {@code DELETE  /enrollments/:id} : delete the "id" enrollment.
     *
     * @param id the id of the enrollment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Enrollment : {}", id);
        enrollmentService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
