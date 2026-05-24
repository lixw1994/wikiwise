## Scope

Define the long-lived Electron native parity roadmap and make it the anchor for phased migration changes.

## Covers

Tasks: 1.1, 1.2, 1.3, 2.1, 2.2

Validation Focus: VF-OpenSpec, VF-Inventory, VF-Evidence

## Plan Type

lightweight

## Execution Strategy

standard

## Ordered Steps

1. Inspect Swift source to inventory native app surfaces.
2. Write roadmap proposal, spec, design, review, tasks, and plan.
3. Validate the change strictly.
4. Write retained verification evidence.
5. Mark validation tasks complete after evidence exists.

## Validation Per Step

1. Source inspection includes `ContentView`, `WikiwiseApp`, `Compiler`, `FileWatcher`, `Publisher`, `WikiScaffold`, `RightSidebar`, and `TerminalEmbed`.
2. OpenSpec status reports all artifacts complete.
3. `openspec validate define-electron-native-parity-roadmap --strict` passes.
4. `verification.md` records commands and roadmap gaps.
5. `tasks.md` checkboxes match actual completion.

## Files / Owners

- `openspec/changes/define-electron-native-parity-roadmap/*`

## Completion Checkpoint

The roadmap change is complete when it validates strictly and retained verification evidence records the full parity target.

## Completion Verification

Retained evidence must be written to `openspec/changes/define-electron-native-parity-roadmap/verification.md`.

## Debugging Trail

Not active.

## Review Follow-Up

No external findings.

## Delegation Units

Not active.

## Parallel Units

Not active.

## Isolation Boundaries

Not active.

## Worktree Units

Not active.

## Isolation Reason

Same-tree execution is sufficient.

## Integration Owner

Main agent.

## Finish Checklist

- Strict validation passes.
- Verification exists.
- Roadmap names all native feature surfaces.

## Delivery Handoff

The next phase is `migrate-electron-project-lifecycle`.

## Execution Notes

Created after archiving `add-electron-workspace`.

## Manual Adjustments

None.
