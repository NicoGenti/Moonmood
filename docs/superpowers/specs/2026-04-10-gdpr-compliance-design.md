# GDPR Compliance Design - Moonmood

Date: 2026-04-10
Status: Approved
Approach: Layered integration across existing phases

## Context

Moonmood targets Italian/EU users. v1 is local-only (no backend, no login), while v2 introduces backend, OAuth, cloud sync, AI features, and health diaries. GDPR impact is low in v1 and high in v2.

## Scope and Principles

- Keep v1 lightweight: transparency without over-engineering.
- Introduce full GDPR controls in Phase 7 when server-side processing starts.
- Add explicit, granular Art. 9 consent in Phase 8 for health-sensitive diaries.
- Track implementation through requirements IDs and roadmap mapping.

## New Requirements Overview

| ID | Phase | Summary |
|---|---|---|
| PRIV-01 | 5 | Local-only privacy information page |
| GDPR-01 | 7 | Privacy policy and cookie policy |
| GDPR-02 | 7 | Consent management service |
| GDPR-03 | 7 | Right to erasure (account deletion) |
| GDPR-04 | 7 | Data portability export |
| GDPR-05 | 7 | AI processor transparency + explicit consent |
| TOOL-01 | 7 | Script to sync requirements to GitHub Issues |
| GDPR-06 | 8 | Granular health consent per diary |

## Phase 5 Design

### PRIV-01 - Privacy Information Page (Local-Only)

Add a Privacy page in Settings that states:

- Controller identity (individual developer + contact email)
- What data exists locally (mood logs, notes, oracle IDs, favorites, settings)
- Where data is stored (IndexedDB/localStorage only)
- What is not collected (no analytics, no tracking cookies, no server collection)
- Data deletion option from Settings: "Cancella tutti i dati"

No consent gate is required in v1 because no personal data is transmitted to a backend.

## Phase 7 Design

### GDPR-01 - Privacy Policy and Cookie Policy

Before first sign-in, show and require acceptance of an Italian privacy policy compliant with GDPR Art. 13/14. Include controller identity, legal bases, data categories, retention, data subject rights, complaint route to Garante, and third-party processors.

### GDPR-02 - Consent Management Service

Introduce a consent store (`consents`) with versioned, timestamped grant/revoke records. Enforce purpose-based consent for AI and health categories, with revocation in Settings and auditability.

### GDPR-03 - Right to Erasure

Add "Elimina il mio account" flow in Settings that deletes server and local data, revokes tokens, and confirms completion.

### GDPR-04 - Data Portability

Add "Scarica i tuoi dati" export in machine-readable format (ZIP with JSON datasets and schema notes).

### GDPR-05 - AI Transparency

AI features must be blocked until explicit AI consent is granted. Disclose provider, data sent, and retention implications. Re-prompt consent if provider materially changes.

### TOOL-01 - Requirements to GitHub Issues Sync

Add script `scripts/sync-requirements-to-issues.ts` to parse `REQUIREMENTS.md` and create/update GitHub Issues by requirement ID, with labels by phase and domain.

## Phase 8 Design

### GDPR-06 - Granular Health Consent per Diary

Each health-sensitive feature gets independent explicit consent:

- `healthData:menstrual` for DIARY-MENS-01
- `healthData:therapeutic` for DIARY-THER-01
- `healthData:intestinal` for DIARY-INTE-01
- `healthData:voice` for WHISPER-01

If consent is denied, feature remains locked with clear explanation. If revoked, disable feature and offer data deletion for that category.

## Roadmap/Requirements Impact

- Add PRIV-01 to Phase 5 requirements.
- Add GDPR-01..05 and TOOL-01 to Phase 7 requirements.
- Add GDPR-06 to Phase 8 requirements.
- Extend Phase 7 success criteria with privacy policy acceptance, export, erasure, and AI-consent gating.
- Extend Phase 8 success criteria with per-diary explicit health consent.

## Notes for Planning

Recommended Phase 7 sequence:

1. GDPR-02 (consent service)
2. GDPR-01 (privacy/cookie policy)
3. AUTH-01 integration with policy gate
4. GDPR-04 export
5. GDPR-03 erasure
6. GDPR-05 AI consent gate
7. TOOL-01 GitHub Issues sync script
