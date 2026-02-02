# Backend Mono API Endpoints

## Authentication & User Management

### `AccountResource`
- [ ] `POST /api/register` - Register new account
- [ ] `GET /api/activate` - Activate account
- [ ] `GET /api/account` - Get current account info
- [ ] `POST /api/account` - Update account info
- [ ] `POST /api/account/change-password` - Change password
- [ ] `POST /api/account/reset-password/init` - Initiate password reset
- [ ] `POST /api/account/reset-password/finish` - Complete password reset

### `AuthenticateController`
- [ ] `POST /api/authenticate` - User login
- [ ] `GET /api/authenticate` - Check authentication status

## User Management (Admin)

### `UserResource`
- [ ] `POST /api/admin/users` - Create new user (admin)
- [ ] `PUT /api/admin/users` or `/api/admin/users/{login}` - Update user
- [ ] `GET /api/admin/users` - Get all users
- [ ] `GET /api/admin/users/{login}` - Get user by login
- [ ] `DELETE /api/admin/users/{login}` - Delete user

### `AuthorityResource`
- [ ] `POST /api/authorities` - Create authority
- [ ] `GET /api/authorities` - Get all authorities
- [ ] `GET /api/authorities/{id}` - Get authority by ID
- [ ] `DELETE /api/authorities/{id}` - Delete authority

## Course Management

### `CourseResource`
- [ ] `POST /api/courses` - Create new course
- [ ] `PUT /api/courses/{id}` - Update course
- [ ] `PATCH /api/courses/{id}` - Partially update course
- [ ] `GET /api/courses` - Get all courses
- [ ] `GET /api/courses/count` - Get course count
- [ ] `GET /api/courses/{id}` - Get course by ID
- [ ] `DELETE /api/courses/{id}` - Delete course

### `SectionResource`
- [ ] `POST /api/sections` - Create new section
- [ ] `PUT /api/sections/{id}` - Update section
- [ ] `PATCH /api/sections/{id}` - Partially update section
- [ ] `GET /api/sections` - Get all sections
- [ ] `GET /api/sections/{id}` - Get section by ID
- [ ] `DELETE /api/sections/{id}` - Delete section

### `LessonResource`
- [ ] `POST /api/lessons` - Create new lesson
- [ ] `PUT /api/lessons/{id}` - Update lesson
- [ ] `PATCH /api/lessons/{id}` - Partially update lesson
- [ ] `GET /api/lessons` - Get all lessons
- [ ] `GET /api/lessons/{id}` - Get lesson by ID
- [ ] `DELETE /api/lessons/{id}` - Delete lesson

## User Progress

### `EnrollmentResource`
- [ ] `POST /api/enrollments` - Enroll in a course
- [ ] `PUT /api/enrollments/{id}` - Update enrollment
- [ ] `PATCH /api/enrollments/{id}` - Partially update enrollment
- [ ] `GET /api/enrollments` - Get all enrollments
- [ ] `GET /api/enrollments/count` - Get enrollment count
- [ ] `GET /api/enrollments/{id}` - Get enrollment by ID
- [ ] `DELETE /api/enrollments/{id}` - Delete enrollment

### `LessonProgressResource`
- [ ] `POST /api/lesson-progresses` - Create lesson progress
- [ ] `PUT /api/lesson-progresses/{id}` - Update progress
- [ ] `PATCH /api/lesson-progresses/{id}` - Partially update progress
- [ ] `GET /api/lesson-progresses` - Get all progress records
- [ ] `GET /api/lesson-progresses/{id}` - Get progress by ID
- [ ] `DELETE /api/lesson-progresses/{id}` - Delete progress

## Order Management

### `OrderResource`
- [ ] `POST /api/orders` - Create new order
- [ ] `PUT /api/orders/{id}` - Update order
- [ ] `PATCH /api/orders/{id}` - Partially update order
- [ ] `GET /api/orders` - Get all orders
- [ ] `GET /api/orders/count` - Get order count
- [ ] `GET /api/orders/{id}` - Get order by ID
- [ ] `DELETE /api/orders/{id}` - Delete order

## Public Endpoints

### `PublicUserResource`
- [ ] `GET /api/users` - Get public user information

## Usage Instructions
1. Check off endpoints as you implement them in the frontend
2. Add any additional notes or implementation details under each endpoint
3. Update the status in the markdown file as you progress

## Notes
- All API endpoints are prefixed with `/api`
- Authentication is required for most endpoints (except public ones)
- Admin endpoints are under `/api/admin/`
- IDs in curly braces `{id}` are path variables

## Last Updated
2026-02-03