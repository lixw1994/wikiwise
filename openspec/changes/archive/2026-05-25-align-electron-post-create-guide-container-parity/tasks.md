## 1. Parity Coverage

- [x] 1.1 Add a renderer parity test proving the native post-create guide uses 40px padding, a 560px leading content column, and `Color.contentBg`, while Electron mirrors those scoped layout tokens.
- [x] 1.2 Run the targeted new-wiki scaffold test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Update the Electron post-create guide container CSS to use the native content background, 40px inset, and 560px direct-content max width without changing copy or behavior.
- [x] 2.2 Re-run the targeted new-wiki scaffold test and confirm it passes.

## 3. Verification

- [x] 3.1 Run `npm test`.
- [x] 3.2 Run `swift build`.
- [x] 3.3 Run `openspec validate --all --strict`.
- [x] 3.4 Run `git diff --check`.
- [x] 3.5 Run `npm run electron:package:mac`.
