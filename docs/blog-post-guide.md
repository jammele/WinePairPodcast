# Blog Post Guide — The Wine Pair Podcast

Single source of truth for writing SEO blog posts. Replaces: faq-format-rules.md, blog-post-conversion-block.md, and the blog post sections of CLAUDE.md and seo-geo-strategy.md.

---

## Who does what

**Claude Code** reads the episode script, writes the full draft, generates Review Schema, and saves the file.
**Joe** edits the draft for voice, publishes in Beamly, and adds the Buzzsprout embed code.
**No handoff to Claude app needed.** Claude Code and Claude are the same model.

---

## Before writing — state these four things first

1. **Format:** A or B (see below)
2. **Target query:** the primary search query this post is designed to rank for
3. **Source:** episode number and URL
4. **Schema:** which wines get a Review Schema block

If any of these are wrong, Joe can stop before writing starts.

---

## Format A — Narrative

Use for: opinion pieces, wine history, episode-adjacent topics.
- Paragraph form only. No headers or bullets in the body.
- 550-750 words.

## Format B — SEO/AEO Structured

Use for: wine reviews, "is X wine good?" queries, informational queries.
- H2 headers per section, bullets for tasting notes and pairings.
- Review Schema required for any post with ratings.
- Follow the section order below exactly.

---

## Format B section order

### 1. Intro (no header)
2-3 short paragraphs. Lead with the verdict — do not bury it. State what wines were tasted and link to the episode.

### 2. Key Questions We Answer
Questions only. No answers. 3-5 max. Purpose: AEO signal to search engines and AI.

Example format:
- Is Bread & Butter wine good?
- What does Bread & Butter Chardonnay taste like?
- Is Bread & Butter wine worth the price?

### 3. What Is [Wine/Brand]?
1-2 paragraphs of background. Keep it short — readers want the review, not a history lesson.

### 4. One H2 section per wine reviewed
Each section must include:
- **Price** | **Alcohol** | **Region** (on one line)
- Tasting notes (bullets: Nose / Palate)
- Pairings (bullets)
- Ratings: Joe X/10, Carmela X/10

### 5. Overall verdict (no header or use "So Is [Wine] Worth Buying?")
1-2 paragraphs. Direct answer. No hedging.

### 6. Episode callout + Buzzsprout embed
One sentence, specific to this episode — tease a moment of disagreement, a surprise, or a strong reaction. Not generic.

Good: "Hear the full tasting — including why Joe gave the Chardonnay a 2 — on Episode 143."
Bad: "Listen to the full episode for more!"

The Buzzsprout embed code goes here. Joe adds it in Beamly (log into Buzzsprout → episode → share → embed → copy HTML → paste into a code block in Beamly).

### 7. Full Q&A
Title: **Frequently Asked Questions**
4-5 pairs. Format exactly like this:

**Is Bread & Butter wine good?**
It depends on what you are looking for. We found all three wines to taste stale and artificial compared to other options at the same price. The Sauvignon Blanc was the best of the three; the Chardonnay was the worst.

Rules:
- Front-load the answer. Never start with "It depends" without immediately following with the actual answer.
- 2-4 sentences per answer.
- Conversational, slightly irreverent, plainspoken. Sounds like Joe talking, not a wine guide.
- No em dashes. No generic wine language ("earthy undertones," "bright acidity," "silky tannins").
- Questions should match real search queries.

### 8. Review Schema
One script block per wine. Goes in Beamly per-page code injection (SEO/head section). See template below.

---

## Review Schema template

One block per wine. Never average scores across multiple wines into one block.
Rating = average of Joe's and Carmela's scores for that wine only (round to nearest whole number).

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "[WINE NAME AND VINTAGE]",
    "offers": {"@type": "Offer", "price": "[PRICE e.g. 13.99]", "priceCurrency": "USD"}
  },
  "reviewRating": {"@type": "Rating", "ratingValue": "[AVERAGE SCORE]", "bestRating": "10", "worstRating": "1"},
  "author": [{"@type": "Person", "name": "Joe"}, {"@type": "Person", "name": "Carmela"}],
  "publisher": {"@type": "Organization", "name": "The Wine Pair Podcast"},
  "reviewBody": "[2-3 sentence summary of tasting notes and verdict]"
}
</script>
```

Validate at https://search.google.com/test/rich-results after publishing.

---

## Voice rules (apply to all content)

- Accessible, witty, conversational, slightly irreverent
- Anti-snob — explain jargon, do not assume knowledge
- No em dashes
- No corny phrasing, no smugness
- No generic AI-sounding filler
- Write contractions (it's, we're, you'll)
- Use "we" — this is Joe and Carmela's show together

---

## Post-publish checklist (every post)

1. Add Review Schema via Beamly per-page code injection
2. Set page title and meta description in Beamly
3. Set URL slug (short, keyword-first)
4. Add Buzzsprout embed for the relevant episode
5. Submit URL in GSC → URL Inspection → Request Indexing
6. Resubmit sitemap: GSC → Indexing → Sitemaps → Resubmit
7. Check back in 3-5 days to confirm "URL is on Google"

Full details in `docs/publishing-checklist.md`.
