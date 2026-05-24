## 1. Electron Preview Navigation Tests

- [x] 1.1 Add failing Electron structural tests for preview navigation resolution, external URL IPC, generated page coverage, iframe interception, generated history, and generated-page refresh.
- [x] 1.2 Verify `npm --prefix apps/electron test` fails for the new expectations before implementation.

## 2. Main And Preload Navigation APIs

- [x] 2.1 Implement main-process local preview navigation resolution, markdown slug lookup, generated-page lookup, `graph.html` support, and safe external URL opening.
- [x] 2.2 Implement preload APIs for preview navigation resolution and external URL opening.
- [x] 2.3 Verify `npm --prefix apps/electron test` passes for main/preload expectations.

## 3. Renderer Preview And Map/Graph Routing

- [x] 3.1 Implement preview and generated iframe click interception with same-page anchor passthrough.
- [x] 3.2 Implement renderer navigation from resolved markdown files and generated pages, preserving back/forward history.
- [x] 3.3 Refresh active generated pages from project watcher changes that affect compiled output.
- [x] 3.4 Verify `npm --prefix apps/electron test` passes.

## 4. Validation

- [x] 4.1 Verify `npm test` passes.
- [x] 4.2 Verify `openspec validate migrate-electron-preview-navigation-map-graph --strict` passes.
- [x] 4.3 Verify Swift source files are untouched and `swift build` passes.
- [x] 4.4 Verify `git diff --check` passes.
- [x] 4.5 Record retained verification evidence.
