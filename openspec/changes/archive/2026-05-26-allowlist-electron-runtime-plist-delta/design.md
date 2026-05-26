## Context

The Electron package command starts from Electron's macOS template, rewrites Wikiwise product metadata, removes known non-native template keys, renames the executable, and copies Wikiwise resources. The current packaged `Info.plist` still contains top-level keys that the checked-in native app bundle does not declare, including Electron runtime integrity, nib, principal class, memory environment, and graphics/runtime behavior metadata.

Those keys are not the same kind of gap as previously removed privacy, build-provenance, icon, or `PkgInfo` template leftovers. Removing runtime keys risks breaking Electron startup or runtime behavior. Leaving them uncategorized, however, weakens the final parity audit because new package-only template keys could appear without review.

## Goals / Non-Goals

**Goals:**

- Treat remaining package-only `Info.plist` keys as an explicit Electron runtime delta.
- Fail packaging if any top-level packaged plist key is neither present in the native app plist nor listed in the Electron runtime allowlist.
- Keep the validation dependency-light and local to the existing package script.
- Preserve the existing unsigned local package behavior and the separate signed/notarized release gate.

**Non-Goals:**

- Do not remove Electron runtime-required plist keys in this slice.
- Do not change the Electron app executable, embedded resources, signing identity, notarization flow, or DMG release process.
- Do not claim final migration completion; signed and notarized release execution remains required unless OpenSpec accepts a later deviation.

## Decisions

- Add an explicit `electronRuntimeInfoPlistKeyAllowlist` in `scripts/package-electron-macos.mjs`.
  - Rationale: the package script is the point where Electron template metadata becomes Wikiwise release metadata, so drift should fail before release signing begins.
  - Alternative considered: document the keys only. That preserves context but does not stop future template drift.

- Compare only top-level plist keys.
  - Rationale: native-visible bundle metadata parity is decided at the top-level key boundary; nested keys under `ElectronAsarIntegrity` and `LSEnvironment` are values of allowed runtime metadata.
  - Alternative considered: parse every nested key. That would misclassify integrity hashes, file paths, and environment values as independent bundle metadata.

- Implement a small XML token scanner instead of adding a plist dependency.
  - Rationale: the existing script already edits XML plist text directly and the repository keeps default validation lightweight. A top-level key scanner is enough for this guard.
  - Alternative considered: call `plutil` from Node. That would be macOS-specific twice over and harder to test in the existing dependency-light Node tests.

## Risks / Trade-offs

- Electron may add a new runtime-required top-level key in a future upgrade -> packaging will fail until the key is reviewed and added to the allowlist with spec/test coverage.
- XML scanning is narrower than a full plist parser -> the scanner only recognizes the plist shapes produced by Electron and the checked-in native app, and tests lock that expected behavior.
- The allowlist is an accepted runtime delta, not native identity -> retained verification must continue to state that final migration still requires a signed/notarized Electron release or a later accepted deviation.
