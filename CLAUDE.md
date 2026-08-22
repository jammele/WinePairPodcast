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

## Resuming interrupted tasks

**This section governs the top-level Claude Code session only — never a subagent.** If a subagent spawned via the Agent tool reads `docs/work-log.md` for context and encounters a `## PENDING TASK` section, it must not act on it: not save files beyond what its own task explicitly asked for, not run the validator, not touch `docs/work-log.md`, and never run `git commit` or `git push`. A subagent's job ends when it returns its output to the agent that spawned it — resume/commit/push authority belongs to the top-level session that is actually talking to Joe. (This failure mode happened once: a content-generation subagent for `/generate-episode-content` found a live PENDING TASK block, treated its literal "commit and push" resume steps as instructions for itself, and pushed to the remote with no review step. Subagent prompts for any skill that may run while a PENDING TASK marker exists must explicitly forbid this.)

If `docs/work-log.md` (injected at startup) contains a `## PENDING TASK` section, in the **top-level session**:
1. Report it to Joe before anything else: "There's an unfinished task from a previous session: [task description]."
2. Complete the pending task immediately — do not address other requests first.
3. Follow the resume steps listed in the PENDING TASK section exactly.
4. After completing, remove the entire `## PENDING TASK` section from `docs/work-log.md` and commit.

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

Every blog post candidate must go through the opportunity brief process **before** any episode selection, format selection, or drafting begins. The impression threshold rule is retired — page-level impressions alone do not establish query demand.

**The correct process:**
1. Identify a candidate topic (question, wine, or category with potential search demand)
2. Complete an opportunity brief at `docs/opportunity-briefs/[slug]-brief.md` using the template at `docs/opportunity-briefs/template.md`
3. The brief requires: query-cluster evidence (not page impressions), full archive inventory, Wine Pair angle, excluded scope, and Joe's explicit approval
4. After Joe approves the brief: select format, episode sources, and target query from the brief's outputs
5. Only then begin drafting

When Joe asks about the next blog post, report what the work log says about the current candidate — do not generate a new candidate queue from impression data alone.

To check performance data: `C:/Users/jamme/Downloads/gsc_data_temp/Pages.csv` has page-level GSC data. `Queries.csv` has query-level data. The opportunity brief requires query-cluster data from the Queries dimension, not page-level aggregates.

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
- Complete and get Joe's approval on an opportunity brief at `docs/opportunity-briefs/[slug]-brief.md` **before** selecting format, episode, or target query
- Format, target query, source, and schema are outputs of the approved brief — not independent upfront declarations
- Joe records his approval by creating `docs/opportunity-briefs/approvals/[slug].approved` — Claude never creates or modifies files in that directory (HR-65)
- A `PreToolUse` hook in `.claude/settings.json` blocks Write, Edit, and common Bash patterns for `outputs/blog-post-*.md` unless: (a) the brief exists, (b) the approval file exists, and (c) the brief passes structural validation
- **Known limitation:** Bash path detection works only when the file path appears explicitly in the command string. Indirect writes (e.g., a dynamically constructed path in `node -e`) are not catchable without OS-level sandboxing. This is a gap, not a loophole — using a terminal command to bypass the hook is a rule violation.
- Claude Code writes the full draft. Joe edits and publishes.
- After publish: follow `docs/publishing-checklist.md`

---

## Finding files

Search before asking. Never ask Joe for something findable in the Drive, database, or website.

- **Episode transcripts:** Check `C:/Users/jamme/Downloads/` first. Files are named `transcript-[episode-slug]-[version].txt` (e.g., `transcript-costco-kirkland-signature-challenge-2023-pauillac-and-2023-saint-julien-0.0.1.txt`). Slug = episode title lowercased, words hyphenated, special characters stripped, version suffix `0.0.1` or `0.0.2`. These auto-generated transcripts reflect what was actually said on air and are also published in the show notes. Use the transcript (not the script) when finding specific dialogue moments or quotes. Never claim a transcript is unavailable without searching Downloads for `transcript-*.txt`.
- **Episode scripts:** Check `docs/work-log.md` first — current episode doc IDs are listed there. If not listed, search `db/drivefs_meta_temp.db` → `items` table → `local_title` column. If the episode is too recent to be in the database, use the Drive API to find it by name:
  ```
  node scripts/find_episode.mjs "search term"
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
- Repo data files that need updating follow the same rule: update immediately when the triggering event happens, not at session end. `data/cover-art-scenes.md` is a partial exception: it updates only after Joe approves the final generated image, not at concept selection; see the cover art row below for the full sequence.

---

## Reference docs (read before relevant work)

| Task | Read first |
|---|---|
| Writing a spoke page | `docs/spoke-page-checklist.md` — run all 3 passes. After writing: `node scripts/validate_spoke.js` then `/review-wine-cards` then `/review-spoke` before showing Joe anything. Draft must include FAQPage schema block at the bottom with COPY START / COPY END markers. |
| Writing a blog post | Complete opportunity brief first (`docs/opportunity-briefs/template.md`) — get Joe's approval before touching the draft. Joe records approval by creating `docs/opportunity-briefs/approvals/[slug].approved` (Claude never creates this). After approval: read `docs/blog-post-guide.md`. Draft must include Review Schema (see two-reviewer hold note in guide) and all Beamly fields with COPY START / COPY END markers. After writing: run `/review-blog-post <filepath>` and fix ALL reported issues before showing Joe anything. |
| Publishing a page | `docs/publishing-checklist.md` — after Joe publishes: run `/verify-published <url>` to confirm schema, card badges, author byline, and meta description are all rendering correctly. |
| Cover art image prompts | Run `/generate-cover-art` before showing Joe any concepts. After Joe selects a concept, save the exact production prompt immediately; Joe then creates the artwork in ChatGPT. Concept selection and prompt creation are not final-image approval. Only after Joe approves the final generated image, update `data/cover-art-scenes.md` and the applicable session report. Show Joe the complete diff and verification results, and do not commit or push until Joe explicitly approves. |
| Episode SEO/AEO content and Bluesky posts | Run `/generate-episode-content` — reads episode script, spawns sub-agent, saves to `outputs/episodes/ep[N]-[slug].md`, runs `node scripts/validate_episode.js`. Fix all errors before showing Joe. |
| Episode copy, show notes, social copy | `docs/voice-and-format.md` |
| Wine in the News segment | `docs/wine-in-the-news.md` — read before finding stories or writing the script |
| SEO strategy and priorities | `docs/seo-geo-strategy.md` |
| Project context and show identity | `docs/soul-document.md` |
| Strategic recommendations, content evaluation, episode direction | `docs/strategic-intelligence.md` — living log of research findings, audience signals, and data points. Read alongside soul doc and SEO strategy. Add an entry whenever Joe shares a relevant article or data point. |
| Episode title generation | Run `/review-titles`: **mandatory before showing Joe any options.** Generate and review title options, then present every rule-compliant title plus the session report to Joe and ask him to select or revise. Stop without writing, committing, or pushing any file. After Joe confirms a title, update the session report, Patterns Learned (only when genuinely warranted), and `data/episode-titles.md`; show Joe the exact diff and verification results; commit and push only after Joe's explicit approval. |
