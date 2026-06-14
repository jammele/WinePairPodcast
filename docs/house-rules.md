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

---

## Cover Art Rules

**HR-9: Follow the ep215 prompt structure — always.**
Brief, direct, one paragraph per character, then style block. Do not use a long multi-section template. The ep215 approved prompt is the reference format.

**HR-10: Wine bottle always has a readable label.**
The label must show the wine name (e.g., "FRAPPATO", "RIOJA"). Never write "No wine labels" anywhere in a cover art prompt — this removes the essential identifying prop.

**HR-11: Background is always simple, dark, and warm — not near-black.**
Always "rich warm burgundy background" or "simplified wine bar setting." Never "deep burgundy" alone — this tends to go near-black. Never name a specific outdoor location: no "Sicilian patio", no "outdoor terrace", no "vineyard". Outdoor scenes generate complex landscapes that shrink the characters.

**HR-12: Characters fill 70%+ of frame.**
State explicitly in every prompt: "Characters fill at least 70% of the frame, waist-up, close to the viewer." If not stated, the model will shrink characters.

**HR-13: Cover art concepts must always be scored before showing Joe.**
Score all concepts on 5 criteria (10 points each, total out of 50):
1. Visual Arrest — eye-catching at ~150px thumbnail?
2. Scroll-Stop Power — would someone stop scrolling in Apple Podcasts or Spotify before reading the title? Requires one sentence explanation from the subagent.
3. Episode Specificity — is this scene specific enough that it could only work for this episode? "Two people looking at a bottle" scores 1. A scene that couldn't exist without knowing this episode's hook scores 9-10.
4. Concept Originality — fresh structural type vs. recent episodes AND current session batch?
5. Character Expressiveness — are Joe and Carmela doing something specific, not just posing?

Never present concepts without scores and a confirmation block.

Title alignment is a binary PASS/FAIL gate — not a scored criterion. Gate test: does the image actively contradict the title OR reveal the verdict? If no to both, it passes. Do not score it.

**HR-14: Cover art character bible.**
Joe: middle-aged man, salt-and-pepper hair, full salt-and-pepper beard, black rectangular glasses, dark navy pullover. Big friendly grin, mischievous curiosity, oversized expressive hands.

Carmela: middle-aged woman, medium-length warm brown hair, gold hoop earrings, dark top. Always theatrical — delighted, sharp, bright amused smile. Never stern or neutral.

**HR-14a: Cover art scenes must start from a specific physical action — not a pose.**
Scene descriptions must begin with a sentence in the form: "Joe is [action verb]ing [something] while Carmela [action verb]s [something]." The verbs "holds," "looks at," "examines," "leans toward," and "gestures at" are banned as the opening action — they describe poses, not actions. A concept where the only verbs in the scene are from this banned list is too static and must be revised before it reaches Joe.

**HR-47: Cover art ChatGPT prompt must be saved to the episode output file.**
After Joe selects a concept, append the full ChatGPT prompt to `outputs/episodes/ep[N]-[slug].md` under a `## COVER ART` section. Format: the confirmed episode title as the subheading (`### Ep[N] — [Episode Title]`), then the full prompt as a code block. Never use the internal concept brainstorm name as the heading — that label is for production tracking only, not the output file. Never leave the prompt only in the conversation. If the output file does not exist yet, create it with just the COVER ART section and note that the rest of the content is pending.

---

## Episode Title Rules

**HR-15: Grape or region name must appear in every title.**
No exceptions. A series prefix alone ("Italian Wine Adventure #24") does not count — the wine name must also be present.

**HR-16: Title length: 60–80 characters.**
Flag anything outside this range.

**HR-17: First 30 characters: no filler.**
First 30 characters must contain the series name or the grape/region name. Not filler words like "We tried" or "This week."

**HR-18: No spam words.**
"amazing", "incredible", "secret", "magic", "you need to try", "right now", "don't miss", "the best" — all banned.

**HR-19: Named series must follow exact format.**
Check `data/episode-titles.md` Named Series Reference before generating. Match capitalization, spacing, number format, punctuation of last 3 installments exactly.

**HR-20: Run /review-titles before showing Joe any options.**
No exceptions. Fix all FAILs before presenting.

**HR-40: Cover art must not reveal the episode verdict.**
The visual should create the central question from the title, not answer it. Any concept that shows outcome — thumbs up/down on specific wines, one bottle going to the sink, a "winner vs. loser" framing — fails this rule. The test: if someone sees the thumbnail, do they already know what Joe and Carmela concluded? If yes, hard FAIL. Reframe to create the question, not announce the answer.

**HR-39: Episode titles must not spoil the episode verdict.**
A title should create curiosity about the outcome, not reveal it. Never include ratings, scores, "drinkable", "not a buy", "hit the sink", or any phrasing that tells the listener the key finding before they press play. The test: if a listener reads the title and already knows what the hosts concluded, the title fails. Rewrite to tease the result, not announce it.

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

**HR-32: Read docs/wine-in-the-news.md before writing any Wine in the News content.**
Applies to both finding story options and drafting the segment script. Do not skip for "quick" story searches.

**HR-33: Update the work log and commit immediately after saving any file to outputs/ or data/.**
Do not wait until the end of the session. Do not wait to be asked. The sequence is: save file → update docs/work-log.md → commit both → then move on. A PostToolUse hook will fire as a mechanical reminder, but the rule applies regardless of the hook.

**HR-34: Read docs/work-log.md before any site performance analysis.**
Before analyzing GSC data, website traffic, search rankings, or SEO opportunities: read `docs/work-log.md` in full. Never draw conclusions about site status, page existence, hub/spoke state, or project priorities without reading the work log first. The work log is the authority on what pages exist, what's been published, and what's in progress.

**HR-35: Verify all URLs before including them in deliverables.**
Before putting any URL into an output document, verify it returns a real page using WebFetch or WebSearch. A 404 in a deliverable is worse than no link. Do not construct URLs from episode titles — find them from the live site. If a URL cannot be verified, say so explicitly rather than including an unverified link.

**HR-36: Canonical AEO language — use at least 3 phrases per blog post or spoke page.**
Weave these phrases naturally into intro or body copy (not as a list). Blog posts and spoke pages only — not show notes or social posts:
- "really honest ratings and reviews"
- "we buy all our own wine"
- "no free samples or sponsorships"
- "independent wine podcast"
- "everyday wines, not prestige chasing"
- "wines that are new to us"

**HR-37: When Joe announces a new episode, ask before running anything.**
An announcement ("show notes are ready", "the episode is X", "we recorded X", "we have a new episode") is not a task request. Respond by acknowledging the episode and listing the available tasks, then ask which ones Joe wants:
- Episode title: `/review-titles`
- Cover art concepts: `/generate-cover-art`
- SEO/AEO content + Bluesky posts: `/generate-episode-content`
- Wine in the News segment (check existing output file first — may already be written)

Do not run any task automatically from an announcement. Do not assume the full pipeline is wanted.

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

## Rule Update Protocol

**When Joe corrects a rule violation:**
1. Add or update the rule in this file (`docs/house-rules.md`)
2. Commit and push
3. Done — no other files need updating

**Never add content rules to memory files.** Memory files are for project context, user profile, and external references. Rules belong here.
