## Context

`Sources/Wikiwise/ContentView.swift` renders the publish sheet intro line `Your wiki will be available at:` with `.font(.system(size: 13))` and `.foregroundStyle(.secondary)`. Electron has the same copy in `apps/electron/src/renderer/index.html`, but it currently shares `.compact-summary`, whose CSS sets `font-size: 12px` for compact publish text such as the token warning.

## Goals / Non-Goals

**Goals:**

- Match the native 13px intro text size for the Electron publish URL section.
- Keep the intro copy using muted/secondary summary coloring.
- Keep the publish token warning and feedback compact summary text at 12px.

**Non-Goals:**

- Changing the publish URL row typography, layout, padding, chrome, or behavior.
- Changing publish availability hint typography.
- Changing publish dialog copy or publishing state behavior.

## Decisions

- Add a dedicated class to the intro paragraph instead of changing `.compact-summary`. This narrows the visual change to the native 13pt intro line and prevents the token warning and result message from inheriting the larger size.
- Set the dedicated intro class to `font-size: 13px` in the renderer stylesheet. The existing `.summary` color treatment remains the Electron secondary-text equivalent for this line.
- Cover the change with a source parity test that ties the SwiftUI 13pt intro declaration to the Electron markup and CSS while asserting the shared compact summary rule remains 12px.

## Risks / Trade-offs

- The intro line becomes slightly larger than other compact helper text in the publish dialog. That asymmetry is intentional because it mirrors the native sheet, where the intro is 13pt and the token warning remains 12pt.
