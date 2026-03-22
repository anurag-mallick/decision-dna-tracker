import { db } from "@/lib/db";
import { decisions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { OutcomeLogger } from "@/components/decisions/outcome-logger";

export default async function OutcomePage({
  params,
}: {
  params: { workspace: string; id: string };
}) {
  const [decision] = await db
    .select()
    .from(decisions)
    .where(eq(decisions.id, params.id))
    .limit(1);

  if (!decision) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluate Outcome</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Close the loop by recording what actually happened.
        </p>
      </div>

      <OutcomeLogger
        decisionId={decision.id}
        decisionTitle={decision.title}
        workspaceSlug={params.workspace}
      />
    </div>
  );
}
