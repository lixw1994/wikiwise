## Context

Electron packaging starts from `node_modules/electron/dist/Electron.app`, then rewrites Wikiwise product metadata. The inherited template `Info.plist` still includes Camera, Microphone, Bluetooth usage descriptions and `NSAppTransportSecurity` arbitrary-loads configuration. The native Wikiwise app bundle only carries the Wikiwise identity, version, icon, minimum system version, and high-resolution capability metadata, with no camera, microphone, Bluetooth, or arbitrary-loads declaration.

This is a packaging/release hardening concern. It affects the macOS app bundle that users inspect, sign, and notarize, but it does not require renderer, compiler, terminal, publishing, scaffold, or core API changes.

## Goals / Non-Goals

**Goals:**

- Remove unused Electron template privacy permission keys from the packaged Electron `Info.plist`.
- Remove the Electron template `NSAppTransportSecurity` arbitrary-loads override from the packaged Electron `Info.plist`.
- Keep required Electron runtime metadata and Wikiwise product metadata intact.
- Verify the local packaged app after `npm run electron:package:mac` no longer contains those native-mismatched keys.

**Non-Goals:**

- No attempt to claim final signed/notarized release completion.
- No removal of Electron runtime-required keys such as `NSPrincipalClass`, `NSMainNibFile`, framework metadata, or executable metadata.
- No changes to app behavior, renderer UI, publishing API transport, or release signing entitlements.

## Decisions

- Strip only a small denylist of known inherited template keys: `NSCameraUsageDescription`, `NSMicrophoneUsageDescription`, `NSBluetoothAlwaysUsageDescription`, `NSBluetoothPeripheralUsageDescription`, and `NSAppTransportSecurity`.
- Perform cleanup inside `rewriteInfoPlist()` so every local package and canonical release package receives the same metadata treatment.
- Use direct XML cleanup for known top-level plist keys instead of adding a plist dependency. The package script already rewrites a small, known XML plist surface; keeping this local avoids new release-tooling dependencies.
- Validate with both static tests against the packaging script and runtime package inspection through `plutil -p` after packaging.

## Risks / Trade-offs

- [Risk] A future feature might legitimately need camera, microphone, Bluetooth, or non-HTTPS loading. → Mitigation: that feature must add an explicit OpenSpec change and restore only the required key with a Wikiwise-specific reason string.
- [Risk] Regex-based plist cleanup could remove an unexpected block if the Electron template plist shape changes. → Mitigation: cleanup is limited to exact top-level key names and the package command is verified by inspecting the produced app bundle.
- [Risk] Removing `NSAppTransportSecurity` could expose an existing HTTP-only dependency. → Mitigation: current publish/network flows use HTTPS service endpoints, and package verification plus existing tests cover release packaging without changing network code.

## Migration Plan

1. Add a failing packaging test that requires template permission/ATS cleanup.
2. Update `scripts/package-electron-macos.mjs` to remove the known inherited keys during `Info.plist` rewrite.
3. Run focused tests and package the app.
4. Inspect the packaged `Info.plist` to confirm the keys are absent.
5. Run the standard verification suite, archive the OpenSpec change, and keep the final signed/notarized release gate open.
