## MODIFIED Requirements

### Requirement: Generated Page Refresh

The Electron renderer SHALL match native generated-page reload behavior: active generated pages are not directly refreshed by watcher changes or by the manual Refresh Page command, while opening a generated page still loads the current compiler output.

#### Scenario: Active generated page receives watcher output changes

- **WHEN** a live rebuild, CSS change, or markdown change affects compiler output while a generated page is active
- **THEN** Electron does not directly call the generated-page refresh path from watcher handling
- **AND** this matches the native watcher path where generated pages have no selected source file and no reload token change

#### Scenario: Manual refresh command is invoked on a generated page

- **WHEN** the app menu Refresh Page command is invoked while a generated page is active
- **THEN** Electron leaves the active generated page unchanged
- **AND** the command does not call the generated-page refresh path directly

#### Scenario: Generated page is opened after output changes

- **WHEN** the user opens or navigates to a generated page after compiler output has changed
- **THEN** Electron asks the main process for that generated page
- **AND** the preview displays the generated page returned by the main process
