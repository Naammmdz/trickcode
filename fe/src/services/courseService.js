import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';

export const courseService = {
    getCourses: async ({ page = 0, size = 10, sort = 'id,asc', q = '', status = null }) => {
        try {
            const params = {
                page,
                size,
                sort,
            };

            // JHipster filtering
            if (q) {
                params['title.contains'] = q;
            }

            if (status) {
                params['status.equals'] = status;
            }

            const response = await apiClient.get(API_ENDPOINTS.COURSES.LIST, { params });

            const content = response.data;
            const totalElements = parseInt(response.headers['x-total-count'] || '0', 10);
            const totalPages = Math.ceil(totalElements / size);

            return {
                content,
                page,
                size,
                totalElements,
                totalPages
            };
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            return {
                content: [],
                page,
                size,
                totalElements: 0,
                totalPages: 0
            };
        }
    },

    getPublicCourses: async ({ page = 0, size = 10, sort = 'id,asc', q = '', categoryId }) => {
        try {
            const params = {
                page,
                size,
                sort,
            };

            if (q) {
                params['title.contains'] = q;
            }
            if (categoryId) {
                params['categoriesId.equals'] = categoryId;
            }

            const response = await apiClient.get(API_ENDPOINTS.COURSES.PUBLIC, { params });

            const content = response.data;
            const totalElements = parseInt(response.headers['x-total-count'] || '0', 10);
            const totalPages = Math.ceil(totalElements / size);

            return {
                content,
                page,
                size,
                totalElements,
                totalPages
            };
        } catch (error) {
            console.error("Failed to fetch public courses:", error);
            return {
                content: [],
                page,
                size,
                totalElements: 0,
                totalPages: 0
            };
        }
    },

    getMyInstructorCourses: async ({ page = 0, size = 10, sort = 'id,asc', q = '', status = null }) => {
        try {
            const params = {
                page,
                size,
                sort,
            };

            if (q) {
                params['title.contains'] = q;
            }

            if (status) {
                params['status.equals'] = status;
            }

            const response = await apiClient.get(API_ENDPOINTS.COURSES.MY_COURSES, { params });

            const content = response.data;
            const totalElements = parseInt(response.headers['x-total-count'] || '0', 10);
            const totalPages = Math.ceil(totalElements / size);

            return {
                content,
                page,
                size,
                totalElements,
                totalPages
            };
        } catch (error) {
            console.error("Failed to fetch my instructor courses:", error);
            return {
                content: [],
                page,
                size,
                totalElements: 0,
                totalPages: 0
            };
        }
    },

    getMyEnrolledCourses: async ({ page = 0, size = 50, sort = 'id,desc' } = {}) => {
        try {
            // Use enrollments endpoint because /api/courses/my-courses is for instructors
            const params = {
                page,
                size,
                sort,
            };

            const response = await apiClient.get('/api/enrollments/my', { params });

            const content = response.data;
            const totalElements = parseInt(response.headers['x-total-count'] || '0', 10);
            const totalPages = Math.ceil(totalElements / size);

            // Map enrollments -> courses
            const courses = (content || [])
                .map(e => e.course)
                .filter(Boolean);

            return {
                content: courses,
                page,
                size,
                totalElements,
                totalPages,
            };
        } catch (error) {
            console.error('Failed to fetch enrolled courses:', error);
            return {
                content: [],
                page: 0,
                size: 0,
                totalElements: 0,
                totalPages: 0,
            };
        }
    },

    getCourse: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.COURSES.DETAIL(id));
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch course ${id}:`, error);
            throw error;
        }
    },

    checkCourseAccess: async (id) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.COURSES.ACCESS(id));
            return response.data;
        } catch (error) {
            console.error(`Failed to check course access ${id}:`, error);
            // Return default no access if error
            return {
                hasAccess: false,
                isAdmin: false,
                isEnrolled: false,
                isInstructor: false
            };
        }
    },

    createCourse: async (courseData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COURSES.LIST, courseData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateCourse: async (id, courseData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.COURSES.DETAIL(id), courseData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    approveCourse: async (id) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COURSES.APPROVE(id));
            return response.data;
        } catch (error) {
            console.error(`Failed to approve course ${id}:`, error);
            throw error;
        }
    },

    rejectCourse: async (id, reason) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COURSES.REJECT(id), { reason });
            return response.data;
        } catch (error) {
            console.error(`Failed to reject course ${id}:`, error);
            throw error;
        }
    },

    publishCourse: async (id) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COURSES.PUBLISH(id));
            return response.data;
        } catch (error) {
            console.error(`Failed to publish course ${id}:`, error);
            throw error;
        }
    },

    unpublishCourse: async (id) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COURSES.UNPUBLISH(id));
            return response.data;
        } catch (error) {
            console.error(`Failed to unpublish course ${id}:`, error);
            throw error;
        }
    },

    submitCourseForReview: async (id) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.COURSES.SUBMIT(id));
            return response.data;
        } catch (error) {
            console.error(`Failed to submit course ${id} for review:`, error);
            throw error;
        }
    },

    deleteCourse: async (id) => {
        try {
            await apiClient.delete(API_ENDPOINTS.COURSES.DETAIL(id));
            return true;
        } catch (error) {
            console.error(`Failed to delete course ${id}:`, error);
            throw error;
        }
    },

    // Get sections for a course
    getCourseSections: async (courseId) => {
        try {
            const params = {
                'courseId.equals': courseId,
                sort: 'orderIndex,asc'
            };
            const response = await apiClient.get(API_ENDPOINTS.SECTIONS.LIST, { params });
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch sections for course ${courseId}:`, error);
            return [];
        }
    },

    createSection: async (sectionData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.SECTIONS.LIST, sectionData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateSection: async (id, sectionData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.SECTIONS.DETAIL(id), sectionData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteSection: async (id) => {
        try {
            await apiClient.delete(API_ENDPOINTS.SECTIONS.DETAIL(id));
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Get lessons for a section
    getSectionLessons: async (sectionId) => {
        try {
            const params = {
                'sectionId.equals': sectionId,
                sort: 'orderIndex,asc'
            };
            const response = await apiClient.get(API_ENDPOINTS.LESSONS.LIST, { params });
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch lessons for section ${sectionId}:`, error);
            return [];
        }
    },

    createLesson: async (lessonData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.LESSONS.LIST, lessonData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateLesson: async (id, lessonData) => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.LESSONS.DETAIL(id), lessonData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteLesson: async (id) => {
        try {
            await apiClient.delete(API_ENDPOINTS.LESSONS.DETAIL(id));
            return true;
        } catch (error) {
            throw error;
        }
    },

    // Get individual lesson detail
    getLesson: async (lessonId) => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.LESSONS.DETAIL(lessonId));
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch lesson ${lessonId}:`, error);
            throw error;
        }
    },

    // Get full course curriculum (course + sections + lessons)
    getCourseCurriculum: async (courseId) => {
        try {
            // Fetch course detail
            const course = await courseService.getCourse(courseId);

            // Fetch all sections for this course
            const sections = await courseService.getCourseSections(courseId);

            // Fetch lessons for each section
            const sectionsWithLessons = await Promise.all(
                sections.map(async (section) => {
                    const lessons = await courseService.getSectionLessons(section.id);
                    return {
                        ...section,
                        lessons
                    };
                })
            );

            return {
                ...course,
                sections: sectionsWithLessons
            };
        } catch (error) {
            console.error(`Failed to fetch curriculum for course ${courseId}:`, error);
            throw error;
        }
    },

    // ─── Category APIs ────────────────────────────────────────────────────────

    getCategories: async ({ page = 0, size = 100, sort = 'orderIndex,asc' } = {}) => {
        try {
            const response = await apiClient.get('/api/categories', {
                params: { page, size, sort }
            });
            const totalElements = parseInt(response.headers['x-total-count'] || '0', 10);
            return {
                content: response.data,
                totalElements,
                totalPages: Math.ceil(totalElements / size)
            };
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            return { content: [], totalElements: 0, totalPages: 0 };
        }
    },

    createCategory: async (category) => {
        const response = await apiClient.post('/api/categories', category);
        return response.data;
    },

    updateCategory: async (id, category) => {
        const response = await apiClient.put(`/api/categories/${id}`, { ...category, id });
        return response.data;
    },

    deleteCategory: async (id) => {
        await apiClient.delete(`/api/categories/${id}`);
    },

    // ─── File Upload APIs ─────────────────────────────────────────────────────

    uploadVideo: async (file, onProgress) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post(API_ENDPOINTS.FILES.UPLOAD_VIDEO, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 600000, // 10 min timeout for large videos
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percent);
                }
            },
        });
        return response.data; // { filename, videoUrl, originalName, size, contentType }
    },

    getVideoUrl: (videoUrlOrPath) => {
        if (!videoUrlOrPath) return null;
        // If it's already a full URL (YouTube, external), return as-is
        if (videoUrlOrPath.startsWith('http://') || videoUrlOrPath.startsWith('https://')) {
            return videoUrlOrPath;
        }
        // If it's a relative API path like /api/files/video/xxx, prepend backend base URL
        const baseURL = apiClient.defaults.baseURL || '';
        return baseURL + videoUrlOrPath;
    },

    // ─── Image Upload APIs ────────────────────────────────────────────────────

    uploadImage: async (file, onProgress) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post(API_ENDPOINTS.FILES.UPLOAD_IMAGE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 60000, // 1 min timeout for images
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percent);
                }
            },
        });
        return response.data; // { filename, imageUrl, originalName, size, contentType }
    },

    getImageUrl: (imageUrlOrPath) => {
        if (!imageUrlOrPath) return null;
        // If it's already a full URL, return as-is
        if (imageUrlOrPath.startsWith('http://') || imageUrlOrPath.startsWith('https://')) {
            return imageUrlOrPath;
        }
        // If it's a relative API path like /api/files/image/xxx, prepend backend base URL
        const baseURL = apiClient.defaults.baseURL || '';
        return baseURL + imageUrlOrPath;
    },
};
