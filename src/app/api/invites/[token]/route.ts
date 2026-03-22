import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { invites, workspaceMembers, users, workspaces } from "@/lib/schema";
import { eq, and, gt } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  const [invite] = await db
    .select({
      email: invites.email,
      role: invites.role,
      expiresAt: invites.expiresAt,
      workspaceName: workspaces.name,
      inviterName: users.name,
    })
    .from(invites)
    .innerJoin(workspaces, eq(invites.workspaceId, workspaces.id))
    .innerJoin(users, eq(invites.invitedBy, users.id))
    .where(
      and(
        eq(invites.token, params.token),
        gt(invites.expiresAt, new Date()),
        eq(invites.acceptedAt, null as any) // Check explicitly for null/not accepted
      )
    )
    .limit(1);

  if (!invite) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });
  }

  return NextResponse.json(invite);
}

export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [invite] = await db
    .select()
    .from(invites)
    .where(
      and(
        eq(invites.token, params.token),
        gt(invites.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!invite || invite.acceptedAt) {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 400 });
  }

  // Check if email matches (optional security measure, maybe skip for flexibility or warn)
  if (invite.email.toLowerCase() !== session.user.email?.toLowerCase()) {
    // In strict mode we'd return 403, but often users accept with diff emails (e.g. personal vs work)
    // For now, let's allow it but maybe log it? Or stick to strict.
    // Strict for now to match schema intent.
    return NextResponse.json(
      { error: "Invite email does not match logged in user" },
      { status: 403 }
    );
  }

  await db.transaction(async (tx) => {
    // Add member
    await tx.insert(workspaceMembers).values({
      workspaceId: invite.workspaceId,
      userId: session.user!.id!,
      role: invite.role,
    });

    // Mark invite accepted
    await tx
      .update(invites)
      .set({ acceptedAt: new Date() })
      .where(eq(invites.id, invite.id));
  });

  return NextResponse.json({ success: true });
}
