# FAQ Intent Model

This file defines the rules used by the FAQ generation pipeline to select and finalize candidate Key Questions and FAQ answers. It must be read before any FAQ generation run. It replaces ad-hoc judgment about which questions to include, and it replaces the prior six-criterion numerical scoring system entirely — no replacement numerical score is used.

---

## Guiding principle — read this before generating anything

The purpose of Key Questions and FAQ content is to help the episode become discoverable and persuasive to new listeners across web search, AI-assisted discovery, and listener usefulness and conversion, not to summarize the episode for people who already found it.

**Neither broad nor narrow scope wins automatically.** Scope strength is topic-specific, decided from evidence, not from a fixed rule:
- A broad category question (grape, region, style, comparison) may be the stronger entry point for an obscure product with no independent search demand.
- A recognized brand or retailer (Kirkland Signature, Costco, Trader Joe's, a well-known label) can carry substantial independent demand on its own — a question about the specific product is not automatically weaker than a category question in that case.
- Where no topic-specific evidence exists either way, say so. Do not default to "broad is safer" or "narrow is more specific" as a substitute for evidence.

**Do not claim that FAQ formatting, question wording, named entities, or any particular answer structure guarantees search ranking, AI retrieval, citation, or listener growth.** Every discovery-purpose label used below is a reasoned classification, not a performance promise, unless `docs/faq-research-reference.md` documents measured evidence for that specific claim.

**Anti-slot-filling standing note:** the final question count is whatever genuinely clears the bar. If a session lands on the same count repeatedly, or a family is included only because the episode type "usually has one," that is a warning sign worth flagging in the audit, not a pattern to protect silently.

---

## 0. Evidence categories — keep these distinct, never collapse them

Every piece of evidence used in a FAQ run belongs to exactly one of these categories. A candidate's record and the audit must label each cited fact with its category.

| Category | Definition | What it can establish | What it cannot establish |
|---|---|---|---|
| **Owned evidence** | Topic-specific Google Search Console queries/pages for this wine, grape, region, or brand; relevant prior-episode evidence; the site-wide GSC intent-cluster priors in `docs/faq-research-reference.md` | That people have already searched and reached Wine Pair content on a related topic | Universal demand; that any specific FAQ question caused those impressions or clicks; that a click became a podcast play |
| **Observed current-search evidence** | Results from a live search run this session (baseline or extended discovery research) — result titles, snippets, URLs, retrieval date | Current content supply, plausible vocabulary, comparison frames, and topics worth investigating | Search volume, exact user phrasing, real listener demand, AI-retrieval likelihood, or conversion |
| **Episode evidence** | Script/transcript content: facts discussed, tasting observations, comparisons, explanations, serving/pairing advice, host opinions and disagreements, ratings, preferences, buying verdicts | Answer substance — this is the only category that may supply factual substance for a public FAQ answer | Whether the claim is true outside the episode, or whether it has any search/discovery value on its own |
| **External corroborating evidence** | A current, claim-specific fetched source supporting a particular externally verifiable statement already made in the episode (a spelling, a date, a technical term, a geographic fact, a producer identity) | That an episode-covered claim is independently confirmed | New explanatory content — corroboration never supplies substance the episode didn't already state |
| **Proposed discovery purpose** | An assigned label (web-search / AI-assisted / conversion) explaining why a candidate might work | A reasoned hypothesis for why the question was generated | Nothing on its own — must be marked as interpretation unless `docs/faq-research-reference.md` documents measured support |
| **Interpretation or hypothesis** | Reasoning that connects evidence to a conclusion without being evidence itself | A stated judgment call, visible for review | Should never be presented as if it were evidence |
| **Evidence gap** | An explicit statement that no evidence of a given type was found or collected | That the absence was checked for and is being reported honestly | Should never be silently omitted or converted into "no demand exists" |

**Anti-mislabeling rules (non-negotiable):**
1. A live search this session is Observed current-search evidence. Reading a known URL is External corroborating evidence. Never label one as the other.
2. Owned evidence (GSC priors, topic-specific query data) is stronger than Observed current-search evidence for demand — cite it first when it exists, and say explicitly when it doesn't.
3. A Proposed discovery purpose is never itself evidence of anything. It must be traceable to Owned, Observed, or Episode evidence, or explicitly marked as unsupported interpretation.
4. Absence of evidence is recorded as an Evidence gap, never restated as "no demand exists" or "this producer lacks search demand."

---

## 0-bis. Freshness check — before owned-evidence and candidate work, every run

Before the owned-evidence check (§1) or any candidate generation:
1. Read `Last substantively verified` at the top of `docs/faq-research-reference.md`.
2. Determine its age in days from today.
3. If older than 30 days: stop before proceeding, unless Joe explicitly approves a one-run waiver for this specific episode. A waiver covers this run only — it does not extend the reference's own freshness for future runs.
4. Record the freshness check (the date checked, the age found, and any waiver granted) in this episode's FAQ audit. Do not silently update `docs/faq-research-reference.md` itself during an episode run — that file is only ever updated by an explicit substantive-review pass (see its own "What updates this file" note).
5. If, in the course of this run's own research, a material Google, Bing, search-behavior, or AI-discovery change is found that the reference doesn't yet reflect, stop and propose the finding to Joe and local ChatGPT before changing any production rule on the strength of it. Note the finding in the audit; do not act on it unilaterally.

## 1. Owned-evidence check — before any external research

Before running any live search, check what's already owned, in this order:

1. **Topic-specific owned query data.** The current owned query export is `C:\Users\jamme\Downloads\gsc_data_temp\Queries.csv` (columns: Top queries, Clicks, Impressions, CTR, Position; the file's own `Filters.csv` states the dataset's search type and date window — record that window when citing it). Search the `Top queries` column for reasonable variations of this episode's wine, grape, region, brand, retailer, and central comparison terms. For every match, record: the matching query text, clicks, impressions, CTR, position, and the dataset's scope/window. Distinguish an **exact-topic match** (the query names this episode's actual wine/grape/region/brand) from an **adjacent-topic match** (related but not the same subject) — label which one it is. If no topic-specific match exists, record "no topic-specific owned query found" explicitly rather than substituting the site-wide priors as if they were topic-specific. Do not ask Joe for this data when the file is accessible — check it directly. If the file is unavailable, record that access gap explicitly and proceed using only the properly labeled site-wide priors and Observed current-search evidence; never fabricate a topic-specific result.
2. Relevant prior episode evidence — has Wine Pair covered this or an adjacent topic before, and what was learned.
3. The site-wide GSC intent-cluster priors in `docs/faq-research-reference.md` (Serving/chilling, Comparisons, Verdict/worth/buying, Identity/origin, Price/value, Taste/style, Pairing) — **background priors only**, used only when no topic-specific match exists.

Topic-specific owned evidence always outranks the site-wide priors when both exist. The site-wide priors are a background signal about what the site's existing coverage already draws search traffic for — not proof of universal demand, not proof that FAQ content caused any impression or click, and not proof that a click became a play. Do not infer universal demand or FAQ causation from either the topic-specific query data or the site-wide priors.

Do not treat a past episode's performance as proof that a particular question or FAQ answer caused that performance.

---

## 2. Research depths — baseline (every episode) and extended (conditional)

Live search-result evidence is real evidence (Observed current-search evidence, §0), so "not required" never means "no research was performed." Two depths:

### Baseline discovery research — required every episode, no exceptions

Run 2-4 searches chosen from *this episode's actual listener opportunities* — not a fixed weekly formula of "review / taste / comparison / buy" repeated identically every week.

Record for each query:
- **Topic opportunity investigated** — the specific episode-relevant subject the query targets (e.g. "whether this grape's taste profile is already well-covered online").
- **Reason the query was selected** — one line, tied to this episode's actual content, not a template.
- **Observed current-search evidence** — exact query string, retrieval date, representative result titles/snippets, URLs.
- **Limitation** — what this observation does not establish (see the standing caution below).

Keep this separate from **Proposed discovery purpose**, assigned later per candidate (§5): web-search discovery, AI-assisted discovery, or listener usefulness/conversion. A live search investigates a topic opportunity and observes current content supply — it is never itself a test of AI retrieval, listener conversion, or search volume, and must never be described as one. The discovery-purpose label is interpretation unless `docs/faq-research-reference.md` documents measured evidence for that specific claim.

**Standing caution:** search results show current content supply, vocabulary, and comparison framing. They do not prove search volume, exact user phrasing, actual listener demand, AI-retrieval likelihood, conversion, or performance.

### Extended discovery research — conditional

Run a deeper query and source review when justified by one or more of:
- a recognized brand or retailer
- a buying, value, or provenance question
- ambiguous product or producer identity
- uncertain terminology
- a contested, technical, or changing claim
- another documented, episode-specific reason

Record the trigger and the additional evidence collected. If extended research is triggered but unavailable, stop — do not generate or score candidates that depend on it.

### Audit status line (replaces the old four-value "C1 status")

Use exactly one:
```
Baseline discovery research completed — extended research not triggered
Baseline and extended discovery research completed
Baseline research unavailable — FAQ selection blocked
Extended research required but unavailable — FAQ selection blocked
```

---

## 3. Episode type families are candidate prompts, not reserved slots

The lists below (grape explainer, region explainer, Costco/private-label, comparison, interview, standard two-wine review) are starting points for candidate generation, never a guaranteed final slot. A guest-identity question is not automatically included because the episode is an interview; a taste question is not automatically included because the episode is a review. Every family-prompted candidate must still clear the eligibility gates (§4) and the qualitative assessment (§5) on its own merits.

### Standard two-wine review — candidate prompts
Taste/style at the grape or appellation level; region/grape education tied to the episode's hook; pairing or serving; buy/skip or which-is-better on the specific bottles (capped, see below); comparison to a more famous reference point; producer/provenance when the wines are private-label or a notable/surprising name.

### Costco / private-label review — candidate prompts (branded/retail exception)
Is it worth buying; which one is better; what does it taste like; who makes/bottles it; is it a good value; why is it priced the way it is (episode-covered price facts only — never an externally-sourced business-model explanation the episode didn't state). Extended research is required for this episode type (§2).

### Grape explainer / region explainer — candidate prompts
What is it; what does it taste like; what food pairs with it; where does it grow/what's the region like; is it worth trying.

### Comparison episode (explicit A vs. B) — candidate prompts
Which is better; how do they differ in taste; which is the better value; what pairs with both; separate buy verdicts only if verdicts differ sharply.

### Interview episode — candidate prompts
Who is the guest and why they matter; their main insight or recommendation; what wine they discussed. None of these are guaranteed a slot — each competes with every other candidate on the same terms.

**SKU-specific guardrail (not a formula):** for a standard boutique-bottle review with no independent product demand, no more than one final selected question may be specifically about the exact bottles reviewed, and it should not lead the list. This cap does not apply to a Costco/private-label/branded-product episode, where the product itself is the search term.

**Duplicate listener jobs:** "Is this category worth trying?" and "Are these exact bottles worth buying?" can substantially overlap. Prefer the version with greater plausible reach unless the specific product has independent demand evidence.

---

## 4. Eligibility gates (pass/fail, not scored)

A candidate must pass all of the following before it can be assessed for selection. No numeric score is attached to this step.

1. **Episode grounding.** Answerable substantively from Episode evidence.
2. **Plausible listener usefulness.** A real person could plausibly ask this and get something useful from the answer.
3. **Understandable language.** No unexplained jargon a normal listener wouldn't recognize.
4. **Non-fabrication.** No invented facts.
5. **Not a duplicate listener job.** Does not perform the same job as another already-eligible candidate with different wording.

A candidate failing any gate is out, with a one-line reason logged in the audit's rejection notes.

---

## 5. Qualitative assessment (replaces the six-criterion score, the 18-point total, the 13-point threshold, and the penalty table)

For each eligible candidate, record — qualitatively, no numeric total:

- **Demand and web-search opportunity.** Owned evidence, Observed current-search evidence, or an explicit Evidence gap. Cite specifically; never infer volume from a single search.
- **Listener usefulness and conversion.** How it ties to the confirmed title, the episode hook, a comparison, tension, or recognizable context. The title and hook are conversion *evidence* here, not a requirement that every title phrase become a question.
- **Distinctive episode-grounded answer.** What Joe/Carmela can say from Episode evidence that a generic source can't, naming which evidence it draws from.
- **Proposed discovery purpose(s):** web-search / AI-assisted discovery / listener conversion (one or more), labeled as interpretation unless `docs/faq-research-reference.md` documents measured support for that specific mechanism.

A selected question should normally be strong in at least two of the three jobs (demand, conversion, distinctive answer). This is a qualitative judgment call, recorded with reasoning and evidence citations — not a number, and not a replacement scoring system.

---

## 6. Combined vs. separate vs. comparison buy question rules

**Use a combined buy question** when the episode presents the wines as a group, they share a retailer/category/theme, verdicts are similar (within 1 point), separate questions would be repetitive, or searchers are likely to phrase the question around the group.

**Use separate buy questions** when one wine has significantly higher individual demand, verdicts differ sharply (2+ points, or one is a skip), the wines are otherwise unrelated, or a combined answer would mislead.

**Use a comparison/which-is-better question** when the episode creates a real, explicit choice between the wines, they share a category/retailer/grape/region/price point/theme, the hosts explicitly compared and chose, or a combined answer helps someone choose.

Do not apply any of these mechanically based on wine count alone — follow the listener job and the episode's actual structure.

---

## 7. Selection, ordering, and count

- Generate no more than 8-12 genuinely distinct candidates. Stop sooner once the plausible space for this episode is represented. Do not generate multiple candidates that perform the same listener job with different wording.
- Normally select 5-7 questions. No target within that range. Never pad the set to reach 5 or 7.
- If fewer than 5 candidates genuinely clear the eligibility gates and perform well on at least two of the three jobs, stop and present the smaller set to Joe with a concise explanation, rather than lowering the standard. Joe may explicitly approve an exception outside 5-7.
- **Order by the strongest combined listener-growth opportunity for this specific episode** — considering topic-specific demand evidence, the title/hook as conversion evidence, conversion potential generally, and the distinctiveness/usefulness of the grounded answer. This is not an automatic "broadest reach leads" rule; a narrower, title-aligned question can legitimately lead if its combined case is genuinely stronger for this episode.
- Key Questions and FAQ questions must match exactly in wording and order.

---

## 8. Corroboration sequence — episode coverage controls answer substance

Every substantive statement in a public FAQ answer (facts, explanations, comparisons, tasting observations, serving/pairing advice, opinions, ratings, disagreements, verdicts) must come from Episode evidence. External research must never introduce a factual explanation, context, claim, or conclusion the episode didn't cover, even when true and relevant.

For provisional finalist questions, before finalizing:
1. Draft the material claims each answer would contain, from Episode evidence only.
2. Identify which of those claims are externally verifiable.
3. Fetch current, claim-specific corroborating sources for each — a general page about the wine/grape/region/producer is not sufficient unless it actually substantiates the particular statement made. One authoritative source may support multiple related claims.
4. Mark each externally verifiable claim: Supported / Contradicted / Qualified / Not found.
5. If research contradicts, qualifies, or fails to support an episode-covered claim: do not silently publish it, do not silently replace it with the external version, do not blend in additional external material. Flag the discrepancy for Joe.
6. Finalize the question and answer only after this review.

**Source priority for corroboration:**
1. Primary and official sources
2. Authoritative institutional, academic, industry, or producer sources
3. Reputable specialist publications
4. Lower-authority sources only when necessary, explicitly labeled as such

Host tasting observations, preferences, ratings, disagreements, and verdicts require Episode evidence only — no external corroboration.

---

## 9. Answer requirements

- Front-load the direct answer in the opening sentence.
- Usually 25-50 words; 60-word maximum unless Joe explicitly approves an exception; no minimum; never pad to hit a length target.
- Make sense without surrounding episode context (standalone).
- Identify the subject clearly and unambiguously when necessary — this serves both a human skimming a search result and an AI system retrieving the answer without missing context.
- Preserve Joe and Carmela's actual observations, comparisons, disagreements, recommendations, and verdicts — this is what differentiates the answer from generic reference content.
- Avoid unsupported generic encyclopedia content with no episode-specific hook.
- Avoid podcast-recap framing ("In this episode," "we tasted," "Joe says," etc. — full list in `docs/house-rules.md` HR and the validator's banned-phrase check).
- No em-dashes (HR-1). No invented facts (HR-3).

Distinctive firsthand content is supported by current Google guidance as useful, original, first-hand content (`docs/faq-research-reference.md`). This is not a claim that it guarantees AI citation or retrieval — see that file's explicit classification of each finding.

---

## 10. Required audit template (condensed)

Every FAQ run produces an audit file at `outputs/episodes/faq-audits/ep[N]-faq-audit.md`. **Use these exact section headings, verbatim, as shown** — the validator checks for these exact headings, not a paraphrase. Each heading may be any markdown level (`###` is the default), and content may follow the heading text on the same line (e.g. a colon and episode name), but the required phrase itself must appear at the start of the heading line unchanged.

```markdown
### Episode Opportunity Frame
[episode type, hook, one-paragraph statement of the dominant listener opportunity]

### Owned-Evidence Check
[topic-specific findings per §1, or an explicit gap statement, plus the relevant site-wide priors if cited]

### Baseline Discovery Research
[queries, topic opportunity investigated, reason selected, observed current-search evidence, limitation — per §2]

Research reference checked: YYYY-MM-DD
Reference age: N days
Freshness status: Current
Material guidance change found: No

These four fields are required, exact format, every run (per §0-bis). If a one-run waiver was granted, replace the third line with `Freshness status: Joe-approved one-run waiver` and add a fourth line `Freshness waiver approved by Joe: YYYY-MM-DD` immediately after it. If this run's research surfaced a material guidance change not yet reflected in `docs/faq-research-reference.md`, replace the fourth (standard) line with `Material guidance change found: Yes — production review blocked` — this blocks production use of this run's FAQ content until Joe and local ChatGPT review the finding.

### Extended Discovery Research
[if triggered: trigger reason and findings. If not triggered, this heading must still be present — write: "Not triggered for this episode."]

### Episode-Evidence Ledger
[I-numbered rows: evidence type, finding, source location]

### Candidate Comparison
[for each of the 8-12 candidates: eligibility gate result; if eligible, the qualitative record from §5 (demand, conversion, distinctive answer, proposed discovery purpose); if rejected, a one-line reason]

### Provisional Claim / Corroboration Table
[table columns, exact labels: Episode evidence | Corroborating Source | Support Status | Conflict or Qualification. If no externally verifiable claims exist among the finalists, this heading must still be present — write: "No external corroboration was required; all finalist claims are episode-internal or host judgment."]

### Final Selection
[ranked list with the ordering rationale from §7]

<!-- FINAL_QUESTIONS_START -->
1. Exact first question?
2. Exact second question?
<!-- FINAL_QUESTIONS_END -->

### Rejection / Correction Notes
[concise notes — not a full re-derivation; a short note is sufficient for a narrow, Joe-directed correction after the fact]

### Approved Exceptions
None.
```

**Approved Exceptions is always present, even when nothing was approved.** Default content is exactly `None.` when no override was used. When Joe approves an exception, add the matching entry instead — do not infer approval merely because a command-line override flag was supplied; the flag and the audit entry are two separate, cross-checked things, and a run using an override without the matching entry here fails validation. Exact required formats, one line per approved exception in effect:

```text
Count exception approved by Joe: [N] questions — YYYY-MM-DD
Answer-length exception approved by Joe: [N] words — YYYY-MM-DD
Research-freshness waiver approved by Joe: YYYY-MM-DD
```

A count exception requires both `--expected-key-questions` and `--expected-faq-pairs` to be passed with the same value, matching this entry's number. An answer-length exception is only needed when `--expected-max-words` exceeds 60. A research-freshness waiver entry here is required whenever Baseline Discovery Research declares `Freshness status: Joe-approved one-run waiver` — it is a separate, additional record from the `Freshness waiver approved by Joe` line in that section, not a duplicate to skip.

**Numbering requirement:** the `FINAL_QUESTIONS` block must number sequentially starting at 1 (1, 2, 3, ...), with no gaps, repeats, or out-of-order entries. This is validated mechanically.

**"Not triggered" and "not required" are not omissions.** Extended Discovery Research and the Provisional Claim / Corroboration Table headings are always present, even when the honest content is "nothing happened here" — omitting the heading itself is a validator error, not a stylistic choice.

When Joe changes, removes, or replaces a question after the fact, update the episode output and the `FINAL_QUESTIONS` block together in the same pass. A concise note in Rejection / Correction Notes is sufficient; the full audit is not re-derived from scratch for a narrow correction.

---

*This file replaces the six-criterion 0-3 scoring rubric, the 18-point total, the 13-point pass threshold, and the itemized penalty table previously used in this model. See `docs/faq-research-reference.md` for the current first-party and empirical evidence base referenced throughout.*
