package com.naammm.trickcode.web.rest;

import static com.naammm.trickcode.domain.CourseAsserts.*;
import static com.naammm.trickcode.web.rest.TestUtil.createUpdateProxyForBean;
import static com.naammm.trickcode.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naammm.trickcode.IntegrationTest;
import com.naammm.trickcode.domain.Course;
import com.naammm.trickcode.domain.enumeration.CourseLevel;
import com.naammm.trickcode.domain.enumeration.CourseStatus;
import com.naammm.trickcode.repository.CourseRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link CourseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CourseResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);
    private static final BigDecimal SMALLER_PRICE = new BigDecimal(1 - 1);

    private static final BigDecimal DEFAULT_OLD_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_OLD_PRICE = new BigDecimal(2);
    private static final BigDecimal SMALLER_OLD_PRICE = new BigDecimal(1 - 1);

    private static final CourseLevel DEFAULT_LEVEL = CourseLevel.BEGINNER;
    private static final CourseLevel UPDATED_LEVEL = CourseLevel.INTERMEDIATE;

    private static final CourseStatus DEFAULT_STATUS = CourseStatus.DRAFT;
    private static final CourseStatus UPDATED_STATUS = CourseStatus.PENDING;

    private static final String DEFAULT_THUMBNAIL_URL = "AAAAAAAAAA";
    private static final String UPDATED_THUMBNAIL_URL = "BBBBBBBBBB";

    private static final String DEFAULT_VIDEO_PREVIEW_URL = "AAAAAAAAAA";
    private static final String UPDATED_VIDEO_PREVIEW_URL = "BBBBBBBBBB";

    private static final String DEFAULT_REJECTION_REASON = "AAAAAAAAAA";
    private static final String UPDATED_REJECTION_REASON = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_PUBLISHED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_PUBLISHED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/courses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCourseMockMvc;

    private Course course;

    private Course insertedCourse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Course createEntity() {
        return new Course()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .price(DEFAULT_PRICE)
            .oldPrice(DEFAULT_OLD_PRICE)
            .level(DEFAULT_LEVEL)
            .status(DEFAULT_STATUS)
            .thumbnailUrl(DEFAULT_THUMBNAIL_URL)
            .videoPreviewUrl(DEFAULT_VIDEO_PREVIEW_URL)
            .rejectionReason(DEFAULT_REJECTION_REASON)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT)
            .publishedAt(DEFAULT_PUBLISHED_AT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Course createUpdatedEntity() {
        return new Course()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .oldPrice(UPDATED_OLD_PRICE)
            .level(UPDATED_LEVEL)
            .status(UPDATED_STATUS)
            .thumbnailUrl(UPDATED_THUMBNAIL_URL)
            .videoPreviewUrl(UPDATED_VIDEO_PREVIEW_URL)
            .rejectionReason(UPDATED_REJECTION_REASON)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .publishedAt(UPDATED_PUBLISHED_AT);
    }

    @BeforeEach
    void initTest() {
        course = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedCourse != null) {
            courseRepository.delete(insertedCourse);
            insertedCourse = null;
        }
    }

    @Test
    @Transactional
    void createCourse() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Course
        var returnedCourse = om.readValue(
            restCourseMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(course)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Course.class
        );

        // Validate the Course in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCourseUpdatableFieldsEquals(returnedCourse, getPersistedCourse(returnedCourse));

        insertedCourse = returnedCourse;
    }

    @Test
    @Transactional
    void createCourseWithExistingId() throws Exception {
        // Create the Course with an existing ID
        course.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCourseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(course)))
            .andExpect(status().isBadRequest());

        // Validate the Course in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        course.setTitle(null);

        // Create the Course, which fails.

        restCourseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(course)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCourses() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList
        restCourseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(course.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(sameNumber(DEFAULT_PRICE))))
            .andExpect(jsonPath("$.[*].oldPrice").value(hasItem(sameNumber(DEFAULT_OLD_PRICE))))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].thumbnailUrl").value(hasItem(DEFAULT_THUMBNAIL_URL)))
            .andExpect(jsonPath("$.[*].videoPreviewUrl").value(hasItem(DEFAULT_VIDEO_PREVIEW_URL)))
            .andExpect(jsonPath("$.[*].rejectionReason").value(hasItem(DEFAULT_REJECTION_REASON)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())))
            .andExpect(jsonPath("$.[*].publishedAt").value(hasItem(DEFAULT_PUBLISHED_AT.toString())));
    }

    @Test
    @Transactional
    void getCourse() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get the course
        restCourseMockMvc
            .perform(get(ENTITY_API_URL_ID, course.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(course.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.price").value(sameNumber(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.oldPrice").value(sameNumber(DEFAULT_OLD_PRICE)))
            .andExpect(jsonPath("$.level").value(DEFAULT_LEVEL.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.thumbnailUrl").value(DEFAULT_THUMBNAIL_URL))
            .andExpect(jsonPath("$.videoPreviewUrl").value(DEFAULT_VIDEO_PREVIEW_URL))
            .andExpect(jsonPath("$.rejectionReason").value(DEFAULT_REJECTION_REASON))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()))
            .andExpect(jsonPath("$.publishedAt").value(DEFAULT_PUBLISHED_AT.toString()));
    }

    @Test
    @Transactional
    void getCoursesByIdFiltering() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        Long id = course.getId();

        defaultCourseFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultCourseFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultCourseFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllCoursesByTitleIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where title equals to
        defaultCourseFiltering("title.equals=" + DEFAULT_TITLE, "title.equals=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllCoursesByTitleIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where title in
        defaultCourseFiltering("title.in=" + DEFAULT_TITLE + "," + UPDATED_TITLE, "title.in=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllCoursesByTitleIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where title is not null
        defaultCourseFiltering("title.specified=true", "title.specified=false");
    }

    @Test
    @Transactional
    void getAllCoursesByTitleContainsSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where title contains
        defaultCourseFiltering("title.contains=" + DEFAULT_TITLE, "title.contains=" + UPDATED_TITLE);
    }

    @Test
    @Transactional
    void getAllCoursesByTitleNotContainsSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where title does not contain
        defaultCourseFiltering("title.doesNotContain=" + UPDATED_TITLE, "title.doesNotContain=" + DEFAULT_TITLE);
    }

    @Test
    @Transactional
    void getAllCoursesByPriceIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where price equals to
        defaultCourseFiltering("price.equals=" + DEFAULT_PRICE, "price.equals=" + UPDATED_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByPriceIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where price in
        defaultCourseFiltering("price.in=" + DEFAULT_PRICE + "," + UPDATED_PRICE, "price.in=" + UPDATED_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByPriceIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where price is not null
        defaultCourseFiltering("price.specified=true", "price.specified=false");
    }

    @Test
    @Transactional
    void getAllCoursesByPriceIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where price is greater than or equal to
        defaultCourseFiltering("price.greaterThanOrEqual=" + DEFAULT_PRICE, "price.greaterThanOrEqual=" + UPDATED_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByPriceIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where price is less than or equal to
        defaultCourseFiltering("price.lessThanOrEqual=" + DEFAULT_PRICE, "price.lessThanOrEqual=" + SMALLER_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByPriceIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where price is less than
        defaultCourseFiltering("price.lessThan=" + UPDATED_PRICE, "price.lessThan=" + DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByPriceIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where price is greater than
        defaultCourseFiltering("price.greaterThan=" + SMALLER_PRICE, "price.greaterThan=" + DEFAULT_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByOldPriceIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where oldPrice equals to
        defaultCourseFiltering("oldPrice.equals=" + DEFAULT_OLD_PRICE, "oldPrice.equals=" + UPDATED_OLD_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByOldPriceIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where oldPrice in
        defaultCourseFiltering("oldPrice.in=" + DEFAULT_OLD_PRICE + "," + UPDATED_OLD_PRICE, "oldPrice.in=" + UPDATED_OLD_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByOldPriceIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where oldPrice is not null
        defaultCourseFiltering("oldPrice.specified=true", "oldPrice.specified=false");
    }

    @Test
    @Transactional
    void getAllCoursesByOldPriceIsGreaterThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where oldPrice is greater than or equal to
        defaultCourseFiltering("oldPrice.greaterThanOrEqual=" + DEFAULT_OLD_PRICE, "oldPrice.greaterThanOrEqual=" + UPDATED_OLD_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByOldPriceIsLessThanOrEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where oldPrice is less than or equal to
        defaultCourseFiltering("oldPrice.lessThanOrEqual=" + DEFAULT_OLD_PRICE, "oldPrice.lessThanOrEqual=" + SMALLER_OLD_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByOldPriceIsLessThanSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where oldPrice is less than
        defaultCourseFiltering("oldPrice.lessThan=" + UPDATED_OLD_PRICE, "oldPrice.lessThan=" + DEFAULT_OLD_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByOldPriceIsGreaterThanSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where oldPrice is greater than
        defaultCourseFiltering("oldPrice.greaterThan=" + SMALLER_OLD_PRICE, "oldPrice.greaterThan=" + DEFAULT_OLD_PRICE);
    }

    @Test
    @Transactional
    void getAllCoursesByLevelIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where level equals to
        defaultCourseFiltering("level.equals=" + DEFAULT_LEVEL, "level.equals=" + UPDATED_LEVEL);
    }

    @Test
    @Transactional
    void getAllCoursesByLevelIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where level in
        defaultCourseFiltering("level.in=" + DEFAULT_LEVEL + "," + UPDATED_LEVEL, "level.in=" + UPDATED_LEVEL);
    }

    @Test
    @Transactional
    void getAllCoursesByLevelIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where level is not null
        defaultCourseFiltering("level.specified=true", "level.specified=false");
    }

    @Test
    @Transactional
    void getAllCoursesByStatusIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where status equals to
        defaultCourseFiltering("status.equals=" + DEFAULT_STATUS, "status.equals=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllCoursesByStatusIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where status in
        defaultCourseFiltering("status.in=" + DEFAULT_STATUS + "," + UPDATED_STATUS, "status.in=" + UPDATED_STATUS);
    }

    @Test
    @Transactional
    void getAllCoursesByStatusIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where status is not null
        defaultCourseFiltering("status.specified=true", "status.specified=false");
    }

    @Test
    @Transactional
    void getAllCoursesByThumbnailUrlIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where thumbnailUrl equals to
        defaultCourseFiltering("thumbnailUrl.equals=" + DEFAULT_THUMBNAIL_URL, "thumbnailUrl.equals=" + UPDATED_THUMBNAIL_URL);
    }

    @Test
    @Transactional
    void getAllCoursesByThumbnailUrlIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where thumbnailUrl in
        defaultCourseFiltering(
            "thumbnailUrl.in=" + DEFAULT_THUMBNAIL_URL + "," + UPDATED_THUMBNAIL_URL,
            "thumbnailUrl.in=" + UPDATED_THUMBNAIL_URL
        );
    }

    @Test
    @Transactional
    void getAllCoursesByThumbnailUrlIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where thumbnailUrl is not null
        defaultCourseFiltering("thumbnailUrl.specified=true", "thumbnailUrl.specified=false");
    }

    @Test
    @Transactional
    void getAllCoursesByThumbnailUrlContainsSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where thumbnailUrl contains
        defaultCourseFiltering("thumbnailUrl.contains=" + DEFAULT_THUMBNAIL_URL, "thumbnailUrl.contains=" + UPDATED_THUMBNAIL_URL);
    }

    @Test
    @Transactional
    void getAllCoursesByThumbnailUrlNotContainsSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where thumbnailUrl does not contain
        defaultCourseFiltering(
            "thumbnailUrl.doesNotContain=" + UPDATED_THUMBNAIL_URL,
            "thumbnailUrl.doesNotContain=" + DEFAULT_THUMBNAIL_URL
        );
    }

    @Test
    @Transactional
    void getAllCoursesByVideoPreviewUrlIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where videoPreviewUrl equals to
        defaultCourseFiltering(
            "videoPreviewUrl.equals=" + DEFAULT_VIDEO_PREVIEW_URL,
            "videoPreviewUrl.equals=" + UPDATED_VIDEO_PREVIEW_URL
        );
    }

    @Test
    @Transactional
    void getAllCoursesByVideoPreviewUrlIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where videoPreviewUrl in
        defaultCourseFiltering(
            "videoPreviewUrl.in=" + DEFAULT_VIDEO_PREVIEW_URL + "," + UPDATED_VIDEO_PREVIEW_URL,
            "videoPreviewUrl.in=" + UPDATED_VIDEO_PREVIEW_URL
        );
    }

    @Test
    @Transactional
    void getAllCoursesByVideoPreviewUrlIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where videoPreviewUrl is not null
        defaultCourseFiltering("videoPreviewUrl.specified=true", "videoPreviewUrl.specified=false");
    }

    @Test
    @Transactional
    void getAllCoursesByVideoPreviewUrlContainsSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where videoPreviewUrl contains
        defaultCourseFiltering(
            "videoPreviewUrl.contains=" + DEFAULT_VIDEO_PREVIEW_URL,
            "videoPreviewUrl.contains=" + UPDATED_VIDEO_PREVIEW_URL
        );
    }

    @Test
    @Transactional
    void getAllCoursesByVideoPreviewUrlNotContainsSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where videoPreviewUrl does not contain
        defaultCourseFiltering(
            "videoPreviewUrl.doesNotContain=" + UPDATED_VIDEO_PREVIEW_URL,
            "videoPreviewUrl.doesNotContain=" + DEFAULT_VIDEO_PREVIEW_URL
        );
    }

    @Test
    @Transactional
    void getAllCoursesByRejectionReasonIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where rejectionReason equals to
        defaultCourseFiltering("rejectionReason.equals=" + DEFAULT_REJECTION_REASON, "rejectionReason.equals=" + UPDATED_REJECTION_REASON);
    }

    @Test
    @Transactional
    void getAllCoursesByRejectionReasonIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where rejectionReason in
        defaultCourseFiltering(
            "rejectionReason.in=" + DEFAULT_REJECTION_REASON + "," + UPDATED_REJECTION_REASON,
            "rejectionReason.in=" + UPDATED_REJECTION_REASON
        );
    }

    @Test
    @Transactional
    void getAllCoursesByRejectionReasonIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where rejectionReason is not null
        defaultCourseFiltering("rejectionReason.specified=true", "rejectionReason.specified=false");
    }

    @Test
    @Transactional
    void getAllCoursesByRejectionReasonContainsSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where rejectionReason contains
        defaultCourseFiltering(
            "rejectionReason.contains=" + DEFAULT_REJECTION_REASON,
            "rejectionReason.contains=" + UPDATED_REJECTION_REASON
        );
    }

    @Test
    @Transactional
    void getAllCoursesByRejectionReasonNotContainsSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where rejectionReason does not contain
        defaultCourseFiltering(
            "rejectionReason.doesNotContain=" + UPDATED_REJECTION_REASON,
            "rejectionReason.doesNotContain=" + DEFAULT_REJECTION_REASON
        );
    }

    @Test
    @Transactional
    void getAllCoursesByCreatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where createdAt equals to
        defaultCourseFiltering("createdAt.equals=" + DEFAULT_CREATED_AT, "createdAt.equals=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllCoursesByCreatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where createdAt in
        defaultCourseFiltering("createdAt.in=" + DEFAULT_CREATED_AT + "," + UPDATED_CREATED_AT, "createdAt.in=" + UPDATED_CREATED_AT);
    }

    @Test
    @Transactional
    void getAllCoursesByCreatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where createdAt is not null
        defaultCourseFiltering("createdAt.specified=true", "createdAt.specified=false");
    }

    @Test
    @Transactional
    void getAllCoursesByUpdatedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where updatedAt equals to
        defaultCourseFiltering("updatedAt.equals=" + DEFAULT_UPDATED_AT, "updatedAt.equals=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllCoursesByUpdatedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where updatedAt in
        defaultCourseFiltering("updatedAt.in=" + DEFAULT_UPDATED_AT + "," + UPDATED_UPDATED_AT, "updatedAt.in=" + UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void getAllCoursesByUpdatedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where updatedAt is not null
        defaultCourseFiltering("updatedAt.specified=true", "updatedAt.specified=false");
    }

    @Test
    @Transactional
    void getAllCoursesByPublishedAtIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where publishedAt equals to
        defaultCourseFiltering("publishedAt.equals=" + DEFAULT_PUBLISHED_AT, "publishedAt.equals=" + UPDATED_PUBLISHED_AT);
    }

    @Test
    @Transactional
    void getAllCoursesByPublishedAtIsInShouldWork() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where publishedAt in
        defaultCourseFiltering(
            "publishedAt.in=" + DEFAULT_PUBLISHED_AT + "," + UPDATED_PUBLISHED_AT,
            "publishedAt.in=" + UPDATED_PUBLISHED_AT
        );
    }

    @Test
    @Transactional
    void getAllCoursesByPublishedAtIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        // Get all the courseList where publishedAt is not null
        defaultCourseFiltering("publishedAt.specified=true", "publishedAt.specified=false");
    }

    private void defaultCourseFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultCourseShouldBeFound(shouldBeFound);
        defaultCourseShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultCourseShouldBeFound(String filter) throws Exception {
        restCourseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(course.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(sameNumber(DEFAULT_PRICE))))
            .andExpect(jsonPath("$.[*].oldPrice").value(hasItem(sameNumber(DEFAULT_OLD_PRICE))))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].thumbnailUrl").value(hasItem(DEFAULT_THUMBNAIL_URL)))
            .andExpect(jsonPath("$.[*].videoPreviewUrl").value(hasItem(DEFAULT_VIDEO_PREVIEW_URL)))
            .andExpect(jsonPath("$.[*].rejectionReason").value(hasItem(DEFAULT_REJECTION_REASON)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())))
            .andExpect(jsonPath("$.[*].publishedAt").value(hasItem(DEFAULT_PUBLISHED_AT.toString())));

        // Check, that the count call also returns 1
        restCourseMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultCourseShouldNotBeFound(String filter) throws Exception {
        restCourseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restCourseMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingCourse() throws Exception {
        // Get the course
        restCourseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCourse() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the course
        Course updatedCourse = courseRepository.findById(course.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCourse are not directly saved in db
        em.detach(updatedCourse);
        updatedCourse
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .oldPrice(UPDATED_OLD_PRICE)
            .level(UPDATED_LEVEL)
            .status(UPDATED_STATUS)
            .thumbnailUrl(UPDATED_THUMBNAIL_URL)
            .videoPreviewUrl(UPDATED_VIDEO_PREVIEW_URL)
            .rejectionReason(UPDATED_REJECTION_REASON)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .publishedAt(UPDATED_PUBLISHED_AT);

        restCourseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCourse.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCourse))
            )
            .andExpect(status().isOk());

        // Validate the Course in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCourseToMatchAllProperties(updatedCourse);
    }

    @Test
    @Transactional
    void putNonExistingCourse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        course.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseMockMvc
            .perform(put(ENTITY_API_URL_ID, course.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(course)))
            .andExpect(status().isBadRequest());

        // Validate the Course in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCourse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        course.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(course))
            )
            .andExpect(status().isBadRequest());

        // Validate the Course in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCourse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        course.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(course)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Course in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCourseWithPatch() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the course using partial update
        Course partialUpdatedCourse = new Course();
        partialUpdatedCourse.setId(course.getId());

        partialUpdatedCourse
            .title(UPDATED_TITLE)
            .oldPrice(UPDATED_OLD_PRICE)
            .status(UPDATED_STATUS)
            .thumbnailUrl(UPDATED_THUMBNAIL_URL)
            .videoPreviewUrl(UPDATED_VIDEO_PREVIEW_URL)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);

        restCourseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourse.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCourse))
            )
            .andExpect(status().isOk());

        // Validate the Course in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCourseUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedCourse, course), getPersistedCourse(course));
    }

    @Test
    @Transactional
    void fullUpdateCourseWithPatch() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the course using partial update
        Course partialUpdatedCourse = new Course();
        partialUpdatedCourse.setId(course.getId());

        partialUpdatedCourse
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .oldPrice(UPDATED_OLD_PRICE)
            .level(UPDATED_LEVEL)
            .status(UPDATED_STATUS)
            .thumbnailUrl(UPDATED_THUMBNAIL_URL)
            .videoPreviewUrl(UPDATED_VIDEO_PREVIEW_URL)
            .rejectionReason(UPDATED_REJECTION_REASON)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT)
            .publishedAt(UPDATED_PUBLISHED_AT);

        restCourseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourse.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCourse))
            )
            .andExpect(status().isOk());

        // Validate the Course in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCourseUpdatableFieldsEquals(partialUpdatedCourse, getPersistedCourse(partialUpdatedCourse));
    }

    @Test
    @Transactional
    void patchNonExistingCourse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        course.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCourseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, course.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(course))
            )
            .andExpect(status().isBadRequest());

        // Validate the Course in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCourse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        course.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(course))
            )
            .andExpect(status().isBadRequest());

        // Validate the Course in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCourse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        course.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCourseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(course)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Course in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCourse() throws Exception {
        // Initialize the database
        insertedCourse = courseRepository.saveAndFlush(course);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the course
        restCourseMockMvc
            .perform(delete(ENTITY_API_URL_ID, course.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return courseRepository.count();
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

    protected Course getPersistedCourse(Course course) {
        return courseRepository.findById(course.getId()).orElseThrow();
    }

    protected void assertPersistedCourseToMatchAllProperties(Course expectedCourse) {
        assertCourseAllPropertiesEquals(expectedCourse, getPersistedCourse(expectedCourse));
    }

    protected void assertPersistedCourseToMatchUpdatableProperties(Course expectedCourse) {
        assertCourseAllUpdatablePropertiesEquals(expectedCourse, getPersistedCourse(expectedCourse));
    }
}
