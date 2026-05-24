## Context

The SwiftUI app has several coupled surfaces: native window/menu commands, welcome/new/open flows, file tree scanning, JavaScriptCore compilation, WKWebView preview/editor surfaces, FSEvents live rebuild, SwiftTerm, publishing, scaffold creation, and agent workflow files. Migrating everything at once would be too risky and hard to verify.

## Goals / Non-Goals

**Goals:**

- Establish the full parity target.
- Name the phase order.
- Make retained verification mandatory for every phase.

**Non-Goals:**

- No runtime code changes.
- No claim that Electron is usable beyond existing shell capabilities.

## Decisions

- Use a dedicated roadmap capability so phase changes can reference a stable OpenSpec spec.
- Treat "identical to native" as final acceptance, while allowing intermediate phases to record known gaps.
- Make phase order dependency-driven: open/scan projects first, then compiler, then viewing/editing, then live updates and advanced integrations.

## Risks / Trade-offs

- The roadmap can drift if native app behavior changes; future native changes must update the roadmap or corresponding parity specs.
- Some platform-specific details cannot be literally identical on Windows/Linux; deviations must be explicit and accepted by OpenSpec when encountered.

## State Model

- **Roadmap defined:** migration target and phases exist.
- **Phase active:** one or more roadmap surfaces are being migrated.
- **Phase archived:** phase specs and evidence are merged into baseline.
- **Final audit:** every roadmap surface has direct evidence.

## Migration Plan

1. Archive the existing Electron workspace scaffold change so baseline specs exist.
2. Add this roadmap change.
3. Start the first functional phase: project lifecycle and file tree.
4. Continue with one OpenSpec change per dependency layer until final parity audit passes.

## Open Questions

- None for the roadmap. Phase-specific choices belong in their own changes.
