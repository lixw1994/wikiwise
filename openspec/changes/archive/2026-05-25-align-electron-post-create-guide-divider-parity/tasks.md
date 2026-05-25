## 1. Parity Coverage

- [x] 1.1 Add a renderer parity test proving native uses three `Divider()` rows in the post-create guide and Electron mirrors them with scoped guide divider elements/styles.
- [x] 1.2 Run the targeted new-wiki scaffold test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Add three Electron post-create guide divider elements at the native section boundaries.
- [x] 2.2 Add scoped divider styling using the native sidebar rule token and guide column width.
- [x] 2.3 Re-run the targeted new-wiki scaffold test and confirm it passes.

## 3. Verification

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run `git diff --check`.
- [x] 3.5 Run `npm run electron:package:mac`.
