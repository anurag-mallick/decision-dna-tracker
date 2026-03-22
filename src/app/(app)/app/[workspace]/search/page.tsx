"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DecisionCard } from "@/components/decisions/decision-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useDebounce } from "@/hooks/use-debounce";
import { useParams } from "next/navigation";

export default function SearchPage() {
  const params = useParams();
  const workspaceSlug = params.workspace as string;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?workspaceSlug=${workspaceSlug}&q=${encodeURIComponent(
            debouncedQuery
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery, workspaceSlug]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Find decisions by title, problem statement, context, or hypothesis.
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Type to search..."
          className="pl-10 h-12 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-4">
            {results.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                workspaceSlug={workspaceSlug}
              />
            ))}
          </div>
        ) : debouncedQuery ? (
          <EmptyState
            icon={SearchIcon}
            title="No results found"
            description={`We couldn't find any decisions matching "${debouncedQuery}"`}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
            <p className="text-zinc-500">Enter a query above to start searching.</p>
          </div>
        )}
      </div>
    </div>
  );
}
