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

Dưới đây là file `README.md` tóm tắt toàn bộ quy trình thiết lập và sử dụng **BullMQ** để gửi Email trong dự án của bạn (Hono + Prisma + Node.js).

---

# 📬 Hướng dẫn Triển khai Hệ thống Gửi Email với BullMQ

## 🌟 Tại sao dùng BullMQ?
*   **API không bị treo:** Người dùng nhận được phản hồi ngay lập tức, việc gửi mail chạy ngầm.
*   **Tự động thử lại (Retry):** Nếu server mail lỗi, BullMQ tự động gửi lại theo chính sách (Exponential backoff).
*   **Lên lịch (Delay):** Hỗ trợ gửi mail sau một khoảng thời gian định trước (ví dụ: nhắc lịch phỏng vấn).

---

## 🛠️ Bước 1: Cài đặt Thư viện
Chạy lệnh sau để cài đặt các thành phần cần thiết:
```bash
npm install bullmq ioredis nodemailer liquidjs
```

---

## ⚙️ Bước 2: Cấu hình Kết nối Redis (`src/lib/db.ts`)
BullMQ yêu cầu kết nối `ioredis` với cấu hình đặc thù.
```typescript
import { Redis } from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: null, // Bắt buộc phải là null cho BullMQ
});
```

---

## 📤 Bước 3: Thiết lập hàng đợi (Queue - Producer)
Tạo file `src/queues/mail.queue.ts` để định nghĩa cách đẩy yêu cầu gửi mail vào hàng đợi.

```typescript
import { Queue } from 'bullmq';
import { redis } from '@/lib/db';

export const mailQueue = new Queue('mail-queue', { connection: redis });

export const addMailJob = async (data: {
  to: string;
  subject: string;
  templateKey: string; // VD: 'INTERVIEW_INVITE'
  payload: any;        // Dữ liệu truyền vào template
}) => {
  await mailQueue.add('send-mail', data, {
    attempts: 3,        // Thử lại 3 lần nếu lỗi
    backoff: { type: 'exponential', delay: 10000 }, // Đợi 10s mới thử lại
    removeOnComplete: true, // Xóa dữ liệu cũ sau khi xong cho sạch Redis
  });
};
```

---

## 📥 Bước 4: Thiết lập bộ xử lý (Worker - Consumer)
Tạo file `src/queues/mail.worker.ts` để thực hiện gửi mail thật sự thông qua Nodemailer.

```typescript
import { Worker } from 'bullmq';
import { redis } from '@/lib/db';
import nodemailer from 'nodemailer';
import { Liquid } from 'liquidjs';

const engine = new Liquid();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export const mailWorker = new Worker('mail-queue', async (job) => {
  const { to, templateKey, payload } = job.data;
  
  // 1. Lấy template tương ứng (Ví dụ đơn giản)
  const body = "Chào {{ name }}, bạn có lịch phỏng vấn vào {{ time }}.";
  const html = await engine.parseAndRender(body, payload);

  // 2. Gửi mail
  await transporter.sendMail({
    from: `"SmartRecruit AI" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Thông báo từ hệ thống",
    html
  });
}, { connection: redis });
```

---

## 🚀 Bước 5: Kích hoạt Worker
Trong file khởi động server (`src/index.ts` hoặc `server.ts`), bạn **bắt buộc** phải import file worker để nó bắt đầu lắng nghe Redis:

```typescript
// server.ts
import './queues/mail.worker'; 
import './queues/reminder.worker';
```

---

## 💻 Bước 6: Sử dụng trong API (Service Layer)
Khi cần gửi mail (ví dụ khi tạo phỏng vấn), bạn chỉ cần gọi hàm `addMailJob`.

```typescript
// src/server/routes/interview.ts
import { addMailJob } from '@/queues/mail.queue';

interviewRoute.post('/create', async (c) => {
  // ... lưu Database ...
  
  await addMailJob({
    to: "candidate@gmail.com",
    templateKey: "INTERVIEW_INVITE",
    payload: { name: "An", time: "10:00 AM" }
  });

  return c.json({ message: "Đã gửi mail mời phỏng vấn!" }, 201);
});
```

---

## 🛡️ Cấu hình Biến môi trường (.env)
Đảm bảo bạn đã cấu hình đúng thông tin SMTP của Google:
```env
REDIS_URL=redis://127.0.0.1:6379
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx (Mật khẩu ứng dụng 16 số)
```

## 🔍 Cách kiểm tra (Debugging)
1.  **Log Terminal:** Xem Worker có in dòng `✅ Email sent...` không.
2.  **Redis CLI:** Gõ `keys bull:mail-queue:*` để xem các Job đang chờ xử lý.
3.  **Postman:** Gọi API và kiểm tra mail về hòm thư người nhận sau khoảng 2-5 giây.

---
**Lưu ý:** Đối với môi trường Production, hãy đảm bảo Redis không bị đầy dung lượng bằng cách sử dụng cấu hình `removeOnComplete: true` và `removeOnFail: { count: 100 }`.
