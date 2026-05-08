# Work Log — The Wine Pair Podcast

**Last updated:** 2026-05-04

---

## Immediate next actions

1. **FAQPage schema — 4 remaining pages** — Blocks are ready in `outputs/seo-aeo/faqpage-schema-blocks.md`. Add to each page in order: Malbec spoke, Bread & Butter review, Is Josh Wine Good?, Should You Chill Red Wine?. WARNING: After adding to Malbec spoke (which has wine cards), re-paste all card blocks from `outputs/malbec-wine-cards-embeds.html` — Beamly re-encoding bug will break badges on re-save.
2. **Next spoke page** — Cabernet Sauvignon (draft ready). Then Chardonnay, Sauvignon Blanc, 6th spoke (TBD). All must be live before hub is written.
3. **Check GSC May 2-5** — Confirm "URL is on Google" for the 4 posts with pending indexing requests.

Blog post sprint resumes after all spokes are live.

---

## Active projects

### Wine Similarity Hub & Spoke — "If You Like This Wine, Try That"

**This is the primary structural project. Spoke pages before hub.**

**Locked decisions:**
- Title: "If You Like This Wine, Try That: Your Guide to Finding Similar Wines You'll Love"
- Hub URL: `/similar-wines`
- Phase 1: 6 red spoke pages, then hub. All spokes must be live before hub goes up.
- Spoke #1 (template reference): Malbec

**Content status:**

| Spoke | Status | Notes |
|---|---|---|
| Pinot Noir | LIVE | https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir |
| Malbec | **LIVE** | https://thewinepairpodcast.com/blog/wines-similar-to-malbec |
| Cabernet Sauvignon | **Draft ready** | `outputs/cabernet-sauvignon-spoke.md`, cards: `outputs/cabernet-sauvignon-wine-cards-embeds.html` |
| Chardonnay | Not started | |
| Sauvignon Blanc | Not started | |
| 6th spoke | Not started | Waiting on Joe to confirm |
| Hub | Not started | Write after all spokes live |

**Assets:**
- Wine data: `data/wine_similarity_data.json` (84 wines)
- Card embed template: `outputs/pinot-noir-wine-cards-embeds.html` (use as reference)
- Dimension bar card template: `templates/dimension-bar-card.html`

**Open decisions waiting on Joe:**
- [ ] Confirm 6th spoke wine
- [ ] Confirm whether Winedr style family names propagate to app UI

---

### SEO Blog Post Sprint

**Logic: Target pages with high impressions and low/no clicks. Episode pages don't convert — blog posts do.**

**Published (indexing requested):**
- "Should You Chill Red Wine?" — 2026-04-29
- "Is Josh Wine Good?" — 2026-04-29
- Bread & Butter review — https://thewinepairpodcast.com/blog/is-bread-butter-wine-good-an-honest-review — 2026-04-30

**Queue — ON HOLD until all hub/spoke spokes are live. For reference only.**

| Priority | Post | Episode | Impressions | Clicks | CTR |
|---|---|---|---|---|---|
| 1 | Portuguese wine | episode page | 20,154 | 19 | 0.09% |
| 2 | Two Buck Chuck | EP116 + EP140 | 5,055 | 13 | 0.26% |
| 3 | Pinotage | EP111 | 6,011 | 21 | 0.35% |
| 4 | Best Wines Under $20 hub | — | — | — | — |
| 5 | Trader Joe's wine guide | — | — | — | — |
| 6 | Pillar #1 rewrite | — | — | — | — |
| 7 | Gen Z / anti-condescension post | — | brand-building | — | — |

**#7 — Gen Z / anti-condescension post:** Inspired by "Gen Z to Wine: Please Stop Condescending" (Everyday Drinking, May 2026). Brand-building, not SEO-driven. Angle: the wine world has a condescension problem — here's what we do differently, and how to actually get into wine without feeling stupid. Strong CTA into the show. Write when sprint resumes.

**NOT in queue — Meiomi:** Episode page already converts at 1.18% CTR (241 clicks / 20,494 impressions). No blog post needed.

**How blog posts work (locked 2026-04-30):**
- Claude Code reads the episode script, writes the full draft, generates Review Schema and all Beamly fields
- Joe edits the draft, builds in Beamly, publishes
- Full process: `docs/blog-post-guide.md`

**Beamly fields confirmed:**
- Excerpt / Short description
- Custom SEO Title / Custom SEO Description
- URL slug (set manually)
- Code block at bottom: Buzzsprout embed + Review Schema combined

**Beamly strips `<style>` tags.** All HTML card embeds must use fully inline styles.

---

### Episode 215 — Oregon Pinot Noir cheap vs. expensive

**Status:** Recorded. Title and cover art approved. SEO/GEO copy not yet written.

**Title:** Experts Loved the $50 Oregon Pinot Noir. We Chose the $23 Bottle.
**Ratings:** Soter Planet Oregon ($22.97) — Joe 7, Carmela 7 | Chehalem Estate ($50) — Joe 7, Carmela 6
**Google Doc ID:** 1GzPVXuCYm7sE87Y-gw0o2TVwDuj6tXK6JYIWRQ6ws1c

---

### Episode 216 — Viura

**Status:** Complete.
**Google Doc ID:** 1ElzHd3K8lbLQageMUZ4evB2g9JQcYFQhfuBBMPK3b60
**Confirmed title:** Viura: The Great White Wine Hiding in Rioja's Red Wine Shadow
**Wines:** 2024 CVNE Monopole ($14.97) — Joe 7, Carmela 8 | 2024 Sierra de Tolono Rioja Blanco ($24.97) — Joe 8, Carmela 8
**Finish tonight:** Both chose Sierra de Tolono
**Outputs:** `outputs/episodes/ep216-viura.md` — Key Questions, Q&A, FAQ schema, 10 Bluesky posts
**Cover art:** Concept selected. Use image-reference workflow with ep215 approved image. Scene description in `memory/feedback_cover_art.md`.

---

## Indexing — current status (as of 2026-04-30)

**Root cause resolved:** Stale www sitemap was preventing Google from discovering new pages. Non-www sitemap resubmitted 2026-04-29, now shows 448 pages, no errors.

**Google validation in progress:** GSC validating "Crawled - currently not indexed" issue affecting 58 pages.

**Posts with indexing requests submitted — check May 2-5:**
- "Should You Chill Red Wine?"
- "Is Josh Wine Good?"
- Pinot Noir spoke (https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir)
- Bread & Butter review (https://thewinepairpodcast.com/blog/is-bread-butter-wine-good-an-honest-review)

**Process going forward:** After every publish, submit URL in GSC → URL Inspection → Request Indexing, then resubmit the non-www sitemap. See `docs/publishing-checklist.md`.

---

## GSC / SEO checkpoints

- **May 2-5, 2026:** Check indexing status on all 4 submitted posts
- **June 14, 2026:** Check Pillar #2 intent shift; re-run AI discoverability tests

---

## System changes made 2026-05-04

- **Built SEO & AEO analyzer tool** (`scripts/seo-aeo/`): scans portfolio of pages against 30+ content signals across 6 categories (On-Page SEO, Technical SEO, Schema, Featured Snippet, Conversational, AI Readiness) plus Google Lighthouse. Outputs HTML dashboard to `outputs/seo-aeo/report.html`. Run with `npm run seo` (full, ~8 min) or `npm run seo:fast` (content only, ~30 sec). Portfolio in `scripts/seo-aeo/page-portfolio.json`.
- **Author participant rule established:** Every blog post and spoke page must have Joe Mele added as a participant with role "Author" in Beamly (Authors / Participants section). Profile already exists — just connect it. Added to `docs/publishing-checklist.md`, `docs/blog-post-guide.md`, and memory. Note: Beamly renders the byline visually but does not inject it into Article schema (platform limitation, worth raising with Beamly support).
- **Existing posts needing author added:** Pinot Noir spoke, Malbec spoke, Bread & Butter review, "Should You Chill Red Wine?", "Is Josh Wine Good?" — all published without author participant. Cab Sauv spoke already updated.
- **FAQPage schema added to Pinot Noir spoke** — schema blocks generated for 5 published pages in `outputs/seo-aeo/faqpage-schema-blocks.md`. Pinot Noir done. Four remaining: Malbec, Bread & Butter, Is Josh Wine Good?, Should You Chill Red Wine?
- **Beamly re-encoding bug documented:** When a published page is edited and re-saved in Beamly, all `<span>` tags inside existing code embed blocks are HTML-encoded (e.g., badge labels show as raw `<span style="...">` text instead of rendering). Fix: after editing any page with wine cards, delete all card code blocks in Beamly and re-paste from the source file in `outputs/`. Documented in `memory/feedback_beamly.md` and `docs/publishing-checklist.md`.
- **Created `/verify-published` slash command** at `.claude/commands/verify-published.md` — runs after Joe publishes or edits any page. Checks: card re-encoding (encoded spans), FAQPage schema present, Review schema present (where applicable), meta description set, author byline visible, page title set. Closes the loop between "code pasted in Beamly" and "confirmed working on live page." Updated CLAUDE.md reference table to require this after every publish.

---

## System changes made 2026-05-03

- **Cabernet Sauvignon spoke completed:** Draft at `outputs/cabernet-sauvignon-spoke.md`, cards at `outputs/cabernet-sauvignon-wine-cards-embeds.html`. Wine list: Merlot, Bordeaux Blend, Carménère, Tannat, Rioja, Barolo. Title: "Wines Similar to Cabernet Sauvignon: Cabernet Lovers Love These Wines, Too."
- **Created `/review-wine-cards` slash command** at `.claude/commands/review-wine-cards.md` — mandatory QA step for HTML wine card files. Checks: description fragment format (predicate clauses, comparative clauses, subject-verb clauses, 4-item sentence 2, explanatory phrases), em-dashes, style tags, card count, badge assignments, bar width math, footer format, sentence 3 quality.
- **Updated `scripts/validate_spoke.js`** — added word-count check (S1 and S2 must be under 14 words) and comma-count check (S2 must have ≤2 commas / exactly 3 flavor notes). Updated Cab Sauv wine list with Carménère accent. Updated EXISTING_SPOKE_WINES for all three published spokes.
- **Enhanced `.claude/commands/review-spoke.md`** — subagent now required to use WebSearch to verify factual claims and compare wine list against expert sources. Added Carménère accent throughout.
- **Updated `docs/spoke-page-checklist.md`** — Pass 3 is now three mandatory steps in order: validate_spoke.js → /review-wine-cards → /review-spoke. Wine list corrected to include Carménère.
- **Updated `memory/feedback_spoke_pages.md`** — card format rule expanded with side-by-side correct/wrong examples and third regression documented. Subtitle rule updated with confirmed Cab Sauv subtitle.
- **Root cause for recurring card format regression:** Cards were drafted without explicitly consulting the Malbec reference. Three-layer fix now in place: /review-wine-cards mandatory step, validator word-count/comma checks, expanded memory documentation.

---

## System changes made 2026-05-01

- Corrected blog post queue: removed Meiomi (already converts at 1.18% CTR / 241 clicks — no post needed), added Portuguese wine episode as #1 SEO priority (20,154 impr, 19 clicks, 0.09% CTR)
- Added blog post threshold rule to CLAUDE.md: only propose posts where impressions >5,000 AND CTR <0.5%
- Added project priority order to CLAUDE.md: hub/spoke first, blog posts second
- Added session discipline rules to CLAUDE.md: work log is authoritative, never contradict it without new data
- Doc consolidation: 16 docs → 9. Deleted 7 obsolete files. Merged editorial-rules, social-style, episode-format into `docs/voice-and-format.md`. Folded drive-retrieval-rules into CLAUDE.md.
- Updated seo-geo-strategy.md: removed stale April calendar, updated priority table with real GSC page-level data
- Added `memory/feedback_session_discipline.md` — rules for staying on documented priorities

---

## Standing open items

- Google OAuth expires periodically — fix: `rm google_token.json` then `node scripts/setup_google_auth.js`
- GitHub repo: github.com/jammele/WinePairPodcast
