## 1. Parity Coverage

- [x] 1.1 Add a renderer parity test proving native `agentCommand` renders 12px semibold sidebar-text labels and Electron mirrors visible labels for Claude Code, Codex, and Cursor while preserving command code IDs.
- [x] 1.2 Run the targeted new-wiki scaffold test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Add Electron agent command wrappers and labels around the existing command code nodes.
- [x] 2.2 Add scoped Electron CSS for agent command label typography and color.
- [x] 2.3 Re-run the targeted new-wiki scaffold test and confirm it passes.

## 3. Verification

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run `git diff --check`.
- [x] 3.5 Run `npm run electron:package:mac`.
