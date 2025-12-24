import { z } from '@hono/zod-openapi';

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