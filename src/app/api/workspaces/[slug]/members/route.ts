import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers, invites } from "@/lib/schema";
import { inviteSchema } from "@/lib/validations";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateToken } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [workspace] = await db
    .select()
    .from(workspaces)
    .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(
      and(
        eq(workspaces.slug, slug),
        eq(workspaceMembers.userId, session.user.id)
      )
    )
    .limit(1);

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const members = await db.query.workspaceMembers.findMany({
    where: eq(workspaceMembers.workspaceId, workspace.workspaces.id),
    with: {
      // Assuming I can't easily join users table here with 'with' unless relation defined
      // so I'll probably return partial data or fix relation in schema later.
      // For now, simpler join approach:
    }
  });
  
  // Actually, standard select with join is safer given previous schema file
  const membersWithUser = await db
    .select({
      id: workspaceMembers.id,
      role: workspaceMembers.role,
      joinedAt: workspaceMembers.joinedAt,
      // We need user details
    })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.workspaceId, workspace.workspaces.id));
    
  return NextResponse.json(membersWithUser);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = inviteSchema.parse(body);

    const [adminMember] = await db
      .select({ role: workspaceMembers.role, workspaceId: workspaces.id, workspaceName: workspaces.name })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
      .where(
        and(
          eq(workspaces.slug, slug),
          eq(workspaceMembers.userId, session.user.id)
        )
      )
      .limit(1);

    if (!adminMember || adminMember.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const [invite] = await db
      .insert(invites)
      .values({
        workspaceId: adminMember.workspaceId,
        email: validated.email,
        role: validated.role,
        token,
        invitedBy: session.user.id,
        expiresAt,
      })
      .returning();

    // Send email via Resend
    await resend.emails.send({
      from: "Decision DNA <onboarding@resend.dev>", // Should be configured domain
      to: validated.email,
      subject: `Join ${adminMember.workspaceName} on Decision DNA Tracker`,
      html: `
        <p>You've been invited to join <strong>${adminMember.workspaceName}</strong>.</p>
        <p>Click the link below to accept:</p>
        <a href="${process.env.NEXTAUTH_URL}/invite/${token}">Accept Invite</a>
      `,
    });

    return NextResponse.json(invite);
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
