# The Wine Pair Podcast – Claude Code Operating Instructions

---

## Session startup -- runs automatically via hook

A `UserPromptSubmit` hook (`scripts/hooks/session-startup.js`) runs the startup routine automatically on the first message of every session. It:
1. Runs the three sync scripts
2. Reads and injects the top 80 lines of `docs/work-log.md`
3. Instructs Claude to report the startup summary before addressing the user's request

**If the hook output is present in context:** Report the startup summary as the first thing, then address the user's request.

**If the hook failed or context is missing startup data:** Run startup manually before responding:
- Read `docs/house-rules.md`
- Run: `node scripts/find_source_files.js --scan`, `node scripts/update_episode_titles.js`, `node scripts/ingest_prompts.js`
- Read `docs/work-log.md`
- Report summary: "Drive synced: X files indexed, Y titles updated, Z prompts synced. Current priorities: 1. [next] 2. [next] 3. [next]"

**After startup (hook or manual):**
- The work log is the authority. Do not question or contradict priorities documented there without new data that changes the analysis.
- Do not propose content that is already published or already deprioritized.
- If a session opens with a question about what to do next, report what the work log says — do not brainstorm alternatives.

---

## When Joe corrects a rule violation

1. Add or update the rule in `docs/house-rules.md`
2. Commit and push
3. Done — no other files need updating

**Never add content rules to memory files.** Memory files are for project context, user profile, and external references. `docs/house-rules.md` is the only authoritative source for non-negotiable rules.

---

## The mission — why we do all of this

**Goal: grow podcast listeners.**

We attract listeners by becoming discoverable to people searching for wine and wine podcasts — through Google and AI models (Gemini, ChatGPT, Claude, Copilot, Perplexity). Target audiences include:
- People searching for specific wines ("is Josh wine good," "wines similar to Malbec")
- People searching for wine education ("what is Frappato," "should you chill red wine")
- People searching for wine podcasts ("best wine podcast," "honest wine reviews podcast," "wine podcast for beginners")

**The ecosystem has three pillars:**
1. The podcast — the core product
2. The website + blog — discovery engine (blog posts, spoke pages, FAQPage schema, AEO canonical language)
3. The Winedr companion app — engagement tool (React Native, shares wine data with podcast-os via `data/wine_similarity_data.json`)

Everything we build in podcast-os serves this ecosystem. Blog posts, spoke pages, episode SEO, FAQ schema, and canonical AEO language are all part of one listener-growth strategy — not separate projects.

---

## Project priority order

Work follows this order unless Joe explicitly changes it. Listener growth always supersedes sequencing.

1. **Spoke pages (blog posts)** — Spoke pages ARE blog posts. Currently the highest-leverage activity. Cabernet Sauvignon draft ready; then Chardonnay, Sauvignon Blanc, 6th spoke (TBD). All must be live before the hub. When Joe asks "what's next for the blog?" — the current spoke is the answer. Never say "the blog is on hold."
2. **Episode copy and social** — when a new episode is recorded and ready.
3. **Episode-based blog posts** — Posts for high-impression/low-CTR episode topics. Hub/spoke is the current priority, but these are not absolutely blocked if a compelling data signal exists. Queue is in `docs/work-log.md`.

Do not propose episode-based queue posts while spoke work is the priority, unless a clear listener-growth case exists for doing so.

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

- **For any analysis spanning GSC data, site performance, or project status:** Read `docs/work-log.md` first. Then include the relevant sections when briefing any sub-agent. A sub-agent with no project context will make the same errors the main agent makes without it.
- Search before asking. Never ask Joe for information retrievable from the website, Drive, or database.
- Read the episode script before writing any episode content. Ratings, tasting notes, and pairings are always in the script. Never use placeholders for these.
- Save all drafts and outputs to disk at `outputs/episodes/ep[NUMBER]-[slug].md` (e.g. `outputs/episodes/ep216-viura.md`). One file per episode, all outputs in that file. This folder is committed to the repo. Update `docs/work-log.md` after every meaningful action and commit immediately.
- Act as a strategist. Proactively flag opportunities and potential next steps — but do not run generation tasks without being explicitly asked. Flagging is: "This topic has high search volume — a blog post could be worth it." Running is: generating content, spawning subagents, writing files. The former needs no ask. The latter always does.
- **When Joe says a page is published** (any phrasing: "it's live", "I published it", "done", "it's up", "I added the code", "the page is updated"): immediately run `/verify-published <url>`. Do not wait to be asked. If the URL is not clear from context, ask for it — but do not skip the check. This applies to new pages AND edits to existing pages.

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
- **Update it during the task, not at the end of the session.** Every completed task, decision, or status change gets logged and committed before moving on to the next thing. Do not batch updates. Do not wait to be asked.
- Commit and push after every update — never leave uncommitted work log changes
- It tracks current state only — remove completed items once they are no longer relevant
- Repo data files that need updating (e.g. `data/cover-art-scenes.md` after a concept is picked) follow the same rule: update immediately, not at session end

---

## Reference docs (read before relevant work)

| Task | Read first |
|---|---|
| Writing a spoke page | `docs/spoke-page-checklist.md` — run all 3 passes. After writing: `node scripts/validate_spoke.js` then `/review-wine-cards` then `/review-spoke` before showing Joe anything. Draft must include FAQPage schema block at the bottom with COPY START / COPY END markers. |
| Writing a blog post | `docs/blog-post-guide.md` — draft must include Review Schema, FAQPage schema block, and all Beamly fields at the bottom with COPY START / COPY END markers. |
| Publishing a page | `docs/publishing-checklist.md` — after Joe publishes: run `/verify-published <url>` to confirm schema, card badges, author byline, and meta description are all rendering correctly. |
| Cover art image prompts | Run `/generate-cover-art` — mandatory before showing Joe any concepts. After Joe picks a concept, immediately update `data/cover-art-scenes.md` (add chosen concept's structural type, remove oldest if list exceeds 5) and commit. |
| Episode SEO/AEO content and Bluesky posts | Run `/generate-episode-content` — reads episode script, spawns sub-agent, saves to `outputs/episodes/ep[N]-[slug].md`, runs `node scripts/validate_episode.js`. Fix all errors before showing Joe. |
| Episode copy, show notes, social copy | `docs/voice-and-format.md` |
| Wine in the News segment | `docs/wine-in-the-news.md` — read before finding stories or writing the script |
| SEO strategy and priorities | `docs/seo-geo-strategy.md` |
| Project context and show identity | `docs/soul-document.md` |
| Episode title generation | Run `/review-titles` — **mandatory before showing Joe any options.** Sub-agent reads `data/episode-titles.md` (complete archive + series patterns). When a title is confirmed, add it to `data/episode-titles.md` before committing. |
