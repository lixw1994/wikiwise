# Wikiwise Electron

This package is the OpenSpec-driven cross-platform desktop workspace for Wikiwise.
It is intentionally small: the current production app remains the SwiftUI macOS
app under `Sources/Wikiwise/`.

## Commands

```sh
npm --prefix apps/electron test
npm run electron:dev
```

`npm run electron:dev` requires dependencies to be installed first:

```sh
npm install
```

The initial shell verifies that Electron can load a renderer through a narrow
preload bridge and read shared resource metadata from `@wikiwise/core`.
