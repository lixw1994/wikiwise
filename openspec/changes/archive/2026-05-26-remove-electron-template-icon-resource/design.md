## Context

The Electron package script copies the installed Electron template app, then rewrites metadata and overlays Wikiwise app resources. Recent slices removed non-native plist keys, but `apps/electron/out/Wikiwise.app/Contents/Resources/` still includes the inherited `electron.icns` file alongside the intended `Wikiwise.icns`. The native app bundle does not include an Electron-branded icon resource, and the packaged Electron plist already points `CFBundleIconFile` at `Wikiwise`.

## Goals / Non-Goals

**Goals:**

- Remove `Contents/Resources/electron.icns` from packaged Electron apps.
- Keep `Contents/Resources/Wikiwise.icns` and `CFBundleIconFile: Wikiwise`.
- Keep Electron runtime files, embedded app files, package signing flow, and previous plist cleanup behavior unchanged.

**Non-Goals:**

- No attempt to strip `default_app.asar`, `PkgInfo`, or runtime bootstrap resources.
- No change to icon artwork or native resource generation.
- No claim that a signed/notarized release has been produced.

## Decisions

- Delete the inherited template icon after copying the Electron app template and before final package completion. This keeps the cleanup package-local and avoids modifying installed dependencies under `node_modules`.
- Name the cleanup after its intent (`removeElectronTemplateResources`) so future harmless template artifacts can be handled in the same place if needed.
- Verify both absence and presence: the test and package inspection should prove `electron.icns` is gone while `Wikiwise.icns` and `CFBundleIconFile` remain.

## Risks / Trade-offs

- [Risk] Removing the wrong icon could leave the app without a bundle icon. -> Mitigation: tests and package inspection assert `Wikiwise.icns` remains and `CFBundleIconFile` stays set to `Wikiwise`.
- [Risk] Future Electron versions may rename template resources. -> Mitigation: deletion is best-effort for a known optional file and does not fail packaging when the file is already absent.
