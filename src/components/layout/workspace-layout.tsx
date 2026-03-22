"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Github, Linkedin } from "lucide-react";

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
        <footer className="border-t border-zinc-200 dark:border-zinc-800 py-4 px-6 bg-zinc-50 dark:bg-black">
          <div className="flex items-center justify-center gap-4 text-sm text-zinc-500">
            <span>Made by</span>
            <a 
              href="https://github.com/anurag-mallick" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Anurag Mallick</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/anuragmallick901/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 text-zinc-400 hover:text-blue-500 transition-colors"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
