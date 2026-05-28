## Context

The full Electron release script now produces multiple evidence files: `apps/electron/out/runtime-audit/report.json`, runtime screenshots, `apps/electron/out/packaged-runtime-audit/report.json`, and `apps/electron/out/release/report.json`. The GitHub release workflow only uploads the DMG and release report, so the detailed audit evidence is lost when the runner is discarded.

## Goals / Non-Goals

**Goals:**
- Retain runtime audit JSON/screenshots and packaged runtime smoke JSON as GitHub Actions artifacts.
- Keep release production delegated to `scripts/build-release.sh`.
- Document the expanded evidence set for final migration review.

**Non-Goals:**
- Change signing, notarization, stapling, assessment, or DMG creation.
- Upload transient sample projects or unsigned app bundles.
- Replace the release success report.

## Decisions

- Add separate upload-artifact steps for detailed runtime audit evidence and packaged runtime smoke evidence.
  - Rationale: separate artifact names make the final release evidence easy to inspect without unpacking the release report.
  - Alternative considered: upload the entire `apps/electron/out` directory. That would retain more than needed, including bulky or transient local build output.
- Keep the canonical script as the only producer of release gates.
  - Rationale: the workflow should retain artifacts, not duplicate release logic.

## Risks / Trade-offs

- Runtime screenshots add artifact size -> the evidence is bounded to the audit screenshots directory and materially useful for visual parity review.
- Uploading missing audit artifacts would fail the workflow -> this is desirable because a successful release should retain its audit evidence.
