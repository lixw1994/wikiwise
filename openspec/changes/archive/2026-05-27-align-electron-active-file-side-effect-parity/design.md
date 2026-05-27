## Context

Native `ContentView.writeActiveFile(_:)` builds `<root>/.claude/active-file` and writes through `try?`, so the operation succeeds for scaffolded wikis that already contain `.claude` and fails silently when `.claude` is absent. Electron uses `writeActiveFile()` from `@wikiwise/core`, and that helper currently delegates to `writeTextFile()`, which creates parent directories. That difference can create `.claude` in a standalone file's parent directory or an arbitrary folder opened in Electron.

## Goals / Non-Goals

**Goals:**

- Match native active-file side effects for scaffolded wikis, ordinary folders, standalone files, and save-triggered writes.
- Keep `.claude/active-file` contents relative to the current project root when `.claude` exists.
- Retain renderer/main APIs and existing save/open flows.
- Add RED/GREEN coverage that proves the no-create behavior.

**Non-Goals:**

- Changing scaffold creation; scaffolded wikis still include `.claude`.
- Changing `.claude/settings.json`, agent hooks, or post-create guide behavior.
- Removing active-file tracking from scaffolded projects.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Change only `writeActiveFile()` rather than every caller. Main-process `setActiveFile()` and `saveFile()` already route through this helper, so centralizing the native behavior prevents future call-site drift.
- Return write metadata that distinguishes whether a write happened. Existing callers ignore the exact shape except `relativePath`, and retaining `path`/`relativePath` keeps compatibility while adding `written`.
- Keep `writeTextFile()` unchanged. It is the correct primitive for explicit writes and scaffold generation; active-file tracking is the special best-effort native behavior.
- Use source-level Electron parity tests plus core filesystem tests. The side effect is deterministic in core tests, while Electron tests can anchor the call path to native Swift's `try?` behavior.

## Risks / Trade-offs

- Callers may assume `.claude/active-file` always exists after selection -> Mitigation: scaffolded wiki behavior remains unchanged, and tests document that non-scaffold folders intentionally do not get `.claude`.
- Silent skip can hide setup mistakes -> Mitigation: this matches native behavior and the returned `written` flag is available for future diagnostics without surfacing UI noise.
