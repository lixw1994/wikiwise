## Context

The native Wikiwise project declares `platforms: [.macOS(.v14)]` in `Package.swift`, README states macOS 14+, and the current native app bundle declares `LSMinimumSystemVersion` as `14.0`. The Electron package starts from Electron's template app and currently keeps its inherited `LSMinimumSystemVersion` value of `11.0`, even after rewriting Wikiwise product metadata.

This is a packaged app metadata parity issue. It does not change renderer behavior, compiler output, publishing, terminal behavior, or the release signing/notarization steps.

## Goals / Non-Goals

**Goals:**

- Make the packaged Electron app declare `LSMinimumSystemVersion` as `14.0`.
- Anchor the value to existing native evidence: SwiftPM platform, README macOS requirement, and native app bundle metadata.
- Verify the packaged local app after `npm run electron:package:mac`.

**Non-Goals:**

- No claim that the final signed/notarized release has been produced.
- No change to Electron runtime dependencies or entitlements.
- No change to app behavior on older macOS versions beyond the package metadata that advertises support.

## Decisions

- Add `LSMinimumSystemVersion: "14.0"` to the same `Info.plist` rewrite map that already sets Wikiwise product metadata.
- Keep the value explicit in the package script. The repository has multiple authoritative source hints, but the packaging script must produce deterministic metadata without parsing SwiftPM or a prebuilt native bundle during release.
- Verify both statically and by inspecting the packaged app. Static coverage prevents regressions in the package script, and bundle inspection proves the release artifact surface changed.

## Risks / Trade-offs

- [Risk] Electron may technically run on macOS 11 while Wikiwise now advertises 14+. -> Mitigation: the migration acceptance standard is parity with the native app, whose current support baseline is macOS 14+.
- [Risk] The native baseline could move in the future. -> Mitigation: the test ties the package script to `Package.swift`, README, and native app metadata so a baseline change exposes the mismatch.
- [Risk] Local unsigned package and canonical release could diverge. -> Mitigation: both paths use the same `scripts/package-electron-macos.mjs` package step.

## Migration Plan

1. Add a failing packaging test for minimum macOS metadata parity.
2. Update the package script to write `LSMinimumSystemVersion` as `14.0`.
3. Repackage and inspect `apps/electron/out/Wikiwise.app/Contents/Info.plist`.
4. Run the standard verification suite, archive this OpenSpec change, and keep the final signed/notarized release gate open.
