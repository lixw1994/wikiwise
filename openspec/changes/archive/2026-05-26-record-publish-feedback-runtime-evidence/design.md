## Context

The Electron renderer has native-like publishing feedback surfaces: `Published!`, `Publish Error`, `Open in Browser`, and `Unpublish wiki?`. Static tests already check copy, modal structure, keyboard behavior, and native visual parity. Runtime audit evidence currently proves only that the first-publish dialog opens, blocks publishing before availability, hides `Unpublish...`, cancels, and restores editor state.

This change extends the runtime audit to exercise the feedback flows through the real renderer and preload bridge while keeping the audit self-contained. The audit IPC layer will simulate publish success, publish failure, external URL opening, and unpublish success without contacting the real publishing service.

## Goals / Non-Goals

**Goals:**

- Capture live BrowserWindow evidence for first-publish success feedback and native result copy.
- Capture that `Open in Browser` routes the published URL through the preload external URL bridge and dismisses the result.
- Capture live BrowserWindow evidence for publish error feedback and dismissal.
- Capture live BrowserWindow evidence for an already-published project showing `Unpublish...`, opening the destructive confirmation, and clearing published config after successful unpublish.
- Restore the runtime audit to the selected `home.md` FILE/editor state after all publish feedback captures.

**Non-Goals:**

- Do not contact the production publishing service.
- Do not change product renderer behavior, publish core helpers, or release scripts.
- Do not claim actual signed/notarized release completion.
- Do not cover publish update success separately in this slice; the success-modal copy path for first publish and published-config refresh are the high-value missing runtime evidence.

## Decisions

- Use audit-only IPC state for publishing.
  - Rationale: the real renderer and preload bridge are still exercised, while the runtime audit remains deterministic and offline.
  - Alternative considered: call `@wikiwise/core` publish helpers against a local fake HTTP service. That would be heavier and mostly test core networking already covered by core tests.

- Capture feedback flows inside existing opened-project scenarios.
  - Rationale: the project scenarios already cover light/dark rendering, project services, toolbar state, and final screenshot assertions.
  - Alternative considered: add separate scenario entries for publish feedback. That would slow the audit without adding a distinct app shell.

- Keep first-publish dialog evidence separate from feedback evidence.
  - Rationale: the previous slice proves the disabled pre-availability dialog state. This slice can allow availability and exercise success/error/unpublish without weakening that evidence.

## Risks / Trade-offs

- Publishing state can affect toolbar help text and unpublish visibility -> reset audit publish state at the start of each scenario and after unpublish.
- Multiple modal flows can leave the final screenshot altered -> each capture must dismiss or complete the modal and then explicitly restore `home.md` FILE/editor mode.
- Mocked IPC proves renderer/preload behavior, not production service behavior -> keep the verification text explicit that no real publish network call or signed release was produced.
