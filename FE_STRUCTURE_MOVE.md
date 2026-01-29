## Move frontend into `fe/`

Mục tiêu: gom toàn bộ code frontend (Vite/React) vào folder `fe/`, để root repo sạch cho backend ở `be/`.

Chạy các lệnh sau tại root repo:

```bash
# tạo folder (đã có sẵn trong repo)
mkdir -p fe be

# move frontend code vào fe/
mv src fe/
mv public fe/
mv index.html fe/
mv postcss.config.cjs fe/
mv tailwind.config.cjs fe/
mv eslint.config.js fe/
mv vite.config.js fe/
mv package.json fe/
mv package-lock.json fe/

# tuỳ chọn: move dist (output build) nếu đang có
mv dist fe/ 2>/dev/null || true

# tuỳ chọn: các file docs/khác
mv BACKEND_SETUP.md fe/ 2>/dev/null || true
mv code.html fe/ 2>/dev/null || true
```

Sau đó (ở root) bạn có 2 lựa chọn:

### Option A (khuyến nghị): tạo root `package.json` để chạy scripts tiện

```bash
cat > package.json << 'EOF'
{
  "private": true,
  "name": "trickcode-monorepo",
  "scripts": {
    "dev": "npm --prefix fe run dev",
    "build": "npm --prefix fe run build",
    "preview": "npm --prefix fe run preview",
    "lint": "npm --prefix fe run lint"
  }
}
EOF
```

### Option B: chạy trực tiếp trong `fe/`

```bash
cd fe
npm install
npm run dev
```

