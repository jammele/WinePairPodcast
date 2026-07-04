# Opportunity Brief Template — The Wine Pair Podcast

Save completed briefs as `docs/opportunity-briefs/[slug]-brief.md`.

Each brief must be completed and approved by Joe **before** drafting begins. The "4 things" declaration in `docs/blog-post-guide.md` are outputs of this brief, not independent upfront decisions.

---

## Evidence standards (from WinePair Content Intelligence BRD, May 26, 2026)

Every claim in this brief must be labeled with its evidence type:
- **Owned verified data** — GSC, Buzzsprout, or other directly owned source
- **Official API data** — data pulled from a platform API
- **Directional trend proxy** — Google Trends, YouTube signals, RSS — directional, not authoritative
- **Manual/search check** — live SERP review, query inspection
- **Inferred analysis** — interpretation derived from evidence above
- **Recommendation** — conclusion drawn from the above

Never mix evidence types without labeling them. Never substitute page-level data for query-cluster data.

---

## Candidate topic

**Topic:** [Name — e.g., "Portuguese wine" or "Is Josh Wine Good?"]
**Entered pool:** [date]
**Business objective:** [explicit statement — not assumed from impressions. What listener growth action does this support?]

---

## Search intent and topic breadth

**Primary intent:** [discovery / review / comparison / decision — choose one and explain]
**Topic breadth:** [specific wine or brand / style or region / broad category / consumer question]
**Excluded scope:** [explicit — what this post does NOT cover. Required field.]

---

## GSC query cluster

**Seed entity:** [e.g., "Assyrtiko"]
**Aliases and variants included:** [list]
**Intent segments:** [discovery / review / comparison / purchase — which rows represent which]
**Rows included:** [paste query rows with impression counts]
**Rows excluded or borderline:** [list with reason for exclusion]
**Evidence window:** [exact start date — exact end date — source snapshot date — purpose of this window]
**Cluster total owned impressions:** [sum of included rows only]
**Evidence type:** Owned verified data (GSC Queries.csv)

**Note:** Page-level aggregates from Pages.csv are NOT acceptable as query cluster evidence. Query-to-page visibility requires GSC query+page dimension data (API `dimensions: ["query","page"]`).

---

## Cluster-ranking URLs

**Source:** GSC query+page dimension data for the defined cluster (not Pages.csv)
**URLs receiving impressions for this cluster:** [list with per-URL impression counts from query+page data]
**Evidence type:** Owned verified data (GSC query+page API)

---

## Overall page performance (separate from cluster)

**Source:** Pages.csv or equivalent page-level export
**Page URL(s):** [relevant episode or existing blog pages]
**28-day page performance:** [impressions / clicks / CTR / position — labeled as 28-day]
**90-day context (if used):** [separately labeled — NOT combined with 28-day figures]

---

## External demand signal

**Source:** [Google Trends / YouTube Data API / RSS mentions / none]
**Signal:** [description]
**Evidence type:** Directional trend proxy (label source)
**If none available:** State "No external demand signal identified."

---

## Saturation

**SERP review date:** [date]
**What dominates the SERP for this query cluster:** [description]
**Intent the SERP primarily serves:** [description]
**What's missing or underserved:** [description]
**Evidence type:** Manual/search check

---

## Archive inventory — ALL episodes

Must be complete before scope or format can be selected. Check `data/episode-titles.md` for every related episode.

| Episode | Title | Classification | Reason |
|---|---|---|---|
| [Ep#] | [Title] | Essential / Supporting / Context only / Excluded | [one sentence] |

**If any episode is listed as Essential, it must appear in the draft.** Dominance of a single episode in a broad guide without justification is a strategic failure.

---

## Firsthand evidence inventory

List the specific Joe/Carmela evidence that materially changes this article's value compared to a generic wine reference:

- [specific tasting note, disagreement, surprise, recommendation from episode source material]
- [etc.]

**Non-generic test:** What can this article do that Wine Enthusiast or Wine Folly cannot? Answer in one sentence. If the answer is "nothing specific yet," the brief is not ready.

---

## The Wine Pair angle

[One specific answer to: why us instead of Wine Enthusiast, Wine Folly, or a generic wine site?]

---

## No-new-post alternative

[Could an episode-page refresh, hub page, or internal link work better than a new post? Explicit answer required.]

---

## Recommended page type

[Flows from the analysis above. Not declared before it.]
- Specific wine review (Format B) — for one episode + specific wine/brand target
- Multi-style guide — for broad category with multiple episodes
- Comparison post (Format C) — for direct tasting comparison
- Educational guide (Format A variation) — for broad question or discovery
- No new post — [reason]

---

## Primary query cluster (one or two sentences)

[What is this page designed to rank for?]

---

## Listener path

[Explicit: how does a reader of this post discover and engage with the show?]

---

## Preliminary schema

[Based on page purpose only. Final determined after draft is written and page is rendered.]
- Review Schema: yes / no / depends on content
- FAQPage schema: deprecated May 7, 2026 — do not generate

---

## Approval and scope lock

**Status:** [ ] Draft — not yet approved [ ] Approved by Joe

**Date approved:** ___

**SCOPE LOCK:** Once Joe approves this brief, the following are locked:
- Topic breadth
- Primary intent
- Wine Pair angle
- Recommended page type
- Essential sources (the episodes marked Essential above)
- Excluded scope
- Listener path

**Scope-amendment rule:** If research during drafting suggests a material change to any locked element, **stop drafting and amend this brief first.** The amendment must state: old scope, proposed new scope, evidence causing the change, effect on search intent, effect on archive sources, effect on listener path, and whether this is still the same opportunity or a new candidate.

During the first three staged opportunities, Joe must approve any material scope amendment before drafting continues.

---

## Regression tests (Portuguese wine only — other candidates TBD)

**Regression Test A — pre-draft opportunity gate:**
Before drafting can begin, the following must be complete: archive inventory complete, query cluster defined with evidence, Wine Pair angle specific, page type selected from analysis. If any is missing, the system must stop. Do not select a narrow format (e.g., Format B single-wine review) for a broad category candidate without completing all four.

**Regression Test B — draft-to-brief comparison (Portuguese wine):**
The existing draft `outputs/blog-post-portuguese-wine-douro-branco.md` must fail when compared against an approved broad Portuguese wine brief. Expected failures: scope narrowing (broad category reduced to one wine style), unjustified one-episode dominance, Wine Pair angle not delivered at category scope, image scope mismatch (two episode bottles for a regional guide), listener path mismatch. **Do not claim the draft proves which episodes were reviewed** — archive completeness is a pre-draft process check, not a draft content check.

---

## Evidence window reference

Standard windows and purposes:
- **Current 28d:** current owned visibility signal
- **Prior 28d:** direction and change signal (compare to current 28d)
- **90d:** durability and longer context
- **Year-over-year:** where history allows

Every metric must carry its exact start date, end date, source snapshot, and purpose. Different windows may be compared explicitly but may never be silently substituted, added together, or presented under the wrong window label.
