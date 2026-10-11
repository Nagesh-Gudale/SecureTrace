import { Link, useRouterState } from "@tanstack/react-router";
import {
  Boxes,
  Fingerprint,
  KeyRound,
  LayoutDashboard,
  RadioTower,
  Search,
  ShieldCheck,
  Send,
  Unlock,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, group: "Operations" },
  { to: "/distribution", label: "Secure Distribution", icon: Send, group: "Operations" },
  { to: "/decryption", label: "Recipient Decryption", icon: Unlock, group: "Operations" },
  { to: "/investigation", label: "Leak Investigation", icon: Search, group: "Forensics" },
  { to: "/attribution", label: "Attribution Result", icon: ShieldCheck, group: "Forensics" },
  { to: "/ledger", label: "Immutable Ledger", icon: Boxes, group: "Infrastructure" },
  { to: "/identity", label: "PQC Identity", icon: KeyRound, group: "Infrastructure" },
] as const;

const GROUPS = ["Operations", "Forensics", "Infrastructure"] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl lg:flex">
        <div className="px-5 py-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md border border-primary/40 bg-primary/12">
              <Fingerprint className="size-4.5 text-primary" />
            </span>
            <div>
              <div className="font-display text-sm font-semibold tracking-[0.18em]">
                SECURE TRACE
              </div>
              <div className="font-mono text-[9px] leading-tight tracking-[0.12em] text-muted-foreground">
                POST-QUANTUM FORENSIC
                <br />
                DOCUMENT ATTRIBUTION
              </div>
            </div>
          </div>
        </div>
        <div className="hairline mx-5" />
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {GROUPS.map((group) => (
            <div key={group} className="mb-5">
              <div className="label-xs px-3 pb-2">{group}</div>
              <ul className="space-y-0.5">
                {NAV.filter((n) => n.group === group).map((item) => {
                  const active = pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors",
                          active
                            ? "border border-primary/35 bg-primary/12 text-primary"
                            : "border border-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                        )}
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <RadioTower className="size-3.5 text-muted-foreground" />
            OFFLINE PROTOTYPE · SIMULATED PQC
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-6 py-3.5">
            <div className="lg:hidden font-display text-sm font-semibold tracking-[0.18em]">
              SECURE TRACE
            </div>
            <nav className="hidden items-center gap-1 lg:flex">
              <span className="label-xs">Node</span>
              <span className="font-mono text-xs text-foreground">ST-NODE-01</span>
              <span className="mx-3 h-4 w-px bg-border" />
              <span className="label-xs">Clearance</span>
              <span className="font-mono text-xs text-accent">TOP SECRET</span>
            </nav>
            <div className="ml-auto flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-success">
                <span className="live-dot size-1.5 rounded-full bg-success" />
                AIR-GAPPED
              </span>
              <span className="hidden font-mono text-[11px] text-muted-foreground md:inline">
                2026-09-30 · 09:14 IST
              </span>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 font-mono text-[11px]",
                  pathname === item.to
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 px-6 py-7">
          <div className="mx-auto max-w-[1520px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
