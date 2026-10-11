export type Recipient = {
  id: string;
  name: string;
  employeeId: string;
  unit: string;
  clearance: "SECRET" | "TOP SECRET" | "CONFIDENTIAL";
  keyFingerprint: string;
  algorithm: "ML-DSA-65";
  kem: "ML-KEM-768";
  enrolled: string;
};

export type DocumentRecord = {
  id: string;
  name: string;
  classification: "SECRET" | "TOP SECRET" | "CONFIDENTIAL";
  sizeKb: number;
  pages: number;
  hash: string;
  createdAt: string;
};

export type LedgerBlock = {
  height: number;
  timestamp: string;
  prevHash: string;
  hash: string;
  recipientName: string;
  employeeId: string;
  documentName: string;
  documentHash: string;
  watermark: string;
  session: string;
  signature: "ML-DSA-65";
  signatureStatus: "VALID";
  quorum: string;
};

export const RECIPIENTS: Recipient[] = [
  {
    id: "r1",
    name: "Rahul Sharma",
    employeeId: "EMP-1024",
    unit: "Strategic Analysis Cell",
    clearance: "TOP SECRET",
    keyFingerprint: "9F82:71AC:442E:BD17:5C30:88A1",
    algorithm: "ML-DSA-65",
    kem: "ML-KEM-768",
    enrolled: "2026-02-11",
  },
  {
    id: "r2",
    name: "Priya Mehta",
    employeeId: "EMP-1048",
    unit: "Signals Directorate",
    clearance: "TOP SECRET",
    keyFingerprint: "2C44:9911:70FB:AE02:3D71:6644",
    algorithm: "ML-DSA-65",
    kem: "ML-KEM-768",
    enrolled: "2026-03-04",
  },
  {
    id: "r3",
    name: "Arjun Patil",
    employeeId: "EMP-1092",
    unit: "Maritime Survey Group",
    clearance: "SECRET",
    keyFingerprint: "B107:5FD3:2210:9C4A:EE68:1B90",
    algorithm: "ML-DSA-65",
    kem: "ML-KEM-768",
    enrolled: "2026-04-19",
  },
  {
    id: "r4",
    name: "Sneha Kulkarni",
    employeeId: "EMP-1127",
    unit: "Counter-Intelligence Desk",
    clearance: "CONFIDENTIAL",
    keyFingerprint: "44A0:C321:7E5B:1902:AD77:3FC6",
    algorithm: "ML-DSA-65",
    kem: "ML-KEM-768",
    enrolled: "2026-05-27",
  },
];

export const DOCUMENTS: DocumentRecord[] = [
  {
    id: "d1",
    name: "Operation_Blueprint.pdf",
    classification: "TOP SECRET",
    sizeKb: 1842,
    pages: 12,
    hash: "a7f3c91d54be8802e17f6ac4419bd730f8821ce4409ab7712de55f0391cc84b2",
    createdAt: "2026-09-28 09:14",
  },
  {
    id: "d2",
    name: "Strategic_Intelligence.pdf",
    classification: "SECRET",
    sizeKb: 964,
    pages: 7,
    hash: "3be91c0f7724aa18d550ce8831bb77410fac29de6180b4437cc1e0925fa8117d",
    createdAt: "2026-09-24 16:40",
  },
  {
    id: "d3",
    name: "Marine_Survey_Report.pdf",
    classification: "CONFIDENTIAL",
    sizeKb: 2310,
    pages: 21,
    hash: "c11d70b8ea4f9327ab6518ff4420dd91b7e3c0a8451fd662709aa8134cbe5570",
    createdAt: "2026-09-19 11:02",
  },
];

export const TARGET_SESSION = "ST-2026-09-30-8F21A7";
export const TARGET_WATERMARK = "WTM-9F82-71AC-442E";
export const TARGET_WATERMARK_SHORT = "WTM-9F82-442E";
export const TARGET_BLOCK = 1842;

const hash = (seed: string) =>
  Array.from({ length: 64 }, (_, i) => {
    const code = seed.charCodeAt(i % seed.length) + i * 31;
    return "0123456789abcdef"[code % 16];
  }).join("");

const base: Array<{
  height: number;
  timestamp: string;
  recipient: Recipient;
  doc: DocumentRecord;
  watermark: string;
  session: string;
}> = [
  { height: 1833, timestamp: "2026-09-24 10:12:44", recipient: RECIPIENTS[1], doc: DOCUMENTS[1], watermark: "WTM-2C44-9911-70FB", session: "ST-2026-09-24-4A18C2" },
  { height: 1834, timestamp: "2026-09-25 08:31:07", recipient: RECIPIENTS[2], doc: DOCUMENTS[2], watermark: "WTM-B107-5FD3-2210", session: "ST-2026-09-25-77D0E9" },
  { height: 1835, timestamp: "2026-09-26 14:05:52", recipient: RECIPIENTS[3], doc: DOCUMENTS[1], watermark: "WTM-44A0-C321-7E5B", session: "ST-2026-09-26-1BC934" },
  { height: 1836, timestamp: "2026-09-27 09:48:19", recipient: RECIPIENTS[0], doc: DOCUMENTS[2], watermark: "WTM-9F82-1180-63CD", session: "ST-2026-09-27-9E42F1" },
  { height: 1837, timestamp: "2026-09-27 17:22:03", recipient: RECIPIENTS[1], doc: DOCUMENTS[2], watermark: "WTM-2C44-8802-15AE", session: "ST-2026-09-27-B7710D" },
  { height: 1838, timestamp: "2026-09-28 10:04:37", recipient: RECIPIENTS[2], doc: DOCUMENTS[0], watermark: "WTM-B107-4410-92FA", session: "ST-2026-09-28-C10A55" },
  { height: 1839, timestamp: "2026-09-29 08:19:26", recipient: RECIPIENTS[3], doc: DOCUMENTS[2], watermark: "WTM-44A0-7E5B-0C31", session: "ST-2026-09-29-2FD877" },
  { height: 1840, timestamp: "2026-09-29 15:41:58", recipient: RECIPIENTS[1], doc: DOCUMENTS[0], watermark: "WTM-2C44-9911-A07E", session: "ST-2026-09-29-58BB12" },
  { height: 1841, timestamp: "2026-09-30 07:56:11", recipient: RECIPIENTS[2], doc: DOCUMENTS[0], watermark: "WTM-B107-2210-DD48", session: "ST-2026-09-30-3C9047" },
  { height: TARGET_BLOCK, timestamp: "2026-09-30 09:12:48", recipient: RECIPIENTS[0], doc: DOCUMENTS[0], watermark: TARGET_WATERMARK, session: TARGET_SESSION },
];

export const LEDGER: LedgerBlock[] = base.map((b, i) => ({
  height: b.height,
  timestamp: b.timestamp,
  prevHash: i === 0 ? hash("genesis") : hash(`blk-${base[i - 1].height}`),
  hash: hash(`blk-${b.height}`),
  recipientName: b.recipient.name,
  employeeId: b.recipient.employeeId,
  documentName: b.doc.name,
  documentHash: b.doc.hash,
  watermark: b.watermark,
  session: b.session,
  signature: "ML-DSA-65",
  signatureStatus: "VALID",
  quorum: "4/5",
}));

export const SECURITY_STATUS = [
  { label: "Air-Gapped Environment", value: "ACTIVE", tone: "success" as const },
  { label: "Post-Quantum Crypto", value: "ACTIVE", tone: "success" as const },
  { label: "Watermark Engine", value: "ACTIVE", tone: "success" as const },
  { label: "Immutable Ledger", value: "HEALTHY", tone: "success" as const },
  { label: "External Network", value: "DISCONNECTED", tone: "muted" as const },
];

export const ARCHITECTURE_FLOW = [
  "Sender",
  "Encrypted Document",
  "Recipient Decryption",
  "Unique Forensic Watermark",
  "PQC Signature",
  "Offline Immutable Ledger",
  "Document Leak",
  "Watermark Extraction",
  "Ledger Verification",
  "Recipient Attribution",
];
