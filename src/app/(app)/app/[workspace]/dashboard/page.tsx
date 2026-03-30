import { db } from "@/lib/db";
import { decisions, workspaces } from "@/lib/schema";
import { eq, and, count, lte } from "drizzle-orm";
import {
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { ReviewTable } from "@/components/dashboard/review-table";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { EmptyState } from "@/components/ui/empty-state";

export default async function DashboardPage({
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

  // Stats
  const [totalDecisions] = await db
    .select({ value: count() })
    .from(decisions)
    .where(eq(decisions.workspaceId, workspace.id));

  const [activeDecisions] = await db
    .select({ value: count() })
    .from(decisions)
    .where(
      and(
        eq(decisions.workspaceId, workspace.id),
        eq(decisions.status, "active")
      )
    );

  const [validatedDecisions] = await db
    .select({ value: count() })
    .from(decisions)
    .where(
      and(
        eq(decisions.workspaceId, workspace.id),
        eq(decisions.status, "validated")
      )
    );

  const successRate = totalDecisions.value > 0
    ? Math.round((validatedDecisions.value / totalDecisions.value) * 100)
    : 0;

  // Decisions needing review (reviewDate <= today)
  const today = new Date().toISOString().split('T')[0];
  const pendingReviews = await db
    .select()
    .from(decisions)
    .where(
      and(
        eq(decisions.workspaceId, workspace.id),
        eq(decisions.status, "active"),
        lte(decisions.reviewDate, today)
      )
    )
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Overview of your workspace DNA and pending evaluations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Decisions"
          value={totalDecisions.value.toString()}
          icon={FileText}
          description="Decisions tracked"
        />
        <StatCard
          title="Active"
          value={activeDecisions.value.toString()}
          icon={Clock}
          description="Awaiting outcome"
        />
        <StatCard
          title="Validated"
          value={validatedDecisions.value.toString()}
          icon={CheckCircle2}
          description="Proven hypotheses"
        />
        <StatCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={TrendingUp}
          description="Validation ratio"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Needs Evaluation
          </h2>
          {pendingReviews.length > 0 ? (
            <ReviewTable
              decisions={pendingReviews}
              workspaceSlug={workspaceSlug}
            />
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
              <p className="text-sm text-zinc-500">No decisions currently due for review. Nice work!</p>
            </div>
          )}
        </div>
        <ActivityFeed workspaceSlug={workspaceSlug} />
      </div>
    </div>
  );
}
