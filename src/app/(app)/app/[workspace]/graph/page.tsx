import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { decisions, workspaces, workspaceMembers } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { DecisionGraph } from "@/components/graph/decision-graph";

export default async function GraphPage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const { workspace: workspaceSlug } = await params;

  const [workspace] = await db
    .select()
    .from(workspaces)
    .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
    .where(
      and(
        eq(workspaces.slug, workspaceSlug),
        eq(workspaceMembers.userId, session?.user?.id as string)
      )
    )
    .limit(1);

  if (!workspace) return null;

  const allDecisions = await db
    .select({
      id: decisions.id,
      title: decisions.title,
      status: decisions.status,
      parentId: decisions.parentDecisionId,
    })
    .from(decisions)
    .where(eq(decisions.workspaceId, workspace.workspaces.id));

  const data = {
    nodes: allDecisions.map(d => ({
      id: d.id,
      title: d.title,
      status: d.status,
    })),
    links: allDecisions
      .filter(d => d.parentId)
      .map(d => ({
        source: d.parentId!,
        target: d.id,
      })),
  };

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Decision Graph</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Visualize the relationships and evolution of your team's decisions.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <DecisionGraph data={data} workspaceSlug={workspaceSlug} />
      </div>
    </div>
  );
}
