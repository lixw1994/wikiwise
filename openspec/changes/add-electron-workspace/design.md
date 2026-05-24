## Context

The current app is a SwiftUI macOS app with bundled JavaScript resources, WKWebView rendering, JavaScriptCore compilation, FSEvents watching, and SwiftTerm terminal embedding. The user wants a cross-platform direction, but the first step should be OpenSpec-driven and non-disruptive.

## Goals / Non-Goals

**Goals:**

- Add a root npm workspace while preserving SwiftPM as-is.
- Add `packages/wikiwise-core` as the first shared JavaScript boundary.
- Add `apps/electron` as a minimal, testable Electron shell.
- Keep verification dependency-light so progress is possible before network package installation.

**Non-Goals:**

- No full renderer framework or React build system in this change.
- No terminal, watcher, publishing, or full compiler migration yet.
- No release packaging changes.

## Decisions

- Use npm workspaces with `apps/*` and `packages/*` so future packages can be added without reshaping the repo again.
- Keep `@wikiwise/core` as plain Node ESM with no third-party runtime dependencies.
- Keep the Electron renderer framework-free for the first slice. This avoids bundler setup before the shell boundary is proven.
- Use an ESM Electron main process and a CommonJS preload script so the preload can use Electron's stable `contextBridge` API regardless of package `type`.
- Add tests that use `node:test` and filesystem inspection instead of launching Electron.

## Risks / Trade-offs

- Electron itself will not launch until dependencies are installed with network access.
- The first shell is intentionally thin and does not prove terminal, watcher, or editor parity.
- Resource path helpers point at repository resources during development; packaged app resource layout will need a later OpenSpec change.
- Adding a root `package.json` introduces a JavaScript workspace alongside the existing SwiftPM workflow, so README documentation must make the relationship clear.

## State Model

- **Swift production state:** current SwiftUI app remains authoritative and buildable.
- **Electron scaffold state:** `apps/electron` exists for cross-platform exploration and can run structure tests without dependency installation.
- **Core package state:** `packages/wikiwise-core` owns reusable JavaScript helpers and is the first migration target for shared logic.

## Migration Plan

1. Create OpenSpec artifacts and use them as the execution source of truth.
2. Implement `@wikiwise/core` with failing tests first.
3. Implement `@wikiwise/electron-app` shell files and structure tests.
4. Document how to run workspace tests and how to install/run Electron later.
5. Preserve the Swift app and release scripts untouched for rollback: deleting `apps/`, `packages/`, and root npm metadata restores the previous app surface.

## Open Questions

- The next OpenSpec change should decide whether the renderer becomes React/Vite or stays framework-free for another slice.
- The next OpenSpec change should decide how packaged Electron builds locate bundled resources outside a repository checkout.
