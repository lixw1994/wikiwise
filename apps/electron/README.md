# Wikiwise Electron

This package is the OpenSpec-driven cross-platform desktop workspace for Wikiwise.
It is intentionally small: the current production app remains the SwiftUI macOS
app under `Sources/Wikiwise/`.

## Commands

```sh
npm --prefix apps/electron test
npm run electron:dev
npm run electron:package:mac
```

`npm run electron:dev` requires dependencies to be installed first:

```sh
npm install
```

The initial shell verifies that Electron can load a renderer through a narrow
preload bridge and read shared resource metadata from `@wikiwise/core`.

## Local macOS package

`npm run electron:package:mac` assembles a local Electron app bundle at
`apps/electron/out/Wikiwise.app` using the installed Electron runtime from
`node_modules/electron/dist/Electron.app`.

This app bundle is unsigned and intended for local migration verification. A
signed, notarized DMG remains a separate release gate and must not bypass the
existing release signing, notarization, and DMG packaging checks.
