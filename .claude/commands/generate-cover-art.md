# /generate-cover-art

Generate 3 scored cover art concepts and ready-to-paste ChatGPT prompts for the current episode. Run before showing Joe any concepts. Do not skip this step.

## When to invoke

Any time Joe asks for a cover art image prompt, image concept, or ChatGPT prompt for an episode.

## How to run

When Joe asks for cover art:

1. Confirm episode number, title, featured wine name, key episode facts (ratings, central angle, tone)
2. Read `C:\Users\jamme\.claude\projects\C--Users-jamme-podcast-os\memory\feedback_cover_art.md` — extract the full "Recent scenes" list verbatim. You will paste this into the subagent prompt below. Do not summarize it. Do not skip this step. Subagents cannot read this file themselves.
3. Spawn a subagent with the instructions below, substituting actual episode details AND the recent scenes you just extracted.

---

## Subagent instructions

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
[PASTE THE FULL RECENT SCENES LIST FROM feedback_cover_art.md HERE — main agent extracted this before spawning you]

---

## The approved prompt format — ep215 gold standard

**This is the only acceptable format for fallback prompts. Read it carefully and match it exactly.**

> Bold editorial cartoon illustration. Three characters in a simplified wine bar setting. Left and center: Joe (middle-aged man, salt-and-pepper hair, full salt-and-pepper beard, black rectangular glasses, dark navy pullover) and Carmela (middle-aged woman, medium-length warm brown hair, gold hoop earrings, dark top) are turned toward each other, clinking wine glasses and grinning. Their glasses have small "$23" price tags dangling from the stems. Their body language is warm, conspiratorial, triumphant. They are completely ignoring what is happening behind them. Far right: A pompous cartoon sommelier in a black tuxedo, bow tie, and sommelier's chain. He is holding a silver presentation tray with a tall elegant wine bottle labeled "$50" on it, bowing slightly with great ceremony toward Joe and Carmela. He has turned to present the bottle and realized no one is looking at him. His expression is crestfallen, confused, slightly offended. He is being completely ignored. Style: Chunky exaggerated editorial cartoon. Thick black ink outlines. Flat bold color areas with minimal shading. Oversized expressive faces and hands. Warm high-contrast palette. Deep burgundy background. Poster-like composition with clear visual hierarchy. New Yorker cover meets modern animated comedy. No photorealism. No gradients. No text in the image. Square format optimized for podcast thumbnail readability.

**Structure of this prompt:**
- One brief opening line: art style + setting
- One paragraph per character: position, expression, body language, what they are doing
- One style block at the end

**That is the entire format. Nothing else.**

**Banned sections — if any of these appear in your fallback prompt, delete them before outputting:**
- `Style name:`
- `Important style rules:`
- `Recurring character bible:`
- `Composition:`
- `Negative prompt:`

**Banned phrase — must never appear anywhere in your output:**
- `No wine labels` — this removes the key identifying prop and violates HR-10

---

## Brand rules — every concept must pass all of these

1. No anthropomorphized objects. Wine and props do not react or have expressions.
2. No repeated structural scene type from recent episodes.
3. Visual joke lands without reading the title.
4. No text or captions needed to understand the joke.
5. One clear visual punchline. No competing focal points.
6. Humor from expressions, staging, and contrast — not props alone.
7. Joe and Carmela are the central characters.
8. Wine bottle has a readable label showing the wine name (e.g., "labeled 'FRAPPATO'").
9. Background is simple and dark — always "deep burgundy background" or "simplified wine bar setting." Never an outdoor scene, never a named location.
10. Characters fill 70%+ of the frame, waist-up, close to the viewer — state this explicitly in every prompt.

---

## Output format

First, output this confirmation block:

> **Cover art sub-agent ran.** Checked: character bible (Joe + Carmela descriptions from house-rules.md HR-14), approved style (ep215 gold-standard prompt structure — one paragraph per character, one style block, no extra sections), recent scene structures ([list the scenes you were given], all 10 brand rules. Each concept scored on 5 criteria. Recommended: Concept [X] ([N]/50).

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

---

**(PRIMARY) Scene description — paste this into ChatGPT after uploading the reference image:**

> "Use this as the style reference, but create a new scene. Do not copy the exact pose."

[3-5 sentences. Both characters' expressions, body language, what they are doing. Wine bottle label text. Background: deep burgundy or simple dark wine-bar — never an outdoor scene.]

---

**(FALLBACK) Full ChatGPT prompt — only use this if no approved reference image is available:**

[Follow the ep215 structure exactly: brief opening line, one paragraph per Joe, one paragraph per Carmela, props paragraph, style block. No extra sections. No negative prompt. No "No wine labels." Wine bottle label text must appear. Characters fill 70%+ of frame stated explicitly.]

---

After all 3 concepts:

**Recommended: Concept [X] — [Total]/50**
[Two sentences: why this concept wins and why it's right for this episode specifically.]

---

**Important reminder for the main agent after Joe picks a concept:**
Update `C:\Users\jamme\.claude\projects\C--Users-jamme-podcast-os\memory\feedback_cover_art.md` — add the chosen concept's structural type to the Recent Scenes list. Remove oldest entry if list exceeds 4 items.
