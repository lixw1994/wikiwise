# Electron Release Distribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the canonical macOS release command to a signed/notarized Electron DMG flow while retaining verifiable release guardrails.

**Architecture:** `scripts/build-release.sh` stays the single release entrypoint and delegates app assembly to the existing Electron package command. Structural tests lock the shell contract because production notarization requires external credentials.

**Tech Stack:** Bash, npm workspaces, Electron, macOS `codesign`, `hdiutil`, `xcrun notarytool`, `xcrun stapler`, OpenSpec.

---

## Scope

This plan covers the release hardening change from failing release contract tests through implementation, retained verification, and OpenSpec archive.

## Covers

1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 4.5

## Plan Type

full

## Execution Strategy

tdd-required

## Ordered Steps

1. Add failing tests in `apps/electron/test/macos-packaging.test.js` that assert `scripts/build-release.sh` runs `npm run electron:audit:runtime`, runs `npm run electron:package:mac`, signs the app with `--options runtime` and entitlements, creates `Wikiwise-macOS.dmg` with `hdiutil create`, signs the DMG, runs `xcrun notarytool submit`, runs `xcrun stapler staple`, and runs `spctl --assess`.
2. Add failing tests that assert `apps/electron/build/entitlements.mac.plist` exists and docs mention Electron release distribution through `bash scripts/build-release.sh <version>`.
3. Run `npm --prefix apps/electron test` and retain the expected red failure.
4. Replace the Swift release body in `scripts/build-release.sh` with an Electron release flow:
   - parse version as `${1:-0.1.0}`;
   - define overrideable `SIGNING_IDENTITY` and `NOTARY_PROFILE`;
   - preflight required commands and signing identity;
   - run `npm run electron:audit:runtime`;
   - run `npm run electron:package:mac -- "$VERSION"`;
   - sign and verify `apps/electron/out/Wikiwise.app`;
   - stage the app with an `/Applications` symlink;
   - create `Wikiwise-macOS.dmg` using `hdiutil create`;
   - sign, notarize, staple, and assess the DMG.
5. Add `apps/electron/build/entitlements.mac.plist` with hardened runtime entitlements required by Electron.
6. Update `CLAUDE.md`, `openspec/project.md`, and `apps/electron/README.md` to describe the Electron release path and credential requirements.
7. Run `bash -n scripts/build-release.sh` and `npm --prefix apps/electron test` for green.
8. Run runtime and local package checks: `npm run electron:audit:runtime`, `npm run electron:package:mac`, and inspect bundle metadata/resources.
9. Run final validation: `npm test`, `openspec validate harden-electron-release-distribution --strict`, `git diff --name-only -- Sources/Wikiwise`, `swift build`, and `git diff --check`.
10. Record `verification.md`, update task checkboxes, archive the OpenSpec change, run `openspec validate --all --strict`, and commit.

## Validation Per Step

1. `npm --prefix apps/electron test` fails on release contract expectations.
2. The same test run fails on missing entitlements/docs expectations.
3. Failure output is retained in the terminal transcript before implementation.
4. `bash -n scripts/build-release.sh` passes after the shell rewrite.
5. Tests assert the entitlements path and codesign usage.
6. Tests assert release docs mention Electron, DMG, signing, and notarization credentials.
7. `npm --prefix apps/electron test` passes.
8. Runtime audit prints four PASS scenarios; local package creates `apps/electron/out/Wikiwise.app`.
9. Final validation commands all pass or record credential-dependent release execution as not run locally.
10. Archive validation passes and git status is clean after commit.

## Files / Owners

- `scripts/build-release.sh`: canonical Electron release flow.
- `apps/electron/build/entitlements.mac.plist`: Electron hardened runtime entitlements.
- `apps/electron/test/macos-packaging.test.js`: structural release contract tests.
- `apps/electron/README.md`: Electron packaging and release docs.
- `CLAUDE.md`: project release command docs.
- `openspec/project.md`: OpenSpec release context docs.
- `openspec/changes/harden-electron-release-distribution/verification.md`: retained evidence.

## Completion Checkpoint

Implementation is complete when the release script is Electron-based, tests prove the release gate exists, local runtime/package validation passes, OpenSpec validates, and retained verification records the credential-dependent production release boundary.

## Completion Verification

Retain evidence for the red test, green Electron tests, shell syntax check, runtime audit, local package command, package metadata inspection, `npm test`, OpenSpec validation, Swift untouched/build checks, and diff hygiene. Do not claim a production signed/notarized release unless `bash scripts/build-release.sh <version>` actually completes on a credentialed release machine.

## Debugging Trail

Current reproduction signal: `scripts/build-release.sh` contains Swift-specific `swift build`, `lipo`, and Swift bundle copy steps instead of Electron packaging. Regression proof: structural tests will fail while those Swift-only release steps remain and pass only when the Electron release gate is present.

## Review Follow-Up

No external findings yet.

## Delegation Units

single-agent

## Parallel Units

Validation commands that do not mutate shared output may run in parallel. Release script implementation should stay serial.

## Isolation Boundaries

Do not modify `Sources/Wikiwise/`. Generated `apps/electron/out/` artifacts remain ignored and are not staged.

## Worktree Units

same-tree

## Isolation Reason

The current branch is already the Electron migration branch and the work touches one release path.

## Integration Owner

Codex in this session.

## Finish Checklist

- All OpenSpec tasks checked.
- Change archived.
- Commit created.
- Goal remains active only if production signing/notarization cannot be executed locally.

## Delivery Handoff

After this change, a release engineer with Developer ID and notary credentials must run `bash scripts/build-release.sh <version>` to produce actual notarized release evidence, unless a later OpenSpec change explicitly accepts a different final gate.

## Execution Notes

none

## Manual Adjustments

none
