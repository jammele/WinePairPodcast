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

0. **Extract the episode's own framing FIRST — before any external research.**
   Read the episode script and show description. Pull out, in 2-3 bullets:
   - What the episode itself actually spends its time on and treats as the main content (not just the wine name — the actual segment structure, e.g. a rubric, a comparison, a running bit).
   - Anything Joe has explicitly told Claude to focus on or build the title around, in this session or a prior one.
   This is the primary source of hook material, not a fallback. External research (next step) fills gaps around this — it does not override or crowd it out. If Joe has named a specific angle, no surviving title option may ignore it (see the gate in Step 4).

0.5. **Web research — fills gaps around the episode's own framing, does not replace it.**
   Run these three searches IN PARALLEL (single message, multiple WebSearch calls):
   - "[wine/brand name] review" — what titles and formats are ranking?
   - "[wine/brand name] podcast episode" — what are competitor episode titles?
   - "[wine/brand name] site:youtube.com" — what YouTube titles drive views? (YouTube is the best external signal for click-optimized language.)

   Distill findings to 3–5 bullets before generating. Note:
   - What angles competitors are using (to avoid or improve on them)
   - What language appears in high-performing titles
   - Any gap or contrarian angle not already covered

   For headline-performance and AEO framing questions (question vs. statement, curiosity-gap calibration, what drives AI-answer-engine citation), read `docs/title-research-reference.md` first per HR-67 rather than researching these from scratch — only run fresh searches if it doesn't cover the angle needed or looks stale, and add any new finding back to that file.

   Do not generate titles until Step 0 and this step are both complete.

1. Read the episode script
2. Identify the episode hook in one plain sentence — include what made the result surprising or controversial, if anything
3. Identify whether this episode belongs to a named series
4. **Generate 5 initial title options** using all of the following:
   - **Step 0's episode-framing bullets first** — the option set must include at least one title built directly on what the episode itself emphasizes or what Joe explicitly flagged, not just external trivia about the wine/brand in general.
   - **Show description** (from the script) — Joe writes it to tease the episode; it contains his intended angle. Use it as a direct hook source.
   - **Web research from Step 0.5** — identify angles competitors haven't tried.
   - **Benchmark: "Meiomi: The Worst Wine We've Ever Tasted?"** — this title drove 241 clicks (highest CTR of any brand episode). What made it work: (a) a bold, specific claim, (b) a question mark that withholds the verdict, (c) controversy that speaks to both fans and skeptics. Aim for that energy.
   - **Tease, don't spoil.** Never write a title that reveals the ratings outcome, the verdict, or the key finding. A listener who reads the title should feel curious about what happened — not already know. The test: if someone reads the title and can describe what the hosts concluded, it's a spoiler.
   - **No vague curiosity-bait.** "Ours Might Surprise You" and "Here's Our Take" tell the listener nothing. The hook must be specific enough to be interesting, vague enough to leave intrigue.
   - **Gate before moving on:** if Joe explicitly named an angle to focus on, check the surviving option set against it. If none of the 5 options use it, that's a blocking problem — regenerate before spawning the subagent, don't let the review rounds catch it after the fact.
   - **Clause weighting, once a title has multiple parts (see HR-53).** After a subtitle is added to a confirmed base title, treat every substantive clause of the resulting full title as its own thing to account for — don't let a later, more novel, or easier-to-visualize clause silently eclipse an earlier one that's actually backed by more episode content or an explicit Joe instruction. This is a named failure mode: it happened on Ep229's cover art, where every concept got built around the word "Contender" while "Summer Sipper" — the episode's actual dominant, most-repeated content and something Joe had explicitly flagged — got dropped, because the competitive angle was easier to storyboard. The same bias (favoring the newer/showier clause over the one with more real content behind it) can happen here too when picking which part of a confirmed subtitle to lead with in downstream work — check both, not just whichever is more novel.
   - **Length, for series-title subtitles (HR-71):** when adding a subtitle to an already-confirmed series prefix, default to roughly the length of the shortest of the last 3 series subtitle precedents. Don't rely on the general 100-char cap or the 35-75 preferred range alone — those are non-blocking and long options have slipped through on that basis before.

5. Spawn a subagent with the instructions below
6. Fix every FAIL before presenting titles to Joe. Revise WARNINGs where possible.
6.5. **Quality gate — enforce before running the second review.**
   Drop any title that scored below 7/10 on Clickability.
   If fewer than 3 titles remain, return to Step 4 and generate replacements.
   Never present titles that scored 6/10 or below on Clickability — a low score means the title is forgettable, not just imperfect.
   **Exception — named series titles:** Any title that correctly uses an established series prefix and passes all hard rules (HR-15 through HR-20, HR-39) is exempt from the Clickability floor. Series recognition is not captured by the Clickability metric. Include it as a valid option regardless of score (HR-61).
7. After fixing any FAILs and culling low-scoring titles, spawn the subagent a second time on the remaining titles. Do not show Joe any titles until the second run returns no FAILs.
8. Show Joe only titles that passed the second review and cleared the quality gate.
9. **Generate and show a Session Report** immediately after presenting the final title options. The report must appear in the same response as the titles — do not skip it, do not make Joe ask for it. Format:

```
---
## /review-titles Session Report — Ep[N]: [Wine Name]

### Step 0: Episode's Own Framing
[2-3 bullets: what the episode itself actually spends time on, and anything Joe explicitly flagged to focus on]

### Step 0.5: Web Research Findings
[3–5 bullets summarizing what the searches found: dominant angles in competitor content, language that drives clicks, gaps/contrarian angles not covered, any existing Wine Pair episodes on this wine. Note whether `docs/title-research-reference.md` was used as-is or supplemented with fresh research, and why.]

### Episode Hook
[One sentence identifying the hook from the script]

### Series
[Series name and number, or "none"]

### Subagent Round 1 Summary
[One line per title: title text — PASS/FAIL, Clickability score (labeled as internal heuristic, not measured CTR), key note]

### Quality Gate Decisions
[Titles dropped and why; or "none dropped"]

### Subagent Round 2 Summary
[One line per title: title text — PASS/FAIL, Clickability score (labeled as internal heuristic, not measured CTR), key note]

### Research-to-Title Alignment
[2–3 sentences: do the final options use the strongest angles identified in Step 0/0.5? What angle was used? What was left on the table? Confirm explicitly that any angle Joe named is reflected in at least one surviving option, or explain why not.]

### AEO Discoverability
[One line: do the final options differ on AEO/AI-citation grounds, or is this a wash because they share the same named entity and topical phrase? Either is a valid finding — state it honestly per HR-67.]
---
```

   After displaying the report: append the full entry to `data/title-session-reports.md` (newest entry at the top, below the Patterns Learned section) and commit the file immediately. Do not wait for Joe's selection — append and commit in the same response as the titles.

10. **Ask Joe which title he wants to use.** Phrase it simply: "Which title would you like for Ep[N]?" Do not suggest one or editorialize — just ask.

10.5. **Stop boundary.** After asking which title Joe wants, stop. Do not infer or auto-run `/generate-episode-content`, `/generate-cover-art`, or any other command.

11. **After Joe confirms his choice:**
    - Update the "Joe's selection" field in the Ep[N] entry in `data/title-session-reports.md`
    - If a new pattern is visible (e.g., Joe consistently picks question-format titles, Joe rejects snob-angle hooks), update the Patterns Learned section at the top of the file
    - Add the confirmed title to `data/episode-titles.md` following the existing format
    - Commit both files with message: "Add Ep[N] title: [confirmed title]"

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual values:

---

You are a title quality reviewer for The Wine Pair Podcast. Claude has generated episode title suggestions and needs your feedback before showing them to the host. Catch mistakes, flag rule violations, give Claude specific corrections. Be direct. Do not praise anything.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule in it. Pay particular attention to HR-15 through HR-20, HR-39, HR-61, HR-66, HR-67, HR-70, and HR-71 (episode title rules).**

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

Non-negotiable rules — flag as FAIL if violated (see HR-15 through HR-20 and HR-39 in house-rules.md):
1. Grape or region name must appear in the title. Series prefix alone does not satisfy this. For brand review episodes (Meiomi, Josh, Two Buck Chuck, etc.) the brand name satisfies this rule — it is the wine identifier.
2. If this is a named series episode, the series prefix must be present and correctly formatted. Match last 3 installments exactly.
3. No spam words: "amazing", "incredible", "secret", "magic", "you need to try", "right now", "don't miss", "the best"
4. Title must be 100 characters or fewer. There is no minimum length. Flag anything over 100.
5. The first 30 characters must contain either the series name or the grape/region/brand name, and must avoid filler openers. Prefer at least one information-bearing hook term in that opening segment when possible.
6. **Spoiler test — FAIL if violated (HR-39).** The title must NOT reveal the episode's verdict, ratings outcome, or key finding. Test: after reading the title, does a listener already know what the hosts concluded? If yes → FAIL. A title that tells you one wine was drinkable and one was bad is a spoiler. A title that makes you wonder what they concluded is a hook. This is a hard FAIL, not a warning.

Quality checks — flag as WARNING if violated:
7. Does the format repeat any of the last 5 episode titles? Name the episode it repeats.
8. Is there a real hook (tension, surprise, contrast, or question)?
9. Two-audience test: new listener gets the wine AND a reason to click; loyal listener feels this is specific to this episode.
10. Report the exact character count for each title.
11. If this is a series episode with a subtitle, does the subtitle add meaningful information beyond the wine name?
12. **Meiomi benchmark.** "Meiomi: The Worst Wine We've Ever Tasted?" drove 241 clicks — the highest CTR of any brand episode. Rate this title on controversy/curiosity gap (1–5):
    - 5: Would drive clicks from both fans AND skeptics of this wine
    - 3: Interesting to people who already care; won't pull in the curious
    - 1: No controversy, no curiosity gap — safe and forgettable
    Any title scoring 2 or below on this check should be flagged for regeneration, not just warned. Include this score in your output.

**Step 6: Score each proposed title.**

AI Discovery Score (1–10):
- 9–10: Series name or grape name + region + strong search keyword all in first 30 chars
- 7–8: Grape or region present, clear topic signal
- 5–6: Topic present but not keyword-optimized
- 1–4: No grape or region, or vague

Clickability Score (1–10):
- 9–10: Genuine tension or surprise, passes both audiences, specific to this episode
- 7–8: Clear hook, interesting angle
- 5–6: Competent but forgettable
- 1–4: No hook, generic, or just a description

**Return format:**

For each proposed title:
- PASS or FAIL (with the specific rule violated for any FAIL)
- WARNINGs (list each with the check number)
- Character count: [N] (flag if it pushes past ~75 chars for a series-subtitle title per HR-71, even though the hard cap is 100)
- Controversy/curiosity gap: [1–5] (Meiomi benchmark)
- AI Discovery Score: [X]/10 — internal heuristic rubric, not measured search data
- Clickability Score: [X]/10 — internal heuristic rubric, not measured CTR data
- Biggest single fix Claude should make: [one sentence]

End with:
- "Strongest option: [title]" or "None — Claude should regenerate all options."
- One line on AEO: do these options actually differ in AI-answer-engine discoverability, or do they share the same named entity/topic and therefore not differentiate on this dimension? State the honest answer, don't manufacture a difference that isn't there.

---

**Episode context:**
- Episode number: [EPISODE NUMBER]
- Series: [SERIES NAME AND NUMBER, or "none"]
- Hook: [ONE SENTENCE]

**Proposed titles for review:**
[TITLE OPTIONS WITH CLAUDE'S INITIAL SCORES]

---
