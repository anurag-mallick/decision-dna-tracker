import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { outcomes, decisions } from "@/lib/schema";
import { outcomeSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = outcomeSchema.parse(body);

    const outcome = await db.transaction(async (tx) => {
      const [newOutcome] = await tx
        .insert(outcomes)
        .values({
          decisionId: id,
          actualResult: validated.actualResult,
          status: validated.status,
          notes: validated.notes,
          reviewedBy: session.user!.id!,
        })
        .returning();

      // Update decision status
      await tx
        .update(decisions)
        .set({
          status: validated.status === 'too_early' ? 'reviewing' : validated.status,
          isGraveyard: validated.status === 'invalidated' || validated.status === 'inconclusive',
          updatedAt: new Date(),
        })
        .where(eq(decisions.id, id));

      return newOutcome;
    });

    return NextResponse.json(outcome);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
