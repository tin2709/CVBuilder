// src/schemas/review.schema.ts
import { z } from '@hono/zod-openapi';

export const ReviewIdParamSchema = z.object({
  id: z.string().openapi({ example: '656e...' }),
});

export const CompanyIdParamSchema = z.object({
  companyId: z.string().openapi({ example: '656e...' }),
});

export const CreateReviewSchema = z.object({
  content: z.string().min(10).max(1000).openapi({ example: 'Môi trường làm việc rất tốt, đồng nghiệp thân thiện.' }),
  rating: z.number().min(1).max(5).openapi({ example: 5 }),
}).openapi('CreateReviewRequest');

export const ReviewResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  rating: z.number(),
  createdAt: z.date(),
  user: z.object({
    name: z.string().nullable(),
  }),
}).openapi('ReviewResponse');

export const RatingResponseSchema = z.object({
  averageRating: z.number(),
  totalReviews: z.number(),
}).openapi('RatingResponse');

export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
}).openapi('ErrorResponse');