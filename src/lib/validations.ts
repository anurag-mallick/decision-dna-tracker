import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const workspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
});

export const decisionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  problemStatement: z.string().optional(),
  context: z.string().optional(),
  optionsConsidered: z.array(z.object({
    option: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
  })).optional(),
  chosenOption: z.string().optional(),
  rejectionReasons: z.string().optional(),
  evidence: z.array(z.object({
    label: z.string(),
    url: z.string().url().optional().or(z.literal('')),
    text: z.string().optional(),
  })).optional(),
  hypothesis: z.string().optional(),
  confidenceLevel: z.enum(['high', 'medium', 'low']).optional(),
  status: z.enum(['active', 'reviewing', 'validated', 'invalidated', 'inconclusive']).default('active'),
  parentDecisionId: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).optional(),
  reviewDate: z.string().optional().nullable(),
});

export const outcomeSchema = z.object({
  actualResult: z.string().min(1, 'Actual result is required'),
  status: z.enum(['validated', 'invalidated', 'inconclusive', 'too_early']),
  notes: z.string().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});

export const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'contributor', 'viewer']).default('contributor'),
});
