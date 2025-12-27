import { createRoute } from '@hono/zod-openapi';
import * as auth from './auth.schema';
import * as cand from './candidate.schema';
import * as job from './job.schema';
import { z } from '@hono/zod-openapi';
import * as qa from './qa.schema';
import * as interview from './interview.schema'; // Đường dẫn file schema của bạn
import * as application from './application.schema';
import * as review from './review.schema';


const AdminReviewSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  message: z.string().optional() // Lý do từ chối nếu có
});
const TAG_AUTH = 'Authentication';

// --- Auth Routes Docs ---
export const registerRouteDoc = createRoute({
  method: 'post',
  path: '/register',
  tags: [TAG_AUTH],
  summary: 'Đăng ký tài khoản mới',
  request: { body: { content: { 'application/json': { schema: auth.RegisterRequestSchema } } } },
  responses: {
    200: { content: { 'application/json': { schema: auth.AuthResponseSchema } }, description: 'Đăng ký thành công' },
    400: { content: { 'application/json': { schema: auth.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
  },
});

export const loginRouteDoc = createRoute({
  method: 'post',
  path: '/login',
  tags: [TAG_AUTH],
  summary: 'Đăng nhập',
  request: { body: { content: { 'application/json': { schema: auth.LoginRequestSchema } } } },
  responses: {
    200: { content: { 'application/json': { schema: auth.AuthResponseSchema } }, description: 'Đăng nhập thành công' },
    401: { content: { 'application/json': { schema: auth.ErrorResponseSchema } }, description: 'Sai tài khoản/mật khẩu' },
  },
});

// src/schemas/api-doc.ts

export const forgotPasswordDoc = createRoute({
  method: 'post',
  path: '/forgot-password',
   tags: [TAG_AUTH],
  summary: 'Quên mật khẩu',
  request: { body: { content: { 'application/json': { schema: auth.ForgotPasswordRequestSchema } } } },
  responses: {
    200: { 
      content: { 'application/json': { schema: auth.AuthResponseSchema } }, 
      description: 'Đã gửi OTP' 
    },
    // PHẢI NẰM TRONG RESPONSES
    400: { 
      content: { 'application/json': { schema: auth.ErrorResponseSchema } }, 
      description: 'Lỗi yêu cầu hoặc email không tồn tại' 
    }
  },
});

export const resetPasswordDoc = createRoute({
  method: 'post',
  path: '/reset-password',
  tags: [TAG_AUTH],
  summary: 'Đặt lại mật khẩu với OTP',
  request: { body: { content: { 'application/json': { schema: auth.ResetPasswordRequestSchema } } } },
  responses: {
    200: { 
      content: { 'application/json': { schema: auth.AuthResponseSchema } }, 
      description: 'Đổi mật khẩu thành công' 
    },
    // PHẢI NẰM TRONG RESPONSES
    400: { 
      content: { 'application/json': { schema: auth.ErrorResponseSchema } }, 
      description: 'Mã OTP sai hoặc hết hạn' 
    }
  },
});
// --- Candidate Routes Docs ---
const TAG_CANDIDATE = 'Candidates';
export const candidateSearchDoc = createRoute({
  method: 'get',
  path: '/search',
  tags: [TAG_CANDIDATE],
  summary: 'Tìm kiếm ứng viên (Yêu cầu quyền Recruiter)',
  request: { query: cand.CandidateSearchQuerySchema },
  responses: {
    200: { content: { 'application/json': { schema: cand.CandidateSearchResponseSchema } }, description: 'Thành công' },
    500: { content: { 'application/json': { schema: auth.ErrorResponseSchema } }, description: 'Lỗi server' },
  },
});
const TAG_JOBS = 'Jobs';

export const createJobDoc = createRoute({
  method: 'post',
  path: '/create',
  tags: [TAG_JOBS],
  summary: 'Đăng tin tuyển dụng (Recruiter)',
  request: { 
    body: { content: { 'application/json': { schema: job.CreateJobSchema } } } 
  },
  responses: {
    201: { 
      content: { 'application/json': { schema: job.JobResponseSchema } }, 
      description: 'Thành công' 
    }, // <-- Kiểm tra dấu phẩy này
    400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi dữ liệu' 
    }, // <-- Kiểm tra dấu phẩy này
    401: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Chưa đăng nhập hoặc Token sai' 
    },
    403: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Không có quyền' 
    } // Dấu phẩy ở đây cũng được hoặc không (nếu là cuối cùng)
  }, // <-- Dòng 87 bạn bị thiếu dấu đóng ngoặc hoặc dấu phẩy ở đây
});
// --- Update Job Doc ---
// --- Update Job Doc ---
export const updateJobDoc = createRoute({
  method: 'put',
  path: '/update/{id}',
  tags: [TAG_JOBS],
  summary: 'Cập nhật bài đăng',
  request: { 
    params: job.JobIdParamSchema,
    body: { content: { 'application/json': { schema: job.UpdateJobSchema } } } 
  },
  responses: {
    200: { content: { 'application/json': { schema: job.JobResponseSchema } }, description: 'Cập nhật thành công' }, // Trả về data job
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không có quyền' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không tìm thấy' },
  },
});

// --- Delete Job Doc ---
export const deleteJobDoc = createRoute({
  method: 'delete',
  path: '/delete/{id}',
  tags: [TAG_JOBS],
  summary: 'Xóa bài đăng',
  request: { params: job.JobIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Xóa thành công' }, // Trả về tin nhắn
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không có quyền' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không tìm thấy' },
  },
});
export const deleteManyJobsDoc = createRoute({
  method: 'delete',
  path: '/bulk-delete',
  tags: [TAG_JOBS],
  summary: 'Xóa nhiều bài đăng cùng lúc',
  request: { 
    body: { content: { 'application/json': { schema: job.BulkDeleteJobSchema } } } 
  },
  responses: {
    200: { content: { 'application/json': { schema: job.BulkDeleteResponseSchema } }, description: 'Xóa thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không có quyền' },
  },
});
// --- Get My Jobs Doc ---
export const getMyJobsDoc = createRoute({
  method: 'get',
  path: '/my-jobs', // URL: /api/jobs/my-jobs
  tags: [TAG_JOBS],
  summary: 'Lấy danh sách bài đăng của tôi (Recruiter)',
  responses: {
    200: { 
      content: { 'application/json': { schema: job.GetMyJobsResponseSchema } }, 
      description: 'Thành công' 
    },
    401: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Chưa đăng nhập' 
    },
    400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi hệ thống' 
    },
  },
});
// Thêm vào file src/schemas/api-doc.ts
export const toggleSaveJobDoc = createRoute({
  method: 'post',
  path: '/{id}/save',
  tags: [TAG_JOBS],
  summary: 'Lưu hoặc Bỏ lưu công việc (Toggle)',
  request: { 
    params: job.JobIdParamSchema 
  },
  responses: {
    200: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Thành công' 
    },
    401: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Chưa đăng nhập' 
    },
    404: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Không tìm thấy Job' 
    },
  },
});
// 1. Gửi câu hỏi
// src/schemas/api-doc.ts

// 1. Hỏi
const TAG_QA = 'Q&A System';
export const askQuestionDoc = createRoute({
  method: 'post',
  path: '/ask',
  tags: [TAG_QA],
  summary: 'Ứng viên đặt câu hỏi',
  request: { body: { content: { 'application/json': { schema: qa.AskQuestionSchema } } } },
  responses: {
    201: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu/Spam' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không thấy bài đăng' }, // THÊM DÒNG NÀY
  },
});

// 2. Trả lời
export const answerQuestionDoc = createRoute({
  method: 'put',
  path: '/answer/{id}',
  tags: [TAG_QA],
  summary: 'Nhà tuyển dụng phản hồi',
  request: { 
    params: job.JobIdParamSchema, 
    body: { content: { 'application/json': { schema: qa.AnswerQuestionSchema } } } 
  },
  responses: {
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi hệ thống' }, // THÊM DÒNG NÀY
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' }, // THÊM DÒNG NÀY
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không có quyền' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không thấy câu hỏi' }, // THÊM DÒNG NÀY
  },
});

// 3. Lấy danh sách Q&A cho một bài Job
export const getJobQADoc = createRoute({
  method: 'get',
  path: '/jobs/{id}/qa',
  tags: [TAG_QA],
  summary: 'Lấy danh sách Q&A (Hỗ trợ ẩn/hiện theo quyền)',
  request: { params: job.JobIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: qa.QAListResponseSchema } }, description: 'Thành công' },
  },
});
// 1. Gửi yêu cầu TẠO
const TAG_COMPANY = 'Companies';
export const requestCreateCompanyDoc = createRoute({
  method: 'post',
  path: '/request-create',
  tags: [TAG_COMPANY],
  summary: 'Recruiter gửi yêu cầu thêm công ty',
  request: { body: { content: { 'application/json': { schema: job.CreateCompanySchema } } } },
  responses: { 
    201: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
  },
});

// 2. Gửi yêu cầu SỬA
// src/schemas/api-doc.ts

export const requestUpdateCompanyDoc = createRoute({
  method: 'put',
  path: '/request-update/{id}',
  tags: [TAG_COMPANY],
  summary: 'Recruiter gửi yêu cầu sửa đổi thông tin',
  request: { 
    params: job.JobIdParamSchema,
    body: { content: { 'application/json': { schema: job.CreateCompanySchema.partial() } } } 
  },
  responses: { 
    200: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Cập nhật thành công' 
    },
    // BẮT BUỘC: Thêm tất cả các mã status code xuất hiện trong code của bạn
    400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi dữ liệu' 
    },
    401: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Chưa đăng nhập' 
    },
    403: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Không có quyền sở hữu công ty này' 
    },
    404: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Không tìm thấy công ty' 
    },
  },
});

// 3. Gửi yêu cầu XÓA
export const requestDeleteCompanyDoc = createRoute({
  method: 'delete',
  path: '/request-delete/{id}',
  tags: [TAG_COMPANY],
  summary: 'Recruiter gửi yêu cầu xóa',
  request: { params: job.JobIdParamSchema },
  responses: { 
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi hệ thống' },
    401: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Chưa đăng nhập' },
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không có quyền' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không tìm thấy công ty' },

  },
});
const TAG_ADMIN = 'Admin - Companies Management';

// 4. Admin duyệt TẠO/XÓA
export const adminReviewStatusDoc = createRoute({
  method: 'patch',
  path: '/admin/review-status/{id}',
  tags: [TAG_ADMIN],
  summary: 'Admin duyệt Tạo/Xóa',
  request: { 
    params: job.JobIdParamSchema, 
    body: { content: { 'application/json': { schema: AdminReviewSchema } } } 
  },
  responses: { 
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không tìm thấy' },
  },
});

// 5. Admin duyệt SỬA
export const adminReviewUpdateDoc = createRoute({
  method: 'patch',
  path: '/admin/review-update/{id}',
  tags: [TAG_ADMIN],
  summary: 'Admin duyệt bản thảo sửa đổi',
  request: { 
    params: job.JobIdParamSchema, 
    body: { content: { 'application/json': { schema: AdminReviewSchema } } } 
  },
  responses: { 
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không tìm thấy' },
  },
});
const TAG_INTERVIEW = 'Interviews';
export const createInterviewDoc = createRoute({
  method: 'post',
  path: '/create',
  tags: [TAG_INTERVIEW],
  summary: 'Lên lịch phỏng vấn mới',
  request: { body: { content: { 'application/json': { schema: interview.CreateInterviewSchema } } } },
  responses: {
    201: { content: { 'application/json': { schema: interview.ErrorResponseSchema } }, description: 'Tạo thành công' },
    400: { content: { 'application/json': { schema: interview.ErrorResponseSchema } }, description: 'Lỗi dữ liệu' },
    403: { content: { 'application/json': { schema: interview.ErrorResponseSchema } }, description: 'Không có quyền' },
  },
});

// 2. Lấy danh sách phỏng vấn của Nhà tuyển dụng
export const getInterviewsDoc = createRoute({
  method: 'get',
  path: '/all',
  tags: [TAG_INTERVIEW],
  summary: 'Lấy danh sách phỏng vấn có lọc và phân trang',
  request: { query: interview.InterviewQuerySchema },
  responses: {
    200: { description: 'Thành công' },
    401: { description: 'Chưa đăng nhập' }
  },
});

// 3. Cập nhật kết quả/ghi chú phỏng vấn
export const updateInterviewDoc = createRoute({
  method: 'patch',
  path: '/{id}/status',
  tags: [TAG_INTERVIEW],
  summary: 'Cập nhật kết quả hoặc ghi chú buổi phỏng vấn',
  request: { 
    params: interview.InterviewIdParamSchema,
    body: { content: { 'application/json': { schema: interview.UpdateInterviewSchema } } } 
  },
  responses: {
    200: { description: 'Cập nhật thành công' },
    403: { description: 'Không có quyền' },
    404: { description: 'Không tìm thấy' },
  },
});
// 2. Xóa 1 bản ghi
export const deleteInterviewDoc = createRoute({
  method: 'delete',
  path: '/delete/{id}',
  tags: [TAG_INTERVIEW],
  summary: 'Xóa một buổi phỏng vấn',
  request: { params: interview.InterviewIdParamSchema },
  responses: {
    200: { description: 'Xóa thành công' },
    403: { description: 'Không có quyền' },
    404: { description: 'Không tìm thấy' }
  },
});

// 3. Xóa nhiều bản ghi
export const bulkDeleteInterviewsDoc = createRoute({
  method: 'post', // Dùng POST cho bulk delete để gửi body an toàn
  path: '/bulk-delete',
  tags: [TAG_INTERVIEW],
  summary: 'Xóa nhiều buổi phỏng vấn cùng lúc',
  request: { body: { content: { 'application/json': { schema: interview.BulkDeleteSchema } } } },
  responses: {
    200: { description: 'Xóa thành công' },
    400: { description: 'Lỗi dữ liệu' }
  },
});
const TAG_APP = 'Applications';

// 1. Ứng viên nộp đơn
export const applyJobDoc = createRoute({
  method: 'post',
  path: '/create',
  tags: [TAG_APP],
  summary: 'Ứng viên nộp đơn ứng tuyển',
  request: { body: { content: { 'application/json': { schema: application.CreateApplicationSchema } } } },
  responses: {
    201: { description: 'Nộp đơn thành công' },
    400: { description: 'Đã nộp đơn trước đó hoặc lỗi dữ liệu' },
  },
});

// 2. Lấy danh sách đơn (Recruiter lấy theo Job, Candidate lấy của chính mình)
// src/schemas/api-doc.ts

// src/schemas/api-doc.ts

export const getApplicationsDoc = createRoute({
  method: 'get',
  path: '/all',
  tags: [TAG_APP],
  summary: 'Lấy danh sách đơn ứng tuyển',
  request: { query: application.ApplicationQuerySchema },
  responses: {
    200: { 
      content: { 'application/json': { schema: z.object({ success: z.boolean(), data: z.array(application.ApplicationResponseSchema) }) } }, 
      description: 'Thành công' 
    },
    401: { content: { 'application/json': { schema: application.ErrorResponseSchema } }, description: 'Lỗi xác thực' },
    403: { content: { 'application/json': { schema: application.ErrorResponseSchema } }, description: 'Lỗi quyền hạn' },
    // THÊM DÒNG NÀY ĐỂ HẾT LỖI ĐỎ Ở FILE ROUTE
    404: { content: { 'application/json': { schema: application.ErrorResponseSchema } }, description: 'Không tìm thấy hồ sơ' },
    500: { content: { 'application/json': { schema: application.ErrorResponseSchema } }, description: 'Lỗi server' },
  },
});

// 3. Cập nhật trạng thái (Dành cho Recruiter)
export const updateAppStatusDoc = createRoute({
  method: 'patch',
  path: '/{id}/status',
  tags: [TAG_APP],
  summary: 'Nhà tuyển dụng cập nhật trạng thái đơn ứng tuyển',
  request: { 
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: application.UpdateApplicationStatusSchema } } } 
  },
  responses: {
    200: { description: 'Cập nhật thành công' },
    403: { description: 'Không có quyền' },
  },
});

// 4. Xóa/Hủy đơn (Dành cho Ứng viên)
export const cancelApplicationDoc = createRoute({
  method: 'delete',
  path: '/delete/{id}',
  tags: ['Applications'],
  summary: 'Hủy/Xóa đơn ứng tuyển',
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: 'Thành công' },
    403: { description: 'Không có quyền' },
    404: { description: 'Không tìm thấy' }
  },
});

// Xóa nhiều
export const bulkDeleteApplicationsDoc = createRoute({
  method: 'post', // Dùng POST để gửi mảng IDs trong Body
  path: '/bulk-delete',
  tags: ['Applications'],
  summary: 'Xóa nhiều đơn ứng tuyển cùng lúc',
  request: { 
    body: { 
      content: { 
        'application/json': { 
          schema: z.object({ ids: z.array(z.string()) }) 
        } 
      } 
    } 
  },
  responses: {
    200: { description: 'Thành công' },
    400: { description: 'Lỗi dữ liệu' }
  },
});
const TAG_REVIEWS = 'Company Reviews';

// 1. Lấy danh sách review
export const getCompanyReviewsDoc = createRoute({
  method: 'get',
  path: '/{companyId}/all',
  tags: [TAG_REVIEWS],
  summary: 'Lấy danh sách đánh giá của một công ty',
  request: { params: review.CompanyIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: z.array(review.ReviewResponseSchema) } }, description: 'Thành công' },
  },
});

// 2. Gửi review mới
export const postReviewDoc = createRoute({
  method: 'post',
  path: '/{companyId}/create',
  tags: [TAG_REVIEWS],
  summary: 'Ứng viên gửi đánh giá mới',
  request: { 
    params: review.CompanyIdParamSchema,
    body: { content: { 'application/json': { schema: review.CreateReviewSchema } } } 
  },
  responses: {
    201: { content: { 'application/json': { schema: review.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: review.ErrorResponseSchema } }, description: 'Đã review' },
    403: { content: { 'application/json': { schema: review.ErrorResponseSchema } }, description: 'Không có quyền (Chỉ Candidate)' }, // THÊM DÒNG NÀY
  },
});

// 2. Update Review Doc
export const updateReviewDoc = createRoute({
  method: 'put',
  path: '/{id}/update',
  tags: [TAG_REVIEWS],
  summary: 'Chỉnh sửa đánh giá của chính mình',
  request: { 
    params: review.ReviewIdParamSchema,
    body: { content: { 'application/json': { schema: review.CreateReviewSchema } } } 
  },
  responses: {
    200: { content: { 'application/json': { schema: review.ErrorResponseSchema } }, description: 'Thành công' },
    403: { content: { 'application/json': { schema: review.ErrorResponseSchema } }, description: 'Không có quyền' },
    404: { content: { 'application/json': { schema: review.ErrorResponseSchema } }, description: 'Không tìm thấy review' }, // THÊM DÒNG NÀY
  },
});

// 3. Delete Review Doc
export const deleteReviewDoc = createRoute({
  method: 'delete',
  path: '/{id}/delete',
  tags: [TAG_REVIEWS],
  summary: 'Xóa đánh giá (Chủ nhân hoặc Admin)',
  request: { params: review.ReviewIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: review.ErrorResponseSchema } }, description: 'Thành công' },
    403: { content: { 'application/json': { schema: review.ErrorResponseSchema } }, description: 'Không có quyền' }, // THÊM DÒNG NÀY
    404: { content: { 'application/json': { schema: review.ErrorResponseSchema } }, description: 'Không tìm thấy review' }, // THÊM DÒNG NÀY
  },
});
// 5. Lấy điểm trung bình
export const getCompanyRatingDoc = createRoute({
  method: 'get',
  path: '/{companyId}/rating',
  tags: [TAG_REVIEWS],
  summary: 'Tính toán điểm trung bình sao của công ty',
  request: { params: review.CompanyIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: review.RatingResponseSchema } }, description: 'Thành công' },
  },
});