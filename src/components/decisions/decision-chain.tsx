import Link from "next/link";
import { GitBranch, ChevronDown, ChevronRight } from "lucide-react";
import { Decision } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";

interface DecisionChainProps {
  decision: Decision;
  parents: Decision[];
  childDecisions: Decision[];
  workspaceSlug: string;
}

export function DecisionChain({
  decision,
  parents,
  childDecisions,
  workspaceSlug,
}: DecisionChainProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-zinc-400" />
        Decision DNA Chain
      </h3>

      <div className="relative pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-8">
        {parents.map((p) => (
          <div key={p.id} className="relative">
            <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <Link
              href={`/app/${workspaceSlug}/decisions/${p.id}`}
              className="group block p-3 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 transition-all"
            >
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Parent Decision</p>
              <p className="font-medium group-hover:text-blue-500 transition-colors">{p.title}</p>
            </Link>
          </div>
        ))}

        <div className="relative">
          <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-zinc-900 dark:bg-zinc-50 border-4 border-zinc-50 dark:border-black" />
          <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-50">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold mb-1">Current Decision</p>
            <p className="font-bold">{decision.title}</p>
          </div>
        </div>

        {childDecisions.length > 0 ? (
          childDecisions.map((c) => (
            <div key={c.id} className="relative">
              <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <Link
                href={`/app/${workspaceSlug}/decisions/${c.id}`}
                className="group block p-3 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 transition-all"
              >
                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Child Decision</p>
                <p className="font-medium group-hover:text-blue-500 transition-colors">{c.title}</p>
              </Link>
            </div>
          ))
        ) : (
          <div className="relative">
            <div className="absolute -left-[25px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <p className="p-3 text-sm text-zinc-400 italic">No descendant decisions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
