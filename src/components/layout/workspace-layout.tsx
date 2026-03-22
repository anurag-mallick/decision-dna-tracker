"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  workspaceSlug: string;
}

export function WorkspaceLayout({
  children,
  workspaceSlug,
}: WorkspaceLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-black">
      <Sidebar workspace={workspaceSlug} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
