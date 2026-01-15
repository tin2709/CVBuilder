import { createRoute } from '@hono/zod-openapi';
import * as auth from './auth.schema';
import * as cand from './candidate.schema';
import * as job from './job.schema';
import { z } from '@hono/zod-openapi';
import * as qa from './qa.schema';
import * as interview from './interview.schema'; // Đường dẫn file schema của bạn
import * as application from './application.schema';
import * as review from './review.schema';
import * as system from './system.schema';

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
// --- CANDIDATE PROFILE MAIN ---
export const updateCandidateProfileDoc = createRoute({
  method: 'put',
  path: '/me/update',
  tags: [TAG_CANDIDATE],
  summary: 'Cập nhật thông tin hồ sơ chính',
  request: { body: { content: { 'application/json': { schema: cand.UpdateCandidateProfileSchema } } } },
  responses: { 200: { description: 'Cập nhật thành công' } },
});
export const createCandidateProfileDoc = createRoute({
  method: 'post',
  path: '/me/create-profile',
  tags: [TAG_CANDIDATE],
  summary: 'Khởi tạo hồ sơ ứng viên (Lần đầu)',
  request: { body: { content: { 'application/json': { schema: cand.CreateCandidateProfileSchema } } } },
  responses: {
    201: { description: 'Tạo hồ sơ thành công' },
    400: { description: 'Hồ sơ đã tồn tại' },
    401: { description: 'Chưa đăng nhập' }
  },
});
// --- CV Versioning & Snapshot Docs ---

// 1. Công khai hồ sơ (DRAFT -> PUBLISHED)

export const publishCVDoc = createRoute({
  method: 'patch',
  path: '/me/publish',
  tags: [TAG_CANDIDATE],
  summary: 'Đặt hồ sơ hiện tại thành bản chính thức (Published)',
  responses: {
    200: { 
      content: { 'application/json': { schema: cand.CandidateProfileFullSchema } }, 
      description: 'Thành công' 
    },
    // BẮT BUỘC THÊM CÁC DÒNG NÀY:
    404: { 
      content: { 'application/json': { schema: auth.ErrorResponseSchema } }, 
      description: 'Không tìm thấy hồ sơ' 
    },
    400: { 
      content: { 'application/json': { schema: auth.ErrorResponseSchema } }, 
      description: 'Lỗi yêu cầu' 
    }
  },
});

// 2. Lấy lịch sử các bản CV

export const getCVHistoryDoc = createRoute({
  method: 'get',
  path: '/me/versions',
  tags: [TAG_CANDIDATE],
  summary: 'Xem lịch sử các phiên bản CV đã lưu',
  responses: {
    200: { 
      content: { 
        'application/json': { 
          schema: z.object({ 
            success: z.boolean(), 
            data: z.array(cand.CandidateProfileFullSchema) 
          }) 
        } 
      }, 
      description: 'Thành công' 
    },
    401: { 
      content: { 'application/json': { schema: auth.ErrorResponseSchema } }, 
      description: 'Chưa đăng nhập' 
    },
    400: { 
      content: { 'application/json': { schema: auth.ErrorResponseSchema } }, 
      description: 'Lỗi yêu cầu' 
    }
  },
});

// Xóa toàn bộ Profile (Bao gồm cả Exp, Edu, Project)
export const deleteCandidateProfileDoc = createRoute({
  method: 'delete',
  path: '/me/delete-profile',
  tags: [TAG_CANDIDATE],
  summary: 'Xóa vĩnh viễn hồ sơ ứng viên và dữ liệu liên quan',
  responses: {
    200: { description: 'Xóa thành công' },
    401: { description: 'Chưa đăng nhập' },
    404: { description: 'Không tìm thấy hồ sơ' }
  },
});
export const getMyProfileDoc = createRoute({
  method: 'get',
  path: '/me',
  tags: [TAG_CANDIDATE],
  summary: 'Lấy chi tiết hồ sơ của tôi (Dùng để hiển thị trang Profile)',
  responses: {
    200: { 
      content: { 
        'application/json': { 
          schema: cand.CandidateProfileFullSchema // Schema này nên chứa cả include: Exp, Edu, Project
        } 
      }, 
      description: 'Thành công' 
    },
    401: { description: 'Chưa đăng nhập' },
    404: { description: 'Người dùng chưa khởi tạo hồ sơ' }
  },
});
// --- WORK EXPERIENCE DOCS ---
export const addWorkExperienceDoc = createRoute({
  method: 'post',
  path: '/experience/create',
  tags: [TAG_CANDIDATE],
  summary: 'Thêm kinh nghiệm làm việc',
  request: { body: { content: { 'application/json': { schema: cand.WorkExperienceSchema } } } },
  responses: {
    201: { description: 'Thêm thành công' },
    401: { description: 'Chưa đăng nhập' }
  },
});
export const updateWorkExperienceDoc = createRoute({
  method: 'put',
  path: '/experience/{id}',
  tags: [TAG_CANDIDATE],
  summary: 'Sửa kinh nghiệm làm việc',
  request: { 
    params: cand.SubRecordIdParamSchema,
    body: { content: { 'application/json': { schema: cand.UpdateWorkExperienceSchema } } } 
  },
  responses: { 200: { description: 'Cập nhật thành công' } },
});
export const deleteWorkExperienceDoc = createRoute({
  method: 'delete',
  path: '/experience/{id}',
  tags: [TAG_CANDIDATE],
  summary: 'Xóa kinh nghiệm làm việc',
  request: { params: cand.SubRecordIdParamSchema },
  responses: {
    200: { description: 'Xóa thành công' },
    404: { description: 'Không tìm thấy' }
  },
});

// --- PERSONAL PROJECT DOCS ---
export const addProjectDoc = createRoute({
  method: 'post',
  path: '/project/create',
  tags: [TAG_CANDIDATE],
  summary: 'Thêm dự án cá nhân',
  request: { body: { content: { 'application/json': { schema: cand.PersonalProjectSchema } } } },
  responses: {
    201: { description: 'Thêm thành công' }
  },
});
export const updateProjectDoc = createRoute({
  method: 'put',
  path: '/project/{id}',
  tags: [TAG_CANDIDATE],
  summary: 'Sửa dự án cá nhân',
  request: { 
    params: cand.SubRecordIdParamSchema,
    body: { content: { 'application/json': { schema: cand.UpdatePersonalProjectSchema } } } 
  },
  responses: { 200: { description: 'Cập nhật thành công' } },
});

export const deleteProjectDoc = createRoute({
  method: 'delete',
  path: '/project/{id}',
  tags: [TAG_CANDIDATE],
  summary: 'Xóa dự án',
  request: { params: cand.SubRecordIdParamSchema },
  responses: {
    200: { description: 'Xóa thành công' }
  },
});

// --- EDUCATION DOCS ---
export const addEducationDoc = createRoute({
  method: 'post',
  path: '/education/create',
  tags: [TAG_CANDIDATE],
  summary: 'Thêm học vấn',
  request: { body: { content: { 'application/json': { schema: cand.EducationRecordSchema } } } },
  responses: {
    201: { description: 'Thêm thành công' }
  },
});
export const updateEducationDoc = createRoute({
  method: 'put',
  path: '/education/{id}',
  tags: [TAG_CANDIDATE],
  summary: 'Sửa học vấn',
  request: { 
    params: cand.SubRecordIdParamSchema,
    body: { content: { 'application/json': { schema: cand.UpdateEducationRecordSchema } } } 
  },
  responses: { 200: { description: 'Cập nhật thành công' } },
});
export const deleteEducationDoc = createRoute({
  method: 'delete',
  path: '/education/{id}',
  tags: [TAG_CANDIDATE],
  summary: 'Xóa học vấn',
  request: { params: cand.SubRecordIdParamSchema },
  responses: { 200: { description: 'Xóa thành công' } },
});
export const updateSharingSettingsDoc = createRoute({
  method: 'patch',
  path: '/me/sharing',
  tags: [TAG_CANDIDATE],
  summary: 'Cập nhật chế độ chia sẻ hồ sơ (Public/Private)',
  request: { body: { content: { 'application/json': { schema: cand.UpdateSharingSchema } } } },
  responses: {
    200: { content: { 'application/json': { schema: cand.CollaborationResponseSchema } }, description: 'Thành công' },
    401: { description: 'Chưa đăng nhập' }
  },
});

export const addCollaboratorDoc = createRoute({
  method: 'post',
  path: '/me/collaborators',
  tags: [TAG_CANDIDATE],
  summary: 'Mời người khác cộng tác sửa/xem qua email',
  request: { body: { content: { 'application/json': { schema: cand.AddCollaboratorSchema } } } },
  responses: {
    200: { description: 'Đã thêm cộng tác viên' },
    404: { description: 'Không tìm thấy người dùng với email này' }
  },
});

export const checkProfileAccessDoc = createRoute({
  method: 'get',
  path: '/profile/{id}/access',
  tags: [TAG_CANDIDATE],
  summary: 'Kiểm tra quyền truy cập của user hiện tại vào một profile',
  request: { 
    params: z.object({ id: z.string() }),
    query: z.object({ token: z.string().optional() }) 
  },
  responses: {
    200: { content: { 'application/json': { schema: cand.AccessCheckResponseSchema } }, description: 'Quyền hạn' },
    404: { description: 'Không thấy hồ sơ' }
  },
});
export const getSharedProfilesDoc = createRoute({
  method: 'get',
  path: '/shared-with-me',
  tags: ['Candidates'],
  summary: 'Lấy danh sách các hồ sơ mà tôi được mời cộng tác',
  responses: {
    200: { description: 'Thành công' }
  }
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

export const importJobFromLinkDoc = createRoute({
  method: 'post',
  path: '/import-link',
  tags: ['Job - Management'],
  summary: 'Trích xuất thông tin Job từ URL (Readability)',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            url: z.string().url().openapi({ example: 'https://topdev.vn/viec-lam/hris-technical-specialist-ngan-hang-tmcp-cong-thuong-viet-nam-vietinbank-2085312?src=home&medium=superhotjobs' })
          })
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: z.object({
              title: z.string(),
              description: z.string(),
              requirements: z.string(),
              location: z.string().nullable(),
              companyName: z.string().nullable(),
            })
          })
        }
      },
      description: 'Trích xuất thành công'
    },
    400: { description: 'Lỗi trích xuất' }
  }
});
// 1. Gửi tin để chờ duyệt (DRAFT -> PENDING_REVIEW)
export const submitJobForReviewDoc = createRoute({
  method: 'patch',
  path: '/{id}/submit',
  tags: [TAG_JOBS],
  summary: 'Gửi bài đăng để chờ phê duyệt',
  request: { params: job.JobIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    403: { description: 'Không có quyền' }
  },
});
// 2. Admin/Manager phê duyệt tin (PENDING_REVIEW -> PUBLISHED)
// Logic sẽ tự động set isLive = true và ARCHIVE bản cũ
export const approveJobDoc = createRoute({
  method: 'patch',
  path: '/{id}/approve',
  tags: ['Admin - Jobs Management'],
  summary: 'Phê duyệt và Xuất bản bài đăng (Admin)',
  request: { params: job.JobIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: job.JobResponseSchema } }, description: 'Đã xuất bản' },
    403: { description: 'Chỉ Admin mới có quyền' }
  },
});
// 3. Tạo một phiên bản nháp mới từ bài đang chạy (Dành cho việc chỉnh sửa version)
// src/schemas/api-doc.ts

export const createNewJobVersionDoc = createRoute({
  method: 'post',
  path: '/{documentId}/new-version',
  tags: [TAG_JOBS],
  summary: 'Tạo một bản nháp mới từ phiên bản hiện tại (có thể kèm dữ liệu chỉnh sửa)',
  request: { 
    params: z.object({ documentId: z.string() }),
    body: { content: { 'application/json': { schema: job.UpdateJobSchema.partial() } } } // Cho phép gửi thông tin muốn sửa
  },
  responses: {
    201: { content: { 'application/json': { schema: job.JobResponseSchema } }, description: 'Bản nháp mới đã được tạo' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không tìm thấy' },
    400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi dữ liệu' 
    }
  },
});
// 4. Lấy lịch sử các phiên bản của 1 bài đăng
export const getJobHistoryDoc = createRoute({
  method: 'get',
  path: '/document/{documentId}/versions',
  tags: [TAG_JOBS],
  summary: 'Xem lịch sử các phiên bản của bài đăng',
  request: { params: z.object({ documentId: z.string() }) },
  responses: {
    200: { 
      content: { 'application/json': { schema: z.object({ success: z.boolean(), data: z.array(job.JobResponseSchema) }) } }, 
      description: 'Thành công' 
    },
    400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi dữ liệu' 
    }
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
export const getJobsDoc = createRoute({
  method: 'get',
  path: '/all', // Hoặc /search-jobs
  tags: [TAG_JOBS],
  summary: 'Ứng viên tìm kiếm và lấy danh sách bài đăng tuyển dụng',
  request: { 
    query: job.JobSearchQuerySchema // Schema này nên chứa: search, categoryId, location, salaryRange, page, limit
  },
  responses: {
    200: { 
      content: { 'application/json': { schema: job.JobListResponseSchema } }, 
      description: 'Thành công' 
    },
    400: { description: 'Lỗi tham số truy vấn' }
  },
});
export const getJobByIdDoc = createRoute({
  method: 'get',
  path: '/{id}',
  tags: [TAG_JOBS],
  summary: 'Lấy chi tiết một công việc theo ID',
  request: { params: job.JobIdParamSchema },
  responses: {
    200: { 
      content: { 'application/json': { schema: job.JobDetailResponseSchema } }, 
      description: 'Thành công' 
    },
    404: { description: 'Không tìm thấy công việc' }
  },
});
export const getSavedJobsDoc = createRoute({
  method: 'get',
  path: '/me/saved',
  tags: [TAG_JOBS],
  summary: 'Lấy danh sách các công việc mà ứng viên đã lưu',
  responses: {
    200: { 
      content: { 'application/json': { schema: job.JobListResponseSchema } }, 
      description: 'Thành công' 
    },
    401: { description: 'Chưa đăng nhập' }
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
// api-doc.ts

export const getJobQADoc = createRoute({
  method: 'get',
  path: '/jobs/:id',
  tags: ['Q&A System'],
  summary: 'Lấy danh sách Q&A (Hỗ trợ ẩn/hiện theo quyền)',
  request: { 
    params: job.JobIdParamSchema 
  },
  responses: {
    200: { 
      content: { 'application/json': { schema: qa.QAListResponseSchema } }, 
      description: 'Thành công' 
    },
    // THÊM DÒNG NÀY:
    400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi yêu cầu' 
    },
    404: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Không tìm thấy Job' 
    }
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
    404: { 
      content: { 'application/json': { schema: interview.ErrorResponseSchema } }, 
      description: 'Không tìm thấy đơn ứng tuyển' 
    },
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

export const getApplicationDetailDoc = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Applications'],
  summary: 'Xem chi tiết đơn ứng tuyển (Dành cho Recruiter)',
  request: { 
    params: z.object({ id: z.string().openapi({ example: '674d35629...' }) }) 
  },
  responses: {
    200: { 
      content: { 
        'application/json': { 
          schema: z.object({
            success: z.boolean(),
            data: z.object({
              id: z.string(),
              jobTitle: z.string(),
              status: z.string(),
              aiMatchScore: z.number().nullable(),
              aiAnalysis: z.string().nullable(),
              appliedAt: z.string(),
              // Đây là dữ liệu CV "đóng băng"
              cvSnapshot: z.any(), 
              // Thông tin ứng viên hiện tại (để lấy avatar/contact mới nhất nếu cần)
              candidateInfo: z.any()
            })
          }) 
        } 
      }, 
      description: 'Thành công' 
    },
    403: { description: 'Không có quyền truy cập đơn này' },
    404: { description: 'Không tìm thấy đơn ứng tuyển' }
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
// 3. Xem bản Snapshot CV của một đơn ứng tuyển cụ thể
// Dùng cho cả Nhà tuyển dụng (xem hồ sơ nộp) và Ứng viên (xem lại mình đã nộp gì)
export const getApplicationCVSnapshotDoc = createRoute({
  method: 'get',
  path: '/{id}/cv-snapshot',
  tags: [TAG_APP],
  summary: 'Lấy dữ liệu CV tại thời điểm ứng tuyển (Snapshot)',
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { 
      content: { 'application/json': { schema: z.object({ success: z.boolean(), data: z.any() }) } }, 
      description: 'Dữ liệu CV Snapshot' 
    },
    404: { description: 'Không tìm thấy đơn hoặc snapshot' }
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
export const getCategoriesDoc = createRoute({
  method: 'get',
  path: '/all',
  tags: ['System - Categories'],
  summary: 'Lấy danh sách tất cả danh mục công việc',
  responses: {
    200: { content: { 'application/json': { schema: z.array(system.CategorySchema) } }, description: 'Thành công' },
   400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi' 
    },
  },
});

export const createCategoryDoc = createRoute({
  method: 'post',
  path: '/create',
  tags: ['System - Categories'],
  summary: 'Admin tạo danh mục mới',
  request: { body: { content: { 'application/json': { schema: system.CreateCategorySchema } } } },
  responses: {
    201: { content: { 'application/json': { schema: system.CategorySchema } }, description: 'Tạo thành công' },
    403: { description: 'Không có quyền Admin' }
  },
});
export const updateCategoryDoc = createRoute({
  method: 'put',
  path: '/{id}/update',
  tags: ['System - Categories'],
  summary: 'Admin cập nhật danh mục',
  request: { 
    params: system.CategoryIdParamSchema,
    body: { content: { 'application/json': { schema: system.UpdateCategorySchema } } } 
  },
  responses: {
    200: { content: { 'application/json': { schema: system.CategorySchema } }, description: 'Cập nhật thành công' },
    404: { description: 'Không tìm thấy danh mục' },
    403: { description: 'Không có quyền Admin' }
  },
});

// --- Delete Single Category ---
export const deleteCategoryDoc = createRoute({
  method: 'delete',
  path: '/{id}/delete',
  tags: ['System - Categories'],
  summary: 'Admin xóa một danh mục',
  request: { params: system.CategoryIdParamSchema },
  responses: {
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Xóa thành công' },
    404: { description: 'Không tìm thấy' }
  },
});

// --- Delete Many Categories ---
export const bulkDeleteCategoriesDoc = createRoute({
  method: 'delete',
  path: '/bulk-delete',
  tags: ['System - Categories'],
  summary: 'Admin xóa nhiều danh mục',
  request: { body: { content: { 'application/json': { schema: system.BulkDeleteCategorySchema } } } },
  responses: {
    200: { content: { 'application/json': { schema: job.BulkDeleteResponseSchema } }, description: 'Xóa thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi' },
  },
});

// --- Notification Docs ---
export const getMyNotificationsDoc = createRoute({
  method: 'get',
  path: '/all',
  tags: ['User - Notifications'],
  summary: 'Lấy thông báo của tôi',
  responses: {
    200: { content: { 'application/json': { schema: z.array(system.NotificationSchema) } }, description: 'Thành công' },
      400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi' 
    },
  },
});
// src/schemas/api-doc.ts

export const createNotificationDoc = createRoute({
  method: 'post',
  path: '/create',
  tags: ['User - Notifications'],
  summary: 'Tạo thông báo mới',
  request: { 
    body: { content: { 'application/json': { schema: system.CreateNotificationSchema } } } 
  },
  responses: {
    201: { 
      content: { 'application/json': { schema: system.NotificationSchema } }, 
      description: 'Tạo mới thành công' 
    },
    200: { 
      content: { 'application/json': { schema: system.NotificationSchema } }, 
      description: 'Gom thông báo hoặc đã tồn tại' 
    },
    400: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Lỗi dữ liệu' 
    },
    409: { 
      content: { 'application/json': { schema: job.ErrorResponseSchema } }, 
      description: 'Xung đột dữ liệu/Đang xử lý' 
    },
  },
});
export const markAsReadDoc = createRoute({
  method: 'patch',
  path: '/{id}/read',
  tags: ['User - Notifications'],
  summary: 'Đánh dấu thông báo là đã đọc',
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Thành công' },
    400: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Lỗi' },
    403: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không quyền' },
    404: { content: { 'application/json': { schema: job.ErrorResponseSchema } }, description: 'Không thấy' },
  },
});