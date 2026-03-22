import { useState, useEffect } from "react";
import { Decision } from "@/lib/schema";

export function useDecisions(workspaceSlug: string) {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDecisions() {
      try {
        const res = await fetch(`/api/decisions?workspaceSlug=${workspaceSlug}`);
        if (!res.ok) throw new Error("Failed to fetch decisions");
        const data = await res.json();
        setDecisions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (workspaceSlug) {
      fetchDecisions();
    }
  }, [workspaceSlug]);

  return { decisions, loading, error };
}
