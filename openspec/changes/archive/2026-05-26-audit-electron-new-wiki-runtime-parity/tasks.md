## 1. Test Coverage

- [x] 1.1 Add a targeted runtime audit source test requiring new-wiki runtime scenarios, evidence markers, scaffold creation, guide dismissal, and failure messages.
- [x] 1.2 Run the targeted runtime audit test and confirm it fails for the missing new-wiki runtime evidence implementation.

## 2. Runtime Audit Implementation

- [x] 2.1 Add deterministic new-wiki runtime scenarios and audit IPC tracking for scaffold creation and project service startup.
- [x] 2.2 Implement a runtime-audit `createNewWiki` handler that creates scaffolded wikis under the audit output directory.
- [x] 2.3 Capture DOM/report evidence for new-wiki dialog behavior, created project state, post-create guide content, and dismiss-to-home behavior.
- [x] 2.4 Fail new-wiki runtime scenarios when creation workflow evidence is missing or incomplete.

## 3. Verification And Archive

- [x] 3.1 Run the targeted runtime audit test and Electron runtime audit command after implementation.
- [x] 3.2 Run full repository validation, OpenSpec validation, and packaging verification.
- [x] 3.3 Archive the OpenSpec change, commit the completed slice, and push the branch.
