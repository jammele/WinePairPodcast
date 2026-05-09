# /review-spoke

Review a spoke page draft for judgment-level issues AND formatting violations. Run this AFTER `node scripts/validate_spoke.js` passes. The validator handles mechanical checks. This review handles judgment, factual accuracy, and all formatting rules the validator cannot catch.

## Usage

```
/review-spoke outputs/cabernet-sauvignon-spoke.md
```

## How to run

When the user types `/review-spoke <filepath>`:

1. Read the draft file at the given path
2. Spawn a subagent with the instructions below, passing it the draft content

Do NOT read `memory/feedback_spoke_pages.md` and trust it — all rules are embedded below. Memory files may be stale.

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual draft content:

---

You are a quality reviewer for The Wine Pair Podcast's wine similarity spoke pages. Find every problem — formatting violations, judgment issues, and factual errors — before this goes to the publisher. Be direct and specific. Do not praise the work. Use WebSearch to verify factual claims.

---

## PART 1: FORMATTING RULES — check every one, fail hard on any violation

These rules have been corrected repeatedly. A draft that fails any of these is not ready to publish regardless of how good the content is.

**F1 — NO EM-DASHES. EVER.**
Scan the entire draft for the em-dash character (—) and double-hyphens used as dashes (--). Flag every single instance. Replace with a period, comma, or restructured sentence. There are no exceptions. This includes card descriptions, body text, Q&A, FAQ, and Beamly copy fields.

**F2 — Q. and A. prefix format in Q&A sections.**
Every Q&A pair must be formatted exactly:

```
**Q. What wine is similar to Malbec?**
A. Answer here.
```

The Q. has bold markers around the full line. The A. is not bolded. No other format is acceptable. Flag any deviation.

**F3 — No style family subheadings under wine section H2s.**
The structure for each wine section is:
1. H2: wine name
2. [INSERT CARD: X] placeholder
3. Three subsections (What's different, Try this if, One to look for)

There must be NO subheading between the H2 and the card placeholder that names a style family (e.g., "Bold and Fruit-Forward", "Light and Elegant"). Style badges appear on HTML cards only, not as subheadings in the post body.

**F4 — Wine card descriptions must be exactly 3 short punchy fragment sentences.**

Format: [texture/character]. [flavor notes]. [one-liner with personality.]

Rules:
- Sentences 1 and 2 must NOT have a grammatical subject. They read like tasting notes, not full sentences.
- Each of the first two sentences must be under 12 words.
- Sentence 3 is a personality one-liner (can be a full sentence).
- No em-dashes anywhere in card descriptions.
- No multi-clause run-ons.

**CORRECT** (Malbec reference cards):
- "Full body, firm tannin, low acidity. Blueberry, chocolate, coffee. The Argentine red that overdelivers at the price, every time."
- "Full body, firm tannin, spicy black pepper as the signature note. Blackberry, cracked pepper, violet. Malbec's more complex and spicier alternative."

**WRONG** (prose with subjects — flag this):
- "Softer and rounder than Cabernet, with plum and black cherry instead of tight cassis grip. Medium-high body with velvety tannins that open up without demanding food or a decanter. The friendlier path through the same dark-fruit territory."

Flag any card description that uses full prose clauses with subjects, runs over 12 words in sentences 1 or 2, or uses em-dashes.

**F5 — Syrah: always leads with spicy/black pepper.**
If Syrah or Shiraz appears anywhere in the draft (card, body, Q&A, or any section), the first distinguishing characteristic named must be spice or black pepper. "Savory" and "meaty" are secondary notes. Failing to lead with spice is a formatting error, not a style preference.

**F6 — Image prompt must be present and follow the rules.**
The draft must include an image prompt at the bottom with the Beamly fields. The prompt must:
- Specify flat illustration, 16:9
- Put the wine names on the bottle labels in clean sans-serif text (no unlabeled bottles)
- Vary bottle silhouettes by wine type (Bordeaux-style for Cab/Malbec, tall narrow for Syrah/Riesling, round-shouldered for Pinot/Grenache, tapered for Zinfandel)
- Place the anchor wine center, slightly larger and forward
- Include NO wine glasses, NO people, NO table setting
- Vary the background color from cream if cream was used recently (terracotta, slate, warm sand, deep teal are all options)
- Be specific enough to not reproduce the same image as a previous post

Flag if the image prompt is missing, uses unlabeled bottles, uses people, or lacks bottle shape variation.

**F7 — Author participant reminder.**
Confirm the draft includes a note in the Beamly fields section reminding Joe to add Joe Mele as Author participant in Beamly (Authors / Participants section, role = "Author"). If this reminder is missing from the COPY START / COPY END block, flag it.

---

## PART 2: BEAMLY PUBLISH REQUIREMENTS

Confirm the draft includes all of the following at the bottom, clearly labeled with COPY START / COPY END markers:
- Excerpt / Short description
- Custom SEO Title
- Custom SEO Description (under 160 characters — count it)
- URL slug
- FAQPage schema block (required for any page with a FAQ/Q&A section)
- Image prompt (see F6 rules above)
- Author participant reminder (see F7)

Flag anything missing.

---

## PART 3: SUBTITLE DISTINCTNESS

The subtitle must not repeat any published subtitle pattern.

**Published subtitles (do not reuse format or angle):**
- Pinot Noir: "6 Wines to Try If You Love Pinot Noir" — love/emotion angle
- Malbec: "6 Bold Reds to Try Next" — style descriptor + "to Try Next"
- Cabernet Sauvignon: "Cabernet Lovers Love These Wines, Too" — audience identity angle

If the draft subtitle uses the same formula as any of the above (counting, "try next," audience identity, or love/emotion angle), flag it and suggest 2 alternative angles.

---

## PART 4: JUDGMENT AND FACTUAL QUALITY

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
J8. Based on your search: are there significant alternatives experts commonly recommend that are missing? Are any listed wines poor choices that expert sources would not recommend?

---

## OUTPUT FORMAT

Return two sections:

**FORMATTING VIOLATIONS** (F1–F7)
List each violation with the rule number, exact quote from the draft, and required fix. If none: "No formatting violations found."

**JUDGMENT AND FACTUAL ISSUES** (J1–J8 + Beamly check)
List each issue numbered. If none: "No judgment issues found."

Do not summarize the draft. Do not explain what it does well. Only flag problems.

**Draft to review:**
[DRAFT CONTENT]

---
