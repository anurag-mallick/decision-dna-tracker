import { db } from "@/lib/db";
import { decisions, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { DecisionDetail } from "@/components/decisions/decision-detail";
import { DecisionChain } from "@/components/decisions/decision-chain";

export default async function DecisionPage({
  params,
}: {
  params: Promise<{ workspace: string; id: string }>;
}) {
  const { workspace: workspaceSlug, id } = await params;
  
  const [data] = await db
    .select({
      decision: decisions,
      owner: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(decisions)
    .innerJoin(users, eq(decisions.ownerId, users.id))
    .where(eq(decisions.id, id))
    .limit(1);

  if (!data) {
    notFound();
  }

  let parents: any[] = [];
  if (data.decision.parentDecisionId) {
    parents = await db
      .select()
      .from(decisions)
      .where(eq(decisions.id, data.decision.parentDecisionId));
  }

  const children = await db
    .select()
    .from(decisions)
    .where(eq(decisions.parentDecisionId, data.decision.id));

  return (
    <div className="space-y-12">
      <DecisionDetail
        decision={data.decision}
        owner={data.owner}
        workspaceSlug={workspaceSlug}
      />
      
      <div className="max-w-3xl">
        <DecisionChain
          decision={data.decision}
          parents={parents}
          childDecisions={children}
          workspaceSlug={workspaceSlug}
        />
      </div>
    </div>
  );
}
