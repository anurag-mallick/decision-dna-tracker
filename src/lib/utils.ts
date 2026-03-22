import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export async function getUserWorkspace(
  userId: string,
  slug: string
) {
  const { db } = await import('./db');
  const { workspaces, workspaceMembers } =
    await import('./schema');
  const { eq, and } = await import('drizzle-orm');

  const result = await db
    .select({
      workspace: workspaces,
      member: workspaceMembers,
    })
    .from(workspaces)
    .innerJoin(
      workspaceMembers,
      and(
        eq(workspaceMembers.workspaceId, workspaces.id),
        eq(workspaceMembers.userId, userId)
      )
    )
    .where(eq(workspaces.slug, slug))
    .limit(1);

  return result[0] ?? null;
}