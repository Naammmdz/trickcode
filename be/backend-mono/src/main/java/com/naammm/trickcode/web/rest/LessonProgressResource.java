package com.naammm.trickcode.web.rest;

import com.naammm.trickcode.domain.LessonProgress;
import com.naammm.trickcode.repository.LessonProgressRepository;
import com.naammm.trickcode.service.LessonProgressService;
import com.naammm.trickcode.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.naammm.trickcode.domain.LessonProgress}.
 */
@RestController
@RequestMapping("/api/lesson-progresses")
public class LessonProgressResource {

    private static final Logger LOG = LoggerFactory.getLogger(LessonProgressResource.class);

    private static final String ENTITY_NAME = "lessonProgress";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LessonProgressService lessonProgressService;

    private final LessonProgressRepository lessonProgressRepository;

    public LessonProgressResource(LessonProgressService lessonProgressService, LessonProgressRepository lessonProgressRepository) {
        this.lessonProgressService = lessonProgressService;
        this.lessonProgressRepository = lessonProgressRepository;
    }

    /**
     * {@code POST  /lesson-progresses} : Create a new lessonProgress.
     *
     * @param lessonProgress the lessonProgress to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lessonProgress, or with status {@code 400 (Bad Request)} if the lessonProgress has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<LessonProgress> createLessonProgress(@RequestBody LessonProgress lessonProgress) throws URISyntaxException {
        LOG.debug("REST request to save LessonProgress : {}", lessonProgress);
        if (lessonProgress.getId() != null) {
            throw new BadRequestAlertException("A new lessonProgress cannot already have an ID", ENTITY_NAME, "idexists");
        }
        lessonProgress = lessonProgressService.save(lessonProgress);
        return ResponseEntity.created(new URI("/api/lesson-progresses/" + lessonProgress.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, lessonProgress.getId().toString()))
            .body(lessonProgress);
    }

    /**
     * {@code PUT  /lesson-progresses/:id} : Updates an existing lessonProgress.
     *
     * @param id the id of the lessonProgress to save.
     * @param lessonProgress the lessonProgress to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lessonProgress,
     * or with status {@code 400 (Bad Request)} if the lessonProgress is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lessonProgress couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<LessonProgress> updateLessonProgress(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LessonProgress lessonProgress
    ) throws URISyntaxException {
        LOG.debug("REST request to update LessonProgress : {}, {}", id, lessonProgress);
        if (lessonProgress.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lessonProgress.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lessonProgressRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        lessonProgress = lessonProgressService.update(lessonProgress);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lessonProgress.getId().toString()))
            .body(lessonProgress);
    }

    /**
     * {@code PATCH  /lesson-progresses/:id} : Partial updates given fields of an existing lessonProgress, field will ignore if it is null
     *
     * @param id the id of the lessonProgress to save.
     * @param lessonProgress the lessonProgress to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lessonProgress,
     * or with status {@code 400 (Bad Request)} if the lessonProgress is not valid,
     * or with status {@code 404 (Not Found)} if the lessonProgress is not found,
     * or with status {@code 500 (Internal Server Error)} if the lessonProgress couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LessonProgress> partialUpdateLessonProgress(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LessonProgress lessonProgress
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update LessonProgress partially : {}, {}", id, lessonProgress);
        if (lessonProgress.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lessonProgress.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lessonProgressRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LessonProgress> result = lessonProgressService.partialUpdate(lessonProgress);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, lessonProgress.getId().toString())
        );
    }

    /**
     * {@code GET  /lesson-progresses} : get all the lessonProgresses.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lessonProgresses in body.
     */
    @GetMapping("")
    public List<LessonProgress> getAllLessonProgresses(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all LessonProgresses");
        return lessonProgressService.findAll();
    }

    /**
     * {@code GET  /lesson-progresses/:id} : get the "id" lessonProgress.
     *
     * @param id the id of the lessonProgress to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lessonProgress, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LessonProgress> getLessonProgress(@PathVariable("id") Long id) {
        LOG.debug("REST request to get LessonProgress : {}", id);
        Optional<LessonProgress> lessonProgress = lessonProgressService.findOne(id);
        return ResponseUtil.wrapOrNotFound(lessonProgress);
    }

    /**
     * {@code DELETE  /lesson-progresses/:id} : delete the "id" lessonProgress.
     *
     * @param id the id of the lessonProgress to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLessonProgress(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete LessonProgress : {}", id);
        lessonProgressService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
