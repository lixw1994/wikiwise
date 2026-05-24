## 1. Parity Tests

- [x] 1.1 Add a failing structural test for native left-sidebar header structure, literal `FILES`, native typography/spacing values, and absence of the Electron-only sidebar project heading.
- [x] 1.2 Verify the targeted Electron test fails before implementation.

## 2. Sidebar Header Implementation

- [x] 2.1 Remove the sidebar project-name heading from Electron renderer HTML.
- [x] 2.2 Remove the unused sidebar project-name binding from Electron renderer JavaScript while preserving toolbar project-name updates.
- [x] 2.3 Align sidebar header CSS with native SwiftUI `FILES` typography and spacing.
- [x] 2.4 Verify the targeted Electron test passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `swift build` passes.
- [x] 3.3 Verify `openspec validate --all --strict` passes.
- [x] 3.4 Verify `git diff --check` passes.
- [x] 3.5 Verify `npm run electron:package:mac` passes.
- [x] 3.6 Archive the change and verify the archived specs remain valid.
