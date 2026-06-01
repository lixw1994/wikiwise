## ADDED Requirements

### Requirement: Hub Reader Runtime Assets
The Cloudflare Hub SHALL serve reader runtime assets from stable same-origin `/_wikiwise/` routes without requiring those assets to be included in published static wiki files.

#### Scenario: Reader script is requested
- **WHEN** a visitor requests `/_wikiwise/client.js` for a published wiki host
- **THEN** the Hub returns JavaScript for the reader runtime
- **AND** the response is cacheable without embedding OAuth client secrets, session ids, or provider tokens

#### Scenario: Reader stylesheet is requested
- **WHEN** a visitor requests `/_wikiwise/client.css` for a published wiki host
- **THEN** the Hub returns stylesheet rules for the reader runtime
- **AND** the stylesheet uses Hub-specific selectors that do not require generated wiki markup changes

### Requirement: Hub Reader Runtime Injection
The Cloudflare Hub SHALL inject its reader runtime into eligible wiki HTML responses while preserving non-HTML responses unchanged.

#### Scenario: Published HTML page is served
- **WHEN** a public or authorized visitor requests a published wiki HTML page
- **THEN** the Hub returns the page content
- **AND** the response includes the Hub reader stylesheet and script

#### Scenario: Non-HTML asset is served
- **WHEN** a visitor requests a published wiki asset that is not HTML
- **THEN** the Hub returns the asset without injecting reader runtime markup

#### Scenario: API response is served
- **WHEN** a visitor requests a `/_wikiwise/` API endpoint
- **THEN** the Hub returns the API response without injecting reader runtime markup

### Requirement: Hub Reader Account Surface
The Cloudflare Hub reader runtime SHALL provide an account surface that reflects the visitor's session and configured sign-in providers.

#### Scenario: Signed-out visitor opens a wiki page
- **WHEN** the reader runtime loads for a visitor without a valid Hub session
- **THEN** it displays sign-in actions for the configured providers
- **AND** each sign-in action returns the visitor to the current page after authentication

#### Scenario: Signed-in visitor opens a wiki page
- **WHEN** the reader runtime loads for a visitor with a valid Hub session
- **THEN** it displays the visitor's public profile information
- **AND** it provides a logout action that clears the current Hub session

#### Scenario: No providers are configured
- **WHEN** the reader runtime loads and the Hub has no configured OAuth providers
- **THEN** it displays account status without presenting unusable sign-in actions

### Requirement: Hub Reader Comments Surface
The Cloudflare Hub reader runtime SHALL provide a page-level comments surface backed by the Hub comments API and governed by the wiki comment policy.

#### Scenario: Comments are available for a page
- **WHEN** the reader runtime loads on a wiki page
- **THEN** it requests comments for the current page path
- **AND** it renders returned comments in parent-child order

#### Scenario: Visitor can write a comment
- **WHEN** the current visitor satisfies the wiki comment policy
- **THEN** the comments surface provides a composer for a top-level comment
- **AND** submitting the composer creates the comment through the Hub comments API
- **AND** the surface refreshes to include the new comment

#### Scenario: Visitor cannot write a comment
- **WHEN** the current visitor does not satisfy the wiki comment policy
- **THEN** the comments surface does not claim the visitor can post
- **AND** server-side comment policy enforcement remains authoritative

### Requirement: Hub Private Sign-In Page
The Cloudflare Hub SHALL return a Hub-owned sign-in page for protected wiki content that cannot be served to the current visitor.

#### Scenario: Anonymous visitor requests private wiki HTML
- **WHEN** a private wiki HTML page is requested without an authorized Hub session
- **THEN** the Hub returns a sign-in page instead of the protected wiki page
- **AND** the sign-in page includes configured provider actions with a safe return URL
- **AND** protected wiki content is not included in the response

#### Scenario: Unauthorized signed-in visitor requests private wiki HTML
- **WHEN** a signed-in visitor does not have access to the requested private wiki
- **THEN** the Hub returns a sign-in or access-required page instead of the protected wiki page
- **AND** protected wiki content is not included in the response
