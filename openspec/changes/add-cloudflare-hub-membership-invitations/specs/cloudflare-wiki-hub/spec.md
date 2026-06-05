## ADDED Requirements

### Requirement: Hub Membership Invitations
The Cloudflare Hub SHALL let wiki owners create, list, and revoke invitation links that grant membership for the current wiki.

#### Scenario: Owner creates an invitation
- **WHEN** a signed-in owner requests an invitation for a wiki
- **THEN** the Hub creates a pending invitation scoped to that wiki
- **AND** the Hub returns a one-time invitation URL containing the raw invite token
- **AND** the stored invitation record does not expose the raw invite token

#### Scenario: Non-owner attempts to create an invitation
- **WHEN** a signed-in non-owner or anonymous visitor requests an invitation
- **THEN** the Hub rejects the request
- **AND** no invitation is created

#### Scenario: Owner lists invitations
- **WHEN** a signed-in owner lists invitations for a wiki
- **THEN** the Hub returns invitations scoped only to that wiki
- **AND** raw tokens and token hashes are not included

#### Scenario: Owner revokes an invitation
- **WHEN** a signed-in owner revokes a pending invitation
- **THEN** the Hub marks the invitation revoked
- **AND** the invitation can no longer be accepted

### Requirement: Hub Invitation Acceptance
The Cloudflare Hub SHALL let signed-in visitors accept valid pending invitations and receive wiki membership.

#### Scenario: Signed-out visitor opens an invitation
- **WHEN** a signed-out visitor opens a valid invitation URL
- **THEN** the Hub prompts the visitor to sign in
- **AND** the sign-in actions return the visitor to the invitation URL
- **AND** protected wiki content is not included in the response

#### Scenario: Signed-in visitor accepts a valid invitation
- **WHEN** a signed-in visitor accepts a valid pending invitation
- **THEN** the Hub grants that user `member` membership for the invitation wiki
- **AND** the Hub marks the invitation accepted
- **AND** the visitor can read that private wiki after acceptance

#### Scenario: Invalid invitation cannot be accepted
- **WHEN** an invitation token is unknown, revoked, accepted, or expired
- **THEN** the Hub rejects acceptance
- **AND** no membership is granted

#### Scenario: Invitation is scoped to one wiki
- **WHEN** a visitor accepts an invitation for one wiki
- **THEN** the granted membership applies only to that wiki
- **AND** access to another private wiki is not implied

### Requirement: Hub Owner Invitation Surface
The Cloudflare Hub reader runtime SHALL expose a lightweight invitation control only to signed-in wiki owners.

#### Scenario: Owner opens a wiki page
- **WHEN** the reader runtime loads for a signed-in owner
- **THEN** it provides an invitation action
- **AND** created invitation links are displayed to the owner without exposing token hashes

#### Scenario: Non-owner opens a wiki page
- **WHEN** the reader runtime loads for an anonymous visitor, signed-in non-member, or signed-in non-owner member
- **THEN** it does not show owner invitation controls
