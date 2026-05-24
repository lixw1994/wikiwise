## Readiness Decision

ready with conditions

## Execution Mode

tdd-required

## Verification Mode

retained-required

## Debug Mode

standard

## Review Request

not requested

## Review Scope

Core watcher event summary helpers, Electron main watcher lifecycle/debounce, preload watcher APIs, renderer watcher refresh behavior, and compiler refresh flags.

## Review Focus

Confirm output paths are ignored, watcher priority matches native behavior, renderer has no direct filesystem access, and refreshes avoid clobbering unsaved drafts.

## Review Status

not-requested

## Delegation Mode

single-agent

## Parallelization Mode

serial-only

## Worktree Mode

same-tree

## Branch Finish Mode

finish-recommended

## Blocked By

none

## Observed Failure

Before this change, Electron does not watch opened projects and therefore does not react to external markdown/CSS/structure changes or `.rebuild` triggers.

## Validation Focus

- VF-Core-TDD: watcher classification tests fail before implementation and pass after.
- VF-Electron-TDD: watcher IPC/preload/renderer tests fail before implementation and pass after.
- VF-Workspace: `npm test` passes.
- VF-OpenSpec: `openspec validate migrate-electron-live-rebuild-watching --strict` passes.
- VF-Swift: no Swift source files are modified.
- VF-Evidence: retained verification records implemented watcher behavior and deferred runtime watcher gaps.

## Key Risks

- Treating Node `fs.watch` as final parity for macOS FSEvents.
- Recompiling with stale CSS after a CSS file change.
- Overwriting dirty renderer drafts when external file events arrive.

## Findings Summary

none

## Manual Adjustments

This is the fourth concrete phase under the native parity roadmap.
