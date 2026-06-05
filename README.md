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

### Manual Cloudflare setup

Wikiwise does not create Cloudflare resources for you yet. Set up the Hub once,
then publish any number of wikis to it from the desktop app.

1. Deploy `apps/cloudflare-hub/src/worker.js` as a Cloudflare Worker.
2. Create a D1 database, bind it as `DB`, and apply all SQL files in
   `apps/cloudflare-hub/migrations/` in filename order.
3. Create an R2 bucket and bind it as `WIKIWISE_FILES`.
4. Add a Worker route for `*.wiki.flybullet.net/*`.
5. Add wildcard DNS for `*.wiki.flybullet.net` to the Worker-backed zone.
6. Set `WIKIWISE_PUBLIC_DOMAIN=wiki.flybullet.net`.
7. Set `WIKIWISE_PUBLISH_TOKEN` as the token the desktop app will send.
8. For OAuth, set provider credentials as Cloudflare secrets:
   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FEISHU_CLIENT_ID`,
   `FEISHU_CLIENT_SECRET`, and optionally `LARK_CLIENT_ID`,
   `LARK_CLIENT_SECRET`.
9. Set OAuth callback endpoints for any provider without built-in defaults:
   `GOOGLE_TOKEN_URL`, `GOOGLE_USERINFO_URL`, `FEISHU_TOKEN_URL`,
   `FEISHU_USERINFO_URL`, `LARK_TOKEN_URL`, and `LARK_USERINFO_URL`.
   Google defaults to Google's standard token and userinfo endpoints when
   those two values are omitted.
10. Set `WIKIWISE_ADMIN_EMAILS` to a comma-separated list of owner emails that
    can bootstrap access to newly published private wikis. Set
    `WIKIWISE_SESSION_DAYS` if you want a session lifetime other than the
    default 30 days.

OAuth secrets, provider token responses, and session cookies stay in
Cloudflare. They should never be written into a wiki folder, `publish.json`, or
static output.

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
