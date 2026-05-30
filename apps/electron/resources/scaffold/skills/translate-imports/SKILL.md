---
name: translate-imports
description: Translate a batch of newly imported raw sources according to wikiwise.json before ingesting them into the wiki.
allowed-tools: Bash(*) Read Write Edit Glob Grep
---

# Translate Imports

Translate a batch of raw source files after import and before source summaries are finalized.

## When to use

- After importing multiple Readwise documents or highlight collections.
- After copying existing files into `raw/`.
- Before batch ingest when `wikiwise.json` enables translation.

## Step 1: Read translation settings

Read `wikiwise.json`.

If `translation.enabled` is not `true`, stop and report that auto-translation is off.

## Step 2: Identify raw files

Use the file list from the import step when available. If no list was provided, find recently added raw files:

```bash
find raw -maxdepth 1 -type f -name '*.md' -print
```

Do not process files outside `raw/`.

## Step 3: Translate each raw

For each selected raw file, run the `translate-raw` workflow.

For large batches, process 3-5 files first so the user can inspect the first translations before you continue.

## Step 4: Hand off to ingest

After translations are written, continue with `ingest`.

Tell ingest which translation files correspond to which raw files so source-summary frontmatter can include:

```yaml
translation: translation/<slug>.md
```

## Step 5: Report

Report:

- Raw files translated.
- Raw files skipped because they already matched the target language.
- Translation files created.
- Any files that need user review.
