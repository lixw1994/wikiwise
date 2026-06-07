## 1. Contract And Tests

- [x] 1.1 Validate the OpenSpec change artifacts.
- [x] 1.2 Add failing Cloudflare Hub Worker and deployment tests for `-wiki` suffix hostnames, reserved `hub`, and `hub-wiki` OAuth callback URLs.
- [x] 1.3 Add failing shared core and Electron publishing tests for `hub-wiki` endpoint defaults and `https://<slug>-wiki.flybullet.net` previews.

## 2. Implementation

- [x] 2.1 Update Cloudflare Hub Worker hostname parsing, public URL generation, and reserved control-host handling.
- [x] 2.2 Update shared core Cloudflare Hub URL derivation and Electron publishing defaults/previews.
- [x] 2.3 Update Wrangler configuration, deploy preflight checks, documentation, and scaffold guidance for the `-wiki` hostname model.

## 3. Verification

- [x] 3.1 Run targeted Cloudflare Hub, shared core, Electron publishing, and deployment documentation tests.
- [x] 3.2 Run full repository verification: `npm test`, `openspec validate --all --strict`, and `git diff --check`.
