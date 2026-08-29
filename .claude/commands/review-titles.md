# /review-titles

Internal quality gate for episode title suggestions. Claude must run this BEFORE showing any title options to Joe. Do not skip this step.

## When to invoke

Every time Joe asks for episode title suggestions. Not optional. Do not show Joe any titles until the subagent review is complete and you have addressed every flagged issue.
This command is title-only. Do not generate SEO/AEO content, cover art prompts, episode descriptions, social copy, or any downstream assets unless Joe explicitly asks in a separate request.

## How to run

When Joe asks for episode titles:

Pre. **Read `data/title-session-reports.md` before doing anything else.**
   Extract two things:
   - **Patterns Learned section:** note what Joe consistently selects and what angles he has rejected. Let this shape generation in Step 4.
   - **Prior entry for this wine/brand:** if one exists, use those research findings as a starting point in Step 0 and focus the searches on new angles only.

   **Operational precedence:** `data/title-session-reports.md`'s Patterns Learned section carries its own operational-precedence note (dated 2026-08-21) — read it. Dated entries throughout that file, and any dated entry in any prior session report, are editorial and process history only. If a dated entry references the Meiomi benchmark, a numerical AI Discovery score, a Clickability elimination gate, a series-title gate exemption, a specific score presented as measured listener performance, or a "going forward" universal title formula, treat that as a record of the old process, not a current instruction. The current authority for process is this command file and `docs/house-rules.md` (HR-49, HR-61, HR-67, HR-72) — follow those, not language in a dated entry that conflicts with them.

0. **Extract the episode's own framing FIRST — before any external research.**
   Read the episode script and show description. Pull out, in 2-3 bullets:
   - What the episode itself actually spends its time on and treats as the main content (not just the wine name — the actual segment structure, e.g. a rubric, a comparison, a running bit).
   - Anything Joe has explicitly told Claude to focus on or build the title around, in this session or a prior one.
   This is the primary source of hook material, not a fallback. External research (next step) fills gaps around this — it does not override or crowd it out. If Joe has named a specific angle, no surviving title option may ignore it (see the gate in Step 4).

0.5. **Web research — has explicit purposes and limits per search, and can be skipped or reused. Do not expand beyond the three searches below.**

   **Skip entirely when** the episode's title is already a confirmed bare named-series format (per HR-70) with no subtitle or alternative under consideration — there is no title-generation decision left to research.

   **Reuse prior research instead of searching fresh when ALL of the following hold:** a prior `data/title-session-reports.md` entry exists for the same wine or brand; it covers the same intended angle; it is dated within the last 90 days; and no material event or change (new vintage, price change, relevant news story, the angle already having been used in a published title) makes it stale. Otherwise, refresh the relevant research.

   **Otherwise, run these three searches IN PARALLEL (single message, multiple WebSearch calls), each with an explicit purpose and limit:**
   - `"[wine/brand name] review"` — informs topic framing and competitor saturation only. Not a title-performance signal.
   - `"[wine/brand name] podcast episode"` — shows competitor phrasing and episode-title format only. Not a title-performance signal.
   - `"[wine/brand name] site:youtube.com"` — shows phrasing and structural patterns only. **Never cite a video's view count as evidence that its title caused performance** — view counts reflect channel authority, topic demand, and algorithm placement at least as much as title wording, and this data cannot separate those factors.

   Distill findings to 3–5 bullets before generating. Note:
   - What angles competitors are using (to avoid copying their wording directly, and to avoid or improve on saturated framing)
   - What language patterns appear across results (structure and phrasing only — not performance)
   - Any gap or contrarian angle not already covered

   For headline-performance and AEO framing questions (question vs. statement, curiosity-gap calibration, what drives AI-answer-engine citation), read `docs/title-research-reference.md` first per HR-67 rather than researching these from scratch — that file labels which findings are qualitative/directional versus verified, and describes the corpus methodology for selecting structurally-relevant past episodes. Only run fresh searches if it doesn't cover the angle needed or looks stale, and add any new finding back to that file with proper source labeling.

   Do not generate titles until Step 0 and this step (or its skip/reuse determination) are complete.

1. Read the episode script
2. Identify the episode hook in one plain sentence — include what made the result surprising or controversial, if anything
3. Identify whether this episode belongs to a named series
4. **Generate 5 initial title options** using all of the following:
   - **Step 0's episode-framing bullets first** — the option set must include at least one title built directly on what the episode itself emphasizes or what Joe explicitly flagged, not just external trivia about the wine/brand in general.
   - **Show description** (from the script) — Joe writes it to tease the episode; it contains his intended angle. Use it as a direct hook source.
   - **Web research from Step 0.5** — identify angles competitors haven't tried.
   - **Concrete curiosity and tension, when the episode genuinely supports it.** Favor a bold, specific claim and a structure that withholds the verdict over a vague or generic hook. When the episode supports it, price/buying, comparison, reputation, misconception, or verdict tension are strong angles — but controversy is not required for every episode, and no single episode or formula is the standard to aim for. If a past episode's title illustrates a relevant structure, pull it only when it's structurally relevant to this episode (same format, familiarity level, or subject type) per the corpus methodology in `docs/title-research-reference.md` — never as a fixed "aim for this" reference.
   - **Tease, don't spoil.** Never write a title that reveals the ratings outcome, the verdict, or the key finding. A listener who reads the title should feel curious about what happened — not already know. The test: if someone reads the title and can describe what the hosts concluded, it's a spoiler.
   - **No vague curiosity-bait.** "Ours Might Surprise You" and "Here's Our Take" tell the listener nothing. The hook must be specific enough to be interesting, vague enough to leave intrigue.
   - **Gate before moving on:** if Joe explicitly named an angle to focus on, check the surviving option set against it. If none of the 5 options use it, that's a blocking problem — regenerate before spawning the subagent, don't let the review rounds catch it after the fact.
   - **Clause weighting, once a title has multiple parts (see HR-53).** After a subtitle is added to a confirmed base title, treat every substantive clause of the resulting full title as its own thing to account for — don't let a later, more novel, or easier-to-visualize clause silently eclipse an earlier one that's actually backed by more episode content or an explicit Joe instruction. This is a named failure mode: it happened on Ep229's cover art, where every concept got built around the word "Contender" while "Summer Sipper" — the episode's actual dominant, most-repeated content and something Joe had explicitly flagged — got dropped, because the competitive angle was easier to storyboard. The same bias (favoring the newer/showier clause over the one with more real content behind it) can happen here too when picking which part of a confirmed subtitle to lead with in downstream work — check both, not just whichever is more novel.
   - **Length, for series-title subtitles (HR-71):** when adding a subtitle to an already-confirmed series prefix, default to roughly the length of the shortest of the last 3 series subtitle precedents. Don't rely on the general 100-char cap or the 35-75 preferred range alone — those are non-blocking and long options have slipped through on that basis before.
   - **Regenerating after Joe rejects a full prior batch:** keep whichever specific idea/angle he validated, but do not submit multiple options that are just wording variants of that one idea as if they were distinct choices (see HR-67). Do not revive an angle Joe already rejected this session merely to manufacture variety. If his stated constraints genuinely leave only one strong direction, say so and present fewer, meaningfully distinct options rather than padding to a fixed count.

5. Spawn a subagent with the instructions below
6. Fix every FAIL before presenting titles to Joe. Revise WARNINGs where possible. A title may be presented only when both: (a) it has no hard-rule FAIL, and (b) its Session constraint is PASS or none was stated (see HR-17). A title marked `Session constraint: NEEDS REVISION` must be revised before presentation, even if it has no hard-rule FAIL — keep this check separate from, not merged into, house-rule PASS/FAIL.
6.5. **Order for presentation — no elimination gate.**
   Clickability is not a pass/fail gate. Do not drop a title, or shrink the option set below what was generated, because of a low Clickability score. Every title that has no hard-rule FAIL and no unresolved `Session constraint: NEEDS REVISION` (i.e., is rule-compliant per Step 6) proceeds toward Joe.
   Order the rule-compliant titles by Clickability as a sort signal only (highest first), each paired with a one-line qualitative reason. If regeneration is warranted, it's because titles have FAILs to fix, not because they scored low on Clickability.
   Named-series titles that pass all hard rules (HR-15 through HR-20, HR-39) are included exactly like any other rule-compliant title — see HR-61, which no longer needs a scoring exemption because there is no gate to be exempt from.
   **Before displaying the final list, verify the printed order actually matches its claimed ordering method** (e.g., if labeled "Clickability order," confirm the scores actually descend) — this check covers the final list shown to Joe, not just an intermediate candidate list. If the order doesn't match, fix it or state plainly what other ordering principle is being used; never present a mislabeled order as sorted (see HR-67).
   **If this batch was regenerated after Joe rejected a prior batch in full, confirm the surviving options are meaningfully distinct** in listener promise, structure, or episode-supported angle, not near-paraphrases of one idea — see the Step 4 note above and HR-67.
7. After fixing any FAILs or NEEDS REVISION session constraints, spawn the subagent a second time on the revised titles. Do not show Joe any titles until the second run returns, for every title, no hard-rule FAIL and no unresolved `Session constraint: NEEDS REVISION`.
8. Show Joe every title that passed the second review (no hard-rule FAIL, and Session constraint PASS or none stated). None are hidden from Joe for a low Clickability score.
9. **Generate and show a Session Report** immediately after presenting the final title options. The report must appear in the same response as the titles — do not skip it, do not make Joe ask for it. Format:

```
---
## /review-titles Session Report — Ep[N]: [Wine Name]

### Step 0: Episode's Own Framing
[2-3 bullets: what the episode itself actually spends time on, and anything Joe explicitly flagged to focus on]

### Step 0.5: Web Research Findings
[3–5 bullets summarizing what the searches found: dominant angles in competitor content, recurring language and structural patterns appearing across competitor results (search results show phrasing and format only; they do not establish click performance or causation), gaps/contrarian angles not covered, any existing Wine Pair episodes on this wine. Note whether `docs/title-research-reference.md` was used as-is or supplemented with fresh research, and why.]

### Episode Hook
[One sentence identifying the hook from the script]

### Series
[Series name and number, or "none"]

### Subagent Round 1 Summary
[One line per title: title text — PASS/FAIL, Session constraint: PASS/NEEDS REVISION (only if Joe gave a session-specific instruction this session, and never merged into the HR-17 result), Clickability score (internal heuristic, comparative sort order only — not measured CTR), Voice Fit note, key note]

### Hard-Rule Drops (Round 1)
[Titles dropped for a hard-rule FAIL, and which rule; or "none dropped." Titles are never dropped here for a low Clickability score — see Step 6.5.]

### Corpus Pattern Considered
[If an internal pattern from the title archive was cited as support for an angle this session: name the pattern, the structurally-relevant example(s) pulled per the corpus methodology in `docs/title-research-reference.md`, and the counterexample check — either a counterexample found and named, or "no meaningful counterexample found in the archive." If no internal pattern was cited this session, state "Not applicable — no internal pattern cited this session." Do not run this check for routine hard-rule PASS/FAIL determinations.]

### Subagent Round 2 Summary
[One line per title: title text — PASS/FAIL, Session constraint: PASS/NEEDS REVISION (only if applicable), Clickability score (internal heuristic, comparative sort order only — not measured CTR), Voice Fit note, key note]

### Hard-Rule Drops (Round 2)
[Titles dropped for a hard-rule FAIL, and which rule; or "none dropped."]

### Research-to-Title Alignment
[2–3 sentences: do the final options use the strongest angles identified in Step 0/0.5? What angle was used? What was left on the table? Confirm explicitly that any angle Joe named is reflected in at least one surviving option, or explain why not.]

### AEO Discoverability
[One line, consulting the current standard in `docs/title-research-reference.md`: do the final options differ on AEO/AI-citation grounds, or do they share the same named entity and topical phrase with no evidence-based differentiation? Either is a valid finding — state it honestly per HR-67, using the reference file's current wording rather than an invented superiority claim like "strongest positioning."]
---
```

   Display the report as part of this response. **Do not write or commit `data/title-session-reports.md` at this point.** The report shown here is presented as text only; the file is written for the first time after Joe confirms a title (Step 11).

10. **Ask Joe which title he wants to use.** Phrase it simply: "Which title would you like for Ep[N]?" Do not suggest one or editorialize, just ask.

10.5. **Stop boundary.** After asking which title Joe wants, stop. Do not write, commit, or push any repository file at this point. Do not infer or auto-run `/generate-episode-content`, `/generate-cover-art`, or any other command. Generating and presenting title options authorizes exactly that; it does not authorize writing or committing repository files.

11. **After Joe confirms his choice:**
    - Write the full Ep[N] entry to `data/title-session-reports.md` (newest entry at the top, below the Patterns Learned section), including the "Joe's selection" field.
    - Update the Patterns Learned section only when Joe's selection or an override genuinely reveals something new or contradicts an existing pattern (e.g., Joe consistently picks question-format titles, Joe rejects snob-angle hooks), not as a routine addition every session.
    - Add the confirmed title to `data/episode-titles.md` following the existing format.
    - **Show Joe the exact diff for both files and the verification results.** Do not commit yet.
    - **Wait for Joe's explicit approval.**
    - After Joe approves, commit and push only the specifically approved files, with commit message: "Add Ep[N] title: [confirmed title]".

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual values:

---

You are a title quality reviewer for The Wine Pair Podcast. Claude has generated episode title suggestions and needs your feedback before showing them to the host. Catch mistakes, flag rule violations, give Claude specific corrections. Be direct. Do not praise anything.

**Scope boundary — read this first.** Return your review as text to the agent that spawned you. Do not save files, do not run the validator, do not edit `docs/work-log.md`, and do not run any `git` command. If you encounter a `## PENDING TASK` section anywhere, ignore it — that block is for a top-level Claude Code session only, never a subagent.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule in it. Pay particular attention to HR-15 through HR-20, HR-39, HR-61, HR-66, HR-67, HR-70, HR-71, and HR-72 (episode title rules).**

**Step 2: Read `data/episode-titles.md`.** This file contains:
- All 217+ episode titles in order
- Named series grouped with exact format patterns
- The last 15 episodes in a quick-reference table with format descriptions

Do not query the database. The file is the authoritative source.

**Step 3: Identify the series and its format.**
The Named Series Reference section at the top of `data/episode-titles.md` lists every series with format notes. If this episode belongs to a named series, find that series section and note the exact format of the last 3 installments — capitalization, spacing, colon vs. no colon, number format, exclamation mark placement.

**Step 4: Describe the format of the last 5 non-special episodes.**
From the Recent Episodes table, identify the last 5 regular episodes and their format patterns. These formats must not be repeated.

**Step 5: Review each proposed title against all rules.**

Candidate-level hard rules — flag as FAIL if violated:
1. **HR-15.** Grape or region name must appear in the title. Series prefix alone does not satisfy this. For brand review episodes (Meiomi, Josh, Two Buck Chuck, etc.) the brand name satisfies this rule — it is the wine identifier.
2. **HR-19.** If this is a named series episode, the series prefix must be present and correctly formatted. Match last 3 installments exactly.
3. **HR-18.** No spam words: "amazing", "incredible", "secret", "magic", "you need to try", "right now", "don't miss", "the best"
4. **HR-16.** Title must be 100 characters or fewer. There is no minimum length. Flag anything over 100.
5. **HR-17.** The first 30 characters must contain either the series name or the grape/region/brand name, and must avoid filler openers. Prefer at least one information-bearing hook term in that opening segment when possible. Decide HR-17 using only this text. If Claude's episode context states a session-specific instruction beyond the standing house rules (e.g., a request that some other term also appear early), evaluate and report that separately as `Session constraint: PASS` or `Session constraint: NEEDS REVISION` — never as part of the HR-17 PASS/FAIL itself, and never silently dropped. A title can be `HR-17: PASS` and `Session constraint: NEEDS REVISION` at the same time.
6. **HR-39 — Spoiler test.** The title must NOT reveal the episode's verdict, ratings outcome, or key finding. Test: after reading the title, does a listener already know what the hosts concluded? If yes → FAIL. A title that tells you one wine was drinkable and one was bad is a spoiler. A title that makes you wonder what they concluded is a hook. This is a hard FAIL, not a warning.
7. **HR-66 — clear violations only.** FAIL if the title depends on knowing a co-host's name, a specific running bit, or an explicitly stated show rule (e.g. naming the show's usual budget ceiling by number) to make sense. A clear violation is one where a prospective new listener with zero show history literally cannot parse the hook without that missing fact — e.g. a title that only works if you already know who "Carmela" is.

Quality checks — flag as WARNING if violated:
8. Does the format repeat any of the last 5 episode titles? Name the episode it repeats.
9. Is there a real hook (tension, surprise, contrast, or question)?
10. Two-audience test: new listener gets the wine AND a reason to click; loyal listener feels this is specific to this episode.
11. Report the exact character count for each title.
12. If this is a series episode with a subtitle, does the subtitle add meaningful information beyond the wine name?
13. **HR-71 — series-subtitle length guidance, not a hard rule.** If a series-subtitle title's total length pushes past ~75 characters, flag WARNING and require a one-line stated justification ("longer because X") before it can be presented to Joe. This is guidance, never a FAIL — the only hard length cap is HR-16's 100 characters.
14. **HR-66 — borderline cases.** WARNING, not FAIL, for a title that leans on implied show history or an ambiguous reference without naming it directly (e.g. alludes to a show convention without stating it outright). Flag it for Joe to decide rather than silently including it or auto-failing it.
15. **Concrete curiosity (qualitative, not scored).** Note whether the title creates genuine curiosity via a withheld, unresolved question — and, only when the episode itself supports it, price/buying, comparison, reputation, misconception, or verdict tension. This is not scored on any numeric scale and is not, by itself, a regeneration trigger — a title with weak curiosity but no hard-rule FAIL still proceeds to Joe (see HR-67). Use this note as supporting reasoning for the Clickability ranking below. Controversy is not required for every episode; do not manufacture tension a topic doesn't support.
16. **Voice Fit (qualitative, required, unscored — HR-72).** Note: (a) does the wording resemble language Joe or the episode transcript/script actually uses, versus an invented "hooky" phrase with no on-air precedent; (b) is the title specific to this episode, not interchangeable with another; (c) does its structure (declarative opener, question, statement) suit this particular episode; (d) does it read as clinical, templated, or artificially "hooky"; (e) does a small wording change — an article, pronoun, tense, or singular/plural form — materially change what the title claims relative to the episode's actual content. Name the specific difference when (e) applies; do not flag routine stylistic variation that doesn't change meaning, and do not turn this into a universal grammar rule. This is advisory only — never a gate, and never a reason to penalize a strong question-format title. A meaning-changing wording issue only becomes a hard-rule FAIL if it independently triggers one of the FAILs above (e.g., the changed meaning creates a spoiler or an unsupported claim).
17. **Structural accuracy.** Any description of a title's structure in this review (e.g., calling it "a question") must match the title's actual clauses and punctuation. Name a compound structure fully (e.g., "a question followed by a statement") rather than labeling it by only its dominant or first clause. This is a reporting-accuracy check, not a new preference or scoring category.

**Step 6: Score each proposed title.**

Discovery signal (HR-15, HR-17 — already checked as hard-rule PASS/FAIL above; there is no separate numeric AI Discovery score). If check 1 and check 5 both PASS, the title carries the grape/region/brand signal and an early keyword — no further discovery scoring is needed.

Clickability Score (1–10) — an internal heuristic used for comparative sorting only. It is never a pass/fail gate and never eliminates a rule-compliant title from the set shown to Joe:
- 9–10: Genuine tension or surprise, passes both audiences, specific to this episode
- 7–8: Clear hook, interesting angle
- 5–6: Competent but forgettable
- 1–4: No hook, generic, or just a description

**Return format:**

For each proposed title:
- PASS or FAIL (with the specific rule violated for any FAIL)
- Session constraint: PASS / NEEDS REVISION / "none stated this session" — only ever set from an explicit session-specific instruction in the episode context below, never from HR-17 or any other standing house rule
- WARNINGs (list each with the check number)
- Character count: [N] (WARNING plus a required one-line justification if it pushes past ~75 chars for a series-subtitle title per HR-71 — guidance, not a FAIL; the only hard cap is HR-16's 100 characters)
- Clickability Score: [X]/10 — internal heuristic, comparative sort order only, not measured CTR or download data
- Voice Fit: [one to two sentence qualitative note, per check 16 — never a number]
- Biggest single fix Claude should make: [one sentence]

End with:
- "Strongest option: [title]" or "None — Claude should regenerate all options."
- One line on AEO, consulting the current standard in `docs/title-research-reference.md`: do these options actually differ in AI-answer-engine discoverability, or do they share the same named entity/topic and therefore not differentiate on this dimension? Use the reference file's current wording (e.g., "no evidence-based differentiation") when that's what it supports — never describe a wording or placement choice as "the strongest positioning" or another superiority/ranking claim the reference doesn't state.

---

**Episode context:**
- Episode number: [EPISODE NUMBER]
- Series: [SERIES NAME AND NUMBER, or "none"]
- Hook: [ONE SENTENCE]
- Session-specific instruction: [Joe's explicit instruction for this session beyond the standing house rules, or "none stated this session" — evaluate as a separate Session constraint, never as part of HR-17 or any other standing hard rule]

**Proposed titles for review:**
[TITLE OPTIONS WITH CLAUDE'S INITIAL SCORES]

---
