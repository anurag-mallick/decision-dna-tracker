import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { decisions, users } from "@/lib/schema";
import { decisionSchema } from "@/lib/validations";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [decision] = await db
    .select({
      decision: decisions,
      owner: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(decisions)
    .innerJoin(users, eq(decisions.ownerId, users.id))
    .where(eq(decisions.id, id))
    .limit(1);

  if (!decision) {
    return NextResponse.json({ error: "Decision not found" }, { status: 404 });
  }

  return NextResponse.json(decision);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = decisionSchema.partial().parse(body);

    const [existingDecision] = await db
      .select()
      .from(decisions)
      .where(eq(decisions.id, id))
      .limit(1);

    if (!existingDecision) {
      return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    // Update the decision
    const [updatedDecision] = await db
      .update(decisions)
      .set({
        ...validated,
        reviewDate: validated.reviewDate ? new Date(validated.reviewDate).toISOString().split('T')[0] : (validated.reviewDate === null ? null : undefined),
        updatedAt: new Date(),
      })
      .where(eq(decisions.id, id))
      .returning();

    return NextResponse.json(updatedDecision);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [decision] = await db
    .delete(decisions)
    .where(and(eq(decisions.id, id), eq(decisions.ownerId, session.user.id)))
    .returning();

  if (!decision) {
    return NextResponse.json(
      { error: "Decision not found or you don't have permission" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
