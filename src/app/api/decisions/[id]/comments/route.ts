import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { comments, decisions, users } from "@/lib/schema";
import { commentSchema } from "@/lib/validations";
import { eq, desc, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      user: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.decisionId, params.id))
    .orderBy(desc(comments.createdAt));

  return NextResponse.json(allComments);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = commentSchema.parse(body);

    // Verify decision exists
    const [decision] = await db
      .select()
      .from(decisions)
      .where(eq(decisions.id, params.id))
      .limit(1);

    if (!decision) {
      return NextResponse.json({ error: "Decision not found" }, { status: 404 });
    }

    const [comment] = await db
      .insert(comments)
      .values({
        decisionId: params.id,
        userId: session.user.id,
        content: validated.content,
      })
      .returning();

    const commentWithUser = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        user: {
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.id, comment.id))
      .limit(1);

    return NextResponse.json(commentWithUser[0]);
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
