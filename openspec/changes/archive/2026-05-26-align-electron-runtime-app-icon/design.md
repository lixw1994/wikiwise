## Context

The SwiftUI app sets `NSApplication.shared.applicationIconImage` from `Wikiwise.icns` in `WikiwiseApp.init()`. Electron packaging already copies the same resource into the packaged `.app` and rewrites `CFBundleIconFile`, but the development/runtime main process does not set the Dock icon before creating app windows or running runtime audit mode.

## Goals / Non-Goals

**Goals:**

- Resolve the existing native `Sources/Wikiwise/Resources/Wikiwise.icns` resource from the Electron main process.
- Derive an Electron `NativeImage` from the `.icns` file's embedded PNG payload so Dock icon loading works in Electron runtime.
- Apply the icon through Electron's macOS Dock API before regular windows or runtime audit work begin.
- Pass the derived native image into `BrowserWindow` construction where Electron supports window icons.
- Add static tests that prove the Electron runtime path mirrors the native Swift source behavior.

**Non-Goals:**

- Do not change the packaged app bundle icon metadata already handled by `scripts/package-electron-macos.mjs`.
- Do not introduce a new image asset or generated icon.
- Do not change app window layout, renderer branding, release signing, notarization, or DMG creation.

## Decisions

- Add a small main-process helper for runtime icon setup.
  This keeps the icon behavior near other shell setup code and makes it available before both runtime audit mode and normal window creation.
- Extract the largest embedded PNG payload from the `.icns` and build the Electron icon with `nativeImage.createFromBuffer`.
  The runtime audit showed `app.dock.setIcon(...)` fails when passed this `.icns` path directly, while the checked-in icon contains PNG payloads Electron can load as a `NativeImage`.
- Return a boolean from the helper.
  Tests can lock in that missing resources are tolerated without crashing non-macOS development environments, while macOS gets `app.dock.setIcon(...)` when the native icon exists.
- Use the native resource path rather than the packaged output path.
  Development, tests, and audit mode run from the repository; the package script remains responsible for copying the same source asset into the final `.app`.

## Risks / Trade-offs

- [Risk] `app.dock` exists only on macOS. -> Mitigation: guard the call with optional chaining so Linux/Windows test environments do not fail.
- [Risk] A missing icon file could block runtime audit. -> Mitigation: treat missing icon resources as non-fatal in the helper while tests ensure the checked-in native asset path exists.
- [Risk] BrowserWindow `icon` has platform-specific behavior. -> Mitigation: keep Dock icon setup as the primary macOS parity behavior and use the window option only as a harmless additional hint.
- [Risk] The `.icns` payload parser is intentionally small and only handles embedded PNG entries. -> Mitigation: fall back to Electron's path loader for non-ICNS/future resources and treat an unreadable icon as non-fatal.
