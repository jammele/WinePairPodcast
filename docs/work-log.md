# Work Log — The Wine Pair Podcast

**Last updated:** 2026-04-28

---

## Immediate next actions

1. **Publish Pinot Noir spoke page** — Joe voice-edits draft, then builds in Beamly. Card embeds and blog post image prompt are ready. Joe has episode links.
2. **Draft remaining 5 Wine Similarity spoke pages** — do all spokes before writing the hub (hub borrows proven language from live spokes).
3. **Write Bread & Butter blog post** (EP143, 8,062 GSC impressions) — show notes already fetched from Drive.

---

## Active projects

### SEO Blog Post Sprint

**Done:**
- "Should You Chill Red Wine?" — published
- "Is Josh Wine Good?" — written with FAQ block included, ready to publish (needs Review Schema in Beamly first)

**Queue (in priority order):**
1. Bread & Butter wine review — **LIVE** at https://thewinepairpodcast.com/blog/is-bread-butter-wine-good-an-honest-review. GSC indexing requested 2026-04-30. Check "URL is on Google" in 3-5 days.
2. Meiomi wine review — EP201, 3,568 impressions, need to read episode script
3. Two Buck Chuck — EP116 + EP140, 1,331+ impressions, need to read episode scripts
4. Pinotage — EP111, 1,722 impressions, need to read episode script
5. "Best Wines Under $20" hub page — under discussion, not started
6. Trader Joe's wine guide
7. Pillar #1 rewrite ("honest wine reviews" angle)

**Technical:**
- Review Schema needs to be added via Beamly code injection on every published review post
- Beamly confirmed: supports per-page code injection
- **Beamly strips `<style>` tags from code embeds.** All HTML card embeds must use fully inline styles (style="" on every element). Never use a `<style>` block inside a Beamly embed — it will be stripped on save/publish.

---

### Wine Similarity Project — "If You Like This Wine, Try That"

**Phase 0 (Foundation): COMPLETE** as of April 19, 2026

**Project docs:** `G:/My Drive/Wine Podcast/Phase 2/Wine Similarity Project/`

**Locked decisions (do not relitigate):**
- Title: "If You Like This Wine, Try That: Your Guide to Finding Similar Wines You'll Love"
- Hub URL: `/similar-wines` (backup: `/find-similar-wines`)
- 6 public dimensions: body, acidity, tannin, sweetness, oak, alcohol (1-10)
- Red style families: Light and Lively, Graceful and Earthy, Classic and Food-Friendly, Bold and Fruit-Forward, Rich and Savory
- Visuals: static dimension bar cards + interactive scatter plot + quick recommender widget
- Phase 1: reds (hub + 6 spoke pages). Spoke #1 is Malbec (template reference).
- All 6 Phase 1 red spokes have dedicated podcast episode links confirmed

**Phase 1 (Hub + 6 red spoke pages): SPOKES IN PROGRESS, HUB NOT STARTED**

**Confirmed order:** Write all 6 spokes first, then hub. Hub borrows proven language from live spokes.

**Claude Code work completed (2026-04-27):**
- Extracted all 75 Winedr wine cards from app source (`wineCards.ts`) into blog-ready JSON
- Added 9 supplemental wines not yet in the app but needed for Phase 1 spoke pages (Merlot, Nero d'Avola, Primitivo, Pinotage, Mencía, Dolcetto, Mourvèdre, Valpolicella, Cinsault)
- All 6 Phase 1 spoke wines confirmed present with correct dimension scores
- Output: `data/wine_similarity_data.json` (84 wines) and `G:/My Drive/Wine Podcast/Phase 2/Wine Similarity Project/wine_data.json`
- Script: `scripts/extract_wine_data.cjs` — re-run anytime the Winedr app wine cards are updated

**Next Claude Code tasks:**
- ~~Build dimension bar card HTML/CSS template~~ DONE — `templates/dimension-bar-card.html`

**Content drafting status:**

| Spoke | Status | Notes |
|---|---|---|
| Pinot Noir | LIVE | https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir |
| Malbec | Not started | Template reference spoke per strategy doc |
| Cabernet Sauvignon | Not started | |
| Chardonnay | Not started | |
| Sauvignon Blanc | Not started | |
| 6th spoke | Not started | TBD — confirm with Joe |
| Hub | Not started | Write after all spokes are live |

**Pinot Noir spoke — assets complete (2026-04-28):**
- Draft: `G:/My Drive/Wine Podcast/Phase 2/Blog Posts/wines-similar-to-pinot-noir.md`
- Card embeds — fully inline styles, Beamly-safe (paste one per code block): `outputs/pinot-noir-wine-cards-embeds.html`
- Card preview (open in browser to verify appearance): `outputs/pinot-noir-wine-cards-preview.html`
- Blog post image: generate in ChatGPT — flat illustration, five wine glasses in a row, different shades of red, wide 16:9, cream background
- Joe has episode links for the page

**Beamly card embed workflow (use for all future spoke pages):**
1. Generate card data from `data/wine_similarity_data.json`
2. Write embeds with fully inline styles — no `<style>` tags (Beamly strips them)
3. One embed block per card in Beamly

**Publishing checklist for Pinot Noir spoke: COMPLETE**
- Published at: https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir

**Key decisions locked (2026-04-27):**
- All Winedr references removed from drafts — app not yet built
- Spoke template Winedr CTA replaced with podcast/newsletter funnel; Winedr drops back in when app launches
- Hub "how the guide works" trust section: use Joe and Carmela's tasting/podcast catalog as credibility, not Winedr
- Soul Document and Strategy doc still reference Winedr as live — revisit when app launches, not urgent

**Open decisions waiting on Joe:**
- [ ] Decide Moscato and Champagne handling (skip until episodes recorded — agreed in session)
- [ ] Confirm whether Winedr style family names propagate to app UI

---

### Episode 215 — Oregon Pinot Noir cheap vs. expensive

**Status:** Recorded. Title and cover art approved. SEO/GEO copy not yet written.

**Title:** Experts Loved the $50 Oregon Pinot Noir. We Chose the $23 Bottle.
**Ratings:** Soter Planet Oregon ($22.97) — Joe 7, Carmela 7 | Chehalem Estate ($50) — Joe 7, Carmela 6
**Finishing pick:** Soter Vineyards Planet Oregon Pinot Noir ($22.97)
**Google Doc ID:** 1GzPVXuCYm7sE87Y-gw0o2TVwDuj6tXK6JYIWRQ6ws1c

---

### Episode 216 — Viura

**Status:** Script exists in Drive. No work done yet.

---

## Indexing issue -- RESOLVED (2026-04-29)

**Root cause found:** Two sitemaps were submitted in GSC — one with `www` and one without. Google had been reading the stale `www` version (last fetched March 2025, 210 pages, 1 error). The error was a dead `/blog/` URL auto-generated by Beamly for EP111 Pinotage with the full show notes as the slug — the page 404s but was still in the sitemap.

**What was done:**
- Manual indexing requested for all 3 posts via GSC URL Inspection
- Non-www sitemap resubmitted — now shows 448 pages, Success, no errors
- Old www sitemap cannot be deleted from GSC (not an option) but is harmless

**Update (2026-04-29):** Google sent validation notification — actively checking "Crawled - currently not indexed" issue affecting 58 pages. Validation takes a few days; GSC will send email when complete.

**Expected:** All 3 posts should appear as "URL is on Google" within 3–5 days. Check GSC URL Inspection around May 2–4.

**Affected pages (check back May 2–4):**
- "Should You Chill Red Wine?"
- "Is Josh Wine Good?"
- Pinot Noir spoke page (https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir)

**New process going forward:** `docs/publishing-checklist.md` — every post must be submitted via GSC URL Inspection on publish day, and sitemap must be resubmitted after each new post goes live.

---

## GSC / SEO checkpoints

- **June 14, 2026:** Check Pillar #2 intent shift. If queries have moved from "podcasters" to listeners, add Chablis → Pillar #2 internal link.
- **June 14, 2026:** Re-run AI discoverability tests in ChatGPT, Gemini, Claude.

---

## Standing open items

- Google OAuth expires periodically — fix: `rm google_token.json` then `node scripts/setup_google_auth.js` (see CLAUDE.md for details)
- Confirm GitHub repo URL: github.com/jammele/WinePairPodcast
