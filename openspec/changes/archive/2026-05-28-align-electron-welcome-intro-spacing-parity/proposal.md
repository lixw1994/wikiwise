## Why

Native welcome view groups the large `W` mark and summary copy in an inner `VStack(spacing: 12)`, then separates that intro group, the action group, and the hint with 32pt spacing. Electron currently renders the mark and summary as separate outer grid children, so their gap follows the 32px outer rhythm instead of the native 12px intro rhythm.

## What Changes

- Add source-backed coverage for the native welcome intro grouping and 12pt mark-to-summary spacing.
- Wrap Electron's centered welcome mark and summary copy in a dedicated welcome intro group.
- Style that intro group with the native 12px internal gap while preserving the outer 32px welcome rhythm.
- Preserve welcome copy, mark typography/colors, action group spacing, toolbar brand, and existing welcome button behavior.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `electron-native-shell-parity`: Adds native welcome intro grouping/spacing parity.
- `electron-native-parity-roadmap`: Records welcome intro spacing parity as an archived native shell visual correction phase.

## Impact

- Affects Electron renderer HTML and CSS for the no-folder welcome screen only.
- Adds native shell parity regression coverage.
- No native Swift source, JavaScript behavior, API, dependency, packaging script, or release workflow changes.
