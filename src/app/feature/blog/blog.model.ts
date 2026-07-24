import { z } from 'zod';

export const BlogSchema = z.object({
  id: z.number(),
  title: z.string(),
  contentPreview: z.string(),
  author: z.string(),
  likes: z.number(),
  comments: z.number(),
  likedByMe: z.boolean(),
  createdByMe: z.boolean(),
  headerImageUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Blog = z.infer<typeof BlogSchema>;

export const BlogResponseSchema = z.object({
  data: z.array(BlogSchema),
  totalCount: z.number(),
  pageIndex: z.number(),
  pageSize: z.number(),
  maxPageSize: z.number(),
});
export type BlogResponse = z.infer<typeof BlogResponseSchema>;
