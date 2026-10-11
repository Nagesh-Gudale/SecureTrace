import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  title,
  subtitle,
  action,
}: {
  children?: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("panel p-5", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="label-xs">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-sm tracking-tight", className)}>{children}</span>;
}

export function Field({ label, value, accent }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-surface-2/40 px-4 py-3">
      <div className="label-xs">{label}</div>
      <div
        className={cn(
          "mt-1.5 font-mono text-sm break-all",
          accent ? "text-accent" : "text-foreground",
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function StatusPill({
  children,
  tone = "primary",
  className,
}: {
  children: ReactNode;
  tone?: "primary" | "success" | "muted" | "violet" | "warning" | "danger";
  className?: string;
}) {
  const tones: Record<string, string> = {
    primary: "border-primary/40 text-primary bg-primary/10",
    success: "border-success/40 text-success bg-success/10",
    muted: "border-border text-muted-foreground bg-muted/40",
    violet: "border-violet/40 text-violet bg-violet/10",
    warning: "border-warning/40 text-warning bg-warning/10",
    danger: "border-destructive/40 text-destructive bg-destructive/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wider uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="label-xs text-primary">{eyebrow}</div>}
        <h1 className="mt-1.5 font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

/** Runs a list of stage labels sequentially with a delay, returning progress. */
export function useSequence(steps: string[], intervalMs = 900) {
  const [active, setActive] = useState(-1);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const start = useCallback(
    (onDone?: () => void) => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setRunning(true);
      setActive(0);
      steps.forEach((_, i) => {
        timers.current.push(
          setTimeout(() => {
            setActive(i + 1);
            if (i === steps.length - 1) {
              setRunning(false);
              onDone?.();
            }
          }, intervalMs * (i + 1)),
        );
      });
    },
    [steps, intervalMs],
  );

  const reset = useCallback(() => {
    timers.current.forEach(clearTimeout);
    setActive(-1);
    setRunning(false);
  }, []);

  return { active, running, start, reset, done: active >= steps.length };
}

export function SequenceList({
  steps,
  active,
  className,
}: {
  steps: string[];
  active: number;
  className?: string;
}) {
  return (
    <ol className={cn("space-y-2", className)}>
      {steps.map((step, i) => {
        const state = active > i ? "done" : active === i ? "active" : "idle";
        return (
          <li
            key={step}
            className={cn(
              "flex items-center gap-3 rounded-md border px-4 py-3 transition-all duration-300",
              state === "done" && "border-success/35 bg-success/8",
              state === "active" && "border-primary/50 bg-primary/10 glow-ring",
              state === "idle" && "border-border bg-surface-2/25 opacity-45",
            )}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current/30 text-current">
              {state === "done" ? (
                <Check className="size-3.5 text-success" />
              ) : state === "active" ? (
                <Loader2 className="size-3.5 animate-spin text-primary" />
              ) : (
                <span className="font-mono text-[10px] text-muted-foreground">{i + 1}</span>
              )}
            </span>
            <span
              className={cn(
                "font-mono text-[13px] tracking-wide",
                state === "done" && "text-success",
                state === "active" && "text-primary",
                state === "idle" && "text-muted-foreground",
              )}
            >
              {step}
            </span>
            {state === "done" && (
              <span className="ml-auto font-mono text-[11px] text-success">OK</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
