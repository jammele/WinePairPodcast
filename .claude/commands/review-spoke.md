# /review-spoke

Review a spoke page draft for judgment-level issues that the validator script cannot catch.

## Usage

```
/review-spoke outputs/cabernet-sauvignon-spoke.md
```

Run this AFTER `node scripts/validate_spoke.js` passes with no errors. The validator handles mechanical checks. This review handles judgment checks and factual validation.

## What this review checks

1. **Wine list quality** — Are the 6 alternatives actually the best choices for someone who loves the anchor wine? Or is the list generic, lazy, or missing more obvious picks?
2. **Cross-spoke differentiation** — Do the alternatives clearly serve a different audience/need than the wines in other spokes? (E.g., Cab Sauv spoke should feel like a Bordeaux-family page, not a repeat of the bold-reds-in-general Malbec spoke.)
3. **Circular references** — Does any alternative wine have its own spoke page, making the recommendation circular?
4. **"What's different" accuracy** — Is each wine's distinguishing characteristic described correctly and specifically? Generic phrases like "it's a bit different" or "has its own character" are failures. The subagent must verify the factual accuracy of flavor descriptions and regional claims.
5. **"Try this if" usefulness** — Does each recommendation give the reader a clear, specific reason to choose that wine? Vague guidance like "try this if you want something new" is a failure.
6. **Title subtitle** — Is the subtitle meaningfully distinct from published subtitles (listed in `memory/feedback_spoke_pages.md`)?
7. **FAQ relevance** — Are the FAQ questions ones real people actually search for about this wine, or are they generic filler?
8. **Factual accuracy** — Are the regional origins, genetic relationships, flavor profiles, and winemaking facts accurate? The subagent must use WebSearch to verify any specific claims it is not certain about (e.g., genetic parentage, regional history, production methods).
9. **Wine selection validation** — The subagent must search "wines similar to [anchor wine]" and compare the draft's wine list against what wine publications and experts commonly recommend. Flag any significant omissions or inclusions that contradict expert consensus.

## How to run

When the user types `/review-spoke <filepath>`, do the following:

1. Read the draft file at the given path
2. Read `docs/spoke-page-checklist.md`
3. Read `memory/feedback_spoke_pages.md` for the published subtitle list and any other active rules
4. Spawn a subagent with the instructions below, passing it the draft content

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual draft content:

---

You are a quality reviewer for The Wine Pair Podcast's wine similarity spoke pages. Your only job is to find judgment-level and factual problems in this draft before it goes to the publisher. Be direct and specific. Do not praise the work.

You have access to WebSearch. Use it to:
- Verify any factual claims you are not certain about (regional origins, genetic relationships, production facts, flavor profiles)
- Search "wines similar to [anchor wine]" to compare this draft's wine list against what wine publications and experts commonly recommend
- Check that the listed wines are genuinely recommended as alternatives to the anchor wine, not just loosely related wines

**Existing spoke pages and their wine lists:**
- Pinot Noir spoke: Frappato, Beaujolais, Cinsault, Mencia, Etna Rosso, Red Burgundy
- Malbec spoke: Syrah/Shiraz, Zinfandel, Grenache, Nero d'Avola, Pinotage, Primitivo
- Cabernet Sauvignon spoke: Merlot, Bordeaux Blend, Carménère, Tannat, Rioja, Barolo

**Published subtitles (must not be reused or pattern-matched):**
- "6 Wines to Try If You Love Pinot Noir"
- "6 Bold Reds to Try Next"

**Check the draft for these issues:**

1. Does any wine in the alternatives list also appear in an existing spoke? Flag it with the spoke name.
2. Does any alternative wine have its own spoke page (Pinot Noir, Malbec, Cabernet Sauvignon, Chardonnay, Sauvignon Blanc)? Flag it.
3. Is the wine list genuinely specific to the anchor wine's character, or is it a generic bold-reds/crisp-whites grab-bag that could apply to any similar wine? Search "wines similar to [anchor wine]" and compare.
4. For each wine section: is the "What's different" description accurate and specific, or vague? Use WebSearch to verify any facts you are unsure about.
5. For each wine section: does "Try this if" give the reader a real, actionable reason?
6. Does the subtitle match the format or angle of any published subtitle above?
7. Are the FAQ questions ones with real search volume, or generic filler?
8. Are there any factual errors in regional claims, genetic relationships, flavor profiles, or production methods? Flag each one with the correct information.
9. Based on your search of "wines similar to [anchor wine]": are there significant alternatives that experts commonly recommend which are missing from this list? Are any of the listed wines poor choices that expert sources would not recommend?

Return a numbered list of issues found. If no issues, say "No judgment issues found." Do not summarize the draft or explain what it does well.

**Draft to review:**
[DRAFT CONTENT]

---
