package com.naammm.trickcode.web.rest;

import static com.naammm.trickcode.domain.SectionAsserts.*;
import static com.naammm.trickcode.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naammm.trickcode.IntegrationTest;
import com.naammm.trickcode.domain.Course;
import com.naammm.trickcode.domain.Section;
import com.naammm.trickcode.repository.SectionRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SectionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SectionResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDER_INDEX = 1;
    private static final Integer UPDATED_ORDER_INDEX = 2;
    private static final Integer SMALLER_ORDER_INDEX = 1 - 1;

    private static final String ENTITY_API_URL = "/api/sections";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSectionMockMvc;

    private Section section;

    private Section insertedSection;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Section createEntity() {
        return new Section().title(DEFAULT_TITLE).orderIndex(DEFAULT_ORDER_INDEX);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Section createUpdatedEntity() {
        return new Section().title(UPDATED_TITLE).orderIndex(UPDATED_ORDER_INDEX);
    }

    @BeforeEach
    void initTest() {
        section = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedSection != null) {
            sectionRepository.delete(insertedSection);
            insertedSection = null;
        }
    }

    @Test
    @Transactional
    void createSection() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Section
        var returnedSection = om.readValue(
            restSectionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Section.class
        );

        // Validate the Section in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSectionUpdatableFieldsEquals(returnedSection, getPersistedSection(returnedSection));

        insertedSection = returnedSection;
    }

    @Test
    @Transactional
    void createSectionWithExistingId() throws Exception {
        // Create the Section with an existing ID
        section.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSectionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        section.setTitle(null);

        // Create the Section, which fails.

        restSectionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSections() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList
        restSectionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(section.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].orderIndex").value(hasItem(DEFAULT_ORDER_INDEX)));
    }

    @Test
    @Transactional
    void getSection() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get the section
        restSectionMockMvc
            .perform(get(ENTITY_API_URL_ID, section.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(section.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.orderIndex").value(DEFAULT_ORDER_INDEX));
    }

    @Test
    @Transactional
    void getSectionsByIdFiltering() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        Long id = section.getId();

        defaultSectionFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultSectionFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultSectionFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllSectionsByTitleIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where title equals to
        defaultSectionFiltering("title.equals=" + DEFAULT_TITLE, "title.equals=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllSectionsByTitleIsInShouldWork() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where title in
        defaultSectionFiltering("title.in=" + DEFAULT_TITLE + "," + UPDATED_TITLE, "title.in=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllSectionsByTitleIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where title is not null
        defaultSectionFiltering("title.specified=true", "title.specified=false");
    }

    @Test
    @Transactional
    void getAllSectionsByTitleContainsSomething() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where title contains
        defaultSectionFiltering("title.contains=" + DEFAULT_TITLE, "title.contains=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllSectionsByTitleNotContainsSomething() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where title does not contain
        defaultSectionFiltering("title.doesNotContain=" + UPDATED_TITLE, "title.doesNotContain=" + DEFAULT_TITLE);
    }

    @Test
    @Transactional
    void getAllSectionsByOrderIndexIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where orderIndex equals to
        defaultSectionFiltering("orderIndex.equals=" + DEFAULT_ORDER_INDEX, "orderIndex.equals=" + UPDATED_ORDER_INDEX);
    }

    @Test
    @Transactional
    void getAllSectionsByOrderIndexIsInShouldWork() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where orderIndex in
        defaultSectionFiltering("orderIndex.in=" + DEFAULT_ORDER_INDEX + "," + UPDATED_ORDER_INDEX, "orderIndex.in=" + UPDATED_ORDER_INDEX);
    }

    @Test
    @Transactional
    void getAllSectionsByOrderIndexIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where orderIndex is not null
        defaultSectionFiltering("orderIndex.specified=true", "orderIndex.specified=false");
    }

    @Test
    @Transactional
    void getAllSectionsByOrderIndexIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where orderIndex is greater than or equal to
        defaultSectionFiltering(
            "orderIndex.greaterThanOrEqual=" + DEFAULT_ORDER_INDEX,
            "orderIndex.greaterThanOrEqual=" + UPDATED_ORDER_INDEX
        );
    }

    @Test
    @Transactional
    void getAllSectionsByOrderIndexIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where orderIndex is less than or equal to
        defaultSectionFiltering("orderIndex.lessThanOrEqual=" + DEFAULT_ORDER_INDEX, "orderIndex.lessThanOrEqual=" + SMALLER_ORDER_INDEX);
    }

    @Test
    @Transactional
    void getAllSectionsByOrderIndexIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where orderIndex is less than
        defaultSectionFiltering("orderIndex.lessThan=" + UPDATED_ORDER_INDEX, "orderIndex.lessThan=" + DEFAULT_ORDER_INDEX);
    }

    @Test
    @Transactional
    void getAllSectionsByOrderIndexIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        // Get all the sectionList where orderIndex is greater than
        defaultSectionFiltering("orderIndex.greaterThan=" + SMALLER_ORDER_INDEX, "orderIndex.greaterThan=" + DEFAULT_ORDER_INDEX);
    }

    @Test
    @Transactional
    void getAllSectionsByCourseIsEqualToSomething() throws Exception {
        Course course;
        if (TestUtil.findAll(em, Course.class).isEmpty()) {
            sectionRepository.saveAndFlush(section);
            course = CourseResourceIT.createEntity();
        } else {
            course = TestUtil.findAll(em, Course.class).get(0);
        }
        em.persist(course);
        em.flush();
        section.setCourse(course);
        sectionRepository.saveAndFlush(section);
        Long courseId = course.getId();
        // Get all the sectionList where course equals to courseId
        defaultSectionShouldBeFound("courseId.equals=" + courseId);

        // Get all the sectionList where course equals to (courseId + 1)
        defaultSectionShouldNotBeFound("courseId.equals=" + (courseId + 1));
    }

    private void defaultSectionFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultSectionShouldBeFound(shouldBeFound);
        defaultSectionShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultSectionShouldBeFound(String filter) throws Exception {
        restSectionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(section.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].orderIndex").value(hasItem(DEFAULT_ORDER_INDEX)));

        // Check, that the count call also returns 1
        restSectionMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultSectionShouldNotBeFound(String filter) throws Exception {
        restSectionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restSectionMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingSection() throws Exception {
        // Get the section
        restSectionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSection() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the section
        Section updatedSection = sectionRepository.findById(section.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSection are not directly saved in db
        em.detach(updatedSection);
        updatedSection.title(UPDATED_TITLE).orderIndex(UPDATED_ORDER_INDEX);

        restSectionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSection.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSection))
            )
            .andExpect(status().isOk());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSectionToMatchAllProperties(updatedSection);
    }

    @Test
    @Transactional
    void putNonExistingSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(put(ENTITY_API_URL_ID, section.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(section))
            )
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(section)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSectionWithPatch() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the section using partial update
        Section partialUpdatedSection = new Section();
        partialUpdatedSection.setId(section.getId());

        restSectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSection.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSection))
            )
            .andExpect(status().isOk());

        // Validate the Section in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSectionUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedSection, section), getPersistedSection(section));
    }

    @Test
    @Transactional
    void fullUpdateSectionWithPatch() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the section using partial update
        Section partialUpdatedSection = new Section();
        partialUpdatedSection.setId(section.getId());

        partialUpdatedSection.title(UPDATED_TITLE).orderIndex(UPDATED_ORDER_INDEX);

        restSectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSection.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSection))
            )
            .andExpect(status().isOk());

        // Validate the Section in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSectionUpdatableFieldsEquals(partialUpdatedSection, getPersistedSection(partialUpdatedSection));
    }

    @Test
    @Transactional
    void patchNonExistingSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, section.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(section))
            )
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(section))
            )
            .andExpect(status().isBadRequest());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSection() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        section.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSectionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(section)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Section in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSection() throws Exception {
        // Initialize the database
        insertedSection = sectionRepository.saveAndFlush(section);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the section
        restSectionMockMvc
            .perform(delete(ENTITY_API_URL_ID, section.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return sectionRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Section getPersistedSection(Section section) {
        return sectionRepository.findById(section.getId()).orElseThrow();
    }

    protected void assertPersistedSectionToMatchAllProperties(Section expectedSection) {
        assertSectionAllPropertiesEquals(expectedSection, getPersistedSection(expectedSection));
    }

    protected void assertPersistedSectionToMatchUpdatableProperties(Section expectedSection) {
        assertSectionAllUpdatablePropertiesEquals(expectedSection, getPersistedSection(expectedSection));
    }
}
