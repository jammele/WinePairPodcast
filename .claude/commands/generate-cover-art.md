# /generate-cover-art

Generate 3 scored cover art concepts and ready-to-paste ChatGPT prompts for the current episode. Run before showing Joe any concepts. Do not skip this step.

## When to invoke

Any time Joe asks for a cover art image prompt, image concept, or ChatGPT prompt for an episode. This is the only workflow for cover art — do not generate concepts directly without the sub-agent.

## How to run

Before invoking:
1. Confirm you have the episode number, title, and key episode facts (wine, ratings, central angle, tone) from the script or conversation
2. Read `memory/feedback_cover_art.md` — character bible, approved style, recent scenes list, and all "what does NOT work" rules
3. Note the last 2–3 known episode scenes from the Recent Scenes section — these structural types must not be repeated

Then spawn a subagent with the instructions below, passing: episode number, title, key episode facts, approved style notes, and the last 2–3 known scenes.

## What Claude must show Joe after the sub-agent runs

Before presenting the concepts, output a one-paragraph confirmation block:

> **Cover art sub-agent ran.** Checked: character bible (Joe + Carmela descriptions), approved style (high-contrast wine-bar editorial cartoon, chunky outlines, flat color, burgundy palette, confirmed ep215), recent scene structures ([list what was checked]), brand rules (no anthropomorphized objects, one focal point, no text-dependent jokes, Joe and Carmela as leads). Each concept is scored on 5 criteria. Recommended concept is [X] (score [N]/50).

Then present the scored concepts. Do not present concepts without this confirmation block.

---

## Subagent instructions

Spawn an Agent with this prompt, substituting the actual episode details:

---

You are generating scored cover art concepts and ChatGPT prompts for The Wine Pair Podcast. Your job is to produce 3 distinct concepts that follow all brand rules, score each one rigorously, and make a clear recommendation. Be creative and specific. Reject any concept that fails a rule before including it.

**Episode details:**
- Episode number: [EP NUMBER]
- Title: [TITLE]
- Central angle / visual hook: [WHAT MAKES THIS EPISODE FUNNY OR INTERESTING]
- Wine details: [GRAPE, REGION, TONE, KEY FACTS]
- Ratings: [JOE AND CARMELA RATINGS]

**Approved visual style (confirmed working — ep215 onward):**
Style name: High-contrast wine-bar editorial cartoon. Chunky black ink outlines, flat saturated colors, oversized expressive faces and hands, theatrical body language, broad smiles, simple shapes, minimal shading, warm burgundy/red wine-bar palette. Feels like a magazine cover crossed with a premium adult animated comedy. Characters are affectionate caricatures — exaggerated but not grotesque. Humor comes from expressions, staging, and visual contrast. Square format, tight crop, one clear joke readable at thumbnail size.

**Character bible — use exactly as written in every prompt:**

Joe: Middle-aged man, salt-and-pepper hair, full salt-and-pepper beard, black rectangular glasses, dark navy pullover. Cartoon exaggeration: bigger smile, expressive eyes, oversized hands, mischievous curiosity.

Carmela: Middle-aged woman, medium-length warm brown hair, gold hoop earrings, dark top. Cartoon exaggeration: theatrical body language, sharp delighted reactions, bright amused smile.

**Recent episode scenes — do NOT repeat these structural types:**
[LAST 2-3 KNOWN SCENES AND THEIR STRUCTURAL LABELS]

**Brand rules — check every concept against all of these before including it:**

1. No anthropomorphized objects. Wine bottles do not have expressions, wear costumes, or react. Joe and Carmela are the characters. Wine is a prop.
2. Does not repeat any recent scene's structural type (not just the exact scene — "expert being ignored," "two people conspiring," "caught doing something transgressive," etc. are all structural types).
3. Readable as a standalone thumbnail with no text. The visual tells the joke on its own.
4. Does not require text, labels, or captions to work.
5. One clear visual punchline. No cluttered scenes with multiple competing focal points.
6. Humor comes from expressions, staging, and visual contrast — not from props alone.
7. Joe and Carmela are the central characters in every concept.
8. Matches the approved style: chunky outlines, flat color, burgundy palette, exaggerated faces, no realism.

**Scoring — score every concept on all 5 criteria:**

1. **Visual Arrest (1–10):** How eye-catching is this at podcast thumbnail size (typically ~100–200px square in a feed)? Does it stop a scroll? A high-contrast, dynamic scene with expressive faces scores higher than a static or soft composition.

2. **Click Potential (1–10):** Does the image create curiosity or desire to know more — without reading the title? Does it ask an implicit question the viewer wants answered? Generic "two people smiling" scores low. A specific visual incongruity or tension scores high.

3. **Brand Consistency (1–10):** Does it match the approved style (chunky outlines, flat color, burgundy palette, exaggerated faces)? Does it follow the character bible? Does it avoid structural types used in recent episodes? Does it feel like it belongs to this show's visual identity?

4. **Concept Originality (1–10):** Is the structural scene type fresh relative to known recent episodes? Penalize any structural similarity to recent scenes. Reward genuinely new stagings.

5. **Self-Explanatory Score (1–10):** Does the visual joke land with zero context — no title, no episode description? Imagine a new listener seeing only this image in a podcast app. Do they get the gag? Do they feel like they're missing something (bad) or intrigued (good)?

Score each criterion. Sum to a total out of 50. Show all scores.

**What you must produce:**

For each of the 3 concepts, output in this exact format:

---

**Concept [A/B/C]: [Short title]**

*The joke (one sentence):*

*Passes all brand rules:* YES or NO — if NO, list the rule violated and do not include this concept.

*Scores:*
- Visual Arrest: [N]/10 — [one-line reason]
- Click Potential: [N]/10 — [one-line reason]
- Brand Consistency: [N]/10 — [one-line reason]
- Concept Originality: [N]/10 — [one-line reason]
- Self-Explanatory: [N]/10 — [one-line reason]
- **Total: [N]/50**

*Scene description (primary approach — for use with reference image):*
3–5 sentences. Joe uploads the most recent approved cover art image in ChatGPT and pastes: "Use this as the style reference, but create a new scene. Do not copy the exact pose." followed by this description. Write it so it stands alone — ChatGPT will not know anything else about the show.

*Full fallback prompt (for use without reference image):*
The complete structured prompt below, with Scene and Composition sections filled in. Copy everything else exactly — do not shorten, reorder, or modify the Style, Character Bible, or Negative Prompt sections.

---

TEMPLATE (fill in Scene and Composition only):

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
[YOUR SCENE DESCRIPTION]

Composition:
Tight square crop.
Characters close to the viewer.
[MAIN FOCUS] are the main focus.
[BACKGROUND] fills the background but stays simple and uncluttered.
Clear visual hierarchy.
One clear joke readable at thumbnail size.
No text, no labels, no speech bubbles.

Negative prompt:
No photorealism. No realistic portrait. No painterly rendering. No soft gradients. No 3D gloss. No realistic aging lines. No skin texture. No generic stock-cartoon faces. No tiny expressions. No cluttered background. No text. No wine labels. No speech bubbles. Do not make Joe or Carmela look like real-person portraits. Keep them bold, graphic, exaggerated, and funny.

---

After all 3 concepts, output:

**Recommended: Concept [X] — [Total score]/50**
Reason: [Two sentences — why this concept wins on the scoring criteria and why it's the right choice for this episode specifically.]

---
