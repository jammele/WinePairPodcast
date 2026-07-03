# FAQ Intent Model

This file defines the rules used by the FAQ generation pipeline to select, score, and finalize candidate questions. It must be read before any FAQ generation run. It replaces ad-hoc judgment about which questions to include.

---

## 0. Evidence types, anti-mislabeling rules, and C1 preflight

### 0.1 — Evidence type definitions

**I (Internal):** Evidence from episode-created materials only. Includes: episode title, hook, script text, transcript, tasting notes, prices, host ratings, verdicts, host preferences, pairings, and central discussion topics. Research links listed in the script are **source pointers only** — they are not I evidence. They become C2 evidence once fetched and read. I evidence requires no fetch or search.

**C2 (Fetched page):** Evidence from fetching a specific URL. The URL may come from search results, episode research links, or other known sources. Requires: URL fetched, page title, key phrases observed, and framing observed. C2 confirms what a page says. It does **not** confirm how real users search or what questions they ask.

**C1 (Search result):** Evidence from a live web search query. Requires all four of: (1) exact query string, (2) observed result titles and snippets, (3) URLs of results, and (4) date observed. C1 is the only valid evidence type for confirming that real users phrase a question in a particular way.

### 0.2 — Anti-mislabeling rules

These rules are non-negotiable:

1. Do not label C2 evidence as C1. Fetching a known URL is C2. Running a query string and observing result titles and snippets is C1.
2. A scoring cell cannot claim C1 support unless it cites a C1 evidence ID.
3. On web-triggered episodes: plausibility 3 requires at least one C1 evidence ID. C2 evidence alone caps plausibility at 2. I evidence alone caps plausibility at 1.
4. Research links listed in the episode script are source pointers only. They are not I evidence. They become C2 when fetched.

### 0.3 — C1 capability preflight

The preflight is **only run when C1 is determined to be required** by trigger rules (Section 5). Do not run it for non-triggered episode types.

Order of operations:
1. Classify episode type (Step A).
2. Determine whether C1 is required by trigger rules (Step B.1).
3. **If C1 is required:** run this preflight — state the specific tool or command that will perform live web searches; confirm it can return (a) exact query string, (b) observable result titles and snippets, (c) URLs of results, and (d) date observed.
4. **If C1 is required and the tool cannot produce all four outputs:** C1 is unavailable — stop before any candidate generation.
5. **If C1 is not required:** state "C1 not required for this episode type." Proceed with I and C2 evidence. Do not run the preflight.
6. **If C1 is optional** (phrasing is uncertain for a non-triggered episode): state "C1 used optionally — [reason]." Run the preflight for that optional use only. If unavailable in the optional case, continue without C1.

URL fetch, reading known links, repo search, file search, and local grep are **not C1** regardless of episode type.

### 0.4 — Labeled-inference rule

Inference is not banned. Unsupported inference is banned.

Inference is allowed only when it is:
- Explicitly labeled as inference
- Tied to at least one specific evidence ID

Example of valid inference: `2 — Inference from I-3 and I-4: the episode compares both wines directly, but no C1 evidence confirms this exact search phrasing.`

Inference without evidence IDs cannot justify a score and must be replaced or scored lower.

---

## 1. Default priority ranking by intent type

When multiple candidates score similarly, prefer questions that serve higher-priority intents.

1. **Buy / skip / is it worth buying** — highest priority; directly serves listener action
2. **Comparison / which is better / which should I choose** — serves listener choice when multiple wines are reviewed
3. **Taste / style / sweetness / body / tannin / acidity** — serves listener expectation-setting
4. **Food pairing / serving / aging** — practical decision support
5. **Region / grape / style education** — discovery and context for the episode's main hook
6. **Producer / retailer / private-label provenance** — relevant when sourcing is a listener trust question (Costco, Trader Joe's, Aldi, mystery bottlers)
7. **History / trivia / technical production details** — lowest priority; rarely earns a slot unless it is the episode's central hook

---

## 2. Episode type rules

### Standard two-wine review

**Required candidate families:**
- Taste/style (one candidate may cover both wines)
- Buy/skip verdict
- Pairing or serving

**Conditional candidate families:**
- Comparison/which is better: include only if the wines are meaningfully positioned against each other in the episode (same retailer, appellation pair, style competition, or explicit host choice)
- Producer/provenance: include only if the wines are private-label, Costco, Trader Joe's, Aldi, a mystery producer, or the bottler is a notable or surprising name
- Region/grape education: include only if it supports the main episode hook (e.g. "what is this appellation?" is useful if the appellation is unfamiliar; generic wine education is not)

**Disfavored:**
- Technical production details not discussed in the episode
- Historical trivia not central to the episode
- Generic wine encyclopedia questions applicable to hundreds of episodes
- Questions included only to balance wine mentions (artificial symmetry)

---

### Costco / private-label review (Kirkland Signature, Trader Joe's, Aldi, etc.)

This episode type has boosted and downgraded families.

**Boosted families (score these first):**
- Is it worth buying?
- Which bottle should I buy? / Which one is better?
- What does it taste like?
- Who makes it / who bottles it?
- Is it a good value?
- Why is it cheaper than comparable wines from this appellation?

**Downgraded families:**
- Broad appellation history not directly relevant to the buying decision
- Technical trade-system explanations (négociant, en primeur, courtier) unless the whole episode is about how Costco sources wine
- Appellation trivia that does not explain value or help the buying decision

**Web search is mandatory for this episode type** (see Section 5).

---

### Grape explainer

**Required families:** What is this grape? What does it taste like? What food pairs with it? Where does it grow? Is it worth trying?

**Disfavored:** Product-specific buy questions (no specific wine reviewed), private-label provenance.

---

### Region explainer

**Required families:** What is this region? What are the wines like? What are the best producers or values? What food pairs with them?

**Disfavored:** Same as grape explainer.

---

### Comparison episode (explicit A vs. B format)

**Required families:** Which is better? How do they differ in taste? Which is the better value? What food pairs with both?

**Conditional:** Buy verdict for each wine separately only if the verdicts differ sharply.

---

### Interview episode

**Required families:** Who is the guest and why do they matter? What is their main insight or recommendation? What wine did they discuss?

**Disfavored:** All standard review families (no wines are rated).

---

### Minisode / bonus episode

No standard FAQ required unless the episode reviews a wine. Apply the review rules if wines are discussed; otherwise apply the episode-specific topic rules.

---

## 3. Scoring rubric

Each candidate question is scored on six criteria, 0-3 each. Maximum score: 18. Threshold to qualify: **13 or higher**. A score of **0 in any of these three dimensions auto-fails the candidate:** listener/search plausibility, answer grounding, audience vocabulary.

Every score must include a one-line evidence note citing a specific, observable source. Scores without evidence notes are not valid.

---

### Criterion 1: Listener / search plausibility

Does a real buyer, listener, or wine-searcher actually phrase a question this way?

| Score | Criteria |
|---|---|
| 0 | No normal buyer or listener would phrase this question. Jargon or insider framing. No clear search behavior exists for this phrasing. |
| 1 | Plausible only for a niche wine-expert or trade audience. Side curiosity at best. |
| 2 | Plausible long-tail question in plain language, but not obviously central to search demand. No external validation available. |
| 3 | Highly natural buyer/listener/search question tied to product review, buying decision, comparison, taste, pairing, or producer identity. **On web-triggered episode types, a score of 3 requires external web evidence** — a search result title, snippet, repeated phrase from a review page, or forum language confirming real users frame the question this way. Without web evidence on a triggered episode type, the maximum score for this criterion is 2, unless the question is directly stated or obviously implied by the episode title and show format. |

---

### Criterion 2: Listener usefulness

Does the answer help the listener take an action or make a decision?

| Score | Criteria |
|---|---|
| 0 | Does not help the listener do anything. |
| 1 | Interesting background only. No decision value. |
| 2 | Helps the listener understand the wine, region, label, or episode topic. |
| 3 | Directly helps the listener buy, skip, choose between wines, pair, serve, age, or decide whether they will enjoy the wine. |

---

### Criterion 3: Episode centrality

How central is this topic to the actual episode?

| Score | Criteria |
|---|---|
| 0 | Not actually part of the episode. |
| 1 | Mentioned briefly or appears only in research background notes, not in the main discussion. |
| 2 | Meaningful supporting topic discussed in the episode. |
| 3 | Central to the episode title, hook, tasting verdict, host ratings, main discussion, or explicit conclusion. |

---

### Criterion 4: Specificity

Is this question specific to this episode, or generic wine content?

| Score | Criteria |
|---|---|
| 0 | Unrelated to the episode, or too broad to be useful. |
| 1 | Generic wine education question that could apply to hundreds of episodes. |
| 2 | Specific to the grape, region, retailer, or wine style discussed in this episode. |
| 3 | Specific to the actual reviewed wines and listener decision in this episode. |

---

### Criterion 5: Answer grounding

Can the answer be directly supported by episode materials or cited external sources?

| Score | Criteria |
|---|---|
| 0 | Cannot be answered from episode notes, transcript, ratings, or reliable external sources. |
| 1 | Weakly supported or inferential. |
| 2 | Supported by episode notes, research links, or fetched external sources. |
| 3 | Directly supported by host ratings, verdicts, tasting notes, prices, episode transcript, or explicitly cited research from the evidence table. |

---

### Criterion 6: Audience vocabulary

Does the question use language a normal listener or buyer would actually use?

| Score | Criteria |
|---|---|
| 0 | Uses wine-trade or technical jargon the audience is unlikely to search. Examples: "négociant," "en primeur," "terroir" (as a standalone topic), "assemblage," "élevage." |
| 1 | Uses technical language without plain-language framing. May confuse a normal listener. |
| 2 | Mostly plain language with one unavoidable wine term that is explained in the answer. |
| 3 | Entirely natural listener/search language. A person who knows nothing about wine would understand the question and recognize it as their own. |

---

## 4. Penalty table

Apply penalties after the base score is calculated.

| Penalty | When to apply |
|---|---|
| -3 | Minor trivia masquerading as a FAQ (back-label detail, production footnote, historical sidebar) |
| -3 | Uses wine-industry language instead of listener language |
| -3 | Duplicates another candidate (same listener need, different wording) |
| -2 | Included only to balance wine mentions (artificial symmetry) |
| -2 | Included only to reach the 7-question count (slot-filling) |
| -2 | Generic wine encyclopedia content with no episode-specific hook |
| -2 | Not aligned with the episode's show promise or main listener job |
| -1 | Interesting but not decision-useful |

---

## 5. Web search trigger rules

Web search is **mandatory** (not optional, not a manual suggestion) when the episode involves any of:

- Costco / Kirkland Signature wines
- Trader Joe's / Charles Shaw / private-label wines
- Aldi / private-label wines
- Any current or recent vintage in a product-review context
- Producer or bottler identity questions ("who makes this?")
- A term or phrase where the model is uncertain whether real buyers use that phrasing
- Any specific commercial product where existing reviews or buyer discussions may exist online

**If web search is triggered and the agent cannot perform web search: stop. Report "Objective FAQ scoring cannot be completed for this episode type — web search is required but unavailable." Do not generate candidates or proceed to scoring.**

### Required web search query set (Costco/private-label review)

Perform all of the following query types and record results:

1. `[wine name] review` (e.g. "2023 Kirkland Signature Pauillac review")
2. `Kirkland [appellation] Costco` or equivalent retailer + wine phrasing
3. `Costco [wine name] [vintage year]`
4. `who makes Kirkland Signature [wine]` or `who bottles Kirkland [wine]`
5. `[appellation A] vs [appellation B]` (for comparison episodes)
6. Any product-specific variation implied by the episode title

For each query, record: query string, result titles and snippets observed, repeated phrases across results, source types (review site, forum, retailer page, blog), and what listener intent each result implies.

---

## 6. Combined vs. separate vs. comparison buy question rules

**Use a combined buy question** ("Are both wines worth buying?" or "Are the Kirkland Pauillac and Saint-Julien worth buying?") when:
- The episode title or hook presents the wines as a group
- The wines share a retailer, category, or theme
- Both verdicts are similar (within 1 point)
- Separate buy questions would produce repetitive answers
- Searchers are likely to phrase the question around the group ("Costco Bordeaux," "Kirkland Bordeaux")

**Use separate buy questions** when:
- One wine has significantly higher individual search demand
- Verdicts differ sharply (2+ points apart, or one is a skip)
- The wines are unrelated except for appearing in the same episode
- The answers would be materially different and a combined answer would mislead

**Use a comparison / which is better question** when:
- The episode creates a real, explicit choice between the wines
- The wines share a category, retailer, grape, region, price point, or theme
- The hosts explicitly compared and chose between them
- A combined answer helps someone choose

**Do not use any of these as a mechanical rule based on wine count alone.** The decision must follow from the listener job and the episode structure.

---

## 7. Tie-breaker order

When multiple candidates score above 13, use this priority order:

1. Higher listener usefulness wins
2. Higher listener/search plausibility wins
3. Higher episode centrality wins
4. Better alignment with episode title and hook wins
5. Better answer specificity wins
6. Avoid duplicate answer coverage
7. Prefer buyer/listener language over wine-school language

---

## 8. Evidence requirement

**A score is objective if and only if the evidence note could be handed to another person and they could independently verify it.**

**Evidence IDs are mandatory.** Every row in the evidence ledger must carry an ID: `I-N` for internal evidence, `C1-N` for search-result evidence, `C2-N` for fetched-page evidence. Every scoring cell must cite at least one evidence ID.

**Scoring cell format:** `[score] — [evidence ID(s)]: [one-sentence rationale explaining why the cited evidence supports this score]`

Acceptable scoring cells:
- `3 — C1-2, C2-1: C1-2 shows result titles using "Kirkland Signature Pauillac review"; C2-1 is a fetched review page with buy/value framing in the opening paragraph.`
- `0 — C1-4: C1-4 search on "who makes Kirkland Saint-Julien" returns results using plain language like "who makes" and "who bottles" — not "négociant." Vocabulary criterion auto-fails.`
- `2 — I-3: transcript reference places négociant mention only in a research note, not in the main tasting discussion.`
- `2 — Inference from I-3 and I-4: episode compares both wines directly, but no C1 evidence confirms this exact search phrasing.` *(labeled inference — allowed)*

Not acceptable:
- `3 — C1-2` (score and ID present but no rationale)
- `3 — I believe people would search this` (no evidence ID, unsupported inference)
- `2 — seems plausible` (no evidence ID)
- `1 — probably niche` (no evidence ID)

---

## 9. Required audit template

Every FAQ run must produce an audit file at `outputs/episodes/faq-audits/ep[N]-faq-audit.md`. The file must match the structure below. Do not omit any section.

---

### Audit file header (required)

The file must open with these fields:

    # FAQ Audit — Ep[N]: [Episode Title]
    
    Date: [YYYY-MM-DD]
    Episode type: [per Section 2 of this file]
    Web search triggered: [Yes — [trigger condition] / No]
    C1 status (use exactly one):
      C1 required and completed
      C1 required but unavailable — scoring blocked
      C1 not required for this episode type
      C1 used optionally — [reason]

If C1 status is `C1 required but unavailable — scoring blocked`: stop here. Do not proceed to candidate generation.

---

### Evidence ledger — Section I: Internal evidence

*(Episode-created materials only: title, hook, script, transcript, tasting notes, prices, host ratings, verdicts, pairings, host preferences, central discussion topics. Research links are source pointers only — do not list them here. They become C2 once fetched.)*

| ID | Evidence type | Finding | Source (episode file section) |
|---|---|---|---|
| I-1 | ... | ... | ... |

---

### Evidence ledger — Section C1: Search-result evidence

*(Exact query strings and observed results only. URL fetch, reading known links, and local search are not C1.)*

This section must open with one of the four C1 status labels:
- `C1 not required for this episode type` — section contains only this line; table may be omitted.
- `C1 used optionally — [reason]` — include results if available; note unavailable if not.
- `C1 required but unavailable — scoring blocked` — section contains only this line; no table follows; stop here.
- `C1 required and completed` — proceed with table below.

| ID | Exact query | Result title observed | Snippet/text observed | URL of result | Date observed |
|---|---|---|---|---|---|
| C1-1 | ... | ... | ... | ... | ... |

---

### Evidence ledger — Section C2: Fetched-page evidence

*(Records what fetched pages say. Does not confirm search intent.)*

| ID | URL fetched | Page title | Key phrases and framing observed |
|---|---|---|---|
| C2-1 | ... | ... | ... |

---

### Candidate scoring table

Each scoring cell format: `[score] — [evidence ID(s)]: [one-sentence rationale]`
A cell with score and ID but no rationale is not valid.

| Candidate question | Plausibility | Usefulness | Centrality | Specificity | Grounding | Vocabulary | Penalties | Total | Pass? |
|---|---|---|---|---|---|---|---|---|---|

---

### Rejection log

| Candidate | Score | Specific rule violated |
|---|---|---|

---

### Final selection log

| Rank | Question | Score | Tie-breaker applied (if any) |
|---|---|---|---|

---

*Last updated: 2026-07-03 — updated with evidence type definitions (Section 0), evidence ID + rationale scoring format (Section 8), and required audit template (Section 9)*
