---
name: translate-raw
description: Use when a WikiWise raw markdown source should be translated into the configured target language before source-summary creation.
allowed-tools: Bash(*) Read Write Edit Glob Grep
---

# Translate Raw Source

Translate one `raw/<slug>.md` source into `translation/<slug>.md`.

Core principle: translate the reading experience, not the sentence shapes. Protect evidence, metadata, markdown structure, links, code, and identifiers while rewriting prose so it sounds native in the target language.

## Preconditions

- The source file is under `raw/`.
- `wikiwise.json` exists at the project root.
- The `translation/` directory exists.

## Workflow

### 1. Read settings

Read `wikiwise.json`. If `translation.enabled` is not `true`, stop and report that auto-translation is off.

The target language is:

- `translation.targetLanguage` - stable language code.
- `translation.targetLanguageName` - human-readable language name.

### 2. Inspect the source

Read enough of the raw file to identify language, structure, and article type.

Translate only when needed:

- If the dominant prose is already in the target language, do not create a translation file.
- If the file is mixed-language, translate non-target-language prose and preserve existing target-language passages unless light copyediting is needed for flow.
- If there is already `translation/<slug>.md`, confirm before overwriting unless the user explicitly asked to refresh translations.

Translate the article body, not the container:

- Do not translate YAML frontmatter keys, generated frontmatter, URLs, IDs, citation anchors, tags, or file paths.
- If the raw file starts with YAML frontmatter, do not turn that YAML block into prose. Preserve only user-visible metadata that belongs in the article body.
- Preserve markdown heading levels, list nesting, tables, blockquotes, links, images, footnotes, and citations.
- In markdown links, translate the label when appropriate, but keep the destination unchanged.
- Copy code fences and inline code exactly. Do not translate code comments inside code blocks unless the user explicitly asks.

### 3. Choose the brief

Classify by reader expectation, not keyword count. Ask: which editorial standard would a native reader expect?

Use the technical brief for technology-industry writing: software, AI, engineering, product, startups, venture/business strategy, technical research, developer tools, infrastructure, security, data, and adjacent industry analysis. This includes narrative or strategic articles about technology companies even when there is little code.

Use the general brief for essays, culture, history, travel, lifestyle, personal writing, literature, and other non-technical topics.

If unsure, choose the brief that preserves the author's argument with the least awkwardness. Use exactly one brief for the whole article, then adapt sentence-by-sentence as needed.

Before using either brief:

Replace every `<target-language>` with `translation.targetLanguageName`. Do not leave the placeholder in the final translation file.

#### Technical article brief

Use this brief:

```text
Translate the article into `<target-language>`.

Principles:

- Be faithful to facts, not literal phrasing.
- Rewrite with the expression of a native author in `<target-language>`.
- Preserve the author's emotion, point of view, and argument structure.
- Keep professional terminology consistent.
- Remove translationese.
- Output the translation directly.

Quality bar:

It should read like an original `<target-language>` article from LatePost, GeekPark, or Founder Park, not like a translation.
```

#### General article brief

Use this brief:

```text
You are a professional translator.

Translate the content into `<target-language>`.

Requirements:

1. Do not translate word for word; rewrite into expressions that match `<target-language>` reading habits.
2. Keep facts, data, and logic exactly aligned with the source.
3. Preserve the author's original viewpoint, tone, and structure.
4. Prioritize readability over sentence-by-sentence correspondence.
5. Use industry-standard translations for professional terms and keep them consistent.
6. If `<target-language>` readers may not know a concept, add a very short parenthetical note on first mention.
7. Preserve all Markdown structure, including headings, lists, blockquotes, links, code blocks, and tables.
8. Do not explain the translation process or analyze the source.
9. Output only the final translation.

Translation goal:

The reader should feel the article was originally written in `<target-language>`, not translated from English.
```

### 4. Translate with control

Build a small terminology map before writing, but do not output it. Include recurring product names, technical terms, abbreviations, people, organizations, and key concepts. Use the map to keep terminology consistent from start to finish.

Then translate the full article:

- Preserve the author's claims, uncertainty, criticism, humor, rhythm, and argument order.
- Prefer natural native-language paragraphs over source-language syntax.
- Do not flatten strong opinions into neutral summaries.
- Keep numerals, dates, measurements, ticker symbols, API names, CLI commands, package names, and model names accurate.
- Add a very short parenthetical explanation only when target-language readers are likely to miss essential context.
- Do not summarize, omit sections, or replace hard passages with notes.
- For long files, translate sequential sections while keeping the terminology map consistent. The final file must read as one continuous article.

### 5. Write the translation

Write the full translated article to `translation/<slug>.md`, where `<slug>` matches the raw filename without changing the basename.

Use exactly this frontmatter shape:

```markdown
---
source: raw/<slug>.md
target_language: <targetLanguage>
target_language_name: <targetLanguageName>
---
```

After the frontmatter, directly output the translated article. Do not include the brief, terminology map, translator notes, process notes, or analysis in the translation file.

### 6. Final self-check

Before reporting, verify:

- The translation frontmatter is valid YAML and uses the configured target language.
- The raw file is unchanged.
- The translated file is a full article, not a summary.
- Markdown structure still matches the source where structure carries meaning.
- Links, image URLs, citations, code fences, inline code, IDs, and file paths are intact.
- No translation process notes appear after the frontmatter.
- Terminology is consistent across headings, body, tables, and captions.

## Report

Report:

- Translation file written, or skipped because source language already matches target.
- Target language.
- Whether you used the technical or general brief.
- Any sections intentionally left untranslated, such as code blocks, product names, URLs, or already-target-language passages.
