# TrickCode — Demo Readiness Checklist

> Cập nhật: 2026-02-18

---

## 🔴 Ưu tiên cao — Blocker cho demo

### #1 Data Seeding ✅ (code xong, cần restart backend)

**Vấn đề:** DB trống khi khởi động → marketplace không có khóa học nào.

**Đã làm:** Viết lại `DataSeeder.java` với:
- 3 khóa học PUBLISHED đầy đủ (DP Patterns, Data Structures, Trees & Graphs)
- 4 khóa học thêm (Binary Search, Greedy, Backtracking, + PENDING + DRAFT)
- Quiz lessons có `quizConfig` JSON (4–5 câu hỏi)
- Code lessons có `codeChallengeConfig` JSON (starter code + test cases)
- Guard chống duplicate: chỉ seed khi DB trống

**Cần làm để hoàn tất:**
```bash
# Start PostgreSQL
docker compose -f be/backend-mono/src/main/docker/postgresql.yml up -d

# Start backend
cd be/backend-mono && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

---

### #2 Navigation Prev/Next bài học bị hardcode

**File:** `fe/src/pages/VideoWorkspace.jsx`, `QuizWorkspace.jsx`, `CodeWorkspace.jsx`

**Vấn đề:** Nút "Bài tiếp theo" hardcode ID bài học (`/lesson/1`, `/quiz/3`, `/code/4`).
Khi demo với data thật, navigation sẽ nhảy sai bài hoặc 404.

**Cần làm:**
- Lấy danh sách lessons của course từ API `/api/sections?courseId.equals={id}`
- Tính `prevLesson` / `nextLesson` dựa trên `orderIndex` và `section.orderIndex`
- Render nút Prev/Next động theo data thật

---

### #3 Code Execution là mock

**File:** `fe/src/pages/CodeWorkspace.jsx`

**Vấn đề:** `handleRunCode` trả về output cứng `"55\n"` bất kể code người dùng viết gì.

**Cần làm (chọn 1):**
- **Option A (nhanh):** Thêm banner "Demo Mode — Code execution simulated" để người xem biết
- **Option B (đầy đủ):** Tích hợp [Judge0 CE](https://github.com/judge0/judge0) (self-hosted) hoặc gọi API Judge0 public

---

### #4 Profile "Save Changes" không gọi API

**File:** `fe/src/pages/Profile.jsx`

**Vấn đề:** `handleSaveProfile` và `handleChangePassword` chỉ `console.log`, không persist.

**Cần làm:**
- `handleSaveProfile` → gọi `PUT /api/account` với `{ firstName, lastName, email, langKey }`
- `handleChangePassword` → gọi `POST /api/account/change-password` với `{ currentPassword, newPassword }`
- Hiển thị toast thành công / lỗi

---

### #5 Breadcrumb & tiêu đề bài học bị hardcode

**File:** `fe/src/pages/VideoWorkspace.jsx`, `QuizWorkspace.jsx`

**Vấn đề:**
- `VideoWorkspace` hiển thị "Course" thay vì tên thực của khóa học
- `QuizWorkspace` hardcode tên "Dynamic Programming Patterns" trong breadcrumb

**Cần làm:**
- Lấy `courseId` từ lesson → fetch course title từ API
- Render breadcrumb: `Marketplace > {courseName} > {lessonName}`

---

## 🟡 Ưu tiên trung bình — Ảnh hưởng UX demo

### #6 LessonProgress không được gọi từ Frontend

**File:** `fe/src/pages/VideoWorkspace.jsx`, `QuizWorkspace.jsx`, `CodeWorkspace.jsx`

**Vấn đề:** Backend có API `/api/lesson-progresses` nhưng FE không gọi khi user hoàn thành bài.
Progress bar trong syllabus (`ActiveCourse.jsx`) luôn hiển thị 0%.

**Cần làm:**
- Khi video kết thúc (hoặc user click "Mark as Complete") → gọi `POST /api/lesson-progresses`
- Khi submit quiz → gọi `POST /api/lesson-progresses` với `completed: true`
- Khi submit code thành công → gọi `POST /api/lesson-progresses`

---

### #7 Problems page dùng data mock

**File:** `fe/src/pages/Problems.jsx`

**Vấn đề:** 7 bài toán hardcode trong component, không kết nối backend.

**Cần làm:**
- Tạo endpoint backend `/api/problems` (hoặc dùng lessons có `type = CODE`)
- Hoặc: Đánh dấu rõ "Demo Data" trong UI để người xem biết

---

### #8 Instructor Dashboard tabs trống

**File:** `fe/src/pages/InstructorDashboard.jsx`

**Vấn đề:** Các tab Overview, Analytics, Payouts, Settings chỉ là placeholder `<div>`.

**Cần làm:**
- **Overview tab:** Hiển thị số học viên, doanh thu, rating từ API
- **Analytics tab:** Chart doanh thu theo tháng (dùng data từ `/api/admin/dashboard/chart`)
- **Payouts tab:** Lịch sử thanh toán từ `/api/orders`

---

### #9 Admin "Instructors" tab là placeholder

**File:** `fe/src/components/admin/` (tab Instructors)

**Vấn đề:** Dùng `PlaceholderTab` với data hardcode.

**Cần làm:**
- Fetch users có role `ROLE_INSTRUCTOR` từ `/api/admin/users?authorities=ROLE_INSTRUCTOR`
- Hiển thị danh sách, số khóa học, trạng thái

---

### #10 Profile avatar hardcode

**File:** `fe/src/pages/Profile.jsx` (line ~143)

**Vấn đề:** URL ảnh Google hardcode, không lấy từ user data thực.

**Cần làm:**
- Dùng `user.imageUrl` từ `AuthContext` nếu có
- Fallback: Avatar chữ cái đầu tên (initials avatar)

---

## 🟢 Ưu tiên thấp — Nice-to-have

### #11 AI Assistant button không hoạt động

**File:** `fe/src/pages/CodeWorkspace.jsx`

Button có UI đẹp nhưng click không làm gì. Có thể:
- Ẩn button nếu chưa tích hợp
- Hoặc mở modal "Coming Soon"

---

### #12 Bookmark/Share buttons không hoạt động

**File:** `fe/src/pages/VideoWorkspace.jsx`, `QuizWorkspace.jsx`

Có thể ẩn hoặc thêm toast "Feature coming soon".

---

### #13 ngrok URL backend bị hardcode

**File:** `fe/src/config/api.js`

**Vấn đề:** `baseURL` hardcode ngrok URL → sẽ lỗi khi URL ngrok thay đổi.

**Cần làm:**
- Dùng biến môi trường: `VITE_API_BASE_URL` trong `.env`
- `baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'`

---

### #14 File `code.html` thừa trong fe/

**File:** `fe/code.html`

File prototype cũ, không dùng. Xóa đi cho gọn.

---

### #15 Notification settings không lưu

**File:** `fe/src/pages/Profile.jsx` (section Notifications)

Toggle UI hoạt động nhưng không persist. Có thể thêm `localStorage` tạm thời.

---

## 📊 Tóm tắt tiến độ

| Mức độ | Tổng | Xong | Còn lại |
|--------|------|------|---------|
| 🔴 Cao | 5 | 1 (code xong) | 4 |
| 🟡 Trung bình | 5 | 0 | 5 |
| 🟢 Thấp | 5 | 0 | 5 |
| **Tổng** | **15** | **1** | **14** |

---

## 🚀 Thứ tự khuyến nghị để demo nhanh nhất

1. `#1` Restart backend để seed data → marketplace có khóa học
2. `#13` Fix ngrok URL → dùng `.env` để dễ đổi
3. `#2` Fix navigation bài học → flow học tập hoạt động đúng
4. `#4` Fix Profile save → user có thể cập nhật thông tin
5. `#5` Fix breadcrumb → UX mượt hơn
6. `#6` Gọi LessonProgress API → progress bar hoạt động
7. `#3` Thêm banner "Demo Mode" cho code execution
