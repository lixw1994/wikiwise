## Context

Archived OpenSpec main specs are the durable record for completed Electron migration phases. A subset still carries generated archive-time `Purpose` text, which makes the final native-parity audit less trustworthy even though the requirement bodies are meaningful.

## Goals / Non-Goals

**Goals:**
- Replace generated purpose placeholders with concrete, capability-specific purpose statements.
- Add a static guard that scans archived main specs for generated placeholder text.
- Keep the runtime audit verification command reliable when all scenarios pass by avoiding an immediate successful `app.exit(0)` teardown.
- Keep the release blocker honest: this change improves spec evidence only and does not claim signed/notarized release completion.

**Non-Goals:**
- No user-facing runtime behavior, SwiftUI behavior, Electron UI, packaging, signing, notarization, or release artifact production changes.
- No broad rewrite of existing requirements or archived verification content.

## Decisions

- Use a Node `node:test` guard because the Electron workspace already runs JavaScript tests and can scan repository text without new dependencies.
- Scan all `openspec/specs/**/*.md` files rather than only the currently known offenders so future archive regressions fail in CI/local verification.
- Keep purpose statements concise and capability-specific so they clarify scope without changing normative requirements.
- Let successful runtime audits exit through Electron's graceful quit path rather than `app.exit(0)` immediately after window teardown. The audit still sets `process.exitCode = 0`, while failures keep using the existing non-zero error path.

## Risks / Trade-offs

- Text-only cleanup can look cosmetic -> Mitigation: record it as roadmap evidence and add an executable guard that prevents recurrence.
- Overly broad placeholder matching could catch legitimate prose -> Mitigation: match the generated archive phrases (`TBD - created by archiving change` and `Update Purpose after archive`) rather than every use of `TBD`.
- Changing audit shutdown could mask failures -> Mitigation: only change the success path after `runElectronRuntimeAudit()` resolves; thrown failures still reach the existing catch and exit non-zero.
