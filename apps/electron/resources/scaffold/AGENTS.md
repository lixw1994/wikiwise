# Agent Instructions

This is a wiki maintained by an LLM agent, following the llm-wiki pattern. This file is the agent-facing schema, conventions, and workflow reference for maintaining the wiki.

## Quick reference

- **`raw/`** — immutable source documents. Read-only.
- **`translation/`** — translated versions of non-target-language raw sources when auto-translation is enabled in `wikiwise.json`.
- **`wiki/`** — LLM-maintained markdown pages. All edits here. Source summaries go in `wiki/sources/`.
- **`site/`** — build tooling and compiled output. `site/out/` is auto-generated.
- **`wikiwise.json`** — project settings, including optional auto-translation target language.
- **`.agents/skills/`** — detailed workflow skills. Read the relevant skill before running a workflow.

## Key conventions

- Link with `[[wikilinks]]`. Bare filename, no path.
- Cite sources inline: `([[source-slug]])`.
- Wiki pages are short blog posts, not reference dumps. TL;DR first, then the argument.
- If `wikiwise.json` enables translation, translate non-target-language raw sources into `translation/` before source-summary creation.
- After any ingest, update `wiki/index.md` and append to `wiki/log.md`.
- Log entry format: `## [YYYY-MM-DD HH:MM] <op> | <title>`.
- Voice: opinionated, direct, declarative. Most pages under 800 words.

## Skills

Detailed skill files live in `.agents/skills/<name>/SKILL.md`. Read the skill file before running a workflow; it contains step-by-step instructions, shell commands, and rules.

Use the file, search, edit, and shell tools available in your agent environment to follow the skill. If a skill mentions a tool name that differs from your environment, use the equivalent operation.

### Skill catalog

| Skill | Path | Purpose |
|---|---|---|
| **ingest** | `.agents/skills/ingest/SKILL.md` | Add a source to the wiki — save raw, translate when configured, create summary page, propagate claims, update index and log |
| **digest** | `.agents/skills/digest/SKILL.md` | Deep-propagate ingested sources across the wiki — update concept/entity pages, flag contradictions, create new pages where warranted |
| **lint** | `.agents/skills/lint/SKILL.md` | Health-check for contradictions, orphan pages, broken links, stale claims, missing cross-links |
| **translate-raw** | `.agents/skills/translate-raw/SKILL.md` | Translate one raw source into the configured target language under `translation/` |
| **translate-imports** | `.agents/skills/translate-imports/SKILL.md` | Translate a batch of imported raw sources before ingest |
| **ingest-tweets** | `.agents/skills/ingest-tweets/SKILL.md` | Search Twitter/X for tweets on a topic using browser automation, extract content, and ingest into the wiki |
| **import-readwise** | `.agents/skills/import-readwise/SKILL.md` | Search and import documents/highlights from Readwise |
| **fetch-readwise-document** | `.agents/skills/fetch-readwise-document/SKILL.md` | Stream a Reader document into `raw/` without loading the body into context |
| **fetch-readwise-highlights** | `.agents/skills/fetch-readwise-highlights/SKILL.md` | Vector-search highlights, group by parent doc, write to `raw/` |
| **upgrade** | `.agents/skills/upgrade/SKILL.md` | Upgrade scaffold files and build tooling to match the latest Wikiwise app version |

## Workflow cheat sheet

These are abbreviated versions. Read the full skill files for details.

**Ingest a source:**
1. Save raw source to `raw/<slug>.md`
2. If `wikiwise.json` enables translation and the source language differs from the target language, write a full translation to `translation/<slug>.md`
3. Create source-summary page at `wiki/sources/<slug>.md` with frontmatter (`type`, `date`, `author`, `url`, `raw`, and `translation` when available)
4. Propagate claims into concept/entity pages with citations `([[slug]])`
5. **Cross-link aggressively** — add `[[wikilinks]]` FROM existing pages TO new pages (edit 2-3 related pages), and FROM new pages TO existing ones. No orphans.
6. Update `wiki/index.md` — add new pages with one-line summaries
7. Update `wiki/home.md` if the source changes the narrative
8. Append to `wiki/log.md` — `## [YYYY-MM-DD HH:MM] ingest | <title>`

**Lint the wiki:**
1. Scan `wiki/` for contradictions, orphan pages, broken `[[wikilinks]]`, stale claims, missing cross-links
2. Report findings grouped by category
3. Append to `wiki/log.md` — `## [YYYY-MM-DD HH:MM] lint | <summary>`

**Ingest tweets:**
1. Open Twitter/X search via browser automation
2. Scroll and extract 10-20 tweets (author, date, text, engagement, URL)
3. Present to user for curation
4. Save to `raw/tweets_<topic>_<date>.md`
5. Chain into ingest — source-summary uses `type: tweets` and synthesizes the discourse

## Publishing

Publishing is normally initiated from the WikiWise app. As the wiki agent, keep
the content and build output healthy, but treat publish credentials as user-owned
secrets.

**Official hosting:** existing official Wikiwise publishing uses
`wiki-wise.com` and is configured by the app.

**Cloudflare Hub:** self-hosted publishing uses `publish.json` with
`target: "cloudflare-hub"`. The app sends the compiled site to the configured
Hub endpoint, which serves it at `https://<slug>.wiki.flybullet.net`.

Hub settings you may help the user reason about:

- `visibility`: `public` means anyone can read the wiki; `private` requires a
  signed-in member.
- `auth realm`: `shared` reuses one profile and comment identity across Hub
  wikis; `per-wiki` scopes identity to this wiki.
- `comment policy`: `disabled`, `login-required`, or `members-only`.

Publishing guardrails:

- Do not commit real publish tokens. `publish.json` may contain the Hub publish
  token and should remain local.
- Do not move OAuth secrets into this wiki. Google, Feishu/Lark, and other
  provider secrets belong in the Cloudflare Hub environment.
- Do not edit `site/out/` by hand. Rebuild from markdown and project resources,
  then publish through the app.
- If the user asks to switch between `public` and `private`, or between shared
  and per-wiki auth, confirm the intended audience and comment identity model
  before changing settings.

## Running your agent

WikiWise includes a built-in terminal in the right sidebar. You can also run any agent in an external terminal pointed at this folder.

```bash
cd /path/to/your-wiki
```
