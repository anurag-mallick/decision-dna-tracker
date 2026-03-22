import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { db } from "@/lib/db";
import { workspaces, workspaceMembers } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const workspaceSlug = params.workspace;

  // Verify workspace existence and membership
  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.slug, workspaceSlug),
    with: {
      members: {
        where: eq(workspaceMembers.userId, session.user.id),
      },
    },
  });

  // If I can't use 'with' directly because of Drizzle setup, I'll do a join
  const [member] = await db
    .select()
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(
      and(
        eq(workspaces.slug, workspaceSlug),
        eq(workspaceMembers.userId, session.user.id)
      )
    )
    .limit(1);

  if (!member) {
    // If user is not a member, check if it's their first time and they have NO workspaces
    // Redirect to a "Create Workspace" or "Dashboard" where they can pick one
    redirect("/");
  }

  return (
    <WorkspaceLayout workspaceSlug={workspaceSlug}>
      {children}
    </WorkspaceLayout>
  );
}
