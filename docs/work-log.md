# Work Log — The Wine Pair Podcast

**Last updated:** 2026-05-01 (end of session)

---

## Immediate next actions

1. **Malbec spoke page** — Next in hub/spoke plan. Pinot Noir is live; Malbec is the template reference spoke. Write before any other spokes.
2. **Remaining 4 spokes** — Cabernet Sauvignon, Chardonnay, Sauvignon Blanc, 6th spoke (TBD). All must be live before hub is written.
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
| Malbec | **NEXT** | Template reference spoke — write first |
| Cabernet Sauvignon | Not started | |
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

**Status:** All written outputs complete. Cover art pending ChatGPT generation. Show notes not yet published.
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
