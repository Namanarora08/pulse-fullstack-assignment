"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LogIn, Stethoscope, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/patient", label: "Patient", icon: UserRound },
  { href: "/doctor", label: "Doctor", icon: Stethoscope }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>Pulse</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  active && "bg-secondary text-foreground"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex"
        >
          <Link href="/login">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Login
          </Link>
        </Button>
      </div>
    </header>
  );
}
