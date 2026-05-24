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

Core document info parsing, Electron document info IPC, terminal process lifecycle, preload output subscriptions, renderer right sidebar, INFO tab, and TERMINAL tab.

## Review Focus

Confirm renderer stays sandboxed, terminal processes are owned and cleaned up by main, selected file paths are project-root constrained, and PTY-grade terminal gaps are explicitly retained rather than hidden.

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

Before this change, Electron has no right sidebar, no selected-document INFO surface, and no built-in project-root terminal entry point.

## Validation Focus

- VF-Core-TDD: document info tests fail before implementation and pass after.
- VF-Electron-TDD: sidebar/terminal IPC/preload/renderer tests fail before implementation and pass after.
- VF-Workspace: `npm test` passes.
- VF-OpenSpec: `openspec validate migrate-electron-right-sidebar-terminal --strict` passes before archive and `openspec validate --all --strict` passes after archive.
- VF-Swift: no Swift source files are modified, and `swift build` passes.
- VF-Evidence: retained verification records implemented sidebar/terminal behavior and deferred PTY/app chrome gaps.

## Key Risks

- A non-PTY shell can be mistaken for full terminal parity.
- Terminal child processes could leak if project/window cleanup is incomplete.
- Document info path handling must not allow renderer filesystem escape.

## Findings Summary

none

## Manual Adjustments

This is the sixth concrete phase under the native parity roadmap, after scaffold/new wiki.
