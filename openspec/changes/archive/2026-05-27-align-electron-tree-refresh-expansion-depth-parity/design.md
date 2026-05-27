## Context

Native `ContentView.refreshTree()` performs a one-level scan of the project root, computes `newFolderURLs` from that top-level result, and intersects `expandedFolders` with those URLs before expanding matching top-level nodes. It does not recursively rehydrate nested expanded folders during this refresh path.

Electron's `restoreExpandedTree(previousExpandedPaths)` currently sorts every previously expanded path by length, expands each path if it can be found, then prunes the resulting expanded set against all directories present in the restored tree. Because expanding a top-level folder makes nested nodes discoverable before the nested path is processed, nested expansion state survives watcher refreshes.

## Decision

Update `restoreExpandedTree` to derive `topLevelExpandedPaths` directly from `state.tree` after the root rescan:

- include only nodes in `state.tree` that are directories and whose paths were previously expanded;
- reset `state.expandedTreePaths`;
- expand those top-level folders without intermediate renders;
- render the tree once.

This mirrors native refresh depth while preserving the rest of the Electron tree model. User-driven lazy expansion remains recursive during the active tree state, and left-sidebar hide/show continues to preserve already-loaded DOM/tree state because it does not rescan the project root.

## Alternatives Considered

- Keep recursive restoration as a usability improvement. Rejected because the migration acceptance target is native parity unless a later OpenSpec change explicitly accepts a deviation.
- Add a mode flag to preserve nested paths for some refresh sources. Rejected because the native refresh path is uniform for filesystem watcher structure changes, and no separate native behavior has been identified.

## Risks

- Existing users may notice nested folders collapse after file additions/removals. This is intentional parity with the native app and is limited to watcher-triggered tree refreshes.
- The previous spec wording was broader than native behavior. The delta intentionally corrects that wording to prevent future regressions back to recursive restoration.
