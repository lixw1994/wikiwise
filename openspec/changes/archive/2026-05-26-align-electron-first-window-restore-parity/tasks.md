## 1. Contracts

- [x] 1.1 Add failing Electron chrome/menu persistence tests for native first-instance restore behavior and Electron per-window restore gating.

## 2. Implementation

- [x] 2.1 Track Electron main-window creation order and startup restore eligibility by webContents id.
- [x] 2.2 Gate `wikiwise:restoreLastProject` so only first-window senders can restore the persisted project.

## 3. Verification

- [x] 3.1 Run the focused restore parity test red/green.
- [x] 3.2 Run `npm test`, `swift build`, `npm run electron:audit:runtime`, `npm run electron:package:mac`, `openspec validate align-electron-first-window-restore-parity --strict`, `openspec validate --all --strict`, and `git diff --check`.
- [x] 3.3 Archive the OpenSpec change and commit.
