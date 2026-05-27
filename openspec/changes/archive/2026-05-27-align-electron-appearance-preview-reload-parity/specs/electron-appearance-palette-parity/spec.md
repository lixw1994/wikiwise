## ADDED Requirements

### Requirement: Appearance Preview Reload Parity

Electron appearance handling SHALL mirror native appearance-mode changes by reloading the visible preview WebView surface after the selected appearance mode changes.

#### Scenario: Compiled preview is visible during appearance change
- **WHEN** the user changes Electron appearance mode while a selected Markdown compiled preview is visible
- **THEN** Electron keeps the selected file and preview state
- **AND** reloads the visible compiled-preview iframe so preview CSS can resolve the new color scheme
- **AND** preserves existing selected-preview scroll restoration behavior

#### Scenario: Generated page is visible during appearance change
- **WHEN** the user changes Electron appearance mode while a generated map or graph page is visible
- **THEN** Electron keeps the generated-page state and app history
- **AND** reloads the visible generated-page iframe so generated-page CSS can resolve the new color scheme

#### Scenario: Source editor is visible during appearance change
- **WHEN** the user changes Electron appearance mode while no preview iframe is visible
- **THEN** Electron keeps existing shell palette and terminal theme updates
- **AND** does not request preview compilation or generated-page navigation solely for the appearance change
