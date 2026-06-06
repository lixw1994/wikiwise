## ADDED Requirements

### Requirement: Hub Comment Moderation
The Cloudflare Hub SHALL let wiki owners hide and restore comments for the current wiki without deleting comment records.

#### Scenario: Owner hides a comment
- **WHEN** a signed-in owner hides a comment for the current wiki
- **THEN** the Hub marks that comment hidden
- **AND** normal reader-facing comment lists no longer include the hidden comment
- **AND** the comment record remains stored for future restoration or audit

#### Scenario: Owner restores a hidden comment
- **WHEN** a signed-in owner restores a hidden comment for the current wiki
- **THEN** the Hub marks that comment visible again
- **AND** normal reader-facing comment lists include the restored comment

#### Scenario: Non-owner attempts to moderate a comment
- **WHEN** an anonymous visitor, signed-in non-member, or signed-in non-owner member attempts to hide or restore a comment
- **THEN** the Hub rejects the request
- **AND** the comment status is not changed

#### Scenario: Moderation is scoped to the current wiki
- **WHEN** a signed-in owner moderates a comment
- **THEN** only comments belonging to the current wiki can be changed
- **AND** comments with the same identifier or page path in another wiki are not changed

### Requirement: Hub Owner Comment Moderation Surface
The Cloudflare Hub reader runtime SHALL expose comment moderation controls only to signed-in wiki owners.

#### Scenario: Owner opens comments
- **WHEN** the reader runtime loads comments for a signed-in owner
- **THEN** visible comments include an owner-only action for hiding the comment
- **AND** hidden comments can be reviewed and restored without leaving the wiki page

#### Scenario: Non-owner opens comments
- **WHEN** the reader runtime loads comments for an anonymous visitor, signed-in non-member, or signed-in non-owner member
- **THEN** comment moderation controls are not shown

#### Scenario: Owner moderates from the runtime
- **WHEN** an owner hides or restores a comment through the reader runtime
- **THEN** the runtime calls the owner-only moderation API
- **AND** the comment list refreshes to reflect the updated status
