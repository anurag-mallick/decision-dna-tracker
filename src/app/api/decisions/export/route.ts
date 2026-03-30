import { db } from "@/lib/db";
import { decisions, users, workspaces, workspaceMembers } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workspaceSlug = searchParams.get("workspaceSlug");
    const format = searchParams.get("format") || "json";

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

    // Fetch all decisions with owner info
    const allDecisions = await db
        .select({
            id: decisions.id,
            title: decisions.title,
            problemStatement: decisions.problemStatement,
            context: decisions.context,
            optionsConsidered: decisions.optionsConsidered,
            chosenOption: decisions.chosenOption,
            rejectionReasons: decisions.rejectionReasons,
            evidence: decisions.evidence,
            hypothesis: decisions.hypothesis,
            confidenceLevel: decisions.confidenceLevel,
            status: decisions.status,
            tags: decisions.tags,
            reviewDate: decisions.reviewDate,
            isGraveyard: decisions.isGraveyard,
            createdAt: decisions.createdAt,
            updatedAt: decisions.updatedAt,
            ownerName: users.name,
            ownerEmail: users.email,
        })
        .from(decisions)
        .innerJoin(users, eq(decisions.ownerId, users.id))
        .where(eq(decisions.workspaceId, workspace.workspaces.id));

    if (format === "csv") {
        // Generate CSV
        const headers = [
            "ID",
            "Title",
            "Problem Statement",
            "Context",
            "Chosen Option",
            "Hypothesis",
            "Confidence Level",
            "Status",
            "Tags",
            "Review Date",
            "Owner Name",
            "Owner Email",
            "Created At",
            "Updated At",
        ];

        const csvRows = [
            headers.join(","),
            ...allDecisions.map((d) =>
                [
                    d.id,
                    `"${(d.title || "").replace(/"/g, '""')}"`,
                    `"${(d.problemStatement || "").replace(/"/g, '""')}"`,
                    `"${(d.context || "").replace(/"/g, '""')}"`,
                    `"${(d.chosenOption || "").replace(/"/g, '""')}"`,
                    `"${(d.hypothesis || "").replace(/"/g, '""')}"`,
                    d.confidenceLevel,
                    d.status,
                    `"${(d.tags || []).join(", ")}"`,
                    d.reviewDate,
                    `"${d.ownerName || ""}"`,
                    d.ownerEmail,
                    d.createdAt,
                    d.updatedAt,
                ].join(",")
            ),
        ];

        return new NextResponse(csvRows.join("\n"), {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="decisions-${workspaceSlug}.csv"`,
            },
        });
    }

    // Default: JSON format
    return NextResponse.json({
        exportedAt: new Date().toISOString(),
        workspace: workspaceSlug,
        totalDecisions: allDecisions.length,
        decisions: allDecisions,
    });
}