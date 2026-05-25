## Context

Native SwiftUI renders each post-create guide command through `agentCommand(agent:command:)`. The command text uses `.font(.system(size: 12, design: .monospaced))`, `Color.sidebarTextMuted`, `.padding(.horizontal, 10)`, `.padding(.vertical, 6)`, `Color.sidebarBg`, and a rounded rectangle with corner radius 4. Electron already mirrors the agent labels and command IDs, but its `<pre>` chrome still has a border, 6px radius, 10px 12px padding, guide-code background, and info-value text color.

## Goals / Non-Goals

**Goals:**
- Match native command text color, background, padding, radius, and borderless chrome.
- Preserve the existing monospaced 12px command font.
- Preserve existing command IDs, populated command text, labels, guide copy, dividers, headings, and dismiss behavior.

**Non-Goals:**
- Change command generation in renderer JavaScript.
- Change the agent label styling already aligned in the previous slice.
- Change seed option list styling, final guide copy, or native SwiftUI code.

## Decisions

- Update `.post-create-guide pre` rather than introducing new command-specific markup.
  - Rationale: The existing `<pre><code id="..."></code></pre>` nodes already represent the command text and are the exact surface whose chrome differs from native.
  - Alternative considered: styling `.guide-command pre` only. The current guide has no other `<pre>` commands, and keeping the rule under `.post-create-guide pre` maintains the established local selector.
- Use existing palette tokens: `--color-sidebar-bg` and `--color-sidebar-text-muted`.
  - Rationale: These are the Electron equivalents of SwiftUI `Color.sidebarBg` and `Color.sidebarTextMuted`.
  - Alternative considered: keep `--color-guide-code-bg`; that preserves a non-native command background and keeps the mismatch alive.
- Keep overflow handling on the `<pre>`.
  - Rationale: Native text selection and clipping do not require layout expansion; Electron still needs horizontal overflow protection for long project paths.

## Risks / Trade-offs

- Removing the border may reduce contrast in some themes -> mitigated by matching the native sidebar background and muted text tokens.
- Styling all post-create guide `<pre>` nodes assumes they are agent command blocks -> acceptable for the current guide; future non-agent code blocks can add a narrower class if needed.
