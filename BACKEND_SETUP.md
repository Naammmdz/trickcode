# Hướng dẫn kết nối Backend

## Tổng quan

Project này đã được thiết lập để kết nối với backend API. Dưới đây là các thành phần đã được tạo và cách sử dụng.

## Các file đã tạo

### 1. Cấu hình API (`src/config/api.js`)
- Chứa cấu hình base URL và các endpoints
- Sử dụng biến môi trường để cấu hình

### 2. API Client (`src/services/api.js`)
- Axios instance với interceptors
- Tự động thêm token vào headers
- Xử lý lỗi toàn cục (401 redirect, network errors)

### 3. Services
- `src/services/authService.js` - Xử lý authentication
- `src/services/newsService.js` - Xử lý news/articles
- `src/services/problemsService.js` - Xử lý problems

### 4. Auth Context (`src/contexts/AuthContext.jsx`)
- Quản lý trạng thái authentication toàn ứng dụng
- Cung cấp `useAuth` hook để sử dụng trong components

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Tạo file `.env`

Tạo file `.env` trong thư mục root với nội dung:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
VITE_ENV=development
```

**Lưu ý:** Thay đổi `VITE_API_BASE_URL` thành URL backend của bạn.

### 3. Cấu trúc API Backend mong đợi

#### Authentication Endpoints

```
POST /api/auth/login
Body: { email: string, password: string }
Response: { token: string, user: object }

POST /api/auth/signup
Body: { name: string, email: string, password: string }
Response: { token: string, user: object }

POST /api/auth/logout
Headers: Authorization: Bearer <token>

GET /api/auth/profile
Headers: Authorization: Bearer <token>
Response: { user: object }
```

#### News Endpoints

```
GET /api/news?page=1&limit=10&category=all&search=query
Response: { articles: [], totalPages: number, currentPage: number }

GET /api/news/:id
Response: { article: object }

GET /api/news/categories
Response: { categories: [] }

GET /api/news/search?q=query&page=1&limit=10
Response: { articles: [], totalPages: number }

POST /api/news/subscribe
Body: { email: string }
```

#### Problems Endpoints

```
GET /api/problems?page=1&limit=20&difficulty=easy&tags=array
Response: { problems: [], totalPages: number }

GET /api/problems/:id
Response: { problem: object }

POST /api/problems/:id/submit
Body: { code: string, language: string }
Response: { result: object }

GET /api/problems/filters
Response: { difficulties: [], tags: [] }
```

## Cách sử dụng

### Trong Components

```jsx
import { useAuth } from '../contexts/AuthContext';
import { newsService } from '../services/newsService';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'password' });
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };
  
  const loadNews = async () => {
    try {
      const data = await newsService.getArticles(1, 'all', '');
      console.log(data.articles);
    } catch (error) {
      console.error('Failed to load news:', error.message);
    }
  };
}
```

### Protected Routes (Tùy chọn)

Nếu bạn muốn bảo vệ các routes, có thể tạo ProtectedRoute component:

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};
```

## Các tính năng đã tích hợp

✅ Authentication (Login/Signup)
✅ Token management (localStorage)
✅ Auto token injection vào requests
✅ Error handling toàn cục
✅ 401 redirect tự động
✅ News service integration
✅ Problems service integration

## Lưu ý quan trọng

1. **CORS**: Đảm bảo backend của bạn đã cấu hình CORS để cho phép frontend kết nối
2. **Token Storage**: Token hiện tại được lưu trong localStorage. Có thể chuyển sang httpOnly cookies để bảo mật hơn
3. **Error Handling**: Tất cả errors đều được catch và hiển thị message. Có thể customize thêm UI error handling
4. **Loading States**: Các components đã có loading states cơ bản, có thể cải thiện thêm

## Bước tiếp theo

1. Cài đặt axios: `npm install axios`
2. Tạo file `.env` với URL backend của bạn
3. Test kết nối với backend
4. Customize error handling và loading states theo nhu cầu
5. Thêm các services khác (contests, interview, learn) nếu cần
