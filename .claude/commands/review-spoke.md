# /review-spoke

Review a spoke page draft for judgment-level issues that the validator script cannot catch.

## Usage

```
/review-spoke outputs/cabernet-sauvignon-spoke.md
```

Run this AFTER `node scripts/validate_spoke.js` passes with no errors. The validator handles mechanical checks. This review handles judgment checks.

## What this review checks

1. **Wine list quality** — Are the 6 alternatives actually the best choices for someone who loves the anchor wine? Or is the list generic, lazy, or missing more obvious picks?
2. **Cross-spoke differentiation** — Do the alternatives clearly serve a different audience/need than the wines in other spokes? (E.g., Cab Sauv spoke should feel like a Bordeaux-family page, not a repeat of the bold-reds-in-general Malbec spoke.)
3. **Circular references** — Does any alternative wine have its own spoke page, making the recommendation circular?
4. **"What's different" accuracy** — Is each wine's distinguishing characteristic described correctly and specifically? Generic phrases like "it's a bit different" or "has its own character" are failures.
5. **"Try this if" usefulness** — Does each recommendation give the reader a clear, specific reason to choose that wine? Vague guidance like "try this if you want something new" is a failure.
6. **Title subtitle** — Is the subtitle meaningfully distinct from published subtitles (listed in `memory/feedback_spoke_pages.md`)?
7. **FAQ relevance** — Are the FAQ questions ones real people actually search for about this wine, or are they generic filler?

## How to run

When the user types `/review-spoke <filepath>`, do the following:

1. Read the draft file at the given path
2. Read `docs/spoke-page-checklist.md`
3. Read `memory/feedback_spoke_pages.md` for the published subtitle list and any other active rules
4. Spawn a subagent with the instructions below, passing it the draft content

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual draft content:

---

You are a quality reviewer for The Wine Pair Podcast's wine similarity spoke pages. Your only job is to find judgment-level problems in this draft before it goes to the publisher. Be direct and specific. Do not praise the work.

**Existing spoke pages and their wine lists:**
- Pinot Noir spoke: Frappato, Beaujolais, Cinsault, Mencia, Etna Rosso, Red Burgundy
- Malbec spoke: Syrah/Shiraz, Zinfandel, Grenache, Nero d'Avola, Pinotage, Primitivo
- Cabernet Sauvignon spoke: Merlot, Bordeaux Blend, Carmenere, Cabernet Franc, Rioja, Barolo

**Published subtitles (must not be reused):**
- "6 Wines to Try If You Love Pinot Noir"
- "6 Bold Reds to Try Next"
- "6 Full-Bodied Reds to Try Next" (add when Cab Sauv goes live)

**Check the draft for these issues:**

1. Does any wine in the alternatives list also appear in an existing spoke? Flag it with the spoke name.
2. Does any alternative wine have its own spoke page (Pinot Noir, Malbec, Cabernet Sauvignon, Chardonnay, Sauvignon Blanc)? Flag it.
3. Is the wine list genuinely specific to the anchor wine's character, or is it a generic bold-reds/crisp-whites grab-bag that could apply to any similar wine?
4. For each wine section: is the "What's different" description accurate and specific, or vague?
5. For each wine section: does "Try this if" give the reader a real, actionable reason?
6. Does the subtitle match the format of any published subtitle above?
7. Are the FAQ questions ones with real search volume, or generic filler?

Return a numbered list of issues found. If no issues, say "No judgment issues found." Do not summarize the draft or explain what it does well.

**Draft to review:**
[DRAFT CONTENT]

---
