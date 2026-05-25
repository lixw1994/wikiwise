## Context

Native SwiftUI uses `agentCommand(agent:command:)` for each quick-start command. That helper renders a label with `.font(.system(size: 12, weight: .semibold))` and `Color.sidebarText` above the monospaced command. Electron currently renders only three `<pre><code>` blocks, so the agent names are missing from the visual guide even though the commands are populated.

## Goals / Non-Goals

**Goals:**
- Render visible labels for `Claude Code`, `Codex`, and `Cursor`.
- Match native 12px semibold sidebar-text styling for those labels.
- Preserve existing command code IDs and renderer command population behavior.

**Non-Goals:**
- Restyle the command code block chrome, command text padding, background, border radius, or monospaced text in this slice.
- Change guide headings, intro copy, dividers, final guidance, seed options, or dismiss behavior.
- Change native SwiftUI code or scaffold creation behavior.

## Decisions

- Wrap each command `<pre>` in a `.guide-command` container with a `.guide-command-agent` label.
  - Rationale: Native `agentCommand` is a vertical stack with label and command. A wrapper represents that structure while preserving existing command code IDs.
  - Alternative considered: adding labels as siblings without wrappers. That would make per-command spacing and future command chrome parity harder to scope.
- Scope label styling to `.post-create-guide .guide-command-agent`.
  - Rationale: The label is specific to the post-create guide and should not affect other guide paragraphs or global text.

## Risks / Trade-offs

- Additional markup changes the immediate DOM shape around existing command code nodes -> tests preserve the existing command IDs so renderer code continues to target the same nodes.
- Command code chrome remains imperfect -> a later slice can align native padding/background/rounded styling without mixing concerns here.
