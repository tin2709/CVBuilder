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

Dưới đây là bản tóm tắt kỹ thuật trích xuất thông tin việc làm từ URL sử dụng bộ ba thư viện **Axios, JSDOM và Readability** dành cho dự án của bạn.

---

# 🛠 Tài liệu Kỹ thuật: Trích xuất nội dung Job từ URL (Job Scraping & Cleaning)

## 1. Giới thiệu
Kỹ thuật này cho phép Nhà tuyển dụng nhập một đường dẫn (URL) bài đăng tuyển dụng bất kỳ. Hệ thống sẽ tự động truy cập, loại bỏ các thành phần rác (quảng cáo, menu, footer) và trích xuất nội dung cốt lõi (Tiêu đề, Mô tả, Yêu cầu) để tự động điền vào form đăng tin.

## 2. Các thư viện sử dụng
*   **Axios**: Thư viện HTTP Client dùng để tải nội dung HTML thô từ URL đích.
*   **JSDOM**: Giả lập môi trường trình duyệt (DOM) trong môi trường Node.js để có thể thao tác với HTML.
*   **@mozilla/readability**: Thư viện do Mozilla phát triển (dùng cho tính năng "Reader View" của Firefox), giúp lọc bỏ các thành phần thừa và chỉ giữ lại nội dung chính của bài viết.

## 3. Quy trình xử lý (Workflow)

1.  **Tải HTML**: Gửi yêu cầu GET tới URL bằng Axios với các Header giả lập người dùng thật (User-Agent) để tránh bị chặn (Error 403).
2.  **Khởi tạo DOM**: Đưa dữ liệu HTML thô vào JSDOM để tạo ra một đối tượng Document.
3.  **Lọc nội dung sạch**: Sử dụng Readability để phân tích Document. Kết quả trả về gồm có:
    *   `title`: Tiêu đề bài đăng.
    *   `textContent`: Toàn bộ nội dung văn bản đã được lọc "sạch" rác.
    *   `siteName`: Tên trang web nguồn.
4.  **Bóc tách dữ liệu (Parsing)**: Sử dụng logic tìm kiếm từ khóa (Regex hoặc String mapping) hoặc tích hợp AI để chia nội dung sạch vào các trường: `Mô tả công việc`, `Yêu cầu ứng viên`, `Mức lương`.

## 4. Mã nguồn triển khai mẫu

```typescript
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

async function importJobFromLink(url: string) {
  // 1. Tải HTML với Header giả lập trình duyệt
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    }
  });

  // 2. Tạo DOM ảo
  const dom = new JSDOM(response.data, { url });

  // 3. Sử dụng Readability để lọc nội dung chính
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (article) {
    return {
      title: article.title,
      content: article.textContent, // Nội dung "sạch" rác
      company: article.siteName
    };
  }
}
```

## 5. Ưu điểm và Hạn chế

### ✅ Ưu điểm
*   **Tốc độ cực nhanh**: Xử lý trong mili giây vì không cần mở trình duyệt thật.
*   **Tiết kiệm tài nguyên**: Tiết kiệm 70-80% dung lượng text so với HTML thô, đặc biệt hiệu quả khi gửi dữ liệu cho AI xử lý tiếp (giảm chi phí Token).
*   **Trải nghiệm người dùng**: Giúp Nhà tuyển dụng đăng tin nhanh chóng mà không cần copy-paste thủ công.

### ⚠️ Hạn chế & Giải pháp
*   **Chống Bot (Anti-bot)**: Một số trang lớn (LinkedIn, Indeed) có thể chặn request (Lỗi 403). 
    *   *Giải pháp:* Sử dụng Proxy hoặc chuyển sang dùng Playwright cho các link khó.
*   **Nội dung động (SPA)**: Các trang web render hoàn toàn bằng JavaScript sau khi load sẽ không lấy được dữ liệu bằng Axios.
    *   *Giải pháp:* Ưu tiên các trang tuyển dụng có cấu trúc HTML tĩnh hoặc dùng hệ thống ATS (Lever, Greenhouse).

## 6. Ứng dụng trong dự án
Hệ thống tích hợp tính năng này vào Route `POST /api/jobs/import-link`. Dữ liệu sau khi trích xuất sẽ được trả về Frontend để đổ vào các ô nhập liệu trong trang "Tạo tin tuyển dụng", giúp quy trình của Nhà tuyển dụng trở nên chuyên nghiệp và thông minh hơn.

---
**Ghi chú:** Luôn luôn cung cấp giá trị mặc định cho các trường dữ liệu (`?? ""`) để đảm bảo tính ổn định của hệ thống TypeScript.

Dưới đây là bản tóm tắt kỹ thuật **Reactive Storage** dùng để đồng bộ hóa dữ liệu (User, Token, Theme) giữa nhiều tab và cập nhật UI ngay lập tức, dành cho file README của bạn.

---

# 🔄 Kỹ thuật Reactive Storage - Đồng bộ dữ liệu đa tab (Next.js & React)

## 1. Giới thiệu
Kỹ thuật này được áp dụng để giải quyết vấn đề dữ liệu trong `localStorage` bị "lỗi thời" (stale) khi người dùng mở nhiều tab hoặc khi dữ liệu thay đổi mà React không nhận biết được để cập nhật giao diện. 

Dựa trên kiến trúc của các dự án lớn như **Firecrawl**, hệ thống sử dụng lớp trừu tượng `BaseStorage` kết hợp với hook `useSyncExternalStore` của React 18.

## 2. Tại sao cần Reactive Storage?
*   **Mặc định của Trình duyệt**: Lệnh `localStorage.setItem()` không phát ra sự kiện thông báo cho chính tab đang thực hiện lệnh đó.
*   **Hạn chế của React**: React không tự động Render lại (re-render) khi giá trị trong Storage thay đổi nếu không có State can thiệp.
*   **Đồng bộ đa tab**: Giúp người dùng đăng xuất ở Tab 1 thì Tab 2 cũng tự động cập nhật về trạng thái chưa đăng nhập ngay lập tức.

## 3. Kiến trúc thành phần

### A. Lớp quản lý (LocalStorageManager)
Đóng vai trò là "người quan sát" (Observable).
*   **`subscribe`**: Đăng ký lắng nghe sự kiện `storage` (từ tab khác) và sự kiện `custom-event` (trong cùng tab).
*   **`getSnapshot`**: Hàm lấy dữ liệu hiện tại từ Storage để cung cấp cho React.
*   **`set/remove`**: Thực hiện ghi/xóa dữ liệu đồng thời phát đi một tín hiệu (Trigger) để báo cho các component cần cập nhật.

### B. Hook tùy chỉnh (useReactiveStorage)
Cầu nối giữa Storage và UI.
*   Sử dụng `useSyncExternalStore` để đảm bảo UI luôn khớp với "nguồn dữ liệu thực" (Single Source of Truth) từ Storage.
*   Xử lý **SSR Guard**: Kiểm tra `typeof window !== 'undefined'` để tránh lỗi "window is not defined" khi Next.js render phía server.

## 4. Quy trình xử lý dữ liệu

1.  **Ghi dữ liệu**: Khi gọi `userStorage.set(data)`, hệ thống lưu vào `localStorage` và phát một `CustomEvent`.
2.  **Thông báo**: 
    *   Các component trong **cùng tab** nhận tín hiệu từ `CustomEvent`.
    *   Các component ở **tab khác** nhận tín hiệu từ sự kiện `storage` của trình duyệt.
3.  **Cập nhật UI**: Hook `useSyncExternalStore` nhận thấy tín hiệu thay đổi, gọi `getSnapshot` và yêu cầu React vẽ lại giao diện với dữ liệu mới nhất.

## 5. Mã nguồn triển khai tóm tắt

```typescript
// Quản lý việc đăng ký và phát tín hiệu
export class LocalStorageManager {
  subscribe = (callback) => {
    window.addEventListener("storage", callback); // Tabs khác
    window.addEventListener("local-update", callback); // Cùng tab
    return () => { ... };
  };
  getSnapshot = () => localStorage.getItem(this.key);
}

// Hook sử dụng trong Component
export function useReactiveStorage(manager) {
  return useSyncExternalStore(manager.subscribe, manager.getSnapshot, () => null);
}
```

## 6. Lợi ích vượt trội
*   **Hiệu suất cao**: Tránh sử dụng quá nhiều `useEffect` và `useState` thủ công.
*   **Trải nghiệm người dùng (UX)**: Giao diện cực kỳ mượt mà, đồng nhất về trạng thái đăng nhập và giao diện (Dark/Light mode) trên toàn bộ các tab trình duyệt.
*   **Code sạch (Clean Code)**: Tách biệt hoàn toàn logic lưu trữ và logic hiển thị.

## 7. Ứng dụng thực tế trong dự án
*   **User Profile**: Cập nhật tên và avatar người dùng trên Navbar ngay khi Login/Logout.
*   **Theme Switcher**: Đồng bộ chế độ Dark Mode (DarkReader) trên tất cả các tab đang mở.
*   **Auth Token**: Tự động xử lý khi Token hết hạn hoặc bị xóa.

---
**Ghi chú:** Khi sử dụng với Next.js, luôn đảm bảo logic can thiệp vào DOM/Window chỉ chạy sau khi component đã **Mounted** ở phía Client.
Dưới đây là bản tóm tắt kỹ thuật về hai tính năng bảo mật quan trọng nhất trong hệ thống của bạn, được trình bày dưới dạng file `README.md` chuyên nghiệp.

---

# 🛡️ Kiến trúc Bảo mật & Quyền riêng tư (Privacy-First Architecture)

Tài liệu này giải quyết hai vấn đề nhạy cảm nhất trong nền tảng tuyển dụng: **Theo dõi hành vi ứng viên** và **Nỗi sợ bị trả đũa khi đánh giá công ty**. Hệ thống sử dụng các kỹ thuật mã hóa hiện đại để đảm bảo ngay cả quản trị viên (Admin) cũng không thể truy ngược danh tính người dùng.

---

## 1. Phân tích Lượt xem Ẩn danh (Privacy-First Job Analytics)

Thay vì dùng Cookie hoặc ID người dùng để đếm lượt xem (vốn tạo ra dấu vết số), hệ thống sử dụng cơ chế **"Mã vân tay tạm thời"**.

### ⚙️ Cơ chế hoạt động
Mỗi lượt xem được định danh bằng một mã Hash duy nhất trong ngày:
`VisitorHash = SHA256(IP + UserAgent + DailySalt)`

*   **Daily Salt:** Một chuỗi bí mật thay đổi mỗi ngày. 
    *   *Lợi ích:* Mã Hash của cùng một người vào hôm qua và hôm nay sẽ khác nhau hoàn toàn. Điều này ngăn chặn việc theo dõi hành vi ứng viên xuyên suốt nhiều ngày.
*   **Redis HyperLogLog (PFADD):**
    *   Sử dụng thuật toán xác suất để đếm "Unique Visitors".
    *   **Tiết kiệm tài nguyên:** Chỉ tốn tối đa **12KB** RAM cho mỗi tin tuyển dụng, bất kể có hàng triệu lượt xem.
    *   **Tính ẩn danh:** HyperLogLog chỉ lưu các bit trạng thái, không lưu dữ liệu đầu vào (Hash), khiến việc rò rỉ dữ liệu trở nên vô hại.

### 🌟 Kết quả
*   Đếm chính xác lượt xem duy nhất (không bị ảo bởi F5).
*   Không cần bảng thông báo Cookie (Cookie Banners).
*   Tuân thủ tuyệt đối chuẩn bảo mật GDPR.

---

## 2. Đánh giá Công ty Ẩn danh thực thụ (Truly Anonymous Reviews)

Tính năng này cho phép ứng viên viết đánh giá về công ty cũ mà không lo bị "truy tìm" danh tính, nhờ việc cắt đứt mọi liên kết vật lý với bảng người dùng trong Database.

### ⚙️ Cơ chế hoạt động
Trong bảng `Review`, chúng ta tuyệt đối **không lưu `userId`**. Thay vào đó, hệ thống lưu trữ 2 mã băm (Hash) dựa trên **Permanent Salt** (Salt cố định):

1.  **`authorHash` (Unique):** `Hash(userId + companyId + Salt)`
    *   *Mục đích:* Đảm bảo mỗi người chỉ được đánh giá một công ty duy nhất 1 lần. Nếu nộp bài thứ 2, Database sẽ chặn do trùng mã Hash.
2.  **`userReviewKey` (Index):** `Hash(userId + Salt)`
    *   *Mục đích:* Giúp ứng viên xem lại lịch sử các bài đánh giá của chính mình mà không cần liên kết trực tiếp với tài khoản cá nhân.

### 🛡️ Cách kiểm tra Quyền sở hữu (Sửa/Xóa)
Vì Database không biết ai là chủ bài viết, khi người dùng muốn Sửa hoặc Xóa, hệ thống sẽ:
1.  Lấy `userId` từ JWT Token của người đang đăng nhập.
2.  Thực hiện băm `userId` đó với Salt để tạo ra mã Hash tạm thời.
3.  So sánh mã Hash vừa tạo với `userReviewKey` trong Database. Nếu khớp, quyền chỉnh sửa sẽ được cấp.

### 🌟 Kết quả
*   **Leak-Proof:** Nếu Database bị rò rỉ, Hacker (hoặc Admin) cũng không thể biết tác giả bài viết là ai vì không có ID người dùng để thực hiện lệnh `Join`.
*   **Chống Spam:** Vẫn giữ được sự chặt chẽ của hệ thống (mỗi người 1 bài) mà không cần định danh.
*   **Lòng tin ứng viên:** Tạo môi trường an toàn để chia sẻ sự thật về môi trường làm việc.

---

## 🚀 Tổng kết Kỹ thuật

| Tính năng | Kỹ thuật chủ chốt | Loại Salt | Lưu trữ |
| :--- | :--- | :--- | :--- |
| **Thống kê View** | SHA256 + PFADD | Thay đổi theo ngày | Redis (12KB) |
| **Review Công ty** | Double Hashing | Cố định (Permanent) | MongoDB (JSON) |

**Lưu ý quan trọng:** Để hệ thống an toàn, chuỗi `ANALYTICS_SECRET` và `REVIEW_SALT` trong file `.env` phải được bảo vệ tuyệt đối và không được thay đổi sau khi hệ thống đã đi vào vận hành chính thức.