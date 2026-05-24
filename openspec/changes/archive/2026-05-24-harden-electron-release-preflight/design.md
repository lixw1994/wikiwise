## Context

`scripts/build-release.sh` is the canonical Electron release path. It already performs a release preflight before running runtime audit and packaging, but the only public command is the full release flow. When Apple signing credentials are missing, a maintainer cannot retain a clean "release is blocked by credentials" artifact without invoking the production release command. The script also validates tool availability and signing identity before expensive work, but it does not validate the notary keychain profile until the notarization step.

## Goals / Non-Goals

**Goals:**

- Add `--preflight` mode to the existing release script.
- Add an npm script that delegates to the preflight mode.
- Validate required commands, entitlements, Developer ID identity, and notary profile before release audit/package/sign steps.
- Keep full production release behavior unchanged after preflight passes.
- Retain verification evidence when local credentials block final release execution.

**Non-Goals:**

- Do not add a mock notarization path.
- Do not produce unsigned release artifacts from preflight mode.
- Do not weaken signing, notarization, stapling, or final assessment requirements.
- Do not claim migration completion from preflight-only evidence.

## Decisions

1. Extend `scripts/build-release.sh` instead of adding a separate release script.

   The project already treats `bash scripts/build-release.sh <version>` as canonical. A `--preflight` flag keeps the release gate centralized and prevents drift between a checker script and the actual release workflow.

2. Use argument parsing that preserves the version position.

   Supported forms will be `bash scripts/build-release.sh <version>` for full release and `bash scripts/build-release.sh --preflight <version>` for preflight-only evidence. The preflight path will exit immediately after prerequisite checks.

3. Validate notary profile during preflight.

   The full release cannot succeed without a usable Apple notary profile. Checking it before runtime audit and packaging gives a clearer blocker and avoids doing expensive work that cannot be released.

4. Keep preflight output explicit about artifact safety.

   A passing preflight reports that prerequisites are available and no release artifacts were produced. A failing preflight reports the missing prerequisite through the existing `fail` path and exits non-zero.

5. Verify mostly through static contracts plus one local command.

   Unit tests will inspect the release script, npm script, and docs. Runtime verification will run the preflight command on the current machine and retain whether it passed or which credential/tooling prerequisite blocked it.

## Risks / Trade-offs

- [Risk] `xcrun notarytool history` may require network access or valid Apple credentials. -> That is acceptable for a release preflight because final notarization has the same dependency; verification will record a blocker instead of treating it as implementation failure.
- [Risk] A preflight command could be mistaken for release completion. -> Output and docs will explicitly state that no app, DMG, signed, or notarized artifact was produced.
- [Risk] Preflight could drift from full release if implemented separately. -> Keep it inside `scripts/build-release.sh` and run the same `preflight` function before both modes.

## State Model

- `preflight-only`: parse `--preflight`, validate prerequisites, print success or fail, and exit before step `[1/7]`.
- `full-release`: validate prerequisites, then run runtime audit, package app, sign app, create DMG, sign DMG, notarize, staple, and assess.
- `blocked`: any missing command, missing entitlements file, missing signing identity, or unusable notary profile exits non-zero through `fail`.

## Migration Plan

1. Add static tests for preflight script behavior, npm script exposure, and docs.
2. Update `scripts/build-release.sh` with `--preflight` parsing and notary profile validation.
3. Update documentation to describe the preflight evidence path and final release requirement.
4. Run focused packaging tests, full verification, and the local preflight command.
5. Archive the change and commit.

Rollback removes the `--preflight` branch and npm script while preserving the original full release command.

## Open Questions

None for this phase.
