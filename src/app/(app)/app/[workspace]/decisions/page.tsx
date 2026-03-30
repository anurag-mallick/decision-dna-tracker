import Link from "next/link";
import { Plus, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DecisionCard } from "@/components/decisions/decision-card";
import { EmptyState } from "@/components/ui/empty-state";
import { db } from "@/lib/db";
import { decisions, workspaces } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";

export default async function DecisionsPage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace: workspaceSlug } = await params;

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.slug, workspaceSlug))
    .limit(1);

  if (!workspace) return null;

  const allDecisions = await db
    .select()
    .from(decisions)
    .where(
      and(
        eq(decisions.workspaceId, workspace.id),
        eq(decisions.isGraveyard, false)
      )
    )
    .orderBy(desc(decisions.createdAt));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decisions</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Keep track of all major decisions and their current status.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/api/decisions/export?workspaceSlug=${workspaceSlug}&format=csv`}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/app/${workspaceSlug}/decisions/new`}>
              <Plus className="mr-2 h-4 w-4" />
              New Decision
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Filter decisions..."
            className="pl-10"
          />
        </div>
      </div>

      {allDecisions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {allDecisions.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Plus}
          title="No decisions yet"
          description="Start tracking your team's decisions to build your DNA map."
          action={{
            label: "Create Decision",
            onClick: () => { }, // Handled by Link above, but this component needs it
          }}
        />
      )}
    </div>
  );
}
