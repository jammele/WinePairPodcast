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

**After reading the work log:**
- The work log is the authority. Do not question or contradict priorities documented there without new data that changes the analysis.
- Do not propose content that is already published or already deprioritized. Check the work log first.
- If a session opens with a question about what to do next, report what the work log says — do not brainstorm alternatives.

---

## Project priority order

Work follows this order unless Joe explicitly changes it:

1. **Wine Similarity Hub & Spoke** — active now. All 5 remaining spokes must be written and published before the hub. This project is not complete until the hub is live.
2. **Episode copy and social** — when a new episode is recorded and ready.
3. **SEO Blog Post Sprint** — on hold until all hub/spoke spokes are live. Do not propose blog posts while hub/spoke work remains.

Do not suggest blog post work while the hub/spoke project has open spokes. The queue exists for reference, not as current work.

---

## Blog post prioritization rule

Only propose or write a blog post for an episode or topic where ALL of these are true:
- The episode page (or topic) has **>5,000 impressions** in GSC
- The episode page CTR is **under 0.5%**
- There is no existing blog post already published for that wine/topic

If a page already converts at CTR >1%, a blog post is not needed. Do not suggest it.

To check: `C:/Users/jamme/Downloads/gsc_data_temp/Pages.csv` has current GSC page data. `Queries.csv` has query-level data.

---

## Core behaviors

- Search before asking. Never ask Joe for information retrievable from the website, Drive, or database.
- Read the episode script before writing any episode content. Ratings, tasting notes, and pairings are always in the script. Never use placeholders for these.
- Save all drafts and outputs to disk at `outputs/episodes/ep[NUMBER]-[slug].md` (e.g. `outputs/episodes/ep216-viura.md`). One file per episode, all outputs in that file. This folder is committed to the repo. Update `docs/work-log.md` after every meaningful action and commit immediately.
- Act as a strategist. Proactively flag opportunities. Do not wait to be asked.

---

## Writing blog posts

Full guide: `docs/blog-post-guide.md` — read it every time before writing a post.

Short version:
- State format, target query, source, and schema before writing anything
- Claude Code writes the full draft. Joe edits and publishes.
- After publish: follow `docs/publishing-checklist.md`

---

## Finding files

Search before asking. Never ask Joe for something findable in the Drive, database, or website.

- **Episode scripts:** Check `docs/work-log.md` first — current episode doc IDs are listed there. If not listed, search `db/drivefs_meta_temp.db` → `items` table → `local_title` column. If the episode is too recent to be in the database, use the Drive API to find it by name:
  ```
  node -e "import('./scripts/read_gdoc.js').then(async m => { const {google} = await import('googleapis'); const drive = google.drive({version:'v3', auth: m.getAuthClient()}); const r = await drive.files.list({q:\"name contains 'EPISODE' and mimeType='application/vnd.google-apps.document'\",fields:'files(id,name)',orderBy:'modifiedTime desc',pageSize:10}); console.log(JSON.stringify(r.data.files,null,2)); }).catch(e=>console.error(e.message));"
  ```
  Then run `node scripts/read_gdoc.js <docId>`
- **Other Drive files:** Check `C:/Users/jamme/Downloads/` and `G:/My Drive/Wine Podcast/` before asking
- **Episode URLs:** Search `site:thewinepairpodcast.com` via WebSearch

If OAuth is broken: `rm google_token.json` then `node scripts/setup_google_auth.js`

---

## Work log rules

- `docs/work-log.md` is the source of truth for project status — not memory files, not seo-geo-strategy.md
- Update it immediately after any meaningful work, decision, or status change
- Commit and push after every update
- It tracks current state only — remove completed items once they are no longer relevant

---

## Reference docs (read before relevant work)

| Task | Read first |
|---|---|
| Writing a blog post | `docs/blog-post-guide.md` |
| Publishing a page | `docs/publishing-checklist.md` |
| Episode copy, show notes, social copy | `docs/voice-and-format.md` |
| SEO strategy and priorities | `docs/seo-geo-strategy.md` |
| Project context and show identity | `docs/soul-document.md` |
| Episode title generation | `memory/title_writing.md` (read before every title task; check last 3–5 episode titles first) |
