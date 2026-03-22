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
  params: Promise<{ workspace: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { workspace: workspaceSlug } = await params;

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
    redirect("/new-workspace");
  }

  return (
    <WorkspaceLayout workspaceSlug={workspaceSlug}>
      {children}
    </WorkspaceLayout>
  );
}
