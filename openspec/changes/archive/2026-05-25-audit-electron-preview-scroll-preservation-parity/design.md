## Context

The Electron renderer now stores a markdown file scroll fraction for compiled WIKI previews and restores it after the preview iframe reloads. Existing source tests cover the renderer implementation, while the runtime parity audit proves broader native-shell behavior through a real Electron BrowserWindow. The audit currently records that markdown detail opens in WIKI mode before switching to FILE mode, but it does not interact with the preview scroll position.

## Goals / Non-Goals

**Goals:**

- Exercise compiled preview scroll restoration in the runtime audit using the real renderer and preload bridge.
- Persist evidence in `apps/electron/out/runtime-audit/report.json` for each opened-project scenario.
- Fail the audit when the preview cannot scroll, the restored position is not measurable, or the restored fraction is outside a small tolerance.

**Non-Goals:**

- Change the renderer scroll preservation behavior added in the prior compiler preview phase.
- Add new Electron dependencies, native Swift behavior, or release packaging behavior.
- Exhaustively audit every preview navigation path in this slice.

## Decisions

- Capture scroll evidence before the audit switches to FILE mode. This keeps the new check close to the existing default WIKI preview evidence and avoids needing to undo later editor and sidebar audit interactions.
- Use DOM-driven runtime evidence stored on `window.__wikiwisePreviewScrollEvidence`. This follows the existing audit pattern for sidebar, toolbar, and optional-info evidence while preserving the report shape.
- Measure scroll as a fraction of the preview iframe document scroll range. This matches the native WKWebView scroll-fraction contract and avoids tying assertions to exact pixel heights.
- Use a fixed tolerance for restored fraction comparisons. The compiled preview document height, iframe viewport, and fractional rounding can vary slightly, so the audit should prove restoration without being brittle.

## Risks / Trade-offs

- Runtime iframe access can fail if the audit preview becomes cross-origin. The audit uses a local file URL created by the same runtime script, and failures are converted into explicit missing evidence.
- Short preview content cannot prove scroll restoration. The audit preview fixture will include enough vertical content to make scrolling measurable.
- The runtime audit becomes slightly slower. The added work is limited to two project scenarios and a single mode switch cycle per scenario.
