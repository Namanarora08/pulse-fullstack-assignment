"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ClipboardList,
  LayoutDashboard,
  Search,
  Settings,
  UsersRound
} from "lucide-react";

import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/doctor", label: "Overview", icon: LayoutDashboard },
  { href: "/doctor/patients", label: "Patients", icon: UsersRound },
  {
    href: "/doctor/patients/demo",
    label: "Patient Detail",
    icon: ClipboardList
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-recovery text-background">
          <Activity className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-semibold">Pulse Doctor</span>
      </div>
      <div className="p-4">
        <div className="flex h-10 items-center gap-2 rounded-md border bg-background px-3 text-sm text-text-muted">
          <Search className="h-4 w-4" aria-hidden="true" />
          Search workspace
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/doctor" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-text-muted transition-colors hover:bg-background-elevated hover:text-text-primary",
                active && "bg-background-elevated text-text-primary"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text-muted">
          <Settings className="h-4 w-4" aria-hidden="true" />
          Workspace settings
        </div>
      </div>
    </aside>
  );
}
