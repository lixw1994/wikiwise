## Context

The native SwiftUI publish sheet lowercases subdomain input and keeps characters where `isLetter`, `isNumber`, or `-` is true. Electron currently lowercases input but filters with an ASCII-only character class, so non-ASCII letters or numbers are removed before availability feedback can mirror the native invalid-state flow.

## Goals / Non-Goals

**Goals:**

- Preserve Unicode letters and numbers in Electron publish subdomain input like the native Swift sanitizer.
- Keep hyphen preservation and unsupported punctuation removal unchanged.
- Keep no renderer-side length truncation.
- Keep availability checks and messages responsible for invalid names.

**Non-Goals:**

- Changing server-side domain validity rules.
- Changing publish config serialization, publish API behavior, or random subdomain generation.
- Changing publish dialog layout, copy, or visual styling.

## Decisions

- Use JavaScript Unicode property escapes in the renderer sanitizer: `/[^\p{L}\p{N}-]/gu`. This maps closely to Swift `Character.isLetter` and `Character.isNumber` without introducing a dependency or hand-maintained ranges.
- Update the existing length parity test to assert the native sanitizer shape without locking Electron to ASCII, and add a focused character parity test that proves Electron no longer uses the ASCII-only regex.

## Risks / Trade-offs

- Unicode values can remain in the input field until availability reports them invalid. This is intentional because the native sheet also preserves them at the local sanitizer step.
