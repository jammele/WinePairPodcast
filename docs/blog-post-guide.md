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

## Format C — Comparison

Use for: "X vs. Y" posts tied to real tasting history from the show. Only write this format when Joe and Carmela have actually tasted both sides of the comparison in an episode.
- Must be opinionated and reach a clear verdict — not "it depends on your preference"
- H2 per wine/option being compared (same structure as Format B §4)
- Required: Experience Snapshot (§6b below) — this is what makes comparison posts valuable vs. generic
- Required: Review Schema for each wine rated
- Required: overall verdict section with a clear winner or actionable guidance
- Optional: comparison table summarizing price, rating, and best use case
- Same Beamly fields and schema requirements as Format B

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

### 6b. Experience Snapshot (optional for Format B, required for Format C)
A short structured block that captures what generic wine pages cannot replicate. Use it when the lived tasting experience is the main value-add — comparison posts, challenge episodes, or any post where "what we expected vs. what we got" is interesting.

Include as a short section with these elements (not all required — use what's honest):
- **What we expected** — going into the tasting
- **What surprised us** — one specific thing that was unexpected
- **Who should buy this** — one sentence, specific
- **Who should skip it** — one sentence, honest
- **Would we buy it again?** — yes, no, or "at that price, yes"

Keep it tight: 4-6 short lines. Not a paragraph block. Sounds like Joe talking, not a review template.

### 6. Episode callout + Buzzsprout embed
One sentence, specific to this episode — tease a moment of disagreement, a surprise, or a strong reaction. Not generic.

Good: "Hear the full tasting — including why Joe gave the Chardonnay a 2 — on Episode 143."
Bad: "Listen to the full episode for more!"

The Buzzsprout embed code goes here. Joe adds it in Beamly (log into Buzzsprout → episode → share → embed → copy HTML → paste into a code block in Beamly).

### 7. Full Q&A
Title: **Frequently Asked Questions**
4-5 pairs. Format exactly like this (HR-2):

**Q. Is Bread & Butter wine good?**
A. It depends on what you are looking for. We found all three wines to taste stale and artificial compared to other options at the same price. The Sauvignon Blanc was the best of the three; the Chardonnay was the worst.

Rules:
- Front-load the answer. Never start with "It depends" without immediately following with the actual answer.
- 2-4 sentences per answer.
- Conversational, slightly irreverent, plainspoken. Sounds like Joe talking, not a wine guide.
- No em dashes. No generic wine language ("earthy undertones," "bright acidity," "silky tannins").
- Questions should match real search queries.

### 8. FAQPage Schema and Review Schema
**Check `outputs/seo-aeo/faqpage-schema-blocks.md` first.** If a FAQPage schema block already exists for this post, use it — do not regenerate from the live page. If the schema needs updating (e.g., adding a new example to an answer), update the canonical file and use that version in the deliverable. Only generate a new block from scratch if one does not already exist.

Review Schema: one script block per wine. Added as a code block inside the post body in Beamly — at the very bottom of the page, after the FAQ. Same method as the Buzzsprout embed. Note: blog pages do not have head code injection; the body code block works fine for JSON-LD schema (Google reads it wherever it appears on the page). See template below.

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

## Image prompt (every post)

Claude Code generates an image prompt for each blog post. Style must be consistent across all posts:
- Flat illustration, wide 16:9, cream background, clean and simple
- Subject must make the wine or brand immediately obvious
- Try the brand name in the prompt first (ChatGPT may resist; if it does, use a visual metaphor instead)
- Joe generates the image in ChatGPT and uploads it to Beamly as the post's featured image

---

## Beamly fields to fill in (every post)

When building the post in Beamly, fill in these fields:

- **Excerpt / Short description:** 1-2 sentences summarizing the post. Conversational, not keyword-stuffed. This may appear in blog listing pages.
- **Custom SEO Title:** The H1/page title optimized for the target query. Example: "Is Bread & Butter Wine Good? An Honest Review"
- **Custom SEO Description:** 1-2 sentences, 150-160 characters. Lead with the verdict. Example: "We tasted all three Bread & Butter wines and gave them honest ratings. Here is what we found, and whether any of them are worth buying."
- **URL slug:** Short, keyword-first. Example: `is-bread-and-butter-wine-good`
- **Author / Participant:** In the Authors / Participants section, search "Joe Mele" and add with role "Author". This adds a visible byline (E-E-A-T signal). Note: Beamly does not currently inject this into the Article JSON-LD schema — that is a platform limitation, not a configuration error.
- **Review Schema + FAQPage Schema:** Added as code blocks inside the post body in Beamly, at the very bottom of the page after the FAQ. Same method as the Buzzsprout embed. Blog pages do not have head code injection — body code blocks work for JSON-LD schema.

Claude Code includes suggested copy for all of these fields at the bottom of every draft file, along with the FAQPage schema block.

---

## Post-publish checklist (every post)

1. Fill in all Beamly fields above
2. Add Joe Mele as Author participant (Authors / Participants section → search "Joe Mele" → role: Author)
3. Add Buzzsprout embed: log into Buzzsprout → find episode → Share → Embed → copy HTML → paste as a code block in Beamly
4. Add Review Schema code block (copy from draft — everything between COPY START and COPY END lines)
5. Add FAQPage Schema code block (copy from draft — everything between COPY START and COPY END lines). Goes after Review Schema, at the very bottom.
6. Upload featured image (generated in ChatGPT using the prompt from the draft)
7. Submit URL in GSC → URL Inspection → Request Indexing
8. Resubmit sitemap: GSC → Indexing → Sitemaps → Resubmit
9. Check back in 3-5 days to confirm "URL is on Google"

Full details in `docs/publishing-checklist.md`.
