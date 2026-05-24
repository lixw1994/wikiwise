## Readiness Decision

ready with conditions

## Execution Mode

tdd-required

## Verification Mode

retained-required

## Debug Mode

systematic-debugging

## Review Request

No external review requested before implementation.

## Review Scope

Shared editor resource bridge, Electron renderer source editor integration, save/autosave state, runtime audit coverage.

## Review Focus

Confirm `editor.html` remains compatible with Swift WebKit while Electron uses CodeMirror rather than a textarea.

## Review Status

not-requested

## Delegation Mode

single-agent

## Parallelization Mode

parallel-eligible

## Worktree Mode

same-tree

## Branch Finish Mode

standard

## Blocked By

none

## Observed Failure

Electron source mode uses `<textarea id="source-editor">` while native source mode uses the bundled CodeMirror editor resource.

## Validation Focus

- Red/green Electron tests for shared editor resource, bridge, renderer integration, save path, and runtime audit evidence.
- `node --check` for Electron main/renderer where applicable.
- `npm --prefix apps/electron test`, `npm run electron:audit:runtime`, `npm test`.
- `openspec validate migrate-electron-codemirror-editor-parity --strict`.
- `swift build` to confirm resource changes do not break the native app.
- `git diff --check`.

## Key Risks

- Breaking native `window.webkit.messageHandlers` editor behavior.
- Saving stale content if renderer state and iframe content diverge.
- Hidden iframe load races in runtime audit.

## Findings Summary

No findings yet.

## Manual Adjustments

none
