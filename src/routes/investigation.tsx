import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AlertTriangle, ArrowRight, FileSearch, ScanLine, Upload } from "lucide-react";

import {
  Panel,
  PageHeader,
  SequenceList,
  StatusPill,
  useSequence,
} from "@/components/secure-trace/primitives";
import { LEDGER, TARGET_WATERMARK, TARGET_WATERMARK_SHORT } from "@/lib/secure-trace-data";
import { useSecureTrace } from "@/lib/secure-trace-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/investigation")({
  head: () => ({
    meta: [
      { title: "Leak Investigation — Secure Trace" },
      {
        name: "description",
        content:
          "Upload a leaked document, extract its invisible forensic watermark and match it against the immutable offline ledger.",
      },
      { property: "og:title", content: "Leak Investigation — Secure Trace" },
      {
        property: "og:description",
        content: "Trace a leaked document to its originating decryption event.",
      },
    ],
  }),
  component: Investigation,
});

const STEPS = [
  "File analyzed",
  "Watermark detected",
  "Watermark reconstructed",
  "Integrity verified",
  "Ledger lookup initiated",
];

function Investigation() {
  const navigate = useNavigate();
  const { completeInvestigation } = useSecureTrace();
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { active, running, start, reset } = useSequence(STEPS, 800);
  const detected = active >= STEPS.length;

  const analyze = (name: string) => {
    setFileName(name);
    reset();
    setTimeout(() => start(() => completeInvestigation()), 60);
  };

  return (
    <>
      <PageHeader
        eyebrow="Forensics"
        title="LEAK INVESTIGATION"
        subtitle="Trace a leaked document to its originating decryption event."
        right={<StatusPill tone="warning">ACTIVE CASE · CASE-2026-0041</StatusPill>}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Panel className={cn("p-6", running && "scan-line")}>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              analyze(e.dataTransfer.files[0]?.name ?? "Leaked_Copy.pdf");
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "grid-bg flex min-h-[340px] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed px-6 py-12 text-center transition-all",
              dragging
                ? "border-primary bg-primary/10"
                : "border-border-strong bg-surface-2/20 hover:border-primary/50",
            )}
          >
            <span className="flex size-16 items-center justify-center rounded-full border border-primary/40 bg-primary/12">
              <Upload className="size-7 text-primary" />
            </span>
            <div>
              <div className="font-display text-xl font-semibold tracking-tight">
                Drop the leaked document here
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Any recovered copy — scan, export or re-print — carries the embedded forensic layer.
              </p>
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                OR CLICK TO SELECT · ANALYSIS RUNS ENTIRELY OFFLINE
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => analyze(e.target.files?.[0]?.name ?? "Leaked_Copy.pdf")}
            />
          </div>

          <button
            onClick={() => analyze("Operation_Blueprint_LEAKED.pdf")}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <FileSearch className="size-3.5" />
            USE DEMO LEAKED FILE
          </button>

          {fileName && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface-2/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-warning" />
                <span className="font-mono text-xs">{fileName}</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                RECOVERED FROM: EXTERNAL MESSAGING CHANNEL · 2026-09-30 08:51
              </span>
            </div>
          )}
        </Panel>

        <div className="space-y-5">
          <Panel title="Extraction Pipeline">
            {fileName ? (
              <SequenceList steps={STEPS} active={active} />
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Awaiting a recovered document.
              </p>
            )}
          </Panel>

          {detected && (
            <Panel className="rise-in glow-ring border-primary/40" title="Extraction Result">
              <div className="flex items-center gap-2 text-primary">
                <ScanLine className="size-4" />
                <span className="font-display text-lg font-semibold tracking-tight">
                  WATERMARK DETECTED
                </span>
              </div>
              <div className="mt-3 rounded-md border border-accent/35 bg-accent/8 px-4 py-4 text-center">
                <div className="font-mono text-2xl tracking-[0.12em] text-accent">
                  {TARGET_WATERMARK_SHORT}
                </div>
                <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                  RECONSTRUCTED FULL CODE · {TARGET_WATERMARK}
                </div>
              </div>
              <dl className="mt-3 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Extraction confidence</dt>
                  <dd className="text-success">99.4%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Payload integrity</dt>
                  <dd className="text-success">INTACT</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Candidate ledger records</dt>
                  <dd>{LEDGER.length}</dd>
                </div>
              </dl>
              <button
                onClick={() => navigate({ to: "/attribution" })}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/50 bg-primary/15 px-4 py-3 font-mono text-xs tracking-[0.16em] text-primary transition-colors hover:bg-primary/25"
              >
                MATCH AGAINST IMMUTABLE LEDGER <ArrowRight className="size-3.5" />
              </button>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
