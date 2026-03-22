import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { decisions, workspaces, workspaceMembers } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const workspaceSlug = searchParams.get("workspaceSlug");

  if (!workspaceSlug) {
    return NextResponse.json({ error: "Workspace slug required" }, { status: 400 });
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

  const allDecisions = await db
    .select({
      id: decisions.id,
      title: decisions.title,
      status: decisions.status,
      parentId: decisions.parentDecisionId,
    })
    .from(decisions)
    .where(eq(decisions.workspaceId, workspace.workspaces.id));

  // Format data for D3
  const nodes = allDecisions.map(d => ({
    id: d.id,
    title: d.title,
    status: d.status,
  }));

  const links = allDecisions
    .filter(d => d.parentId)
    .map(d => ({
      source: d.parentId,
      target: d.id,
    }));

  return NextResponse.json({ nodes, links });
}
