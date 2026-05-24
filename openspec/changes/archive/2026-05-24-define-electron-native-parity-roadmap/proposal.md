## Why

The migration goal is larger than a single change: the Electron app must eventually match the current SwiftUI macOS app feature-for-feature. A phased OpenSpec roadmap is needed so each batch can be scoped, validated, and archived without losing the full parity target.

## What Changes

- Add an `electron-native-parity-roadmap` capability that defines the full parity acceptance target.
- Inventory the current native app feature areas that must be migrated.
- Define the phase order that future OpenSpec changes should follow.
- Establish that each phase must retain evidence showing whether it reaches parity or intentionally leaves later-phase gaps.

## Success Criteria

- A baseline parity roadmap spec exists under `openspec/specs` after archive.
- The roadmap names every major current native feature surface: app shell, project lifecycle, file tree, editor, wiki preview, compiler, watcher, terminal, publish, scaffold, appearance, navigation, map, persistence, menus, packaging, and agent workflow integration.
- Future changes can reference the roadmap to decide whether work is in scope and what remains incomplete.

## Non-Goals

- Implementing Electron feature parity in this roadmap change.
- Declaring the Electron app production-ready.
- Replacing detailed phase-specific specs, designs, tasks, or verification files.

## Capabilities

### New Capabilities

- `electron-native-parity-roadmap`: Full migration acceptance target and phase order for matching the SwiftUI macOS app in Electron.

### Modified Capabilities

- None.

## Impact

- Adds OpenSpec artifacts only.
- Does not modify runtime code.
- Guides future changes under `apps/electron` and `packages/wikiwise-core`.
