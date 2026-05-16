# /generate-episode-content

Generate all SEO/AEO content and 10 Bluesky posts for an episode. Enforces every rule via sub-agent. Saves to the episode output file and validates before showing Joe.

## When to invoke

When Joe asks for: SEO content, AEO content, show notes questions, Bluesky posts, or "episode content" for a recorded episode.

## How to run

0. **Check for existing work first.** Before reading the script, check whether `outputs/episodes/ep[N]-*.md` already exists. If it does, scan it and list which sections are already present (Wine in the News, Key Questions, FAQ, Schema Markup, Bluesky posts) and which are missing. Only generate the missing sections. If all sections already exist, report that to Joe and ask if he wants anything regenerated.

1. Confirm you have read the episode script via `node scripts/read_gdoc.js <docId>`. Find the docId in `docs/work-log.md`. If not read yet, read it now before proceeding.
2. From the script, extract:
   - Episode number and confirmed title
   - Each wine: name, vintage, price, retailer, alcohol %, professional ratings (Decanter, JS, WA, etc.)
   - Joe and Carmela ratings for each wine
   - Tasting notes for each wine: color, nose, palate, finish (exact words from script)
   - Food pairings for each wine
   - Which wine they chose to finish tonight
   - All research links listed in the script — these become Bluesky post source URLs
   - The episode's key hook or angle (one sentence describing what makes it interesting or surprising)
3. Spawn a subagent with the instructions below, substituting all extracted episode data.
4. When the subagent returns output, save it to `outputs/episodes/ep[N]-[slug].md` under the heading `## SEO / AEO + SOCIAL CONTENT`.
5. Run `node scripts/validate_episode.js outputs/episodes/ep[N]-[slug].md`. Fix every error before showing Joe anything.
6. Show Joe the content from the output file.

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual episode data:

---

You are generating SEO/AEO content and social posts for The Wine Pair Podcast. Every detail must come from the episode data provided — never invent ratings, tasting notes, or pairings.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule. This task is especially governed by: HR-1 (no em-dashes ever), HR-2 (Q./A. format), HR-3 (no invented facts), HR-27 (no Wine in the News in Bluesky posts), HR-29 (heading must be "FREQUENTLY ASKED QUESTIONS"), HR-31 (Bluesky URL structure).**

**Step 2: Read `docs/voice-and-format.md` in its entirety.**

---

**Episode data (provided by main agent — all content must come from here):**

- Episode number: [EPISODE NUMBER]
- Title: [CONFIRMED TITLE]
- Hook / angle: [ONE SENTENCE — what makes this episode interesting or surprising]
- Wine 1: [NAME, VINTAGE, PRICE, RETAILER, ALCOHOL %, PRO RATINGS]
  - Joe rating: [N]/10 | Carmela rating: [N]/10
  - Color: [FROM SCRIPT]
  - Nose: [FROM SCRIPT]
  - Palate: [FROM SCRIPT]
  - Pairings: [FROM SCRIPT]
- Wine 2: [NAME, VINTAGE, PRICE, RETAILER, ALCOHOL %, PRO RATINGS]
  - Joe rating: [N]/10 | Carmela rating: [N]/10
  - Color: [FROM SCRIPT]
  - Nose: [FROM SCRIPT]
  - Palate: [FROM SCRIPT]
  - Pairings: [FROM SCRIPT]
- Finish tonight: [WHICH WINE — both chose X]
- Research links from script: [LIST ALL URLS FROM THE SCRIPT'S RESEARCH LINKS SECTION]

---

## SECTION 1: KEY QUESTIONS

Write exactly 7 questions. Questions only — no answers. Target real search queries someone would type about this wine: "What is [wine] wine?", "What does [wine] taste like?", "Should you chill [wine]?", "What food pairs with [wine]?", "Is [wine] similar to [comparable wine]?", "Is [wine] worth buying?". Do not write questions about specific vintages or products — these get no search traffic.

Output format:
```
### KEY QUESTIONS
*(Place at top of show notes — questions only, no answers)*

- [Question 1]?
- [Question 2]?
[7 total]
```

---

## SECTION 2: FREQUENTLY ASKED QUESTIONS

Write exactly 7 Q&A pairs answering the questions from Section 1.

Rules:
- Heading must be exactly **FREQUENTLY ASKED QUESTIONS** — no other label is acceptable (HR-29)
- Every Q line: `**Q. Question text?**` (bold the entire line including Q.)
- Every A line: `A. Answer text.` (plain — never bolded)
- Each answer: 40-60 words, front-loaded with the verdict, Joe's conversational voice (contractions, "we", plain English)
- Weave in specific details from the episode: ratings, tasting notes, which wine they finished
- No em-dashes anywhere (HR-1)
- No invented facts (HR-3)

Output format:
```
### FREQUENTLY ASKED QUESTIONS
*(Place at bottom of show notes)*

**Q. [Question one]?**
A. [Answer one.]

**Q. [Question two]?**
A. [Answer two.]
[7 total pairs]
```

---

## SECTION 3: SCHEMA MARKUP

Write these blocks in a single code block under `### SCHEMA MARKUP`:

**Review Schema — one `<script>` block per wine reviewed:**
- `itemReviewed.name`: full wine name with vintage
- `offers.price`: exact price from episode data
- `reviewRating.ratingValue`: average of Joe and Carmela ratings as a string (e.g., both gave 8 → "8"; one gave 7, one gave 8 → "7.5")
- `reviewBody`: 2-3 sentences from the tasting notes — nose, palate, pairings, which wine they chose to finish. All from episode data only.
- `author`: Joe and Carmela
- `publisher`: The Wine Pair Podcast

**FAQPage Schema — one block with all 7 Q&A pairs:**
- Each Q&A as a `mainEntity` entry
- `name`: the question text
- `acceptedAnswer.text`: the answer text (plain, no markdown)

Output format:
````
### SCHEMA MARKUP
*(Add to show notes page code block)*

```html
<script type="application/ld+json">
{ ... Review schema for wine 1 ... }
</script>

<script type="application/ld+json">
{ ... Review schema for wine 2 ... }
</script>

<script type="application/ld+json">
{ ... FAQPage schema ... }
</script>
```
````

---

## SECTION 4: BLUESKY POSTS (10)

Write exactly 10 posts. Count characters on every post before including it.

**URL rules (HR-31):**
- Posts 1, 2, 3: teasers. Must end with `thewinepairpodcast.com`. No other URLs.
- Posts 4-10: fact/value posts. Each must end with a unique external URL from the episode's research links. No `thewinepairpodcast.com`. No repeated URLs across posts 4-10.

**Content rules:**
- Posts 1-3: mix of angles — the episode hook, the value story, the ratings surprise
- Posts 4-10: interesting facts from the episode research (history, science, geography, production method, comparisons)
- No Wine in the News references anywhere (HR-27)
- No em-dashes anywhere (HR-1)
- Sound like a person, not ad copy
- Maximum 300 characters total per post (text + newline + URL). Keep text alone under ~240 chars when URL is included. (HR-26)

**Post format:**
```
**[N].**
[Post text]
[url]
```

---

## SELF-CHECK (mandatory before returning output)

Before returning your output, run through this checklist and report results:

1. Em-dashes: scan every line. How many em-dashes found? (Must be zero.)
2. Bluesky character counts: list each post number and its total character count. Flag any over 300.
3. Posts 1-3 URLs: confirm all three end with `thewinepairpodcast.com`. List them.
4. Posts 4-10 URLs: list all seven URLs. Confirm zero are `thewinepairpodcast.com`. Confirm all seven are unique (no repeats).
5. Wine in the News: confirm no post references the news segment.
6. FAQ heading: confirm it is exactly "FREQUENTLY ASKED QUESTIONS".
7. Q./A. format: confirm every Q line starts with `**Q.` and every A line starts with `A.` (plain).
8. Facts: confirm every rating, tasting note, and pairing comes from the episode data provided.

Report: "Self-check complete. [N] issues found." then list any issues. Fix all issues before returning.

---
