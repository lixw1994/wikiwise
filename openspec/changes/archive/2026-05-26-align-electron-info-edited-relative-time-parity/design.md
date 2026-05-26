## Context

Native `RightSidebar.formattedModDate(_:)` uses `RelativeDateTimeFormatter` with `.unitsStyle = .full` and returns `localizedString(for:relativeTo:)` directly. That formatter remains relative for old timestamps and uses numeric values in the current locale. Electron's `formatEditedTime()` currently uses `Intl.RelativeTimeFormat(undefined, { numeric: "auto" })` for durations under one week, then falls back to `Intl.DateTimeFormat`, which can display `yesterday` or an absolute date where native shows numeric relative text.

## Goals / Non-Goals

**Goals:**
- Match native INFO edited-time behavior with numeric relative output.
- Keep edited-time formatting localized through platform APIs.
- Extend relative formatting beyond days to weeks, months, and years.

**Non-Goals:**
- Change modified-time collection in the core document-info helper.
- Change PATH, WORDS, directions, wikilinks, terminal behavior, tab switching, or sidebar layout.
- Add external date libraries or fixed-locale formatting.

## Decisions

- Keep formatting in the renderer because the displayed relative string depends on the current time and locale.
- Use `Intl.RelativeTimeFormat(undefined, { numeric: "always", style: "long" })` to mirror native numeric full-unit output rather than named shortcuts like `yesterday`.
- Choose the largest useful unit by elapsed duration: seconds, minutes, hours, days, weeks, months, then years. This preserves existing short-interval behavior while removing the absolute-date fallback for older files.

## Risks / Trade-offs

- Calendar month/year boundaries may not be identical to Swift's formatter in every locale. Mitigation: use localized platform relative formatting and source tests to ensure Electron no longer uses the known divergent absolute-date/named-output path.
- Existing runtime audit may not pin an old modified timestamp. Mitigation: retain source-level parity coverage and keep the broader runtime audit as a regression gate for the INFO panel.
