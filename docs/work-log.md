# Work Log — The Wine Pair Podcast

**Last updated:** 2026-04-27

---

## Immediate next actions

1. **Write Bread & Butter blog post** (EP143, 8,062 GSC impressions) — show notes already fetched from Drive. Next in the blog post queue.
2. **Draft Wine Similarity hub page copy** — foundation complete, content drafting is the next phase. See project docs in `G:/My Drive/Wine Podcast/Phase 2/Wine Similarity Project/`.
3. **Publish Josh Wine post** — written and ready. Joe needs to add Review Schema in Beamly before publishing. File: `G:/My Drive/Wine Podcast/Phase 2/Blog Posts/Blog Post - Josh Wine Review.txt`

---

## Active projects

### SEO Blog Post Sprint

**Done:**
- "Should You Chill Red Wine?" — published
- "Is Josh Wine Good?" — written with FAQ block included, ready to publish (needs Review Schema in Beamly first)

**Queue (in priority order):**
1. Bread & Butter wine review — EP143, 8,062 impressions, show notes fetched
2. Meiomi wine review — EP201, 3,568 impressions, need to read episode script
3. Two Buck Chuck — EP116 + EP140, 1,331+ impressions, need to read episode scripts
4. Pinotage — EP111, 1,722 impressions, need to read episode script
5. "Best Wines Under $20" hub page — under discussion, not started
6. Trader Joe's wine guide
7. Pillar #1 rewrite ("honest wine reviews" angle)

**Technical:**
- Review Schema needs to be added via Beamly code injection on every published review post
- Beamly confirmed: supports per-page code injection

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

**Phase 1 (Hub + 6 red spoke pages): DATA READY, CONTENT NOT STARTED**

**Claude Code work completed (2026-04-27):**
- Extracted all 75 Winedr wine cards from app source (`wineCards.ts`) into blog-ready JSON
- Added 9 supplemental wines not yet in the app but needed for Phase 1 spoke pages (Merlot, Nero d'Avola, Primitivo, Pinotage, Mencía, Dolcetto, Mourvèdre, Valpolicella, Cinsault)
- All 6 Phase 1 spoke wines confirmed present with correct dimension scores
- Output: `data/wine_similarity_data.json` (84 wines) and `G:/My Drive/Wine Podcast/Phase 2/Wine Similarity Project/wine_data.json`
- Script: `scripts/extract_wine_data.cjs` — re-run anytime the Winedr app wine cards are updated

**Next Claude Code tasks:**
- ~~Build dimension bar card HTML/CSS template~~ DONE — `templates/dimension-bar-card.html`

**Content drafting status:**
- Pinot Noir spoke page — DRAFT COMPLETE (2026-04-27), saved to `G:/My Drive/Wine Podcast/Phase 2/Blog Posts/wines-similar-to-pinot-noir.md`
- Hub page — deferred until Pinot Noir spoke is voice-edited and live; hub borrows proven language from it

**Next Claude Code task (start of next session):**
Generate 7 ready-to-paste Beamly HTML card blocks for the Pinot Noir spoke page:
- Oregon Pinot Noir (anchor card)
- Frappato
- Beaujolais
- Cinsault
- Mencía
- Etna Rosso
- Red Burgundy

Wine card dimensions and scores are all in `data/wine_similarity_data.json`. HTML template is in `templates/dimension-bar-card.html`. Output should be 7 standalone `.wine-card` div blocks, one per wine, ready to paste into Beamly HTML blocks.

**Publishing checklist for Pinot Noir spoke:**
1. [ ] Joe voice-edits the draft (read aloud, fix anything that doesn't sound right)
2. [ ] Claude Code generates 7 HTML card blocks (next session — first task)
3. [ ] Joe creates page in Beamly at `/wines-similar-to-pinot-noir`
4. [ ] Joe pastes text + swaps [WINE_CARD] placeholders with HTML card blocks
5. [ ] No Review Schema needed (similarity guide, not a wine review)
6. [ ] Publish

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

## GSC / SEO checkpoints

- **June 14, 2026:** Check Pillar #2 intent shift. If queries have moved from "podcasters" to listeners, add Chablis → Pillar #2 internal link.
- **June 14, 2026:** Re-run AI discoverability tests in ChatGPT, Gemini, Claude.

---

## Standing open items

- Google OAuth needs refresh (ingest_prompts.js failing with auth error each session)
- Confirm GitHub repo URL: github.com/jammele/WinePairPodcast
