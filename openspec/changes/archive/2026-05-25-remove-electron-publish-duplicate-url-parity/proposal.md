## Why

The native macOS publish sheet shows the final URL shape only inside the editable URL row. The Electron dialog currently renders a second standalone URL line below that row, adding non-native visual noise and extra vertical height.

## What Changes

- Remove the visible standalone publish URL paragraph from the Electron publish dialog.
- Stop updating the removed URL paragraph from renderer state.
- Keep the native URL row structure, subdomain editing, availability checking, and publish result URL copy unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-publishing`: Tighten publish dialog visual parity so the dialog does not show a duplicate standalone URL outside the native URL row.

## Impact

- Affects Electron renderer HTML and JavaScript for the publish dialog.
- Adds publishing parity regression coverage.
- Updates the `electron-publishing` OpenSpec capability.
