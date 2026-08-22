# /generate-cover-art

Generate a small set of title-centered cover art concepts and a ready-to-paste ChatGPT prompt for the current episode. Run before showing Joe any concepts. Do not skip this step.

## When to invoke

Any time Joe asks for a cover art image prompt, image concept, or ChatGPT prompt for an episode.
This command is cover-art-only. Do not infer or auto-run title generation, SEO/AEO generation, or other workflow steps.
Before invoking, verify the episode title is confirmed unless Joe explicitly overrides.

## Governing principle

The confirmed episode title and central episode content define what the artwork is about. Visual appeal, humor, emotion, and cleverness determine how powerfully that idea is expressed. Production simplicity is a preference when creative options are otherwise comparable, not the primary creative objective.

- The artwork does not have to illustrate every word of the title literally.
- Its relationship to the title's central promise, question, comparison, contrast, or tension must be immediate and defensible.
- The transcript or script clarifies what the title means in the episode. A concept does not have to originate from one specific transcript moment, but transcript details are useful when they reinforce the title.
- Minor jokes and incidental details must not displace the title.
- An attractive concept cannot compensate for title drift. A title-faithful concept still needs a compelling visual idea.
- Simplicity breaks close creative ties. It does not automatically defeat a substantially stronger idea.

The documented problem this command exists to fix is **title drift**: concepts that pass formal checks but stray from the confirmed title, not excessive literalism. Do not overcorrect toward forcing every word of the title into the image.

## How to run

### Step 1: Read the necessary context

- Confirm the episode title. If pending or unclear, stop and ask before generating concepts.
- Read the transcript or script enough to understand the central episode content, ratings, comparisons, tone, and spoiler boundary. Do not perform an exhaustive search for transcript jokes. Read for meaning and grounding, not for material to mine.
- Read the Patterns Learned section of `data/cover-art-session-reports.md`, and any prior entry for this wine/brand if one exists.
- Read the 5 recent approved scenes in `data/cover-art-scenes.md`. Do not repeat these physical actions.
- Check this conversation for any explicit content-focus or visual-direction instruction Joe has already given earlier in the current session (for example, during title work). Carry it forward into the visual target in Step 2, alongside the title and episode content. It does not expire when work moves to this command, and it must not override the confirmed title; it clarifies which part of the title and episode to emphasize.

### Step 2: Create one concise visual target

Before generating any scene, write a compact target, normally about 6 lines:

- **Confirmed title:**
- **Central title promise:** the main question, claim, comparison, discovery, contrast, or tension
- **Episode meaning:** how the episode actually explores that promise
- **Desired visual response:** the feeling the image should create
- **Spoiler boundary:** what must remain unresolved
- **Essential visual anchors:** no more than 3

If Joe gave an explicit content-focus or visual-direction instruction earlier in the session (Step 1), reflect it in the Central title promise and Essential visual anchors lines; it sharpens the target's emphasis, it does not replace the confirmed title.

For a multi-clause title, identify the dominant promise and any necessary supporting context (see HR-53). Do not produce a long clause-by-clause audit unless the title is genuinely ambiguous.

**This target is the source of concept generation, not a filter applied after unrelated ideas have already been produced.** Every concept in Step 3 must be generated from it directly.

### Step 3: Generate 2-3 concepts directly

Generate 2 or 3 strong concepts directly from the visual target. No ten-situation brainstorm, no five-item filter, no seed list, no mandatory subagent.

- Default to 3 concepts. Present only 2 if a third genuinely strong one can't be found. Do not add a weak concept to fill a quota.
- Concepts must use meaningfully different staging or visual ideas from each other, not the same joke with different props. Do not force fixed mandatory categories.
- Each concept must remain clearly tied to the same visual target from Step 2.
- Humor, metaphor, sensory appeal, lifestyle context, or visual incongruity are all allowed when the connection to the title is immediate. A concept should not require Joe to explain why it fits the title.
- Prefer active visual situations over static posing (HR-14a): something happening reads better than a pose. Do not force every concept into elaborate physical comedy or a fixed sentence formula.

Generate and check concepts directly in this session. **Do not spawn a mandatory subagent.** A separate read-only reviewer may be used only when the title is genuinely ambiguous or a concept has unusual complexity. This is an occasional exception, not part of the normal weekly workflow.

### Step 4: Apply four hard gates

Every concept must pass all four before it can be presented (see HR-13, HR-54, HR-40):

1. **Title Connection.** Immediately and defensibly connected to the title's central promise. Not merely non-contradictory: the main visual idea must actually be about the title.
2. **Episode-Content Fidelity.** Accurately reflects the episode's central content. Not built around incidental banter or a minor detail that displaces the main focus. Does not promise something the episode doesn't deliver.
3. **Spoiler Protection.** Does not reveal ratings, the winner, the verdict, or the conclusion. Test: if someone sees the thumbnail, do they already know what Joe and Carmela concluded? If yes, it fails.
4. **Thumbnail Comprehension.** The central visual idea, action, and emotion are understandable at ~150px. Does not depend on tiny text, subtle inference, or several competing focal points.

A concept that feels like it could fit almost any wine episode is a signal to recheck gates 1 and 2 (Title Connection and Episode-Content Fidelity), not a separate gate of its own (see HR-57). If the concept is otherwise clearly title-centered, content-faithful, appealing, and comprehensible, genericness alone is not disqualifying.

If one concept fails, replace that concept once. Do not restart the whole batch. If the complete batch misses the title, stop, correct the visual target from Step 2, then produce a corrected batch from it.

### Step 5: Compare passing concepts without numerical scores

No 50-point score, no separately scored criteria. For concepts that pass all four gates, compare qualitatively:

- **Visual Appeal:** attractive, funny, pleasurable, appetizing, surprising, emotionally engaging, aspirational, or playfully tense?
- **Thumbnail Clarity:** how quickly does the focal idea register?
- **Production Risk:** likely to render cleanly, or does it involve fragile anatomy, overlapping actions, excessive props, or background complexity?

Production risk is normally a tiebreaker between otherwise-close concepts. It should not defeat a substantially stronger creative idea unless the rendering risk is serious.

**This comparison is a judgment aid, not a validated predictor of listener behavior.** No internal concept-comparison method, scored or not, has been shown to predict how listeners respond to published artwork. It exists to help Joe choose quickly among concepts that already passed the hard gates, not as evidence of performance.

### Step 6: Present concise options

For each passing concept, show only:

**Concept [Letter]: [Name]**
- **Scene:** One or two sentences.
- **Title connection:** One sentence.
- **Visual appeal:** One sentence.
- **Production note:** One short line, only when a meaningful rendering risk exists.

Then:

**Recommended: Concept [Letter]**
One concise, episode-specific explanation of why it offers the strongest balance of title connection, visual appeal, thumbnail clarity, and manageable production risk.

Ask: "Which concept would you like for Ep[N]?" Then stop.

Do not show: ten-item brainstorms, long evidence blocks, numerical score breakdowns, detailed reject logs, repeated confirmation blocks, separate first-review/second-review summaries, or research recitations.

**Stop boundary.** After asking which concept Joe wants, stop. Do not infer or auto-run `/review-titles`, `/generate-episode-content`, or any other command.

### Step 7: Handle Joe's feedback narrowly

When Joe rejects or revises a concept:
- Identify the stated problem.
- Preserve unaffected parts of the concept or batch.
- Make the narrowest correction that resolves the feedback.
- Do not generate an entirely new batch unless Joe rejects the underlying direction, or the correction genuinely requires a different idea.
- Do not ask an unnecessary clarification question when Joe's correction is already clear.

### Step 8: Write and save the selected ChatGPT prompt

After Joe confirms his choice, write one concise structured prompt using the standard format below (not a single unstructured paragraph that omits safeguards, and not a long template that repeats the same instruction, such as brightness or realism bans, in several places).

**Save the completed prompt to the episode output file immediately, per HR-47.** Append it to `outputs/episodes/ep[N]-[slug].md` under a `## COVER ART` section: `### Ep[N]: [Episode Title]` heading, then the prompt as a code block. If the output file doesn't exist yet, create it with just the COVER ART section and note the rest is pending. Do this now, before Joe has generated or approved any image; do not wait until the final image is approved.

### Step 9: Use affirmative scene descriptions

- Describe the desired pose, action, and spatial relationship affirmatively.
- Do not repeatedly mention an unwanted pose in the main scene description, even with "not" or "never": models key off the mentioned concept regardless of negation. Confirmed on Ep227: a single raised fist, described first as "a boxer's guard" and then rewritten with heavy negation ("not a victory pump"), rendered as a fist-pumped victory pose twice in a row, including in a materially reworded prompt. Keep necessary exclusions in the Negative constraints section only.
- When a specific foreground action needs empty visual space, add background exclusions specific to that scene. Confirmed on Ep227: "simplified wine bar setting" alone let an ornate background (framed art, shelving, a barrel) through; an explicit exclusion list fixed it. Do not require a generic background-exclusion list in every prompt; only when this scene's foreground needs it.

### Step 10: Post-selection quality assurance

After Joe generates the artwork in ChatGPT, do one visual check before treating it as final:
- Connection to the confirmed title
- Faithfulness to the selected concept
- Visual appeal
- Thumbnail comprehension at ~150px
- Apple episode-art safe area and likely interface overlays
- Brightness and contrast
- Character consistency
- Anatomy and hand ownership
- Bottle-label accuracy
- Unintended text or visual artifacts

This check happens once, after image generation, not at every concept-development step. ChatGPT creates the final artwork; Claude Code does not generate the image itself.

### After the final image is approved

- Add a brief Ep[N] entry to `data/cover-art-session-reports.md`: the visual target from Step 2, one line per concept presented (name and one-sentence description), which was recommended, and Joe's final selection. If Joe rejected a concept or the whole batch, or made a meaningful override, record what he said and what changed; that is the most useful data point for future sessions. Keep this to what's needed to inform a future session, not the old 6-section template.
- Update `data/cover-art-scenes.md` with the chosen scene's physical action and a "Do not repeat" sentence. Remove the oldest entry if the list exceeds 5.
- Update Patterns Learned in `data/cover-art-session-reports.md` when Joe's selection or an override reveals something new.
- After showing Joe the diff and receiving approval, commit only files changed by this command.

Do not update the session report, scene record, or Patterns Learned before the image is approved. The ChatGPT prompt is the only artifact saved earlier, at Step 8.

Do not run any tasks outside this command's scope unless Joe explicitly asks in a separate request.

---

## Standard ChatGPT prompt format (Step 8)

Four required sections, plus one optional hand and anatomy section used only when hands, arms, or limb choreography materially affect the scene. Do not add a sixth section or restate an instruction that already appears in another section.

**One banned phrase, must never appear anywhere in the prompt:**
- `No wine labels`: this removes the key identifying prop and violates HR-10. The wine bottle must always have a readable label (e.g., "labeled 'VERDEJO'").

```
Create a square editorial cartoon illustration for a wine podcast cover image.

1. Style and recurring character identity:
High-contrast editorial cartoon for a wine podcast: bold chunky black ink outlines, flat saturated colors, oversized expressive faces and hands, theatrical body language, warm approachable tone, simplified and exaggerated animated-comedy proportions, readable at small thumbnail size. The humor comes from expressions, staging, and contrast.

Joe is a middle-aged cartoon man: black rectangular glasses, full salt-and-pepper beard and hair, dark navy pullover, big friendly grin, mischievous curiosity, oversized expressive hands.
Carmela is a middle-aged cartoon woman: medium-length warm brown hair, gold hoop earrings, dark top, theatrical body language, bright amused smile, never stern or neutral.

The recurring character bible above is the primary style authority for both hosts. No single episode's artwork is the benchmark for palette, composition, setting, or visual structure. An approved reference image may be supplied to support character consistency; it does not need to be copied or matched beyond that.

2. Scene:
[Both characters, expressions, body language, what each is doing, described affirmatively, no "not"/"never" pose negation here. Key props. Wine bottle label text. Background, matching the concept and HR-11.]

3. Composition and lighting:
Tight square crop. Characters fill at least 70% of the frame, waist-up, close to the viewer. [Focal elements] are the main focus: one clear visual idea, no competing focal points. Background is brightly and evenly lit: no dim, shadowy, or moody lighting.

4. Negative constraints:
No photorealism, no realistic portrait, no soft gradients, no 3D gloss, no realistic skin texture, no generic stock-cartoon faces. No text, captions, or speech bubbles except the required wine bottle label. [Any scene-specific background exclusions needed to keep the foreground unobstructed, per Step 9.] [Any pose-specific negation that genuinely can't be avoided by affirmative phrasing alone, kept here only, not in the Scene section.]

Optional, hand and anatomy instructions (include only when hands, arms, or limb choreography materially affect the scene):
Identify which character owns each visible active hand by screen position (e.g. "the hand on screen-left," "Carmela's hand on the right"). Default: one active hand per character; two hands only when both clearly belong to one character handling a single simple prop. Arm paths must not cross or overlap; each arm visibly connects back to its own character's shoulder.

Create a new scene for this concept. Do not copy a previous image's pose, palette, composition, or setting.
```
