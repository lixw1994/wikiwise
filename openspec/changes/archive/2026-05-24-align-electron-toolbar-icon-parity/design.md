# Design: Electron Toolbar Icon Parity

## Context
Native SwiftUI uses `Image(systemName:)` for opened-project toolbar actions:

- Appearance: `circle.lefthalf.filled`, `sun.max.fill`, or `moon.fill`
- 3D map: `map`
- Left sidebar restore: `sidebar.left`
- Right sidebar: `sidebar.right`

Electron currently renders the appearance mode name and `Map` as visible button text. The change should narrow the visible difference while keeping the DOM simple and testable.

## Approach
Add a small renderer helper:

```js
setToolbarButtonSymbol(button, symbol)
```

The helper replaces a toolbar button's contents with:

```html
<span class="toolbar-symbol" data-native-symbol="..." aria-hidden="true">...</span>
```

It also sets the button's `title` and `aria-label`. `aria-pressed`, selected state, disabled state, and click handlers remain owned by the existing toolbar state rendering.

Symbol mapping stays local to the renderer:

- `Auto` -> `circle.lefthalf.filled`
- `Light` -> `sun.max.fill`
- `Dark` -> `moon.fill`
- map -> `map`
- left sidebar -> `sidebar.left`
- right sidebar -> `sidebar.right`

Fallback glyphs use plain text glyphs because Electron cannot directly render SF Symbols from web content without extra assets. The `data-native-symbol` attribute is the stable parity contract; the fallback glyph is only the visual substitute.

## Runtime Audit
The audit records `toolbarIconEvidence` for project scenarios:

- native symbol names on appearance, map, left sidebar, and right sidebar controls
- visible button text for icon-only controls
- a boolean indicating whether prohibited text labels are visible

The audit fails project scenarios if the appearance symbol is not one of the native mode symbols, the map/right/left sidebar symbols are missing, or visible text labels remain on icon-only controls.

## Risks
- Glyph shapes are approximate rather than exact SF Symbols. This is acceptable for this phase because the stable semantic mapping is explicit and future asset work can replace only the visual layer.
- Left-sidebar toggle visibility still differs from SwiftUI's system split-view affordance. This remains a known follow-up because removing the Electron control while the sidebar is open would currently remove the only hide action.
