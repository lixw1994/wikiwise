## ADDED Requirements

### Requirement: Watch Assets Path Parity

The core package SHALL classify watched asset paths using the same `/wiki/assets/` containment semantics as native `FileWatcher`.

#### Scenario: Nested wiki assets path changes
- **WHEN** JavaScript summarizes a watched path containing `/wiki/assets/` below the project root
- **THEN** that event produces a structure summary

#### Scenario: Non-assets lookalike path changes
- **WHEN** JavaScript summarizes a watched path such as `notwiki/assets/image.png`
- **THEN** the path does not produce a structure summary solely because it contains the text `wiki/assets`
