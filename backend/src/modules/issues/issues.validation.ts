import { z } from 'zod';
import {
  ISSUE_CATEGORIES,
  ISSUE_IMPACTS,
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
} from './issues.types';

export const createIssueSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(120),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.enum(ISSUE_CATEGORIES),
  impact: z.enum(ISSUE_IMPACTS).default('individual'),
  location: z.string().trim().min(2, 'Location is required').max(120),
  reporterName: z
    .string()
    .trim()
    .max(60)
    .optional()
    .transform((v) => v || undefined),
});

export const listIssuesQuery = z.object({
  status: z.enum(ISSUE_STATUSES).optional(),
  category: z.enum(ISSUE_CATEGORIES).optional(),
  priority: z.enum(ISSUE_PRIORITIES).optional(),
  q: z.string().trim().max(100).optional(),
  sort: z.enum(['severity', 'newest', 'upvotes', 'due']).default('severity'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const updateStatusSchema = z.object({
  status: z.enum(ISSUE_STATUSES),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type ListIssuesQuery = z.infer<typeof listIssuesQuery>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
