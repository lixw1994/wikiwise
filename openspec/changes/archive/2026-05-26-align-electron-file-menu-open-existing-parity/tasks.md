## 1. Coverage

- [x] 1.1 Add RED static tests proving the native command group lacks Open Existing Folder, Electron File menu omits it, and the welcome open-existing flow remains intact.
- [x] 1.2 Verify the targeted menu tests fail before implementation for the expected extra Electron File-menu command.

## 2. Implementation

- [x] 2.1 Remove the Electron File-menu Open Existing Folder item and any now-unused menu-command routing while preserving welcome-screen open-existing IPC.
- [x] 2.2 Update chrome menu specs and roadmap tracking to reflect the corrected native menu surface.

## 3. Verification And Archive

- [x] 3.1 Run targeted Electron chrome/menu tests.
- [x] 3.2 Run `openspec validate --all --strict`, `npm test`, `swift build`, `npm run electron:package:mac`, `npm run electron:release:readiness`, and `git diff --check`.
- [x] 3.3 Record verification evidence, archive the OpenSpec change, and rerun post-archive validation.
