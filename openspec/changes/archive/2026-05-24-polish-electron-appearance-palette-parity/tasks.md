## 1. Palette Contract Tests

- [x] 1.1 Add static Electron tests for native light/dark palette tokens and shell selector wiring
- [x] 1.2 Add runtime audit tests for computed appearance color evidence and dark palette failure messages

## 2. Renderer Palette Implementation

- [x] 2.1 Introduce native-equivalent CSS custom properties for light and dark appearance values
- [x] 2.2 Apply palette variables to welcome, toolbar, sidebars, detail, dialogs, file tree, post-create/save, and publish surfaces

## 3. Runtime Audit Evidence

- [x] 3.1 Capture computed shell surface colors in runtime audit reports
- [x] 3.2 Fail dark runtime scenarios when key visible surfaces remain light-colored

## 4. Verification And Archive

- [x] 4.1 Run focused Electron tests and runtime audit for appearance palette evidence
- [x] 4.2 Run full repository validation including OpenSpec, npm tests, Swift build, diff checks, and Electron mac package
- [x] 4.3 Archive the OpenSpec change after all tasks and verification evidence are complete
