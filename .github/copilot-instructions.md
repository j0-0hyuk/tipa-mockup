# Copilot Instructions

## Language

- If the user asks for Korean, respond in Korean.
- Keep responses concise and action-oriented unless the user asks for detailed explanations.

## Current Project Context

- This repository is currently migrating from `docs-front/ui` to `bichon/ds`.
- Prefer `bichon/ds` for new UI work.
- Avoid introducing new dependencies on `docs-front/ui` unless explicitly required for backward compatibility.
- When touching UI code, check whether migrated equivalents already exist in `bichon/ds` and use them first.

## Critical Risk Checks (Always Required)

- Always evaluate whether a change could be catastrophic in production before finalizing it.
- Explicitly check for risks such as:
  - authentication/authorization bypass,
  - payment or accounting inconsistencies,
  - data loss or corruption,
  - severe performance degradation,
  - service outage or deploy-time instability.
- If any of these risks are possible, call them out clearly and propose mitigations or safer alternatives.

## Data Exposure & Privacy Checks (Always Required)

- Always assess data exposure risks.
- Explicitly verify that one user cannot access, view, or infer another user's data.
- Validate access control boundaries for every read/write path changed.
- Treat logs, analytics payloads, error messages, and debug outputs as potential data-leak surfaces.

## Additional Engineering Expectations

- Prefer small, reversible changes over large risky rewrites.
- Preserve backward compatibility unless a breaking change is explicitly requested.
- Add or update tests for security-sensitive and business-critical logic.
- Document assumptions and unknowns when requirements are ambiguous.
- Do not mix unrelated concerns in one change set.
- For migrations, include a clear rollback path and compatibility notes.
