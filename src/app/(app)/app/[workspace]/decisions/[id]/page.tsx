import { db } from "@/lib/db";
import { decisions, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { DecisionDetail } from "@/components/decisions/decision-detail";
import { DecisionChain } from "@/components/decisions/decision-chain";

export default async function DecisionPage({
  params,
}: {
  params: { workspace: string; id: string };
}) {
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
    .where(eq(decisions.id, params.id))
    .limit(1);

  if (!data) {
    notFound();
  }

  // Fetch parents (usually just one, but schema allows for more if we want to expand)
  let parents: any[] = [];
  if (data.decision.parentDecisionId) {
    parents = await db
      .select()
      .from(decisions)
      .where(eq(decisions.id, data.decision.parentDecisionId));
  }

  // Fetch children
  const children = await db
    .select()
    .from(decisions)
    .where(eq(decisions.parentDecisionId, data.decision.id));

  return (
    <div className="space-y-12">
      <DecisionDetail
        decision={data.decision}
        owner={data.owner}
        workspaceSlug={params.workspace}
      />
      
      <div className="max-w-3xl">
        <DecisionChain
          decision={data.decision}
          parents={parents}
          children={children}
          workspaceSlug={params.workspace}
        />
      </div>
    </div>
  );
}
