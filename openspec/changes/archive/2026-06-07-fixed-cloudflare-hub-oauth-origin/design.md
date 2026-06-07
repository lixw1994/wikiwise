## Context

Cloudflare Hub currently starts OAuth from the requested wiki host and uses that same origin as the provider callback origin. For `https://notes-wiki.flybullet.net`, the redirect URI becomes `https://notes-wiki.flybullet.net/_wikiwise/auth/google/callback`. That works technically, but operators would need to register each wiki slug as a provider callback URL.

The Hub already stores the initiating wiki slug and safe return URL in OAuth state. It also already sets the session cookie for the shared public domain when requests are under `WIKIWISE_PUBLIC_DOMAIN`, so a session created on `hub-wiki.flybullet.net` can be sent to `notes-wiki.flybullet.net`.

## Goals / Non-Goals

**Goals:**

- Allow one fixed OAuth callback origin to serve all wiki slugs.
- Keep sign-in links available from each wiki host and preserve the initiating wiki slug.
- Keep session cookies usable across Hub wiki subdomains after callback completion.
- Preserve existing behavior for local development and deployments that do not configure a fixed auth origin.
- Document the provider callback URLs operators should register.

**Non-Goals:**

- Do not introduce a separate account service or new data model.
- Do not introduce another account service hostname beyond the configured Hub endpoint.
- Do not automate Cloudflare DNS, route, or OAuth provider configuration.

## Decisions

1. Add `WIKIWISE_AUTH_ORIGIN` as an optional Hub configuration value.

   When set, OAuth start and callback token exchange use `${WIKIWISE_AUTH_ORIGIN}/_wikiwise/auth/<provider>/callback` as the redirect URI. When omitted, the Hub continues using the current request origin. This gives production deployments one fixed callback while keeping local and legacy deployments working.

   Alternative considered: always use `hub.<public-domain>`. That is simpler but less flexible for operators who choose a different endpoint such as `auth.<domain>` or a staging domain.

2. Keep OAuth state as the source of wiki context.

   The start route still derives the wiki slug from the requesting wiki host and stores that slug plus a sanitized `returnTo` URL in `oauth_states`. The callback route does not need to infer the wiki slug from the callback host; it trusts only the validated state record.

   Alternative considered: pass the slug in the callback query string. That is less safe and duplicates data already protected by state.

3. Keep the session cookie domain behavior unchanged.

   The existing cookie logic sets `Domain=.flybullet.net` for requests under `WIKIWISE_PUBLIC_DOMAIN`. Fixed callback hosts under that same domain can therefore create sessions visible to wiki subdomains. If an operator configures `WIKIWISE_AUTH_ORIGIN` outside the public wiki domain, the session cookie cannot be shared and the Hub should fall back to a host-only cookie for that callback request.

4. Document `hub-wiki.flybullet.net` as the recommended auth origin.

   The App already defaults the Cloudflare Hub endpoint to `https://hub-wiki.flybullet.net`, while published wiki URLs remain `https://<slug>-wiki.flybullet.net`. Reusing the Hub endpoint as the auth origin avoids adding another DNS hostname for now.

## Risks / Trade-offs

- Fixed auth origin is outside `WIKIWISE_PUBLIC_DOMAIN` → Session cookie will not be shared with wiki hosts. Mitigation: document that the auth origin should be the Hub endpoint under the same public domain, such as `https://hub-wiki.flybullet.net`.
- Provider redirect URI mismatch → OAuth callbacks fail at the provider. Mitigation: document exact Google, Feishu, and Lark callback URLs and add tests that the generated redirect URI uses the fixed origin.
- Existing deployments without `WIKIWISE_AUTH_ORIGIN` → They keep per-wiki callbacks. Mitigation: make the new variable optional and keep fallback behavior.
- Misconfigured return URLs → Users could be redirected off-site. Mitigation: keep the existing `safeReturnTo` behavior, which limits returns to the initiating wiki origin.

## Migration Plan

1. Deploy the Worker with `WIKIWISE_AUTH_ORIGIN` unset to preserve current behavior, or set it to `https://hub-wiki.flybullet.net` for fixed callbacks.
2. Register provider callback URLs:
   - `https://hub-wiki.flybullet.net/_wikiwise/auth/google/callback`
   - `https://hub-wiki.flybullet.net/_wikiwise/auth/feishu/callback`
   - `https://hub-wiki.flybullet.net/_wikiwise/auth/lark/callback`
3. Rollback by removing `WIKIWISE_AUTH_ORIGIN` and re-registering per-wiki callback URLs if needed.
