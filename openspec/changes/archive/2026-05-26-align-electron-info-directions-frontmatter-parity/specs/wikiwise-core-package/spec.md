## ADDED Requirements

### Requirement: Native-Compatible Directions Frontmatter Parsing
The core document-info helper SHALL extract directions using the same exact frontmatter semantics as the native right sidebar.

#### Scenario: Exact directions frontmatter is requested
- **WHEN** JavaScript summarizes a markdown document whose first frontmatter line is exactly `---` and contains a line beginning exactly with `directions:`
- **THEN** the document info includes the trimmed directions value

#### Scenario: Loose frontmatter opening is ignored
- **WHEN** JavaScript summarizes a markdown document whose opening marker has leading or trailing whitespace instead of an exact `---` line
- **THEN** the document info directions value is absent

#### Scenario: Indented directions key is ignored
- **WHEN** JavaScript summarizes a markdown document whose frontmatter contains an indented `directions:` key
- **THEN** the document info directions value is absent

#### Scenario: Loose closing marker does not end frontmatter
- **WHEN** JavaScript summarizes a markdown document whose exact opening frontmatter marker is followed by a whitespace-padded `---` line before `directions:`
- **THEN** the document info still includes the later directions value that native parsing would find
