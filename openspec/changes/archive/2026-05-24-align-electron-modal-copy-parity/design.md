## Context

The native SwiftUI app uses polished macOS strings in its sheet/dialog flows:

- New wiki location chooser: `Choose…`
- Publish warning: `A publish.json file will be saved in your project — it contains your publish token. Treat it like a password: if you lose it, you won’t be able to update this site.`
- Publish dialog unpublish action: `Unpublish…`
- Post-create summary: `WikiWise created the folder structure, build tools, and agent skills. Now seed it with sources.`
- Post-create final guidance: `This is your project. You can change anything about it with your agent — the styles, the structure of your wiki pages, the build pipeline. Make it your own.`
- Post-create dismiss action: `Got it — start reading`

Electron currently uses similar but non-identical strings, including ASCII `...` and `-` fallbacks and shortened safety/guide text.

## Goals / Non-Goals

**Goals:**

- Preserve exact user-visible strings for the covered native sheets and guide.
- Keep behavior unchanged: the same buttons keep the same IDs and event handlers.
- Add tests that guard against regressing to shortened or ASCII fallback copy.

**Non-Goals:**

- No layout or styling changes.
- No publish service, scaffold, filesystem, or IPC behavior changes.
- No new runtime dependencies.

## Decisions

- Use literal Unicode punctuation in Electron HTML/renderer source because the native app already uses those characters and the renderer files are UTF-8.
- Test both static markup and the dynamic renderer unpublish label, because the button text is rewritten whenever publish state changes.
- Keep button IDs unchanged so existing event listeners and tests remain stable.

## Risks / Trade-offs

- Structural source tests do not render the UI; they are intentionally narrow guards for static copy parity. Existing runtime and workflow tests continue to cover the broader create/publish behavior.
- Copy changes may affect snapshots or manual docs if any exist outside the current test suite; repository search shows current assertions are structural and can be updated directly.

## State Model

No state model changes. Existing renderer state still controls dialog visibility, publish progress, unpublish visibility, and post-create guide dismissal.

## Migration Plan

1. Add failing tests for native copy parity in new-wiki and publishing test files.
2. Update Electron renderer HTML and dynamic unpublish label strings.
3. Run targeted tests, then full verification.
4. Archive the OpenSpec change after verification.

## Open Questions

None.
