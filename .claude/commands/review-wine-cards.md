# /review-wine-cards

Review the HTML wine cards file for a spoke page. Catches both mechanical and judgment issues the validator misses.

## Usage

```
/review-wine-cards outputs/cabernet-sauvignon-wine-cards-embeds.html
```

Run this AFTER `node scripts/validate_spoke.js` passes. The validator catches structure and counts. This review catches format, judgment, and consistency issues.

## How to run

When the user types `/review-wine-cards <filepath>`, do the following:

1. Read the HTML cards file at the given path
2. Read `outputs/malbec-wine-cards-embeds.html` as the reference for correct card format
3. Spawn a subagent with the instructions below, passing it both file contents

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual file contents:

---

You are reviewing an HTML wine cards file for The Wine Pair Podcast. Your job is to find every problem — mechanical or judgment — before it goes to the publisher. Be direct. Return a numbered list of issues. If no issues, say "No issues found."

**The correct card description format is SHORT FRAGMENTS, not prose sentences.** This is the most common regression. Compare every description against the reference.

**Reference format (from Malbec cards — this is the standard):**
- "Full body, firm tannin, low acidity. Blueberry, chocolate, coffee. The Argentine red that overdelivers at the price, every time."
- "Full body, firm tannin, spicy black pepper as the signature note. Blackberry, cracked pepper, violet. Malbec's more complex and spicier alternative."
- "Full body, higher alcohol, jammy dark fruit. Blackberry jam, cinnamon, mocha. The American bold red with the highest ceiling when it's done right."

**The pattern:**
- Sentence 1: `[body]. [tannin/texture]. [one structural note].` — NO grammatical subject, short attribute list, under 12 words
- Sentence 2: `[flavor 1], [flavor 2], [flavor 3].` — pure flavor notes, under 8 words, NO subject
- Sentence 3: One-liner with personality. Can have a subject. Should be memorable.

**Check every card for these issues:**

1. **Description format** — Does the description follow the fragment format above? Check all three failure types:
   - **Predicate clauses in sentence 1** — "needs food to show its best", "demands patience and food", "more complexity than a straight Cab" are all predicate clauses, not structural attributes. Sentence 1 must be a pure attribute list: body, tannin, one structural note. Nothing more.
   - **Comparative clauses in sentence 1** — "more complexity than X", "softer than Cabernet", "more food-friendly than X" are comparisons, not attributes. Sentence 1 describes the wine itself, not its relationship to other wines.
   - **Subject-verb clauses** — "Tannat delivers...", "Cab drinkers discover..." — if sentence 1 or 2 has a subject and verb, it's wrong.
   - **Four flavor notes in sentence 2** — Sentence 2 must have exactly 3 flavor notes, comma-separated. "Blackberry, cassis, cedar, espresso from the barrel" = 4 items = wrong. Count the commas: more than 2 commas in sentence 2 = flag it.
   - **Explanatory phrases as flavor notes** — "espresso from the barrel", "dark Sicilian fruit with an edge" are phrases, not clean flavor notes. Sentence 2 must be a clean comma list of single or two-word flavor terms only.

2. **Em-dashes** — Flag any em-dash (—) in any description, card title, region label, or footer. No exceptions.

3. **Style tags** — Flag any `<style>` tag anywhere in the file.

4. **Card count** — Count the cards. Must be exactly 7 (anchor + 6 alternatives).

5. **Badge assignments** — Check that the style badge on each card is appropriate for that wine's character:
   - Bold and Fruit-Forward (#5c1f7a): dark-fruited, tannic, full-bodied wines
   - Classic and Food-Friendly (#2a4a6b): structured wines with versatility and food-pairing focus
   - Rich and Spicy (#7a3200): wines where spice or richness is the defining characteristic (Syrah MUST use this badge)
   Flag any wine where the badge seems wrong for the wine's actual character.

6. **Bar width math** — For every bar, check that the CSS width percentage equals the displayed numeric value divided by 10. Example: value 7.5 must have width:75%. Flag any mismatch.

7. **Footer format** — Each card footer must have: grape name in italic on the left, price range in bold red (#8b1a2e) on the right. Flag any card where this is missing or incorrect.

8. **Sentence 3 quality** — Is the personality one-liner actually memorable and specific to this wine? Flag:
   - Generic fillers: "that is exactly the point", "worth every sip", "you won't be disappointed"
   - Factual errors: "the template Cabernet Sauvignon was built on" (Cab is a grape component of blends, not derived from them)
   - Anything that could apply to any wine on the list

9. **Description accuracy** — Do the flavor notes in the card match what the wine actually tastes like? Flag any obvious factual errors (wrong flavors, wrong body level, wrong acidity characterization).

10. **Consistency with spoke page** — If a spoke page file is available, check that the wine names in the cards match the H2 headings in the spoke page exactly (including accent marks like Carménère).

Return a numbered list of every issue found, with the card name and the specific text that needs fixing. If no issues are found, say "No issues found."

**Cards to review:**
[CARDS HTML CONTENT]

**Reference Malbec cards:**
[MALBEC CARDS HTML CONTENT]

---
