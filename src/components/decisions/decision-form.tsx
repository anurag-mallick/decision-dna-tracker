"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { decisionSchema } from "@/lib/validations";
import { Decision } from "@/lib/schema";

interface DecisionFormProps {
  workspaceSlug: string;
  initialData?: Decision;
}

export function DecisionForm({ workspaceSlug, initialData }: DecisionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDecisions, setIsFetchingDecisions] = useState(false);
  const [availableDecisions, setAvailableDecisions] = useState<Decision[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [problemStatement, setProblemStatement] = useState(initialData?.problemStatement || "");
  const [context, setContext] = useState(initialData?.context || "");
  const [chosenOption, setChosenOption] = useState(initialData?.chosenOption || "");
  const [hypothesis, setHypothesis] = useState(initialData?.hypothesis || "");
  const [confidenceLevel, setConfidenceLevel] = useState<"high" | "medium" | "low">(
    (initialData?.confidenceLevel as any) || "medium"
  );
  const [reviewDate, setReviewDate] = useState(initialData?.reviewDate || "");
  const [parentId, setParentId] = useState(initialData?.parentDecisionId || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");

  const [options, setOptions] = useState<any[]>(
    initialData?.optionsConsidered || [{ option: "", pros: [""], cons: [""] }]
  );

  useEffect(() => {
    async function fetchDecisions() {
      setIsFetchingDecisions(true);
      try {
        const res = await fetch(`/api/decisions?workspaceSlug=${workspaceSlug}`);
        if (res.ok) {
          const data = await res.json();
          // Filter out current decision to avoid self-reference
          setAvailableDecisions(data.filter((d: Decision) => d.id !== initialData?.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetchingDecisions(false);
      }
    }
    fetchDecisions();
  }, [workspaceSlug, initialData?.id]);

  const addOption = () => {
    setOptions([...options, { option: "", pros: [""], cons: [""] }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const addPro = (optionIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].pros.push("");
    setOptions(newOptions);
  };

  const addCon = (optionIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].cons.push("");
    setOptions(newOptions);
  };

  const updateProCon = (optionIndex: number, type: "pros" | "cons", itemIndex: number, value: string) => {
    const newOptions = [...options];
    newOptions[optionIndex][type][itemIndex] = value;
    setOptions(newOptions);
  };

  const removeProCon = (optionIndex: number, type: "pros" | "cons", itemIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex][type] = newOptions[optionIndex][type].filter((_: any, i: number) => i !== itemIndex);
    setOptions(newOptions);
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const decisionData = {
      title,
      problemStatement,
      context,
      optionsConsidered: options.filter(o => o.option),
      chosenOption,
      hypothesis,
      confidenceLevel,
      reviewDate: reviewDate || null,
      parentDecisionId: parentId || null,
      tags,
    };

    try {
      decisionSchema.parse(decisionData);

      const url = initialData 
        ? `/api/decisions/${initialData.id}`
        : "/api/decisions";
      
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...decisionData, workspaceSlug }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      const decision = await response.json();
      router.push(`/app/${workspaceSlug}/decisions/${decision.id || initialData?.id}`);
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
    <form onSubmit={onSubmit} className="space-y-8 pb-20">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Title</label>
          <Input
            placeholder="e.g., Migrate to Next.js 15"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Problem Statement</label>
            <Textarea
              placeholder="What problem are we solving?"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Context</label>
            <Textarea
              placeholder="Any relevant background info, constraints, or assumptions."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Options Considered</h3>
          <Button type="button" variant="outline" size="sm" onClick={addOption}>
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        </div>

        <div className="space-y-6">
          {options.map((option, optIdx) => (
            <Card key={optIdx} className="relative">
              {options.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-zinc-400 hover:text-red-500"
                  onClick={() => removeOption(optIdx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">Option {optIdx + 1}</label>
                  <Input
                    placeholder="Describe the option"
                    value={option.option}
                    onChange={(e) => updateOption(optIdx, "option", e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Pros</label>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => addPro(optIdx)}>
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                    </div>
                    {option.pros.map((pro: string, proIdx: number) => (
                      <div key={proIdx} className="flex gap-2">
                        <Input
                          placeholder="A benefit..."
                          value={pro}
                          onChange={(e) => updateProCon(optIdx, "pros", proIdx, e.target.value)}
                          className="h-8 text-sm"
                        />
                        {option.pros.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeProCon(optIdx, "pros", proIdx)}>
                            <MinusCircle className="h-3 w-3 text-zinc-400" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase text-red-600 dark:text-red-400">Cons</label>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => addCon(optIdx)}>
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                    </div>
                    {option.cons.map((con: string, conIdx: number) => (
                      <div key={conIdx} className="flex gap-2">
                        <Input
                          placeholder="A drawback..."
                          value={con}
                          onChange={(e) => updateProCon(optIdx, "cons", conIdx, e.target.value)}
                          className="h-8 text-sm"
                        />
                        {option.cons.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeProCon(optIdx, "cons", conIdx)}>
                            <MinusCircle className="h-3 w-3 text-zinc-400" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Chosen Option</label>
            <Input
              placeholder="Which option was selected?"
              value={chosenOption}
              onChange={(e) => setChosenOption(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Hypothesis</label>
            <Textarea
              placeholder="What do we expect the outcome to be?"
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Parent Decision</label>
            {isFetchingDecisions ? (
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading decisions...
              </div>
            ) : (
              <select
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:border-zinc-800"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">None</option>
                {availableDecisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-zinc-500">Link this to a previous decision it depends on.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Confidence Level</label>
            <div className="flex gap-2">
              {["high", "medium", "low"].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={confidenceLevel === level ? "default" : "outline"}
                  className="flex-1 capitalize"
                  onClick={() => setConfidenceLevel(level as any)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Review Date</label>
            <Input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
            />
            <p className="text-xs text-zinc-500">When should we evaluate the outcome?</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Badge key={tag} className="gap-1 pl-2.5">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addTag}>
            Add
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Decision" : "Create Decision"}
        </Button>
      </div>
    </form>
  );
}
