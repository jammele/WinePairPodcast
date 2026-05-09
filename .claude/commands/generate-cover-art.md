# /generate-cover-art

Generate 3 scored cover art concepts and ready-to-paste ChatGPT prompts for the current episode. Run before showing Joe any concepts. Do not skip this step.

## When to invoke

Any time Joe asks for a cover art image prompt, image concept, or ChatGPT prompt for an episode.

## How to run

Before invoking:
1. Confirm episode number, title, featured wine name, key episode facts (ratings, central angle, tone)
2. Read `memory/feedback_cover_art.md` — character bible, approved style, recent scenes, all rules
3. Note the last 2–3 known episode scene structures — must not be repeated

Then spawn a subagent with the instructions below.

## What Claude must show Joe after the sub-agent runs

Output this confirmation block before presenting concepts:

> **Cover art sub-agent ran.** Checked: character bible, approved style (ep215 gold-standard prompt structure — chunky black ink outlines, flat bold color, deep burgundy background, characters 70%+ of frame, wine bottle labeled with wine name), recent scene structures ([list]), all brand rules. Each concept scored on 5 criteria. Recommended: Concept [X] ([N]/50).

---

## Approved style — the ep215 prompt structure is the gold standard

Every prompt must follow this structure exactly. It produced the correct image on first try and defines the show's visual identity. Do not invent a new structure. Do not use a complex multi-section template. Follow this pattern:

```
Bold editorial cartoon illustration. [BRIEF SETTING — one simple phrase, e.g. "wine bar setting" or "dark burgundy background"].

[CHARACTER 1 description + position + expression + body language + what they are doing.]

[CHARACTER 2 description + position + expression + body language + what they are doing.]

[Any key props — e.g. the wine bottle and what its label says.]

Style: Chunky exaggerated editorial cartoon. Thick black ink outlines. Flat bold color areas with minimal shading. Oversized expressive faces and hands. Warm high-contrast palette. Deep burgundy background. Poster-like composition with clear visual hierarchy. New Yorker cover meets modern animated comedy. No photorealism. No gradients. Square format optimized for podcast thumbnail readability. Characters fill at least 70% of the frame, waist-up, close to the viewer.
```

**Critical rules for the prompt:**
- Background: always "deep burgundy background" or "simplified wine bar setting" — never an outdoor landscape, never a detailed scene, never "Sicilian patio" or any specific location
- Wine bottle: always specify the label text — "a bottle of red wine labeled 'FRAPPATO'" — never omit this
- "No wine labels" must NEVER appear in any prompt — it removes the key identifying prop
- Keep the prompt direct and brief, like ep215. Long multi-section templates drift from the style.
- Characters fill 70%+ of the frame — waist-up, close to the viewer

**Character bible — use exactly:**

Joe: Middle-aged man, salt-and-pepper hair, full salt-and-pepper beard, black rectangular glasses, dark navy pullover. Big friendly grin, mischievous curiosity, oversized expressive hands.

Carmela: Middle-aged woman, medium-length warm brown hair, gold hoop earrings, dark top. Theatrical body language, sharp delighted reactions, bright amused smile. Never stern or neutral — always expressive.

---

## Subagent instructions

Spawn an Agent with this prompt, substituting actual episode details:

---

You are generating scored cover art concepts and ChatGPT prompts for The Wine Pair Podcast. Produce 3 distinct, passing concepts. Score each one. Make a clear recommendation. Reject any concept that fails a rule.

**Episode details:**
- Episode number: [EP NUMBER]
- Title: [TITLE]
- Featured wine name (appears on bottle label): [WINE NAME]
- Central angle / visual hook: [WHAT MAKES THIS EPISODE INTERESTING OR FUNNY]
- Tone: [TONE]
- Ratings: [JOE AND CARMELA RATINGS]

**Approved style — the ep215 prompt is the gold standard. Every prompt must follow this structure:**

Bold editorial cartoon illustration. [Brief setting — one simple phrase]. [Character 1: position, expression, body language, action]. [Character 2: position, expression, body language, action]. [Key props]. Style: Chunky exaggerated editorial cartoon. Thick black ink outlines. Flat bold color areas with minimal shading. Oversized expressive faces and hands. Warm high-contrast palette. Deep burgundy background. Poster-like composition with clear visual hierarchy. New Yorker cover meets modern animated comedy. No photorealism. No gradients. Square format optimized for podcast thumbnail readability. Characters fill at least 70% of the frame, waist-up, close to the viewer.

Do NOT use a complex multi-section template. Keep the prompt direct and brief like the ep215 gold standard above. It is the structure that produced the approved image.

**Character bible:**

Joe: Middle-aged man, salt-and-pepper hair, full salt-and-pepper beard, black rectangular glasses, dark navy pullover. Big friendly grin, mischievous curiosity, oversized expressive hands.

Carmela: Middle-aged woman, medium-length warm brown hair, gold hoop earrings, dark top. Always theatrical — delighted, sharp, funny, bright amused smile. Never stern or neutral.

**Recent scenes — do NOT repeat these structural types:**
[LAST 2-3 KNOWN SCENES]

**Brand rules — every concept must pass all of these:**

1. No anthropomorphized objects. Wine and props do not react or have expressions.
2. No repeated structural scene type from recent episodes.
3. Visual joke lands without reading the title.
4. No text or captions needed to understand the joke.
5. One clear visual punchline. No competing focal points.
6. Humor from expressions, staging, and contrast — not props alone.
7. Joe and Carmela are the central characters.
8. Wine bottle has a readable label showing the wine name. "No wine labels" must NEVER appear in the prompt.
9. Background is simple and dark (deep burgundy or minimal wine bar) — never an outdoor landscape, never a detailed location scene.
10. Characters fill 70%+ of the frame, waist-up, close to viewer.

**Scoring — 5 criteria, 1–10 each:**

1. **Visual Arrest:** Eye-catching at ~150px thumbnail? High-contrast expressive close-up faces score high. Small characters or soft compositions score low.
2. **Click Potential:** Creates curiosity without reading the title? Specific visual incongruity scores high. Generic "two people with wine" scores low.
3. **Brand Consistency:** Matches ep215 style (chunky outlines, flat color, dark background, characters dominant, wine label visible)? Not structurally repetitive?
4. **Concept Originality:** Fresh structural type vs. recent episodes?
5. **Self-Explanatory:** Joke lands with zero context — no title, no description?

**Output format — use exactly:**

---

**Concept [A/B/C]: [Short title]**

*The joke:* [One sentence]

*Passes all brand rules:* YES / NO (if NO, list violated rule — do not include this concept)

*Scores:*
- Visual Arrest: [N]/10 — [one-line reason]
- Click Potential: [N]/10 — [one-line reason]
- Brand Consistency: [N]/10 — [one-line reason]
- Concept Originality: [N]/10 — [one-line reason]
- Self-Explanatory: [N]/10 — [one-line reason]
- **Total: [N]/50**

*Scene description (primary approach):*
3–5 sentences. Joe uploads the most recent approved cover art image in ChatGPT and pastes: "Use this as the style reference, but create a new scene. Do not copy the exact pose." followed by this description. Specify both characters' expressions and body language, the wine label text, and that the background is deep burgundy or a simple dark wine-bar setting — not an outdoor scene.

*ChatGPT prompt (gold-standard structure):*
Follow the ep215 prompt structure exactly. Brief, direct, one paragraph per character, then style block. Include the wine bottle label text. Background is "deep burgundy background" or "simplified [setting]". Do not use a long multi-section template.

---

After all 3 concepts:

**Recommended: Concept [X] — [Total]/50**
[Two sentences: why this concept wins and why it's right for this episode specifically.]

---
