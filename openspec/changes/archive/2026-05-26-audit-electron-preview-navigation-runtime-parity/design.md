## Context

The production Electron app routes clicks inside compiled preview iframes through `wikiwise:resolvePreviewNavigation`, then selects markdown files or generated pages through renderer navigation state. The runtime audit currently loads the real renderer and preload bridge, but it returns `null` for `wikiwise:resolvePreviewNavigation`, so it cannot exercise this path.

The audit's selected `home.md` preview is intentionally replaced with a generated audit HTML file to provide stable scroll evidence. That same deterministic HTML can host a local `file:` link to compiled `index.html`, because the scaffold already includes `wiki/index.md`.

## Goals / Non-Goals

**Goals:**

- Exercise the real renderer click handler and preload bridge for a local compiled-preview link.
- Resolve the clicked compiled output URL back to `wiki/index.md` in the audit main-process harness.
- Assert that app Back restores `home.md` and the compiled preview surface.
- Keep the audit deterministic and independent of network or external browser behavior.

**Non-Goals:**

- Change production navigation semantics.
- Add new generated pages or compiler outputs.
- Exercise external-link opening in this slice.
- Replace the existing scroll, watcher, map, or new-wiki audit evidence.

## Decisions

- Add the audit link to the synthetic preview HTML instead of changing scaffold markdown. This keeps the fixture local to runtime audit and avoids changing the user-facing starter wiki.
- Implement an audit-only resolver that mirrors production `resolvePreviewNavigation` for `file:`, `http:`, and `https:` URLs. This proves the preload contract without coupling the audit to production module internals.
- Store host-side resolver observations separately from renderer-side click evidence. This makes failures distinguish whether the iframe click was unavailable, IPC was not called, or the app failed to navigate.
- Return to `home.md` through the toolbar Back control before watcher evidence runs. This preserves existing audit ordering and keeps watcher assertions focused on the selected scaffold home page.

## Risks / Trade-offs

- Audit resolver duplication can drift from production resolver logic. Mitigation: keep the audit resolver small, mirror production slug lookup rules, and add source tests that require the resolver and evidence fields to exist.
- Iframe click timing can be flaky. Mitigation: use renderer-side wait loops around selected-file labels and frame visibility before recording evidence.
- Adding another runtime step increases audit duration slightly. Mitigation: reuse the existing project scenario and avoid extra windows or scenario types.
