## 1. Parity Coverage

- [x] 1.1 Add a renderer parity test proving native post-create guide section headings use 10px semibold typography, `.tracking(1.5)`, and `Color.sidebarHeader`, while Electron mirrors those scoped heading styles without changing global eyebrow styling.
- [x] 1.2 Run the targeted new-wiki scaffold test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Add scoped Electron CSS for post-create guide section heading typography, tracking, color, and transform behavior.
- [x] 2.2 Re-run the targeted new-wiki scaffold test and confirm it passes.

## 3. Verification

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run `git diff --check`.
- [x] 3.5 Run `npm run electron:package:mac`.
