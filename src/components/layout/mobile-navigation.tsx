"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  Home,
  LayoutDashboard,
  Stethoscope,
  UsersRound
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/patient", label: "Patient", icon: ClipboardCheck },
  { href: "/doctor", label: "Doctor", icon: Stethoscope },
  { href: "/doctor/patients", label: "Patients", icon: UsersRound },
  { href: "/login", label: "Login", icon: LayoutDashboard }
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 px-2 pb-2 pt-1 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-medium text-muted-foreground transition-colors",
                active && "bg-secondary text-foreground"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
