# Design: Electron Toolbar Title Offset Parity

## Native Reference
`ContentView.swift` centers the folder name in the toolbar but offsets it when the left sidebar is visible:

```swift
.offset(x: sidebarVisibility == .all ? -(leftSidebarWidth / 2) : 0)
```

This compensates for the visible left sidebar so the title is visually aligned with the native project chrome.

## Electron Approach
Add a CSS variable on `#project`:

```css
--toolbar-title-offset: 0px;
```

Apply it to `.toolbar-project-title`:

```css
transform: translateX(var(--toolbar-title-offset));
```

During `renderProjectToolbar()`, compute:

- if left sidebar is visible: `-Math.round(leftSidebar.getBoundingClientRect().width / 2)`
- if left sidebar is hidden: `0`

Store that value as `--toolbar-title-offset`.

This keeps the behavior data-driven instead of hard-coding the current `260px` sidebar width. It also preserves future compatibility if the left sidebar becomes resizable.

## Runtime Audit
The audit will record `toolbarTitleOffsetEvidence` for project scenarios:

- left sidebar width
- initial toolbar title offset
- hidden toolbar title offset after a hide action
- restored toolbar title offset after a restore action

The audit fails if the initial/restored offset is not negative half of the visible left-sidebar width, or if the hidden offset does not reset to `0`.

## Risks
- `transform` changes visual position but not grid layout allocation. That matches the native visual compensation and avoids reflowing toolbar groups.
- Measurement depends on rendered layout. Runtime audit evidence should guard against regressions where the CSS variable is present but no visual offset is applied.
