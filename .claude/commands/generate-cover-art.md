# /generate-cover-art

Generate scored cover art concepts and ready-to-paste ChatGPT prompts for the current episode. Run before showing Joe any concepts. Do not skip this step.

## When to invoke

Any time Joe asks for a cover art image prompt, image concept, or ChatGPT prompt for an episode.

## How to run

When Joe asks for cover art:

Pre. **Read `data/cover-art-session-reports.md` before doing anything else.**
   Extract two things:
   - **Patterns Learned section:** note what structural types and visual angles Joe consistently selects and what he rejects. Let this shape concept generation.
   - **Prior entry for this wine/brand:** if one exists, note what structural types were tried before so concepts are not repeated across sessions.

0. **Physical situation brainstorm — do this before generating any concepts.**

   The best cover art starts from a funny physical situation, not from the title's theme. Do NOT ask "what tension does the title create?" — ask "what would be funny to watch happen?"

   Write 10 specific physical situations in the form: **"Joe is [action verb]ing [something] while Carmela [action verb]s [something]."** Every entry must use physical action verbs. The verbs "holds," "looks at," "examines," "leans toward," and "gestures at" are banned — they describe poses, not actions. Something must be HAPPENING in each situation.

   Draw from: the episode's central hook, any absurd facts, any funny visual contrasts the episode creates naturally. Then filter the 10 down to the 5 strongest by asking three questions about each:
   - Does it reveal the episode verdict? (if yes, cut it)
   - Does it actively contradict the title? (if yes, cut it)
   - Is it specific enough that it could not be reused for a generic wine episode? (if no, cut it)

   Then run 1 web search: "[wine/brand name] podcast thumbnail" to see what competitor visual conventions exist (to avoid or improve on them).

   Pass only the 5 filtered situations to the subagent as concept seeds — not thematic directions, not title alignment bullets. Situations.

   Also note for the session report:
   - **Two spoiler-gate directions (off-limits):** What would reveal the verdict rather than create curiosity? (these are still worth stating so the subagent can gate check)
   - **Web research finding:** one sentence on what the search returned.

1. Confirm episode number, title, featured wine name, key episode facts (ratings, central angle, tone).

2. Spawn a subagent with the instructions below, substituting actual episode details and the full title alignment analysis from Step 0. The sub-agent will read `data/cover-art-scenes.md` directly for the recent scenes list.

2.5 **Quality gate — enforce before second review.**
   After the first subagent returns, drop any concept that:
   - Scores below 40/50
   - Has a FAIL on brand rule 11 (spoiler) or brand rule 12 (title alignment)
   If fewer than 3 concepts remain, return to Step 2 and generate replacements before proceeding. Joe must always see at least 3 options. Never carry failing or sub-40 concepts into the second review.

3. **Spawn a second review subagent** on the surviving concepts only.
   Prompt: "You are a cover art critic for The Wine Pair Podcast. Read `docs/house-rules.md` in full, paying special attention to HR-40 and HR-14a. Then review each concept below for: (1) spoiler rule (HR-40) — does it reveal the episode verdict? (2) title gate — does it actively contradict the title? (3) HR-14a — does the scene description open with a physical action verb, or is it just a pose? (4) all 11 brand rules. (5) score accuracy — is the Scroll-Stop Power score justified? For each concept, state in one sentence why someone would stop scrolling for this image. If you cannot write a compelling one-sentence answer, flag for regeneration. Return PASS or FAIL for each concept with specific reasoning."
   No concept reaches Joe until the second pass returns no FAILs.

4. **Generate and show a Session Report** in the same response as the final concepts. Do not skip — do not make Joe ask for it. Append the entry to `data/cover-art-session-reports.md` and commit immediately.

   Report format:
   ```
   ---
   ## /generate-cover-art Session Report — Ep[N]: [Wine Name]

   ### Physical Situation Brainstorm (Step 0)
   - 10 situations generated: [one-line list]
   - 5 passed all three filters (no verdict reveal, no title contradiction, episode-specific): [list the 5]
   - Spoiler-gate directions (off-limits): [2 bullets]

   ### Web Research Finding
   [One sentence on what "[wine] podcast thumbnail" search showed]

   ### Concepts Generated
   [One line per concept: concept name — score — PASS/FAIL — key note]

   ### Quality Gate Decisions
   [Concepts dropped and why; or "none dropped"]

   ### Second Review Summary
   [One line per surviving concept: PASS/FAIL, scroll-stop justification, key note]

   ### Scroll-Stop Assessment
   [1-2 sentences: which concept has the strongest immediate visual reaction, and why? What made others weaker on this dimension?]
   ---
   ```

5. **Give a recommendation, then ask Joe which concept he wants.**
   State which concept you would choose and one sentence explaining why — the reason must be specific to this episode (not generic score-based language like "it scored highest"). Then ask: "Which concept would you like for Ep[N]?"

6. **After Joe confirms his choice — write the ChatGPT prompt.**
   Write the full multi-section ChatGPT prompt (see standard format below) for the selected concept only. Do not write prompts for rejected concepts. Present it ready to paste.

7. **After presenting the prompt:**
   - Append the full ChatGPT prompt to `outputs/episodes/ep[N]-[slug].md` under a `## COVER ART` section (HR-47). Use this format:
     ```
     ## COVER ART

     ### Ep[N] — [Concept Name] ([Score]/50)

     [Full ChatGPT prompt — ready to paste]
     ```
     If the output file does not exist, create it with just the COVER ART section and note that the rest of the content is pending.
   - Update the "Joe's selection" field in the Ep[N] entry in `data/cover-art-session-reports.md`
   - Update Patterns Learned if a new pattern is visible (e.g., Joe consistently picks tension-framing over verdict-framing)
   - Update `data/cover-art-scenes.md` — add the chosen concept's structural type, remove the oldest entry if the list exceeds 5
   - Commit all changed files

---

## Subagent instructions

Spawn an Agent with this prompt, substituting actual episode data:

---

You are generating scored cover art concepts and ChatGPT prompts for The Wine Pair Podcast.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule. Pay particular attention to HR-9 through HR-14 (cover art rules), HR-13 (scoring), and HR-40 (cover art spoiler ban).**

**Step 2: Read `data/cover-art-scenes.md`. Note the recent scene structures you must NOT repeat.**

After reading both files, proceed with concept generation.

---

**Episode details:**
- Episode number: [EP NUMBER]
- Title: [TITLE]
- Featured wine name (appears on bottle label): [WINE NAME]
- Central angle / visual hook: [WHAT MAKES THIS EPISODE INTERESTING OR FUNNY]
- Tone: [TONE]
- Ratings: [JOE AND CARMELA RATINGS]

**Concept seeds — physical situations generated in Step 0 (use these as your starting point for each concept):**
[5 PHYSICAL SITUATIONS FROM STEP 0 — each in the form "Joe is [verb]ing X while Carmela [verb]s Y"]

**Spoiler gate — these framings are OFF-LIMITS (reveal verdict):**
[2 DIRECTIONS THAT WOULD REVEAL THE EPISODE'S VERDICT]

**Recent scenes — do NOT repeat these physical actions:**
(Read from `data/cover-art-scenes.md` in Step 2 above — the specific physical actions described there must not be repeated.)

---

## The standard prompt format

The confirmed working approach is: **upload the most recent approved cover art image to ChatGPT as a style reference, then paste the full prompt below.**

Use this multi-section format for every concept. It is the proven working template (confirmed ep216). Do not change this format.

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
Characters fill at least 70% of the frame, waist-up, close to the viewer.
[Main focal elements] are the main focus.
[Background description — deep burgundy, or simple wine bar setting — never an outdoor scene or named location].
Clear visual hierarchy.
One clear joke readable at thumbnail size.
No text, no labels, no speech bubbles.

Negative prompt:
No photorealism. No realistic portrait. No painterly rendering. No soft gradients. No 3D gloss. No realistic aging lines. No skin texture. No generic stock-cartoon faces. No tiny expressions. No cluttered background. No text. No speech bubbles. Do not make Joe or Carmela look like real-person portraits. Keep them bold, graphic, exaggerated, and funny.

Use this as the style reference, but create a new scene. Do not copy the exact pose.
```

**One banned phrase — must never appear anywhere in your output:**
- `No wine labels` — this removes the key identifying prop and violates HR-10. The wine bottle must have a readable label showing the wine name (e.g., "labeled 'FRAPPATO'"). Include this in the Scene section.

---

## Brand rules — every concept must pass all 11

1. No anthropomorphized objects. Wine and props do not react or have expressions.
2. No repeated physical action from recent episodes (read `data/cover-art-scenes.md` — the specific actions there are banned, not just the abstract types).
3. Visual joke lands without reading the title.
4. No text or captions needed to understand the joke.
5. One clear visual punchline. No competing focal points.
6. Humor from expressions, staging, and contrast — not props alone.
7. Joe and Carmela are the central characters.
8. Wine bottle has a readable label showing the wine name — include in the Scene section.
9. Background is simple and dark — always "rich warm burgundy background" or "simplified wine bar setting." Never name a specific outdoor location.
10. Characters fill 70%+ of the frame, waist-up, close to the viewer — state this in the Composition section.
11. **Spoiler rule — FAIL if violated (HR-40).** The concept must NOT reveal the episode verdict, ratings outcome, or key finding. Test: does the thumbnail tell you what Joe and Carmela concluded before you press play? Thumbs up/down on specific bottles = FAIL. One bottle going to the sink = FAIL. The visual should create curiosity about the outcome, not announce it.

**Title alignment is a binary gate, not a brand rule.** After scoring, check: does this concept actively contradict the title OR reveal the verdict? If no to both, it passes the gate. Do not score title alignment — it is not one of the 5 criteria.

**Scene description requirement (HR-14a):** Every scene description must begin with: "Joe is [action verb]ing [something] while Carmela [action verb]s [something]." The verbs "holds," "looks at," "examines," "leans toward," and "gestures at" are banned as the opening action. If the only actions in a scene are from this banned list, revise until something is actually happening.

---

## Output format

First, output this confirmation block:

> **Cover art sub-agent ran.** Checked: character bible (HR-14), HR-14a (active verbs), approved style format, recent physical actions from cover-art-scenes.md ([list the specific actions]), all 11 brand rules including HR-40 (spoiler). Title gate applied (binary pass/fail only). Each concept scored on 5 criteria: Visual Arrest, Scroll-Stop Power, Episode Specificity, Concept Originality, Character Expressiveness. Recommended: Concept [X] ([N]/50).

Then present 5 concepts. For each:

---

**Concept [A/B/C/D/E]: [Short title] — [N]/50**

*Why you'd stop scrolling:* [One sentence — the immediate visual reaction before reading the title.]

*Scene:* [2-3 sentences. Must begin: "Joe is [action verb]ing [something] while Carmela [action verb]s [something]." Then describe expressions, body language, key props, wine bottle label, background.]

**Do NOT include a ChatGPT prompt here. Do NOT include a score breakdown. Do NOT include a brand rules checklist. Do NOT include a "title alignment" field — that is an internal gate, not a presented criterion.** The prompt is written only after Joe selects a concept (main agent Step 6). Score each concept internally using the 5 criteria — include scores only in the session report log, never in what Joe reads.

---

After all passing concepts:

**Recommended: Concept [X] — [Total]/50**
[Two sentences: why this concept wins and why it's right for this episode specifically.]
