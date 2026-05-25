## 1. Parity Coverage

- [x] 1.1 Add a renderer parity test proving native `seedOption` structure and Electron seed option rows match icon identifiers, row spacing, icon styling, title styling, and command styling.
- [x] 1.2 Run the targeted new-wiki scaffold test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Replace the Electron seed option list items with native-like icon/title/command row markup while preserving existing copy.
- [x] 2.2 Add scoped Electron CSS for seed option row layout, icon styling, title styling, and command styling.
- [x] 2.3 Re-run the targeted new-wiki scaffold test and confirm it passes.

## 3. Verification

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run `git diff --check`.
- [x] 3.5 Run `npm run electron:package:mac`.
