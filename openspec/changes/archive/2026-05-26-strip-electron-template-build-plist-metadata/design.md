## Context

The Electron macOS package script copies the installed Electron template app and rewrites selected `Info.plist` fields to become `Wikiwise.app`. Recent packaging slices aligned privacy metadata, minimum macOS metadata, and default version metadata with the current native app bundle. A fresh plist comparison still shows template build-provenance keys (`DTCompiler`, `DTSDKBuild`, `DTSDKName`, `DTXcode`, `DTXcodeBuild`) and an added `LSApplicationCategoryType` key that are absent from the native `Wikiwise.app/Contents/Info.plist`.

## Goals / Non-Goals

**Goals:**

- Remove non-runtime Electron template build-provenance plist keys from the packaged app.
- Stop adding `LSApplicationCategoryType` during Electron packaging because the native app bundle does not declare it.
- Preserve Electron runtime-required plist keys and all previously aligned Wikiwise metadata.
- Retain focused regression coverage and package inspection evidence.

**Non-Goals:**

- No attempt to make the Electron plist byte-for-byte identical to the native plist.
- No removal of Electron runtime-required keys such as `NSPrincipalClass`, `NSMainNibFile`, `LSEnvironment`, or `ElectronAsarIntegrity`.
- No change to signed/notarized release execution or release credentials.

## Decisions

- Treat build-provenance `DT*` keys as removable template metadata. They are inherited from the Electron app template, are not declared by the current native app bundle, and are not required to launch the Electron runtime.
- Treat `LSApplicationCategoryType` as out of scope for parity because the native app bundle does not declare it. Removing it narrows local package metadata differences without changing runtime behavior.
- Extend the existing `removeElectronTemplateInfoPlistKeys` cleanup path instead of adding a second plist-cleanup phase. This keeps all non-native template key removal in one place and preserves existing privacy cleanup coverage.
- Keep runtime-required Electron keys explicit by omission from the removal list. This avoids damaging launch behavior while continuing to improve native bundle parity.

## Risks / Trade-offs

- [Risk] Removing a key that future Electron versions rely on could affect launch behavior. -> Mitigation: only remove provenance/category keys that are not runtime bootstrap keys, then run package inspection and runtime audit.
- [Risk] App category metadata can be useful for distribution. -> Mitigation: the current native app does not declare it; adding category metadata later should be an explicit release-process change if needed.
- [Risk] The comparison is based on the checked-in native app bundle. -> Mitigation: tests use that same bundle as current parity evidence, matching the repository's existing packaging parity approach.
