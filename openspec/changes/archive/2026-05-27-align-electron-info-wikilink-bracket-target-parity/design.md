## Context

The native parser is a simple scanner. After finding an opening `[[`, it finds the next `]]`, takes everything before that closing pair as the raw target, skips empty targets, and preserves first-seen order. A regex character class that excludes `]` does not model this behavior.

## Decisions

- Replace the current wikilink regex with a shortest-match pattern that captures any content up to the next `]]`.
- Keep empty-target filtering and first-seen de-duplication unchanged.
- Keep preserving raw target whitespace exactly as native does.
- Add core behavior coverage and Electron source coverage that anchors the native scanner behavior to shared core extraction.

## Risks

- The shortest-match regex can capture multiline targets, matching the native scanner's text-wide search. That may surface links Electron previously ignored, which is intentional for native parity.
