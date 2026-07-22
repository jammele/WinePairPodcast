# /generate-episode-content

Generate SEO/AEO content, 10 Bluesky posts, and Spotify poll ideas for an episode, either full suite or requested subset. Enforces every rule via sub-agent. Saves to the episode output file and validates before showing Joe.

## When to invoke

When Joe asks for: SEO content, AEO content, show notes questions, Bluesky posts, Spotify poll ideas, or "episode content" for a recorded episode.
Before invoking, enforce the confirmed-title gate from house rules: title must be confirmed unless Joe explicitly overrides.

## How to run

0. **Check for existing work first, within requested scope only.** Before reading the script, check whether `outputs/episodes/ep[N]-*.md` already exists. If it does, scan it and list which requested sections are already present and which requested sections are missing. Only generate missing sections within the requested scope. If all requested sections already exist, report that to Joe and ask if he wants anything regenerated.
0.5. **Resolve requested scope.** Determine exactly which sections Joe asked for.
  - Full request terms ("episode content", "SEO/AEO content", "all sections") => generate the four core sections: Key Questions, Frequently Asked Questions, Schema Markup, Bluesky Posts. Spotify Poll Ideas is opt-in only — generate it only when explicitly requested by name (e.g. "poll ideas", "Spotify poll"), never bundled into a full-suite request.
  - Partial request => generate only requested sections.
  - If phrasing is ambiguous, ask one clarifying question and proceed with only the confirmed scope.
  - Do not infer adjacent tasks. This command does not generate title options, cover art, Wine in the News, or blog post copy unless explicitly requested.

0.6. **Confirmed-title gate.** Verify the episode title is confirmed in `docs/work-log.md` and/or `data/episode-titles.md` before generation. If title is pending or unclear, stop and ask Joe to confirm title selection. Proceed without confirmation only when Joe explicitly overrides.

0.7. **Delivery gates for requested sections (mandatory).**
  - Scope gate: generate only requested sections. Never add unrequested sections.
  - FAQ selection gate: questions must be selected via the evidence-bound candidate scoring process in `docs/faq-intent-model.md`. Do not slot-fill. Do not write questions before scoring is complete.
  - FAQ count gate: 5-7 questions, determined by scoring — not a fixed number. Do not inflate to reach 7 if fewer candidates pass the threshold.
  - FAQ search-intent gate: every question must score 13+ using the rubric in the intent model, with no 0 in plausibility, grounding, or vocabulary.
  - FAQ episode-grounding gate: every answer must trace to a specific row in the evidence table.
  - FAQ listener-usefulness gate: answers must help a listener decide whether to listen, buy, understand, or pair.
  - FAQ tone gate: plain-language, front-loaded, conversational.
  - FAQ format and length gate: strict HR-2 Q./A. format and 40-60 words per answer.
  - FAQ standalone-answer gate: every answer must make sense without episode context.
  - FAQ podcast-narrative gate: no "In this episode", "Joe says", "Carmela says", "we tasted", "we got", "we chose", "on the show", "our episode" in answers or schema text.
  - Web search gate: if episode type triggers mandatory web search (Costco, Kirkland, private-label, current product, producer identity) and web search is unavailable, stop and report — do not generate questions.
  - Anti-fabrication gate (four hard rules):
    1. Do not claim C1 search was performed unless exact query strings and observed result titles/snippets are recorded in the C1 section of the audit file.
    2. Do not infer search intent from C2 pages alone. C2 confirms what a page says, not how users search.
    3. If a web-search trigger applies and C1 is unavailable, stop. Do not generate candidates, score candidates, or write FAQ answers.
    4. Do not say FAQ outcomes are unlikely to change before required evidence steps are complete and candidates have been re-scored.
  - Facts gate: no invented facts.

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
2.9. **Write PENDING TASK marker to work log before spawning the subagent.** Insert the block below at the very top of `docs/work-log.md` (above the `# Work Log` header line), then commit it immediately. This ensures a fresh session can recover if this session is interrupted.

```
## PENDING TASK — Complete before other work

Task: /generate-episode-content for Ep[N] — [Title]
Started: [YYYY-MM-DD]
Output file: outputs/episodes/ep[N]-[slug].md

On resume:
1. Check whether `outputs/episodes/ep[N]-[slug].md` exists and contains `## SEO / AEO + SOCIAL CONTENT`.
   - If yes: go to step 2.
   - If no: re-invoke /generate-episode-content for this episode from step 3.
2. Run `node scripts/validate_episode.js outputs/episodes/ep[N]-[slug].md` and fix all errors.
3. Show Joe the validated content.
4. Remove this PENDING TASK section from `docs/work-log.md` and commit.
```

3. Spawn a subagent with the instructions below, substituting all extracted episode data and the resolved requested scope.
4. When the subagent returns output, save it to `outputs/episodes/ep[N]-[slug].md` under the heading `## SEO / AEO + SOCIAL CONTENT`. Save only the deliverable sections (KEY QUESTIONS, FREQUENTLY ASKED QUESTIONS, SCHEMA MARKUP, BLUESKY POSTS, SPOTIFY POLL IDEAS). Do not save any `### SELF-CHECK` section — it is the subagent's internal verification and does not belong in the output file.
5. Run validator with section scope:
  - Full suite: `node scripts/validate_episode.js outputs/episodes/ep[N]-[slug].md`
  - Partial: `node scripts/validate_episode.js outputs/episodes/ep[N]-[slug].md --sections=<comma-separated-sections>` where section names are `KEY_QUESTIONS`, `FAQ`, `SCHEMA`, `BLUESKY`, `POLL`
  Fix every error before showing Joe anything.
6. Show Joe the content from the output file. Then remove the entire `## PENDING TASK` section from `docs/work-log.md`, update the Last updated line, and commit.

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual episode data:

---

You are generating SEO/AEO content and social posts for The Wine Pair Podcast. Every detail must come from the episode data provided — never invent ratings, tasting notes, or pairings.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule. This task is especially governed by: HR-1 (no em-dashes ever), HR-2 (Q./A. format), HR-3 (no invented facts), HR-27 (no Wine in the News in Bluesky posts), HR-29 (heading must be "FREQUENTLY ASKED QUESTIONS"), HR-31 (Bluesky URL structure).**

**Step 2: Read `docs/voice-and-format.md` in its entirety.**

**Step 2.3: Read `docs/faq-intent-model.md` in its entirety.** This file governs all Key Questions and FAQ generation. The candidate scoring process in that file replaces any prior instruction to "write 7 questions." Questions are selected by scoring, not by slot-filling.

**Step 2.5: Respect requested scope exactly.**
Generate only the sections listed under **Requested sections** below. Do not generate unrequested sections. Do not infer downstream tasks. Do not add Wine in the News, title options, cover art prompts, transcripts, or blog post copy.

**Step 2.6: Apply delivery gates before returning output.**
- Key Questions and FAQ: follow the evidence-bound candidate scoring process in Sections 1 and 2 of this file (Steps A through I). Do not write questions until scoring is complete.
- Final question count: 5-7, determined by how many candidates score 13+. Do not inflate to reach 7 if fewer questions pass the threshold.
- FAQ answers must be grounded in the evidence table only — each answer must trace to a specific evidence row.
- FAQ answers must be useful for listen/buy/understand/pair decisions.
- FAQ answers must be 40-60 words, front-loaded, plain-language, conversational.
- FAQ standalone requirement: answers must stand alone without episode context.
- FAQ narrative ban: no "In this episode", "On this episode", "Joe says", "Joe points out", "Carmela says", "we tasted", "we got", "we chose", "on the show", "our episode".
- Enforce strict HR-2 Q./A. format.
- Do not invent facts.
- Do not output unrequested sections.
- Save audit file to `outputs/episodes/faq-audits/ep[N]-faq-audit.md` using the template from Section 9 of `docs/faq-intent-model.md` before returning output.

---

**Episode data (provided by main agent — all content must come from here):**

- Episode number: [EPISODE NUMBER]
- Title: [CONFIRMED TITLE]
- Requested sections: [KEY_QUESTIONS, FAQ, SCHEMA, BLUESKY, POLL]
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

## SECTION 1 + 2: KEY QUESTIONS AND FREQUENTLY ASKED QUESTIONS (generate only if requested)

Key Questions and FAQ must be generated together using the evidence-bound candidate scoring process below. Do not write any questions or answers until Steps A through I are complete.

### Step A — Classify episode type

Read `docs/faq-intent-model.md`. Identify the episode type (e.g. Costco/private-label review, standard two-wine review, grape explainer, region explainer). State the episode type explicitly before proceeding.

### Step B — Check web search trigger and run C1 preflight if required

**Step B.1 — Determine whether C1 is required.** Check whether this episode meets any web search trigger condition from Section 5 of the intent model: Costco, Kirkland, Trader Joe's, Aldi, private-label, current or recent vintage in a product-review context, producer/bottler identity questions, or uncertain search phrasing. State your answer explicitly before continuing.

**Step B.2 — If C1 is required:** Run the C1 capability preflight.
- State the specific tool or command you will use to run live web searches.
- Confirm it can return all four of: (a) exact query string, (b) observable result titles and snippets, (c) URLs of results, (d) date observed.
- URL fetch, reading known links, repo search, file search, and local grep are not C1. If the tool cannot produce all four outputs, C1 is unavailable.

**If C1 is required and available:** proceed to Step C.
**If C1 is required and unavailable:** stop. Set audit C1 status to "C1 required but unavailable — scoring blocked." Report: "C1 search required for this episode type but unavailable — scoring blocked. Cannot proceed." Do not generate candidates or answers.

**Step B.3 — If C1 is not required:** State: "C1 not required for this episode type." Set audit C1 status accordingly. Proceed directly to Step D using I and C2 evidence only. Do not run a preflight. Do not block.

**Step B.4 — If C1 is optional** (search phrasing is uncertain for a non-triggered episode): State: "C1 used optionally — [reason]." Run the preflight for that optional use only. If unavailable in this optional case, note it and continue without C1.

### Step C — Gather evidence (required for web-triggered episodes)

Produce an evidence ledger before any candidate generation. The ledger has three sections: I (internal), C1 (search results), and C2 (fetched pages). Assign evidence IDs to every row — I-N, C1-N, C2-N. These IDs will be cited in the scoring table in Step E.

**Section I — Internal evidence.**
Gather episode-created facts: title, hook, script text, transcript, tasting notes, prices, host ratings, verdicts, host preferences, pairings, central discussion topics. Research links listed in the script are **source pointers only** — they are not I evidence. Do not record them here. They become C2 evidence once fetched.

| ID | Evidence type | Finding | Source (episode file section) |
|---|---|---|---|
| I-1 | ... | ... | ... |

**Section C1 — Search-result evidence.**
Run all mandatory queries using realistic listener/buyer phrasing. For a Costco/private-label episode, run all of the following (substitute actual wine names and vintage):

1. `2023 [Wine 1 name] review`
2. `2023 [Wine 2 name] review`
3. `Kirkland [appellation 1] Costco`
4. `Kirkland [appellation 2] Costco`
5. `Costco Kirkland [wine type] [vintage year]`
6. `Kirkland Signature [wine type] review`
7. `who makes Kirkland Signature [wine 1]`
8. `who makes Kirkland Signature [wine 2]`
9. `who bottles Kirkland Signature [wine 2]`
10. `[Producer name] Kirkland [wine 2]` (if a bottler name is known or suspected)
11. `Kirkland [wine 2] negociant`
12. `[appellation A] vs [appellation B]`
13. `[appellation] wine under $[relevant price tier]`

For each query, record: exact query string, result titles and snippets observed, repeated phrases across results, source types, and what listener intent each result implies.

| ID | Exact query | Result title observed | Snippet/text observed | URL of result | Date observed |
|---|---|---|---|---|---|
| C1-1 | ... | ... | ... | ... | ... |

**Section C2 — Fetched-page evidence.**
Fetch the most relevant pages from the C1 search results, and fetch any episode research links (which become C2 once read). Record page title, key phrases in headings and opening paragraphs, whether buying/review/comparison/provenance language appears, and how product names are phrased.

| ID | URL fetched | Page title | Key phrases and framing observed |
|---|---|---|---|
| C2-1 | ... | ... | ... |

### Step D — Generate 12-15 candidate questions

Using the required and conditional question families from the intent model for this episode type, generate 12-15 candidate questions. Do not pre-select or filter at this stage — generate broadly from all plausible families.

### Step E — Score each candidate

Produce a score table. For every candidate, provide:
- Question text
- Six scores (0-3 each), each with a one-line evidence note citing a specific source from the evidence table
- Penalty adjustments with reason
- Adjusted total

**Scoring cell format: `[score] — [evidence ID(s)]: [one-sentence rationale explaining why the cited evidence supports this score]`**

- Valid: `3 — C1-2, C2-1: C1-2 shows result titles using "Kirkland Signature Pauillac review"; C2-1 is a fetched review page with buy/value framing in the opening paragraph.`
- Not valid: `3 — C1-2` (no rationale)
- Not valid: `3 — likely buyer intent` (no evidence ID)
- Valid inference: `2 — Inference from I-3 and I-4: episode compares both wines directly, but no C1 evidence confirms this exact phrasing.` *(labeled inference — allowed)*
- Not valid: `2 — probably asked by buyers` (unsupported inference — no evidence ID)

| Candidate question | Plausibility (0-3) | Usefulness (0-3) | Centrality (0-3) | Specificity (0-3) | Grounding (0-3) | Vocabulary (0-3) | Penalties | Total | Pass/Fail |
|---|---|---|---|---|---|---|---|---|---|

Scoring criteria are defined in Section 3 of `docs/faq-intent-model.md`. On web-triggered episode types, a plausibility score of 3 requires at least one C1 evidence ID. C2 evidence alone caps plausibility at 2. I evidence alone caps plausibility at 1 on web-triggered episodes.

### Step F — Apply thresholds and auto-fails

Reject any candidate scoring below 13. Auto-fail any candidate with a 0 in plausibility, grounding, or vocabulary, regardless of total score. List rejections with the reason.

### Step G — Merge duplicates

If two surviving candidates address the same listener need, merge them into one question using the stronger phrasing. Apply the combined vs. separate vs. comparison buy question rules from Section 6 of the intent model.

### Step H — Check coverage

Are the required question families for this episode type all represented among surviving candidates? If a required family has no surviving candidate, generate a new candidate for it and run it through Steps E and F before continuing.

### Step I — Select and write

Select the top 5-7 questions using the tie-breaker order from Section 7 of the intent model. State final selections with scores. Then write answers.

**Key Questions output format:**
```
### KEY QUESTIONS
*(Place at top of show notes - questions only, no answers)*

- [Question 1]?
[5-7 total, matching the FAQ questions below]
```

**FAQ rules (same as before):**
- Heading must be exactly **FREQUENTLY ASKED QUESTIONS** — no other label is acceptable (HR-29)
- Every Q line: `**Q. Question text?**` (bold the entire line including Q.)
- Every A line: `A. Answer text.` (plain — never bolded)
- Each answer: 40-60 words, front-loaded with the verdict, Joe's conversational voice (contractions, plain English)
- Weave in specific details: ratings, tasting notes, which wine they finished
- Every answer must be useful to someone deciding whether to listen, buy, understand, or pair the wine
- No em-dashes anywhere (HR-1)
- No invented facts (HR-3)
- Every answer must trace to a specific row in the evidence table

**FAQ output format:**
```
### FREQUENTLY ASKED QUESTIONS
*(Place at bottom of show notes)*

**Q. [Question one]?**
A. [Answer one.]
[5-7 total pairs]
```

**Audit file:** Save the complete evidence ledger (Sections I, C1, C2), candidate scoring table, rejection log, and final selection log to `outputs/episodes/faq-audits/ep[N]-faq-audit.md` using the template from Section 9 of `docs/faq-intent-model.md`. Save this before returning output. The public episode file contains only the final Key Questions, FAQ, schema, and Bluesky posts — not the score tables.

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

## SECTION 3: SCHEMA MARKUP (generate only if requested)

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

## SECTION 4: BLUESKY POSTS (10) (generate only if requested)

Write exactly 10 posts. Count characters on every post before including it.

**MANDATORY STEP — complete this plan before writing any post.**

Fill in this table first. Do not write any post text until the table is complete and all rules below are satisfied.

| Post | Angle | URL |
|---|---|---|
| 1 | Teaser - episode hook | thewinepairpodcast.com |
| 2 | Teaser - value or price story | thewinepairpodcast.com |
| 3 | Teaser - verdict hint (no spoiler) | thewinepairpodcast.com |
| 4 | Nerd angle (fermentation, soil, clone, technique) | [unique external URL - source domain] |
| 5 | Nerd or Story angle | [unique external URL - different domain from post 4] |
| 6 | Story angle (historical or weird fact) | [unique external URL] |
| 7 | Fact | [unique external URL] |
| 8 | Fact | [unique external URL] |
| 9 | Fact | [unique external URL] |
| 10 | Fact | [unique external URL] |

Planning rules (verify before proceeding):
- At least one of posts 4-10 must cover the **Nerd angle**: fermentation method, soil type, grape clone, or production technique discussed in the episode.
- At least one of posts 4-10 must cover the **Story angle**: a historical anecdote, surprising statistic, or weird fact mentioned in the episode.
- Post 3 must include a verdict hint (e.g. reaction, rating signal) without spoiling the outcome.
- Posts 4-10 must not share a domain. No more than 2 posts from the same domain (e.g. en.wikipedia.org) among posts 4-10. If more than 2 planned sources are Wikipedia, find other credible sources: Decanter, Wine Enthusiast, Wine Folly, Wine-Searcher, specialized wine blogs, or news sites.
- All 7 external URLs must be sourced from the episode research links provided above or from credible external sources — none may be thewinepairpodcast.com.

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

## SECTION 5: SPOTIFY POLL IDEAS (generate only if requested)

Draft 2-3 poll question options for Joe to choose from, formatted for Spotify's poll mechanics (a question plus up to 4 answer options).

**Anchoring rule (required):** anchor every option to the episode's core tasting/verdict content — the wine(s), the hook, the ratings, the reaction. Never anchor to the Wine in the News segment; it's a recurring segment, not the episode's spine.

**Content rules:**
- Every question and option must be grounded in the actual episode data provided (hook, verdict, tasting notes, ratings) — no invented facts (HR-3).
- Options should be genuinely chooseable, not open-ended — a listener taps one in a couple seconds.
- Favor formats that have worked before: a pre-reveal prediction tied to the episode's own question, an honesty/confession angle (anti-snob brand), or a reaction/verdict-adjacent question.
- No em-dashes (HR-1).
- For each option, add a one-line rationale for why it fits this episode.

**Output format:**
```
### SPOTIFY POLL IDEAS
*(Pick one to post at episode launch via Spotify for Creators)*

**Option 1: [Poll question]?**
- [Answer option 1]
- [Answer option 2]
- [Answer option 3 (optional)]
- [Answer option 4 (optional)]
Rationale: [one line — why this fits the episode]

[2-3 options total]
```

---

## SELF-CHECK (mandatory before returning output)

Before returning your output, run through this checklist and report results for requested sections only:

1. Em-dashes: scan every line. How many em-dashes found? (Must be zero.)
2. Bluesky character counts: list each post number and its total character count. Flag any over 300.
3. Posts 1-3 URLs: confirm all three end with `thewinepairpodcast.com`. List them.
4. Posts 4-10 URLs: list all seven URLs. Confirm zero are `thewinepairpodcast.com`. Confirm all seven are unique (no repeats). Count how many share the same domain — if more than 2 of the 7 share a single domain (e.g. en.wikipedia.org), flag it as a quality issue and replace the extras with non-duplicate sources.
4a. Angles coverage: confirm at least one of posts 4-10 covers the Nerd angle (fermentation, soil, clone, or technique) and at least one covers the Story angle (historical anecdote, weird fact, or surprising statistic from the episode). If either is missing, rewrite before returning.
5. Wine in the News: confirm no post references the news segment.
6. FAQ heading: confirm it is exactly "FREQUENTLY ASKED QUESTIONS".
7. Q./A. format: confirm every Q line starts with `**Q.` and every A line starts with `A.` (plain).
8. Facts: confirm every rating, tasting note, and pairing comes from the episode data provided.
9. FAQ grounding: for each of the 7 Q&A pairs, name the specific episode data point the answer draws from (a tasting note, a dialogue line, a rating, a research fact from the provided links). If any answer draws only from general wine knowledge not present in the provided episode data, replace that Q&A pair before returning.
10. FAQ narrative gate: confirm FAQ answer lines (`A.`) and FAQ schema `acceptedAnswer.text` contain none of these case-insensitive phrases: "In this episode", "On this episode", "Joe says", "Joe points out", "Carmela says", "we tasted", "we got", "we chose", "why we did this episode", "on the show", "our episode". If any are present, rewrite before returning.
11. If POLL requested: confirm every option is anchored to core tasting/verdict content, not Wine in the News. Confirm each poll has 2-4 answer options. Confirm no em-dashes. Confirm every question/option traces to actual episode data provided (no invented facts).

Report: "Self-check complete. [N] issues found." then list any issues. Fix all issues before returning.

---
