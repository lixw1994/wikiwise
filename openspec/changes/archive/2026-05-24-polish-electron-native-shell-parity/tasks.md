## 1. Parity Tests

- [x] 1.1 Add failing structural tests for product shell branding, native welcome copy, removed debug resource UI/API, and full-window shell layout.
- [x] 1.2 Verify `npm --prefix apps/electron test` fails for the new shell parity expectations before implementation.

## 2. Shell Parity Implementation

- [x] 2.1 Remove the `listResources` main-process handler and helper code.
- [x] 2.2 Remove the preload `resources` bridge method and renderer resource state calls.
- [x] 2.3 Replace Electron welcome markup with native-aligned product copy, actions, and hint.
- [x] 2.4 Remove shared-resources debug markup/styles and update shell layout styles to fill the app window.
- [x] 2.5 Update existing Electron shell tests for the production-only preload bridge.
- [x] 2.6 Verify `npm --prefix apps/electron test` passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `openspec validate polish-electron-native-shell-parity --strict` passes.
- [x] 3.3 Verify Swift source files are untouched and `swift build` passes.
- [x] 3.4 Verify `git diff --check` passes.
- [x] 3.5 Record retained verification evidence and archive the change.
