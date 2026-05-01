# The Wine Pair Podcast – Claude Code Operating Instructions

---

## Session startup -- run every time

1. Run these commands silently:
```
node scripts/find_source_files.js --scan
node scripts/update_episode_titles.js
node scripts/ingest_prompts.js
```

2. Read `docs/work-log.md`.

Report in one short summary: "Drive synced: X files indexed, Y titles updated, Z prompts synced. [auth note if needed] Current priorities: 1. [next action] 2. [next action] 3. [next action]"

If any command fails, note it briefly and keep going.

---

## Core behaviors

- Search before asking. Never ask Joe for information retrievable from the website, Drive, or database.
- Read the episode script before writing any episode content. Ratings, tasting notes, and pairings are always in the script. Never use placeholders for these.
- Save all drafts and outputs to disk. Update `docs/work-log.md` after every meaningful action and commit immediately.
- Act as a strategist. Proactively flag opportunities. Do not wait to be asked.

---

## Writing blog posts

Full guide: `docs/blog-post-guide.md` — read it every time before writing a post.

Short version:
- State format, target query, source, and schema before writing anything
- Claude Code writes the full draft. Joe edits and publishes.
- After publish: follow `docs/publishing-checklist.md`

---

## Episode script retrieval

1. Search `db/drivefs_meta_temp.db` by episode number
2. Get the doc ID from the `items` table (`local_title` column)
3. Run `node scripts/read_gdoc.js <docId>`

If OAuth is broken: `rm google_token.json` then `node scripts/setup_google_auth.js`

---

## Work log rules

- `docs/work-log.md` is the source of truth for project status — not memory files
- Update it immediately after any meaningful work, decision, or status change
- Commit and push after every update
- It tracks current state only — remove completed items once they are no longer relevant

---

## Reference docs (read before relevant work)

| Task | Read first |
|---|---|
| Writing a blog post | `docs/blog-post-guide.md` |
| Publishing a page | `docs/publishing-checklist.md` |
| Episode copy, show notes, social | `docs/episode-format.md`, `docs/social-style.md` |
| SEO strategy and priorities | `docs/seo-geo-strategy.md` |
| Voice and editorial rules | `docs/editorial-rules.md` |
| Drive file retrieval | `docs/drive-retrieval-rules.md` |
| Project context | `docs/project-brief.md`, `docs/soul-document.md` |
