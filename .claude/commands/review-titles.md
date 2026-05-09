# /review-titles

Internal quality gate for episode title suggestions. Claude must run this BEFORE showing any title options to Joe. Do not skip this step.

## When to invoke

Every time Joe asks for episode title suggestions. Not optional. Do not show Joe any titles until the subagent review is complete and you have addressed every flagged issue.

## How to run

When Joe asks for episode titles:

1. Read the episode script
2. Identify the episode hook in one plain sentence
3. Identify whether this episode belongs to a named series
4. Generate your initial title options (minimum 3)
5. Spawn a subagent with the instructions below
6. Fix every FAIL before presenting titles to Joe. Revise WARNINGs where possible.
7. After fixing any FAILs, spawn the subagent a second time on the revised titles. Do not show Joe any titles until the second run returns no FAILs.
8. Show Joe only titles that passed the second review.

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

Non-negotiable rules — flag as FAIL if violated (see HR-15 through HR-20 in house-rules.md):
1. Grape or region name must appear in the title. Series prefix alone does not satisfy this.
2. If this is a named series episode, the series prefix must be present and correctly formatted. Match last 3 installments exactly.
3. No spam words: "amazing", "incredible", "secret", "magic", "you need to try", "right now", "don't miss", "the best"
4. Title must be between 60 and 80 characters. Flag anything outside this range.
5. The first 30 characters must contain either the series name or the grape/region name.

Quality checks — flag as WARNING if violated:
6. Does the format repeat any of the last 5 episode titles? Name the episode it repeats.
7. Is there a real hook (tension, surprise, contrast, or question)?
8. Two-audience test: new listener gets the wine AND a reason to click; loyal listener feels this is specific to this episode.
9. Report the exact character count for each title.
10. If this is a series episode with a subtitle, does the subtitle add meaningful information beyond the wine name?

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
