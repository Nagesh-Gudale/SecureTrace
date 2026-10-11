import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import {
  DOCUMENTS,
  LEDGER,
  RECIPIENTS,
  TARGET_BLOCK,
  TARGET_SESSION,
  TARGET_WATERMARK,
  type LedgerBlock,
} from "./secure-trace-data";

export type DistributionPackage = {
  recipientId: string;
  recipientName: string;
  employeeId: string;
  documentName: string;
  packageId: string;
  kem: "ML-KEM-768";
};

export type DecryptionResult = {
  session: string;
  watermark: string;
  signature: string;
  block: number;
  recipientName: string;
  employeeId: string;
  documentName: string;
  timestamp: string;
};

type State = {
  distributed: DistributionPackage[];
  decryption: DecryptionResult | null;
  investigationWatermark: string | null;
  attributionBlock: LedgerBlock | null;
  distribute: (documentId: string, recipientIds: string[]) => void;
  completeDecryption: () => DecryptionResult;
  completeInvestigation: () => void;
  reset: () => void;
};

const StoreContext = createContext<State | null>(null);

export function SecureTraceProvider({ children }: { children: ReactNode }) {
  const [distributed, setDistributed] = useState<DistributionPackage[]>([]);
  const [decryption, setDecryption] = useState<DecryptionResult | null>(null);
  const [investigationWatermark, setInvestigationWatermark] = useState<string | null>(null);
  const [attributionBlock, setAttributionBlock] = useState<LedgerBlock | null>(null);

  const value = useMemo<State>(
    () => ({
      distributed,
      decryption,
      investigationWatermark,
      attributionBlock,
      distribute: (documentId, recipientIds) => {
        const doc = DOCUMENTS.find((d) => d.id === documentId) ?? DOCUMENTS[0];
        setDistributed(
          recipientIds.map((rid, i) => {
            const r = RECIPIENTS.find((x) => x.id === rid) ?? RECIPIENTS[0];
            return {
              recipientId: r.id,
              recipientName: r.name,
              employeeId: r.employeeId,
              documentName: doc.name,
              packageId: `PKG-${doc.name.slice(0, 3).toUpperCase()}-${(1041 + i).toString()}`,
              kem: "ML-KEM-768" as const,
            };
          }),
        );
      },
      completeDecryption: () => {
        const result: DecryptionResult = {
          session: TARGET_SESSION,
          watermark: TARGET_WATERMARK,
          signature: "ML-DSA-65",
          block: TARGET_BLOCK,
          recipientName: RECIPIENTS[0].name,
          employeeId: RECIPIENTS[0].employeeId,
          documentName: DOCUMENTS[0].name,
          timestamp: "2026-09-30 09:12:48",
        };
        setDecryption(result);
        return result;
      },
      completeInvestigation: () => {
        setInvestigationWatermark(TARGET_WATERMARK);
        setAttributionBlock(LEDGER.find((b) => b.height === TARGET_BLOCK) ?? null);
      },
      reset: () => {
        setDistributed([]);
        setDecryption(null);
        setInvestigationWatermark(null);
        setAttributionBlock(null);
      },
    }),
    [distributed, decryption, investigationWatermark, attributionBlock],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useSecureTrace() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useSecureTrace must be used inside SecureTraceProvider");
  return ctx;
}
