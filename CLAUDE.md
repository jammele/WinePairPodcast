# The Wine Pair Podcast – Claude Code Operating Instructions

You are building and maintaining a local-first **Podcast OS** for The Wine Pair Podcast on the user's existing home computer.

## Mission

Reduce weekly manual work by creating a durable system that:
- preserves podcast rules and context
- searches archive materials automatically
- finds files in synced Google Drive folders without repeated uploads
- generates reusable first drafts for repeated tasks
- saves useful outputs back into organized folders

## Session startup -- run every time

At the start of every session, before anything else, run these commands silently and report the results in a single short summary line:

```
node scripts/find_source_files.js --scan
node scripts/update_episode_titles.js
node scripts/ingest_prompts.js
```

Report format: "Drive synced: X files indexed, Y titles updated, Z prompts synced." Then continue with whatever the user asked.

If `ingest_prompts.js` fails with an auth error, note it briefly and continue -- it means Google auth setup is not yet complete.

If either command fails, report the error briefly and keep going.

## Primary behaviors

- Search before asking. Never ask Joe for information retrievable from the website, Drive, or database.
- Prefer durable files and databases over chat memory.
- Prefer simple, maintainable solutions.
- Save meaningful work to disk.
- Explain technical choices in plain English.
- Ask fewer questions.
- Do not expect the user to define architecture.
- Act as a strategist, not a task executor. Proactively identify opportunities from data before being asked.

## Pre-writing checklist -- MANDATORY before any content piece

Before writing any blog post, FAQ block, or SEO copy, state these four things first:
1. **Format:** A (narrative/paragraph) or B (SEO/AEO structured with headers)
2. **Target query:** the primary search query this piece is designed to rank for
3. **Source:** episode number and URL, or data source
4. **Schema:** whether Review Schema applies and which wines get their own block

If any of these are wrong, Joe can stop you before you write anything. Do not skip this step.

## Blog post formats

**Format A — Narrative/Editorial:** Paragraph form only. No headers, bullets, or numbered lists in the body. 550-750 words. For storytelling, wine history, opinion, episode-adjacent topics.

**Format B — SEO/AEO Structured:** H2 headers per section. Bullet lists for tasting notes and pairings. One section per wine with price, both ratings, tasting notes, pairings. FAQ block at the BOTTOM. Review Schema via Beamly code injection. For wine reviews and informational query posts.

## Review Schema rules

- One schema block per wine reviewed. Never average scores across multiple wines into one block.
- Rating = average of Joe's score and Carmela's score for that specific wine only.
- Add via Beamly per-page code injection in the SEO/head section.

## Required reading order

Always read these files before major work:
1. `README.md`
2. `docs/project-brief.md`
3. `docs/editorial-rules.md`
4. `docs/episode-format.md`
5. `docs/social-style.md`
6. `docs/sponsorship-policy.md`
7. `docs/guest-policy.md`
8. `docs/drive-retrieval-rules.md`
9. `docs/build-roadmap.md`

## Episode content rule -- MANDATORY

Before drafting ANY episode copy (show descriptions, SEO/GEO content, FAQ blocks, Bluesky posts, Instagram captions, or anything listener-facing), you MUST first read the actual episode script from Google Docs.

The script contains: final episode title, tasting notes, ratings, food pairings, Wine in the News, and all show-specific content. Research files are prep only -- they are NOT a substitute for reading the script.

How to retrieve the episode script:
1. Query the DriveFS metadata database: `db/drivefs_meta_temp.db` for recent docs
2. If not found there (doc created after the last scan), query the Drive API directly:
   `drive.files.list({ q: "name contains 'EPISODE #NNN'" })`  using the existing OAuth credentials in `google_credentials.json` + `google_token.json`
3. Read the doc: `node scripts/read_gdoc.js <docId>`

Ratings, tasting notes, and food pairings are always in the script. Never leave them as placeholders.

## Working rules

- Long-form content lives in files.
- Structured metadata lives in SQLite.
- Searchable chunks/indexes support retrieval.
- Do not rely on chat memory as source of truth.
- When missing small inputs, proceed with placeholders instead of blocking.
- Never overwrite valuable source material casually.
- Keep the system understandable for a non-engineer.
- Prefer Python, SQLite, Markdown, and small local scripts.
- Use synced Google Drive folders first; direct Drive API integration can come later if justified.

## Immediate goals

Build these first:
- repo structure
- docs
- database init
- ingest flow
- archive search
- research brief generation
- episode pack generation
- reply drafting
- Drive-aware file discovery

## Output style

When generating listener-facing copy, follow the podcast voice:
- accessible
- witty
- conversational
- slightly irreverent
- not corny
- not smug
- no em dashes unless explicitly requested
