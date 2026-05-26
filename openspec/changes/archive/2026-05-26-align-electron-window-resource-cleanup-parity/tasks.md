## 1. Test Coverage

- [x] 1.1 Add failing Electron source-level tests for native `onDisappear` cleanup evidence and webContents-scoped watcher/background/terminal teardown.
- [x] 1.2 Add failing tests for project-root ownership changes when a window opens a different folder or standalone file.

## 2. Main Process Lifecycle

- [x] 2.1 Track directory-backed project roots by webContents and stop previous background compilation when ownership changes.
- [x] 2.2 Add a single destroyed-webContents cleanup helper that closes the watcher, stops background compilation, stops the terminal, and clears restore state.
- [x] 2.3 Route restore, open-existing, create-new-wiki, and watcher startup through the ownership helper without changing renderer payloads.

## 3. Verification

- [x] 3.1 Run targeted Electron tests for project lifecycle, background compilation, watcher cleanup, terminal cleanup, and restore scope.
- [x] 3.2 Run full verification: `npm test`, `swift build`, Electron runtime audit, packaging, OpenSpec validation, and diff checks.
