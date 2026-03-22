import { DecisionForm } from "@/components/decisions/decision-form";

export default async function NewDecisionPage({
  params,
}: {
  params: Promise<{ workspace: string }>;
}) {
  const { workspace: workspaceSlug } = await params;
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Decision</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Document your decision-making process to build team knowledge.
        </p>
      </div>

      <div className="max-w-4xl">
        <DecisionForm workspaceSlug={workspaceSlug} />
      </div>
    </div>
  );
}
