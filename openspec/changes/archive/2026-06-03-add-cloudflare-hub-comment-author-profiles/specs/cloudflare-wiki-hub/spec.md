## MODIFIED Requirements

### Requirement: Threaded Comments

The Hub SHALL support page-level threaded comments for published wikis and SHALL include reader-facing author profiles with serialized comments.

#### Scenario: User writes a top-level comment

- **WHEN** comments are enabled for a wiki page
- **AND** the current user satisfies the wiki comment policy
- **THEN** the user can create a top-level comment associated with that wiki page
- **AND** the created comment response includes an `author` profile with public display fields

#### Scenario: User replies to a comment

- **WHEN** a user replies to an existing comment thread
- **THEN** the reply is associated with the parent comment
- **AND** the thread can be rendered in parent-child order

#### Scenario: Comment write policy is enforced

- **WHEN** a wiki comment policy is `disabled`, `login-required`, or `members-only`
- **THEN** the Hub enforces that policy before accepting comment writes

#### Scenario: Comments are listed with author profiles

- **WHEN** comments are listed for a wiki page
- **THEN** each serialized comment includes an `author` object
- **AND** the `author` object includes only public identity fields needed for reader display
- **AND** provider tokens, provider subjects, emails, session ids, and membership internals are not included

#### Scenario: Shared realm author is reused across wikis

- **WHEN** the same shared-realm user comments on multiple Hub wikis
- **THEN** serialized comments use the same `author.id`
- **AND** the author display name and avatar are consistent across those wikis

#### Scenario: Per-wiki author is scoped to the wiki

- **WHEN** the same signed-in user comments on multiple per-wiki realm wikis
- **THEN** serialized comments use different wiki-scoped `author.id` values
- **AND** each author retains the signed-in user's display name and avatar for reader display

### Requirement: Hub Reader Comments Surface

The Cloudflare Hub reader runtime SHALL provide a page-level comments surface backed by the Hub comments API and governed by the wiki comment policy.

#### Scenario: Comments are available for a page

- **WHEN** the reader runtime loads on a wiki page
- **THEN** it requests comments for the current page path
- **AND** it renders returned comments in parent-child order
- **AND** it displays reader-facing author names and avatars when provided

#### Scenario: Visitor can write a comment

- **WHEN** the current visitor satisfies the wiki comment policy
- **THEN** the comments surface provides a composer for a top-level comment
- **AND** submitting the composer creates the comment through the Hub comments API
- **AND** the surface refreshes to include the new comment

#### Scenario: Visitor cannot write a comment

- **WHEN** the current visitor does not satisfy the wiki comment policy
- **THEN** the comments surface does not claim the visitor can post
- **AND** server-side comment policy enforcement remains authoritative
