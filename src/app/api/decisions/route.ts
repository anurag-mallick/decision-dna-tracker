import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { decisions, workspaces, workspaceMembers } from "@/lib/schema";
import { decisionSchema } from "@/lib/validations";
import { eq, and, desc } from "drizzle-orm";
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
    .select()
    .from(decisions)
    .where(
      and(
        eq(decisions.workspaceId, workspace.workspaces.id),
        eq(decisions.isGraveyard, false)
      )
    )
    .orderBy(desc(decisions.createdAt));

  return NextResponse.json(allDecisions);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { workspaceSlug, ...decisionData } = body;
    const validated = decisionSchema.parse(decisionData);

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

    const [newDecision] = await db
      .insert(decisions)
      .values({
        ...validated,
        workspaceId: workspace.workspaces.id,
        ownerId: session.user.id as string,
        reviewDate: validated.reviewDate ? new Date(validated.reviewDate).toISOString().split('T')[0] : null,
      })
      .returning();

    return NextResponse.json(newDecision);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
