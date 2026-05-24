## Verification Evidence

- `npm --prefix apps/electron test` passed with 54 Electron tests.
- `node --check scripts/audit-electron-runtime.mjs` passed.
- `node --check apps/electron/src/main/main.js` passed.
- `npm run electron:audit:runtime` passed and generated `apps/electron/out/runtime-audit/report.json` plus four screenshots under `apps/electron/out/runtime-audit/screenshots/`.
- Runtime report evidence: 4 scenarios, all `ok: true`; titles all `Wikiwise`; resource panels all absent; publish and new-wiki dialogs all hidden; project scenarios selected `home.md`; shell rects all `1180x780`.
- Representative screenshots inspected: `welcome-light.png` and `project-light.png`.
- `npm test` passed with 54 Electron tests and 24 core tests.
- `openspec validate audit-electron-runtime-parity --strict` passed.
- `git diff --name-only -- Sources/Wikiwise` produced no output.
- `swift build` passed.
- `git diff --check` passed.
