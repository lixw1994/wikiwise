## Context

Native `FileWatcher` classifies asset changes with:

```swift
} else if path.contains("/wiki/assets/") {
    watcher.pendingStructure = true
}
```

This is a containment check over the absolute event path, not a project-root-relative prefix check. Electron converts paths to project-root-relative slash-separated strings and currently uses `relativePath.startsWith("wiki/assets/")`, which is narrower.

## Goals / Non-Goals

**Goals:**

- Match native containment semantics for `/wiki/assets/` watcher events.
- Keep existing root `wiki/assets/` structure behavior.
- Keep all existing watcher priorities and lower-case markdown/CSS behavior.
- Add RED/GREEN coverage for nested `*/wiki/assets/*` paths.

**Non-Goals:**

- Changing scanner visibility, scaffold output, build asset copying, or compiler asset behavior.
- Adding special handling for the `wiki/assets` directory path itself. Native checks for `/wiki/assets/` with the trailing slash, so child paths are the parity surface.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Change only `summarizeWatchEvents()` in `@wikiwise/core`. Electron main already delegates all watcher coalescing to this helper, so the correction applies without additional IPC changes.
- Introduce a tiny helper for native-like assets path matching. It checks `relativePath.startsWith("wiki/assets/") || relativePath.includes("/wiki/assets/")`, which mirrors the absolute-path `/wiki/assets/` containment while avoiding false positives like `notwiki/assets/...`.
- Add a behavior test in core and a source-level Electron parity test anchored to `Sources/Wikiwise/FileWatcher.swift`.
- Runtime audit verification initially captured all scenarios as PASS but exited with `SIGTRAP` after `window.destroy()` and before process shutdown completed. The audit should close the BrowserWindow gracefully and wait for closure before the main process calls `app.quit()`.

## Risks / Trade-offs

- Electron will now schedule structure refreshes for nested directories named `wiki/assets`, matching native behavior even if those paths are unusual for the scaffolded wiki layout.
- The helper intentionally does not match `notwiki/assets/...`; that preserves the slash-boundary semantics implied by native `/wiki/assets/`.
- Replacing forced audit-window destruction with close-and-wait keeps the runtime audit path closer to the existing graceful `app.quit()` contract and avoids accepting screenshots from a command that exits non-zero.
