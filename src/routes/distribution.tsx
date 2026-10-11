import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, FileLock2, Lock, Package, Upload } from "lucide-react";

import {
  Panel,
  PageHeader,
  SequenceList,
  StatusPill,
  useSequence,
} from "@/components/secure-trace/primitives";
import { DOCUMENTS, RECIPIENTS } from "@/lib/secure-trace-data";
import { useSecureTrace } from "@/lib/secure-trace-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/distribution")({
  head: () => ({
    meta: [
      { title: "Secure Distribution — Secure Trace" },
      {
        name: "description",
        content:
          "Encrypt a classified document and distribute per-recipient packages inside the air-gapped enclave.",
      },
      { property: "og:title", content: "Secure Distribution — Secure Trace" },
      {
        property: "og:description",
        content: "Hash, encrypt, verify recipients and distribute uniquely fingerprinted packages.",
      },
    ],
  }),
  component: Distribution,
});

const STEPS = ["Document Hash", "Encryption", "Recipient Verification", "Secure Distribution"];

function Distribution() {
  const { distributed, distribute } = useSecureTrace();
  const [docId, setDocId] = useState(DOCUMENTS[0].id);
  const [selected, setSelected] = useState<string[]>(["r1", "r2", "r3"]);
  const { active, running, start, reset } = useSequence(STEPS, 950);
  const doc = DOCUMENTS.find((d) => d.id === docId)!;
  const complete = distributed.length > 0 && active >= STEPS.length;

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const run = () => {
    if (running || selected.length === 0) return;
    reset();
    setTimeout(() => start(() => distribute(docId, selected)), 40);
  };

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Secure Distribution"
        subtitle="Every recipient receives a visually identical package that decrypts to a forensically distinct copy."
        right={<StatusPill tone="violet">ML-KEM-768 · SIMULATED</StatusPill>}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_380px]">
        <Panel title="1 · Document">
          <label className="grid-bg flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed border-border-strong bg-surface-2/25 px-4 py-8 text-center transition-colors hover:border-primary/50">
            <Upload className="size-5 text-primary" />
            <span className="text-sm">Drop a classified document</span>
            <span className="font-mono text-[11px] text-muted-foreground">
              PDF · DOCX · Max 50 MB · Stays inside the enclave
            </span>
            <input type="file" className="hidden" />
          </label>

          <div className="mt-4 space-y-2">
            {DOCUMENTS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDocId(d.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
                  docId === d.id
                    ? "border-primary/45 bg-primary/10"
                    : "border-border bg-surface-2/30 hover:border-border-strong",
                )}
              >
                <FileLock2
                  className={cn("size-4", docId === d.id ? "text-primary" : "text-muted-foreground")}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-xs">{d.name}</span>
                  <span className="block font-mono text-[10px] text-muted-foreground">
                    {d.pages} pages · {d.sizeKb} KB
                  </span>
                </span>
                <StatusPill tone={d.classification === "TOP SECRET" ? "danger" : "muted"}>
                  {d.classification}
                </StatusPill>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-border bg-surface-2/40 px-3 py-2.5">
            <div className="label-xs">Document SHA-256</div>
            <div className="mt-1 font-mono text-[11px] break-all text-accent">{doc.hash}</div>
          </div>
        </Panel>

        <Panel title="2 · Recipients" subtitle={`${selected.length} selected`}>
          <div className="space-y-2">
            {RECIPIENTS.map((r) => {
              const on = selected.includes(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => toggle(r.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border px-3 py-3 text-left transition-colors",
                    on
                      ? "border-accent/45 bg-accent/8"
                      : "border-border bg-surface-2/30 hover:border-border-strong",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded border",
                      on ? "border-accent bg-accent/20" : "border-border",
                    )}
                  >
                    {on && <Check className="size-3 text-accent" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px]">{r.name}</span>
                    <span className="block font-mono text-[10px] text-muted-foreground">
                      {r.employeeId} · {r.unit}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{r.clearance}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={run}
            disabled={running || selected.length === 0}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/50 bg-primary/15 px-4 py-3 font-mono text-xs tracking-[0.16em] text-primary transition-all hover:bg-primary/25 disabled:opacity-50"
          >
            <Lock className="size-4" />
            {running ? "DISTRIBUTING…" : "ENCRYPT & DISTRIBUTE"}
          </button>
        </Panel>

        <div className="space-y-5">
          <Panel title="3 · Distribution Pipeline">
            <SequenceList steps={STEPS} active={active} />
          </Panel>

          {complete && (
            <Panel className="rise-in glow-ring-success border-success/35" title="Result">
              <div className="flex items-center gap-2 text-success">
                <Package className="size-4" />
                <span className="font-display text-lg font-semibold">
                  {distributed.length} recipient packages created
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {distributed.map((p) => (
                  <li
                    key={p.packageId}
                    className="rounded-md border border-border bg-surface-2/40 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px]">{p.recipientName}</span>
                      <span className="font-mono text-[10px] text-accent">{p.packageId}</span>
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {p.employeeId} · {p.documentName} · {p.kem}
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                to="/decryption"
                className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-primary hover:underline"
              >
                CONTINUE TO RECIPIENT DECRYPTION <ArrowRight className="size-3.5" />
              </Link>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
