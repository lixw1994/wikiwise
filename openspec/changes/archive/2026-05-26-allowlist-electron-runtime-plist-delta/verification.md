## Verification

### TDD red

- `node --test apps/electron/test/macos-packaging.test.js` failed as expected with 17 passing tests and 2 failing tests.
- The failing tests showed the missing `electronRuntimeInfoPlistKeyAllowlist` package audit and missing README documentation for package-only runtime plist delta auditing.

### Focused green

- `node --test apps/electron/test/macos-packaging.test.js` passed with 19 passing tests.

### Package evidence

- `npm run electron:package:mac` passed and produced `apps/electron/out/Wikiwise.app`.
- Packaged `Contents/Info.plist` keeps native-aligned Wikiwise metadata and only adds reviewed Electron runtime keys: `CFBundleInfoDictionaryVersion`, `ElectronAsarIntegrity`, `LSEnvironment`, `NSMainNibFile`, `NSPrefersDisplaySafeAreaCompatibilityMode`, `NSPrincipalClass`, `NSQuitAlwaysKeepsWindows`, `NSRequiresAquaSystemAppearance`, and `NSSupportsAutomaticGraphicsSwitching`.
- Native `Wikiwise.app/Contents/Info.plist` does not declare those package-only Electron runtime keys.
- Packaged `Contents` still contains `Info.plist`, `MacOS/Wikiwise`, `Resources/Wikiwise.icns`, and `Resources/default_app.asar`.

### Full verification

- `npm test` passed with 176 Electron tests and 28 core tests.
- `swift build` passed.
- `openspec validate allowlist-electron-runtime-plist-delta --strict` passed.
- `openspec validate --all --strict` passed with 33 items.
- `git diff --check` passed.
- `npm run electron:package:mac` passed after the full workspace checks.
- `npm run electron:audit:runtime` passed seven runtime scenarios: `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
