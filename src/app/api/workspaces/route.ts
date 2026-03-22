import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers } from "@/lib/schema";
import { workspaceSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userWorkspaces = await db
    .select({
      id: workspaces.id,
      name: workspaces.name,
      slug: workspaces.slug,
      role: workspaceMembers.role,
    })
    .from(workspaces)
    .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(eq(workspaceMembers.userId, session.user.id));

  return NextResponse.json(userWorkspaces);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = workspaceSchema.parse(body);

    const [existingWorkspace] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.slug, validated.slug))
      .limit(1);

    if (existingWorkspace) {
      return NextResponse.json(
        { error: "Workspace with this slug already exists" },
        { status: 400 }
      );
    }

    const workspace = await db.transaction(async (tx) => {
      const [newWorkspace] = await tx
        .insert(workspaces)
        .values({
          name: validated.name,
          slug: validated.slug,
          createdBy: session.user!.id!,
        })
        .returning();

      await tx.insert(workspaceMembers).values({
        workspaceId: newWorkspace.id,
        userId: session.user!.id!,
        role: "admin",
      });

      return newWorkspace;
    });

    return NextResponse.json(workspace);
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
