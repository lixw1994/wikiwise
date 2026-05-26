## 1. Test Coverage

- [x] 1.1 Add failing source-level coverage for native `.compiled` initial mode and Electron standalone markdown WIKI selection with editor fallback.
- [x] 1.2 Add failing coverage that non-markdown standalone files stay in FILE/editor mode.

## 2. Renderer Detail Mode

- [x] 2.1 Add focused renderer mode derivation for selected files.
- [x] 2.2 Preserve compiled project WIKI behavior, standalone markdown editor fallback, and non-markdown FILE behavior.

## 3. Verification

- [x] 3.1 Run targeted project lifecycle/compiler preview tests.
- [x] 3.2 Run full verification: `npm test`, `swift build`, Electron runtime audit, packaging, OpenSpec validation, release-readiness preflight, and diff checks.
