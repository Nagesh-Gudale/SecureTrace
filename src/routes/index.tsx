import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileLock2,
  Unlock,
  Users,
  Search,
  ShieldCheck,
} from "lucide-react";

import { Panel, PageHeader, StatusPill } from "@/components/secure-trace/primitives";
import {
  ARCHITECTURE_FLOW,
  DOCUMENTS,
  LEDGER,
  RECIPIENTS,
  SECURITY_STATUS,
} from "@/lib/secure-trace-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Command Dashboard — Secure Trace" },
      {
        name: "description",
        content:
          "Air-gapped overview of protected documents, authorized recipients, decryption events and ledger health.",
      },
      { property: "og:title", content: "Command Dashboard — Secure Trace" },
      {
        property: "og:description",
        content: "Protected documents, decryption events and immutable ledger health at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { label: "Protected Documents", value: "3", meta: "1 TOP SECRET", icon: FileLock2, tone: "primary" as const },
  { label: "Authorized Recipients", value: "4", meta: "ML-DSA-65 enrolled", icon: Users, tone: "violet" as const },
  { label: "Decryption Events", value: "10", meta: "All ledger-committed", icon: Unlock, tone: "success" as const },
  { label: "Investigations", value: "1", meta: "1 attribution verified", icon: Search, tone: "warning" as const },
];

function Dashboard() {
  const recent = [...LEDGER].reverse().slice(0, 6);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Command Dashboard"
        subtitle="Secure document distribution with per-recipient forensic fingerprinting, post-quantum signatures and an offline immutable ledger."
        right={
          <Link
            to="/investigation"
            className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/12 px-4 py-2 font-mono text-xs tracking-[0.14em] text-primary transition-colors hover:bg-primary/20"
          >
            OPEN INVESTIGATION <ArrowRight className="size-3.5" />
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="panel panel-hover rise-in p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <span className="label-xs">{s.label}</span>
              <s.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-3 font-display text-4xl font-semibold tracking-tight">{s.value}</div>
            <div className="mt-2">
              <StatusPill tone={s.tone}>{s.meta}</StatusPill>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="Recent Decryption Events" subtitle="Each event produced a unique forensic watermark.">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Block", "Timestamp", "Recipient", "Document", "Watermark", "Signature"].map((h) => (
                    <th key={h} className="label-xs py-2 pr-4 text-left font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr
                    key={b.height}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/40"
                  >
                    <td className="py-3 pr-4 font-mono text-xs text-primary">#{b.height}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{b.timestamp}</td>
                    <td className="py-3 pr-4">
                      <div>{b.recipientName}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{b.employeeId}</div>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs">{b.documentName}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-accent">{b.watermark}</td>
                    <td className="py-3 pr-4">
                      <StatusPill tone="success">valid</StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="System Security Status">
            <ul className="space-y-2.5">
              {SECURITY_STATUS.map((s) => (
                <li key={s.label} className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-muted-foreground">{s.label}</span>
                  <span
                    className={
                      s.tone === "success"
                        ? "font-mono text-[11px] tracking-wider text-success"
                        : "font-mono text-[11px] tracking-wider text-muted-foreground"
                    }
                  >
                    {s.tone === "success" && <span className="mr-1.5">●</span>}
                    {s.value}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Protected Library">
            <ul className="space-y-2">
              {DOCUMENTS.map((d) => (
                <li key={d.id} className="rounded-md border border-border bg-surface-2/35 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs">{d.name}</span>
                    <StatusPill tone={d.classification === "TOP SECRET" ? "danger" : "muted"}>
                      {d.classification}
                    </StatusPill>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                    SHA-256 {d.hash.slice(0, 24)}…
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Authorized Recipients">
            <ul className="space-y-1.5">
              {RECIPIENTS.map((r) => (
                <li key={r.id} className="flex items-center justify-between text-[13px]">
                  <span>{r.name}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{r.employeeId}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Panel title="Attribution Architecture" className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          {ARCHITECTURE_FLOW.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className={
                  i === ARCHITECTURE_FLOW.length - 1
                    ? "rounded-md border border-success/40 bg-success/10 px-3 py-1.5 font-mono text-[11px] tracking-wide text-success"
                    : "rounded-md border border-border bg-surface-2/40 px-3 py-1.5 font-mono text-[11px] tracking-wide text-muted-foreground"
                }
              >
                {step.toUpperCase()}
              </span>
              {i < ARCHITECTURE_FLOW.length - 1 && <ArrowRight className="size-3.5 text-border-strong" />}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          Prototype: ML-KEM-768 key establishment and ML-DSA-65 signatures are simulated for demonstration.
        </div>
      </Panel>
    </>
  );
}
