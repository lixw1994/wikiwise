## Context

`WikiwiseApp.init()` calls `NSApplication.shared.setActivationPolicy(.regular)` and `NSApplication.shared.activate(ignoringOtherApps: true)` before applying appearance and icon state. Electron already presents a regular app window in normal launches, but the main process has no explicit equivalent for native activation policy or startup foregrounding.

## Goals / Non-Goals

**Goals:**

- Apply Electron's macOS activation policy as `regular` during startup.
- Focus the app on startup with Electron's `steal` option to mirror native `activate(ignoringOtherApps: true)`.
- Run the setup before both runtime audit mode and normal window creation.
- Keep the setup safe outside macOS and in test environments.

**Non-Goals:**

- Do not change renderer focus behavior, text-field focus, terminal focus, or keyboard shortcuts.
- Do not alter app menu structure, Dock icon setup, packaging metadata, or release signing.
- Do not introduce new dependencies or OS-specific helper binaries.

## Decisions

- Add a small `applyNativeActivationPolicy()` helper in the Electron main process.
  This keeps startup shell identity setup near icon and appearance setup and gives tests a stable contract.
- Guard Electron's macOS-specific APIs with optional chaining.
  `app.setActivationPolicy` is macOS-specific, while `app.focus({ steal: true })` is available cross-platform with platform-specific behavior; guarding the policy call keeps non-macOS runs harmless.
- Call the helper at the top of `app.whenReady()`.
  Native Swift applies activation before window content is constructed; the Electron equivalent should run before audit mode or normal window creation starts.

## Risks / Trade-offs

- [Risk] Foreground activation can be considered assertive behavior. -> Mitigation: the native app already uses `activate(ignoringOtherApps: true)`, so this mirrors an existing product decision rather than introducing a new interaction.
- [Risk] Runtime audit launches may steal focus. -> Mitigation: this is already true of native startup behavior and the audit is an explicit local verification command.
- [Risk] Electron may not expose `setActivationPolicy` outside macOS. -> Mitigation: optional chaining avoids failures on non-darwin environments.
