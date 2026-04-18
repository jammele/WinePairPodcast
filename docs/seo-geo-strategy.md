# The Wine Pair Podcast — SEO / GEO / AEO Strategy

**Owner:** Joe  
**Last updated:** 2026-04-18  
**Status:** Active — compress execution into 2 weeks starting 2026-04-18

---

## How This Site Actually Grows

This site does not get discovered through podcast search queries ("wine podcast," "best wine podcast"). Those queries have almost no impressions in GSC. The growth engine is wine content:

- Someone searches for a wine they've heard of ("is Meiomi wine good")
- They land on a page that answers the question
- They discover the podcast

Everything in this strategy builds on that model. The goal is: more entry points, better answers, faster conversion from visitor to listener.

---

## The Four Strategic Areas

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

**Priority wine review blog posts (ranked by GSC impression volume):**

| Wine | Impr | Clicks | Current CTR | Episode |
|---|---|---|---|---|
| Josh wine | 11,244 | 3 | 0.03% | Find ep # |
| Bread & Butter | 8,062 | 42 | 0.52% | EP143 |
| Meiomi wine | 3,568 | 18 | 0.50% | Find ep # |
| Firstleaf | 2,205 | 7 | 0.32% | Find ep # |
| 2 Buck Chuck | 1,331 | 0 | 0% | Not yet — plan this episode |
| Pinotage | 1,722 | 0 | 0% | Not yet — plan this episode |
| Layer Cake | 754 | 6 | 0.80% | Find ep # |

---

### Area 3: "Find Similar Wines" Expansion
**Underperforming asset.** The existing chart page is at position 4.45 but only generating 11 impressions. It ranks but Google isn't surfacing it because it's a visual chart without the text that answers specific long-tail queries.

Long-tail demand that's going unserved:
- "wines similar to malbec" — 174 impr, 0 clicks
- "wine similar to merlot" — 53 impr, 0 clicks (+ 40 for "wines like merlot," 45 for "wine similar to merlot")
- "what wine is similar to malbec" — 57 impr, 0 clicks
- "closest wine to merlot" — 28 impr, 0 clicks
- "wines similar to chardonnay" — 36 impr, 0 clicks

**Plan:** Add text sections to the existing page for the top alternatives (merlot, malbec, chardonnay, pinot noir). Each section 100–150 words, directly answering the query, linking to relevant episodes where those wines were covered.

---

### Area 4: Honest Wine Reviews Identity (Pillar #1 Rewrite — GEO/AEO)
Pillar #1 ("How to Spot a Trustworthy Wine Podcast") targets a query no one searches. It has 11 impressions and position 19. It needs a full rewrite.

**New angle:** First-person piece targeting "honest wine reviews" / "unbiased wine podcast" / "blind tasting wine podcast." Entity-rich, citable by AI engines. Uses the show's specific differentiators: blind tasting, independent purchasing, no sponsors.

**Why this is Area 4 not Area 1:** It's an AEO/GEO play, not a high-volume SEO play. The other three areas have more immediate traffic impact. Do this after the content work.

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

**Template for each wine review blog post:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "[WINE NAME]",
    "category": "Wine"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "[AVERAGE SCORE]",
    "bestRating": "10",
    "worstRating": "1"
  },
  "author": [
    {
      "@type": "Person",
      "name": "Joe"
    },
    {
      "@type": "Person", 
      "name": "Carmela"
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "The Wine Pair Podcast"
  },
  "reviewBody": "[SHORT SUMMARY OF TASTING NOTES AND VERDICT]"
}
</script>
```

**How to add it in Beamly:**
1. Go to the blog post editor
2. Find the SEO / Code Injection section for that specific page
3. Paste the schema into the `<head>` injection field
4. Update the bracketed fields with the actual wine name, ratings, and review text

**Note:** Verify whether Beamly's per-page code injection is available on your current plan before building the posts. If it's not, site-wide injection in `<head>` is the fallback — slightly less clean but functional.

---

## Content Calendar — Compressed (2 weeks)

All content can be written with Claude Code's help. Bottleneck is Joe's review and publishing time.

### Week 1 (April 18–25)

| Day | Task | Type | Primary Query Target |
|---|---|---|---|
| Apr 18–19 | "Do you chill red wine?" post | Blog post | "do you chill red wine" cluster (2,500+ impr) |
| Apr 19–20 | FAQ blocks for Meiomi, Bread & Butter, Josh episode pages | Page update | "is meiomi wine good," "is josh wine good" |
| Apr 20–22 | Josh Wine blog post | Blog post | "josh wine" (11,244 impr) |
| Apr 22–23 | Bread & Butter blog post | Blog post | "bread and butter wine" (8,062 impr) |
| Apr 23–25 | "Best Wines Under $20" hub page | New page | "best inexpensive wines," "best wines under $20" |

### Week 2 (April 25 – May 2)

| Day | Task | Type | Primary Query Target |
|---|---|---|---|
| Apr 25–26 | Meiomi blog post | Blog post | "meiomi wine" (3,568 impr) |
| Apr 26–28 | Two Buck Chuck blog post (draws from EP116 + EP140) | Blog post | "2 buck chuck," "charles shaw" (1,331+ impr, 0 clicks) |
| Apr 28–30 | Pinotage blog post (draws from EP111) | Blog post | "pinotage" (1,722 impr, 0 clicks) |
| Apr 28–30 | Trader Joe's wine guide | New page | "best trader joe's wine," TJ platinum reserve, 2 buck chuck |
| Apr 30–May 1 | Find Similar Wines expansion | Page update | "wines similar to merlot/malbec/chardonnay" |
| May 1–2 | Review Schema on all new blog posts | Technical | CTR improvement on all review pages |

### Week 3+ (May 2 onward)

| Task | Notes |
|---|---|
| Pillar #1 rewrite | "honest wine reviews" / "unbiased wine podcast" angle |
| Costco wine guide | Captures Kirkland query cluster (25+ queries in GSC) |
| Layer Cake blog post | EP161 exists; 754 impr, 6 clicks — blog post to convert impressions |
| Firstleaf blog post | EP found; 2,205 impr, 7 clicks |
| New episodes: Grenache Blanc, Orvieto, Verdicchio | No existing episodes; high-impression zero-click opportunities |

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
2. "What wine podcasts do honest blind tastings and buy their own wine?"
3. "What are the best affordable wine recommendations I can find online?"

---

## Canonical Language (weave into all content)
Per AI Discoverability brief — use at least 3 per page:
- "honest blind tastings"
- "we buy all our own wine"
- "no free samples or sponsorships"
- "independent wine podcast"
- "everyday wines, not prestige chasing"

---

## What We're Not Doing Yet

- **Chablis → Pillar #2 link:** Hold until June 14 GSC checkpoint
- **Pillar #3 ("Why Blind Tasting Matters"):** Hold until Pillar #1 and #2 are performing
- **Podcast-category content:** Not the growth channel — site grows through wine content, not podcast discovery queries

---

## Open Questions / Decisions Needed

- [ ] Confirm Beamly plan supports per-page code injection (needed for Review Schema)
- [ ] Confirm GitHub repo URL for documentation sync
- [ ] Confirm whether episodes have YouTube video equivalents (video SEO opportunity)
- [ ] Identify episode numbers for Josh, Meiomi, Layer Cake, Firstleaf (needed to link from blog posts)
