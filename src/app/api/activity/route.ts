import { db } from "@/lib/db";
import { activityLogs, users, decisions, workspaces, workspaceMembers } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceSlug = searchParams.get("workspaceSlug");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!workspaceSlug) {
        return new Response("Missing workspaceSlug", { status: 400 });
    }

    // Verify user has access to workspace
    const [workspace] = await db
        .select()
        .from(workspaces)
        .innerJoin(workspaceMembers, eq(workspaces.id, workspaceMembers.workspaceId))
        .where(
            and(
                eq(workspaces.slug, workspaceSlug),
                eq(workspaceMembers.userId, session.user.id as string)
            )
        )
        .limit(1);

    if (!workspace) {
        return new Response("Workspace not found", { status: 404 });
    }

    // Fetch activity logs with related data
    const activities = await db
        .select({
            id: activityLogs.id,
            actionType: activityLogs.actionType,
            details: activityLogs.details,
            createdAt: activityLogs.createdAt,
            user: {
                id: users.id,
                name: users.name,
                avatarUrl: users.avatarUrl,
            },
            decision: {
                id: decisions.id,
                title: decisions.title,
            },
        })
        .from(activityLogs)
        .innerJoin(users, eq(activityLogs.userId, users.id))
        .innerJoin(decisions, eq(activityLogs.decisionId, decisions.id))
        .where(eq(activityLogs.workspaceId, workspace.workspaces.id))
        .orderBy(desc(activityLogs.createdAt))
        .limit(limit)
        .offset(offset);

    return NextResponse.json({
        activities,
        hasMore: activities.length === limit,
    });
}