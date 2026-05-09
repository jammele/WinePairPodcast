# /generate-cover-art

Generate 3 scored cover art concepts and ready-to-paste ChatGPT prompts for the current episode. Run before showing Joe any concepts. Do not skip this step.

## When to invoke

Any time Joe asks for a cover art image prompt, image concept, or ChatGPT prompt for an episode.

## How to run

When Joe asks for cover art:

1. Confirm episode number, title, featured wine name, key episode facts (ratings, central angle, tone)
2. Spawn a subagent with the instructions below, substituting actual episode details. The sub-agent will read `data/cover-art-scenes.md` directly for the recent scenes list.

---

## Subagent instructions

You are generating scored cover art concepts and ChatGPT prompts for The Wine Pair Podcast.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule in it. Pay particular attention to HR-9 through HR-14 (cover art rules) and HR-13 (scoring requirement).**

**Step 2: Read `data/cover-art-scenes.md`. This file contains the recent scene structures you must NOT repeat. Note them before generating any concepts.**

After reading both files, proceed with concept generation.

---

**Episode details:**
- Episode number: [EP NUMBER]
- Title: [TITLE]
- Featured wine name (appears on bottle label): [WINE NAME]
- Central angle / visual hook: [WHAT MAKES THIS EPISODE INTERESTING OR FUNNY]
- Tone: [TONE]
- Ratings: [JOE AND CARMELA RATINGS]

**Recent scenes — do NOT repeat these structural types:**
(Read from `data/cover-art-scenes.md` in Step 2 above.)

---

## The standard prompt format

The confirmed working approach is: **upload the most recent approved cover art image to ChatGPT as a style reference, then paste the full prompt below.**

Use this multi-section format for every concept. It is the proven working template (confirmed ep216).

```
Create a square editorial cartoon illustration for a wine podcast cover image.

Use this style exactly:

Style name: High-contrast wine-bar editorial cartoon

A bold, graphic, exaggerated cartoon style with chunky black ink outlines, flat saturated colors, oversized expressive faces and hands, theatrical body language, broad smiles, simple shapes, minimal shading, and a warm burgundy/red wine-bar palette. The image should feel like a magazine cover crossed with a premium adult animated comedy. It should be funny, energetic, and readable at small podcast-thumbnail size.

Important style rules:
Do not make this realistic.
Do not make the characters portrait-like.
Do not add realistic skin texture, realistic facial anatomy, painterly detail, soft lighting, gradients, or 3D effects.
The people should be affectionate recurring cartoon host characters, not realistic portraits.
Use simplified, exaggerated animated-comedy proportions.
The characters should be expressive and specific, but not detailed or lifelike.
The humor should come from expressions, staging, and visual contrast.

Recurring character bible:

Joe is a middle-aged cartoon man. He has black rectangular glasses, a full salt-and-pepper beard, salt-and-pepper hair, thick expressive eyebrows, and a dark navy pullover. He should have a big friendly grin, curious mischievous energy, and oversized expressive hands. He should look like a recurring animated version of Joe, not a realistic portrait and not a generic cartoon dad.

Carmela is a middle-aged cartoon woman. She has medium-length warm brown hair, gold hoop earrings, expressive eyes, a dark top, and a bright amused smile. She should have theatrical body language and a delighted, sharp, funny reaction. She should look like a recurring animated version of Carmela, not a realistic portrait and not a generic surprised woman.

Scene:
[SCENE DESCRIPTION — both characters, expressions, body language, what they are doing, key props, wine bottle label text, background]

Composition:
Tight square crop.
Characters close to the viewer.
[Main focal elements] are the main focus.
[Background description — deep burgundy, or simple wine bar setting — never an outdoor scene or named location].
Clear visual hierarchy.
One clear joke readable at thumbnail size.
No text, no labels, no speech bubbles.

Negative prompt:
No photorealism. No realistic portrait. No painterly rendering. No soft gradients. No 3D gloss. No realistic aging lines. No skin texture. No generic stock-cartoon faces. No tiny expressions. No cluttered background. No text. No speech bubbles. Do not make Joe or Carmela look like real-person portraits. Keep them bold, graphic, exaggerated, and funny.

Use this as the style reference, but create a new scene. Do not copy the exact pose.
```

**One banned phrase — must never appear anywhere in the negative prompt or anywhere else in your output:**
- `No wine labels` — this removes the key identifying prop and violates HR-10. The wine bottle must have a readable label showing the wine name (e.g., "labeled 'FRAPPATO'"). Include this in the Scene section.

---

## Brand rules — every concept must pass all of these

1. No anthropomorphized objects. Wine and props do not react or have expressions.
2. No repeated structural scene type from recent episodes.
3. Visual joke lands without reading the title.
4. No text or captions needed to understand the joke.
5. One clear visual punchline. No competing focal points.
6. Humor from expressions, staging, and contrast — not props alone.
7. Joe and Carmela are the central characters.
8. Wine bottle has a readable label showing the wine name — include this in the Scene section.
9. Background is simple and dark — always "rich warm burgundy background" or "simplified wine bar setting." Never name a specific outdoor location.
10. Characters fill 70%+ of the frame, waist-up, close to the viewer — state this in the Composition section.

---

## Output format

First, output this confirmation block:

> **Cover art sub-agent ran.** Checked: character bible (Joe + Carmela descriptions from house-rules.md HR-14), approved style (multi-section format — Style name, Important style rules, Recurring character bible, Scene, Composition, Negative prompt), recent scene structures ([list the scenes you were given]), all 10 brand rules. Each concept scored on 5 criteria. Recommended: Concept [X] ([N]/50).

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

*Scene description (what this looks like in plain English):*
[2-3 sentences. What Joe and Carmela are doing, their expressions, the visual punchline.]

*ChatGPT prompt — upload approved reference image first, then paste this:*
[Full multi-section format. Scene section filled in for this concept. Wine bottle label text included. Background is deep burgundy or simple wine bar — no outdoor scene. No "No wine labels" anywhere.]

---

After all 3 concepts:

**Recommended: Concept [X] — [Total]/50**
[Two sentences: why this concept wins and why it's right for this episode specifically.]

---

**Important reminder for the main agent after Joe picks a concept:**
Update `data/cover-art-scenes.md` — add the chosen concept's structural type to the Recent Scenes list. Remove oldest entry if the list exceeds 5 items.
