# Work Log — The Wine Pair Podcast

**Last updated:** 2026-04-30

---

## Immediate next actions

1. **Meiomi blog post** — EP201, 3,568 impressions. Next in the SEO sprint queue.
2. **Check GSC May 2-5** — Confirm "URL is on Google" for the 4 posts that had indexing requests submitted (Chill Red Wine, Josh Wine, Pinot Noir spoke, Bread & Butter).
3. **Draft remaining 5 Wine Similarity spoke pages** — Malbec is the template reference spoke.

---

## Active projects

### SEO Blog Post Sprint

**Live:**
- "Should You Chill Red Wine?" — published, indexing requested 2026-04-29
- "Is Josh Wine Good?" — published, indexing requested 2026-04-29
- Pinot Noir spoke — https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir — indexing requested 2026-04-29
- Bread & Butter review — https://thewinepairpodcast.com/blog/is-bread-butter-wine-good-an-honest-review — published and indexed requested 2026-04-30

**Queue (in priority order):**
1. Meiomi wine review — EP201, 3,568 impressions
2. Two Buck Chuck — EP116 + EP140, 1,331+ impressions
3. Pinotage — EP111, 1,722 impressions
4. "Best Wines Under $20" hub page
5. Trader Joe's wine guide
6. Pillar #1 rewrite ("honest wine reviews" angle)

**How blog posts work (locked 2026-04-30):**
- Claude Code reads the episode script, writes the full draft, generates Review Schema and all Beamly fields
- Joe edits the draft, builds in Beamly, publishes
- Full process: `docs/blog-post-guide.md`

**Beamly fields confirmed:**
- Excerpt / Short description
- Custom SEO Title
- Custom SEO Description
- URL slug (set manually)
- Code blocks for: Buzzsprout embed + Review Schema (one combined code block at the bottom of the post)

**Review Schema:** All three blocks for a multi-wine review go in one code block, pasted at the very bottom of the post in Beamly.

**Beamly strips `<style>` tags.** All HTML card embeds must use fully inline styles.

---

### Wine Similarity Project — "If You Like This Wine, Try That"

**Locked decisions:**
- Title: "If You Like This Wine, Try That: Your Guide to Finding Similar Wines You'll Love"
- Hub URL: `/similar-wines`
- Phase 1: 6 red spoke pages, then hub. Write all spokes before hub.
- Spoke #1 (template reference): Malbec

**Content status:**

| Spoke | Status | Notes |
|---|---|---|
| Pinot Noir | LIVE | https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir |
| Malbec | Not started | Template reference spoke |
| Cabernet Sauvignon | Not started | |
| Chardonnay | Not started | |
| Sauvignon Blanc | Not started | |
| 6th spoke | Not started | TBD |
| Hub | Not started | Write after all spokes live |

**Assets:**
- Wine data: `data/wine_similarity_data.json` (84 wines)
- Card embed template: `outputs/pinot-noir-wine-cards-embeds.html` (use as reference)
- Dimension bar card template: `templates/dimension-bar-card.html`

**Open decisions waiting on Joe:**
- [ ] Confirm 6th spoke wine
- [ ] Confirm whether Winedr style family names propagate to app UI

---

### Episode 215 — Oregon Pinot Noir cheap vs. expensive

**Status:** Recorded. Title and cover art approved. SEO/GEO copy not yet written.

**Title:** Experts Loved the $50 Oregon Pinot Noir. We Chose the $23 Bottle.
**Ratings:** Soter Planet Oregon ($22.97) — Joe 7, Carmela 7 | Chehalem Estate ($50) — Joe 7, Carmela 6
**Google Doc ID:** 1GzPVXuCYm7sE87Y-gw0o2TVwDuj6tXK6JYIWRQ6ws1c

---

### Episode 216 — Viura

**Status:** Script exists in Drive. No work done yet.

---

## Indexing — current status (as of 2026-04-30)

**Root cause resolved:** Stale www sitemap (not read since March 2025) was preventing Google from discovering new pages. Non-www sitemap resubmitted 2026-04-29, now shows 448 pages, no errors.

**Google validation in progress:** GSC sent notification that it is validating "Crawled - currently not indexed" issue affecting 58 pages. Expect email when complete.

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

## System changes made 2026-04-30

- `docs/blog-post-guide.md` created — single source of truth for writing blog posts (replaces scattered rules across multiple docs)
- `CLAUDE.md` streamlined — now a concise reference with a table pointing to the right doc for each task
- `docs/publishing-checklist.md` — post-publish indexing and diagnostics workflow
- Google OAuth re-auth process documented in CLAUDE.md

---

## Standing open items

- Google OAuth expires periodically — fix: `rm google_token.json` then `node scripts/setup_google_auth.js`
- GitHub repo: github.com/jammele/WinePairPodcast
