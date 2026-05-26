## 1. Contracts

- [x] 1.1 Add failing tests for the release readiness npm command, report path documentation, and preflight report contract.
- [x] 1.2 Add a smoke test that exercises blocked preflight report generation without producing release artifacts.

## 2. Release Script

- [x] 2.1 Add `--preflight-report <path>` parsing and structured JSON report generation to `scripts/build-release.sh`.
- [x] 2.2 Make preflight collect all lightweight prerequisite statuses before exiting with a blocked report.
- [x] 2.3 Add `npm run electron:release:readiness` as the retained evidence command.

## 3. Documentation

- [x] 3.1 Document the release readiness command, report path, blocker semantics, and remaining signed/notarized release gate.

## 4. Verification

- [x] 4.1 Run red/green focused packaging and preflight report tests.
- [x] 4.2 Run `bash -n scripts/build-release.sh`, `npm test`, `swift build`, `openspec validate record-electron-release-readiness-evidence --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 4.3 Archive the OpenSpec change and commit.
