import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { 
  Calendar, 
  ChevronRight, 
  MessageSquare, 
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Decision } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface DecisionCardProps {
  decision: Decision;
  workspaceSlug: string;
}

const statusConfig = {
  active: {
    label: "Active",
    variant: "default" as const,
    icon: Clock,
    className: "text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  },
  reviewing: {
    label: "Reviewing",
    variant: "warning" as const,
    icon: AlertCircle,
    className: "text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  },
  validated: {
    label: "Validated",
    variant: "success" as const,
    icon: CheckCircle2,
    className: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
  },
  invalidated: {
    label: "Invalidated",
    variant: "destructive" as const,
    icon: XCircle,
    className: "text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  },
  inconclusive: {
    label: "Inconclusive",
    variant: "secondary" as const,
    icon: AlertCircle,
    className: "text-zinc-500 bg-zinc-50 dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800",
  },
};

export function DecisionCard({ decision, workspaceSlug }: DecisionCardProps) {
  const config = statusConfig[decision.status as keyof typeof statusConfig] || statusConfig.active;
  const StatusIcon = config.icon;

  return (
    <Link href={`/app/${workspaceSlug}/decisions/${decision.id}`}>
      <Card className="hover:border-zinc-300 transition-colors dark:hover:border-zinc-700">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-none">
                {decision.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {decision.problemStatement || "No problem statement provided."}
              </p>
            </div>
            <Badge variant={config.variant} className={cn("shrink-0 gap-1", config.className)}>
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(decision.createdAt), { addSuffix: true })}
            </div>
            {decision.reviewDate && (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Clock className="h-3 w-3" />
                Review: {new Date(decision.reviewDate).toLocaleDateString()}
              </div>
            )}
            {decision.tags && decision.tags.length > 0 && (
              <div className="flex items-center gap-1">
                {decision.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-1.5 py-0 font-normal">
                    #{tag}
                  </Badge>
                ))}
                {decision.tags.length > 2 && (
                  <span>+{decision.tags.length - 2} more</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
