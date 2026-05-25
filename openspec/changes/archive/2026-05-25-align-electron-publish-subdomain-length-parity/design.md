## Context

The native SwiftUI publish sheet sanitizes subdomain input by lowercasing and filtering to letters, numbers, and hyphens. It keeps the resulting string at its typed length and lets availability feedback report whether the value is valid. Electron currently performs the same lowercase and character filtering, but also truncates the renderer value to 48 characters.

## Goals / Non-Goals

**Goals:**

- Match native publish dialog input behavior by preserving the full sanitized subdomain text.
- Keep invalid-character filtering and lowercase conversion unchanged.
- Keep availability messages, publish enablement, and core publish APIs unchanged.

**Non-Goals:**

- Changing server or core validation for subdomain availability.
- Changing random subdomain generation, which already enforces its own length shape.
- Changing publish dialog layout or visual styling.

## Decisions

- Remove the renderer-only 48-character truncation from `sanitizePublishSubdomain`. Native validation communicates the 3-48 character rule through availability feedback, while the text field itself does not force-trim long input.
- Cover the parity with a source test that proves Swift does not call `prefix`, `String(...prefix...)`, or a similar local truncation in the `pendingSubdomain` sanitizer and proves Electron does not use `.slice(0, 48)` in `sanitizePublishSubdomain`.

## Risks / Trade-offs

- Long subdomain input can remain visible in Electron before availability returns invalid, matching native behavior. Existing row overflow constraints continue to keep the dialog layout stable.
