## Context

The repository already has a signed, notarized Swift release script at `scripts/build-release.sh`, and Electron dependencies are installed through npm workspaces. The Electron app can run in development mode, and an earlier preview bundle exists under ignored `apps/electron/out/`, but there is no checked-in packaging command that assembles the current Electron app source and shared core package into a launchable macOS `.app`.

## Goals / Non-Goals

**Goals:**

- Add a reproducible local macOS `.app` packaging command for the Electron workspace.
- Keep packaging dependency-light by using the installed Electron runtime at `node_modules/electron/dist/Electron.app`.
- Assemble `apps/electron/out/Wikiwise.app` with Wikiwise product metadata.
- Embed only the runtime files needed by the Electron app: Electron package metadata, main/preload/renderer sources, and `@wikiwise/core`.
- Add tests that verify packaging contract, bundle metadata, embedded app layout, and release guardrails.
- Document how this local Electron packaging phase relates to the existing signed/notarized Swift release script.

**Non-Goals:**

- Do not add `electron-builder`, `electron-forge`, or other network-installed packaging dependencies.
- Do not replace `scripts/build-release.sh` or bypass its signing/notarization/DMG behavior.
- Do not sign, notarize, staple, or create a DMG for Electron in this phase.
- Do not claim final migration completion; final parity audit remains separate.

## Decisions

1. **Use a local Node packaging script.** A checked-in `scripts/package-electron-macos.mjs` will copy Electron's installed `.app` template, rewrite metadata, rename the executable, and populate `Contents/Resources/app`. Alternative: adopt `electron-builder`. I am avoiding a new dependency because the current workflow values lightweight, offline-verifiable steps and the immediate need is a concrete local app bundle.

2. **Embed source files, not an asar archive.** The script will copy `apps/electron/package.json`, `src/`, and a minimal `node_modules/@wikiwise/core` folder. Alternative: archive into `app.asar`. Source embedding is easier to inspect and verify during migration; asar can be introduced during the final release hardening phase if desired.

3. **Package as `Wikiwise.app`.** The bundle display name, executable, and app folder use `Wikiwise` to move toward native parity. The npm workspace name remains `@wikiwise/electron-app` so development and tests can still distinguish the workspace.

4. **Keep release signing separate.** This phase creates a local, unsigned app bundle. The existing Swift release script remains the only signed/notarized DMG path until a later release-specific change explicitly wires Electron into signing, notarization, and DMG creation.

## Risks / Trade-offs

- **Unsigned app may trigger Gatekeeper when moved between machines** -> Document this as a local packaging artifact and retain signing/notarization for the release gate.
- **Manual Electron template copy can drift with Electron versions** -> Structural tests verify required source strings and a package command run verifies current installed Electron layout.
- **Source embedding exposes implementation files** -> Acceptable for this migration phase; asar packaging can be added later without changing app behavior.
- **Bundle identifier collision with Swift app** -> Use Wikiwise-facing product metadata while keeping this as a local build artifact under `apps/electron/out/`.

## Migration Plan

1. Add failing structural tests for package scripts, packaging implementation, metadata rewrites, embedded app layout, and release guardrails.
2. Implement `scripts/package-electron-macos.mjs`.
3. Add root and workspace npm scripts.
4. Update Electron README with package command and local unsigned-app note.
5. Run Electron tests, root tests, the package command, OpenSpec validation, Swift build, and whitespace checks.
