"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { outcomeSchema } from "@/lib/validations";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OutcomeLoggerProps {
  decisionId: string;
  workspaceSlug: string;
  decisionTitle: string;
}

export function OutcomeLogger({
  decisionId,
  workspaceSlug,
  decisionTitle,
}: OutcomeLoggerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [actualResult, setActualResult] = useState("");
  const [status, setStatus] = useState<
    "validated" | "invalidated" | "inconclusive" | "too_early"
  >("validated");
  const [notes, setNotes] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = { actualResult, status, notes };
      outcomeSchema.parse(data);

      const response = await fetch(`/api/decisions/${decisionId}/outcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Something went wrong");
      }

      router.push(`/app/${workspaceSlug}/decisions/${decisionId}`);
      router.refresh();
    } catch (err: any) {
      if (err.name === "ZodError") {
        setError(err.errors[0].message);
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Evaluate Decision</CardTitle>
        <CardDescription>
          Record the actual outcome for: <strong>{decisionTitle}</strong>
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Actual Result</label>
            <Textarea
              placeholder="What actually happened? How did it differ from the hypothesis?"
              value={actualResult}
              onChange={(e) => setActualResult(e.target.value)}
              required
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Outcome Status</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { value: "validated", label: "Validated" },
                { value: "invalidated", label: "Invalidated" },
                { value: "inconclusive", label: "Inconclusive" },
                { value: "too_early", label: "Too Early" },
              ].map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={status === opt.value ? "default" : "outline"}
                  className="text-xs sm:text-sm"
                  onClick={() => setStatus(opt.value as any)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-zinc-500">
              {status === "validated" && "The hypothesis was correct."}
              {status === "invalidated" && "The hypothesis was incorrect."}
              {status === "inconclusive" && "The results are mixed or unclear."}
              {status === "too_early" && "We need more time to see the full impact."}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Additional Notes (Optional)</label>
            <Textarea
              placeholder="Any learnings or follow-up actions?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Outcome"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
