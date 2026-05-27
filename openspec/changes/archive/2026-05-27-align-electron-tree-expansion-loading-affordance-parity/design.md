## Context

Native `fileTreeRow(_:depth:)` computes `isExpanded` and renders the disclosure with `Text(isExpanded ? "▾" : "▸")`. When a collapsed directory is clicked, native inserts the folder URL into `expandedFolders`, synchronously calls `expandNode(node)` if children have not been scanned, and re-renders the tree. There is no visible loading state in the row.

Electron needs an asynchronous IPC request for lazy expansion, so it keeps `state.treeLoadingPaths` as an internal request guard. The current renderer also exposes that state by disabling the folder button and using `...` in the disclosure while the request is pending.

## Decision

Update `renderNode()` so directory rows always render native disclosure text from expansion state:

- expanded folders: `▾`;
- collapsed folders: `▸`;
- no `...` placeholder;
- no button disabled state tied to `treeLoadingPaths`.

Keep `treeLoadingPaths` inside `expandProjectTreeFolder()` so duplicate expansion requests can still return early. Remove the pre-request render that existed only to show the non-native loading affordance; render after the async request completes, matching native's "row changes after scan" effect more closely than showing an intermediate loading row.

## Alternatives Considered

- Keep the visible loading affordance as an async web improvement. Rejected because final acceptance is native parity unless a later OpenSpec change explicitly accepts the deviation.
- Remove `treeLoadingPaths` entirely. Rejected because Electron still has asynchronous IPC and needs an internal request guard.

## Risks

- On slow filesystems, users will not see an intermediate loading glyph during folder expansion. This is intentional parity with the native app, which presents no loading glyph for this interaction.
