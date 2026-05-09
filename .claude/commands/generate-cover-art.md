# /generate-cover-art

Generate 3 scored cover art concepts and ready-to-paste ChatGPT prompts for the current episode. Run before showing Joe any concepts. Do not skip this step.

## When to invoke

Any time Joe asks for a cover art image prompt, image concept, or ChatGPT prompt for an episode.

## How to run

When Joe asks for cover art:
1. Confirm episode number, title, featured wine name, key episode facts (ratings, central angle, tone)
2. Spawn a subagent with the instructions below

---

## Subagent instructions

Spawn an Agent with this prompt, substituting actual episode details:

---

You are generating scored cover art concepts and ChatGPT prompts for The Wine Pair Podcast.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule in it. Pay particular attention to HR-9 through HR-14 (cover art rules) and HR-13 (scoring requirement).**

After reading house-rules.md, proceed with concept generation.

---

**Episode details:**
- Episode number: [EP NUMBER]
- Title: [TITLE]
- Featured wine name (appears on bottle label): [WINE NAME]
- Central angle / visual hook: [WHAT MAKES THIS EPISODE INTERESTING OR FUNNY]
- Tone: [TONE]
- Ratings: [JOE AND CARMELA RATINGS]

**Recent scenes — do NOT repeat these structural types:**
[LAST 2-3 KNOWN SCENES FROM memory/feedback_cover_art.md]

---

## The approved prompt structure (ep215 gold standard — follow exactly)

```
Bold editorial cartoon illustration. [Brief setting — one simple phrase, e.g. "deep burgundy background" or "simplified wine bar setting"].

[Character 1: position, expression, body language, what they are doing.]

[Character 2: position, expression, body language, what they are doing.]

[Key props — wine bottle and what its label says.]

Style: Chunky exaggerated editorial cartoon. Thick black ink outlines. Flat bold color areas with minimal shading. Oversized expressive faces and hands. Warm high-contrast palette. Deep burgundy background. Poster-like composition with clear visual hierarchy. New Yorker cover meets modern animated comedy. No photorealism. No gradients. Square format optimized for podcast thumbnail readability. Characters fill at least 70% of the frame, waist-up, close to the viewer.
```

**Critical rules for every prompt (from house-rules.md):**
- Background: always "deep burgundy background" or "simplified wine bar setting" — never an outdoor landscape, never a named location
- Wine bottle: always specify the label text (e.g., "labeled 'FRAPPATO'") — this is required
- "No wine labels" must NEVER appear in any prompt — it removes the key identifying prop
- Characters fill 70%+ of the frame — waist-up, close to the viewer — state this explicitly
- Keep the prompt brief and direct, like ep215. No long multi-section templates.

---

## Brand rules — every concept must pass all of these

1. No anthropomorphized objects. Wine and props do not react or have expressions.
2. No repeated structural scene type from recent episodes.
3. Visual joke lands without reading the title.
4. No text or captions needed to understand the joke.
5. One clear visual punchline. No competing focal points.
6. Humor from expressions, staging, and contrast — not props alone.
7. Joe and Carmela are the central characters.
8. Wine bottle has a readable label showing the wine name.
9. Background is simple and dark — never an outdoor landscape or detailed location scene.
10. Characters fill 70%+ of the frame, waist-up.

---

## Output format

First, output this confirmation block:

> **Cover art sub-agent ran.** Checked: character bible (Joe + Carmela descriptions from house-rules.md HR-14), approved style (ep215 gold-standard prompt structure — chunky black ink outlines, flat bold color, deep burgundy background, characters 70%+ of frame, wine bottle labeled with wine name), recent scene structures ([list the scenes you checked]), all 10 brand rules. Each concept scored on 5 criteria. Recommended: Concept [X] ([N]/50).

Then present 3 concepts. For each:

---

**Concept [A/B/C]: [Short title]**

*The joke:* [One sentence]

*Passes all brand rules:* YES / NO (if NO, do not include this concept)

*Scores:*
- Visual Arrest: [N]/10 — [one-line reason]
- Click Potential: [N]/10 — [one-line reason]
- Brand Consistency: [N]/10 — [one-line reason]
- Concept Originality: [N]/10 — [one-line reason]
- Self-Explanatory: [N]/10 — [one-line reason]
- **Total: [N]/50**

*Scene description (primary approach):*
Joe uploads the most recent approved cover art image in ChatGPT and pastes: "Use this as the style reference, but create a new scene. Do not copy the exact pose." followed by this description. 3-5 sentences. Both characters' expressions and body language. Wine label text. Background is deep burgundy or simple dark wine-bar — not an outdoor scene.

*ChatGPT prompt (ep215 structure — brief, direct):*
Follow the ep215 structure exactly. One paragraph per character. Style block at end. Wine bottle label text included. Background is "deep burgundy background" or "simplified [setting]". Characters fill 70%+ of frame stated explicitly.

---

After all 3 concepts:

**Recommended: Concept [X] — [Total]/50**
[Two sentences: why this concept wins and why it's right for this episode specifically.]

---
