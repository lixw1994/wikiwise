## Context

The right-sidebar terminal uses `node-pty`, whose macOS native module starts PTYs through a sibling `spawn-helper` binary selected from `build/Release`, `build/Debug`, or `prebuilds/<platform>-<arch>`. The existing runtime guard repairs one expected helper path before `pty.spawn`, but local evidence shows a mixed install can contain `darwin-arm64` with executable permissions and `darwin-x64` without them. That leaves users running the other Electron architecture exposed to the same `posix_spawnp failed` startup crash.

## Goals / Non-Goals

**Goals:**
- Repair all discovered Darwin `node-pty` `spawn-helper` files in the resolved runtime dependency before starting a terminal.
- Preserve the existing source-build helper candidates.
- Keep all terminal behavior outside helper permission repair unchanged.

**Non-Goals:**
- Replace `node-pty` or xterm.js.
- Change shell resolution, login-shell arguments, terminal process lifecycle, or renderer behavior.
- Bypass final release signing, notarization, or DMG requirements.

## Decisions

- Discover helpers from the resolved `node-pty` package root and include all `prebuilds/darwin-*/*spawn-helper` entries.
  - Rationale: this mirrors the packaged-app fix and removes the architecture mismatch between the process currently running and helpers bundled for other Darwin architectures.
  - Alternative considered: only repair `prebuilds/${process.platform}-${process.arch}`. That is the current behavior and misses mixed-architecture installs.
- Keep `build/Release/spawn-helper` and `build/Debug/spawn-helper` candidates.
  - Rationale: source-built `node-pty` installs still use those paths, and keeping them avoids narrowing compatibility.
- Keep the guard best-effort over discovered helpers but fail with the existing actionable error if any chmod/stat operation fails.
  - Rationale: a failed chmod means the PTY can still crash; surfacing a focused permission error is better than allowing a lower-level `posix_spawnp failed`.

## Risks / Trade-offs

- Future `node-pty` layout changes could move helpers again -> targeted source coverage keeps the expected discovery strategy visible, while missing helper directories are skipped instead of blocking terminal startup.
- Runtime chmod can fail on read-only installs -> startup remains failed, but the error points at the `node-pty` helper permission problem directly.
- Repairing non-current-architecture helpers does extra filesystem work -> the directory scan is tiny and happens only when starting a PTY session.
