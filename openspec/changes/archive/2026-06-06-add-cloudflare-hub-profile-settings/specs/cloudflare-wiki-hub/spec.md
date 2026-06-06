## ADDED Requirements

### Requirement: Hub User Profile Settings
The Cloudflare Hub SHALL let signed-in users update the public profile fields used for their reader identity.

#### Scenario: Signed-in user updates public profile
- **WHEN** a signed-in user updates their public profile for the current wiki with a valid display name and avatar URL
- **THEN** the Hub stores the updated public profile for the current wiki realm
- **AND** the Hub returns the updated public profile
- **AND** a later `/_wikiwise/me` request for that realm returns the updated display name and avatar URL

#### Scenario: Signed-out visitor attempts profile update
- **WHEN** a visitor without a valid Hub session attempts to update a profile
- **THEN** the Hub rejects the request
- **AND** no profile data is changed

#### Scenario: Invalid profile update is rejected
- **WHEN** a signed-in user submits an empty display name, an overlong display name, an unsafe avatar URL, or unsupported profile fields
- **THEN** the Hub rejects the update
- **AND** the user's stored public profile remains unchanged

#### Scenario: Profile responses expose only public fields
- **WHEN** the Hub returns a profile update response or a `/_wikiwise/me` response
- **THEN** the response includes only public identity fields needed by the reader runtime
- **AND** emails, provider subjects, provider tokens, OAuth state ids, session ids, invitation tokens, and invitation token hashes are not included

### Requirement: Hub Profile Realm Scope
The Cloudflare Hub SHALL apply user-edited profile settings according to the current wiki auth realm.

#### Scenario: Shared realm profile update is shared
- **WHEN** a signed-in user updates their profile from a shared-realm wiki
- **THEN** the updated display name and avatar URL are used for that user across shared-realm Hub wikis
- **AND** comments and member lists in those shared-realm wikis use the updated public profile

#### Scenario: Per-wiki profile update is scoped
- **WHEN** a signed-in user updates their profile from a per-wiki realm wiki
- **THEN** the updated display name and avatar URL are used only for that wiki-scoped identity
- **AND** another per-wiki realm wiki does not receive that profile update
- **AND** the user's shared-realm public profile is not changed

#### Scenario: Provider profile refresh preserves user-edited profile
- **WHEN** a user has edited their public profile
- **AND** the user later signs in again through an OAuth provider that returns different profile claims
- **THEN** the Hub keeps using the user-edited public profile for the applicable realm
- **AND** provider-derived profile values remain only fallback data for realms without a user-edited profile

### Requirement: Hub Reader Profile Settings Surface
The Cloudflare Hub reader runtime SHALL provide a signed-in-only profile settings surface for editing public identity fields.

#### Scenario: Signed-in user opens account surface
- **WHEN** the reader runtime loads for a signed-in user
- **THEN** the account surface provides a profile edit action
- **AND** the edit surface is prefilled with the current public display name and avatar URL

#### Scenario: Signed-in user saves profile from runtime
- **WHEN** a signed-in user saves valid profile changes from the reader runtime
- **THEN** the runtime calls the Hub profile update API
- **AND** the account surface updates to show the saved public profile
- **AND** comments and owner-only member lists refresh or rerender to reflect the saved public profile where they are visible

#### Scenario: Signed-out visitor opens account surface
- **WHEN** the reader runtime loads for a signed-out visitor
- **THEN** profile edit controls are not shown
- **AND** sign-in actions remain available when providers are configured
