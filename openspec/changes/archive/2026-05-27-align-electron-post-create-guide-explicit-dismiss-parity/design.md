## Context

Native `ContentView` has a single state variable for the guide:

```swift
@State private var showPostCreateGuide = false
```

The successful create path sets it to true, and the guide is rendered before selected file or generated page content:

```swift
showPostCreateGuide = true
openURL(wikiURL)
```

```swift
if showPostCreateGuide, let root = rootURL {
    postCreateGuide(wikiURL: root)
}
```

The native guide clears the flag only in the `Got it — start reading` button. Native `navigateTo(_:)`, generated map navigation, `goBack()`, and `goForward()` do not mutate `showPostCreateGuide`, so incidental navigation does not dismiss the guide.

Electron already shows and dismisses the guide, but `selectFile()` and `showGeneratedPage()` clear `state.showPostCreateGuide`, so file selection and generated-page navigation hide it earlier than native.

## Goals / Non-Goals

**Goals:**

- Match native explicit-dismiss guide visibility semantics.
- Keep file selection and generated-page navigation state updates available behind the guide without hiding the guide.
- Preserve the existing `Got it — start reading` dismissal flow and home-file selection behavior.
- Preserve scaffold failure behavior: failed creation still closes the dialog and does not show the guide.

**Non-Goals:**

- Changing native SwiftUI behavior.
- Changing guide copy, guide layout, command rendering, or seed options.
- Changing successful project opening after new-wiki creation.
- Claiming final migration completion; signed/notarized release evidence remains required.

## Decisions

- Remove the guide-clearing side effect from `selectFile()`. This keeps sidebar file clicks aligned with native `navigateTo(_:)`, which loads the selected file but leaves `showPostCreateGuide` untouched.
- Remove the guide-clearing side effect from `showGeneratedPage()`. This keeps map/generated-page navigation aligned with the native toolbar map path, which updates selected/generated state but leaves the guide untouched.
- Leave `applyProjectResult(..., { showPostCreateGuide: true })` unchanged so successful new-wiki creation still opens with the guide visible, while ordinary project opens continue to start without the guide.
- Leave `dismissPostCreateGuide()` unchanged as the only explicit hide path.

## Risks / Trade-offs

- Users can select files behind the guide without seeing the selection until they dismiss it. This matches the current native SwiftUI state behavior.
- Generated-page state can also be prepared behind the guide. The guide remains the visible first priority until explicit dismissal, matching the native detail view ordering.
