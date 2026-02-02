package com.naammm.trickcode.web.rest;

import static com.naammm.trickcode.domain.LessonAsserts.*;
import static com.naammm.trickcode.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naammm.trickcode.IntegrationTest;
import com.naammm.trickcode.domain.Lesson;
import com.naammm.trickcode.domain.enumeration.LessonType;
import com.naammm.trickcode.repository.LessonRepository;
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
 * Integration tests for the {@link LessonResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LessonResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final LessonType DEFAULT_TYPE = LessonType.VIDEO;
    private static final LessonType UPDATED_TYPE = LessonType.TEXT;

    private static final Integer DEFAULT_ORDER_INDEX = 1;
    private static final Integer UPDATED_ORDER_INDEX = 2;

    private static final Integer DEFAULT_DURATION_SECONDS = 1;
    private static final Integer UPDATED_DURATION_SECONDS = 2;

    private static final Boolean DEFAULT_IS_PREVIEW = false;
    private static final Boolean UPDATED_IS_PREVIEW = true;

    private static final String DEFAULT_VIDEO_URL = "AAAAAAAAAA";
    private static final String UPDATED_VIDEO_URL = "BBBBBBBBBB";

    private static final String DEFAULT_CAPTION_URL = "AAAAAAAAAA";
    private static final String UPDATED_CAPTION_URL = "BBBBBBBBBB";

    private static final String DEFAULT_MARKDOWN_CONTENT = "AAAAAAAAAA";
    private static final String UPDATED_MARKDOWN_CONTENT = "BBBBBBBBBB";

    private static final String DEFAULT_QUIZ_CONFIG = "AAAAAAAAAA";
    private static final String UPDATED_QUIZ_CONFIG = "BBBBBBBBBB";

    private static final String DEFAULT_CODE_CHALLENGE_CONFIG = "AAAAAAAAAA";
    private static final String UPDATED_CODE_CHALLENGE_CONFIG = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/lessons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLessonMockMvc;

    private Lesson lesson;

    private Lesson insertedLesson;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Lesson createEntity() {
        return new Lesson()
            .title(DEFAULT_TITLE)
            .type(DEFAULT_TYPE)
            .orderIndex(DEFAULT_ORDER_INDEX)
            .durationSeconds(DEFAULT_DURATION_SECONDS)
            .isPreview(DEFAULT_IS_PREVIEW)
            .videoUrl(DEFAULT_VIDEO_URL)
            .captionUrl(DEFAULT_CAPTION_URL)
            .markdownContent(DEFAULT_MARKDOWN_CONTENT)
            .quizConfig(DEFAULT_QUIZ_CONFIG)
            .codeChallengeConfig(DEFAULT_CODE_CHALLENGE_CONFIG);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Lesson createUpdatedEntity() {
        return new Lesson()
            .title(UPDATED_TITLE)
            .type(UPDATED_TYPE)
            .orderIndex(UPDATED_ORDER_INDEX)
            .durationSeconds(UPDATED_DURATION_SECONDS)
            .isPreview(UPDATED_IS_PREVIEW)
            .videoUrl(UPDATED_VIDEO_URL)
            .captionUrl(UPDATED_CAPTION_URL)
            .markdownContent(UPDATED_MARKDOWN_CONTENT)
            .quizConfig(UPDATED_QUIZ_CONFIG)
            .codeChallengeConfig(UPDATED_CODE_CHALLENGE_CONFIG);
    }

    @BeforeEach
    void initTest() {
        lesson = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedLesson != null) {
            lessonRepository.delete(insertedLesson);
            insertedLesson = null;
        }
    }

    @Test
    @Transactional
    void createLesson() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Lesson
        var returnedLesson = om.readValue(
            restLessonMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lesson)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Lesson.class
        );

        // Validate the Lesson in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertLessonUpdatableFieldsEquals(returnedLesson, getPersistedLesson(returnedLesson));

        insertedLesson = returnedLesson;
    }

    @Test
    @Transactional
    void createLessonWithExistingId() throws Exception {
        // Create the Lesson with an existing ID
        lesson.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLessonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lesson)))
            .andExpect(status().isBadRequest());

        // Validate the Lesson in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        lesson.setTitle(null);

        // Create the Lesson, which fails.

        restLessonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lesson)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLessons() throws Exception {
        // Initialize the database
        insertedLesson = lessonRepository.saveAndFlush(lesson);

        // Get all the lessonList
        restLessonMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lesson.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].orderIndex").value(hasItem(DEFAULT_ORDER_INDEX)))
            .andExpect(jsonPath("$.[*].durationSeconds").value(hasItem(DEFAULT_DURATION_SECONDS)))
            .andExpect(jsonPath("$.[*].isPreview").value(hasItem(DEFAULT_IS_PREVIEW)))
            .andExpect(jsonPath("$.[*].videoUrl").value(hasItem(DEFAULT_VIDEO_URL)))
            .andExpect(jsonPath("$.[*].captionUrl").value(hasItem(DEFAULT_CAPTION_URL)))
            .andExpect(jsonPath("$.[*].markdownContent").value(hasItem(DEFAULT_MARKDOWN_CONTENT)))
            .andExpect(jsonPath("$.[*].quizConfig").value(hasItem(DEFAULT_QUIZ_CONFIG)))
            .andExpect(jsonPath("$.[*].codeChallengeConfig").value(hasItem(DEFAULT_CODE_CHALLENGE_CONFIG)));
    }

    @Test
    @Transactional
    void getLesson() throws Exception {
        // Initialize the database
        insertedLesson = lessonRepository.saveAndFlush(lesson);

        // Get the lesson
        restLessonMockMvc
            .perform(get(ENTITY_API_URL_ID, lesson.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lesson.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.orderIndex").value(DEFAULT_ORDER_INDEX))
            .andExpect(jsonPath("$.durationSeconds").value(DEFAULT_DURATION_SECONDS))
            .andExpect(jsonPath("$.isPreview").value(DEFAULT_IS_PREVIEW))
            .andExpect(jsonPath("$.videoUrl").value(DEFAULT_VIDEO_URL))
            .andExpect(jsonPath("$.captionUrl").value(DEFAULT_CAPTION_URL))
            .andExpect(jsonPath("$.markdownContent").value(DEFAULT_MARKDOWN_CONTENT))
            .andExpect(jsonPath("$.quizConfig").value(DEFAULT_QUIZ_CONFIG))
            .andExpect(jsonPath("$.codeChallengeConfig").value(DEFAULT_CODE_CHALLENGE_CONFIG));
    }

    @Test
    @Transactional
    void getNonExistingLesson() throws Exception {
        // Get the lesson
        restLessonMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLesson() throws Exception {
        // Initialize the database
        insertedLesson = lessonRepository.saveAndFlush(lesson);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the lesson
        Lesson updatedLesson = lessonRepository.findById(lesson.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLesson are not directly saved in db
        em.detach(updatedLesson);
        updatedLesson
            .title(UPDATED_TITLE)
            .type(UPDATED_TYPE)
            .orderIndex(UPDATED_ORDER_INDEX)
            .durationSeconds(UPDATED_DURATION_SECONDS)
            .isPreview(UPDATED_IS_PREVIEW)
            .videoUrl(UPDATED_VIDEO_URL)
            .captionUrl(UPDATED_CAPTION_URL)
            .markdownContent(UPDATED_MARKDOWN_CONTENT)
            .quizConfig(UPDATED_QUIZ_CONFIG)
            .codeChallengeConfig(UPDATED_CODE_CHALLENGE_CONFIG);

        restLessonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLesson.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedLesson))
            )
            .andExpect(status().isOk());

        // Validate the Lesson in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLessonToMatchAllProperties(updatedLesson);
    }

    @Test
    @Transactional
    void putNonExistingLesson() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lesson.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(put(ENTITY_API_URL_ID, lesson.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lesson)))
            .andExpect(status().isBadRequest());

        // Validate the Lesson in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLesson() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lesson.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(lesson))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lesson in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLesson() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lesson.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(lesson)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Lesson in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLessonWithPatch() throws Exception {
        // Initialize the database
        insertedLesson = lessonRepository.saveAndFlush(lesson);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the lesson using partial update
        Lesson partialUpdatedLesson = new Lesson();
        partialUpdatedLesson.setId(lesson.getId());

        partialUpdatedLesson
            .type(UPDATED_TYPE)
            .isPreview(UPDATED_IS_PREVIEW)
            .captionUrl(UPDATED_CAPTION_URL)
            .quizConfig(UPDATED_QUIZ_CONFIG);

        restLessonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLesson.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLesson))
            )
            .andExpect(status().isOk());

        // Validate the Lesson in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLessonUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedLesson, lesson), getPersistedLesson(lesson));
    }

    @Test
    @Transactional
    void fullUpdateLessonWithPatch() throws Exception {
        // Initialize the database
        insertedLesson = lessonRepository.saveAndFlush(lesson);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the lesson using partial update
        Lesson partialUpdatedLesson = new Lesson();
        partialUpdatedLesson.setId(lesson.getId());

        partialUpdatedLesson
            .title(UPDATED_TITLE)
            .type(UPDATED_TYPE)
            .orderIndex(UPDATED_ORDER_INDEX)
            .durationSeconds(UPDATED_DURATION_SECONDS)
            .isPreview(UPDATED_IS_PREVIEW)
            .videoUrl(UPDATED_VIDEO_URL)
            .captionUrl(UPDATED_CAPTION_URL)
            .markdownContent(UPDATED_MARKDOWN_CONTENT)
            .quizConfig(UPDATED_QUIZ_CONFIG)
            .codeChallengeConfig(UPDATED_CODE_CHALLENGE_CONFIG);

        restLessonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLesson.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLesson))
            )
            .andExpect(status().isOk());

        // Validate the Lesson in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLessonUpdatableFieldsEquals(partialUpdatedLesson, getPersistedLesson(partialUpdatedLesson));
    }

    @Test
    @Transactional
    void patchNonExistingLesson() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lesson.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lesson.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(lesson))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lesson in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLesson() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lesson.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(lesson))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lesson in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLesson() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        lesson.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(lesson)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Lesson in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLesson() throws Exception {
        // Initialize the database
        insertedLesson = lessonRepository.saveAndFlush(lesson);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the lesson
        restLessonMockMvc
            .perform(delete(ENTITY_API_URL_ID, lesson.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return lessonRepository.count();
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

    protected Lesson getPersistedLesson(Lesson lesson) {
        return lessonRepository.findById(lesson.getId()).orElseThrow();
    }

    protected void assertPersistedLessonToMatchAllProperties(Lesson expectedLesson) {
        assertLessonAllPropertiesEquals(expectedLesson, getPersistedLesson(expectedLesson));
    }

    protected void assertPersistedLessonToMatchUpdatableProperties(Lesson expectedLesson) {
        assertLessonAllUpdatablePropertiesEquals(expectedLesson, getPersistedLesson(expectedLesson));
    }
}
