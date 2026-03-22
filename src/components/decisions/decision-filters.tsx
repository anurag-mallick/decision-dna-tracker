"use client";

import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DecisionFiltersProps {
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string | null) => void;
  selectedStatus: string | null;
}

export function DecisionFilters({
  onSearchChange,
  onStatusChange,
  selectedStatus,
}: DecisionFiltersProps) {
  const statuses = [
    { value: "active", label: "Active" },
    { value: "reviewing", label: "Reviewing" },
    { value: "validated", label: "Validated" },
    { value: "invalidated", label: "Invalidated" },
    { value: "inconclusive", label: "Inconclusive" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search decisions..."
            className="pl-10"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter className="h-4 w-4 text-zinc-500 shrink-0" />
          {statuses.map((status) => (
            <Badge
              key={status.value}
              variant={selectedStatus === status.value ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => onStatusChange(selectedStatus === status.value ? null : status.value)}
            >
              {status.label}
            </Badge>
          ))}
          {selectedStatus && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => onStatusChange(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
