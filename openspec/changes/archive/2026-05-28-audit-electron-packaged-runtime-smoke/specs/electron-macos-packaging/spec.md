## ADDED Requirements

### Requirement: Electron Framework Symlink Preservation
The Electron macOS packaging command SHALL preserve Electron framework symlinks as bundle-relative symlinks.

#### Scenario: Electron template is copied
- **WHEN** `npm run electron:package:mac` copies the installed Electron template app into `apps/electron/out/Wikiwise.app`
- **THEN** Electron framework symlinks such as `Resources`, `Libraries`, `Helpers`, and `Versions/Current` remain relative to the packaged framework bundle
- **AND** the packaged app does not depend on absolute symlink targets inside the source `node_modules/electron/dist` tree for Chromium resources such as `icudtl.dat`
