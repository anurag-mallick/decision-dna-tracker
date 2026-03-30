"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
    FileText,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Archive,
    RotateCcw,
    Edit,
    Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Activity {
    id: string;
    actionType: string;
    details: Record<string, any> | null;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        avatarUrl: string | null;
    };
    decision: {
        id: string;
        title: string;
    };
}

interface ActivityFeedProps {
    workspaceSlug: string;
}

const actionIcons: Record<string, React.ReactNode> = {
    created: <FileText className="h-4 w-4 text-blue-500" />,
    updated: <Edit className="h-4 w-4 text-zinc-500" />,
    status_changed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    commented: <MessageSquare className="h-4 w-4 text-purple-500" />,
    outcome_logged: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    archived: <Archive className="h-4 w-4 text-zinc-400" />,
    restored: <RotateCcw className="h-4 w-4 text-blue-500" />,
};

const actionLabels: Record<string, string> = {
    created: "created",
    updated: "updated",
    status_changed: "changed status of",
    commented: "commented on",
    outcome_logged: "logged outcome for",
    archived: "archived",
    restored: "restored",
};

export function ActivityFeed({ workspaceSlug }: ActivityFeedProps) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        async function fetchActivities() {
            try {
                const res = await fetch(
                    `/api/activity?workspaceSlug=${workspaceSlug}&limit=10`
                );
                if (res.ok) {
                    const data = await res.json();
                    setActivities(data.activities);
                    setHasMore(data.hasMore);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchActivities();
    }, [workspaceSlug]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                {activities.length > 0 ? (
                    <div className="space-y-4">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 group"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={activity.user.avatarUrl || ""} />
                                    <AvatarFallback>
                                        {activity.user.name?.charAt(0) || "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">
                                        <span className="font-medium">
                                            {activity.user.name || "Unknown"}
                                        </span>{" "}
                                        <span className="text-zinc-500">
                                            {actionLabels[activity.actionType] || activity.actionType}
                                        </span>{" "}
                                        <Link
                                            href={`/app/${workspaceSlug}/decisions/${activity.decision.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {activity.decision.title}
                                        </Link>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {actionIcons[activity.actionType]}
                                        <span className="text-xs text-zinc-500">
                                            {formatDistanceToNow(new Date(activity.createdAt), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                    </div>
                                    {activity.details && activity.details.changes && (
                                        <p className="text-xs text-zinc-400 mt-1 truncate">
                                            {activity.details.changes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {hasMore && (
                            <p className="text-xs text-zinc-500 text-center pt-2">
                                Showing recent 10 activities
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-zinc-500 text-sm">
                        No activity yet. Create your first decision to get started!
                    </div>
                )}
            </CardContent>
        </Card>
    );
}