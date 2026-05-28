## Context

The Electron right-sidebar terminal uses `node-pty` to launch a project-root shell. On macOS, `node-pty` uses a bundled `spawn-helper` executable; if dependency installation or copying leaves that file without execute permissions, terminal startup fails before any PTY session exists.

The native SwiftTerm path does not have this helper-binary permission boundary. The Electron fix needs to cover both local development startup and packaged app assembly so that release signing/notarization sees the final executable mode.

## Goals / Non-Goals

**Goals:**

- Make local Electron terminal startup tolerant of a non-executable `node-pty` helper by correcting its mode before spawning the PTY.
- Make the local macOS package command write an executable helper into `Wikiwise.app`.
- Preserve existing terminal behavior: resolved shell, login-shell semantics, project-root cwd, output forwarding, input, resizing, and session lifecycle.

**Non-Goals:**

- Replace `node-pty` or change the terminal emulator.
- Add new terminal UI behavior.
- Bypass the canonical signed/notarized release workflow.

## Decisions

- Add a small main-process guard before `pty.spawn`.
  - Rationale: this fixes the development/runtime failure at the same boundary where the terminal starts, and it keeps renderer/preload contracts unchanged.
  - Alternative considered: only fix dependency install state. That would not protect packaged copies or future installs where mode bits are lost.

- Add a packaging step after runtime dependencies are copied.
  - Rationale: signing should happen after the copied app bundle already has the final executable bit. Runtime chmod inside a signed app is not a substitute for packaging correctness.
  - Alternative considered: rely on the main-process guard in packaged apps. That is less robust for hardened release bundles and obscures package artifact defects.

- Scope the permission fix to non-Windows helper candidates.
  - Rationale: the reported issue is macOS `spawn-helper`; Windows terminal startup uses a different path.
  - Alternative considered: unconditional chmod. That would add avoidable cross-platform risk.

## Risks / Trade-offs

- Helper layout changes in a future `node-pty` release → Resolve known helper candidate paths and skip when no helper exists rather than blocking unrelated platforms.
- Runtime chmod can fail if the helper is read-only → Throw a focused error that names the spawn-helper permission problem so the failure is actionable.
- Packaged helper mode could regress during dependency copy changes → Keep package-script source coverage and inspect the packaged helper during verification.
