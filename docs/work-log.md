# Work Log — The Wine Pair Podcast

**Last updated:** 2026-05-09 (session 3)

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

### Episode 217 — Frappato

**Status:** SEO/AEO complete. Cover art Concept C (ice bucket ceremony) selected. Ready to publish.
**Google Doc ID:** 1R8HMN-gf8kfT7Dxqvmm8rXC2f4g6wGkT_1h5vQ243yo
**Confirmed title:** Italian Wine Adventure #24: Frappato! The Chillable Red Wine!
**Wines:** 2022 Valle Dell'Acate Il Frappato Vittoria ($22.99) — Joe 8, Carmela 8 | 2024 Gurrieri Frappato ($27.97) — Joe 6, Carmela 6
**Finish tonight:** Both chose Valle Dell'Acate
**Outputs:** `outputs/episodes/ep217-frappato.md` — Cover art (3 concepts), Key Questions, Q&A, Schema markup (Review x2 + FAQPage), 10 Bluesky posts

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

## System changes made 2026-05-09 (session 3 — cover art system fix)

- **Fixed `/generate-cover-art` — four bugs resolved.** (1) Subagent could not read `memory/feedback_cover_art.md` (wrong path — memory files are not in the project directory). Fixed: main agent now reads the file at the correct absolute path and injects recent scenes into the subagent prompt before spawning. (2) Fallback prompts for ep217 Concepts A and B contained "No wine labels." in the negative prompt, violating HR-10. Fixed. (3) Overcorrection in initial fix banned the long multi-section template format — but ep216 confirmed that format + uploaded reference image is the working formula. Reverted; only "No wine labels." is banned. (4) Backgrounds were going near-black. Updated HR-11 and all prompts to use "rich warm burgundy background" instead of "deep burgundy."
- **Ep216 scene logged** in `memory/feedback_cover_art.md`: Joe pulling white wine bottle from rack of red bottles. Structure: "hidden gem discovery / one thing standing out against many."
- **Ep217 confirmed:** Concept C (ice bucket ceremony) selected. `memory/feedback_cover_art.md` updated. All three ep217 prompts corrected and pushed.
- **Key lesson documented:** The reference image IS the style guide. Always upload the most recent approved cover art image to ChatGPT before pasting the prompt. Text prompts for style are lossy without it.

## System changes made 2026-05-09 (session 2 — structural rebuild)

- **Created `docs/house-rules.md`** — single source of truth for all non-negotiable rules. 27 numbered rules (HR-1 through HR-27) covering: writing (no em-dashes, Q./A. format, no invented facts), spoke pages (card format, Syrah, subtitle, image prompts), cover art (ep215 structure, wine labels, dark backgrounds, scoring), episode titles (character count, grape required, no spam), Beamly (inline styles, author participant, re-encoding bug), and process (pre-write checklist, script-first, social limits, auto-verify-published). Rule update protocol documented: update house-rules.md, commit, done.
- **Rebuilt CLAUDE.md** — house-rules.md added as step 1 of session startup (before scripts, before work log). Correction protocol added: all content rules go to house-rules.md, not memory files. Removed the "command file rules" section (superseded by this architecture). Reference table updated.
- **Rebuilt all 5 command files** — every sub-agent prompt now opens with "Step 1: Read docs/house-rules.md in its entirety. Apply every rule in it." Removed all embedded rule lists from command files (they were copies that would drift). Commands are now task-specific only; rules come from the shared source.
- **Cleaned up 6 memory files** — replaced rule content with pointers to house-rules.md. Kept context, style guidance, and reference notes. Memory files are now for context only, not rules.
- **Root cause fixed:** Rules lived in memory files (outside the repo, inaccessible to sub-agents). Sub-agents ran without the rules established to fix past mistakes. All rules now live in docs/house-rules.md (in the repo, readable by any sub-agent via the Read tool). One file to update. No propagation needed.

---

## System changes made 2026-05-09

- **Rebuilt `/review-spoke.md` — systemic fix.** Previous version checked only judgment and factual quality. The 7 formatting rules documented in `memory/feedback_spoke_pages.md` were not enforced anywhere. New version embeds all rules directly in the sub-agent instructions: F1 no em-dashes, F2 Q./A. prefix format, F3 no style subheadings under H2s, F4 card description fragment format (3 sentences, subjects only in sentence 3, under 12 words in S1/S2), F5 Syrah leads with spicy/black pepper, F6 image prompt requirements (labeled bottles, varied silhouettes, no people), F7 author participant reminder. Sub-agent now returns two separate sections: FORMATTING VIOLATIONS and JUDGMENT/FACTUAL ISSUES.
- **Fixed CLAUDE.md command file rules.** Added "Command file rules" section documenting the principle: sub-agents can only enforce what is embedded in their prompt, not what is in memory files. When a new rule is established, it must go into the command file first. Corrected cover art row to remove the false claim that the sub-agent reads `memory/feedback_cover_art.md`.
- **Root cause documented and fixed:** Rules were established → saved only to memory files → sub-agents never read them → mistakes repeated. Fix: all command files are now self-contained. The test: if a sub-agent ran with zero memory file access, would it still enforce every rule? If no, the rule is not in the command file.

---

## System changes made 2026-05-09

- **Episode 217 — Frappato:** Google Doc found (`1R8HMN-gf8kfT7Dxqvmm8rXC2f4g6wGkT_1h5vQ243yo`). Title confirmed by Joe: "Italian Wine Adventure #24: Frappato! The Chillable Red Wine!" Wines: 2022 Valle Dell'Acate Il Frappato Vittoria ($22.99) — Joe 8, Carmela 8 | 2024 Gurrieri Frappato ($27.97) — Joe 6, Carmela 6. Both chose Valle Dell'Acate to finish. Cover art: 3 concepts generated (Concept A: fridge confession; Concept B: beach chairs / smug summer energy; Concept C: ice bucket ceremony — SELECTED). SEO/AEO: Key Questions (7), Full Q&A (7 questions, 40-60 words each), Review Schema (Valle Dell'Acate 8/10, Gurrieri 6/10), FAQPage schema, and 10 Bluesky posts all written and saved to `outputs/episodes/ep217-frappato.md`. Ready to publish.
- **Created `/review-titles` slash command** at `.claude/commands/review-titles.md` — mandatory internal QA step before showing Joe any episode title suggestions. Subagent pulls last 20 episode titles from database, identifies named series patterns (Italian Wine Adventure, WTF, Bordeaux Bargains), checks every proposed title against all rules (grape/region required, no format repeat, no spam words, character count, first-30-chars rule, series format consistency), and scores each option (AI Discovery + Clickability). Claude must fix all FAILs before presenting to Joe.
- **Updated CLAUDE.md** — added `/review-titles` requirement to the reference table for episode title generation.
- **Updated `memory/feedback_title_generation.md`** — added mandatory /review-titles rule, named series format reference.
- **Google OAuth re-authorized** — token was expired (invalid_grant). Fixed by deleting google_token.json and re-running setup_google_auth.js.

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
