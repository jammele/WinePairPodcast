# /verify-published

Check a live published page for the issues Beamly can silently break on re-save. Run this after publishing or editing any page in Beamly.

## Usage

```
/verify-published https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir
```

## When to run

- Immediately after publishing a new page
- After editing any existing page in Beamly (re-saves can re-encode card HTML)
- After adding any code embed block to a page with wine cards

## How to run

When the user types `/verify-published <url>`, spawn a subagent with the instructions below, passing it the URL.

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual URL:

---

You are a post-publish verifier for The Wine Pair Podcast website. Fetch the live page and check it for issues Beamly can silently introduce.

**Step 1: Read `docs/house-rules.md`. Pay particular attention to HR-21 (inline styles), HR-22 (author participant), and HR-23 (re-encoding bug).**

**Page to verify:** [URL]

**Run these checks:**

### Check 1 — Card re-encoding (HR-23, highest priority)
Fetch the page source. Search for the string `&lt;span` in the HTML. This indicates Beamly has HTML-encoded `<span>` tags inside a code embed block, which causes badge labels to display as raw text rather than styled HTML.

- PASS: Zero instances of `&lt;span` found
- FAIL: Report the count of encoded spans found. Tell the user: "Card badges are broken. Open Beamly, delete all card code embed blocks, and re-paste them from the source file in outputs/. Do not just re-save — delete and re-paste."

### Check 2 — FAQPage schema present
Look for a `<script type="application/ld+json">` block containing `"@type": "FAQPage"` (or inside an `@graph` array). Parse it to confirm it has at least one `mainEntity` question.

- PASS: FAQPage schema found with N questions
- FAIL: No FAQPage schema found. Check that the code embed block was saved correctly in Beamly.

### Check 3 — Review Schema (for pages with wine ratings)
If this is a review post or spoke page with wine cards, look for `"@type": "Review"` in any JSON-LD block. For spokes, there may not be Review schema — that is expected.

- PASS: Review schema found (or: page type does not require Review schema — flag which)
- FAIL: Review schema expected but not found

### Check 4 — Meta description
Look at the `<meta name="description">` tag. Check that it is not empty and not a generic Beamly default.

- PASS: Meta description is set and specific (show the first 100 chars)
- FAIL: Meta description is missing or appears to be a generic default

### Check 5 — Author byline visible (HR-22)
Look for the text "Joe Mele" anywhere in the page body (not in schema). This indicates the author participant was connected in Beamly and the byline is rendering.

- PASS: "Joe Mele" found in page body
- FAIL: Author byline not found. In Beamly: Authors / Participants section → search "Joe Mele" → add with role "Author"

### Check 6 — Page title set
Look at the `<title>` tag. Confirm it is not a Beamly default and contains the page's actual title.

- PASS: Title is set and specific (show it)
- FAIL: Title is missing or appears to be a default

---

**Output format:**

Return a checklist with PASS/FAIL for each check. For any FAIL, give the exact fix action in one sentence.

Example:
- Check 1 (Card re-encoding): FAIL — 14 encoded spans found. Delete all card code blocks in Beamly and re-paste from outputs/pinot-noir-wine-cards-embeds.html.
- Check 2 (FAQPage schema): PASS — 8 questions found
- Check 3 (Review schema): N/A — spoke page, no Review schema expected
- Check 4 (Meta description): PASS — "We tasted six wines similar to Pinot Noir..."
- Check 5 (Author byline): PASS — Joe Mele found in page body
- Check 6 (Page title): PASS — "Wines Similar to Pinot Noir: 6 Wines Pinot Lovers Will Love"

---
