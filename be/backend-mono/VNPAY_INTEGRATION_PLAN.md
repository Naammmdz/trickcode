# Kế hoạch tích hợp VNPay vào backend-mono

## 1) Mục tiêu
Tích hợp thanh toán VNPay theo luồng chuẩn:
- Backend tạo URL thanh toán (redirect) dựa trên đơn hàng.
- VNPay gọi **IPN** (server-to-server) để xác nhận kết quả.
- Return URL (browser redirect) dùng để hiển thị kết quả cho người dùng.
- Cập nhật trạng thái `Order` và thực hiện **fulfillment** (cấp quyền học/Enrollment) sau khi thanh toán thành công.

## 2) Hiện trạng hệ thống (đã rà soát)
- Module: `be/backend-mono`
- Entity: `Order` (`jhi_order`)
  - Field hiện có: `totalAmount`, `status` (`PENDING/COMPLETED/FAILED/REFUNDED`), `createdAt`, `paymentMethod`, `transactionId`, `user`, `course`.
- API hiện có: `OrderResource` cung cấp CRUD `/api/orders` (tạo/sửa/xóa/list/get).
- Chưa có luồng nghiệp vụ thanh toán:
  - Chưa có endpoint tạo payment URL.
  - Chưa có handler `returnUrl`.
  - Chưa có handler `ipnUrl`.
  - Chưa có logic verify signature VNPay.

## 3) Phạm vi thay đổi dự kiến

### 3.1 Thay đổi dữ liệu (Domain/DB)
**Mục tiêu**: Lưu đủ dữ liệu để đối soát VNPay, xử lý retry, và idempotency.

Tối thiểu cần bổ sung vào `Order` (hoặc tách entity `PaymentTransaction` nếu muốn chuẩn hoá):
- `paymentProvider` (vd: `VNPAY`) hoặc tận dụng `paymentMethod` nhưng nên chuẩn hoá giá trị.
- `paymentTxnRef` (map với `vnp_TxnRef`) **unique**.
- `vnpayTransactionNo` (map với `vnp_TransactionNo`) hoặc map vào `transactionId` hiện tại.
- `vnpayResponseCode` (map với `vnp_ResponseCode`) để trace.
- `paidAt` (thời điểm hoàn tất thanh toán).
- (Optional) `paymentUrl` (URL redirect đã tạo) để FE có thể hiển thị lại.

**DB migration**:
- Tạo Liquibase changelog mới để add column + unique constraint cho `paymentTxnRef`.

### 3.2 Quy ước mapping field
Khuyến nghị mapping rõ ràng để tránh nhầm:
- `paymentTxnRef` = `vnp_TxnRef` (bạn sinh, unique theo order/attempt).
- `transactionId` = `vnp_TransactionNo` (VNPay trả về) hoặc đổi tên field cho rõ.

### 3.3 Trạng thái đơn hàng (state machine)
Khuyến nghị:
- Khi tạo order: `PENDING`
- Khi tạo payment URL: vẫn `PENDING` + set `paymentProvider/method`, `paymentTxnRef`
- Khi IPN success (`vnp_ResponseCode == "00"` + chữ ký hợp lệ + amount khớp): `COMPLETED`
- Khi IPN fail/cancel (tuỳ response code): `FAILED`
- Refund: `REFUNDED` (nếu triển khai hoàn tiền)

**Nguyên tắc**:
- Không set `COMPLETED` dựa trên `returnUrl`.
- Xử lý IPN phải **idempotent** (VNPay có thể gọi lại nhiều lần).

## 4) Thiết kế API đề xuất
Tạo controller riêng thay vì nhét vào CRUD `OrderResource`.

### 4.1 Tạo URL thanh toán
- `POST /api/payments/vnpay/create`
  - Input tối thiểu: `orderId`
  - Validate:
    - Order tồn tại, thuộc user hiện tại (nếu yêu cầu auth).
    - Status đang `PENDING`.
  - Xử lý:
    - Sinh `paymentTxnRef`.
    - Tạo params VNPay, ký HMAC-SHA512, build URL.
    - Lưu order: `paymentTxnRef`, `paymentProvider/method`, (optional) `paymentUrl`.
  - Output: `{ paymentUrl, txnRef }`

### 4.2 Return URL (browser redirect)
- `GET /api/payments/vnpay/return`
  - Verify chữ ký.
  - Dùng để hiển thị kết quả.
  - Có thể trả về trạng thái order hiện tại (khuyến nghị) thay vì tự finalize.

### 4.3 IPN (server-to-server)
- `POST /api/payments/vnpay/ipn`
  - Verify chữ ký (bắt buộc).
  - Đối chiếu:
    - `vnp_TxnRef` -> tìm order.
    - `vnp_Amount` khớp `order.totalAmount * 100`.
    - Order status hợp lệ để chuyển trạng thái.
  - Update order theo kết quả.
  - Trigger fulfillment khi `COMPLETED`.
  - Trả response theo spec VNPay để dừng retry.

## 5) Service/Component cần thêm

### 5.1 `VnPayService`
- `String buildPaymentUrl(Order order, clientIp, locale, ...)`
- `boolean verifySignature(Map<String,String> params)`
- `String hmacSHA512(secret, data)`

### 5.2 `PaymentService` (orchestration)
- `createVnPayPayment(orderId, currentUser)`
- `handleVnPayIpn(params)`
- (Optional) `handleVnPayReturn(params)`

## 6) Cấu hình (application.yml)
Thêm config dưới `backend-mono/src/main/resources/config/application.yml`:
- `vnpay.tmnCode`
- `vnpay.hashSecret`
- `vnpay.payUrl` (sandbox/prod)
- `vnpay.returnUrl`
- `vnpay.ipnUrl`

Nguyên tắc:
- Không hardcode secret.
- Prod dùng ENV VAR / secret manager.

## 7) Security & vận hành
- Endpoint `ipn` thường public (không JWT), nhưng bắt buộc:
  - verify chữ ký
  - logging đầy đủ
  - idempotent update
- (Optional) allowlist IP VNPay nếu hạ tầng cho phép.

## 8) Fulfillment sau thanh toán
Sau khi IPN xác nhận thành công:
- Tạo `Enrollment` hoặc cập nhật quyền truy cập khoá học (tuỳ thiết kế hiện tại).
- Phải idempotent:
  - Nếu enrollment đã tồn tại thì không tạo lại.

## 9) Test/QA checklist
- Verify signature đúng với sandbox.
- Case amount mismatch => không hoàn tất đơn.
- IPN gọi lại nhiều lần => không tạo trùng enrollment.
- Return URL bị fake => không ảnh hưởng trạng thái (chỉ hiển thị theo dữ liệu server).
- Log trace theo `paymentTxnRef`.

## 10) Câu hỏi cần chốt trước khi implement
- Luồng tạo order:
  - Tạo order trước rồi mới tạo payment?
  - Hay click mua là tạo order + tạo payment URL luôn?
- Mapping `transactionId`:
  - Bạn muốn lưu `vnp_TransactionNo` hay `vnp_TxnRef`?
- Fulfillment:
  - Sau khi `COMPLETED` thì cấp quyền bằng `Enrollment` hay logic khác?
