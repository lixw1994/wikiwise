## Context

`Sources/Wikiwise/ContentView.swift` renders publish availability hint text through a switch: `taken` is red, `invalid` is orange, `owned` is blue, and the default branch, including available, checking, and unknown, is secondary. Electron already mirrors the native copy, but `.publish-availability[data-state="available"]` shares green styling with `owned`, and `invalid` shares red styling with `taken`.

## Goals / Non-Goals

**Goals:**

- Match native availability hint colors for Electron publish dialog states.
- Keep availability messages, state names, debounce behavior, publish enablement, and inline indicator behavior unchanged.
- Preserve publish dialog layout and hint typography.

**Non-Goals:**

- Changing availability indicator colors or glyphs.
- Changing publish availability API behavior.
- Changing publish hint copy.

## Decisions

- Remove the `available` hint override so the default `.publish-availability` secondary color applies to available, checking, unknown, and fallback states, matching SwiftUI's default branch.
- Keep `owned` as a distinct blue hint state.
- Split `taken` and `invalid` hint styling so taken remains red and invalid becomes orange.
- Cover the mapping with a source parity test that verifies the native switch foreground styles and the Electron CSS selectors, while checking that the indicator colors remain outside this slice.

## Risks / Trade-offs

- Available no longer uses a success color in the hint text. That is intentional because the native sheet communicates availability through the enabled Publish action and the inline success indicator while the hint text stays secondary.
