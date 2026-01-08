Dưới đây là các bộ dữ liệu mẫu (JSON) để bạn kiểm tra toàn bộ 3 tính năng: **LiquidJS**, **Idempotency** và **Digest** trong Postman.

### 1. Cấu hình Postman
*   **Method:** `POST`
*   **URL:** `http://localhost:3000/api/notification/create`
*   **Headers:** 
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <TOKEN_CỦA_RECRUITER_HOẶC_ADMIN>`

---

### 2. Các kịch bản Test

#### Kịch bản 1: Test Digest (Gom thông báo - Cho Recruiter)
*Giả sử template `NEW_CANDIDATE_APPLIED` có `allowDigest: true`.*

**Lần gửi 1 (Tạo mới):**
```json
{
    "userId": "ID_CỦA_NHÀ_TUYỂN_DỤNG",
    "templateKey": "NEW_CANDIDATE_APPLIED",
    "targetId": "JOB_ID_123", 
    "payload": {
        "jobTitle": "Senior React Developer"
    },
    "type": "APPLICATION_STATUS",
    "link": "/recruiter/jobs/JOB_ID_123"
}
```
*   **Kết quả:** Trả về `201 Created`. `content` sẽ là: "Bạn có 1 ứng viên mới cho vị trí Senior React Developer."

**Lần gửi 2 (Gom vào cái cũ - gửi sau đó vài giây):**
*(Dùng y hệt dữ liệu trên)*
*   **Kết quả:** Trả về `200 OK`. `content` sẽ tự cập nhật thành: "Bạn có **2** ứng viên mới cho vị trí Senior React Developer." (Nhờ logic LiquidJS `{{ count }}`).

---

#### Kịch bản 2: Test Idempotency (Chống trùng lặp - Cho Candidate)
*Giả sử template `NEW_INTERVIEW` có `allowDigest: false`.*

**Lần gửi 1:**
```json
{
    "userId": "ID_CỦA_ỨNG_VIÊN",
    "templateKey": "NEW_INTERVIEW",
    "targetId": "INTERVIEW_ID_999",
    "payload": {
        "jobTitle": "NodeJS Developer",
        "time": "10:00 AM ngày 01/01/2025"
    },
    "type": "NEW_INTERVIEW",
    "link": "/candidate/interviews"
}
```
*   **Kết quả:** Trả về `201 Created`.

**Lần gửi 2 (Bấm nhầm hoặc lag mạng gửi lại):**
*(Dùng y hệt dữ liệu trên)*
*   **Kết quả:** Trả về `200 OK` nhưng trả về **Dữ liệu cũ**. Hệ thống không tạo thêm thông báo mới trong Database, giúp ứng viên không bị nhận 2 cái chuông báo giống hệt nhau.

---

#### Kịch bản 3: Test LiquidJS Filters (Ngày tháng & Giá trị mặc định)
*Giả sử bạn có template dùng filter date: `{{ time | date: "%H:%M %d/%m/%Y" }}`*

```json
{
    "userId": "ID_USER",
    "templateKey": "NEW_INTERVIEW",
    "payload": {
        "jobTitle": "AI Engineer",
        "time": "2024-12-31T14:30:00Z" 
    },
    "type": "NEW_INTERVIEW"
}
```
*   **Kết quả:** LiquidJS sẽ tự render `content` thành: "...vào lúc 14:30 31/12/2024". Bạn không cần format chuỗi ngày tháng ở phía gửi.

---

### 3. Cách kiểm tra logic có chạy đúng không?

| Tính năng | Kiểm tra trong Response Postman | Kiểm tra trong Database (MongoDB) |
| :--- | :--- | :--- |
| **Digest** | Lần 2 trả về mã `200`, `content` có số lượng tăng lên. | Trường `digestCount` tăng lên, `isDigested` thành `true`. |
| **Idempotency** | Gửi nhiều lần cùng 1 `targetId` chỉ trả về 1 `id` duy nhất. | Chỉ có duy nhất 1 bản ghi với `idempotencyKey` đó. |
| **LiquidJS** | Kiểm tra trường `content` xem các biến `{{ }}` đã được thay bằng giá trị thật chưa. | Trường `content` lưu chuỗi đã render sạch sẽ. |

### Lưu ý:
1.  **userId:** Bạn phải lấy một ID thật từ bảng `User` trong MongoDB của mình.
2.  **targetId:** Để test **Digest**, `targetId` nên là ID của công việc (Job). Để test **Idempotency**, `targetId` nên là ID của đơn ứng tuyển hoặc lịch phỏng vấn.
3.  **10 phút:** Nhớ rằng logic Digest chỉ gom nếu thông báo cũ chưa quá 10 phút. Nếu bạn đợi quá lâu mới gửi lần 2, nó sẽ tạo thông báo mới.

 **Socket.io Emit:**
    *   Lấy instance `io` từ biến `global`.
    *   `io.to(userId).emit('new_notification', data)`: Gửi cho thông báo mới.
    *   `io.to(userId).emit('notification_updated', data)`: Gửi khi gom nhóm.

## 4. Cấu trúc Server (Port 3000)
Thay vì sử dụng server mặc định của Next.js, chúng ta sử dụng một **Custom Server (`server.ts`)**.

*   **Cơ chế:** Khởi tạo `http.createServer` -> Bọc `nextApp.getRequestHandler()` -> Gắn `new Server(httpServer)`.
*   **Phân quyền Socket:** Mỗi người dùng khi kết nối sẽ được đưa vào một "Phòng" (Room) riêng biệt dựa trên `userId`.
    *   `socket.join(userId)`: Đảm bảo thông báo chỉ gửi đúng đến người cần nhận.

## 5. Hướng dẫn Test (Postman)

1.  **Kết nối Socket:**
    *   URL: `http://localhost:3000`
    *   Params: `userId = <ID_CỦA_BẠN>`
    *   Listen Events: `new_notification`, `notification_updated`.
2.  **Gửi API:**
    *   URL: `http://localhost:3000/api/notifications/create`
    *   Header: `Authorization: Bearer <TOKEN>`
    *   Body: Gửi đúng `userId` đã kết nối ở bước 1.
3.  **Kiểm tra:** Quan sát tab Socket để thấy dữ liệu nhảy về Real-time.
