import { db } from "@/lib/db";
import { decisions, workspaces } from "@/lib/schema";
import { eq, and, desc, or } from "drizzle-orm";
import { Skull } from "lucide-react";
import { DecisionCard } from "@/components/decisions/decision-card";
import { EmptyState } from "@/components/ui/empty-state";

export default async function GraveyardPage({
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

  const graveyardDecisions = await db
    .select()
    .from(decisions)
    .where(
      and(
        eq(decisions.workspaceId, workspace.id),
        or(
          eq(decisions.isGraveyard, true),
          eq(decisions.status, "invalidated"),
          eq(decisions.status, "inconclusive")
        )
      )
    )
    .orderBy(desc(decisions.updatedAt));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Graveyard</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Learning from what didn't work. These decisions were invalidated or inconclusive.
        </p>
      </div>

      {graveyardDecisions.length > 0 ? (
        <div className="grid gap-4">
          {graveyardDecisions.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Skull}
          title="Graveyard is empty"
          description="Every failed hypothesis is a step towards the truth. No failed bets recorded yet."
        />
      )}
    </div>
  );
}
