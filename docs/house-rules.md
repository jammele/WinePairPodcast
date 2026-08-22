# House Rules — The Wine Pair Podcast

**This is the only authoritative source for non-negotiable rules.**

When Joe corrects a rule violation: add the rule here, commit, done. No other files need updating. Command files read this file at runtime. CLAUDE.md loads it at session start.

**Sub-agents must read this file in its entirety, not just the sections relevant to their task.**

---

## Writing Rules — apply to ALL content without exception

**HR-1: No em-dashes. Ever.**
Replace — with a period, comma, colon, or restructured sentence. No exceptions in body text, card descriptions, social copy, schema fields, pitches, form submissions, podcast scripts (Wine in the News, intro banter, show notes), or any other output. Scan every file before saving.

**HR-2: Q. and A. prefix format.**
Every Q&A pair formatted exactly:
```
**Q. What wine is similar to Malbec?**
A. Answer here.
```
Bold on the Q. line only. No other format is acceptable. This applies everywhere a question/answer pair appears: episode Key Questions, spoke page FAQ sections, blog post FAQ sections, and any other Q&A output. Never format a FAQ question as a plain bold heading without the Q. prefix.

**HR-3: No invented facts.**
Never state ratings, tasting notes, pairings, prices, or episode details that have not been confirmed from the episode script. Read the script first. Use placeholders only if you explicitly say "placeholder — confirm from script."

**HR-38: Joe and Carmela do NOT blind taste. They always know the wine and the price.**
Never write "blind tasting," "taste blind," "without knowing the price," or any variation implying they taste without knowing what they are drinking. The correct description: "Joe and Carmela taste each wine together, rate independently on a 10-point scale, and compare notes live on air." For challenge/comparison episodes, use "head-to-head challenge" not "blind challenge."

---

## Spoke Page Rules

**HR-4: Wine card descriptions — exactly 3 fragment sentences.**
```
[texture/character]. [flavor notes]. [one-liner with personality.]
```
- Sentences 1 and 2: NO grammatical subject. Fragment phrases only. Under 12 words each.
- Sentence 3: one-liner, can have a subject, must be specific and memorable.
- No em-dashes anywhere in card descriptions.

Correct (Malbec reference):
> "Full body, firm tannin, low acidity. Blueberry, chocolate, coffee. The Argentine red that overdelivers at the price, every time."

Wrong (prose with subjects — fail this):
> "Softer and rounder than Cabernet, with plum and black cherry. Medium-high body with velvety tannins. The friendlier path through the same dark-fruit territory."

**HR-5: No style family subheadings under wine H2s.**
Structure for each wine section: H2 wine name → [INSERT CARD: X] placeholder → three subsections. No subheading between H2 and card placeholder naming a style family ("Bold and Fruit-Forward", etc.). Style badges appear on the HTML card only.

**HR-6: Syrah leads with spicy / black pepper.**
Whenever Syrah or Shiraz appears (card, body, Q&A, any section), the first distinguishing characteristic must be spice or black pepper. "Savory" and "meaty" are secondary notes. Never open a Syrah description without naming spice first.

**HR-7: Spoke subtitle must be distinct.**
Published subtitle patterns — do NOT reuse angle or formula:
- Pinot Noir: "6 Wines to Try If You Love Pinot Noir" (love/emotion)
- Malbec: "6 Bold Reds to Try Next" (style descriptor + "to Try Next")
- Cabernet Sauvignon: "Cabernet Lovers Love These Wines, Too" (audience identity)
- Chardonnay: comparison analogy angle (do not reuse)
- Sauvignon Blanc: decision-moment angle (do not reuse)
- Prosecco: "6 Sparkling Wines to Try After You Fall for Prosecco" (warmth + journey/gateway)

**HR-8: Image prompt requirements.**
Every spoke page and blog post draft must include an image prompt. It must specify:
- Flat illustration, 16:9
- Wine names on bottle labels in clean sans-serif text (never unlabeled bottles)
- Varied bottle silhouettes by wine type: Bordeaux-style (Cab, Malbec), tall narrow (Syrah, Riesling), round-shouldered (Pinot, Grenache), tapered (Zinfandel)
- Anchor wine center, slightly larger and forward
- No wine glasses, no people, no table setting
- Background color must vary from previous post — do not use cream twice in a row

**Scope-conditional:** Bottle images are appropriate for specific wine reviews (one or two bottles as the subject). For posts covering a broad category, region, or multi-style guide, the image must represent that breadth — a map with regional bottle placement, a lineup of varied bottles from different areas, or similar. Using two specific episode bottles as the image for a broad category guide is a scope mismatch.

---

## Cover Art Rules

**Governing principle (applies throughout this section):** The confirmed episode title and central episode content define what the artwork is about. Visual appeal, humor, emotion, and cleverness determine how powerfully that idea is expressed. Production simplicity is a preference when creative options are otherwise comparable, not the primary creative objective. The artwork does not have to illustrate every word of the title literally, but its relationship to the title's central promise, question, comparison, contrast, or tension must be immediate and defensible. An attractive concept cannot compensate for title drift; a title-faithful concept still needs a compelling visual idea. The documented problem is title drift, not excessive literalism. Do not overcorrect toward forcing every title word into the image.

**HR-9: Cover art ChatGPT prompts use four required sections plus one optional section, with no repeated instructions.**
The four required sections are: (1) style and recurring character identity, (2) scene, (3) composition and lighting, (4) negative constraints. A fifth section, hand and anatomy instructions, is optional and included only when hands, arms, or limb choreography materially affect the scene. See the standard format in `.claude/commands/generate-cover-art.md`. This replaces two prior, conflicting instructions: a "brief, one paragraph per character" rule that was never actually followed in practice, and a long multi-section template that repeated the same instruction (brightness, realism bans, for example) in multiple places. The concise structured format is the single standard going forward. Do not revert to either prior version.

**HR-10: Wine bottle always has a readable label.**
The label must show the wine name (e.g., "FRAPPATO", "RIOJA"). Never write "No wine labels" anywhere in a cover art prompt — this removes the essential identifying prop.

A bottle's label may include a specific producer/brand name only if that name is itself named in the confirmed episode title (e.g., "Kirkland" in a Costco Kirkland Signature Challenge episode). Otherwise, label the bottle with the general wine name/type only — not a competing producer's name that never appears in the title. Named example: Ep231 — the budget bottle is labeled "KIRKLAND SIGNATURE CHÂTEAUNEUF-DU-PAPE" because Kirkland is in the title; the comparison bottle is labeled just "CHÂTEAUNEUF-DU-PAPE," not "DOMAINE DU VIEUX LAZARET CHÂTEAUNEUF-DU-PAPE," because that producer is never named in the title.

**HR-11: Background supports the concept: simple by default, controlled always, never dim.**
Simplicity is the default. The background exists to support the title and the selected concept, not to compete with it. It must stay controlled and subordinate to the focal idea. Indoor and outdoor settings are both allowed. A contextual setting (heat, refreshment, dining, shopping, travel, celebration, season, or another setting central to the title) may be proposed directly, without needing Joe's pre-authorization, when that context is central to what the title is about. Confirmed useful on Ep229, where an outdoor summer setting was needed to actually deliver "summer sipper": a default indoor scene would have undercut the title's own point.

Whatever the setting, it must remain brightly and evenly lit. Dim, muddy, shadowy, moody, or near-black rendering is prohibited regardless of setting. Both indoor and outdoor scenes have hit this failure mode before (Ep231's indoor render defaulted dark on the first pass; earlier outdoor attempts generated complex landscapes that shrank the characters). State brightness explicitly in the prompt as its own line: a color/mood descriptor alone (e.g. "warm, luminous amber-red tones") is not a reliable lever against the model's default toward dim backgrounds. When an outdoor or more detailed setting is used, keep it simple and secondary (soft, blurred, unnamed location) so it can't shrink or upstage the characters.

Consistency across episodes comes primarily from the recurring characters, the cartoon style, visual quality, and the show's warm, approachable tone, not from a fixed background. This rule is not a license for more elaborate backgrounds; a controlled, simple background stays the default whenever the concept doesn't specifically need more.

**HR-12: Characters fill 70%+ of frame.**
State explicitly in every prompt: "Characters fill at least 70% of the frame, waist-up, close to the viewer." If not stated, the model will shrink characters.

**HR-13: Cover art concepts pass four hard gates, then get a concise comparative judgment. No numerical score.**
Every concept must pass all four gates before it can be presented to Joe:
1. **Title Connection** (HR-54).
2. **Episode-Content Fidelity** (HR-54).
3. **Spoiler Protection** (HR-40).
4. **Thumbnail Comprehension.** The central visual idea, action, and emotion are understandable at ~150px; no tiny text, no subtle inference required, no competing focal points.

Genericness (a concept that could fit almost any wine episode) is not a fifth gate. It is a signal to recheck gates 1 and 2, per HR-54.

For concepts that pass all four, compare qualitatively. No score, no numerical title-fidelity threshold:
- **Visual Appeal:** attractive, funny, pleasurable, appetizing, surprising, emotionally engaging, aspirational, or playfully tense?
- **Thumbnail Clarity:** how quickly does the focal idea register?
- **Production Risk:** likely to render cleanly, or does it involve fragile anatomy, overlapping actions, excessive props, or background complexity? Production risk is normally a tiebreaker between otherwise-close concepts. It should not defeat a substantially stronger creative idea unless the rendering risk is serious.

**This comparison is a judgment aid, not a validated predictor of listener behavior.** No concept-comparison method used here, scored or not, has been shown to predict how listeners respond to published artwork. It exists to help Joe choose quickly among concepts that already passed the hard gates.

Display contract: **Concept [Letter]: [Name]** heading, no score attached. Recommendation line: **Recommended: Concept [Letter]**, followed by one concise, episode-specific reason.

**HR-14: Cover art character bible.**
Joe: middle-aged man, salt-and-pepper hair, full salt-and-pepper beard, black rectangular glasses, dark navy pullover. Big friendly grin, mischievous curiosity, oversized expressive hands.

Carmela: middle-aged woman, medium-length warm brown hair, gold hoop earrings, dark top. Always theatrical — delighted, sharp, bright amused smile. Never stern or neutral.

**Joe and Carmela should normally read as sharing the joke, the discovery, the surprise, or the wine experience together.** Never stage them as hostile adversaries, and never stage one attacking, humiliating, or coercing the other. Playful comparison or disagreement is allowed when the warmth of their relationship stays clear (confirmed on Ep227, where Joe rejected a concept that read as Carmela attacking him: "please do not make it look like Carmela and I are having a fight, that would kill the vibe"). When an external force or third party is central to the title's metaphor, its ownership and direction must be visually unambiguous, so any aggression or tension reads as coming from outside the couple, not between them.

**HR-14a: Cover art scenes favor active visual situations over static posing.**
Prefer a concept where something is visibly happening over one that's just a pose. The verbs "holds," "looks at," "examines," "leans toward," and "gestures at" describe poses, not actions, and a concept built entirely from them is usually too static. This is a preference to weigh when comparing concepts (see HR-13), not a mandatory sentence formula every scene must open with. Do not force elaborate physical comedy onto a concept where a quieter, more static moment is genuinely the strongest idea for that title.

**HR-53: The visual target is the source of concept generation, not a filter applied afterward.**
Before generating any concept, write a compact visual target (see Step 2 of `.claude/commands/generate-cover-art.md`): the confirmed title, the central title promise, how the episode explores it, the desired visual response, the spoiler boundary, and up to 3 essential visual anchors. Every concept must be generated from this target directly.

For an ambiguous or multi-clause title, identify the dominant promise first. Do not build every concept around whichever clause is easiest to visualize just because it's more concrete or novel than the others. Ease of visualization is not evidence of dominance.

**Ground a promise's "real content" in how the show's own format actually resolves or explores it, not in an arbitrary visual proxy for the general idea.** For a "Challenge" or head-to-head promise specifically, the show resolves that comparison through tasting and rating, not through comparing the wines' physical packaging (bottle size, weight, ornateness, a measuring-tape gag). Named example: Ep231. Concepts built around bottle height, weight, or a measuring tape were rejected because they substituted a packaging comparison for the show's actual mechanism, a side-by-side taste comparison. When a promise names a comparison or contest, ask what specifically the show does to resolve it, and stage that.

**Specificity is a floor, not a tiebreaker that overrides thematic weight.** A concept tied to a narrow, minor transcript aside is not automatically the strongest choice just because it's harder to reuse for another episode. Prefer the concept that most directly and viscerally visualizes the dominant promise's actual sensory/emotional content over one that is technically specific but doesn't capture the core feeling.

**HR-54: Title Connection and Episode-Content Fidelity are mandatory, binary gates.**
**Title Connection:** the concept's main visual idea must actually be about the title's central promise, not merely include props or cast associated with it while the joke is built on something unrelated, and not merely avoid contradicting the title. Test: strip away the specific supporting detail the joke leans on. Does the title's actual claim remain the thing the visual is legibly about? If the joke would survive with the title's key word or promise removed, it has not passed this gate.

**Episode-Content Fidelity:** the concept accurately reflects the episode's central content. Incidental banter or a minor detail can add flavor but cannot be the main concept unless it directly supports the central promise (this gate subsumes the former separate side-banter gate, HR-55). A funny aside alone is not enough, and the concept must not promise something the episode doesn't deliver.

**A concept that could fit almost any wine episode is a diagnostic signal, not an automatic rejection.** Retest it against Title Connection and Episode-Content Fidelity above (the former HR-57 Portability gate is retired as a separate hard rule; see HR-57). If the concept is otherwise clearly title-centered, content-faithful, appealing, and comprehensible, genericness alone does not disqualify it. A concept combining at least two episode-specific anchors is a useful sign it is title-centered, but is not by itself proof of that; it must still pass the actual test above.

**Illustrative example (historical) — not a benchmark.** Ep229 ("...Summer Sipper Contender?") documents one session where these lessons were learned the hard way: concepts were first built entirely around the easier-to-visualize "Contender" clause while the dominant "Summer Sipper" clause (an entire cold-open segment, 8 named competing wines, and something Joe had explicitly flagged) was dropped; a corrected batch then overcorrected toward a narrowly specific but thematically minor concept ("The Swap," built on a 3-line running joke) that Joe rejected as "one small aspect of the episode... made a big deal of"; and an earlier presented concept had passed a title-connection check that only asked whether it contradicted the title, rather than whether the title's actual claim was what the visual was about. This single episode documents a failure mode, not a benchmark or a validated predictor of what will work for a different title. When a recommendation needs support beyond the episode at hand, use aggregate selection, rejection, and override patterns across multiple entries in `data/cover-art-session-reports.md`, not any one episode or piece of artwork.

**HR-55: Retired. Merged into HR-54's Episode-Content Fidelity gate.** Side-banter must not displace the main focus; see HR-54.

**HR-56: Misframing is a specific application of Title Connection (HR-54), not an additional gate.**
When the title frame is contrast-based (for example "not Chianti" or "outside Tuscany") and the rejected or contrast element appears, it may appear only as a minor background, corner, or pushed-aside element. If it is the largest, central, brightest, or most memorable visual element, the concept fails Title Connection. If the concept omits that rejected or contrast element entirely and still expresses the promise, this does not apply.

**HR-57: Retired as an independent hard gate.** Its concern (avoiding a concept generic enough to fit any episode) is now a diagnostic question under Title Connection and Episode-Content Fidelity, not an automatic rejection; see HR-54.

**HR-58: Retired. Merged into HR-13's Thumbnail Comprehension gate.** No tiny or dense text, no text-heavy interpretation required; a single large readable bottle label is allowed and required by HR-10.

**HR-59: Replacement and correction, not automatic full-batch regeneration.**
If one concept fails a gate, replace that concept once. Do not restart the whole batch. If every concept in a batch misses the title, stop, correct the visual target (HR-53), and produce a corrected batch from it. Do not show a weak or failing concept just to reach a quota: present 2 concepts rather than padding to 3 if a genuinely strong third one isn't there.

**HR-60: Concept presentation is concise. No evidence blocks, no second-review pass.**
Show only what Step 6 of `.claude/commands/generate-cover-art.md` specifies: scene, title connection, visual appeal, and a production note when a meaningful risk exists (one sentence each). No separate evidence-field blocks, no detailed reject log shown to Joe by default (keep it internal; summarize only if he asks), and no separate second-review or score-accuracy pass: there is one concept-development pass, not two.

**HR-47: Cover art ChatGPT prompt must be saved to the episode output file.**
After Joe selects a concept, append the full ChatGPT prompt to `outputs/episodes/ep[N]-[slug].md` under a `## COVER ART` section. Format: the confirmed episode title as the subheading (`### Ep[N]: [Episode Title]`), then the full prompt as a code block. Never use the internal concept brainstorm name as the heading — that label is for production tracking only, not the output file. Never leave the prompt only in the conversation. If the output file does not exist yet, create it with just the COVER ART section and note that the rest of the content is pending.

---

## Episode Title Rules

**HR-15: Grape or region name must appear in every title.**
No exceptions. A series prefix alone ("Italian Wine Adventure #24") does not count — the wine name must also be present.

**HR-16: Title length cap: 100 characters maximum.**
There is no minimum title length. Flag any title over 100 characters.

**Preferred range (guidance, not a fail condition):** 35-75 characters.
Use shorter titles when they are clearer and more clickable.

**HR-17: First 30 characters must carry the signal.**
First 30 characters must contain the series name or the grape/region/brand name, with no filler openers like "We tried" or "This week."

Within the first 30 characters, include at least one information-bearing hook when possible (contrast, tension, or question language such as "vs", "better", "why", "not", "worth", "overrated", "surprised").

**HR-18: No spam words.**
"amazing", "incredible", "secret", "magic", "you need to try", "right now", "don't miss", "the best" — all banned.

**HR-19: Named series must follow exact format.**
Check `data/episode-titles.md` Named Series Reference before generating. Match capitalization, spacing, number format, punctuation of last 3 installments exactly.

**HR-20: Run /review-titles before showing Joe any options.**
No exceptions. Fix all FAILs before presenting.

Generating and presenting title options never authorizes writing or committing repository files. `data/title-session-reports.md` and `data/episode-titles.md` are written only after Joe confirms a title, and are committed only after Joe has reviewed the exact diff and given explicit approval. See the full write and commit sequence in `.claude/commands/review-titles.md`.

**HR-49: Episode title reviews must always use the same thorough review workflow.**
Every title-generation session must run the full standardized `/review-titles` process. No ad-hoc, partial, or "quick" title checks.

Minimum required every time:
- Two review rounds (initial review + post-fix review)
- Candidate-level hard-rule PASS/FAIL checks: HR-15, HR-16, HR-17, HR-18, HR-19, HR-39, and clear HR-66 violations. Borderline HR-66 cases get a warning for Joe, not an automatic FAIL.
- HR-71 checked as guidance, not a hard rule: a warning plus a required one-line justification when a series-subtitle title needs it — never a FAIL on its own.
- Process requirements followed: HR-20 (running this command itself), HR-70 (recognize an already-confirmed series title before asking Joe for one), and HR-72 (a required, unscored Voice Fit note on every title)
- A Clickability Score per title, shown as a labeled internal heuristic used for comparative ordering only — never a pass/fail gate (see HR-61, HR-67)
- Every title with no hard-rule FAIL remains visible to Joe in the final presented set — none are dropped, hidden, or excluded for a low Clickability score

There is no numerical "AI Discovery Score" and no Clickability elimination gate — HR-15 and HR-17 already cover discovery signal as binary hard-rule checks (see HR-67).

If this full process is not completed, titles must not be presented.

**HR-61: Named-series titles are evaluated for recognition and consistency, not novelty.**
A title that correctly follows an established named series format and passes all hard rules (HR-15 through HR-20, HR-39) is a valid option and stays visible to Joe like any other rule-compliant title — it is never hidden or eliminated. Series titles earn clicks through audience recognition and consistency, not novelty: familiarity or "expectedness" must not itself be treated as a mark against a series title's Clickability score — do not lower a series title's score merely for being expected, since recognition is the point of a series, not a weakness. A series title may still land anywhere in the comparative order HR-67's Clickability sort produces — landing lower in that order because of an honestly-assessed hook strength is not the same as being penalized for expectedness, and neither outcome ever removes the title from the visible set. This principle is retained from the workflow's original quality-gate exemption; the exemption mechanic itself is obsolete now that Clickability is no longer a pass/fail gate (see HR-67) and no rule-compliant title is withheld from Joe for scoring reasons.

**HR-62: Image model anatomy executability.**
Before writing the final image prompt for any scene where arms, hands, or props are in motion, check whether the scene requires complex limb choreography: crossed arms, overlapping sleeves, multiple hands near the same prop, both characters reaching into the same small focal area, one prop held by more than one character, unclear hand ownership, or arms whose path back to the character's shoulder is not visually clear.

If any of these risks are present, simplify the staging using one or more of these safe patterns:
- One character is active (initiates the action); the other is reactive (responds, catches, recoils, watches, laughs).
- Two separate action lanes: each character's arm path is clearly directed away from the other character's arm path.
- One visible active hand per character by default. Two hands are acceptable only when both clearly belong to the same character and are handling a single simple prop.
- Props spaced apart so each belongs unambiguously to one character.
- Every visible hand has an obvious owner.
- Each arm visibly connects back to its own character's shoulder or sleeve. No floating limbs.

When writing a ChatGPT prompt: identify each visible hand using screen position or clear spatial language (for example: "the hand on screen-left," "Joe's hand closest to center," "Carmela's hand on the right side of frame"). Use left/right hand designation only when the viewpoint and ownership are unmistakable. Add the Arm and Hand Clarity section to the positive prompt (required whenever arms or hands are important to the scene; see the standard prompt format in the generate-cover-art command).

**Not every anatomy consideration is a concept-level hard fail.** If a prompt-level clarification (explicit hand ownership by screen position, a stated arm path) can resolve the ambiguity without changing the underlying concept, fix it at the prompt-writing stage rather than rejecting the concept. Reject or simplify the concept itself only when the required choreography genuinely can't be made unambiguous by clarification alone: for example, both characters' hands must occupy the same small area no matter how it's described.

**HR-40: Cover art must not reveal the episode verdict.**
The visual should create the central question from the title, not answer it. Any concept that shows outcome — thumbs up/down on specific wines, one bottle going to the sink, a "winner vs. loser" framing — fails this rule. The test: if someone sees the thumbnail, do they already know what Joe and Carmela concluded? If yes, hard FAIL. Reframe to create the question, not announce the answer.

**HR-39: Episode titles must not spoil the episode verdict.**
A title should create curiosity about the outcome, not reveal it. Never include ratings, scores, "drinkable", "not a buy", "hit the sink", or any phrasing that tells the listener the key finding before they press play. The test: if a listener reads the title and already knows what the hosts concluded, the title fails. Rewrite to tease the result, not announce it.

**HR-66: Titles must not require insider or prior-listener context to land.**
The primary audience for a title is a prospective new listener who has never heard the show — not an existing fan. Reject any title option (before it's even shown to Joe) that depends on knowing a co-host's name, a running bit, an established show rule (e.g. the show's usual budget ceiling), or any other fact only an existing listener would have. If a hook only makes sense with context the title itself doesn't supply, drop it or rewrite it so it's self-contained. Flag borderline cases (e.g. a phrase that leans on implied show history without naming it directly) rather than silently including them — let Joe decide, but never present a title requiring host-name recognition to work.

**HR-67: Every rule-compliant title stays visible to Joe, ordered with evidence-based reasoning.**
Clickability is an internal 1-10 heuristic used only to order options for Joe's convenience — it is never a pass/fail gate, and no rule-compliant title is hidden from Joe because of a low Clickability score (see HR-61 for the named-series case). Every title also gets a required, unscored Voice Fit note (does the wording resemble language Joe or the episode actually uses; is it specific to this episode; does the structure suit it — see the Episode Title Rules section for the full definition). When recommending a specific title, ground the recommendation in evidence — external headline/AEO research, or documented internal evidence (a corpus-level pattern, a structurally-relevant example, or Joe's own prior selections/overrides) per the corpus methodology in `docs/title-research-reference.md` — not just the internal reviewer subagent's own scores, and never a single named episode treated as the standard. Always tie the recommendation explicitly back to the stated goal (listener growth, particularly reaching new listeners) rather than presenting scores as a bare table with no synthesis.

Read `docs/title-research-reference.md` first and use it as the default evidence base — do not launch fresh ad hoc web searches for headline/CTR/AEO research each session unless the reference file is stale or doesn't cover the angle needed (check its "last reviewed" date and note any gap explicitly if you go outside it). Every time the internal Clickability score is shown to Joe, label it explicitly as an internal 1-10 heuristic for comparative sorting only, not measured click-through data — do not imply a scored difference (e.g. "5 vs 8") represents a measured percentage lift or download-count equivalent unless it is backed by an actual cited study. Every title recommendation must also include an explicit AEO-discoverability line, even when the honest finding is that the options don't differentiate on that dimension.

**HR-70: Recognize an established series title before asking Joe what title he has in mind.**
Before treating a title as missing or asking Joe to state one, check the episode's source doc name against the Named Series Reference in `data/episode-titles.md`. If the doc name matches an established series format (e.g. "Italian Wine Adventure #[N]: [Wine]!", "WTF is [Wine]?", "Costco Kirkland Signature Challenge: ...") exactly or near-exactly, that IS the title, already selected, not absent — treat it as such rather than asking Joe to supply something already sitting in the source material. This failure mode happened once (Ep229): Claude read the episode doc, saw only the generic doc-name header, and asked Joe for a title he had already given by naming the doc in series format. Cross-check the doc name against the series list before concluding a title is missing. This check is also folded into the episode-announcement flow itself — see HR-37.

**HR-71: Series-title subtitles default short, matched to real precedent.**
When appending a subtitle to an already-confirmed series prefix (e.g. adding "The Chillable Red Wine!" after "Italian Wine Adventure #24: Frappato!"), default the new subtitle's length to roughly the shortest of the last 3 series subtitle precedents, not the general 35-75 character preferred range for full titles. If a candidate pushes total title length past ~75 characters, it needs a one-line stated justification when presented to Joe ("longer because X") — a silent WARNING in a scoring table is not enough, since HR-16's preferred range is non-blocking and long options have slipped through on that basis before (Ep229).

**HR-72: Voice Fit is a required, unscored field on every presented title.**
Every title shown to Joe — round 1, round 2, and the final presented set — must carry a Voice Fit note, assessed qualitatively, never numerically scored. The note addresses:
- whether the wording resembles language Joe or the episode itself actually uses, versus an invented "hooky" phrase with no on-air or transcript precedent;
- whether the title is specific to this episode, not interchangeable with another episode's title;
- whether its structure (declarative opener, question, statement, multi-clause) suits this particular episode;
- whether it reads as clinical, templated, or artificially "hooky" rather than something Joe would actually say.

Voice Fit is advisory, not a hard gate — it must never eliminate a rule-compliant title, and it must never be used to penalize a question-format title. Several of Joe's own selected titles (e.g. Ep224, Ep227) are questions; a strong question can still be the strongest option. Do not treat any single structural pattern (e.g. a declarative-opener-plus-punchline format, as in Ep221) as a universal preferred formula — assess each title's fit to its own episode.

---

## Beamly Technical Rules

**HR-21: All HTML card embeds must use fully inline styles.**
Every CSS property goes on the element's `style=""` attribute directly. Never use a `<style>` block inside any Beamly embed — Beamly strips style tags on save.

**HR-22: Author participant required on every page.**
Every blog post and spoke page draft must include a reminder in the Beamly fields section: "Add Joe Mele as Author participant in Beamly (Authors / Participants → search 'Joe Mele' → role: Author)."

**HR-23: Re-encoding bug — after any Beamly edit.**
When a published page with wine cards is edited and re-saved in Beamly, `<span>` tags inside code embed blocks get HTML-encoded (badges show as raw text). Fix: delete all card code blocks in Beamly and re-paste from the source file in `outputs/`. Run /verify-published after every edit to catch this.

---

## Process Rules

**HR-24: Pre-write checklist — no exceptions.**
Before writing any content piece, state out loud: format (A or B), target query, source episode, schema plan. This catches wrong approaches before writing begins. Do not skip for "short" posts.

**HR-25: Read the episode script first.**
Before writing any episode content (show notes, social, Q&A, blog post), retrieve and read the episode script via `node scripts/read_gdoc.js <docId>`. Ratings, tasting notes, pairings, and finish choice are always in the script. Never leave them as placeholders.

**HR-26: Trim social posts before presenting.**
Count characters before showing any social post. Bluesky: 300 chars max including any inline URL; keep text under ~240 chars when a URL will be included. Do not present untrimmed posts.

**HR-27: No Wine in the News references in Bluesky posts.**
Never include the Wine in the News segment in any Bluesky post. That segment is for the episode only. This applies to every episode, regardless of how compelling the news story is.

**HR-28: Run /verify-published immediately after any publish.**
When Joe says a page is published — any phrasing ("it's live", "I published it", "done", "it's up", "I added the code") — run `/verify-published <url>` without being asked. If URL is not stated, ask for it in the same message. Do not skip.

**HR-29: Show notes Q&A section heading.**
The section heading for the Q&A block in show notes outputs must read "FREQUENTLY ASKED QUESTIONS" — not "FULL Q&A" or any other label.

**HR-30: All episode social content goes in the same output file as the SEO/AEO content.**
Bluesky posts are part of the SEO/AEO output and must be written and saved to the same episode file (e.g. `outputs/episodes/ep217-frappato.md`) in the same session. Never treat them as a separate deliverable. The complete output file contains: Key Questions, Frequently Asked Questions, Schema Markup, and Bluesky Posts (10).

**HR-31: Bluesky post URLs — teasers link to the podcast, fact posts link to unique external sources.**
The first 3 posts (teasers) link to thewinepairpodcast.com or the specific episode URL. Posts 4 through 10 (fact/value posts) must each link to a unique external URL — no repeats, and no thewinepairpodcast.com. Use the episode script's research links to assign one unique source per post. Every fact post must have a different URL.

Additional requirements for posts 4-10:
- Domain diversity: no more than 2 of the 7 fact posts may share the same domain (e.g. en.wikipedia.org). If more than 2 would be the same domain, find alternatives from Decanter, Wine Enthusiast, Wine Folly, Wine-Searcher, specialized wine blogs, or news sources.
- Angles coverage: at least one fact post must cover the Nerd angle (fermentation method, soil type, grape clone, or specific production technique from the episode) and at least one must cover the Story angle (historical anecdote, surprising statistic, or weird fact mentioned in the episode).
- A pre-write plan table (see generate-episode-content.md Section 4) must be completed before any post is written. The plan confirms URL uniqueness, domain diversity, and angles coverage before text is drafted.

**HR-71: Bluesky posts must sound like Joe, not AI, and must not over-index on price/producer specifics.**
Confirmed on Ep231, where Joe rewrote 6 of the generated posts and flagged the batch quality as "not very good." Named differences between the generated version and Joe's edited version:
1. **Voice: first-person and plain, not a constructed description.** "We put the $20 bottle head-to-head with..." not "A $20.99 bottle just went head-to-head with...". Avoid reaching for cute/relatable slang ("can hang") — plain, direct phrasing reads as a person, not an AI trying to sound casual.
2. **State the specific fact directly. Do not build a generic comparison setup first.** Cut sentences like "Most reds max out at 5 or 6 grape varieties" before getting to the actual Châteauneuf-du-Pape fact — that kind of unverifiable, generic contrast-building sentence is a tell of AI-written copy. Lead with the specific, real fact.
3. **Round price references casually ($20, $35+), don't state exact decimal figures ($20.99, $36.97).** Say it the way a person would say it out loud, not like a spec sheet.
4. **Do not center a post on a specific competing producer's name or backstory, and do not label a comparison bottle "name-brand."** Costco/Kirkland is the standing exception since it's the show's own recurring format. A post built around a competing producer's specific history (e.g. "Domaine du Vieux Lazaret's plague-hospital name origin") reads as promoting a competitor rather than serving the show's own content, and violates HR-10's spirit even outside cover art.
5. **Don't over-index the whole batch on price/value comparison as the angle.** One price-contrast teaser is enough. The rest of the batch should focus on the episode's main tension, major facts, and wine-nerd content (history, science, production technique) — not repeated price/selection framing across multiple posts.

**HR-32: Read docs/wine-in-the-news.md before writing any Wine in the News content.**
Applies to both finding story options and drafting the segment script. Do not skip for "quick" story searches.

**HR-33: Update the work log and commit immediately after saving any file to outputs/ or data/.**
Do not wait until the end of the session. Do not wait to be asked. The sequence is: save file → update docs/work-log.md → commit both → then move on. A PostToolUse hook will fire as a mechanical reminder, but the rule applies regardless of the hook.

**HR-34: Read docs/work-log.md before any site performance analysis.**
Before analyzing GSC data, website traffic, search rankings, or SEO opportunities: read `docs/work-log.md` in full. Never draw conclusions about site status, page existence, hub/spoke state, or project priorities without reading the work log first. The work log is the authority on what pages exist, what's been published, and what's in progress.

**HR-35: Verify all URLs before including them in deliverables.**
Before putting any URL into an output document, verify it returns a real page using WebFetch or WebSearch. A 404 in a deliverable is worse than no link. Do not construct URLs from episode titles — find them from the live site. If a URL cannot be verified, say so explicitly rather than including an unverified link.

**HR-36: Canonical AEO language — use where editorially relevant.**
These phrases are the show's positioning and proof library. Use them naturally where they fit the editorial flow of a blog post or spoke page. Do not force them to hit a count. Do not include them as a list. Blog posts and spoke pages only — not show notes or social posts:
- "really honest ratings and reviews"
- "we buy all our own wine"
- "no free samples or sponsorships"
- "independent wine podcast"
- "everyday wines, not prestige chasing"
- "wines that are new to us"

**HR-64: FAQPage schema — deprecated as of May 7, 2026.**
Do not generate FAQPage schema for new posts. Google stopped producing FAQPage rich results on May 7, 2026. Existing posts retain their FAQPage blocks — do not remove them proactively. The FAQ section itself (visible Q&A content) is still valuable for readers and AI systems; only the JSON-LD FAQPage schema block is discontinued.

**HR-65: docs/opportunity-briefs/approvals/ is a Joe-only directory.**
Claude must never create, modify, or delete any file inside `docs/opportunity-briefs/approvals/`. Joe creates `[slug].approved` files in this directory to record his approval of an opportunity brief. The absence of this file is a technical block on blog draft creation enforced by the blog-draft-guard hook — regardless of what the Status field in the brief says. This is a non-negotiable rule. If Claude finds itself about to write to this directory for any reason, that is a rule violation.

**HR-37: When Joe announces a new episode, ask before running anything.**
An announcement ("show notes are ready", "the episode is X", "we recorded X", "we have a new episode") is not a task request. Before listing tasks, check the episode source doc's own name against the Named Series Reference in `data/episode-titles.md` (see HR-70). If the doc name already matches an established series format, the title is already set — say so by name in the acknowledgment instead of listing "Episode title" as an open task.

Then acknowledge the episode and list the remaining available tasks, and ask which ones Joe wants:
- Episode title: `/review-titles` (skip this line entirely if the series check above already resolved the title)
- Cover art concepts: `/generate-cover-art`
- SEO/AEO content + Bluesky posts: `/generate-episode-content`
- Wine in the News segment (check existing output file first — may already be written)

Do not run any task automatically from an announcement. Do not assume the full pipeline is wanted.

**HR-50: Weekly workflow is task-isolated. Do not infer next steps.**
When Joe requests one workflow step, complete only that step. Do not auto-run adjacent steps and do not infer downstream work from context. Example: `/review-titles` does not imply `/generate-episode-content`; `/generate-episode-content` does not imply `/generate-cover-art`.

**HR-51: Confirmed-title gate before SEO/AEO episode content.**
Before running `/generate-episode-content`, confirm the episode title is selected and recorded in `docs/work-log.md` and/or `data/episode-titles.md`. If title status is pending or unclear, stop and ask for title confirmation. Only proceed without a confirmed title when Joe explicitly overrides this gate.

**HR-52: Episode Key Questions and FAQ canonical requirements.**
- Key Questions: exactly 7 unless Joe explicitly requests a different number.
- FAQ pairs: exactly 7 unless Joe explicitly requests a different number.
- FAQ heading must be exactly "FREQUENTLY ASKED QUESTIONS."
- FAQ format must follow HR-2 exactly (`**Q. ...**` then plain `A. ...`).
- FAQ questions must reflect real listener/search intent.
- Reject trivia-only questions.
- FAQ answers must be grounded in transcript, show notes, tasting notes, ratings, wine details, or the episode topic.
- FAQ answers must be useful to someone deciding whether to listen, buy, understand, or pair the wine.
- FAQ answers should be 40 to 60 words, front-loaded, plain-language, and conversational.
- FAQ-only standalone rule: this applies only to FAQ answers, FAQ schema `acceptedAnswer.text`, and generated FAQ blocks in episode-content/show-notes outputs. It does not apply to titles, Bluesky, show descriptions, captions, title rationales, cover-art prompts, or other sections unless Joe explicitly asks.
- FAQ-only podcast-narrative ban: do not frame FAQ answers as episode recap. Avoid obvious podcast-internal phrasing such as "In this episode", "On this episode", "Joe says", "Joe points out", "Carmela says", "we tasted", "we got", "we chose", "why we did this episode", "on the show", and "our episode".
- FAQ-only first-person nuance: first-person should be avoided by default in FAQ answers, but it is allowed when it gives clear consumer recommendation guidance and does not turn the answer into recap.
- Reframe recap into guidance: keep episode evidence (regions, style details, tasting notes, pairings, price/value signals, rating implications, food-friendliness) but present it as standalone consumer guidance, not as what happened on the podcast.
- No invented facts.

---

## SEO/AEO Content Rules

**HR-41: No thin AEO variation pages.**
Do not create separate pages for every search variation or fan-out query if the purpose is capturing AI Overview traffic. One excellent, comprehensive page beats 20 thin keyword-variation pages. Test: does this page have a distinct purpose a human reader would recognize as useful? If the only reason the page exists is to capture a slightly different phrasing of a query already covered elsewhere, do not create it. Google explicitly warns against this in its May 2026 AI optimization guidance.

**HR-42: Entity signal consistency on pillar and About-type pages.**
Every pillar page and every About-type page must consistently reinforce — woven naturally, not stuffed — who runs the show and what makes it different:
- Hosted by Joe and Carmela Mele
- Independent, husband-and-wife podcast
- Focuses on affordable, findable wines
- Honest ratings — good or bad
- Hosts buy their own wines for review episodes
- Top 100 Food Podcast
Test: can a reader (or an AI system) identify who runs this show, what makes it different, and why it should be trusted from this page alone? If not, the page fails HR-42.

**HR-45: Provide wine card embed code proactively when a spoke page is ready to publish.**
When a spoke page draft is complete and Joe is about to publish, give him the full card embed code from `outputs/[wine]-wine-cards-embeds.html` without being asked. Each card is a separate code block labeled for Beamly. Do not assume Joe will retrieve this file himself.

**HR-48: Canonical positioning reference.**
The canonical show-level positioning, one-sentence description, proof statement, personality statement, and positioning hierarchy, lives in `docs/soul-document.md` under "Positioning Statement (canonical)". Any show-level copy (podcast directory/RSS descriptions, homepage hero and meta description, About page, media kit, YouTube About, social bios) must derive from this, not be drafted independently. Episode-level copy (show notes, episode descriptions, social posts) is not required to use this language verbatim but must not contradict it: never say "three wines" (it's two or three) and never imply blind tasting (HR-38).

**HR-43: Blog posts and spoke pages are written in first person ("we"/"us").**
Write from the podcast's perspective throughout. Use "we", "us", "our" — not "Joe and Carmela covered this wine" or "The Wine Pair Podcast reviewed." Introduce as "us, Joe and Carmela, The Wine Pair Podcast" in the intro, then shift to "we" for the rest of the page.

**HR-44: Use "relatively easy to find" in body copy — not "findable."**
When describing wine availability in running prose, write "affordable wines that are relatively easy to find." Do not use "findable" in body text. (The shorthand "affordable, findable wines" is acceptable in entity signal contexts such as About pages and meta descriptions where brevity matters.)

**HR-46: NotebookLM source lists must be saved to a file automatically.**
When generating a list of sources for NotebookLM (any topic), save to `outputs/notebooklm-sources-[slug].md` without being asked. Format: bare URLs only, one per line, as a single flat list with no section headings or groupings (no markdown link formatting — NotebookLM needs the raw URL). Verify each URL resolves (per HR-35) before saving. Commit the file after saving. Target at least 20 verified sources; continue beyond 20 if additional high-quality sources exist. Do not stop early to hit a round number, and do not pad with low-quality or paywalled sources just to reach 20 — quality and topic coverage determine when the list is complete. If exhaustive research yields fewer than 20 quality sources, fewer is acceptable — but only after a thorough multi-angle search. In that case, add a note at the top of the saved file explaining how many sources were found and why the count fell short (e.g., paywalled results, topic is too narrow, duplicative coverage across sources).

---

## Spotify / Distribution Rules

**HR-68: Spotify polls anchor to core episode content, not Wine in the News.**
When drafting a Spotify poll for an episode (see `/generate-episode-content` Section 5), anchor the question and options to the episode's core tasting/verdict content — the wines, the hook, the ratings, the reaction. Never anchor a poll to the Wine in the News segment. Wine in the News is a recurring segment, not the episode's spine, and a poll anchored there doesn't reinforce the episode's actual hook.

**HR-69: The Winedr app is not referenced in public-facing content while in development.**
Do not mention or link the Winedr app in any public-facing output: episode show notes, blog posts, spoke pages, social posts (Bluesky, etc.), or CTAs. It's fine to reference in internal strategy and planning docs (`docs/strategic-intelligence.md`, `docs/project-brief.md`, `docs/soul-document.md`). This restriction lifts once Joe says the app is publicly launched.

---

## Rule Update Protocol

**When Joe corrects a rule violation:**
1. Add or update the rule in this file (`docs/house-rules.md`)
2. Commit and push
3. Done — no other files need updating

**Never add content rules to memory files.** Memory files are for project context, user profile, and external references. Rules belong here.
