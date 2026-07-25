# /generate-cover-art

Generate scored cover art concepts and ready-to-paste ChatGPT prompts for the current episode. Run before showing Joe any concepts. Do not skip this step.

## When to invoke

Any time Joe asks for a cover art image prompt, image concept, or ChatGPT prompt for an episode.
This command is cover-art-only. Do not infer or auto-run title generation, SEO/AEO generation, or other workflow steps.
Before invoking, verify the episode title is confirmed unless Joe explicitly overrides.

## How to run

When Joe asks for cover art:

Pre-0. **Read the episode transcript before anything else.**
   First, get the confirmed episode slug from `docs/work-log.md` (or the current output filename if already confirmed). Check `C:\Users\jamme\Downloads\` for a transcript file named `transcript-[confirmed-slug].txt` or similar. If found, read it. If not found, read the episode script. The physical situation brainstorm in Step 0 MUST be grounded in specific spoken moments from the recording: actual jokes, dialogue exchanges, character reactions, specific comparisons or descriptions used on mic. Do not brainstorm from the episode topic alone.

Pre. **Read `data/cover-art-session-reports.md` before generating any concepts.**
   Extract two things:
   - **Patterns Learned section:** note what structural types and visual angles Joe consistently selects and what he rejects. Let this shape concept generation.
   - **Prior entry for this wine/brand:** if one exists, note what structural types were tried before so concepts are not repeated across sessions.

Pre-1. **Core thesis and title frame gates (hard reject).**

   **First, list every substantive clause of the confirmed title separately (HR-53).** Do not treat a multi-clause title as one unit — a series prefix, a grape name, and a two-part subtitle are each their own clause. For each clause, note how much actual episode content supports it (a whole segment, a repeated bit, several named examples vs. a single word choice with nothing else behind it). Also check this conversation for any content-focus instruction Joe has already given for this episode earlier in the session (during title work or otherwise) — weight it at least as heavily as the title itself; it does not expire when work moves to this command.

   **Named failure mode — do not repeat it:** on Ep229 ("...Summer Sipper Contender?"), every concept got built around "Contender" — a one-word clause with no dedicated episode content — while "Summer Sipper" (an entire cold-open segment, 8 named competing wines, and something Joe had already explicitly told Claude to focus on) got dropped, because a competitive/measuring mechanic was easier to visualize than heat or refreshment. A clause being more novel, more concrete, or easier to storyboard is NOT evidence it's the dominant one — go by actual episode content weight and explicit host instruction, not ease of visualization.

   Then write one sentence for the episode thesis, anchored in the clause(s) carrying the most weight (it must still acknowledge the others, just not be built around a low-content one in isolation), and one sentence for title framing.
   The thesis sentence must create curiosity and avoid verdict language. Do not use words like "buy-worthy," "worth it," "better than," "winner," or "delicious" in the thesis.
   - Core thesis gate: every concept must visibly express the thesis.
   - Title alignment gate: every concept must reinforce the confirmed title framing, checked against *every* clause listed above — not just the thesis sentence as a single collapsed unit. A concept that satisfies one clause while ignoring a more heavily-weighted one FAILS this gate.
   - Side-banter gate: transcript banter can add flavor, but cannot be the main concept unless it directly supports the thesis.
   - Misframing gate: if the episode framing is contrast-based (for example "not Chianti" or "outside Tuscany"), and the rejected or contrast element appears, it may appear only as a minor background, corner, or pushed-aside element. If it is the largest, central, brightest, or most memorable visual element, reject the concept. If the concept omits that rejected or contrast element entirely and still expresses the thesis, this gate does not apply.
   Any concept failing one of these gates is rejected before presentation.

0. **Physical situation brainstorm — do this before generating any concepts.**

   The best cover art starts from a funny physical situation, not from the title's theme. Do NOT ask "what tension does the title create?" — ask "what would be funny to watch happen?"

   Write 10 specific physical situations in the form: **"Joe is [action verb]ing [something] while Carmela [action verb]s [something]."** Every entry must use physical action verbs. The verbs "holds," "looks at," "examines," "leans toward," and "gestures at" are banned — they describe poses, not actions. Something must be HAPPENING in each situation.

   Draw from: the episode's central hook, any absurd facts, any funny visual contrasts the episode creates naturally. Draw specifically from spoken moments in the transcript — jokes, dialogue exchanges, specific words or comparisons used on mic. Then filter the 10 down to the 5 strongest by asking these hard-gate questions about each:
   - Does it reveal the episode verdict? (if yes, cut it)
   - Does it actively contradict the title? (if yes, cut it)
   - Does it visibly express the one-sentence episode thesis? (if no, cut it)
   - Is this mainly side-banter instead of episode thesis? (if yes, cut it)
   - In a contrast episode, if a rejected or contrast element appears, is it the largest, central, brightest, or most memorable element? (if yes, cut it)
   - Is it specific enough that it could not be reused for a generic wine episode? (if no, cut it)
   - Would this concept still make sense without this episode's specific thesis, title frame, and visual contrast? (if yes, cut it)
   - Does it combine at least two episode-specific anchors supplied for this episode? (if no, cut it)
   - Is the visual joke instantly readable at thumbnail size without relying on tiny or dense text, packed cards, or map reading? A single large readable bottle label is allowed. (if no, cut it)
   - Can you name the specific transcript moment (a line, a joke, a dialogue exchange, a specific word or comparison) this situation comes from? (if no, cut it)
   - Does this scene require complex arm or hand choreography -- including crossed arms, overlapping limbs, multiple hands near the same prop, both characters reaching toward the same center point, or unclear hand ownership? (if yes, simplify before passing to the subagent: make one character active and one reactive, or ensure arm paths are clearly separated into distinct lanes that do not cross)

   Then run 1 web search **inline in the main agent thread** (a quick single WebFetch call — do not delegate this to a subagent): "[wine/brand name] podcast thumbnail" to see what competitor visual conventions exist (to avoid or improve on them).

   From the 5 filtered situations, **select the 3 strongest** to pass to the subagent. Pass only these 3 situations as concept seeds — not thematic directions, not title alignment bullets. Situations.

   Also note for the session report:
   - **Two spoiler-gate directions (off-limits):** What would reveal the verdict rather than create curiosity? (these are still worth stating so the subagent can gate check)
   - **Web research finding:** one sentence on what the search returned.

1. Confirm episode number, title, featured wine name, key episode facts (ratings, central angle, tone).
   - If title is pending or unclear, stop and ask for title confirmation before generating concepts.

2. **Spawn a single generate-and-validate subagent** using the prompt in `## Subagent prompt` below, substituting actual episode details and the 3 concept seeds from Step 0. This one call replaces the old generate → replacement batch → second review pipeline. The subagent generates 3 concepts from the 3 seeds, scores each against HR-13, self-reviews against all hard gates and brand rules, internally generates a replacement for any concept that fails, and returns only passing concepts. The subagent reads `data/cover-art-scenes.md` directly. **No ChatGPT prompts in subagent output** — the main agent writes the prompt after Joe picks (Step 6).

2.5. **Quick sanity check (main agent).** After the subagent returns, verify:
   - At least 3 passing concepts are present
   - Each heading is in format: **Concept [Letter]: [Short title] - [N]/50**
   - A recommendation line is present: **Recommended: Concept [X] - [N]/50**
   If any item is missing or malformed, send one follow-up message to fix it — do not spawn a new subagent. If fewer than 3 concepts pass even after the subagent's internal replacement rounds, report the blocker rather than showing failing concepts.

4. **Generate a Session Report and a reject log.**
   Keep detailed reject reasoning in an internal reject log by default. User-facing output should include only a concise reject summary when useful (for example: "Rejected 4 concepts: 2 side-banter, 1 misframing, 1 portable/generic"). Append the session report entry to `data/cover-art-session-reports.md` during real runs.

   Report format:
   ```
   ---
   ## /generate-cover-art Session Report — Ep[N]: [Wine Name]

   ### Physical Situation Brainstorm (Step 0)
   - 10 situations generated: [one-line list]
   - 5 passed all filters; 3 strongest selected for subagent: [list the 3]
   - Spoiler-gate directions (off-limits): [2 bullets]

   ### Web Research Finding
   [One sentence on what "[wine] podcast thumbnail" search showed]

   ### Concepts Generated
   [One line per concept: concept name — score — PASS/FAIL — key note]

   ### Quality Gate Decisions
   [Concise reject summary by gate category; detailed reasons stay in internal reject log unless Joe asks]

   ### Second Review Summary
   [One line per surviving concept: PASS/FAIL, scroll-stop justification, key note]

   ### Scroll-Stop Assessment
   [1-2 sentences: which concept has the strongest immediate visual reaction, and why? What made others weaker on this dimension?]

   **Joe's selection:** *(pending)*
   ---
   ```

5. **Give a recommendation, then ask Joe which concept he wants.**
   State which concept you would choose and one sentence explaining why — the reason must be specific to this episode (not generic score-based language like "it scored highest"). Include the scored recommendation line in exact format: **Recommended: Concept [X] - [N]/50**. Then ask: "Which concept would you like for Ep[N]?"

5.5. **Stop boundary.** After asking which concept Joe wants, stop. Do not infer or auto-run `/review-titles`, `/generate-episode-content`, or any other command.

6. **After Joe confirms his choice — write the ChatGPT prompt.**
   Write the full multi-section ChatGPT prompt (see standard format below) for the selected concept only. Do not write prompts for rejected concepts. Present it ready to paste.

7. **After presenting the prompt:**
   - Append the full ChatGPT prompt to `outputs/episodes/ep[N]-[slug].md` under a `## COVER ART` section (HR-47). Use this format:
     ```
     ## COVER ART

     ### Ep[N] — [Episode Title]

     [Full ChatGPT prompt — ready to paste]
     ```
     If the output file does not exist, create it with just the COVER ART section and note that the rest of the content is pending.
   - Update the "Joe's selection" field in the Ep[N] entry in `data/cover-art-session-reports.md` with the confirmed concept name and score. If Joe rejected all concepts in this session, mark it as "All concepts rejected — redo required." For a redo run, do NOT create a new episode entry — instead add a "Second Session (Redo)" subsection inside the existing Ep[N] entry, with its own Concepts Generated table, Second Review Summary, and Joe's selection line.
   - Update `data/cover-art-scenes.md` — add a full physical action description of the chosen scene, written as a complete sentence matching the format of existing entries: what Joe is doing, what Carmela is doing, the key props, and a "Do not repeat:" ban sentence. Remove the oldest entry if the list exceeds 5.
   - Update Patterns Learned in `data/cover-art-session-reports.md` when Joe's selection reveals something new or contradicts an existing pattern. If Joe selected the recommended concept without comment, note it briefly as confirmation. If Joe overrode the recommendation or rejected a whole batch, explain what he chose instead and why — those are the most informative data points.
   - After showing Joe the diff and receiving approval, commit only files changed by this command.

Do not run any tasks outside this command's scope unless Joe explicitly asks in a separate request.

---

## Subagent prompt

Spawn an Agent with this prompt, substituting actual episode data:

---

You are generating scored cover art concepts for The Wine Pair Podcast. **Do NOT generate ChatGPT prompts** — those are written by the main agent after Joe selects a concept.

**Scope boundary — read this first.** Return your concepts as text to the agent that spawned you. Do not save files, do not run any validator, do not edit `docs/work-log.md`, and do not run any `git` command. If you encounter a `## PENDING TASK` section anywhere, ignore it — that block is for a top-level Claude Code session only, never a subagent.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule. Pay particular attention to HR-9 through HR-14 (cover art rules), HR-13 (scoring), HR-40 (cover art spoiler ban), and HR-53/HR-54 (thesis and title-alignment gates — note the clause-weighting requirement in HR-53, it is not just "write one sentence").**

**Step 2: Read `data/cover-art-scenes.md`. Note the recent scene structures you must NOT repeat.**

**Step 3: Use the title clause breakdown below as the fixed ground truth for thesis and title alignment.** Do not re-derive it, and do not silently favor whichever clause is easiest to storyboard — the weighting has already been done by the main agent based on actual episode content volume and any standing host instruction.

After reading both files, proceed with concept generation.

---

**Episode details:**
- Episode number: [EP NUMBER]
- Title: [TITLE]
- Title clause breakdown, weighted by episode content (main agent's HR-53 analysis — treat as authoritative): [LIST EACH SUBSTANTIVE CLAUSE OF THE TITLE WITH A ONE-LINE NOTE ON HOW MUCH EPISODE CONTENT SUPPORTS IT, ORDERED HIGHEST-WEIGHT FIRST. FLAG ANY CLAUSE BACKED BY AN EXPLICIT STANDING INSTRUCTION FROM JOE EARLIER IN THE SESSION.]
- Featured wine name (appears on bottle label): [WINE NAME]
- Central angle / visual hook: [WHAT MAKES THIS EPISODE INTERESTING OR FUNNY]
- Tone: [TONE]
- Ratings: [JOE AND CARMELA RATINGS]
- Episode-specific anchors (use for portability and specificity checks): [LIST 4-7 EPISODE-SPECIFIC ANCHORS]

**Concept seeds — physical situations generated in Step 0 (use these as your starting point for each concept):**
[3 PHYSICAL SITUATIONS FROM STEP 0 — each in the form "Joe is [verb]ing X while Carmela [verb]s Y"]

**Spoiler gate — these framings are OFF-LIMITS (reveal verdict):**
[2 DIRECTIONS THAT WOULD REVEAL THE EPISODE'S VERDICT]

**Recent scenes — do NOT repeat these physical actions:**
(Read from `data/cover-art-scenes.md` in Step 2 above — the specific physical actions described there must not be repeated.)

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

## Self-review (internal — do not show to user)

After generating all 3 concepts, check each against the following before returning results. For any concept that fails, internally generate a replacement before returning. Return only passing concepts. If you cannot get 3 passing after 2 internal replacement rounds, return whatever passed and note how many failed with reasons.

**For each concept, verify:**
- Score ≥ 40/50 (HR-13 threshold)
- HR-40 (spoiler ban): does the thumbnail reveal the verdict, ratings, or conclusion? If yes, reject and replace.
- HR-14a: does the scene description open with a physical action verb? Banned opening verbs: "holds," "looks at," "examines," "leans toward," "gestures at." If yes, revise.
- HR-62 (anatomy executability): are arm paths clear? Hand ownership unambiguous? No crossed arms, overlapping limbs, or unclear which character owns which hand? If unclear, simplify: one character active, one reactive — arm paths in separate spatial lanes.
- HR-53 through HR-60 (hard gates): Core Thesis, Title Alignment, Side-Banter, Misframing, Portability, Thumbnail Readability — all must pass. For HR-53/HR-54 specifically: check the concept against EVERY clause in the title clause breakdown above, not just the single highest-weighted one — a concept must not satisfy one clause while silently ignoring another heavily-weighted clause.
- All 11 brand rules — especially rule 11 (spoiler).

**Do NOT show this review to the user.** Return only passing concepts.

---

## Output format

First, output this confirmation block:

> **Cover art sub-agent ran.** Checked: character bible (HR-14), HR-14a (active verbs), approved style format, recent physical actions from cover-art-scenes.md ([list the specific actions]), all 11 brand rules including HR-40 (spoiler). Title gate applied (binary pass/fail only). Each concept scored on 5 criteria: Visual Arrest, Scroll-Stop Power, Episode Specificity, Concept Originality, Character Expressiveness. Recommended: Concept [X] - [N]/50.

Then present 3 passing concepts. For each:

---

**Concept [A/B/C]: [Short title] — [N]/50**

*Why you'd stop scrolling:* [One sentence — the immediate visual reaction before reading the title.]

*Scene:* [2-3 sentences. Must begin: "Joe is [action verb]ing [something] while Carmela [action verb]s [something]." Then describe expressions, body language, key props, wine bottle label, background.]

**Concise evidence (required):**
- Thesis match: [one short line]
- Title alignment: [PASS plus which clause(s) this concept expresses — must include the highest-weighted clause, not just any clause]
- Transcript/show-note evidence: [one short reference line]
- Why not portable: [one short line]
- Thumbnail readability: [one short line]

**Do NOT include a ChatGPT prompt here. Do NOT include a long score breakdown or long audit text.** The prompt is written only after Joe selects a concept (main agent Step 6). Keep evidence concise.

---

After all passing concepts:

**Recommended: Concept [X] - [N]/50**
[Two sentences: why this concept wins and why it's right for this episode specifically.]

---

## ChatGPT prompt format (main agent — Step 6 reference)

The confirmed working approach is: **upload the most recent approved cover art image to ChatGPT as a style reference, then paste the full prompt below.**

Use this multi-section format when writing the prompt for the concept Joe picks. It is the proven working template (confirmed ep216). Do not change this format.

**One banned phrase — must never appear anywhere in your prompt output:**
- `No wine labels` — this removes the key identifying prop and violates HR-10. The wine bottle must have a readable label showing the wine name (e.g., "labeled 'VERDEJO'"). Include this in the Scene section.

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

Arm and hand clarity:
[Complete this section whenever arms or hands are important to the scene. Specify which character owns each visible active hand using screen position or clear spatial language -- for example: "the hand on screen-left," "Joe's hand closest to center," "Carmela's hand on the right side of frame." Use left/right only when viewpoint and ownership are unmistakable. State what each hand is doing. Default: one active hand per character. Two hands are acceptable only when both clearly belong to the same character handling a single simple prop. Confirm that arm paths do not cross or overlap. Confirm that each arm visibly connects back to its own character's body.]

Composition:
Tight square crop.
Characters fill at least 70% of the frame, waist-up, close to the viewer.
[Main focal elements] are the main focus.
[Background description — deep burgundy, or simple wine bar setting — never an outdoor scene or named location].
Clear visual hierarchy.
One clear joke readable at thumbnail size.
No text, captions, speech bubbles, or decorative labels except required wine bottle label text.

Negative prompt:
No photorealism. No realistic portrait. No painterly rendering. No soft gradients. No 3D gloss. No realistic aging lines. No skin texture. No generic stock-cartoon faces. No tiny expressions. No cluttered background. No text, captions, speech bubbles, or decorative labels except required wine bottle label text. Do not make Joe or Carmela look like real-person portraits. Keep them bold, graphic, exaggerated, and funny.

Use this as the style reference, but create a new scene. Do not copy the exact pose.
```
