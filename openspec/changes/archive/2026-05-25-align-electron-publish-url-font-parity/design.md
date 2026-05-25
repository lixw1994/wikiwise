## Context

The native `publishConfirmSheet` applies `.font(.system(size: 13, design: .monospaced))` to each visible element in the editable URL row: `https://`, the subdomain `TextField`, and `.wiki-wise.com`. Electron already matches the row layout and chrome, but `.publish-url-row` still sets `font-size: 12px`.

## Goals / Non-Goals

**Goals:**

- Match the native 13px monospaced URL row text size in Electron.
- Keep the subdomain input inheriting the row font.
- Preserve row layout, padding, border radius, background, and availability indicator dimensions.

**Non-Goals:**

- Changing the availability hint font size.
- Changing the token warning or other compact summary text.
- Changing publish dialog behavior or copy.

## Decisions

- Set `.publish-url-row { font-size: 13px; }`. The subdomain input already inherits the row font, so no separate input override is needed.
- Cover this with a source parity test that asserts the native URL row uses 13pt monospaced text and the Electron row uses 13px while the input continues to inherit.

## Risks / Trade-offs

- The editable URL text becomes slightly larger than the previous Electron rendering. This is intentional to match the native sheet; the row already has fixed grid constraints for the input and indicator.
