## Why

Native `ContentView.createNewWiki()` rejects a new wiki name only when the trimmed name is empty. It then filters the non-empty name into a slug and calls `location.appendingPathComponent(slug)` even if the slug is empty. Electron shared core currently adds a stricter empty-slug rejection, so names such as `!!!` fail in Electron while native proceeds to scaffold at the chosen location.

## What Changes

- Align Electron shared scaffold creation with native empty-slug behavior by allowing non-empty names that sanitize to an empty slug.
- Preserve the existing rejection for names that are empty after whitespace trimming.
- Preserve native scaffold file layout, template replacements, resource copying, scaffold-version writing, `.gitignore`, and post-create guide behavior.
- Add core and Electron source regression coverage anchored to `ContentView.swift`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `wikiwise-core-package`: Require native-compatible empty-slug scaffold behavior.
- `electron-new-wiki-scaffold`: Require Electron create-new-wiki to inherit the shared native empty-slug behavior.
- `electron-native-parity-roadmap`: Track new-wiki empty-slug parity as a native scaffold behavior correction phase.

## Impact

- Affected code: `packages/wikiwise-core/src/index.js`
- Affected tests: `packages/wikiwise-core/test/scaffold.test.js`, `apps/electron/test/new-wiki-scaffold.test.js`
- Affected specs: `openspec/specs/wikiwise-core-package`, `openspec/specs/electron-new-wiki-scaffold`, `openspec/specs/electron-native-parity-roadmap`
- No renderer layout, picker, post-create guide copy, packaging, release, dependency, or network changes.
