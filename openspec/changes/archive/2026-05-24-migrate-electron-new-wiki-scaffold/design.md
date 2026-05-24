## Context

Native Wikiwise creates a new wiki from the welcome screen with a sheet containing name and location fields. `WikiScaffold.create` creates the target slug directory, standard project folders, scaffold templates, Claude/Codex agent instructions, bundled compiler resources, support JS/HTML resources, `.claude/settings.json`, `.claude/scaffold-version`, and `.gitignore`. After creation, native opens the wiki, shows a post-create guide, and can select `wiki/home.md`.

Electron already has a welcome screen, open-existing project lifecycle, file tree, compiler preview, save flow, and live watcher. "Create a New Wiki" still displays a deferred error. This phase makes that entry point real while preserving renderer sandboxing.

## Goals / Non-Goals

**Goals:**

- Implement scaffold creation in `@wikiwise/core` so the file-output behavior is testable without Electron.
- Keep filesystem writes and OS directory picker access in Electron main process.
- Replace the deferred renderer message with a modal-like new-wiki dialog and post-create guide.
- Reuse the existing project result path so created wikis scan, compile `wiki/home.md`, render tree state, and start watcher state consistently.
- Record remaining native gaps without claiming terminal or publishing parity.

**Non-Goals:**

- No built-in terminal or right sidebar migration.
- No publishing config flow.
- No last-folder restore/persistence.
- No CodeMirror editor migration.
- No packaged-app runtime QA.

## Decisions

- `@wikiwise/core` will expose `slugForWikiName` and `createWikiScaffold`. The helper accepts `repositoryRoot`, `parentDir`, `name`, and optional `createdDate` for deterministic tests.
- Electron main will expose `wikiwise:chooseNewWikiLocation` and `wikiwise:createNewWiki`. The create IPC validates payload shape, calls core scaffold creation, and returns `createProjectResult(createdPath)`.
- Renderer will store new-wiki dialog state locally: `isNewWikiDialogOpen`, `newWikiName`, `newWikiLocation`, `isCreatingWiki`, and `showPostCreateGuide`.
- The default location comes from main via `getDefaultWikiLocation`, using the user's home directory plus `wikis`, matching native's default.
- After successful creation, renderer sets the current project, selected file, tree, and guide state, renders the project shell, and starts the project watcher. Dismissing the guide reveals the selected `wiki/home.md` detail.
- The guide will be content-complete enough to match native workflow intent, while visual polish remains modest until broader app chrome/right sidebar phases.

## Risks / Trade-offs

- Copying scaffold directories recursively must avoid partial claims if any source resource is missing. Tests should assert representative files and placeholders instead of every byte.
- `fs.cpSync` requires modern Node, which Electron 37 provides. If older Electron support becomes necessary, this helper will need a recursive fallback.
- Native silently dismisses the sheet on scaffold errors after logging. Electron should surface errors in the existing error message area because there is no console-visible Swift log equivalent for users.
- The generated `.claude/scaffold-version` uses the current local date in native; tests need injected dates to avoid time-dependent assertions.

## State Model

- **welcome:** no project is open; create and open buttons are visible.
- **new-wiki-dialog:** dialog is open with editable name and location.
- **choosing-location:** main process is presenting an OS directory picker.
- **creating-wiki:** create action is in flight; controls are disabled.
- **project-opened:** created project tree and selected `wiki/home.md` are loaded.
- **post-create-guide:** detail area shows the guide instead of the selected file detail.
- **reading-created-home:** guide dismissed; selected `wiki/home.md` shows File/Wiki mode.

## Migration Plan

1. Add failing core scaffold tests for slugging, structure, template replacements, version marker, `.gitignore`, and bundled tool copying.
2. Implement core scaffold helpers using existing repository resource resolution and scaffold template files.
3. Add failing Electron structural tests for new-wiki IPC, preload APIs, renderer dialog, post-create guide, and open-created-project path.
4. Implement main IPC and preload bridge.
5. Implement renderer dialog, creation flow, guide, and HTML/CSS updates.
6. Verify tests, OpenSpec, Swift source untouched, and retained evidence.

## Open Questions

- A later packaging/runtime phase should validate scaffold creation from the packaged app bundle rather than repository resources.
- A later persistence phase should decide whether newly created wikis become the restored last folder.
