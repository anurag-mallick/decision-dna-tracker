import Link from "next/link";
import { Decision } from "@/lib/schema";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewTableProps {
  decisions: Decision[];
  workspaceSlug: string;
}

export function ReviewTable({ decisions, workspaceSlug }: ReviewTableProps) {
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b border-zinc-200 transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800">
              <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">
                Decision
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">
                Review Due
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium text-zinc-500 dark:text-zinc-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {decisions.map((decision) => (
              <tr
                key={decision.id}
                className="border-b border-zinc-200 transition-colors hover:bg-zinc-100/50 data-[state=selected]:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800"
              >
                <td className="p-4 align-middle font-medium">
                  <Link
                    href={`/app/${workspaceSlug}/decisions/${decision.id}`}
                    className="hover:underline"
                  >
                    {decision.title}
                  </Link>
                </td>
                <td className="p-4 align-middle text-amber-600 dark:text-amber-500">
                  {decision.reviewDate && formatDistanceToNow(new Date(decision.reviewDate), { addSuffix: true })}
                </td>
                <td className="p-4 align-middle text-right">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/app/${workspaceSlug}/decisions/${decision.id}/outcome`}>
                      Log Outcome
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
