## Context

The Electron renderer already implements the publish toolbar button, first-publish dialog, availability feedback, and modal publishing copy. Existing tests compare those surfaces to SwiftUI source and CSS, but the runtime audit does not open the publish dialog in a live BrowserWindow. It only asserts that publish dialogs are hidden during the final project screenshot and that standalone-file opens cannot publish.

The final migration goal needs runtime evidence for user-visible flows, especially flows that depend on renderer state, preload responses, async availability checks, and keyboard/button interactions. This slice adds first-publish dialog runtime evidence without changing product behavior or making real publish network calls.

## Goals / Non-Goals

**Goals:**

- Capture live BrowserWindow evidence that the project publish toolbar opens the first-publish dialog.
- Verify the visible dialog surface includes the native title, generated subdomain, URL affixes, token warning, availability hint/indicator, hidden `Unpublish...` action, and disabled `Publish` action while availability is unknown.
- Verify the dialog closes through the cancel control and the audit restores the selected `home.md` FILE/editor state.
- Record the evidence in OpenSpec and runtime audit reports.

**Non-Goals:**

- Do not perform real publishing, unpublishing, notarization, or release distribution work.
- Do not add network calls or new runtime dependencies.
- Do not change the renderer's user-facing publishing behavior in this slice.
- Do not treat this as full publishing runtime coverage; publish success, publish error, and unpublish confirmation can remain later runtime evidence slices.

## Decisions

- Capture first-publish dialog evidence inside the existing opened-project runtime scenarios.
  - Rationale: the project scenarios already load the real renderer, toolbar, preload bridge, and scaffold project in light and dark appearances.
  - Alternative considered: add dedicated `publish-dialog-light` and `publish-dialog-dark` scenarios. That would duplicate project setup and slow the audit without proving a distinct shell state.

- Keep runtime audit publish IPC read-only for this slice.
  - Rationale: first-publish dialog evidence only requires `getPublishConfig` and an unavailable/unknown availability state; no publish request is needed.
  - Alternative considered: mock `publishSite` success in the audit. That is useful but broader, and it should include result modal and publish-config refresh evidence as a separate change.

- Restore the audit to `home.md` FILE/editor mode after closing the dialog.
  - Rationale: existing screenshots and editor assertions intentionally prove the home editor audit state; publish dialog capture should not change that evidence.

## Risks / Trade-offs

- Async availability checks could change dialog state while evidence is captured -> capture accepts the deterministic first-publish unknown state immediately after opening and verifies the disabled Publish action before any successful availability path.
- Opening a modal could leave the final screenshot altered -> the capture explicitly cancels the dialog and reasserts hidden dialog and home editor state.
- This improves first-publish dialog runtime confidence but does not prove publish success/unpublish runtime flows -> those remain explicitly out of scope and can be addressed by later OpenSpec slices.
