"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Target,
  Layers,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Decision, User } from "@/lib/schema";
import { useRouter } from "next/navigation";

interface DecisionDetailProps {
  decision: Decision;
  owner: Partial<User>;
  workspaceSlug: string;
}

export function DecisionDetail({ decision, owner, workspaceSlug }: DecisionDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/decisions/${decision.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push(`/app/${workspaceSlug}/decisions`);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href={`/app/${workspaceSlug}/decisions`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{decision.title}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
              <span>By {owner.name}</span>
              <span>•</span>
              <span>{format(new Date(decision.createdAt), "PPP")}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/app/${workspaceSlug}/decisions/${decision.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Problem Statement & Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-zinc-400" />
                Context & Problem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Problem Statement</h4>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {decision.problemStatement || "No problem statement provided."}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Background Context</h4>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {decision.context || "No context provided."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Options Considered */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-zinc-400" />
              Options Considered
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {decision.optionsConsidered?.map((opt, idx) => (
                <Card key={idx} className={decision.chosenOption === opt.option ? "border-zinc-900 dark:border-zinc-50 ring-1 ring-zinc-900 dark:ring-zinc-50" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{opt.option}</CardTitle>
                      {decision.chosenOption === opt.option && (
                        <Badge className="bg-zinc-900 dark:bg-zinc-50">Selected</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Pros</p>
                      <ul className="text-sm space-y-1">
                        {opt.pros.map((pro, i) => (pro && <li key={i} className="flex gap-2"><span className="text-emerald-500">+</span> {pro}</li>))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase text-red-600 dark:text-red-400">Cons</p>
                      <ul className="text-sm space-y-1">
                        {opt.cons.map((con, i) => (con && <li key={i} className="flex gap-2"><span className="text-red-500">-</span> {con}</li>))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Hypothesis & Evidence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-zinc-400" />
                The Bet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Hypothesis</h4>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap italic">
                  "{decision.hypothesis || "No hypothesis defined."}"
                </p>
              </div>
              {decision.evidence && decision.evidence.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Supporting Evidence</h4>
                  <div className="grid gap-2">
                    {decision.evidence.map((ev, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-md bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm">
                        <span>{ev.label}</span>
                        {ev.url && (
                          <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                            Link <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Status Sidebar */}
          <Card>
            <CardHeader>
              <CardTitle>Decision Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-zinc-500">Status</p>
                <div className="flex items-center gap-2">
                  <Badge className="capitalize px-3 py-1 text-sm">{decision.status}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-zinc-500">Confidence</p>
                <Badge variant="outline" className="capitalize px-3 py-1 text-sm border-zinc-300">
                  {decision.confidenceLevel} Confidence
                </Badge>
              </div>
              {decision.reviewDate && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-zinc-500">Review Due</p>
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>{format(new Date(decision.reviewDate), "PPP")}</span>
                  </div>
                </div>
              )}
              {decision.tags && decision.tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-zinc-500">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {decision.tags.map(tag => (
                      <Badge key={tag} variant="secondary">#{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Outcome Logging Placeholder */}
          {decision.status === 'reviewing' || decision.status === 'active' ? (
            <Card className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-none">
              <CardHeader>
                <CardTitle className="text-lg">Log Outcome</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm opacity-80">
                  Is it time to evaluate this decision? Log the actual results to complete the DNA.
                </p>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={`/app/${workspaceSlug}/decisions/${decision.id}/outcome`}>
                    Evaluate Decision
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Decision"
        description="Are you sure you want to delete this decision? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
