## Context

`ContentView.openURL(_:)` resets folder project state in the native SwiftUI app, but the folder-open branch never mutates `showPostCreateGuide`. The native post-create guide therefore remains visible until its own dismissal button changes that state. Electron centralizes project replacement in `applyProjectResult`, which currently sets `state.showPostCreateGuide = Boolean(options.showPostCreateGuide)` for every project result and unintentionally hides an already-visible guide during Open Existing and similar flows.

## Goals / Non-Goals

**Goals:**
- Match native guide persistence when applying ordinary project results.
- Preserve explicit successful-create behavior by allowing callers to request the guide with `showPostCreateGuide: true`.
- Keep existing explicit dismissal and scaffold failure behavior unchanged.

**Non-Goals:**
- Change guide copy, layout, or dismiss-home selection behavior.
- Change project tree loading, file selection, generated-page clearing, or service startup semantics.
- Introduce persisted guide state across app launches.

## Decisions

- Preserve guide state by treating `showPostCreateGuide: true` as an explicit show request rather than using a falsy default as an implicit hide request. This matches SwiftUI, where normal project-open paths do not write the guide flag.
- Leave `dismissPostCreateGuide` and scaffold failure catch handling as the explicit hide paths. Those are already source-backed and represent user dismissal or failed creation rather than incidental project application.
- Add source-backed tests that inspect the native folder branch for absence of guide mutation and inspect Electron's project application path for absence of Boolean coercion to `false`.

## Risks / Trade-offs

- Guide can remain visible over a different project after Open Existing, matching the current native behavior but potentially surprising users. The migration target is native parity, so the Electron behavior should follow SwiftUI until a product-level change intentionally adjusts both apps.
- Source-backed tests can be brittle around formatting. Keep assertions focused on semantic state transitions and existing helper extraction boundaries.

## Migration Plan

Patch the renderer state transition and keep the change local to project application. Rollback is a single-line renderer restoration plus removal of the source-backed test and OpenSpec delta.

## Open Questions

None.
