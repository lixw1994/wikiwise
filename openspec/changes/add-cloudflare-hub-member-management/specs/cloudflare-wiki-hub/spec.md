## ADDED Requirements

### Requirement: Hub Member Management
The Cloudflare Hub SHALL let wiki owners list and remove member access for the current wiki.

#### Scenario: Owner lists wiki members
- **WHEN** a signed-in owner requests members for a wiki
- **THEN** the Hub returns memberships scoped only to that wiki
- **AND** each listed member includes public profile fields and membership role metadata
- **AND** provider tokens, provider subjects, emails, session ids, invitation token hashes, and invitation raw tokens are not included

#### Scenario: Non-owner attempts to list wiki members
- **WHEN** an anonymous visitor, signed-in non-member, or signed-in non-owner member requests members for a wiki
- **THEN** the Hub rejects the request
- **AND** member data is not returned

#### Scenario: Owner removes a member
- **WHEN** a signed-in owner removes a `member` user from a wiki
- **THEN** the Hub removes that user's membership for the current wiki
- **AND** the removed user can no longer read that private wiki
- **AND** the removed user's access to other wikis is unchanged

#### Scenario: Owner removal is not supported
- **WHEN** a signed-in owner attempts to remove an `owner` membership
- **THEN** the Hub rejects the request
- **AND** the owner membership remains intact

### Requirement: Hub Owner Member Surface
The Cloudflare Hub reader runtime SHALL expose member management controls only to signed-in wiki owners.

#### Scenario: Owner opens a wiki page
- **WHEN** the reader runtime loads for a signed-in owner
- **THEN** it provides a member management action
- **AND** the owner can view current wiki members without leaving the wiki page

#### Scenario: Owner removes a member from the runtime
- **WHEN** an owner removes a listed `member` user through the reader runtime
- **THEN** the runtime calls the owner-only member removal API
- **AND** the member list refreshes to reflect the removal

#### Scenario: Non-owner opens a wiki page
- **WHEN** the reader runtime loads for an anonymous visitor, signed-in non-member, or signed-in non-owner member
- **THEN** it does not show member management controls
