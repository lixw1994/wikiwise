## Context

The Electron renderer already implements the create-new-wiki dialog, scaffold creation bridge, post-create guide, project service startup, and dismiss-to-home behavior. Existing tests inspect source and CSS, but the runtime audit does not click through this first-run workflow. The audit harness currently returns the default wiki location but throws for `wikiwise:createNewWiki`, which prevents live evidence for a core native workflow.

This change affects only the Electron runtime audit harness and its audit tests. It does not alter production scaffold templates, SwiftUI behavior, signing, notarization, or release packaging.

## Goals / Non-Goals

**Goals:**

- Add light and dark runtime audit scenarios that start from the welcome screen and create a new wiki through the real renderer/preload flow.
- Record evidence that the new-wiki sheet appears with native labels, disabled/enabled Create behavior, location metadata, and expected panel dimensions.
- Let the audit harness create a deterministic scaffold under `apps/electron/out/runtime-audit/sample-projects`.
- Record evidence that the created project opens, project services start, post-create guide copy and commands render, and dismissing the guide selects `home.md`.
- Update scaffold specs so old deferred references to terminal, publishing, persistence, and native modal polish are retired after their later parity work.

**Non-Goals:**

- Do not change production `createNewWiki` behavior or scaffold contents.
- Do not prompt for a real user location or write outside the runtime audit output directory.
- Do not claim final migration completion; signed/notarized release evidence and any remaining accepted deviations stay outside this slice.

## Decisions

- Add dedicated `new-wiki-light` and `new-wiki-dark` runtime audit scenarios instead of folding creation into welcome scenarios. This preserves the existing welcome assertions while adding targeted first-run workflow evidence.
- Reuse `createWikiScaffold` and `scanOneLevel` in the audit handler for `wikiwise:createNewWiki`. This matches production behavior while keeping output disposable and deterministic.
- Track host evidence for scaffold creation and watcher/service startup, then merge it with DOM evidence captured from the renderer. This proves both the preload IPC path and visible native workflow state.
- Keep runtime assertions scoped to user-visible parity and workflow state rather than comparing every CSS value in the runtime audit. Detailed CSS/source parity remains covered by the existing new-wiki test suite.

## Risks / Trade-offs

- New-wiki runtime scenarios add audit time -> keep the flow deterministic and avoid external dialogs.
- The renderer performs async project service startup after creation -> wait for project, guide, tree, terminal, and watcher signals before reading evidence.
- Creating a scaffold in the audit output could collide with a previous run -> runtime audit already resets its output root before scenarios run.
- Runtime evidence does not replace signed release evidence -> roadmap specs continue to require actual signed/notarized release execution or an accepted deviation before final completion.
