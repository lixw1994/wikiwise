## Why

Native `ContentView.loadFile(_:)` treats file-read failures as a display fallback: the selected file remains active and the detail view receives the fixed text `Could not read file.`. Electron currently uses the throwing shared `readTextFile` helper for user-visible file content in `wikiwise:readFile`, standalone file opens, and the initial `wiki/home.md` selection, so a read failure can interrupt the open/select flow instead of matching the native detail behavior.

## What Changes

- Add a display-oriented shared read helper that returns `Could not read file.` when UTF-8 file reading fails.
- Route Electron user-visible file content reads through that helper for file selection, standalone file opens, and initial wiki home content.
- Preserve throwing `readTextFile` semantics for internal configuration and other non-display reads.
- Add regression/source coverage tying Electron behavior to native `ContentView.loadFile(_:)`.

## Impact

- Electron matches native read-failure UX for selected file content.
- Internal error handling for settings, publish config, and other non-display reads remains unchanged.
