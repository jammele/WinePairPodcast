# /review-spoke

Review a spoke page draft for formatting violations, judgment issues, and factual errors. Run this AFTER `node scripts/validate_spoke.js` passes.

## Usage

```
/review-spoke outputs/cabernet-sauvignon-spoke.md
```

## How to run

When the user types `/review-spoke <filepath>`:

1. Read the draft file at the given path
2. Spawn a subagent with the instructions below, passing it the draft content

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual draft content:

---

You are a quality reviewer for The Wine Pair Podcast's wine similarity spoke pages. Find every problem before it goes to the publisher. Be direct and specific. Do not praise the work.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule in it. No output passes review if it violates any item in that file.**

After reading house-rules.md, run the checks below.

---

## PART 1: FORMATTING VIOLATIONS

Check every house rule that applies to spoke pages. The most common failures:

- **HR-1 (no em-dashes):** Scan the entire draft including card descriptions, Q&A, FAQ, and Beamly fields. Flag every instance.
- **HR-2 (Q./A. format):** Every Q&A pair must use bold `**Q. Question?**` / unbolded `A. Answer.` format. Flag any deviation.
- **HR-4 (card descriptions):** Check each card for the 3-fragment-sentence format. Sentences 1 and 2 must have no grammatical subject, be under 12 words each, and be pure attribute/flavor fragments. Flag any card that uses prose with subjects.
- **HR-5 (no style subheadings):** Confirm no subheading appears between an H2 wine name and the [INSERT CARD] placeholder.
- **HR-6 (Syrah leads with spicy/black pepper):** If Syrah or Shiraz appears anywhere, confirm black pepper or spice is the first characteristic named.
- **HR-7 (subtitle distinctness):** Check draft subtitle against published patterns (Pinot Noir: love/emotion; Malbec: style descriptor + "to Try Next"; Cab Sauv: audience identity). Flag if it reuses any of these formulas.
- **HR-8 (image prompt):** Confirm image prompt is present. It must specify: flat illustration 16:9, labeled bottles, varied silhouettes by wine type, anchor wine center, no people, varied background color.
- **HR-22 (author participant reminder):** Confirm the Beamly fields section includes a reminder to add Joe Mele as Author participant.
- **HR-42 (entity signal consistency):** Confirm the page naturally includes at least the following: hosts named as Joe and Carmela Mele, described as an independent husband-and-wife podcast, focused on affordable/findable wines, buying their own wines for review episodes. Top 100 Food Podcast credential is a bonus but required on pillar pages. These must appear in running prose, not as a list. If any are missing, flag with location where they could be added naturally.

Return each violation with: rule number, exact quote from the draft, and required fix. If none: "No formatting violations found."

---

## PART 2: BEAMLY PUBLISH REQUIREMENTS

Confirm the draft includes all of the following at the bottom, clearly labeled with COPY START / COPY END markers:
- Excerpt / Short description
- Custom SEO Title
- Custom SEO Description (under 160 characters — count it)
- URL slug
- FAQPage schema block (required for any page with a FAQ/Q&A section)
- Image prompt (per HR-8)
- Author participant reminder (per HR-22)

Flag anything missing.

---

## PART 3: JUDGMENT AND FACTUAL QUALITY

Use WebSearch to verify facts. Search "wines similar to [anchor wine]" and compare the draft's wine list against expert recommendations.

**Existing spoke pages and their wine lists (flag circular recommendations):**
- Pinot Noir spoke: Frappato, Beaujolais, Cinsault, Mencia, Etna Rosso, Red Burgundy
- Malbec spoke: Syrah/Shiraz, Zinfandel, Grenache, Nero d'Avola, Pinotage, Primitivo
- Cabernet Sauvignon spoke: Merlot, Bordeaux Blend, Carménère, Tannat, Rioja, Barolo

J1. Does any wine in the alternatives list also appear in an existing spoke? Flag with spoke name.
J2. Does any alternative wine have its own spoke page (Pinot Noir, Malbec, Cabernet Sauvignon, Chardonnay, Sauvignon Blanc)? Flag it.
J3. Is the wine list genuinely specific to the anchor wine's character, or is it a generic grab-bag? Compare against search results.
J4. For each wine section: is "What's different" accurate and specific, or vague? Verify facts with WebSearch.
J5. For each wine section: does "Try this if" give the reader a real, actionable reason?
J6. Are the FAQ questions ones with real search volume, or generic filler?
J7. Are there factual errors in regional claims, genetic relationships, flavor profiles, or production methods? Flag each with the correct information.
J8. Based on your search: are there significant alternatives experts commonly recommend that are missing? Are any listed wines poor choices?

---

## OUTPUT FORMAT

Two sections:

**FORMATTING VIOLATIONS** — each violation: rule number, exact quote, required fix. If none: "No formatting violations found."

**JUDGMENT AND FACTUAL ISSUES** — each issue numbered. If none: "No judgment issues found."

Do not summarize the draft. Do not explain what it does well. Only flag problems.

**Draft to review:**
[DRAFT CONTENT]

---
