SecureTrace

Post-Quantum Document Forensics & Immutable Decryption Provenance

SecureTrace is a cybersecurity system for secure multi-recipient
document distribution, recipient-level leak attribution, and
tamper-evident decryption auditing.

SIH 2026 --- PS ID 26237
Team: Aqua Vision2
Theme: Blockchain & Cybersecurity

Problem

Traditional encrypted document distribution protects confidentiality,
but when multiple authorized recipients receive the same plaintext, a
leaked copy can be difficult to attribute to a specific recipient.
Conventional logs may also be vulnerable to alteration, while classical
public-key cryptography faces long-term quantum-computing risks.

SecureTrace addresses this by creating a unique forensic identity for
each authorized decryption session and recording cryptographically
verifiable evidence of that event.

Solution

Original Document
       |
       v
AES-256 Encryption
       |
       v
ML-KEM Protected Key Distribution
       |
       v
Authorized Recipient Decrypts
       |
       v
Generate Session Fingerprint
       |
       v
Embed Invisible Recipient-Specific Watermark
       |
       v
Sign Decryption Event with ML-DSA
       |
       v
Commit Evidence to Offline Permissioned DLT
       |
       v
Recipient Receives Marked Document
       |
      LEAK
       |
       v
Extract Watermark
       |
       v
Match Fingerprint + Verify Signature + Check Ledger
       |
       v
Forensic Attribution

Key Features

AES-256 encryption for document confidentiality.

ML-KEM for post-quantum key encapsulation.

Invisible session fingerprinting for recipient-level forensic
attribution.

ML-DSA signatures for authenticating decryption-event evidence.

Offline permissioned DLT for tamper-evident audit records.

Forensic verification through watermark extraction, fingerprint
matching, signature verification, and document/hash consistency
checks.

System Architecture

                    +---------------------+
                    |   Original Document |
                    +----------+----------+
                               |
                         AES-256 Encrypt
                               |
                               v
                    +---------------------+
                    | Encrypted Document  |
                    +----------+----------+
                               |
                         ML-KEM Key Layer
                               |
                               v
                    +---------------------+
                    | Authorized Recipient|
                    +----------+----------+
                               |
                            Decrypt
                               |
                               v
                    +---------------------+
                    | Session Fingerprint |
                    +----------+----------+
                               |
                     Invisible Watermark
                               |
                               v
                    +---------------------+
                    |  Marked Document    |
                    +----------+----------+
                               |
                         ML-DSA Signature
                               |
                               v
                    +---------------------+
                    | Decryption Evidence |
                    +----------+----------+
                               |
                               v
                    +---------------------+
                    | Offline Permissioned|
                    |        DLT          |
                    +---------------------+

Forensic Verification

Leaked Document
      |
      v
Watermark Extraction
      |
      v
Fingerprint Identification
      |
      v
Ledger Lookup
      |
      +-- Document Hash Check
      +-- Signature Verification
      +-- Session Verification
      +-- Evidence Consistency
      |
      v
Associated Decryption Event

The system is designed to provide cryptographic evidence linking a
recovered document to a recorded decryption event, subject to successful
watermark extraction, ledger availability, and signature verification.

Technology Stack

Layer                 Technology

Frontend              React.js, HTML5, CSS3
Backend               Python, FastAPI
Document Encryption   AES-256
Key Encapsulation     ML-KEM
Digital Signature     ML-DSA
PQC Library           liboqs / compatible PQC implementation
Watermarking          DCT / DWT-based invisible watermarking
Distributed Ledger    Hyperledger Fabric / local permissioned DLT
Database              PostgreSQL
APIs                  REST
Deployment            Offline / Air-gapped environment

Security Design

+---------------------------------------------+
|                  SECURETRACE                |
+---------------------------------------------+
| Document Confidentiality                    |
|        +-- AES-256                           |
+---------------------------------------------+
| Post-Quantum Key Establishment              |
|        +-- ML-KEM                            |
+---------------------------------------------+
| Recipient-Level Forensic Identity           |
|        +-- Invisible Watermark              |
+---------------------------------------------+
| Cryptographic Event Authentication          |
|        +-- ML-DSA                            |
+---------------------------------------------+
| Tamper-Evident Audit Trail                  |
|        +-- Permissioned DLT                 |
+---------------------------------------------+

Ledger Evidence

The ledger stores evidence rather than the sensitive document itself.

Example:

{
  "document_hash": "SHA256(...)",
  "fingerprint_id": "FP-8A72...",
  "recipient_id": "RECIPIENT-042",
  "event_type": "DECRYPTION",
  "timestamp": "2026-09-30T10:30:00Z",
  "signature": "ML-DSA-SIGNATURE(...)"
}

Threat Model

Threat                              Mitigation

Unauthorized document access        AES-256 encryption

Compromise of classical key         ML-KEM
exchange

Forged decryption evidence          ML-DSA signature

Modification of audit records       Permissioned DLT

Recipient-specific attribution      Session fingerprinting
failure

Document modification after         Hash/integrity verification
watermarking

Internet/cloud dependency           Offline deployment

Prototype Workflow

Secure Distribution --- encrypt the document using AES-256.

Recipient Authorization --- provide authorized cryptographic
material.

Decryption --- recipient decrypts the document.

Fingerprint Generation --- generate a unique session
fingerprint.

Watermark Embedding --- invisibly embed the fingerprint.

Evidence Signing --- sign the canonical decryption event with
ML-DSA.

Ledger Commitment --- commit the relevant evidence to the
offline permissioned ledger.

Leak Investigation --- extract and verify the forensic
fingerprint from a recovered document.

Research Foundation

The project is informed by research in:

Robust document/image watermarking

Digital fingerprinting

Traitor tracing

Permissioned blockchain audit logging

Post-quantum cryptography

Content provenance and digital forensics

Project Structure

SecureTrace/
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
├── backend/
│   ├── api/
│   ├── crypto/
│   ├── watermark/
│   ├── forensic/
│   └── ledger/
├── blockchain/
│   ├── chaincode/
│   ├── network/
│   └── configuration/
├── tests/
├── docs/
├── requirements.txt
├── package.json
└── README.md

Expected Outputs

Encrypted document

Recipient-specific marked document

Unique session fingerprint

Signed decryption event

Tamper-evident ledger record

Forensic verification result

Recipient/session attribution evidence

Limitations

The strength of forensic attribution depends on the watermark surviving
transformations applied to a leaked document. Evaluation should
therefore include compression, resizing, cropping, screenshots,
printing/scanning, PDF transformations, and image conversion.

Attribution should be considered successful only when the extracted
fingerprint and associated cryptographic evidence pass the defined
verification checks.

Future Scope

Stronger watermark robustness against print-scan attacks

Multi-format document support

Advanced collusion-resistant fingerprinting

Hardware-backed recipient keys

Privacy-preserving recipient identifiers

Automated forensic investigation

Multi-organization permissioned DLT deployment

Formal security analysis and benchmark evaluation

Team

Aqua Vision2

Smart India Hackathon 2026
Problem Statement: PS ID 26237
Project: SecureTrace

References

NIST FIPS 203 --- ML-KEM: https://csrc.nist.gov/pubs/fips/203/final

NIST FIPS 204 --- ML-DSA: https://csrc.nist.gov/pubs/fips/204/final

NIST FIPS 205 --- SLH-DSA: https://csrc.nist.gov/pubs/fips/205/final

NIST Post-Quantum Cryptography:
https://csrc.nist.gov/projects/post-quantum-cryptography

Hyperledger Fabric: https://hyperledger-fabric.readthedocs.io/

C2PA Specifications: https://spec.c2pa.org/specifications/

Robust PDF Watermarking: https://www.mdpi.com/1424-8220/23/17/7365

Boneh & Shaw Fingerprinting:
https://www.cs.princeton.edu/research/techreps/168
