import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Eye, FileText, Fingerprint, Unlock, UserCheck } from "lucide-react";

import {
  Field,
  Panel,
  PageHeader,
  SequenceList,
  StatusPill,
  useSequence,
} from "@/components/secure-trace/primitives";
import { DOCUMENTS, RECIPIENTS } from "@/lib/secure-trace-data";
import { useSecureTrace } from "@/lib/secure-trace-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/decryption")({
  head: () => ({
    meta: [
      { title: "Recipient Decryption — Secure Trace" },
      {
        name: "description",
        content:
          "A recipient decrypts their package: identity verification, unique forensic watermark, post-quantum signature and ledger commit.",
      },
      { property: "og:title", content: "Recipient Decryption — Secure Trace" },
      {
        property: "og:description",
        content: "Visually identical, forensically distinct decrypted copies.",
      },
    ],
  }),
  component: Decryption,
});

const STEPS = [
  "IDENTITY VERIFIED",
  "DECRYPTION SESSION CREATED",
  "FORENSIC WATERMARK GENERATED",
  "PQC SIGNATURE GENERATED",
  "LEDGER RECORD COMMITTED",
];

function Decryption() {
  const { decryption, completeDecryption } = useSecureTrace();
  const { active, running, start, reset } = useSequence(STEPS, 850);
  const [forensicLayer, setForensicLayer] = useState(false);
  const recipient = RECIPIENTS[0];
  const doc = DOCUMENTS[0];
  const done = active >= STEPS.length && !!decryption;

  const run = () => {
    if (running) return;
    reset();
    setTimeout(() => start(() => completeDecryption()), 40);
  };

  return (
    <>
      <PageHeader
        eyebrow="Recipient Workstation"
        title="Recipient Decryption"
        subtitle="The decryption event itself creates the forensic identity of the copy."
        right={
          <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2/40 px-3 py-2">
            <UserCheck className="size-4 text-accent" />
            <div>
              <div className="text-[13px] leading-tight">{recipient.name}</div>
              <div className="font-mono text-[10px] text-muted-foreground">
                {recipient.employeeId} · {recipient.clearance}
              </div>
            </div>
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[400px_1fr]">
        <div className="space-y-5">
          <Panel title="Encrypted Package">
            <div className="rounded-md border border-border bg-surface-2/40 px-4 py-4">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <span className="font-mono text-sm">{doc.name}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px] text-muted-foreground">
                <span>PKG-OPE-1041</span>
                <span className="text-right">{doc.sizeKb} KB</span>
                <span>ML-KEM-768</span>
                <span className="text-right text-destructive">{doc.classification}</span>
              </div>
            </div>
            <button
              onClick={run}
              disabled={running}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-accent/50 bg-accent/15 px-4 py-3 font-mono text-xs tracking-[0.16em] text-accent transition-all hover:bg-accent/25 disabled:opacity-50"
            >
              <Unlock className="size-4" />
              {running ? "DECRYPTING…" : "DECRYPT DOCUMENT"}
            </button>
          </Panel>

          <Panel title="Decryption Sequence">
            <SequenceList steps={STEPS} active={active} />
          </Panel>
        </div>

        <div className="space-y-5">
          {done && decryption && (
            <>
              <Panel title="Session Artifacts" className="rise-in">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Decryption Session" value={decryption.session} accent />
                  <Field label="Forensic Watermark" value={decryption.watermark} accent />
                  <Field label="PQC Signature" value={`${decryption.signature} — VALID`} />
                  <Field label="Ledger Record" value={`BLOCK #${decryption.block}`} />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-success/35 bg-success/8 px-4 py-3">
                  <Fingerprint className="size-5 text-success" />
                  <div className="font-display text-lg font-semibold tracking-tight">
                    <span className="text-foreground">VISUALLY IDENTICAL</span>
                    <span className="mx-2 text-border-strong">/</span>
                    <span className="text-success">FORENSICALLY DISTINCT</span>
                  </div>
                </div>
              </Panel>

              <Panel
                title="Decrypted Document Preview"
                subtitle="The embedded watermark is imperceptible to the reader."
                className="rise-in"
                action={
                  <button
                    onClick={() => setForensicLayer((v) => !v)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] transition-colors",
                      forensicLayer
                        ? "border-violet/50 bg-violet/12 text-violet"
                        : "border-border text-muted-foreground hover:border-border-strong",
                    )}
                  >
                    <Eye className="size-3" />
                    FORENSIC LAYER {forensicLayer ? "ON" : "OFF"}
                  </button>
                }
              >
                <DocumentPreview watermark={decryption.watermark} showLayer={forensicLayer} />
                <Link
                  to="/investigation"
                  className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-primary hover:underline"
                >
                  A COPY HAS LEAKED · OPEN INVESTIGATION <ArrowRight className="size-3.5" />
                </Link>
              </Panel>
            </>
          )}

          {!done && (
            <Panel className="flex min-h-[420px] items-center justify-center text-center">
              <div>
                <Unlock className="mx-auto size-8 text-border-strong" />
                <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                  Decrypt the package to generate this recipient&apos;s unique forensic watermark,
                  post-quantum signature and immutable ledger record.
                </p>
              </div>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}

function DocumentPreview({ watermark, showLayer }: { watermark: string; showLayer: boolean }) {
  return (
    <div className="relative mx-auto max-w-[760px] overflow-hidden rounded-md border border-border bg-[oklch(0.96_0.005_250)] p-10 text-[oklch(0.25_0.02_258)] shadow-2xl">
      <div className="flex items-start justify-between border-b border-[oklch(0.82_0.01_250)] pb-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-[oklch(0.5_0.02_258)]">
            CLASSIFIED — TOP SECRET
          </div>
          <div className="mt-1 font-display text-xl font-semibold">Operation Blueprint</div>
        </div>
        <div className="text-right font-mono text-[10px] text-[oklch(0.5_0.02_258)]">
          REF OPS/BP/2026/114
          <br />
          PAGE 1 OF 12
        </div>
      </div>

      <div className="mt-5 space-y-3 text-[13px] leading-relaxed">
        <p className="font-semibold">1. Intent</p>
        <p>
          This blueprint consolidates the phased deployment plan for the coastal surveillance
          modernisation programme, including sensor placement, data relay corridors and quorum-based
          custody of survey artefacts within the air-gapped enclave.
        </p>
        <p className="font-semibold">2. Distribution Control</p>
        <p>
          Each authorised recipient receives an individually sealed package. Reproduction, screen
          capture or onward transmission outside the enclave is prohibited and independently
          attributable.
        </p>
        <p className="font-semibold">3. Phased Timeline</p>
        <p>
          Phase I establishes the coastal baseline survey. Phase II integrates relay hardening and
          redundant custody nodes. Phase III validates end-to-end attribution under simulated
          adversarial exfiltration.
        </p>
      </div>

      {showLayer && (
        <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
          <div className="grid h-full w-full grid-cols-3 place-items-center opacity-[0.18]">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className="rotate-[-28deg] font-mono text-[11px] tracking-widest text-[oklch(0.45_0.18_295)]"
              >
                {watermark}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Imperceptible embedded forensic layer (always present, effectively invisible) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid grid-cols-3 place-items-center opacity-[0.012] select-none"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="rotate-[-28deg] font-mono text-[11px]">
            {watermark}
          </span>
        ))}
      </div>
    </div>
  );
}
