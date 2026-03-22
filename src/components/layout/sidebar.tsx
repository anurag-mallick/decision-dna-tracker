"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  Skull,
  Search,
  Settings,
  PlusCircle,
} from "lucide-react";

interface SidebarProps {
  workspace: string;
}

export function Sidebar({ workspace }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: `/app/${workspace}/dashboard`,
      active: pathname === `/app/${workspace}/dashboard`,
    },
    {
      label: "Decisions",
      icon: FileText,
      href: `/app/${workspace}/decisions`,
      active: pathname === `/app/${workspace}/decisions`,
    },
    {
      label: "Graph",
      icon: GitBranch,
      href: `/app/${workspace}/graph`,
      active: pathname === `/app/${workspace}/graph`,
    },
    {
      label: "Graveyard",
      icon: Skull,
      href: `/app/${workspace}/graveyard`,
      active: pathname === `/app/${workspace}/graveyard`,
    },
    {
      label: "Search",
      icon: Search,
      href: `/app/${workspace}/search`,
      active: pathname === `/app/${workspace}/search`,
    },
    {
      label: "Settings",
      icon: Settings,
      href: `/app/${workspace}/settings`,
      active: pathname === `/app/${workspace}/settings`,
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center text-white dark:text-black">
            D
          </div>
          <span>DNA Tracker</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                route.active
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <Link
          href={`/app/${workspace}/decisions/new`}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90"
        >
          <PlusCircle className="h-4 w-4" />
          New Decision
        </Link>
      </div>
    </div>
  );
}
