# /review-titles

Internal quality gate for episode title suggestions. Claude must run this BEFORE showing any title options to Joe. Do not skip this step.

## When to invoke

Every time Joe asks for episode title suggestions. This is not optional. Do not show Joe any titles until the subagent review is complete and you have addressed every flagged issue.

## How to run

When Joe asks for episode titles:

1. Read the episode script
2. Identify the episode hook in one plain sentence (the most surprising fact, the biggest tension, the rating outcome, or the strongest contrast)
3. Identify whether this episode belongs to a named series (Italian Wine Adventure, WTF is X, Bordeaux Bargains, etc.)
4. Generate your initial title options (minimum 3)
5. Spawn a subagent with the instructions below, passing: episode number, series name or "none", hook sentence, and your proposed titles with initial scores
6. Read the subagent's feedback carefully
7. Fix every FAIL before presenting titles to Joe. Revise WARNINGs where possible.
8. When presenting to Joe, show only titles that passed review. You do not need to mention this review unless Joe asks.

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual values for episode number, series, hook, and proposed titles:

---

You are a title quality reviewer for The Wine Pair Podcast. Claude has generated episode title suggestions and needs your feedback before showing them to the host. Your job is to catch mistakes, flag rule violations, and give Claude specific corrections. Be direct. Do not praise anything.

**Step 1: Read the complete episode title archive.**

Read the file `data/episode-titles.md`. This file contains:
- All 217+ episode titles in order
- Named series grouped with their exact format patterns
- The last 15 episodes in a quick-reference table with format descriptions

Do not query the database. The file is the authoritative source.

**Step 2: Identify the series and its format.**

The Named Series Reference section at the top of `data/episode-titles.md` lists every series with format notes. If this episode belongs to a named series, find that series section and note the exact format of the last 3 installments — capitalization, spacing, colon vs. no colon, number format, exclamation mark placement.

**Step 3: Describe the format of the last 5 non-special episodes.**

From the Recent Episodes table in `data/episode-titles.md`, identify the last 5 regular (non-Makers, non-Virginia Winemakers) episodes and their format patterns. These formats must not be repeated in the proposed titles.

**Step 4: Review each proposed title against all rules.**

Non-negotiable rules — flag as FAIL if violated:
1. Grape or region name must appear in the title. A series prefix alone (e.g., "Italian Wine Adventure #24") does not satisfy this — the wine name must also be present.
2. If this is a named series episode, the series prefix must be present and correctly formatted. Compare capitalization, spacing, number format, and punctuation against the last 3 series installments exactly.
3. No spam or urgency words: "amazing", "incredible", "secret", "magic", "you need to try", "right now", "don't miss", "the best"
4. Title must be between 60 and 80 characters. Flag anything outside this range.
5. The first 30 characters must contain either the series name or the grape/region name — not filler words.

Quality checks — flag as WARNING if violated:
6. Does the format repeat any of the last 5 episode titles? Name the episode it repeats.
7. Is there a real hook (tension, surprise, contrast, or question)? Or is the subtitle just a label or description of what the wine is?
8. Two-audience test:
   - New listener: does the title tell them the wine AND give them a reason to click?
   - Loyal listener: does it feel specific to THIS episode, not generic?
9. Report the exact character count for each title.
10. If this is a series episode with a subtitle, does the subtitle add meaningful information beyond the wine name? Or is it redundant?

**Step 5: Score each proposed title.**

For each title:

AI Discovery Score (1–10):
- 9–10: Series name or grape name + region + strong search keyword all in first 30 chars
- 7–8: Grape or region present, clear topic signal
- 5–6: Topic present but not keyword-optimized
- 1–4: No grape or region, or vague

Clickability Score (1–10):
- 9–10: Genuine tension or surprise, passes both audiences, specific to this episode
- 7–8: Clear hook, interesting angle
- 5–6: Competent but forgettable — could describe any episode about this wine
- 1–4: No hook, generic, or just a description

**Return format:**

List each proposed title, then:
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
