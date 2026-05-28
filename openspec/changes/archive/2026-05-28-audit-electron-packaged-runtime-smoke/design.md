## Context

The detailed runtime parity audit exercises the renderer with `electron . --audit-runtime` before the release script packages `Wikiwise.app`. That proves source-tree renderer behavior, but it does not prove that the packaged bundle can boot its copied main process, preload bridge, renderer HTML, shared core package, native resources, and terminal dependency layout. The packaged bundle also cannot reuse `--audit-runtime` today because the external audit script is intentionally not copied into the app bundle.

## Goals / Non-Goals

**Goals:**
- Add a packaged-app smoke audit that launches `apps/electron/out/Wikiwise.app` as a real app bundle.
- Record retained JSON evidence that the packaged app loaded its packaged renderer through its packaged preload.
- Check key packaged resource/dependency surfaces that have caused migration risk: `@wikiwise/core`, `node-pty`, Darwin `spawn-helper` permissions, renderer/preload/main files, and native resources.
- Preserve Electron's framework symlink graph so Chromium resources such as `icudtl.dat` resolve from the app bundle instead of from the source `node_modules` tree.
- Run the packaged smoke audit during full release after packaging and before signing.

**Non-Goals:**
- Replace the detailed pre-package runtime parity audit.
- Run the full seven-scenario visual audit from inside the packaged bundle.
- Bypass release signing, notarization, stapling, or assessment.

## Decisions

- Add a small `--audit-packaged-runtime` mode in Electron main.
  - Rationale: the packaged bundle can verify its own runtime paths without needing to ship the larger source-tree audit script.
  - Alternative considered: copy `scripts/audit-electron-runtime.mjs` into the app. That would add source-tree assumptions and a larger test surface to the production bundle.
- Add `scripts/audit-electron-packaged-runtime.mjs` as the launcher.
  - Rationale: npm scripts stay portable within the repo, the launcher can remove stale reports, spawn the app executable, and validate the produced JSON.
- Keep the packaged audit smoke-level.
  - Rationale: detailed visual parity remains covered by `electron:audit:runtime`; this new gate specifically covers packaging/runtime layout and bootability of the real `.app`.
- Wire full release to run packaged smoke after `npm run electron:package:mac -- "$VERSION"` and before codesigning.
  - Rationale: it catches unsigned local packaging issues before signing/notarization, and it avoids mutating a signed app after signing.
- Copy the Electron template app with verbatim symlinks.
  - Rationale: Electron's framework bundle uses relative symlinks such as `Resources -> Versions/Current/Resources`. Rewriting them as absolute paths back to `node_modules/electron/dist` makes the packaged app depend on the build tree and can break Chromium resource lookup.
  - Alternative considered: repair only the `Resources` symlink after copy. Verbatim symlink copying preserves the entire framework layout instead of fixing one symptom.

## Risks / Trade-offs

- Packaged app launch can be slower or require macOS GUI permissions -> the launcher uses a bounded timeout and the same local execution assumptions as packaging/runtime audit verification.
- Smoke evidence is narrower than the detailed visual audit -> the release keeps the detailed pre-package runtime audit as the first gate.
- The packaged smoke mode is production code behind an audit-only command-line flag -> normal app startup remains unchanged and tests lock the flag path.
- Changing copy semantics could affect package contents -> targeted package tests and actual packaged smoke verify the resulting bundle boots.
