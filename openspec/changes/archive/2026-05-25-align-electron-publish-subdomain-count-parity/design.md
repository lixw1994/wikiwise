## Context

The native publish sheet calls `checkSubdomainAvailability`, which uses `subdomain.count >= 3` to decide whether to show `.invalid` locally or schedule an availability check. Electron currently uses `subdomain.length < 3`, which counts UTF-16 code units. After preserving Unicode letters and numbers in the renderer sanitizer, that can diverge from native character counting for some valid input characters.

## Goals / Non-Goals

**Goals:**

- Count sanitized publish subdomain input as Unicode characters for Electron local minimum-length feedback.
- Preserve the current debounce, availability messages, and stale-result guard.
- Keep sanitizer character preservation and no-length-truncation behavior unchanged.

**Non-Goals:**

- Changing server availability validation.
- Adding local maximum-length validation.
- Changing publish dialog copy or visual styling.

## Decisions

- Add a small renderer helper, `publishSubdomainCharacterCount`, implemented with `Array.from(value).length`. For the sanitized value shape, this aligns Electron with Swift `String.count` for the Unicode letters and numbers the renderer now preserves, without introducing dependencies.
- Replace the `.length < 3` local invalid check in `scheduleAvailabilityCheck` with the helper.
- Cover the change with a source parity test asserting Swift uses `subdomain.count >= 3` and Electron no longer uses `.length < 3` for the local check.

## Risks / Trade-offs

- `Array.from` counts Unicode code points, not every possible grapheme cluster. Because the sanitizer removes combining marks and unsupported symbols, the remaining publish subdomain characters are letters, numbers, and hyphens where code point counting is the closest lightweight browser equivalent for this local minimum check.
