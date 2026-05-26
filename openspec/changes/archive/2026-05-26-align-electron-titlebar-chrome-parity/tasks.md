## 1. Contracts

- [x] 1.1 Add failing native shell tests for Swift titlebar title/separator behavior and Electron hidden-inset titlebar wiring.

## 2. Implementation

- [x] 2.1 Configure the Electron main window for hidden-inset native macOS titlebar chrome while preserving product-facing identity.
- [x] 2.2 Add traffic-light-safe leading inset and draggable/no-drag toolbar regions to the Electron renderer CSS.

## 3. Verification

- [x] 3.1 Run the focused native shell titlebar parity test red/green.
- [x] 3.2 Run `npm test`, `swift build`, `npm run electron:audit:runtime`, `npm run electron:package:mac`, `openspec validate align-electron-titlebar-chrome-parity --strict`, `openspec validate --all --strict`, and `git diff --check`.
- [x] 3.3 Archive the OpenSpec change and commit.
