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

## Architecture

- **Electron** desktop app with main, preload, and renderer layers
- **JavaScript compiler resources** turn markdown into styled HTML pages
- **node-pty + xterm.js** embedded terminal for running coding agents
- **Filesystem watcher** for live recompilation and tree refreshes
- **Electron resources** under `apps/electron/resources/` for compiler, editor, graph/map pages, KaTeX assets, icon, and scaffold templates
- **Shared JavaScript core** under `packages/wikiwise-core/` for reusable wiki helpers
- Wiki scaffold includes Claude Code skills for ingest, lint, and Readwise import

## Wiki structure

Each wiki folder is self-contained:

```
my-wiki/
  raw/            # immutable source documents
  wiki/           # agent-maintained markdown pages
    sources/      # one summary per ingested source
    home.md       # human entry point
    index.md      # agent catalog
    log.md        # chronological record
  site/           # build tools + compiled output
    build.js      # the wiki compiler
    style.css     # the wiki theme
    out/           # compiled HTML (gitignored)
  .claude/        # agent skills and settings
  CLAUDE.md       # wiki schema
  llm-wiki.md     # Karpathy's pattern (reference)
```

See [`apps/electron/resources/scaffold/`](apps/electron/resources/scaffold/) for the full template — this is what gets copied when you create a new wiki, including the schema (`CLAUDE.md`), agent skills, and seed pages.

## License

GPLv3 — see [LICENSE](LICENSE)
