# Electron CodeMirror Editor Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Electron textarea source editing with the same bundled CodeMirror editor resource used by the native macOS app.

**Architecture:** Main resolves the editor resource file URL, preload exposes it, renderer loads it in an iframe, and the shared editor resource posts content/ready messages to Electron while preserving Swift WebKit handlers.

**Tech Stack:** Electron IPC, sandboxed renderer iframe, shared HTML/CodeMirror resource, Node test runner, OpenSpec.

---

## Scope

This plan covers CodeMirror source editor parity only. Terminal PTY parity and actual notarized release execution remain separate gates.

## Covers

1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 4.5

## Plan Type

full

## Execution Strategy

tdd-required

## Ordered Steps

1. Add tests in `apps/electron/test/file-editing-save.test.js` and `apps/electron/test/runtime-parity-audit.test.js` expecting `getEditorResource`, `#source-editor-frame`, `editor.html`, `codemirror-bundle.js`, `postMessage`, `getContent`, `setContent`, `__getScrollFraction`, and no `<textarea id="source-editor">`.
2. Run `npm --prefix apps/electron test` and retain the expected failure.
3. Add main/preload editor resource IPC.
4. Extend `editor.html` so CodeMirror ready/content events also post to `window.parent`.
5. Replace renderer source editor textarea logic with iframe helpers for loading content, reading content before save, dirty state updates, and scroll fraction restoration.
6. Extend runtime audit DOM evidence and assertions for CodeMirror editor iframe.
7. Run `node --check` for touched JS and `npm --prefix apps/electron test`.
8. Run runtime audit and inspect report.
9. Run final validation, write verification evidence, archive, validate all specs, and commit.

## Validation Per Step

1. New tests fail on the current textarea implementation.
2. Failure is caused by missing editor parity contract.
3. Tests find IPC/preload API names.
4. Tests find both WebKit handlers and parent `postMessage`.
5. Tests find iframe-driven content/save helpers and absence of textarea.
6. Runtime audit report records editor iframe and CodeMirror markers.
7. Electron tests pass.
8. Runtime audit passes with editor evidence.
9. Full validation and archive pass.

## Files / Owners

- `Sources/Wikiwise/Resources/editor.html`
- `apps/electron/src/main/main.js`
- `apps/electron/src/preload/preload.cjs`
- `apps/electron/src/renderer/index.html`
- `apps/electron/src/renderer/renderer.js`
- `apps/electron/src/renderer/styles.css`
- `scripts/audit-electron-runtime.mjs`
- `apps/electron/test/file-editing-save.test.js`
- `apps/electron/test/runtime-parity-audit.test.js`

## Completion Checkpoint

Electron source mode uses the shared CodeMirror editor resource, save/autosave works through that iframe, runtime audit proves the editor is loaded, and retained evidence records Swift compatibility.

## Completion Verification

Record red test output, green Electron tests, runtime audit report evidence, `npm test`, OpenSpec validation, `swift build`, and diff hygiene.

## Debugging Trail

Current signal: Electron DOM contains `<textarea id="source-editor">`; native editor resource contains CodeMirror and WebKit bridge only. Regression proof: tests fail until Electron uses the shared resource and the resource exposes an Electron bridge.

## Review Follow-Up

No external findings yet.

## Delegation Units

single-agent

## Parallel Units

Static file reads and final validation commands may run in parallel.

## Isolation Boundaries

Do not touch terminal PTY implementation in this change. Do not stage generated `apps/electron/out/` artifacts.

## Worktree Units

same-tree

## Isolation Reason

This is a focused shared-resource and Electron renderer change.

## Integration Owner

Codex in this session.

## Finish Checklist

- OpenSpec tasks checked.
- Change archived.
- Commit created.

## Delivery Handoff

After this phase, terminal PTY parity and production notarization evidence remain the main unproven final gates.

## Execution Notes

none

## Manual Adjustments

none
