# /review-wine-cards

Review the HTML wine cards file for a spoke page. Catches both mechanical and judgment issues.

## Usage

```
/review-wine-cards outputs/cabernet-sauvignon-wine-cards-embeds.html
```

Run this AFTER `node scripts/validate_spoke.js` passes.

## How to run

When the user types `/review-wine-cards <filepath>`:

1. Read the HTML cards file at the given path
2. Read `outputs/malbec-wine-cards-embeds.html` as the reference for correct card format
3. Spawn a subagent with the instructions below, passing it both file contents

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual file contents:

---

You are reviewing an HTML wine cards file for The Wine Pair Podcast. Find every problem before it goes to the publisher. Be direct. Return a numbered list of issues. If no issues, say "No issues found."

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule in it. No card passes review if it violates any item in that file.**

After reading house-rules.md, run the checks below.

---

**The correct card description format is SHORT FRAGMENTS, not prose sentences.** This is the most common regression. Compare every description against the reference.

**Reference format (from Malbec cards — this is the standard):**
- "Full body, firm tannin, low acidity. Blueberry, chocolate, coffee. The Argentine red that overdelivers at the price, every time."
- "Full body, firm tannin, spicy black pepper as the signature note. Blackberry, cracked pepper, violet. Malbec's more complex and spicier alternative."
- "Full body, higher alcohol, jammy dark fruit. Blackberry jam, cinnamon, mocha. The American bold red with the highest ceiling when it's done right."

**The pattern:**
- Sentence 1: `[body]. [tannin/texture]. [one structural note].` — NO grammatical subject, short attribute list, under 12 words
- Sentence 2: `[flavor 1], [flavor 2], [flavor 3].` — exactly 3 flavor notes, pure comma list, NO subject, under 8 words
- Sentence 3: One-liner with personality. Can have a subject. Should be memorable.

**Check every card for these issues:**

1. **Description format** — Does the description follow the fragment format? Check all failure types:
   - **Predicate clauses in sentence 1** — "needs food to show its best", "demands patience", "more complexity than a straight Cab" are predicate clauses, not attributes. Sentence 1 must be a pure attribute list: body, tannin, one structural note. Nothing else.
   - **Comparative clauses in sentence 1** — "more complexity than X", "softer than Cabernet" are comparisons, not attributes. Sentence 1 describes the wine itself, not its relationship to other wines.
   - **Subject-verb clauses in S1 or S2** — if sentence 1 or 2 has a grammatical subject and verb, it's wrong.
   - **Four flavor notes in sentence 2** — exactly 3 flavor notes, comma-separated. More than 2 commas in sentence 2 = flag it.
   - **Explanatory phrases as flavor notes** — "espresso from the barrel", "dark Sicilian fruit with an edge" are phrases, not clean flavor terms. Sentence 2 must be a clean comma list of single or two-word terms only.

2. **Em-dashes (HR-1)** — Flag any em-dash (—) anywhere in any card. No exceptions.

3. **Style tags (HR-21)** — Flag any `<style>` tag anywhere in the file.

4. **Card count** — Must be exactly 7 (anchor + 6 alternatives).

5. **Badge assignments** — Check that the style badge on each card is appropriate:
   - Bold and Fruit-Forward (#5c1f7a): dark-fruited, tannic, full-bodied wines
   - Classic and Food-Friendly (#2a4a6b): structured wines with versatility and food-pairing focus
   - Rich and Spicy (#7a3200): wines where spice or richness is the defining characteristic. Syrah MUST use this badge (HR-6).
   Flag any wine where the badge seems wrong.

6. **Bar width math** — For every bar, CSS width percentage must equal the displayed numeric value divided by 10. Example: value 7.5 must have width:75%. Flag any mismatch.

7. **Footer format** — Each card footer: grape name in italic on the left, price range in bold red (#8b1a2e) on the right. Flag any card where this is missing or incorrect.

8. **Sentence 3 quality** — Is the personality one-liner memorable and specific to this wine? Flag:
   - Generic fillers: "that is exactly the point", "worth every sip", "you won't be disappointed"
   - Factual errors in the one-liner
   - Anything that could apply to any wine on the list

9. **Description accuracy** — Do the flavor notes match what the wine actually tastes like? Flag obvious factual errors.

10. **Consistency with spoke page** — Wine names in the cards must match H2 headings in the spoke page exactly (including accent marks like Carménère).

Return a numbered list of every issue found, with the card name and the specific text that needs fixing. If no issues, say "No issues found."

**Cards to review:**
[CARDS HTML CONTENT]

**Reference Malbec cards:**
[MALBEC CARDS HTML CONTENT]

---
