# 🤖 AI Recruitment & CV Builder Platform

Nền tảng web hỗ trợ tuyển dụng thông minh bằng AI và chỉnh sửa CV chuyên nghiệp, phục vụ **Ứng viên**, **Nhà tuyển dụng** và **Quản trị viên (Admin)**.

---

## 🔐 Xác thực & Tài khoản

### 1 Đăng nhập / Đăng ký
**Route:**
app/(auth)/

**Mô tả:**  
Giao diện đăng nhập và đăng ký cho cả ứng viên và nhà tuyển dụng, với các trường thông tin cơ bản và tùy chọn khôi phục mật khẩu.

---

### 2 Quên mật khẩu
**Route:**
app/(auth)/forgotpass

**Mô tả:**  
Màn hình cho phép người dùng yêu cầu đặt lại mật khẩu bằng email hoặc tên người dùng.

---

## 👤 Ứng viên (Candidate)

### 3 Trang chủ Ứng viên
**Route:**
app/candidate/dashboard

**Mô tả:**  
Bảng điều khiển cá nhân hóa cho ứng viên:
- Đề xuất việc làm từ AI  
- Trạng thái ứng tuyển  
- Liên kết nhanh đến hồ sơ và CV  

---

### 4 Quản lý Hồ sơ Ứng viên
**Route:**
app/candidate/profile

**Mô tả:**  
Màn hình chi tiết để ứng viên tạo và chỉnh sửa hồ sơ:
- Tải CV  
- Kinh nghiệm làm việc  
- Học vấn  
- Kỹ năng  

---

### 5 Tìm kiếm công việc thông minh với AI
**Route:**
app/candidate/jobs

**Mô tả:**  
Giao diện tìm kiếm nâng cao tích hợp AI, hiển thị các công việc phù hợp nhất với hồ sơ ứng viên.

---

### 6 Lưu trữ công việc yêu thích
**Route:**
app/candidate/saved-jobs

**Mô tả:**  
Màn hình cho ứng viên quản lý danh sách các công việc đã lưu để dễ dàng xem lại và ứng tuyển.

---

### 7 Review công ty
**Route:**
app/candidate/company-reviews

**Mô tả:**  
Cho phép ứng viên xem và viết đánh giá về công ty, cung cấp cái nhìn đa chiều về môi trường làm việc.

---

### 8 Tạo và Quản lý CV
**Route:**
app/candidate/cv

**Mô tả:**  
Màn hình cho phép ứng viên tạo và quản lý nhiều phiên bản CV chuyên nghiệp:
- Thông tin cá nhân  
- Kinh nghiệm làm việc  
- Học vấn  
- Kỹ năng  
- Dự án và thành tích  
- Xem trước và tải CV  

---

### 9 Thư viện Mẫu CV
**Route:**
app/candidate/cv/templates

**Mô tả:**  
Hiển thị bộ sưu tập các mẫu CV chuyên nghiệp để ứng viên lựa chọn và chỉnh sửa.

---

### 10 Cài đặt Ứng viên
**Route:**
app/candidate/settings

**Mô tả:**  
Trang cài đặt cá nhân hóa cho ứng viên:
- Chỉnh sửa thông tin cá nhân  
- Quản lý thông báo  
- Quyền riêng tư  

---

## 🏢 Nhà tuyển dụng (Recruiter)

### 11 Trang chủ Nhà tuyển dụng
**Route:**
app/recruiter/dashboard

**Mô tả:**  
Bảng điều khiển tổng quan cho nhà tuyển dụng:
- Tin tuyển dụng đang hoạt động  
- Gợi ý ứng viên từ AI  
- Số liệu tuyển dụng  

---

### 12 Đăng tin Tuyển dụng
**Route:**
app/recruiter/jobs/create

**Mô tả:**  
Giao diện trực quan cho nhà tuyển dụng đăng tải các vị trí tuyển dụng mới với đầy đủ thông tin chi tiết.

---

### 13 Danh sách Ứng viên được đề xuất
**Route:**
app/recruiter/candidates/recommended

**Mô tả:**  
Hiển thị các ứng viên tiềm năng được AI gợi ý, kèm theo điểm phù hợp và tùy chọn lọc.

---

### 14 Chi tiết Ứng viên
**Route:**
app/recruiter/candidates/[id]

**Mô tả:**  
Trang xem hồ sơ chi tiết của ứng viên, bao gồm phân tích AI về mức độ phù hợp và các tùy chọn tương tác.

---

### 15 Quản lý Phỏng vấn
**Route:**
app/recruiter/interviews

**Mô tả:**  
Công cụ giúp nhà tuyển dụng lên lịch, theo dõi và ghi lại kết quả các cuộc phỏng vấn.

---

### 16 AI Screening CV tự động
**Route:**
app/recruiter/ai-screening

**Mô tả:**  
Giao diện hiển thị kết quả sàng lọc CV tự động của AI, bao gồm tiêu chí đánh giá và lý do đề xuất hoặc từ chối.

---

### 17 Quản lý thông tin công ty
**Route:**
app/recruiter/company

**Mô tả:**  
Màn hình cho phép nhà tuyển dụng chỉnh sửa và cập nhật thông tin chi tiết về công ty:
- Giới thiệu  
- Văn hóa  
- Chính sách  

---

### 18 Cài đặt Nhà tuyển dụng
**Route:**
app/recruiter/settings

**Mô tả:**  
Trang cài đặt cho nhà tuyển dụng:
- Quản lý thông báo  
- Gói dịch vụ  
- Tùy chỉnh quy trình tuyển dụng  

---

## 🛠️ Quản trị viên (Admin)

### 19 Quản lý người dùng và công ty
**Route:**
app/admin/user

**Mô tả:**  
Giao diện quản trị để quản lý tài khoản người dùng và thông tin các công ty trên hệ thống.

---

### 20 Quản lý danh mục công việc
**Route:**
app/admin/job-categories

**Mô tả:**  
Màn hình cho Admin thêm, chỉnh sửa hoặc xóa các danh mục công việc và ngành nghề.

---

### 21 Phân tích dữ liệu tổng quan
**Route:**
app/admin/analytics

**Mô tả:**  
Bảng điều khiển tổng hợp hiển thị các số liệu thống kê và phân tích về hoạt động của hệ thống và hiệu quả tuyển dụng.

---

## 🚀 Tổng kết
Hệ thống cung cấp:
- Tuyển dụng thông minh bằng AI  
- Công cụ tạo & chỉnh sửa CV chuyên nghiệp  
- Trải nghiệm riêng biệt cho từng vai trò người dùng  

---


