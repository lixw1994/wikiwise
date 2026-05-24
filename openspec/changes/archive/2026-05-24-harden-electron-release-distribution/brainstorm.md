## Brainstorm

The remaining migration gate is release distribution, not feature behavior. The Electron app now has structural tests, runtime screenshot evidence, and a local `.app` package, but the canonical release command still describes the Swift build path. To make the migration credible, the release path must use Electron while preserving the same signing, DMG, notarization, and staple expectations that protect the current macOS native release.

Considered approaches:

- Add a separate Electron-only release script. This is low risk but leaves two release paths and weakens the existing "always use build-release.sh" guardrail.
- Replace the canonical `scripts/build-release.sh` flow with an Electron release flow. This matches the migration goal and keeps one release command, but requires careful tests and documentation because it changes a sensitive workflow.
- Keep the Swift release script and only document that Electron release is future work. This preserves safety but does not advance the final migration gate.

Chosen approach: update the canonical release flow to package Electron, run the Electron runtime audit before release packaging, sign the `.app`, create and sign the DMG, notarize, staple, and verify the result. Local verification will use structural tests and shell syntax checks; an actual notarized release still requires Developer ID and notary credentials on the release machine.
