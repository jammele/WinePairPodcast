# FAQ Discovery Research Reference — The Wine Pair Podcast

**Purpose:** A standing, citable base of owned-audience evidence and current first-party research specifically relevant to selecting Key Questions and writing FAQ answers. This file does not cover episode descriptions, show notes formatting, RSS behavior, or podcast-platform metadata — those are out of scope for this reference. It is kept separate from `docs/title-research-reference.md`, which covers headline/CTR research for episode titles; the two files may describe the same underlying platforms but were built for different, non-interchangeable purposes and should not be merged without a separate decision.

**Last substantively verified:** 2026-08-25

**Substantive-review policy:** re-verify the sources below at least every 30 days. This interval is an initial operational policy, not a proven optimization interval — no evidence here or elsewhere in this repository ties 30 days specifically to any measured outcome.

**Blocking behavior:** if this file's `Last substantively verified` date is more than 30 days old, FAQ generation stops before the owned-evidence check and candidate work begin (`docs/faq-intent-model.md` §0-bis, `.claude/commands/generate-episode-content.md` Step B.0). It does not proceed on stale platform guidance by default. Joe may explicitly approve a one-run waiver to proceed anyway without a full re-verification; the waiver is recorded in that episode's audit, not here.

**What updates this file vs. the episode audit:** this file is updated only during an actual substantive review (a real re-check of the sources below) or when a material finding changes one of the entries. A routine per-episode freshness check that finds no material change is recorded in that episode's own FAQ audit, not appended here — this file does not accumulate a weekly no-change log. A material change found during any check (routine or substantive) is proposed to Joe and local ChatGPT for review before any production rule (`docs/faq-intent-model.md`, `.claude/commands/generate-episode-content.md`, `scripts/validate_episode.js`, `docs/house-rules.md` HR-52) is edited on the strength of it. This file itself is never silently edited by a per-episode run — only by an explicit substantive-review pass.

**Verification log (substantive reviews only):**
- 2026-08-25: Initial population. Sources below fetched and classified. No prior version existed to compare against.
- 2026-08-25: Correction round. The Bing entry (§3) was corrected: the official Bing Webmaster Guidelines page is now treated as the primary source via its indexed content, rather than being characterized as secondary-sourced. See §3 for the corrected finding and its own retrieval-limitation disclosure.

---

## 1. Owned evidence — Wine Pair Search Console intent-cluster priors

**Source:** supplied Podcast Listener Growth analysis (site-wide GSC dataset).
**Window:** previous 28 days, ending 2026-07-18 (Web search).
**Scope:** top-1,000-query analysis across the site.

| Intent cluster | Impressions | Clicks |
|---|---:|---:|
| Serving and chilling | 5,287 | 44 |
| Comparisons and similar wines | 4,860 | 71 |
| Verdict, "good," "worth," "best," and buying | 3,718 | 43 |
| Identity and origin | 2,927 | 22 |
| Price and value | 2,663 | 25 |
| Taste and style | 1,718 | 6 |
| Pairing | 1,141 | 31 |

**Limitations, stated explicitly every time this table is cited:**
- Clusters overlap; they are not independent categories with no shared queries.
- They reflect the site's existing published coverage and current visibility, not universal wine-search demand — a topic Wine Pair has never covered will not appear here regardless of real-world demand.
- They do not prove that any FAQ content caused these impressions or clicks.
- They do not prove a website click became a podcast play.
- They do not, by themselves, establish that any specific episode needs a question from every cluster, or any cluster at all.

**How to use this table:** as a background prior only, when topic-specific owned evidence (a GSC query/page match for this episode's actual wine, grape, region, or brand) is unavailable. Topic-specific evidence always outranks this site-wide table. If neither exists for a given episode, `docs/faq-intent-model.md` §1 requires recording that gap explicitly rather than treating this table as if it were topic-specific.

**Classification:** Owned evidence (per `docs/faq-intent-model.md` §0). Not empirical research; not independently re-verified in this session beyond the figures as supplied.

---

## 2. Google first-party guidance

### 2.1 — No preferred word count; people-first content standard

**Source:** [Creating Helpful, Reliable, People-First Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — Google Search Central.
**Publisher:** Google.
**Update date:** page states "Last updated 2025-12-10 UTC."
**Retrieved:** 2026-08-25.
**Type/authority:** Primary, official.

**Documented finding:** Explicit: *"Are you writing to a particular word count because you've heard or read that Google has a preferred word count? (No, we don't.)"* Helpfulness is defined by five indicators: an existing/intended audience who'd find the content useful, first-hand expertise and depth, a clear site purpose, whether a reader leaves having achieved their goal, and whether they leave satisfied. No Q&A or FAQ format is mentioned as a factor.

**What it does not establish:** Anything about FAQ/Q&A structure specifically, or any format-based ranking lever.

**Operational implication:** Supports the 25-50 word (60 max) FAQ answer-length guidance in `docs/faq-intent-model.md` §9 as an editorial choice for clarity and conciseness — not as an SEO requirement. Do not describe the word-count guidance as improving ranking.

**Classification:** Documented platform behavior.

### 2.2 — No special requirements for AI Overviews or AI Mode

**Source:** [AI Features and Your Website](https://developers.google.com/search/docs/appearance/ai-features) — Google Search Central.
**Publisher:** Google.
**Update date:** not captured in this fetch.
**Retrieved:** 2026-08-25.
**Type/authority:** Primary, official.

**Documented finding:** Explicit: *"There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary."* And: *"There's also no special schema.org structured data that you need to add."*

**What it does not establish:** Anything endorsing FAQ format, Q&A structure, or FAQPage-style markup as an AI-visibility lever. This is a documented denial, not silence.

**Operational implication:** Directly disciplines the "AI-assisted discovery" job in `docs/faq-intent-model.md` §5 — a candidate's Proposed discovery purpose for AI-assisted discovery must be labeled interpretation, never presented as if Google confirms a formatting advantage, because Google's own documentation explicitly says the opposite.

**Classification:** Documented platform behavior (an explicit denial).

### 2.3 — Optimizing for generative AI features: standard SEO fundamentals, not special formatting

**Source:** [Google's Guide to Optimizing for Generative AI Features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — Google Search Central.
**Publisher:** Google.
**Update date:** not captured in this fetch.
**Retrieved:** 2026-08-25.
**Type/authority:** Primary, official.

**Documented finding:** Recommends a unique point of view, clear organization by paragraphs/headings, and standard SEO fundamentals (crawlability, page experience). Explicitly debunks two myths: that content must be broken "into tiny pieces," and that publishers should "write in a specific way just for generative AI search."

**What it does not establish:** Question-led headings, FAQ structure, or any specific content shape as an AI-discovery advantage.

**Operational implication:** Reinforces that any AI-discovery benefit attributed to FAQ format specifically is unsupported by Google's own guidance. The genuine lever, per this source, is a distinctive point of view and clear organization — which is exactly what preserving Joe and Carmela's firsthand tasting judgments (`docs/faq-intent-model.md` §9) is meant to serve, not the Q&A format as such.

**Classification:** Documented platform behavior.

---

## 3. Bing first-party guidance

**Source:** Bing Webmaster Guidelines (official page) — https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a.
**Publisher:** Microsoft/Bing.
**Retrieval method and limitation, disclosed precisely:** this is the primary source. Its indexed content was retrievable and is what the finding below is drawn from. The page's direct JavaScript-rendered body was not parseable in this session's fetch environment across repeated attempts, so the content below comes from the page's own indexed text (surfaced through search) rather than a rendered full-page fetch. This is a retrieval-method limitation, not a reason to treat the source itself as secondary — it is still Bing's own official guidance, not a third party's summary of it.
**Update context:** the guidance below reflects an update reported to have been made to these guidelines around February 2026, adding a named "Generative Engine Optimization (GEO)" section covering AI/Copilot grounding eligibility.
**Retrieved:** 2026-08-25 (this correction round; first attempted 2026-08-25 in the prior round).
**Type/authority:** Primary, official — retrieved via indexed content rather than a rendered fetch.

**Documented finding:** the official guidelines' GEO section addresses content eligibility for grounding and reference in AI (Copilot) responses. Relevant guidance: facts should be stated directly rather than implied, since AI systems need content that can be verified independently; entity names should be clear and consistent, with no ambiguous references; each URL should focus on a single topic with essential information placed near the top of the page; and GEO "doesn't guarantee citations, just as SEO doesn't guarantee rankings" — i.e., following this guidance is explicitly not presented as a guarantee of AI citation.

**What it does not establish:** It does not recommend FAQ format, Q&A structure, or any specific question-and-answer markup. The guidance is about clarity, factual directness, entity-naming consistency, single-topic focus, and information placement generally — not about FAQ content specifically. No citation-likelihood guarantee is made or implied.

**Secondary corroboration (does not replace the primary citation above):** [Bing Adds GEO To Official Guidelines, Expands AI Abuse Definitions](https://www.searchenginejournal.com/bing-adds-geo-to-official-guidelines-expands-ai-abuse-definitions/568442/), Search Engine Journal, reported 2026-02-27, retrieved 2026-08-25. Used only as an additional, independently-dated confirmation that this update exists and describes it consistently with the indexed content above — not as the basis for the finding itself.

**Operational implication:** This favors direct, unambiguous, single-focus answers with clear subject identification — consistent with, and not requiring any change to, the standalone-answer and subject-clarity requirements already in `docs/faq-intent-model.md` §9. Do not add any FAQ-format or citation-performance claim beyond what is stated above; Bing does not make one.

**Classification:** Documented platform behavior. Retrieved via indexed content rather than a direct rendered fetch — that retrieval-method limitation is noted for transparency, but the source itself is primary and official, not secondary. Re-attempt a direct rendered fetch at the next substantive review in case it becomes parseable.

---

## 4. Empirical evidence and known gaps

**No verified study currently establishes:**
- An optimal FAQ question count (the 5-7 policy in `docs/faq-intent-model.md` §7 and `docs/house-rules.md` HR-52 is stated as an operational policy, not an empirically proven growth optimum).
- That FAQ formatting or FAQPage-style structure increases AI citation likelihood.
- That Q&A structure causes higher search visibility, independent of the underlying content's usefulness.
- That this show's FAQ content has caused any measured listener growth.

**Search conducted this session (2026-08-25):** both a general web search and an academic-focused search (arXiv, ACL 2025 proceedings) for empirical research connecting FAQ/Q&A content format to AI citation, retrieval, or search-visibility outcomes.

- **Vendor/marketing sources found, not adopted:** numerous SEO/AEO marketing blogs (including sources styled as Relixir, Authoritas, Contently, Frase, Hexagon, UnoSearch, ZipTie.dev, and others) made claims such as specific citation-rate percentages and AI Overview appearance multipliers for FAQ-schema pages. None disclosed an independently verifiable methodology. One claim surfaced in the same search results directly undermines the others — a reported "controlled experiment" finding that LLMs tokenize JSON-LD schema as plain text rather than structured data, which would mean the schema-specific mechanism claimed by the other sources cannot work as described. This internal contradiction, combined with the absence of disclosed methodology across the board, means none of these figures are used anywhere in this workflow's production rules.
- **Academic sources found:** current arXiv and ACL 2025 retrieval-augmented-generation (RAG) literature is substantial, but addresses system-internal retrieval and citation-attribution engineering (e.g., multi-hop question decomposition, context-attribution methods, RAG system evaluation benchmarks) — not whether publisher-side FAQ/Q&A content formatting affects real-world AI citation or search-visibility outcomes. No directly relevant study was found.

**Operational implication:** treat any AI-citation or search-visibility claim tied specifically to FAQ/Q&A formatting as an unsupported hypothesis unless a future review finds a credible, methodologically disclosed source. Do not promote any vendor percentage into a production rule.

**Classification:** Gap — explicitly not filled. The vendor claims are additionally flagged as internally contradictory and low-confidence, which is a stronger caution than a plain absence of evidence.

---

## 5. Summary of what this file actually supports operationally

No first-party source reviewed this session recommends FAQ/Q&A formatting as a lever for AI-assisted discovery or Bing grounding specifically. Google's own documentation explicitly denies a special-formatting requirement for its AI features. The one place FAQ-adjacent content is documented to matter, per Google, is the general, format-agnostic "helpful, first-hand, goal-satisfying content" standard — which is best served in this workflow by preserving Joe and Carmela's actual tasting judgments and verdicts, not by the Q&A structure itself. This materially narrows the AI-assisted-discovery job in `docs/faq-intent-model.md` §5 toward hypothesis status, and no claim in that file or in `.claude/commands/generate-episode-content.md` should be read as promising ranking, retrieval, citation, or listener-growth outcomes from FAQ format, question wording, or named entities alone.
