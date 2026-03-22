import { db } from "@/lib/db";
import { decisions, users, workspaces } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Calculate date 3 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 3);
  const targetDateStr = targetDate.toISOString().split('T')[0];

  const dueDecisions = await db
    .select({
      id: decisions.id,
      title: decisions.title,
      hypothesis: decisions.hypothesis,
      ownerEmail: users.email,
      ownerName: users.name,
      workspaceName: workspaces.name,
      workspaceSlug: workspaces.slug,
    })
    .from(decisions)
    .innerJoin(users, eq(decisions.ownerId, users.id))
    .innerJoin(workspaces, eq(decisions.workspaceId, workspaces.id))
    .where(
      and(
        eq(decisions.reviewDate, targetDateStr),
        sql`${decisions.status} NOT IN ('validated', 'invalidated')`,
        eq(decisions.isGraveyard, false)
      )
    );

  for (const decision of dueDecisions) {
    await resend.emails.send({
      from: "Decision DNA <reminders@resend.dev>",
      to: decision.ownerEmail,
      subject: `Review due in 3 days: ${decision.title}`,
      html: `
        <h1>Decision DNA Tracker</h1>
        <p>Hi ${decision.ownerName},</p>
        <p>A decision you own is due for review in 3 days.</p>
        <h2 style="font-size: 20px;">${decision.title}</h2>
        <p>Your hypothesis was:</p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
          ${decision.hypothesis || "No hypothesis recorded."}
        </blockquote>
        <br />
        <a href="${process.env.NEXTAUTH_URL}/app/${decision.workspaceSlug}/decisions/${decision.id}" 
           style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Log What Happened
        </a>
        <p style="font-size: 12px; color: #777; margin-top: 20px;">
          You're receiving this because you own this decision in <strong>${decision.workspaceName}</strong>.
        </p>
      `,
    });
  }

  return NextResponse.json({ processed: dueDecisions.length });
}
