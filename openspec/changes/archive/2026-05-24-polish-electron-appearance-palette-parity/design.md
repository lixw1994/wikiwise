## Context

SwiftUI defines a named adaptive palette in `ContentView.swift` with separate light and dark RGB values for sidebar, toolbar, content, rules, selected text, folder icons, tabs, and accent controls. Electron currently persists and cycles `Auto`, `Light`, and `Dark`, but many visible renderer surfaces still use literal light colors. The runtime audit captures dark scenarios by name, yet does not assert that shell colors actually changed.

## Goals / Non-Goals

**Goals:**
- Introduce CSS custom properties corresponding to the native palette names.
- Apply those tokens to the main Electron shell surfaces and controls.
- Add static tests and runtime audit evidence that dark scenarios are visibly dark.
- Preserve the existing terminal theme implementation, which already has native warm light/dark palettes.

**Non-Goals:**
- Redesign layout or typography.
- Change compiled wiki iframe content or bundled site CSS in this phase.
- Replace the appearance persistence or menu command architecture.

## Decisions

1. Use CSS custom properties instead of duplicating full selector blocks.

   Tokens keep the light and dark values side by side with native names and reduce future drift.

2. Target primary shell surfaces first.

   This phase covers welcome, app shell, toolbar, sidebars, detail, dialogs, file tree, and publish surfaces. Generated preview iframe content follows its own bundled site CSS and remains outside scope.

3. Add computed-color runtime evidence.

   Static CSS tests prove token wiring, but runtime evidence catches cases where `data-appearance="Dark"` is set and still does not affect visible surfaces.

## Risks / Trade-offs

- [Risk] Some hard-coded semantic colors may remain for warnings or terminal. -> Keep semantic red/green and terminal theme separate; focus this phase on shell palette parity.
- [Risk] CSS tokens can accidentally change light appearance. -> Keep light token values equal to current/native light values and run runtime audit screenshots.
- [Risk] Runtime color checks can be too brittle. -> Assert broad dark/light thresholds on computed colors instead of exact per-pixel matching.

## Migration Plan

1. Add failing static tests for palette tokens and runtime audit fields.
2. Replace key renderer CSS colors with native palette variables.
3. Extend runtime audit computed-color evidence and dark assertions.
4. Run focused and full verification, archive the OpenSpec change, and commit.

Rollback removes the token layer, restores hard-coded colors, and removes audit fields.

## Open Questions

None for this phase.
