# The Wine Pair Podcast — SEO / GEO / AEO Strategy

**Owner:** Joe  
**Last updated:** 2026-07-04  
**Status:** Active — see `docs/work-log.md` for current priorities and candidate pool. This doc is strategy reference; the work log is the live task list.

---

## May 2026 Search Landscape Update

Three overlapping changes are reshaping how Google works right now.

**1. AI Mode is the new default.** Google announced at I/O (May 19, 2026) the biggest upgrade to Search in 25+ years. Gemini 3.5 Flash is now the default model in AI Mode globally. The Search box is redesigned for longer, conversational, multimodal queries — text, images, files, videos, tabs. AI Mode queries average triple the length of traditional queries. Searches around planning, comparison, and recommendations are growing fastest.

**2. AEO = SEO + first-hand experience.** Google's official AI optimization guide (last updated 2026-06-29) confirms: generative AI Search is still rooted in core Search ranking and quality systems. There is no special AI markup, no llms.txt, no markdown versions, no chunked content needed. Don't overfocus on structured data. The differentiator is first-hand experience — specific tasting notes, verdicts, and real purchasing decisions that generic summaries cannot replicate.

**3. May 2026 core update is rolling.** Started May 21; may take two weeks. Do not make panic changes or draw conclusions from GSC during the rollout. Wait until the update finishes, then compare appropriate date ranges. Our direction is correct — tighten it, do not pivot.

**4. FAQPage rich results ended May 7, 2026.** Google stopped producing FAQPage rich results on May 7, 2026 (deprecated in changelog; documentation removed June 12, 2026). Do not add FAQPage schema to new posts. Existing posts retain their schema blocks — do not remove proactively. The visible FAQ section (Q&A content) remains valuable for readers and AI systems; only the JSON-LD FAQPage markup is discontinued. See HR-64 in `docs/house-rules.md`.

**5. GSC Generative AI performance reports.** Announced June 3, 2026 for a subset of properties. Check GSC for a "Search appearance" or "AI features" section to see if the property has access. If available, the report covers impressions, pages, countries, devices, and dates — it does NOT include clicks or CTR. This is a visibility signal, not a performance signal.

**What this means for us:** The win is shifting from "rank as a blue link" to "be credible enough to be cited in an AI answer." AI Overviews reduce informational CTR (Pew: 8% vs. 15%; Ahrefs: 58% CTR reduction at position 1). But for distinctive, experience-rich content, click quality may improve. Our content strategy — first-hand reviews, transparent methodology, honest ratings, specific verdicts — is exactly what Google's guidance validates. The adjustment is how we structure it.

---

## How This Site Actually Grows

This site does not get discovered through podcast search queries ("wine podcast," "best wine podcast"). Those queries have almost no impressions in GSC. The growth engine is wine content:

- Someone searches for a wine they've heard of ("is Meiomi wine good")
- They land on a page that answers the question
- They discover the podcast

Everything in this strategy builds on that model. The goal is: more entry points, better answers, faster conversion from visitor to listener.

---

## The Strategic Areas

### Area 1: Affordable Wine Authority
**The biggest gap.** The show's entire premise is great wine without overspending. "Best inexpensive wines" = 142k+ searches. GSC shows the site appearing for related queries with almost no click-through:

- "best red wines under 20 dollars" — 202 impr, 0 clicks, pos 2.7
- "cheap wine under $5" — 188 impr, 0 clicks
- "best wine at Trader Joe's" — 44 impr, 0 clicks, pos 1
- "qpr wine" — 148 impr, 0 clicks
- "best chardonnay" — 71 impr, 0 clicks

**Plan:** Create a "Best Wines Under $20" hub page. Sections organized by type (red, white, sparkling, rosé). Each wine links to its episode review. This page becomes the show's flagship affordable wine resource and an internal linking hub.

**Supporting pages (build after hub):**
- "Best Trader Joe's Wines: What We've Tasted and What's Worth Buying"
- "Best Costco Wines: Kirkland and Beyond" (25+ Kirkland queries in GSC)

---

### Area 2: Wine Review Blog Posts (CRITICAL — addresses content-type mismatch)
**The core insight:** Episode pages look like podcast listings. When someone searches "is Josh wine good," they want a quick answer — a rating, tasting notes, a verdict. The episode page doesn't serve that intent visually, which is why Josh wine has 11,244 impressions and 3 clicks.

Blog posts fix this. Each post for a high-traffic wine review:
- Leads with the verdict and ratings
- Includes key tasting notes in plain language
- Has a structured FAQ block at the bottom (for AEO — AI engines crawl the full page; bottom placement avoids looking machine-generated to human visitors)
- Links to the episode for the full tasting
- Gets Review Schema markup (see Technical section below)

**Priority wine review blog posts — updated from GSC page data (as of 2026-05-01):**

Rule: only write blog posts where page impressions >5,000 AND CTR <0.5%. Pages already converting at CTR >1% do not need a blog post.

| Wine | Page Impr | Page Clicks | CTR | Status |
|---|---|---|---|---|
| Chill Red Wine (minisode) | 27,508 | 16 | 0.06% | **PUBLISHED** 2026-04-29 |
| Josh wine | 21,929 | 54 | 0.25% | **PUBLISHED** 2026-04-29 |
| Meiomi | 20,494 | 241 | 1.18% | **SKIP** — already converts well |
| Bread & Butter | 16,814 | 90 | 0.54% | **PUBLISHED** 2026-04-30 |
| Portuguese wine | 20,154 | 19 | 0.09% | **NEXT** — biggest untapped gap |
| Pinotage | 6,011 | 21 | 0.35% | In queue |
| Two Buck Chuck | 5,055 | 13 | 0.26% | In queue (EP116 + EP140) |

---

### Area 3: "Find Similar Wines" Expansion
**Underperforming asset.** The existing chart page is at position 4.45 but only generating 11 impressions. It ranks but Google isn't surfacing it because it's a visual chart without the text that answers specific long-tail queries.

Long-tail demand that's going unserved:
- "wines similar to malbec" — 174 impr, 0 clicks
- "wine similar to merlot" — 53 impr, 0 clicks (+ 40 for "wines like merlot," 45 for "wine similar to merlot")
- "what wine is similar to malbec" — 57 impr, 0 clicks
- "closest wine to merlot" — 28 impr, 0 clicks
- "wines similar to chardonnay" — 36 impr, 0 clicks

**Plan (evolved):** Create separate spoke pages for each anchor wine — each a full blog post targeting "wines similar to X" long-tail queries. Spoke pages link to a new central hub at `/similar-wines` ("If You Like This Wine, Try That"). Wine card data is sourced from `data/wine_similarity_data.json` (shared with the Winedr app).

The existing chart post is kept as a visual companion, not replaced. Internal link strategy: spoke pages link to hub; chart post links to hub ("For full recommendations, see our complete guide"); hub references chart as a visual companion. This concentrates link equity in the hub while preserving the chart's visual-reference niche.

See `docs/work-log.md` for current spoke status.

---

### Area 4: Entity & Trust Authority (expanded from Pillar #1 Rewrite)
Pillar #1 ("How to Spot a Trustworthy Wine Podcast") targets a query no one searches. It has 11 impressions and position 19. It needs a full rewrite — and it's now the anchor of a broader trust cluster.

**New angle for Pillar #1:** First-person piece targeting "honest wine reviews" / "unbiased wine podcast" / "independent wine podcast." Entity-rich, citable by AI engines. Uses the show's specific differentiators: independent purchasing, no sponsors, honest ratings good or bad. Must pass HR-42 — every entity signal present and natural.

**Trust cluster roadmap (build after Pillar #1 rewrite):**
- "What Makes a Wine Review Trustworthy?" — Pillar #1 rewrite anchor
- "How We Choose, Taste, and Rate Wine" — consolidated methodology page: explains the 10-point scale, the purchase-and-tasting process (wines new to us, never blind, per HR-38), and sponsorship independence. Replaces the separate "How We Rate Wines on The Wine Pair Podcast" and "Why We Buy Our Own Wines for Review Episodes" pages from the earlier roadmap — one page, not two, per HR-41. Once published, link from the homepage, About page, media kit, and footer (2026-06-14 positioning review, see `outputs/positioning-rollout.md`).
- "Best Affordable Wines We've Rated as Buys" — evidence page linking to episode reviews
- "Wine Ratings for Normal People: What Our 10-Point Scale Means" — beginner entry point

Each page in this cluster has a distinct purpose a real reader would find useful. No thin variations (HR-41). Every page must pass HR-42.

**Why this matters for AI Search:** Query fan-out means a search for "trustworthy wine podcast" may trigger subtopic searches for "do wine podcast hosts buy their own wine," "wine podcast honest ratings," "independent wine reviews." These cluster pages cover those subtopics with distinct, useful content.

**Priority:** AEO/GEO play, not high-volume SEO. Do after spoke content and comparison content.

---

### Area 5: Comparison Content
AI Mode is built for complex comparisons — Google says comparison queries are among the fastest-growing in AI Mode. Comparison pages are now more valuable than they were in classic SEO.

**What qualifies:** Opinionated "X vs. Y" posts backed by real tasting history from the show. Not generic summaries anyone could write. The differentiator is that Joe and Carmela actually bought and tasted these wines and have a verdict.

**High-priority comparison topics:**
- Cheap Pinot Noir vs. Expensive Pinot Noir: Is the Upgrade Worth It?
- Boxed Wine vs. Bottled Wine: What We Learned After Actually Tasting Them
- Cava vs. Prosecco: Which One Should You Bring to a Party?
- Josh vs. Decoy vs. Trader Joe's: What Popular Wine Brands Actually Taste Like
- Rioja vs. Ribera del Duero for Beginners

**Format:** Use Format C (see `docs/blog-post-guide.md`). Each comparison must include an Experience Snapshot, be tied to real episode tasting data, and reach a clear verdict. Not "it depends on your preference" — an actual opinion.

**Priority:** Start with one comparison post tied to an upcoming or recent episode. Pick a topic with clear search demand.

---

## Quick Wins — Do These First

### "Do You Chill Red Wine" Post
2,500+ combined impressions across all query variations ("do you chill red wine," "should red wine be chilled," "can you chill red wine," etc.) at positions 5–7 with zero clicks. This is a purely informational query. A 300-word post with a clear answer, the 20-minute rule, and a link to a relevant episode could rank page 1 within 2–3 weeks.

**Why first:** Fastest to write, clearest demand signal, no competition from existing pages.

---

## Episode Content Pipeline — Data-Driven

Before scheduling any episode, cross-reference with GSC high-impression zero-click topics. These are the topics where the site is already showing up in search but has no episode to send people to:

| Topic | GSC Impressions | Status | Action Needed |
|---|---|---|---|
| **2 Buck Chuck / Charles Shaw** | 1,331+ | EP116 + EP140 already exist | Blog post (not a new episode) |
| **Pinotage** | 1,722 | EP111 already exists | Blog post (not a new episode) |
| **Grenache Blanc** | 817 | No episode found | New episode candidate |
| **Orvieto** | 734 | No episode found | New episode candidate |
| **Verdicchio** | 711 | No episode found | New episode candidate |
| **Txakoli** | 740 | EP120 exists | Blog post candidate |

**Key finding (2026-04-18):** Two Buck Chuck and Pinotage already have episodes. Priority action is writing blog posts for them, not recording new content. EP116 "Wallet Friendly Wine Reviews: Two Buck Chuck and More" and EP140 "Two Buck Chuck Sauvignon Blanc Challenge" give strong material for a combined blog post targeting the full 2 Buck Chuck query cluster.

---

## Pillar #2 Status (How to Choose a Wine Podcast)

**Current state (as of 2026-04-18):**
- 412 impressions, position 5.49, 2 clicks (up from 114 impr / pos 8.5 a few weeks ago — good progress)
- Top queries STILL showing wrong intent: "how to wine tasting for podcasters" (195 impr), "wine tasting tips for podcasters" (125 impr)
- Fix applied 2026-04-18: Added "Why We Built The Wine Pair Podcast This Way" section with show-specific first-person copy
- Next check: 2026-06-14 GSC checkpoint

**Chablis → Pillar #2 link:** Hold until June 14 checkpoint confirms intent has shifted.

---

## Technical Implementation: Review Schema on Beamly

Beamly confirms code injection support — custom code can be added to the `<head>` of specific pages.

**What to add:** Review schema markup on every wine review blog post. This tells Google the page contains a review with ratings, enabling rich snippets (star ratings, scores) to appear directly in search results — dramatically improving CTR.

**Template for each wine reviewed (one script block per wine):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "[WINE NAME AND VINTAGE]",
    "offers": {"@type": "Offer", "price": "[PRICE e.g. 14.99]", "priceCurrency": "USD"}
  },
  "reviewRating": {"@type": "Rating", "ratingValue": "[AVERAGE SCORE]", "bestRating": "10", "worstRating": "1"},
  "author": [{"@type": "Person", "name": "Joe"}, {"@type": "Person", "name": "Carmela"}],
  "publisher": {"@type": "Organization", "name": "The Wine Pair Podcast"},
  "reviewBody": "[SHORT SUMMARY OF TASTING NOTES AND VERDICT]"
}
</script>
```

**Notes:**
- One script block per wine — do not combine into a single @graph block (causes validation errors)
- Price is required — use the price paid at time of tasting
- ratingValue = average of Joe's and Carmela's scores for that wine only
- Add via Beamly embed/code block at the bottom of the page (after FAQ)
- Validate at https://search.google.com/test/rich-results after adding

**How to add it in Beamly:**
1. Go to the blog post editor
2. Find the SEO / Code Injection section for that specific page
3. Paste the schema into the `<head>` injection field
4. Update the bracketed fields with the actual wine name, ratings, and review text

**Note:** Verify whether Beamly's per-page code injection is available on your current plan before building the posts. If it's not, site-wide injection in `<head>` is the fallback — slightly less clean but functional.

---

## Content Queue

**See `docs/work-log.md` for the current prioritized queue.** Do not use this document as the task list — it will go stale. This document is strategy reference only.

**Completed (as of 2026-05-01):**
- "Should You Chill Red Wine?" — published 2026-04-29
- "Is Josh Wine Good?" — published 2026-04-29
- Bread & Butter wine review — published 2026-04-30
- Pinot Noir Wine Similarity spoke — published, indexing requested 2026-04-29

**Future candidates (after current queue):**
- Pillar #1 rewrite ("honest wine reviews" / "unbiased wine podcast" angle)
- Costco wine guide (25+ Kirkland queries in GSC)
- Layer Cake blog post (EP161 exists; 4,327 impr, 46 clicks)
- Firstleaf blog post (2,205 impr, 7 clicks)
- New episodes: Grenache Blanc, Orvieto, Verdicchio (no existing episodes; high-impression zero-click opportunities)

---

## GSC Checkpoint Log

| Date | Pillar #2 Impr | Pillar #2 Pos | Pillar #2 Intent | Pillar #1 Impr | Pillar #1 Pos | Notes |
|---|---|---|---|---|---|---|
| ~2026-03-28 | 114 | 8.5 | Wrong (podcasters) | — | — | Per ChatGPT session doc |
| 2026-04-18 | 412 | 5.49 | Still wrong (podcasters) | 11 | 19.09 | Added show-specific section to Pillar #2 |
| 2026-06-14 | — | — | — | — | — | Next scheduled check |

---

## AI Discoverability Tests (Baseline: April 2026)

Run these prompts in ChatGPT, Gemini, and Claude. Record whether WPP is mentioned and exact language used. Re-run at June 14 checkpoint.

**Prompts:**
1. "What's a good wine podcast for someone who doesn't know much about wine and wants honest opinions?"
2. "What wine podcasts buy their own wine and give honest reviews?"
3. "What are the best affordable wine recommendations I can find online?"

---

## Canonical Language (weave into all content)
Google's May 2026 guidance validates this approach — first-hand, experience-based language that only we can say is exactly what AI Search cites. Use at least 3 per blog post or spoke page (HR-36):
- "really honest ratings and reviews"
- "we buy all our own wine"
- "no free samples or sponsorships"
- "independent wine podcast"
- "everyday wines, not prestige chasing"

For episode pages and pillar pages, also reinforce the entity signals required by HR-42: hosts' names, husband-and-wife format, Top 100 Food Podcast credential, and the independent purchasing model.

---

## What We're Not Doing

- **Chablis → Pillar #2 link:** Hold until June 14 GSC checkpoint
- **Pillar #3:** Dropped — the original "Why Blind Tasting Matters" angle is factually wrong (Joe and Carmela do not blind taste; see HR-38). No replacement planned.
- **Podcast-category content:** Not the growth channel — site grows through wine content, not podcast discovery queries
- **llms.txt or special AI markup:** Google explicitly says this is not needed and not the path. Do not spend time on it.
- **Thin AEO variation pages:** No "best wine podcast for beginners," "best wine podcast for couples," etc. as separate pages unless each has a genuine, distinct purpose. See HR-41.
- **Rewriting content in stiff answer-engine language:** Do not sacrifice voice for AEO formatting. The distinctive voice is part of the trust signal.
- **GSC analysis during the May 2026 core update rollout:** Wait until the update finishes (estimated ~June 4, 2026), then compare appropriate date ranges.

---

## Open Questions / Decisions Needed

- [ ] Confirm Beamly plan supports per-page code injection (needed for Review Schema)
- [ ] Confirm GitHub repo URL for documentation sync
- [ ] Confirm whether episodes have YouTube video equivalents (video SEO opportunity)
- [ ] Identify episode numbers for Josh, Meiomi, Layer Cake, Firstleaf (needed to link from blog posts)
