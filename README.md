# Wikiwise

A native macOS app that turns any folder of markdown files into a browsable, publishable wiki — maintained by your coding agent.

> **Alpha software.** Wikiwise is under active development and may have bugs. Use at your own risk.

**[Download for macOS](https://github.com/TristanH/wikiwise/releases/latest/download/Wikiwise-macOS.dmg)** (Apple Silicon + Intel, signed and notarized)

Based on [Andrej Karpathy's llm-wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): instead of RAG, the LLM incrementally builds and maintains a persistent, interlinked wiki. You add sources; the agent reads them, writes summary pages, cross-references everything, and keeps it all consistent. The wiki compounds with every source you add.

## How it works

1. **Create a wiki** — Wikiwise scaffolds the folder structure, build tools, and agent skills
2. **Open your agent** — use the built-in terminal or your own (Claude Code, Codex, Cursor)
3. **Add sources** — paste URLs, import from Readwise, or point at existing files
4. **Read and explore** — browse the compiled wiki with search, backlinks, and graph visualization

The agent does the grunt work: summarizing, cross-referencing, filing, and bookkeeping. You curate sources, ask questions, and think about what it all means.

## Building

Requires macOS 14+ and Node.js/npm.

```
git clone https://github.com/TristanH/wikiwise.git
cd wikiwise
npm install
npm test
npm run electron:dev
```

## Electron workspace

The product direction is Electron-only. The app lives under `apps/electron/`,
shared wiki behavior lives under `packages/wikiwise-core/`, and bundled app/wiki
resources live under `apps/electron/resources/`.

```
npm test
npm run electron:dev
npm run electron:package:mac
```

`npm test` runs dependency-light workspace checks. `npm run electron:dev`
requires `npm install` first so Electron can be downloaded.

## Self-hosted Cloudflare Hub

Wikiwise still supports the official Wikiwise hosting service. If you want to
own the domain, identity layer, membership rules, comments, and future account
features, you can publish to a self-hosted Cloudflare Hub instead.

A Hub deployment serves published wikis at
`https://<slug>.wiki.flybullet.net`. Static wiki files live in R2, while wiki
metadata, sessions, memberships, page revisions, comments and annotations live
in D1. Auth is owned by the Hub app, not Cloudflare Access, so Google and
Feishu/Lark sign-in can produce the same user profile and comment identity
across wikis when shared realm is selected.

Each published wiki can be public or private. Private wikis require a signed-in
member, while public wikis can still require sign-in for comments.

When the Hub serves a wiki page, it injects a small same-origin reader runtime
from `/_wikiwise/client.js` and `/_wikiwise/client.css`. That runtime adds the
account control and page comment surface without requiring those files to be
published with each wiki. If a private wiki page is requested before access is
granted, the Hub returns a sign-in or access-required page instead of protected
wiki HTML.

Owners can bootstrap private wiki access from `WIKIWISE_ADMIN_EMAILS`, create
single-use invitation links from the injected reader controls, and review or
remove wiki members from the same owner-only surface. Member management is
scoped to the current wiki; removing a member from one wiki does not remove
their access to another wiki.

In the Wikiwise publish dialog, choose **Cloudflare Hub** and provide:

- Hub endpoint, usually `https://wiki.flybullet.net`
- publish token
- wiki slug
- visibility: `public` or `private`
- auth realm: `shared` or `per-wiki`
- comment policy: `disabled`, `login-required`, or `members-only`

`publish.json` stores the selected target and Hub settings for the project.
It is gitignored by scaffolded wikis, but treat the publish token as a real
secret and do not commit it.

### Cloudflare setup with Wrangler

Wikiwise does not create Cloudflare resources for you yet. Set up the Hub once,
then publish any number of wikis to it from the desktop app. The Hub package
ships with `apps/cloudflare-hub/wrangler.toml` so the Worker entrypoint,
Worker route, D1 binding, R2 binding, and public domain are all explicit.

1. Install Wrangler and sign in to your Cloudflare account.
2. Create a D1 database named `wikiwise-hub`, then replace
   `REPLACE_WITH_D1_DATABASE_ID` in `apps/cloudflare-hub/wrangler.toml` with
   that database id. The Worker binding remains `DB`, and migrations are read
   from `apps/cloudflare-hub/migrations/`.
3. Create an R2 bucket named `wikiwise-files`. The Worker binding remains
   `WIKIWISE_FILES`.
4. Keep or edit the Worker route `*.wiki.flybullet.net/*`, zone
   `wiki.flybullet.net`, and `WIKIWISE_PUBLIC_DOMAIN=wiki.flybullet.net` in
   `apps/cloudflare-hub/wrangler.toml` for your domain.
5. Add wildcard DNS for `*.wiki.flybullet.net` to the Worker-backed zone.
6. From `apps/cloudflare-hub/`, set Cloudflare secrets for the Hub:
   `wrangler secret put WIKIWISE_PUBLISH_TOKEN`,
   `wrangler secret put WIKIWISE_SESSION_SECRET`,
   `wrangler secret put GOOGLE_CLIENT_ID`,
   `wrangler secret put GOOGLE_CLIENT_SECRET`,
   `wrangler secret put FEISHU_CLIENT_ID`,
   `wrangler secret put FEISHU_CLIENT_SECRET`, and optionally
   `wrangler secret put LARK_CLIENT_ID` and
   `wrangler secret put LARK_CLIENT_SECRET`.
7. If you override provider endpoints, configure `GOOGLE_TOKEN_URL`,
   `GOOGLE_USERINFO_URL`, `FEISHU_TOKEN_URL`, `FEISHU_USERINFO_URL`,
   `LARK_TOKEN_URL`, and `LARK_USERINFO_URL` as Cloudflare variables.
   Google defaults to Google's standard token and userinfo endpoints when
   those two values are omitted.
8. Set `WIKIWISE_ADMIN_EMAILS` to a comma-separated list of owner emails that
   can bootstrap access to newly published private wikis. Keep
   `WIKIWISE_SESSION_DAYS` in `wrangler.toml`, or edit it if you want a session
   lifetime other than the default 30 days.
9. For local development, run:

   ```
   npm --workspace @wikiwise/cloudflare-hub run d1:migrate:local
   npm --workspace @wikiwise/cloudflare-hub run dev
   ```

10. For production, apply migrations and deploy:

    ```
    npm --workspace @wikiwise/cloudflare-hub run d1:migrate:remote
    npm --workspace @wikiwise/cloudflare-hub run deploy
    ```

After deployment, use the Wikiwise publish dialog with the Hub endpoint
`https://wiki.flybullet.net`, the same publish token stored in
`WIKIWISE_PUBLISH_TOKEN`, your wiki slug, visibility, auth realm, and comment
policy.

OAuth secrets, provider token responses, and session cookies stay in
Cloudflare. They should never be written into a wiki folder, `publish.json`, or
static output. Do not commit real publish tokens, OAuth secrets, or generated
session data.

## Architecture

- **Electron** desktop app with main, preload, and renderer layers
- **JavaScript compiler resources** turn markdown into styled HTML pages
- **node-pty + xterm.js** embedded terminal for running coding agents
- **Filesystem watcher** for live recompilation and tree refreshes
- **Electron resources** under `apps/electron/resources/` for compiler, editor, graph/map pages, KaTeX assets, icon, and scaffold templates
- **Shared JavaScript core** under `packages/wikiwise-core/` for reusable wiki helpers
- **Cloudflare Hub** under `apps/cloudflare-hub/` for self-hosted publish API, static serving, app-owned auth, memberships, comments, and annotations
- Wiki scaffold includes agent skills for ingest, translation, lint, and Readwise import

## Wiki structure

Each wiki folder is self-contained:

```
my-wiki/
  raw/            # immutable source documents
  translation/    # optional full translations of non-target-language sources
  wiki/           # agent-maintained markdown pages
    sources/      # one summary per ingested source
    home.md       # human entry point
    index.md      # agent catalog
    log.md        # chronological record
  site/           # build tools + compiled output
    build.js      # the wiki compiler
    style.css     # the wiki theme
    out/           # compiled HTML (gitignored)
  .agents/        # agent skills
  .claude/        # Claude Code settings and mirrored skills
  AGENTS.md       # agent schema and workflows
  CLAUDE.md       # Claude Code schema
  llm-wiki.md     # Karpathy's pattern (reference)
```

See [`apps/electron/resources/scaffold/`](apps/electron/resources/scaffold/) for the full template — this is what gets copied when you create a new wiki, including the schemas, agent skills, and seed pages.

## License

GPLv3 — see [LICENSE](LICENSE)
