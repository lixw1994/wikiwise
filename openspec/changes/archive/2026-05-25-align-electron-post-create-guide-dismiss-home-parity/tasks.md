## 1. Parity Coverage

- [x] 1.1 Add a renderer parity test proving native dismiss loads `wiki/home.md` and Electron mirrors the explicit home-node selection without history.
- [x] 1.2 Run the targeted new-wiki scaffold test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Add a renderer helper that finds the loaded `wiki/home.md` tree node without filesystem access.
- [x] 2.2 Update Electron post-create guide dismissal to select home.md without pushing history, with fallback hide-only behavior.
- [x] 2.3 Re-run the targeted new-wiki scaffold test and confirm it passes.

## 3. Verification

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run `git diff --check`.
- [x] 3.5 Run `npm run electron:package:mac`.
