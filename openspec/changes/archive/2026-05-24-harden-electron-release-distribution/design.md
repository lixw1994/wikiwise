## Context

The Electron migration has a local packaging script at `scripts/package-electron-macos.mjs`, runtime parity evidence through `npm run electron:audit:runtime`, and the existing canonical release command `bash scripts/build-release.sh <version>`. The release command currently builds the Swift app, signs it, creates a DMG, notarizes, and staples. The next step is to keep the same release command and security gate while switching the built artifact to Electron.

## Goals / Non-Goals

**Goals:**

- Make `scripts/build-release.sh` the canonical Electron release flow.
- Run the Electron runtime audit before producing release artifacts.
- Package Electron with the checked-in packaging script, then sign the app with hardened runtime entitlements.
- Create, sign, notarize, staple, and assess `Wikiwise-macOS.dmg`.
- Keep local structural verification possible without Developer ID credentials.

**Non-Goals:**

- Do not publish a GitHub release.
- Do not add Electron builder/signing dependencies.
- Do not modify Swift feature code.
- Do not claim production notarization has run unless the release command actually completes with credentials.

## Decisions

1. **Keep one canonical release command.** The release guardrail in `CLAUDE.md`, `openspec/project.md`, and OpenSpec config already says releases use `bash scripts/build-release.sh <version>`. Reusing that command avoids a split native/Electron release path.

2. **Use the existing Electron packager as the app assembly boundary.** `scripts/build-release.sh` will call the npm package script rather than duplicating app bundle assembly logic in shell.

3. **Use built-in macOS DMG tooling.** The script will stage `Wikiwise.app` with an `/Applications` symlink and use `hdiutil create` to produce the DMG. This avoids introducing a new package dependency while preserving a drag-to-Applications style image.

4. **Add Electron entitlements explicitly.** A checked-in entitlements plist keeps hardened runtime signing reviewable and testable. The script will pass it to `codesign`.

5. **Make missing prerequisites fail loudly.** The release flow will check required commands and signing identity before packaging, and the notarization/stapling steps remain mandatory in the non-test release path.

## Risks / Trade-offs

- The actual notarization step depends on Apple credentials and network access, so local validation can only prove that the gate exists, not complete it.
- Manual shell signing is less feature-rich than dedicated Electron release tools, but it keeps dependencies small and aligns with the existing repository release style.
- Switching the canonical release script changes rollback expectations. The archived change and git history preserve the previous Swift release script if the Electron migration needs to be reverted.

## State Model

- **Preflight:** version, tools, signing identity, and source prerequisites are checked.
- **Audit:** `npm run electron:audit:runtime` must pass before release artifacts are created.
- **Package:** `npm run electron:package:mac -- <version>` creates `apps/electron/out/Wikiwise.app`.
- **Sign:** the app is signed and verified with hardened runtime options.
- **Image:** a staging folder is converted to `Wikiwise-macOS.dmg`.
- **Release gate:** the DMG is signed, notarized, stapled, assessed, and only then reported as complete.

## Migration Plan

Update tests first to lock the release contract, then update `scripts/build-release.sh`, add Electron entitlements, and revise documentation. Verification will include syntax/structural checks, Electron tests, runtime audit, local Electron packaging, OpenSpec validation, `swift build`, and diff hygiene. A real production release remains a credential-dependent manual check after this change.

## Open Questions

- Which exact Developer ID identity and notary profile should the release machine use if they differ from the current Readwise defaults? The script will keep defaults overrideable through environment variables.
