# /generate-cover-art

Generate 3 cover art concepts and ready-to-paste ChatGPT prompts for the current episode. Run before showing Joe any concepts. Do not skip this step.

## When to invoke

Any time Joe asks for a cover art image prompt, image concept, or ChatGPT prompt for an episode. This is the only workflow for cover art — do not generate concepts directly without the sub-agent.

## How to run

Before invoking:
1. Confirm you have the episode number, title, and key episode facts (wine, ratings, central angle, tone) from the script or conversation
2. Read `memory/feedback_cover_art.md` to load the character bible, template rules, and all "what does NOT work" guidance
3. Identify the last 2–3 episode scenes from the Recent Scenes section of `memory/feedback_cover_art.md` — these must not be repeated

Then spawn a subagent with the instructions below, passing: episode number, title, key episode facts, and the last 2–3 known scenes.

## Subagent instructions

Spawn an Agent with this prompt, substituting the actual episode details:

---

You are generating cover art concepts and ChatGPT prompts for The Wine Pair Podcast. Your job is to produce 3 distinct, ready-to-paste concepts that follow all brand rules. Be creative and specific. Reject any concept that fails a rule before including it.

**Episode details:**
- Episode number: [EP NUMBER]
- Title: [TITLE]
- Central angle / visual hook: [WHAT MAKES THIS EPISODE FUNNY OR INTERESTING]
- Wine details: [GRAPE, REGION, TONE, KEY FACTS]
- Ratings: [JOE AND CARMELA RATINGS]

**Character bible — use exactly as written in every prompt:**

Joe: Middle-aged man, salt-and-pepper hair, full salt-and-pepper beard, black rectangular glasses, dark navy pullover. Cartoon exaggeration: bigger smile, expressive eyes, oversized hands, mischievous curiosity.

Carmela: Middle-aged woman, medium-length warm brown hair, gold hoop earrings, dark top. Cartoon exaggeration: theatrical body language, sharp delighted reactions, bright amused smile.

**Recent episode scenes — do NOT repeat these:**
[LAST 2-3 KNOWN SCENES]

**Rules — check every concept against all of these before including it:**

1. No anthropomorphized objects. Wine bottles do not have expressions, wear costumes, or react. Joe and Carmela are the characters. Wine is a prop.
2. Does not repeat any recent scene structure (not just the exact scene — the structural type: "expert being ignored," "two people conspiring," etc.)
3. Readable as a standalone thumbnail with no text. The visual tells the joke on its own.
4. Does not require text, labels, or captions to work.
5. One clear visual punchline. No cluttered scenes with multiple competing focal points.
6. Humor comes from expressions, staging, and visual contrast — not from the wine props alone.
7. Joe and Carmela must be the central characters in every concept.

**What you must produce:**

For each of the 3 concepts:

**Concept [X]: [One-line title]**
*The joke:* One sentence.

*Scene description (primary approach):* 3–5 sentences. Joe uploads the most recent approved cover art image in ChatGPT and pastes: "Use this as the style reference, but create a new scene. Do not copy the exact pose." followed by this description. Write it so it stands alone with no context — ChatGPT will not know anything else about the show.

*Full fallback prompt:* The complete structured prompt below, with Scene and Composition sections filled in. Do not shorten, reorder, or modify any other section of the template.

---

TEMPLATE (fill in Scene and Composition only — copy everything else exactly):

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

After all 3 concepts, add one line: "Recommended: Concept [X]" with a single-sentence reason.

---
