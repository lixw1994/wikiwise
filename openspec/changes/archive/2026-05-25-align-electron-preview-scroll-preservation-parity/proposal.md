## Why

The native macOS app captures the active WebView scroll fraction before switching between FILE and WIKI modes, then restores that position when the target view loads. Electron currently preserves CodeMirror editor scroll but does not preserve compiled Wiki preview iframe scroll, so switching away from a long rendered page and back can reset the reading position.

## What Changes

- Capture the compiled preview iframe scroll fraction when leaving WIKI mode.
- Restore the saved preview scroll fraction after the compiled preview iframe loads.
- Keep existing editor scroll preservation, generated-page rendering, preview compilation, and navigation behavior unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-compiler-preview`: Require compiled Wiki preview mode to preserve and restore scroll position like the native WebView.

## Impact

- Affects Electron renderer preview mode behavior.
- Adds focused Electron parity regression coverage.
- Updates the `electron-compiler-preview` OpenSpec capability.
