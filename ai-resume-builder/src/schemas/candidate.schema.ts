import { z } from '@hono/zod-openapi';

// ==========================================
// 1. SEARCH SCHEMAS
// ==========================================

export const CandidateSearchQuerySchema = z.object({
  q: z.string().optional().openapi({ 
    param: { name: 'q', in: 'query' },
    example: 'ReactJS',
    description: 'Từ khóa tìm kiếm ứng viên hoặc kỹ năng'
  }),
});

export const CandidateSearchResponseSchema = z.object({
  success: z.boolean(),
  total: z.number(),
  results: z.array(z.any()),
}).openapi('CandidateSearchResponse');

// ==========================================
// 2. SUB-MODELS SCHEMAS (Core Data)
// ==========================================

// --- Work Experience ---
export const WorkExperienceSchema = z.object({
  companyName: z.string().min(1, "Tên công ty không được để trống"),
  role: z.string().min(1, "Chức danh không được để trống"),
  startDate: z.string().openapi({ example: '2023-01-01', description: 'Ngày bắt đầu (ISO String)' }),
  endDate: z.string().optional().nullable().openapi({ example: '2024-01-01' }),
  description: z.string().optional(),
  responsibilities: z.array(z.string()).default([]),
}).openapi('WorkExperience');

// --- Personal Project ---
export const PersonalProjectSchema = z.object({
  projectName: z.string().min(1, "Tên dự án không được để trống"),
  description: z.string().optional(),
  techStack: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  githubLink: z.string().url().optional().nullable().openapi({ example: 'https://github.com/...' }),
  liveLink: z.string().url().optional().nullable().openapi({ example: 'https://demo.com' }),
}).openapi('PersonalProject');

// --- Education ---
export const EducationRecordSchema = z.object({
  schoolName: z.string().min(1, "Tên trường không được để trống"),
  major: z.string().min(1, "Ngành học không được để trống"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
}).openapi('EducationRecord');

// ==========================================
// 3. MAIN PROFILE SCHEMAS
// ==========================================

// --- Create Profile (Dùng khi khởi tạo) ---
export const CreateCandidateProfileSchema = z.object({
  headline: z.string().min(3, "Headline ít nhất 3 ký tự"),
  summary: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  skills: z.array(z.string()).default([]),
  softSkills: z.array(z.string()).default([]),
}).openapi('CreateCandidateProfile');

// --- Update Profile (Dùng khi sửa thông tin chính) ---
export const UpdateCandidateProfileSchema = CreateCandidateProfileSchema.partial()
  .extend({
    githubUrl: z.string().url().optional().nullable(),
    linkedinUrl: z.string().url().optional().nullable(),
  })
  .openapi('UpdateCandidateProfile');

// ==========================================
// 4. UPDATE SUB-MODELS (Partial Updates)
// ==========================================

export const UpdateWorkExperienceSchema = WorkExperienceSchema.partial().openapi('UpdateWorkExperience');
export const UpdatePersonalProjectSchema = PersonalProjectSchema.partial().openapi('UpdatePersonalProject');
export const UpdateEducationRecordSchema = EducationRecordSchema.partial().openapi('UpdateEducationRecord');

// ==========================================
// 5. UTILITY & PARAMS
// ==========================================

// Dùng cho các route: /experience/{id}, /project/{id}, /education/{id}
export const SubRecordIdParamSchema = z.object({
  id: z.string().openapi({ 
    param: { name: 'id', in: 'path' }, 
    example: '65f1234567890abcdef12345',
    description: 'ID của bản ghi con (MongoDB ObjectId)'
  })
});

// Schema phản hồi chung cho Profile
export const CandidateProfileResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional()
}).openapi('CandidateProfileResponse');

// src/schemas/candidate.schema.ts (Thêm vào file này)

export const SharingModeEnum = z.enum(['PRIVATE', 'PUBLIC_VIEW', 'PUBLIC_EDIT']);
export const CollaboratorRoleEnum = z.enum(['VIEWER', 'EDITOR']);

export const UpdateSharingSchema = z.object({
  mode: SharingModeEnum
}).openapi('UpdateSharing');

export const AddCollaboratorSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  role: CollaboratorRoleEnum
}).openapi('AddCollaborator');

export const CollaborationResponseSchema = z.object({
  success: z.boolean(),
  sharingMode: SharingModeEnum.optional(),
  shareLink: z.string().nullable().optional(),
  collaborators: z.array(z.object({
    id: z.string(),
    user: z.object({
      name: z.string().nullable(),
      email: z.string()
    }),
    role: CollaboratorRoleEnum
  })).optional()
}).openapi('CollaborationResponse');

export const AccessCheckResponseSchema = z.object({
  canView: z.boolean(),
  canEdit: z.boolean(),
  mode: SharingModeEnum
}).openapi('AccessCheckResponse');