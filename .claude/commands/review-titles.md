# /review-titles

Internal quality gate for episode title suggestions. Claude must run this BEFORE showing any title options to Joe. Do not skip this step.

## When to invoke

Every time Joe asks for episode title suggestions. Not optional. Do not show Joe any titles until the subagent review is complete and you have addressed every flagged issue.

## How to run

When Joe asks for episode titles:

0. **Web research — do this before generating any titles.**
   Run these three searches IN PARALLEL (single message, multiple WebSearch calls):
   - "[wine/brand name] review" — what titles and formats are ranking?
   - "[wine/brand name] podcast episode" — what are competitor episode titles?
   - "[wine/brand name] site:youtube.com" — what YouTube titles drive views? (YouTube is the best external signal for click-optimized language.)

   Distill findings to 3–5 bullets before generating. Note:
   - What angles competitors are using (to avoid or improve on them)
   - What language appears in high-performing titles
   - Any gap or contrarian angle not already covered

   Do not generate titles until this step is complete.

1. Read the episode script
2. Identify the episode hook in one plain sentence — include what made the result surprising or controversial, if anything
3. Identify whether this episode belongs to a named series
4. **Generate 5 initial title options** using all of the following:
   - **Show description** (from the script) — Joe writes it to tease the episode; it contains his intended angle. Use it as a direct hook source.
   - **Web research from Step 0** — identify angles competitors haven't tried.
   - **Benchmark: "Meiomi: The Worst Wine We've Ever Tasted?"** — this title drove 241 clicks (highest CTR of any brand episode). What made it work: (a) a bold, specific claim, (b) a question mark that withholds the verdict, (c) controversy that speaks to both fans and skeptics. Aim for that energy.
   - **Tease, don't spoil.** Never write a title that reveals the ratings outcome, the verdict, or the key finding. A listener who reads the title should feel curious about what happened — not already know. The test: if someone reads the title and can describe what the hosts concluded, it's a spoiler.
   - **No vague curiosity-bait.** "Ours Might Surprise You" and "Here's Our Take" tell the listener nothing. The hook must be specific enough to be interesting, vague enough to leave intrigue.

5. Spawn a subagent with the instructions below
6. Fix every FAIL before presenting titles to Joe. Revise WARNINGs where possible.
6.5. **Quality gate — enforce before running the second review.**
   Drop any title that scored below 7/10 on Clickability.
   If fewer than 3 titles remain, return to Step 4 and generate replacements.
   Never present titles that scored 6/10 or below on Clickability — a low score means the title is forgettable, not just imperfect.
7. After fixing any FAILs and culling low-scoring titles, spawn the subagent a second time on the remaining titles. Do not show Joe any titles until the second run returns no FAILs.
8. Show Joe only titles that passed the second review and cleared the quality gate.
9. **Generate and show a Session Report** immediately after presenting the final title options. The report must appear in the same response as the titles — do not skip it, do not make Joe ask for it. Format:

```
---
## /review-titles Session Report — Ep[N]: [Wine Name]

### Step 0: Web Research Findings
[3–5 bullets summarizing what the searches found: dominant angles in competitor content, language that drives clicks, gaps/contrarian angles not covered, any existing Wine Pair episodes on this wine]

### Episode Hook
[One sentence identifying the hook from the script]

### Series
[Series name and number, or "none"]

### Subagent Round 1 Summary
[One line per title: title text — PASS/FAIL, Clickability score, key note]

### Quality Gate Decisions
[Titles dropped and why; or "none dropped"]

### Subagent Round 2 Summary
[One line per title: title text — PASS/FAIL, Clickability score, key note]

### Research-to-Title Alignment
[2–3 sentences: do the final options use the strongest angles identified in Step 0? What angle was used? What was left on the table?]
---
```

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual values:

---

You are a title quality reviewer for The Wine Pair Podcast. Claude has generated episode title suggestions and needs your feedback before showing them to the host. Catch mistakes, flag rule violations, give Claude specific corrections. Be direct. Do not praise anything.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule in it. Pay particular attention to HR-15 through HR-20 (episode title rules).**

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
4. Title must be between 60 and 80 characters. Flag anything outside this range.
5. The first 30 characters must contain either the series name or the grape/region/brand name.
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
- Character count: [N]
- Controversy/curiosity gap: [1–5] (Meiomi benchmark)
- AI Discovery Score: [X]/10
- Clickability Score: [X]/10
- Biggest single fix Claude should make: [one sentence]

End with: "Strongest option: [title]" or "None — Claude should regenerate all options."

---

**Episode context:**
- Episode number: [EPISODE NUMBER]
- Series: [SERIES NAME AND NUMBER, or "none"]
- Hook: [ONE SENTENCE]

**Proposed titles for review:**
[TITLE OPTIONS WITH CLAUDE'S INITIAL SCORES]

---
