## Verification Evidence

- Red test: `npm --prefix apps/electron test` failed before implementation on missing Electron release audit/package/signing/notary contract, missing entitlements, and stale release docs.
- `bash -n scripts/build-release.sh` passed.
- `npm --prefix apps/electron test` passed with 57 Electron tests.
- `npm run electron:audit:runtime` passed with four PASS scenarios: `welcome-light`, `welcome-dark`, `project-light`, and `project-dark`.
- `npm run electron:package:mac` passed and produced `apps/electron/out/Wikiwise.app`.
- Package inspection confirmed `CFBundleDisplayName=Wikiwise`, `CFBundleIdentifier=com.readwise.wikiwise`, `CFBundleShortVersionString=0.0.0`, and embedded Electron app/core files under `Contents/Resources/app`.
- `npm test` passed with 57 Electron tests and 24 core tests.
- `openspec validate harden-electron-release-distribution --strict` passed.
- `git diff --name-only -- Sources/Wikiwise` produced no output.
- `swift build` passed.
- `git diff --check` passed.

## Credential-Dependent Release Gate

`bash scripts/build-release.sh <version>` was not executed to completion locally because production signing and notarization require a Developer ID signing identity and Apple notary keychain profile. The script now keeps these as mandatory non-test release steps instead of adding a bypass.
