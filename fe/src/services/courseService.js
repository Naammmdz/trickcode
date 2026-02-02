const MOCK_COURSES = [
    {
        id: 101,
        title: 'Advanced React Patterns & Performance',
        price: 49.99,
        status: 'PUBLISHED',
        level: 'ADVANCED',
        instructor: { name: 'Sarah Drasner', email: 'sarah@trickcode.dev', avatar: null },
        createdAt: '2025-11-15T10:00:00Z',
        lessons: 24
    },
    {
        id: 102,
        title: 'Introduction to Rust Programming',
        price: 39.99,
        status: 'PENDING',
        level: 'BEGINNER',
        instructor: { name: 'Ryan Dahl', email: 'ryan@trickcode.dev', avatar: null },
        createdAt: '2026-01-20T08:30:00Z',
        lessons: 18,
        description: 'A comprehensive guide to getting started with Rust. Covers ownership, borrowing, lifetimes, and async programming.'
    },
    {
        id: 103,
        title: 'Mastering Kubernetes',
        price: 59.99,
        status: 'DRAFT',
        level: 'INTERMEDIATE',
        instructor: { name: 'Kelsey Hightower', email: 'kelsey@trickcode.dev', avatar: null },
        createdAt: '2026-01-28T14:15:00Z',
        lessons: 40
    },
    {
        id: 104,
        title: 'System Design Interview Guide',
        price: 0,
        status: 'PENDING',
        level: 'ADVANCED',
        instructor: { name: 'Alex Xu', email: 'alex@trickcode.dev', avatar: null },
        createdAt: '2026-02-01T09:00:00Z',
        lessons: 15,
        description: 'Prepare for your system design interview with real-world examples and deep dives into scalable architectures.'
    },
    {
        id: 105,
        title: 'Go: The Complete Developer\'s Guide',
        price: 29.99,
        status: 'REJECTED',
        level: 'BEGINNER',
        instructor: { name: 'Rob Pike', email: 'rob@trickcode.dev', avatar: null },
        createdAt: '2025-12-10T11:20:00Z',
        lessons: 50,
        rejectionReason: 'Audio quality in section 3 is too low. Please re-record.'
    }
];

export const courseService = {
    getCourses: async ({ page = 0, size = 10, status = null, q = '' }) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));

        let filtered = [...MOCK_COURSES];

        if (status && status !== 'ALL') {
            filtered = filtered.filter(c => c.status === status);
        }

        if (q) {
            const lowerQ = q.toLowerCase();
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(lowerQ) ||
                c.instructor.name.toLowerCase().includes(lowerQ) ||
                String(c.id).includes(lowerQ)
            );
        }

        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / size);
        const start = page * size;
        const content = filtered.slice(start, start + size);

        return {
            content,
            page,
            size,
            totalElements,
            totalPages
        };
    },

    getCourse: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return MOCK_COURSES.find(c => c.id === Number(id));
    },

    updateStatus: async (id, status, reason = null) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const course = MOCK_COURSES.find(c => c.id === Number(id));
        if (course) {
            course.status = status;
            if (reason) course.rejectionReason = reason;
        }
        return course;
    }
};
