## Context

The native `RightSidebar` shows three INFO sections for a selected markdown document: an about section, a Directions callout when frontmatter contains `directions:`, and a Linked section when wikilinks exist. Electron already implements this behavior and has static parity tests plus runtime evidence that empty optional sections stay hidden for scaffold `home.md`.

The final migration goal needs runtime evidence as well as static source checks. A live BrowserWindow audit should prove the populated INFO path by selecting a markdown file with both `directions:` and wikilinks, waiting for preload-backed document info to render, and retaining report fields that would fail if either optional section disappeared.

## Goals / Non-Goals

**Goals:**

- Add a deterministic populated markdown fixture to the runtime audit scaffold project.
- Capture live DOM evidence for populated Directions and Linked INFO sections through the real renderer and preload bridge.
- Restore the audit to the selected `home.md` FILE/editor state after the populated INFO capture so existing screenshot and editor assertions remain meaningful.
- Record the evidence in OpenSpec without changing product UI behavior.

**Non-Goals:**

- Do not change the user-facing right sidebar UI in this slice.
- Do not add new runtime scenarios that materially slow the audit when the existing project scenarios can capture the evidence.
- Do not change release signing, notarization, or packaging gates.

## Decisions

- Use an audit-only fixture file named `info-runtime.md`.
  - Rationale: it keeps the evidence deterministic and avoids relying on scaffold content that is intentionally sparse.
  - Alternative considered: mutate `home.md`. That would weaken the existing empty optional-section evidence.

- Capture populated INFO evidence inside existing opened-project scenarios.
  - Rationale: the audit already loads the real project shell in light and dark appearances, and adding one selection round-trip there proves the interaction without expanding the scenario matrix.
  - Alternative considered: add separate `project-info-light` and `project-info-dark` scenarios. That would increase audit runtime and duplicate setup.

- Restore the final selected document and FILE mode after capture.
  - Rationale: existing assertions and screenshots intentionally represent the editor audit state for `home.md`; the new capture should not blur that evidence.

## Risks / Trade-offs

- The capture uses DOM polling and real renderer events -> wait conditions must be explicit so slow CI machines do not record partial INFO state.
- Selecting an extra file adds history entries -> the capture restores `home.md` through UI selection and does not assert history length in this slice.
- Runtime evidence remains local audit evidence -> final migration completion still requires actual signed/notarized release evidence or a later accepted OpenSpec deviation.
