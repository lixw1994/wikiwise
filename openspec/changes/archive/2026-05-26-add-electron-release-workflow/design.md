## Context

The repository already has a canonical Electron release script, readiness/preflight reports, and success-report support. The missing execution lane is credential-backed automation: the local environment can prove that credentials are absent, but it cannot complete signing and notarization. GitHub Actions can run the same script on macOS after importing Apple signing and notarization credentials from repository secrets.

## Goals / Non-Goals

**Goals:**

- Add a manual workflow that prepares a macOS runner for Developer ID signing and Apple notarization.
- Keep `bash scripts/build-release.sh --release-report <path> <version>` as the only release path that performs runtime audit, packaging, signing, DMG creation, notarization, stapling, and assessment.
- Upload the resulting DMG and JSON release report so final migration evidence is durable.
- Document required secrets without committing sensitive material.

**Non-Goals:**

- Do not create GitHub releases automatically in this slice.
- Do not bypass or duplicate the release script's signing/notarization gates.
- Do not claim migration completion without a successful workflow or local release run.

## Decisions

- Use `workflow_dispatch` only. A manual release gate avoids accidental notarized releases from ordinary pushes while still giving maintainers a repeatable path.
- Use a temporary keychain populated from base64-encoded PKCS#12 certificate secrets. This is the standard macOS CI pattern and lets `security find-identity` work with the existing release script.
- Store Apple notarization API key credentials into a keychain profile named `notarytool`. This matches the release script default and keeps the script environment-compatible with local machines.
- Run `npm ci`, focused test/build validation, then the canonical release script with `--release-report`. The workflow does not call `codesign`, `hdiutil`, `notarytool submit`, `stapler`, or `spctl` directly for the release gates.
- Upload `Wikiwise-macOS.dmg` and `apps/electron/out/release/report.json` as artifacts. Runtime audit artifacts remain produced by the canonical script and can be added to uploads if later evidence needs them.

## Risks / Trade-offs

- [Risk] Repository secrets are misconfigured or missing. -> Mitigation: the workflow documents exact secret names and the release script's preflight stops before producing false success evidence.
- [Risk] GitHub runner macOS tooling changes. -> Mitigation: the workflow uses first-party macOS tools and keeps release logic in the checked-in script where tests already cover guardrails.
- [Risk] Users confuse workflow availability with migration completion. -> Mitigation: docs state that only a successful signed/notarized run with a release report satisfies the final release gate.

## Migration Plan

1. Add static tests for workflow structure, credential bootstrap, canonical release execution, and docs.
2. Add the workflow and documentation.
3. Validate OpenSpec, tests, Swift build, package/readiness behavior, and archive the change.
4. A maintainer configures the GitHub secrets and manually dispatches the workflow when ready to produce final release evidence.
