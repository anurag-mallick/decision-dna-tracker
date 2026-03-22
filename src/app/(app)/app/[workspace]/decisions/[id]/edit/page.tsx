import { db } from "@/lib/db";
import { decisions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { DecisionForm } from "@/components/decisions/decision-form";

export default async function EditDecisionPage({
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Decision</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Refine the context or options for this decision.
        </p>
      </div>

      <div className="max-w-4xl">
        <DecisionForm 
          workspaceSlug={params.workspace} 
          initialData={decision} 
        />
      </div>
    </div>
  );
}
