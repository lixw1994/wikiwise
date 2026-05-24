## 1. Core Compiler

- [x] 1.1 Add failing core tests for slug parity and compiling a temporary wiki home page.
- [x] 1.2 Implement `WikiCompiler`, compiler resource loading, filesystem bridge, and slug helpers in `@wikiwise/core`.
- [x] 1.3 Verify `npm --prefix packages/wikiwise-core test` passes.

## 2. Electron Compiler Preview

- [x] 2.1 Add failing Electron structural tests for compiler IPC, preload APIs, project open compilation, and renderer File/Wiki preview hooks.
- [x] 2.2 Implement compiler IPC and file URL creation in the main process.
- [x] 2.3 Implement preload compiler APIs.
- [x] 2.4 Implement renderer File/Wiki mode switching and compiled preview iframe.
- [x] 2.5 Verify `npm --prefix apps/electron test` passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `openspec validate migrate-electron-compiler-preview --strict` passes.
- [x] 3.3 Verify Swift source files are untouched.
- [x] 3.4 Record retained verification evidence.
