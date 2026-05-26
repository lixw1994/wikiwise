## Context

The Electron package script copies the installed Electron template app and rewrites it into `Wikiwise.app`. Recent packaging slices removed template plist metadata and the unused Electron icon resource, but the generated app still contains `Contents/PkgInfo`. The current native `Wikiwise.app` bundle does not contain `PkgInfo`, and this legacy file is not required for the local Electron runtime layout.

## Goals / Non-Goals

**Goals:**

- Remove `Contents/PkgInfo` from packaged Electron apps.
- Keep `Contents/Info.plist`, `Contents/MacOS/Wikiwise`, `Contents/Resources/Wikiwise.icns`, `Contents/Resources/default_app.asar`, and embedded app files intact.
- Record package inspection evidence that native and Electron app bundles no longer diverge on `PkgInfo`.

**Non-Goals:**

- No attempt to strip Electron runtime-required plist keys or `default_app.asar`.
- No change to signing, notarization, DMG creation, or release credential requirements.
- No claim that a final signed/notarized Electron release has been produced.

## Decisions

- Delete `PkgInfo` in the same package-local template cleanup step that removes the inherited Electron icon. This avoids changing installed dependencies under `node_modules` and keeps template artifact cleanup centralized.
- Treat deletion as best-effort. If a future Electron template stops shipping `PkgInfo`, the package command should still succeed.
- Verify absence by checking both native and generated app contents, while also proving runtime-required resources remain present.

## Risks / Trade-offs

- [Risk] Removing the wrong top-level bundle file could break launch metadata. -> Mitigation: only remove the exact `Contents/PkgInfo` path and verify `Info.plist` plus executable/resource files remain.
- [Risk] A future Electron release could make `PkgInfo` meaningful again. -> Mitigation: retained packaging tests document the expected native-aligned bundle layout, and the deletion is isolated in one cleanup function.
