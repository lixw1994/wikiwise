## Context

Electron release distribution already has a canonical production command and a no-artifact preflight. The remaining migration blocker is credential-dependent: this machine can prove whether Developer ID and notary prerequisites exist, but cannot complete the final signed/notarized release without those credentials. The current preflight prints the first blocker to stderr; that is useful for humans but weak retained evidence.

## Goals / Non-Goals

**Goals:**

- Add a structured report path for Electron release preflight evidence.
- Keep the production release command and its signing/notarization gates unchanged.
- Make blocked and passing preflight states explicit in report data and documentation.
- Keep generated readiness evidence out of source control.

**Non-Goals:**

- Do not bypass Developer ID, notarization, stapling, or Gatekeeper assessment.
- Do not run the full signed/notarized release locally without credentials.
- Do not change SwiftUI macOS release behavior.

## Decisions

- Add a `--preflight-report <path>` flag to `scripts/build-release.sh`.
  This keeps release readiness under the existing canonical release script instead of introducing a parallel release implementation. Alternative considered: a new Node wrapper, but that would duplicate prerequisite knowledge and make the release gate harder to audit.
- Record all preflight checks before deciding pass/fail.
  The report should list every checked prerequisite and every blocker instead of stopping at the first missing item. Human stderr can still be concise, but retained evidence should be complete enough for migration review.
- Expose `npm run electron:release:readiness` as the convenience command.
  It delegates to `bash scripts/build-release.sh --preflight --preflight-report apps/electron/out/release-readiness/report.json`, preserving the direct shell command for production release.

## Risks / Trade-offs

- [Risk] A report could be mistaken for a completed release artifact. -> Mitigation: report fields and documentation explicitly state that no signed/notarized release was produced and that final completion still requires the full release command or an accepted OpenSpec deviation.
- [Risk] Shell JSON generation can be brittle. -> Mitigation: keep JSON values simple, escape generated strings, and test the script contract plus produced report shape via shell smoke tests.
- [Risk] Preflight now evaluates more checks before exiting. -> Mitigation: checks remain lightweight and still happen before runtime audit, packaging, signing, DMG creation, notarization submission, stapling, or assessment.
