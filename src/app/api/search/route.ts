import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { decisions, workspaces, workspaceMembers } from "@/lib/schema";
import { eq, and, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const workspaceSlug = searchParams.get("workspaceSlug");
  const query = searchParams.get("q");

  if (!workspaceSlug || !query) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const [workspace] = await db
    .select()
    .from(workspaces)
    .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(
      and(
        eq(workspaces.slug, workspaceSlug),
        eq(workspaceMembers.userId, session.user.id)
      )
    )
    .limit(1);

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const results = await db
    .select()
    .from(decisions)
    .where(
      and(
        eq(decisions.workspaceId, workspace.workspaces.id),
        or(
          ilike(decisions.title, `%${query}%`),
          ilike(decisions.problemStatement, `%${query}%`),
          ilike(decisions.context, `%${query}%`),
          ilike(decisions.hypothesis, `%${query}%`)
        )
      )
    )
    .limit(20);

  return NextResponse.json(results);
}
