# FAQ Intent Model

This file defines the rules used by the FAQ generation pipeline to select, score, and finalize candidate questions. It must be read before any FAQ generation run. It replaces ad-hoc judgment about which questions to include.

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

Acceptable evidence notes:
- "3 — costcowineblog.com review page title uses 'Kirkland Signature Pauillac review'; opening paragraph addresses buying decision directly"
- "0 — 'négociant' is wine-trade language; web search for 'who makes Kirkland Saint-Julien' returns results that do not use this term"
- "2 — episode centrality: négociant mention appears only in a research note, not in the main tasting discussion (transcript reference: back-label section)"

Not acceptable:
- "3 — I believe people would search this"
- "2 — seems plausible"
- "1 — probably niche"

---

*Last updated: 2026-07-03 — initial version based on ChatGPT architecture review and session 28 process audit*
