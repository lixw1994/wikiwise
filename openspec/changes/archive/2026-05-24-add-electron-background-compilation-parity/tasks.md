## 1. Contract Tests

- [x] 1.1 Add core compiler coverage for draining pending pages with `compileNextBatch()`
- [x] 1.2 Add Electron main-process tests for background compilation scheduler wiring
- [x] 1.3 Add watcher and runtime audit tests for background compilation restart/evidence

## 2. Electron Background Compilation

- [x] 2.1 Add main-process background compilation job helpers keyed by project root
- [x] 2.2 Start background batches after directory-backed project open and scaffold creation
- [x] 2.3 Restart background batches after watcher summaries rescan or invalidate compiler state

## 3. Runtime Audit Evidence

- [x] 3.1 Capture background compilation drain evidence in the runtime audit report
- [x] 3.2 Fail project runtime scenarios when background compilation evidence is missing or pending

## 4. Verification And Archive

- [x] 4.1 Run focused core/Electron tests and Electron runtime audit
- [x] 4.2 Run full repository validation including OpenSpec, npm tests, Swift build, diff checks, and Electron mac package
- [x] 4.3 Archive the OpenSpec change after verification evidence is retained
