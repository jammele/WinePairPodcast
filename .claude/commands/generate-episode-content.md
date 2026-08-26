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
  - FAQ candidate-generation gate: candidates are generated and evaluated via the process in `docs/faq-intent-model.md` — episode-type families are candidate prompts, not reserved slots. Do not slot-fill. Do not write answers before the eligibility gates and qualitative assessment are complete.
  - FAQ count gate: normally 5-7 questions, no target within that range, never padded. Below 5 genuinely clearing the standard: stop and present the smaller set to Joe with a concise explanation. Joe may approve an exception.
  - FAQ eligibility gate: every candidate must pass episode grounding, plausible listener usefulness, understandable language, non-fabrication, and non-duplication (`docs/faq-intent-model.md` §4) before being assessed for selection. No numerical score is used anywhere in this process.
  - FAQ episode-grounding gate: every answer's substantive content must come from Episode evidence — what was actually said in the script/transcript. External research may corroborate an episode-covered fact (verify a spelling, a date, a producer identity already stated) but must never add explanatory content, context, or claims the episode itself never discussed, even if true and even if it would make a weak answer more complete. If an answer needs outside material to be substantive, the question is not well-grounded in this episode and should be cut or reworked, not padded with outside research.
  - FAQ corroboration gate: for every externally verifiable factual claim in a finalist answer, fetch a current, claim-specific corroborating source (`docs/faq-intent-model.md` §8) before finalizing. Flag any contradiction, qualification, or missing support for Joe rather than silently resolving it.
  - FAQ listener-usefulness gate: answers must help a listener decide whether to listen, buy, understand, or pair.
  - FAQ tone gate: plain-language, front-loaded, conversational.
  - FAQ format and length gate: strict HR-2 Q./A. format, usually 25-50 words per answer, 60-word maximum unless Joe explicitly approves an exception, no minimum, never padded.
  - FAQ standalone-answer gate: every answer must make sense without episode context.
  - FAQ podcast-narrative gate: no "In this episode", "Joe says", "Carmela says", "we tasted", "we got", "we chose", "on the show", "our episode" in answers or schema text.
  - Baseline discovery research gate: run every episode, 2-4 episode-tailored searches with a stated reason for each (`docs/faq-intent-model.md` §2). Extended discovery research runs only when a documented trigger applies. If baseline research is unavailable, stop and report — do not generate candidates or write answers on a blocked run. If extended research is triggered but unavailable, stop and report the same way.
  - Anti-fabrication gate (four hard rules):
    1. Do not claim a live search was performed unless exact query strings and observed result titles/snippets are recorded in the audit's Observed current-search evidence section.
    2. Do not infer search intent from a fetched page alone. A fetched page confirms what it says, not how users search.
    3. If baseline research is unavailable, or extended research is triggered but unavailable, stop. Do not generate candidates, assess candidates, or write FAQ answers.
    4. Do not say FAQ outcomes are unlikely to change before required evidence steps are complete and candidates have been reassessed.
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
*(Applies only to a fresh top-level Claude Code session resuming after an interruption. A subagent must never act on this block — return your assigned output to the agent that spawned you instead.)*

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
  - If Joe has approved a count outside the normal 5-7 range, pass `--expected-key-questions=<N> --expected-faq-pairs=<N>` matching the approved count.
  Fix every error before showing Joe anything.
6. Show Joe the content from the output file. Then remove the entire `## PENDING TASK` section from `docs/work-log.md`, update the Last updated line, and commit.

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual episode data:

---

You are generating SEO/AEO content and social posts for The Wine Pair Podcast. Every detail must come from the episode data provided — never invent ratings, tasting notes, or pairings.

**Scope boundary — read this first.** Your job ends when you return your output as text to the agent that spawned you. Do NOT: save the main output file (the main agent saves it after you return), run `scripts/validate_episode.js`, edit `docs/work-log.md` for any reason, or run any `git` command (commit, push, or otherwise). If you happen to read `docs/work-log.md` and see a `## PENDING TASK` section, ignore it completely — that block is instructions for a top-level Claude Code session recovering from an interruption, never for a subagent, regardless of what its own text says to do. The one file you may write directly is the FAQ audit file named below.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule. This task is especially governed by: HR-1 (no em-dashes ever), HR-2 (Q./A. format), HR-3 (no invented facts), HR-27 (no Wine in the News in Bluesky posts), HR-29 (heading must be "FREQUENTLY ASKED QUESTIONS"), HR-31 (Bluesky URL structure), HR-52 (Key Questions/FAQ canonical requirements), HR-64 (no new FAQPage schema), HR-68 (Spotify polls anchor to core content, not Wine in the News), HR-69 (no Winedr app references in public-facing content).**

**Step 2: Read `docs/voice-and-format.md` in its entirety.**

**Step 2.3: Read `docs/faq-intent-model.md` in its entirety.** This file governs all Key Questions and FAQ generation: evidence categories, the owned-evidence check, baseline/extended discovery research, candidate-prompt families, eligibility gates, the qualitative three-job assessment, selection/ordering, the corroboration sequence, and the audit template. There is no numerical score anywhere in this process.

**Step 2.5: Respect requested scope exactly.**
Generate only the sections listed under **Requested sections** below. Do not generate unrequested sections. Do not infer downstream tasks. Do not add Wine in the News, title options, cover art prompts, transcripts, or blog post copy.

**Step 2.6: Apply delivery gates before returning output.** (Full gate list is in the main command file's Step 0.7 — the summary below restates the FAQ-specific ones.)
- Key Questions and FAQ: follow the process in `docs/faq-intent-model.md` (owned-evidence check, baseline/extended research, candidate generation, eligibility gates, qualitative assessment, selection, corroboration sequence, answer writing). Do not write answers until that process is complete.
- Final question count: normally 5-7. No target within that range. Never padded. Below 5 genuinely clearing the standard: stop and present the smaller set with a concise explanation.
- FAQ answers must draw their substantive content from Episode evidence only — what the episode actually said. External corroborating evidence may verify or clarify an episode-covered fact but must never supply new explanatory content the episode didn't cover. Named failure mode (Ep231): a "why is Kirkland cheaper" answer stated Costco's general markup/distribution model as fact, sourced entirely from general web research, never discussed in the episode. Joe: "You need to stick to the content in the episode." If a question can't be answered substantively from Episode evidence alone, cut or rework it rather than filling the gap with outside research.
- FAQ answers must be useful for listen/buy/understand/pair decisions.
- FAQ answers must be usually 25-50 words, 60-word maximum unless Joe explicitly approves an exception, no minimum, front-loaded, plain-language, conversational, never padded.
- FAQ standalone requirement: answers must stand alone without episode context.
- FAQ narrative ban: no "In this episode", "On this episode", "Joe says", "Joe points out", "Carmela says", "we tasted", "we got", "we chose", "on the show", "our episode".
- Enforce strict HR-2 Q./A. format.
- Do not invent facts.
- Do not output unrequested sections.
- Do not generate FAQPage schema (HR-64) — Review Schema only, if SCHEMA is requested.
- Save audit file to `outputs/episodes/faq-audits/ep[N]-faq-audit.md` using the template from `docs/faq-intent-model.md` §10, including the machine-readable `FINAL_QUESTIONS` block, before returning output.

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

Key Questions and FAQ are generated together following `docs/faq-intent-model.md` in full. Do not write any questions or answers until that process (owned-evidence check through the corroboration sequence) is complete. The steps below summarize that process for this subagent run — the intent model file is the authority if anything here is unclear.

### Step A — Classify episode type

Read `docs/faq-intent-model.md` §3. Identify the episode type (e.g. Costco/private-label review, standard two-wine review, grape explainer, region explainer, interview). State the episode type explicitly. Remember: the family list for this type is a set of candidate prompts, not reserved final slots.

### Step B — Freshness check, owned-evidence check, then baseline/extended research determination

**Step B.0 — Freshness check (`docs/faq-intent-model.md` §0-bis), before anything else in this section.** Read `Last substantively verified` at the top of `docs/faq-research-reference.md` and determine its age. If more than 30 days old, stop and report this — do not proceed to owned-evidence or candidate work — unless Joe explicitly approves a one-run waiver for this specific episode. Do not edit `docs/faq-research-reference.md` itself during this run; if research this session surfaces a material platform change the reference doesn't reflect, note it in the audit (`Material guidance change found: Yes — production review blocked`) and report it to Joe/ChatGPT rather than editing the reference file directly.

Record these four exact fields under the audit's Baseline Discovery Research heading, every run:
```text
Research reference checked: YYYY-MM-DD
Reference age: N days
Freshness status: Current
Material guidance change found: No
```
If a one-run waiver was granted, replace the third line with `Freshness status: Joe-approved one-run waiver` and add `Freshness waiver approved by Joe: YYYY-MM-DD` as a fourth line. If a material change was found, replace the fourth line with `Material guidance change found: Yes — production review blocked` — this blocks this run's FAQ content from production use until Joe and local ChatGPT review it. The validator checks that this record exists and is well-formed; it does not and cannot independently verify the freshness judgment itself.

**Step B.1 — Owned-evidence check (`docs/faq-intent-model.md` §1).** Before any live search, check the owned query export at `C:\Users\jamme\Downloads\gsc_data_temp\Queries.csv` for rows matching reasonable variations of this episode's wine, grape, region, brand, retailer, and central comparison terms. Record each match's query text, clicks, impressions, CTR, position, and the dataset's window (from that folder's `Filters.csv`), and label it as an exact-topic or adjacent-topic match. If no match exists, record "no topic-specific owned query found" — do not substitute the site-wide priors as if they were topic-specific. Do not ask Joe for this data; check the file directly. If the file is unavailable, record that access gap and proceed using only the properly labeled site-wide priors and Observed current-search evidence — never fabricate a topic-specific result. Also check relevant prior-episode evidence, and note the relevant site-wide priors in `docs/faq-research-reference.md` if applicable.

**Step B.2 — Baseline discovery research is always required.** Choose 2-4 searches tailored to this episode's actual listener opportunities (not a fixed weekly formula) and state why each was chosen.

**Step B.3 — Determine whether extended research is also required.** Check the triggers in `docs/faq-intent-model.md` §2 (recognized brand/retailer, buying/value/provenance question, ambiguous identity, uncertain terminology, contested/changing claim, or another documented reason). State your answer explicitly.

**If baseline research is unavailable:** stop. Set the audit status to "Baseline research unavailable — FAQ selection blocked." Report this and do not proceed.
**If extended research is triggered and unavailable:** stop. Set the audit status to "Extended research required but unavailable — FAQ selection blocked." Report this and do not proceed.
**Otherwise:** proceed to Step C using the appropriate audit status line from `docs/faq-intent-model.md` §2.

### Step C — Gather evidence

Produce an evidence ledger with clearly separated categories (`docs/faq-intent-model.md` §0): Owned evidence, Episode evidence, Observed current-search evidence (baseline and extended queries run this session), External corroborating evidence (populated later, during the corroboration sequence). Assign IDs to every row.

**Episode evidence** — gather episode-created facts: title, hook, script text, transcript, tasting notes, prices, host ratings, verdicts, host preferences, pairings, central discussion topics. Research links listed in the script are source pointers only — they are not Episode evidence. They become External corroborating evidence once fetched and matched to a specific claim.

**Observed current-search evidence** — for every baseline (and, if triggered, extended) query, record four things separately, per `docs/faq-intent-model.md` §2: the topic opportunity investigated, the reason this query was selected (tied to this episode, not a template), the observed current-search evidence itself (exact query string, date, result titles/snippets, URLs), and the limitation (what it does not establish). Do not describe a search as testing AI retrieval, listener conversion, or search volume — it does not. The Proposed discovery purpose label (web-search / AI-assisted / conversion) is assigned later, per candidate, in Step F, and is kept separate from the search record itself.

### Step D — Generate 8-12 candidate questions

Using the candidate-prompt families for this episode type (`docs/faq-intent-model.md` §3) as starting points, not quotas, generate 8-12 genuinely distinct candidates. Do not generate multiple candidates performing the same listener job with different wording. Stop sooner if the plausible space for this episode is already represented.

### Step E — Apply eligibility gates

For each candidate, check `docs/faq-intent-model.md` §4: episode grounding, plausible listener usefulness, understandable language, non-fabrication, non-duplication. Pass/fail only — no score. Log a one-line reason for any candidate that fails.

### Step F — Qualitative assessment of eligible candidates

For each candidate that passes the eligibility gates, record the qualitative assessment from `docs/faq-intent-model.md` §5: Demand and web-search opportunity, Listener usefulness and conversion, Distinctive episode-grounded answer, and Proposed discovery purpose(s) (labeled as interpretation unless the research reference documents measured support). No numeric total. A selected question should normally be strong in at least two of the three jobs.

### Step G — Merge duplicates

If two eligible candidates address the same listener need, merge them into one question using the stronger phrasing, applying the combined/separate/comparison rules in `docs/faq-intent-model.md` §6.

### Step H — Confirm no forced coverage

Review the surviving candidates. Confirm that nothing was included merely because "this episode type usually has one" — every included candidate must independently clear Steps E and F. If a genuinely strong candidate for an expected family doesn't exist, the family is simply not represented in the final set; do not manufacture a weak one to fill it.

### Step I — Select, corroborate, and write

Select 5-7 (normally; see `docs/faq-intent-model.md` §7 for the below-5 and above-7 exception handling) using the ordering rule: lead with the strongest combined opportunity for this specific episode, not automatically the broadest-reach candidate.

**Before finalizing, run the corroboration sequence (`docs/faq-intent-model.md` §8) on the provisional finalists:** draft material claims from Episode evidence, identify externally verifiable claims, fetch claim-specific corroborating sources, mark each Supported/Contradicted/Qualified/Not found, flag any material conflict rather than silently resolving it, and finalize only after this review.

**Key Questions output format:**
```
### KEY QUESTIONS
*(Place at top of show notes - questions only, no answers)*

- [Question 1]?
[5-7 total, matching the FAQ questions below exactly in wording and order]
```

**FAQ rules:**
- Heading must be exactly **FREQUENTLY ASKED QUESTIONS** — no other label is acceptable (HR-29)
- Every Q line must match the exact syntax `**Q. Question text?**`: opening `**`, `Q.`, a space, the question text, then `?**` with no space before it. A missing opening or closing `**`, a missing `?`, or a single `*` instead of `**` all fail validation.
- Every A line must match the exact syntax `A. Answer text.`: no leading asterisks of any kind, `A.`, a space, non-empty text, and no trailing asterisks. `*A.`, `**A.`, and a trailing `**` after the answer text all fail validation, as does a blank answer.
- Each answer: usually 25-50 words, 60-word maximum unless Joe explicitly approves an exception, no minimum, never padded, front-loaded with the direct answer, Joe's conversational voice (contractions, plain English)
- Weave in specific details: ratings, tasting notes, which wine they finished — from Episode evidence
- Every answer must be useful to someone deciding whether to listen, buy, understand, or pair the wine
- No em-dashes anywhere (HR-1)
- No invented facts (HR-3)
- Every answer must trace to specific Episode evidence. External corroborating evidence may only verify or clarify an episode-covered fact (e.g. fixing a garbled name), never introduce new explanatory content the episode never covered, even if factually true. If a question can't be answered substantively from Episode evidence, cut or rework it instead of filling the gap with outside research.

**FAQ output format:**
```
### FREQUENTLY ASKED QUESTIONS
*(Place at bottom of show notes)*

**Q. [Question one]?**
A. [Answer one.]
[5-7 total pairs, matching Key Questions exactly in wording and order]
```

**Audit file:** Save the complete audit to `outputs/episodes/faq-audits/ep[N]-faq-audit.md` using the exact section headings from `docs/faq-intent-model.md` §10, verbatim: Episode Opportunity Frame, Owned-Evidence Check, Baseline Discovery Research, Extended Discovery Research, Episode-Evidence Ledger, Candidate Comparison, Provisional Claim / Corroboration Table, Final Selection, Rejection / Correction Notes, Approved Exceptions. Extended Discovery Research and the Provisional Claim / Corroboration Table headings are required even when the content is "not triggered" or "no external corroboration was required" — never omit the heading itself. **Approved Exceptions defaults to exactly `None.`** and is only populated when Joe has explicitly approved a count exception, an answer-length exception (above 60 words), or a research-freshness waiver — the matching entry (`Count exception approved by Joe: N questions — YYYY-MM-DD`, `Answer-length exception approved by Joe: N words — YYYY-MM-DD`, or `Research-freshness waiver approved by Joe: YYYY-MM-DD`) must be present whenever the corresponding override or waiver is in use. A command-line override flag alone never counts as approval — the audit entry is required regardless, and a run using an override without it fails validation. The validator checks for these exact headings, not a paraphrase. Include **the machine-readable block, numbered sequentially starting at 1:**
```text
<!-- FINAL_QUESTIONS_START -->
1. [Exact first question, matching Key Questions/FAQ exactly]?
2. [Exact second question]?
[one line per final question]
<!-- FINAL_QUESTIONS_END -->
```
Save this before returning output. The public episode file contains only the final Key Questions, FAQ, schema, and Bluesky posts — not the evidence ledger or candidate comparison.

---

## SECTION 3: SCHEMA MARKUP (generate only if requested)

Write this block under `### SCHEMA MARKUP`:

**Review Schema — one `<script>` block per wine reviewed:**
- `itemReviewed.name`: full wine name with vintage
- `offers.price`: exact price from episode data
- `reviewRating.ratingValue`: average of Joe and Carmela ratings as a string (e.g., both gave 8 → "8"; one gave 7, one gave 8 → "7.5")
- `reviewBody`: 2-3 sentences from the tasting notes — nose, palate, pairings, which wine they chose to finish. All from episode data only.
- `author`: Joe and Carmela
- `publisher`: The Wine Pair Podcast

**Do not generate FAQPage schema (HR-64).** Google stopped producing FAQPage rich results for general sites; new FAQPage schema is not written for any content going forward. The visible FAQ section itself (Key Questions and FAQ text) is still generated per Section 1+2 above — only the JSON-LD FAQPage markup is omitted.

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
- Posts 1-3: mix of angles — the episode hook, the value story, the ratings surprise. Only ONE of the three should carry the price/value angle — do not let the whole teaser set become a price comparison. The other two should focus on the main tension/hook and the ratings/verdict tease.
- Posts 4-10: interesting facts from the episode research (history, science, geography, production method, comparisons)
- No Wine in the News references anywhere (HR-27)
- No em-dashes anywhere (HR-1)
- Sound like a person, not ad copy. See HR-71 in full: write in first person ("we put X against Y," not "X went head-to-head with Y"); state specific facts directly instead of building a generic comparison setup first; use rounded, casual price references ($20, $35+) instead of exact decimals; do not center a post on a specific competing producer's name/backstory or call a comparison bottle "name-brand" (Costco/Kirkland is the standing exception).
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

**Anchoring rule (required, HR-68):** anchor every option to the episode's core tasting/verdict content — the wine(s), the hook, the ratings, the reaction. Never anchor to the Wine in the News segment; it's a recurring segment, not the episode's spine.

**Content rules:**
- Every question and option must be grounded in the actual episode data provided (hook, verdict, tasting notes, ratings) — no invented facts (HR-3).
- **The question itself must be one short sentence — this is Spotify's actual poll UI, not a scene-setting paragraph.** Do not stack a setup clause plus a question ("X does Y, evolving from A to B. Confession time, how long...?") — state the one grounding fact in as few words as possible, then ask. If it needs a rationale sentence to justify the setup, the setup is too long; cut it. This was corrected once already (Ep228): a two-clause, fact-heavy question was rejected as "WAYYYY" too long even though the underlying content and answer options were right.
- Options should be genuinely chooseable, not open-ended — a listener taps one in a couple seconds.
- Favor formats that have worked before: a pre-reveal prediction tied to the episode's own question, an honesty/confession angle (anti-snob brand), or a reaction/verdict-adjacent question.
- Binary (two-option) polls get the highest engagement of any poll format — default to two options unless a third is genuinely distinct and adds real value, not just more choices.
- **Answer options must stay under ~49 characters.** Spotify's own documentation does not publish an exact figure, but this was confirmed empirically on Ep228: "Years. I've got the patience to let it go the distance." (55 characters) was rejected by the live poll UI as roughly 6 characters too long, putting the real cap at approximately 49. Target answer options at 45 characters or fewer to stay safely under this. Count every candidate answer before presenting it, the same way Bluesky posts are character-counted (HR-26).
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
9. FAQ grounding: for each Q&A pair, name the specific Episode evidence the answer draws from (a tasting note, a dialogue line, a rating, a host opinion or verdict). External corroborating evidence may confirm a spelling, date, or detail already stated in the episode — it may never be the source of an answer's substantive content. If any answer draws only from general wine knowledge or research-link content not present in the episode data, replace or rework that Q&A pair before returning.
10. FAQ narrative gate: confirm FAQ answer lines (`A.`) contain none of these case-insensitive phrases: "In this episode", "On this episode", "Joe says", "Joe points out", "Carmela says", "we tasted", "we got", "we chose", "why we did this episode", "on the show", "our episode". If any are present, rewrite before returning.
11. FAQ word count: count words in every `A.` line. Confirm each is within the usual 25-50 word range or, if longer, does not exceed the 60-word maximum (unless Joe has explicitly approved an exception). Confirm no answer was padded to reach a minimum.
12. FAQ/Key Questions match: confirm the Key Questions list and the FAQ question list are identical in wording and order, and both match the audit file's `FINAL_QUESTIONS` block exactly.
13. FAQPage schema: confirm no FAQPage schema block was generated anywhere in the output.
14. If POLL requested: confirm every option is anchored to core tasting/verdict content, not Wine in the News. Confirm each poll has 2-4 answer options. Confirm no em-dashes. Confirm every question/option traces to actual episode data provided (no invented facts).

Report: "Self-check complete. [N] issues found." then list any issues. Fix all issues before returning.

---
