## Context

`node-pty` ships separate Darwin prebuild directories, including `darwin-arm64` and `darwin-x64`. The current package script computes one helper path from `process.arch`, so it repairs only the builder's architecture. A universal Electron bundle can still carry the other architecture's helper with non-executable permissions.

## Goals / Non-Goals

**Goals:**

- Repair executable bits for every packaged Darwin `node-pty` `spawn-helper` under `prebuilds/darwin-*`.
- Keep packaging tolerant of missing optional prebuilds while still fixing every helper that exists.
- Add targeted test coverage that would fail if the script returned to a single `process.arch` helper path.
- Verify real package output after implementation.

**Non-Goals:**

- Change runtime PTY startup behavior for the active machine architecture.
- Modify release signing, notarization, or DMG creation gates.
- Add new Electron dependencies.

## Decisions

- Discover helpers with filesystem traversal rooted at packaged `node_modules/node-pty/prebuilds`.
  - Rationale: the package output is the source of truth, and this avoids hard-coding only the local architecture.
  - Alternative considered: maintain a fixed `["darwin-arm64", "darwin-x64"]` list. That covers today but is less robust if `node-pty` changes its prebuild matrix.

- Return a count of repaired helpers instead of a boolean.
  - Rationale: tests and future diagnostics can distinguish "no helpers found" from "helpers existed but already had execute bits."
  - Alternative considered: keep a boolean return. That would hide cross-architecture coverage from callers.

## Risks / Trade-offs

- A future non-Darwin helper under `prebuilds` could be included in the package -> limit discovery to directories whose basename starts with `darwin-`.
- If `node-pty` changes helper names, traversal may find zero helpers -> targeted tests keep the expected `spawn-helper` contract visible.
