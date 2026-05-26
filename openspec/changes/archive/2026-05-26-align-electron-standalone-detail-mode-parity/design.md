## Context

SwiftUI initializes `detailMode` to `.compiled`. For folder projects this naturally shows the compiled WIKI preview when `wiki/home.md` compiles. For standalone file opens, SwiftUI still preserves the compiled mode selection, but the detail view falls back to `EditorWebView` if there is no compiled URL. Electron already has the fallback render path for `state.detailMode === "wiki" && !wikiAvailable`, but `setSelectedFile()` currently derives `"file"` whenever no compiled preview is present.

## Goals / Non-Goals

**Goals:**
- Match the native initial detail mode for standalone markdown file opens.
- Preserve editor fallback rendering when WIKI mode lacks compiled output.
- Keep compiled project markdown files and generated pages behaving as they do now.
- Keep non-markdown files in FILE/editor mode so CSS, JSON, and other plain files are not presented as WIKI-mode content.

**Non-Goals:**
- Add compilation for standalone files.
- Change main-process standalone file project-result semantics.
- Change user-initiated FILE/WIKI mode switching.
- Change runtime release readiness or signing behavior.

## Decisions

- Initialize renderer detail mode to `"wiki"` to mirror SwiftUI's `.compiled` state.
- Add a small `initialDetailModeForFile(file)` helper so standalone markdown fallback and non-markdown editor behavior are explicit and testable.
- Continue using `hasCompiledPreview(file)` for rendering the preview iframe, not for deciding whether WIKI can be the selected mode. This preserves the native pattern where mode state and display fallback are separate.

## Risks / Trade-offs

- A markdown file without compiled output may show WIKI selected while displaying an editor. Mitigation: this is the native behavior being matched, and existing render fallback already describes it.
- Existing tests may assume no compiled preview means FILE mode. Mitigation: update coverage to distinguish mode state from visible fallback.
- Runtime audit may already pass because it focuses folder projects. Mitigation: keep this slice source-level and still run the full runtime audit as the broader regression gate.
