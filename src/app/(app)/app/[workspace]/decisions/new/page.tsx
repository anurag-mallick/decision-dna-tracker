import { DecisionForm } from "@/components/decisions/decision-form";

export default function NewDecisionPage({
  params,
}: {
  params: { workspace: string };
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Decision</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Document your decision-making process to build team knowledge.
        </p>
      </div>

      <div className="max-w-4xl">
        <DecisionForm workspaceSlug={params.workspace} />
      </div>
    </div>
  );
}
