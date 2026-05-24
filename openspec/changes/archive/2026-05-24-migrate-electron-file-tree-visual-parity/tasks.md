## 1. Contracts

- [x] 1.1 Add static tests for folder icon markup, special folder marker classes, and selected file accent CSS.
- [x] 1.2 Extend runtime audit contract tests for file-tree visual evidence.

## 2. Renderer Visuals

- [x] 2.1 Add folder icon markup to directory rows without changing expansion behavior.
- [x] 2.2 Add special `raw`/`site` folder icon styling and marker dot.
- [x] 2.3 Add selected-file leading accent styling aligned with tree indentation.

## 3. Runtime Evidence

- [x] 3.1 Extend runtime audit DOM evidence for folder icon, special folder marker, and selected accent presence.
- [x] 3.2 Fail project scenarios when file-tree visual markers are missing.

## 4. Verification

- [x] 4.1 Run focused Electron tests and runtime audit.
- [x] 4.2 Run `npm test`, `swift build`, `openspec validate migrate-electron-file-tree-visual-parity --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 4.3 Archive the OpenSpec change and commit.
