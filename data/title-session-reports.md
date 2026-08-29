# Title Session Reports — The Wine Pair Podcast

This file is written and read by the `/review-titles` skill. It accumulates research findings and outcomes from every title generation run, building a reusable foundation for better titles over time.

**How to use this file:**
- Read the Patterns Learned section before generating any titles for a new episode
- Check Episode Entries for prior research on the same wine or brand — if an entry exists, use those findings as the Step 0 starting point and focus web searches on new angles only
- After Joe confirms a title, update the relevant entry's "Joe's selection" field and update Patterns Learned if a new pattern is visible

---

## Patterns Learned

*(Manually maintained. Updated after each session where Joe's selection reveals a pattern. Summarize what Joe consistently picks, angles that get rejected, and controversy framings that work for this show.)*

**Process correction (2026-08-21): Meiomi benchmark retired; scoring and voice-fit revised.** Following a title-workflow audit, the standing-benchmark and scoring mechanics were corrected in `.claude/commands/review-titles.md`, `docs/house-rules.md` (HR-61, HR-67, new HR-72), and `docs/title-research-reference.md`:
1. Meiomi ("The Worst Wine We've Ever Tasted?") is retired as the standing title benchmark. The "241 clicks / 1.18% CTR" figure previously cited in the old benchmark language was Google Search Console organic-search performance for the episode's *webpage* (see `docs/seo-geo-strategy.md` and `docs/work-log.md:1112`) — a different mechanism from podcast-app title clickthrough, which this show has no data source for. No episode or fixed set of episodes replaces it as a standing reference; past episodes are now pulled only when structurally relevant to the current episode, per the corpus methodology added to `docs/title-research-reference.md`.
2. The numerical AI Discovery Score (1-10) is retired. HR-15 (grape/region/brand present) and HR-17 (first-30-character signal) already cover the same ground as binary hard-rule checks; a separate 1-10 score implied a precision the underlying check didn't have.
3. The 7/10 Clickability elimination gate is removed. `docs/work-log.md:444-445` documented that this gate had already misfired once — a correctly-formatted series title was penalized for being "expected," which required carving out the original HR-61 exemption. That's evidence the gate conflated novelty-driven clickability with recognition-driven value, not just an isolated gap. Clickability is now a labeled internal-heuristic sort order only; every rule-compliant title reaches Joe, and HR-61 no longer needs a gate-exemption mechanic since there's no gate to exempt from.
4. A required, unscored Voice Fit field is added (new HR-72), grounded in the Ep221 correction below (Joe bypassed all three presented options and wrote his own). Assessed qualitatively per episode, not as a universal formula — it does not penalize question-format titles, since several of Joe's own selections (e.g. Ep224, Ep227) are questions.
5. The Meiomi-anchored "Controversy/curiosity gap [1-5]" score is removed. Its underlying considerations (concrete curiosity, an unresolved listener question, fan/skeptic relevance, price/comparison/reputation/misconception/verdict tension) remain available as qualitative Clickability reasoning, used only when the episode genuinely supports them — controversy is not required for every episode.

**Same-day follow-up correction (2026-08-21), after independent review:** HR-49 (the rule requiring the standardized `/review-titles` process) still described the retired "Per-title scoring (Clickability and AI Discovery)... Explicit quality gate... Show only titles that clear the quality gate" mechanics — it was missed in the first pass and directly contradicted the corrected HR-61/HR-67/HR-72. HR-49 is now rewritten to require two review rounds, hard-rule PASS/FAIL checks, a labeled comparative-only Clickability score, and a required unscored Voice Fit note, with every rule-compliant title remaining visible. HR-61 is also reworded so familiarity/expectedness cannot itself lower a series title's Clickability score, while still allowing it to land anywhere in HR-67's comparative order (never hidden or eliminated either way) — the prior wording's "do not... deprioritize" language read as if it could conflict with comparative ordering itself. Separately, `docs/title-research-reference.md`'s Banerjee/Urminsky entry was re-verified against the paper's actual primary-source text (the January 2021 working-paper PDF, extracted with `pdftotext`): the "inverted-U / optimal concreteness" claim in the first pass was not supported by the paper (confirmed via full-text search — no such term appears anywhere in it) and has been replaced with what the paper actually reports (concreteness has a positive effect; forward-reference curiosity cues have a positive effect; information-seeking/interrogative cues had a *negative* effect, contrary to what prior literature predicted). The platform-evidence table was split into separate Apple/Spotify/Buzzsprout rows with Apple's follower metric explicitly marked show-level (not episode-attributable), Spotify's metric names left undefined pending Spotify's own documented definitions, and the Buzzsprout row's unverified "more than" comparison removed. The AEO section's "2-3x" citation-frequency figure and the "show notes/schema are the real AEO lever" claim are both reframed as unverified vendor hypotheses, not confirmed findings, and must not be used to differentiate or recommend titles.

**Second same-day follow-up correction (2026-08-21), after a further independent review pass:** Four items from the note above were themselves superseded within the same day.
(a) HR-49's hard-rule list incorrectly classified HR-70 and HR-71 as candidate-level hard rules. HR-49 and `/review-titles`'s Step 5 are now corrected to: HR-15, HR-16, HR-17, HR-18, HR-19, HR-39, and clear HR-66 violations as candidate-level hard rules (borderline HR-66 cases are a warning only, not an automatic FAIL); HR-20, HR-49, HR-70, and HR-72 as process requirements; and HR-71 as warning-plus-one-line-justification guidance, never a FAIL on its own.
(b) The Banerjee/Urminsky entry described directly above ("concreteness has a positive effect; forward-reference curiosity cues have a positive effect; information-seeking cues have a negative effect") has been replaced again. That treatment accurately quoted the January 2021 preliminary working paper, but was judged to still be extracting directional title-writing guidance from a version the authors themselves labeled preliminary. The entry now states only that the final published study found textual wording can causally affect web-headline clicks and that prior research didn't reliably predict the direction of such effects — no specific structure, cue, or concreteness level from either paper version is retained as guidance, and the study may not be used to score, rank, recommend, reject, or generate a title.
(c) "Spotify's metric names left undefined pending Spotify's own documented definitions," as stated above, is no longer accurate — the exact definitions for conversion rate, completion rate, and average completion rate, verified against Spotify's own Analytics Glossary and Discovery Analytics documentation, are now recorded in the Evidence types section, kept explicitly distinct (completion rate is a single episode's first-7-days figure; average completion rate is a show-wide rolling average across several episodes).
(d) The AEO "wash" framing above ("AEO discoverability is effectively a wash... the AEO benefit comes from the entity/topic being present at all") was itself an unsupported claim — a "wash" is still a claim about a measured comparison that doesn't exist. It is now replaced with: no verified evidence currently establishes a material AEO difference between candidates sharing a named entity; report "no evidence-based differentiation" rather than claiming either a benefit or a wash.

**Operational precedence (read this before using anything below):** Every dated entry below this note — and every session-report entry throughout the rest of this file — reflects the process as it existed at the time it was written. Specifically: any reference to the Meiomi benchmark as a standing comparison point, a numerical AI Discovery score, a Clickability elimination/quality gate, a quality-gate exemption for named-series titles, a claim that a specific score represents objective or measured listener performance, or an instruction to use one title's formula universally "going forward," is **historical record only** and carries no operational authority today. All of these are superseded by the corrections above and by the current text of `docs/house-rules.md` (HR-49, HR-61, HR-67, HR-72) and `.claude/commands/review-titles.md`. When any dated entry below conflicts with the current house rules or command file, the current house rules and command file govern — dated entries are read as editorial and process history (what Joe said, what was tried, what was learned), never as instructions to re-apply literally.

All dated entries below are preserved unchanged as the historical record of the process before this correction.

**Ep219 + Ep221 (sessions 1–3):**
- Ep219 and Ep221 S1: Joe selected the reviewer's strongest pick (highest controversy/curiosity gap, question format, 5/5 Meiomi). He leans INTO discomfort rather than away from it.
- **Ep221 S2 (critical correction):** Joe bypassed all 3 presented titles and wrote his own. Feedback: "These are just not very good. We have to get better." The presented titles were technically correct but clinical — "Do the Bottles Prove It?", "Is That in the Glass?", "What's Left in the Glass?" are SEO-structured question closers that lack the show's voice. Joe's title: "They Make Wine in Lebanon?!? Lebanon Was Wine Country Before France Was France." — conversational surprise opener + declarative punchline. No question mark at the end.
- **Key pattern correction:** The review process was optimizing for HR-39 compliance (neutral questions) at the expense of voice. Joe's show has a casual, surprised, excited register ("?!?"). Technically neutral questions ("Is That in the Glass?") feel like editorial copy, not podcast titles. The show's voice IS the hook — don't flatten it to pass a rule.
- **Format to generate going forward:** Lead with a conversational surprise or reaction (especially for unknown/unexpected wines), pair with the strongest factual claim as a second sentence. The fact does not need a question mark. This is a valid and often superior structure.
- Pattern to carry forward: Generate the title that sounds like Joe talking to Carmela first. Then check rules. Don't let rule-checking drive the creative direction.

**Ep226 (session 1):** When a title belongs to an established named series (here, WTF is [Wine]?), Joe chose the exact bare series format over a stronger-hook option that added a first-ever subtitle to that series. This cuts against the "lean into discomfort/strongest hook" pattern from Ep219/Ep221 — series recognition can outweigh novelty for Joe when the series itself has never used subtitles. Do not assume the highest-clickability option always wins when a clean series-exact alternative is on the table; present both and let him choose, but don't be surprised if he takes the safe one.

**Ep227 (correction, before selection):** Joe rejected a presented title (Carmela reference) on sight and corrected the review process itself, not just this episode's options. Titles exist to attract new listeners, not to reward people who already know the show — any hook requiring a co-host's name, a running bit, or an established show rule to parse should be cut before it's ever shown, not left for Joe to catch. He also required every title to carry a visible score (the HR-61 series exemption is from the quality-gate floor, not from being scored) and required the final recommendation to be grounded in objective third-party research (external CTR/headline studies, or the show's own Meiomi benchmark) rather than the internal reviewer subagent's own scoring alone. Codified as HR-66 and HR-67. Going forward: the Round 2 subagent prompt must explicitly instruct the reviewer to FAIL any title requiring insider/prior-listener context, and the final response to Joe must always include a scored table plus evidence-based reasoning, not just a bulleted list of options.

**Ep229 (two corrections in one session, both codified as house rules):** First, Claude failed to recognize the episode doc's own name ("Italian Wine Adventure #25: Vermentino!") as an already-confirmed series title and asked Joe to state a title he had already given — root cause was never cross-checking the doc name against the series list in `data/episode-titles.md` before assuming a title was missing. Fixed via HR-70 and an HR-37 amendment folding the check into the episode-announcement flow itself. Second, when generating a subtitle, Claude's first batch researched generic external Vermentino trivia (climate resilience, DNA-twin grapes, terroir) instead of building on "summer sipper" — the episode's own dominant content and the exact angle Joe explicitly told Claude to focus on. Joe rejected the batch as too long (80-93 chars) and disconnected from the episode. Fixed by reordering `/review-titles` so the episode's own stated content is extracted before external research runs, with a blocking gate if a Joe-named angle isn't reflected in any surviving option (see the command file). Joe also caught that the internal 1-10 AI Discovery/Clickability scores were being presented as if they reflected measured CTR data (an unsupported "60% lift" claim), and that AEO discoverability hadn't been considered at all. Fixed via an HR-67 amendment requiring scores to always be labeled as internal heuristics, an explicit AEO line in every recommendation, and a new standing reference file `docs/title-research-reference.md` so this research is read and reused rather than re-derived (or skipped) each session. Pattern to carry forward: when Joe names a specific content angle to build around, treat it as the primary source of hook material, not one input competing with generic external trivia — check the final option set against it explicitly before presenting.

---

## Episode Entries
### Ep233: Aglianico Rosato (San Salvatore Vetere + Feudi di San Gregorio)
**Date:** 2026-08-29
**Series:** None (Joe explicitly ruled out "Italian Wine Adventure" for this episode; "Getting Serious About Rosé #5" was offered as an option but not chosen)
**Joe's selection:** Aglianico Rosato: If You Love a Bold Red Wine, Try Its Rosé (Joe's own revision of the presented "Aglianico Rosato: If You Love Bold Red Wine, Try Its Rosé." — added the article "a" before "Bold Red Wine" and dropped the trailing period)

**Step 0 Research Findings:**
- Episode is a mea culpa: Joe and Carmela previously dismissed rosé as unserious/gendered/an "old aunt" wine and state on air that they were wrong. Repeated PSA, twice in the script: "if you like a red wine, try that red wine's rosé. Just do it" and "if you want to find a rosé you like, find a red wine you like and then buy the rose of it."
- Aglianico is framed as one of Italy's great, high-tannin red grapes (second only to Nebbiolo per the script); the episode's case is that a rosé made from a serious red grape is itself structured and serious, unlike the Provence-style stereotype.
- Two wines diverged: 2024 San Salvatore Vetere Rosato (Campania/Paestum IGT, Joe 7/10, Carmela 8/10) vs. 2025 Feudi di San Gregorio San Greg Rosato (Campania IGT, Joe 5/10, Carmela 6/10).

**Step 0.5 Web Research Findings:**
- No competitor podcast episode specifically about Aglianico rosé was found in the searches run for this session.
- Wine-media reviews (Wine Enthusiast, Decanter, Vivino) independently describe Aglianico rosato as more texture/structure-driven than typical rosé, corroborating the episode's "serious rosé" framing rather than it being only the hosts' spin.
- YouTube/press coverage of Aglianico skews almost entirely to the red wine (Taurasi, Aglianico del Vulture); rosato-specific content is thin.

**Episode Hook:** A rosé made from one of Italy's boldest, highest-tannin red grapes turns out to be genuinely structured and serious — illustrating the episode's core advice that a red wine you already love may have a rosé counterpart worth trying.

**Round 1 (rejected by Joe in full except the series option):**
- `Getting Serious About Rosé #5: Aglianico Rosato!` — PASS, Clickability 6/10
- `Aglianico Made Us Finally Love Rosé.` — PASS with warning, Clickability 7/10 — **Joe rejected:** asserts a personal-conversion narrative ("made us finally love rosé") not supported by the episode or the show's history
- `Aglianico Is One of Italy's Boldest Reds. Does Its Rosé Hold Up?` — internal Round 1 candidate only, not shown to Joe in this form. PASS with WARNING (near-template match to Ep227's "[claim]. Does it hold up?" structure), Clickability 6/10. Revised before presentation to: `Why Does Aglianico, One of Italy's Boldest Reds, Make Such a Different Rosé?` (76 chars) — this revised version passed the internal check cleanly and is the one actually presented to Joe as Title 3. **Joe rejected the presented version:** too long, takes too long to reach "Rosé"/"Rosato," and "such a different rosé" is unclear because the title never establishes what it is different from. The "too long"/"unclear comparison" feedback applies to this presented wording, not to the original "Does Its Rosé Hold Up?" candidate above.
- `Aglianico Rosato: Love Bold Red? This Might Change Your Mind.` — PASS with warning, Clickability 6/10 — **Joe rejected:** "this might change your mind" is a generic, vague closer; the underlying idea (bridge from a familiar red-wine preference to this specific rosé) was directionally right but underdeveloped
- `Two Aglianico Rosés, One Grape: How Different Can Rosé Get?` — PASS after an HR-1 em-dash fix, Clickability 7/10 — **Joe rejected:** the two-bottle score divergence is not the intended listener-facing idea for this title; instructed not to generate further variants of this concept

**Joe's Round 1 feedback, verbatim direction carried into Round 2:** Keep the series option available without treating it as the benchmark. Build new options strictly on the episode's actual stated idea — if a listener already loves a particular red grape/wine, they may like the rosé made from it, with Aglianico as this episode's example. Keep Aglianico and Rosé/Rosato visible early so the subject is immediately clear. No unsupported claims, no invented conversion narrative, no generic "might change your mind" phrasing.

**Round 2 (revised batch):**
- `Getting Serious About Rosé #5: Aglianico Rosato!` — carried forward unchanged, PASS, Clickability 6/10
- `Aglianico Rosato: If You Love Bold Red Wine, Try Its Rosé.` — PASS, Clickability 8/10, closest match to the episode's own advice
- `Love Aglianico the Red? Meet Its Rosé.` — set aside during this session's drafting, not on account of a genuine HR-17 hard-rule failure. HR-17 requires the series name or the grape/region/brand name within the first ~30 characters, and "Aglianico" appeared at characters 6-14 here — HR-17 itself was satisfied. The title was reworked because Joe's own session-specific instruction (above) additionally asked that "Rosé"/"Rosato" itself also be visible early, which is a valid drafting preference for this session but is not a codified hard rule today. An earlier pass through this session mischaracterized that as an HR-17 FAIL; that characterization was incorrect and is not carried forward as precedent. See the workflow-correction proposal delivered alongside this entry.
- `Aglianico Rosato: Made From a Red Grape You Might Already Love.` — PASS, Clickability 7.5/10
- `Aglianico: The Same Bold Red Grape, Now in Rosé Form.` — set aside for the same reason as above (HR-17-compliant via "Aglianico" at characters 1-9; reworked only per Joe's session-specific early-visibility preference, not a hard-rule FAIL)

**Titles reworked to front-load "Aglianico Rosato" per Joe's session preference, then confirmed clean:**
- `Aglianico Rosato: Loved the Red? Time to Try the Rosé.` — PASS, Clickability 7.5/10, substantial thematic overlap with the "If You Love Bold Red Wine" option (flagged, not disqualifying)
- `Aglianico Rosato: The Same Grape, Made a Different Way.` — PASS, Clickability 6.5/10, most distinct of the batch (production/process angle rather than a recommendation)

**Final options as presented (the displayed order contained a Clickability-sorting error — item 4, 6/10, was listed above item 5, 6.5/10; the order below is preserved exactly as presented to Joe, not corrected retroactively):**
1. `Aglianico Rosato: If You Love Bold Red Wine, Try Its Rosé.` (58 chars, Clickability 8/10)
2. `Aglianico Rosato: Made From a Red Grape You Might Already Love.` (65 chars, Clickability 7.5/10)
3. `Aglianico Rosato: Loved the Red? Time to Try the Rosé.` (54 chars, Clickability 7.5/10)
4. `Getting Serious About Rosé #5: Aglianico Rosato!` (48 chars, Clickability 6/10)
5. `Aglianico Rosato: The Same Grape, Made a Different Way.` (55 chars, Clickability 6.5/10)

All scores above are the internal review-subagent heuristic, not measured CTR or download data.

**Joe's final revision (2026-08-29):** Joe selected option 1's underlying idea but revised the wording himself: "Aglianico Rosato: If You Love a Bold Red Wine, Try Its Rosé" — added the article "a" before "Bold Red Wine" and removed the trailing period. Joe's stated reasoning, recorded as his editorial judgment (not a measured listener-response finding):
- Aglianico is unfamiliar to many prospective listeners, so the title needs a bridge to make a new listener care before the grape name alone can carry the hook.
- The familiar "bold red wine" framing supplies that bridge, giving new listeners a reason to care about Aglianico Rosato specifically.
- Adding "a" changes the meaning from liking a broad category ("bold red wine" in general) to having a particular red wine someone loves and trying the corresponding rosé — which matches the episode's actual advice more precisely ("if you like a red wine, try that red wine's rosé").
- Joe preferred this accessible-bridge framing over the "Loved the Red?" option (title 3) because "the red" assumes the listener already knows Aglianico is primarily known as a red wine — a piece of prior knowledge a new listener doesn't yet have.

**Final title verified against hard rules post-revision:** HR-1 (no em-dash) clear, HR-15 (Aglianico present) clear, HR-16 (59 chars, under 100) clear, HR-17 ("Aglianico Rosato" occupies characters 1-16) clear, HR-18 (no spam words) clear, HR-39 (no verdict/score spoiler) clear, HR-66 (no insider/co-host context required) clear. Clickability reassessed at 8/10 for the final wording — the article "a" is a precision fix, not a click-appeal change, so the heuristic score is unchanged from the pre-revision candidate; labeled as an internal comparative heuristic, not measured performance data.

**Research-to-Title Alignment:** The confirmed title uses the episode's actual, stated advice (try the rosé of a red grape you already love) rather than an invented hook, a conversion narrative, or the two-bottle score divergence — all three were explicitly ruled out by Joe during this session. The series option remained available throughout but was not chosen.

**AEO Discoverability:** No verified evidence of a material AEO/AI-citation difference among the candidates that shared the entity "Aglianico Rosato" placed early in the title. Several candidates contain the same named entity and topic language; no measurable discoverability benefit is established for one placement over another. This is a correction to language used earlier in this same session, which described early entity placement as "the strongest possible positioning" — that claim overstated what the current research reference supports and is not carried forward as precedent (see the workflow-correction proposal delivered alongside this entry).

---

### Ep232: Schiava (Alois Lageder + Elena Walch)
**Date:** 2026-08-22
**Series:** Italian Wine Adventure #26
**Joe's selection:** Italian Wine Adventure #26: Schiava! Sommeliers Love This Chillable Red! (Joe's own reworked phrasing of his working title, submitted after Claude flagged that the original — "The Chillable Red Sommeliers Love!" — repeated "Chillable Red" almost verbatim from Ep217's Frappato subtitle. Joe confirmed he's fine with the residual echo: "I am ok with it. I think it is different enough that it doesn't feel like a total repeat, and the emphasis on Sommeliers plus Chillable Red I think will attract listeners.")

**Step 0 Research Findings:**
- Episode frames Schiava as wine's next "it" wine — trendy, buzzing, becoming a sommelier favorite ("the white wine drinker's red wine," compared to Pinot Noir/Gamay) — within the broader chillable-red-wine trend (alongside Gamay, Frappato, Grignolino, Sangiovese, Zweigelt, Pinot Noir).
- Episode's own dominant content is a dramatic reputation arc: ~70% of Alto Adige plantings pre-1970s → dubbed a "garbage grape" during a cheap mass-production era for the German market → collapsed to ~10% → now revived by quality-focused growers. The name also literally translates to "slave," tied to pergola vine-training history.
- Elena Walch's daughter Karoline is quoted calling it "a very honest wine," "a social wine," summed up as "Schiava is what it is" — Joe/Carmela riff on this as "it's not that deep."
- No twist in the tasting: 2024 Alois Lageder Schiava (Joe 7/10, Carmela 8/10) and 2022 Elena Walch Schiava (Joe 7/10, Carmela 8/10) — both straightforwardly positive.

**Step 0.5 Web Research Findings:**
- Competitor content (Sip with Nik newsletter) already uses a direct comparison framing: "Schiava > Beaujolais or Pinot Noir."
- "Chillable"/"alpine red"/"elegant" wording is common across wine media (Wine Folly's "cotton candy wine" piece, a YouTube video titled "Schiava: The Discreet Elegance of Alpine Red Wine") — generic externally, and also already used internally for Frappato (Ep217).
- The 1970s-decline-then-renaissance narrative is a widely repeated industry story externally, but it's also the episode's own emphasized content; no competitor title found built around the literal "garbage grape" phrase or the grape name's translation ("slave"). No competitor title found using "not that deep" framing either.

**Episode Hook:** A once-dominant Alto Adige grape that got dubbed a "garbage grape" during a mass-production collapse is now being revived and embraced by sommeliers as the trendy "it" chillable red — both bottles tasted lived up to it with no drama (Joe 7/7, Carmela 8/8).

**Subagent Round 1 Summary (5 candidates):**
- `Italian Wine Adventure #26: Schiava!` (bare) — PASS, Clickability 3/10, no hook
- `...The Chillable Red Sommeliers Love!` (Joe's original working title) — PASS, Clickability 7/10, WARNING: repeats "Chillable Red" from Ep217's Frappato subtitle almost verbatim, two IWA installments back
- `...Sommeliers' New Favorite 'It' Wine` — PASS, Clickability 7/10, WARNING: reads as trade-press copy, not grounded in episode's own language
- `...The 'Garbage Grape' Making a Comeback` — PASS cleanly, Clickability 8/10, no warnings, strongest of the round
- `...It's Not That Deep` — PASS, Clickability 6/10, WARNING: misread risk (could read as a knock on the wine's quality/complexity rather than the intended "no drama" meaning)

**Revisions before Round 2:** Replaced the generic "it wine" candidate with `...The White Wine Drinker's Red Wine` (a phrase spoken verbatim in Joe's own script) and softened the "not that deep" candidate to `...Turns Out It's Not That Deep` to reduce misread risk. Joe's own working title was carried forward unchanged into Round 2 with the repeat-angle flag noted, since it's his draft to revise or keep.

**Subagent Round 2 Summary:** All 5 candidates (including the two revised ones) passed clean with no FAILs. `...The White Wine Drinker's Red Wine` Clickability rose to 7/10 (fixed the "clinical" flag — grounded in verbatim episode language). `...Turns Out It's Not That Deep` Clickability held at 6/10 (misread risk softened, not fully closed — reviewer's optional suggestion was to swap "Deep" for non-tasting-vocabulary wording, not required). `...The 'Garbage Grape' Making a Comeback` held at 8/10, strongest option both rounds.

**Final presented options (Clickability order):**
1. `Italian Wine Adventure #26: Schiava! The 'Garbage Grape' Making a Comeback` (74 chars, Clickability 8/10) — reviewer's top pick
2. `Italian Wine Adventure #26: Schiava! The White Wine Drinker's Red Wine` (70 chars, Clickability 7/10)
3. `Italian Wine Adventure #26: Schiava! The Chillable Red Sommeliers Love!` (71 chars, Clickability 6/10) — Joe's original working title
4. `Italian Wine Adventure #26: Schiava! Turns Out It's Not That Deep` (65 chars, Clickability 6/10)
5. `Italian Wine Adventure #26: Schiava!` (36 chars, Clickability 5/10, bare)

All scores above are the internal review-subagent heuristic, not measured CTR data.

**Joe's correction (2026-08-22):** Rather than picking from the 5 presented, Joe submitted his own reworked phrasing of his original working title (option 3) — "Sommeliers Love This Chillable Red!" instead of "The Chillable Red Sommeliers Love!" — after Claude flagged the Frappato-subtitle repeat. Claude re-checked the new phrasing against hard rules (clean PASS — HR-15/16/17/18/39/66 all clear, 72 chars) and flagged plainly that the reordering doesn't remove the "Chillable Red" repeat, just changes the sentence shape. Joe confirmed he's comfortable with the residual echo and prefers the "Sommeliers... Chillable Red" emphasis for listener appeal. Pattern to note: Joe will sometimes keep a flagged repeat deliberately rather than switch to an unflagged option, when he judges the phrase itself (not its novelty) is what will attract listeners — don't assume a flagged repeat is automatically disqualifying from his perspective once he's seen the concern named.

**Research-to-Title Alignment:** The two reviewer-favored options (Garbage Grape Comeback, White Wine Drinker's Red Wine) used the episode's own most-emphasized content and verbatim script language, avoiding both the internal Frappato repeat and generic external trend-framing. Joe ultimately chose to keep his own angle (sommeliers + chillable red) with the repeat concern disclosed and accepted, not the reviewer's top-scored pick — consistent with the Ep226/Ep229 pattern of Joe sometimes preferring his own voice/angle over the highest-scored option.

**AEO Discoverability:** No evidence-based differentiation among the candidates — all identically carry "Italian Wine Adventure #26: Schiava" in the first 30 characters; subtitle wording doesn't add distinct query-matching terms beyond the grape name itself.

---

### Ep229: Vermentino (ColleMassari Melacce + Tommasi Poggio al Tufo)
**Date:** 2026-07-25
**Series:** Italian Wine Adventure #25
**Joe's selection:** Italian Wine Adventure #25: Vermentino! Summer Sipper Contender? (trimmed from the presented "A Summer Sipper Contender?" — dropped the leading "A")

**Process note:** This session is also the source of the Ep229 correction documented in Patterns Learned above (missed series recognition, off-content first research pass, unlabeled heuristic scores). The record below reflects the corrected process.

**Step 0 Research Findings — first pass (rejected by Joe):**
- Forbes (Feb 2024): Vermentino is heat-tolerant, drought-resistant, holds acidity in warm climates.
- DNA research: Vermentino, Pigato, and Favorita are genetically identical, three regional names for one grape.
- Vermentino di Gallura DOCG (Sardinia, 1996) — real fact, but inapplicable since both reviewed wines are Tuscan, not Sardinian.
- Joe rejected the resulting titles as too long (80-93 chars) and built on generic Vermentino trivia rather than the episode's actual content.

**Step 0 Research Findings — corrected pass:**
- The episode's real spine is an extended "what makes a great summer sipper" rubric (acidity, body, oak, flavor, finish, alcohol) followed by a named list of competing summer-sipper wines (Vinho Verde, Albariño, Grüner Veltliner, Picpoul de Pinet, Txakoli, Verdejo, Pinot Grigio, Sauvignon Blanc) before Vermentino is reviewed against that rubric.
- "Summer sipper" is externally verified as a real term already applied specifically to Vermentino by other outlets (Wine Spectator: "A Great Summer Sipper from Italy"; YouTube: "VERMENTINO is the Perfect AFFORDABLE Summer Sipper!!!"; Fine Wine Concierge: "Summer Sipper: Vermentino").
- Headline research: question headlines generally outperform statements (BPS/Social Influence, ~137-257% more clicks), but a vague/weak question can underperform a strong statement (CDMG counterpoint) — favors specific, grounded questions over generic ones.
- AEO discoverability found to be a wash between the finalist options — all shared the same named entity (Vermentino) and topical phrase (summer sipper). Full findings and citations archived in `docs/title-research-reference.md`.

**Episode Hook:** Two well-reviewed Tuscan Vermentinos (2024 ColleMassari Melacce, Joe 8/10 Carmela 8/10; 2022 Tommasi Poggio al Tufo, Joe 7/10 Carmela 8/10) tested against the episode's own "great summer sipper" rubric alongside 8 named competing wines. Straightforwardly positive result, no twist.

**Rejected batch (Round 1 + partial Round 2):**
- "The White Wine Built for a Hotter World" — PASS, Clickability 7/10, warning: near-verbatim Forbes headline paraphrase
- "The Summer Sipper That Gets Better as It Gets Hotter" — FAIL (HR-39 spoiler)
- "One Grape, Three Names, One Perfect Summer Wine" — FAIL (HR-39 spoiler)
- "Sardinia's Only DOCG White Wine" — FAIL (HR-3, factual mismatch — both wines are Tuscan)
- "Made for Heat, Built to Keep Its Acidity" — passed Round 1, FAILED Round 2 (HR-3 — implies deliberate breeding intent the research doesn't support)
- Batch abandoned after Joe's rejection rather than iterated further.

**Corrected batch (Round 1 + Round 2):**
- "The Summer Sipper Test." — PASS, Clickability 6/10 (below floor, dropped)
- "Does It Pass the Summer Sipper Test?" — PASS, Clickability 7/10, 76 chars (flagged long)
- "Certified Summer Sipper?" — FAILED Round 2 (HR-3 — implies a real certifying process that doesn't exist for this show)
- "Your Next Summer Sipper?" — PASS, Clickability 7/10, flagged as generic/not episode-specific
- "A Summer Sipper Contender?" — PASS cleanly, Clickability 8/10, AI Discovery 8/10, 66 chars, grounded in the episode's actual rubric + named-competitor structure

**Final presented options:**
1. `Italian Wine Adventure #25: Vermentino!` (bare, 39 chars, AI Discovery 8/10, Clickability 5/10)
2. `Italian Wine Adventure #25: Vermentino! A Summer Sipper Contender?` (66 chars, AI Discovery 8/10, Clickability 8/10) — recommended
3. `Italian Wine Adventure #25: Vermentino! Does It Pass the Summer Sipper Test?` (76 chars, AI Discovery 8/10, Clickability 7/10)
4. `Italian Wine Adventure #25: Vermentino! Your Next Summer Sipper?` (64 chars, AI Discovery 6/10, Clickability 7/10)

All scores above are the internal 1-10 review-subagent rubric, not measured CTR data.

**Research-to-Title Alignment:** The corrected batch used the episode's actual dominant content (the summer-sipper rubric + named-competitor list) instead of generic external Vermentino trivia — this fix, not additional review rounds, is what produced options Joe accepted. "A Summer Sipper Contender?" scored highest on both metrics with no warnings and is directly evidenced by the episode's structure.

**AEO Discoverability:** Not a differentiator between the finalist options — all shared the same named entity (Vermentino) and topical phrase (summer sipper). Per `docs/title-research-reference.md`, AEO discoverability for this show is driven primarily by show notes/schema structure, not subtitle wording.

---

### Ep227: Gigondas (Notre Dame des Pallières Les Mourres + Crus Saint Martin L'Espalier)
**Date:** 2026-07-18
**Series:** WTF is [Wine]? (candidate — Joe explicitly said he's open to reusing the format despite Ep226 using it last week)
**Joe's selection:** Gigondas Has a Reputation for Punching You in the Face. Does It Live Up to That? (reviewer's top pick and the evidence-grounded recommendation post-correction; Joe separately confirmed the "punch you in the face" phrase is an established wine-tasting descriptor — not obscure jargon — before selecting.)

**Step 0 Research Findings:**
- Competitor content ("Opening a Bottle," Decanter, Food & Wine) consistently frames Gigondas as a lower-priced alternative to Châteauneuf-du-Pape with more "finesse" than "power" — this angle is well-worn in written content but not in podcast titles specifically.
- YouTube has a direct-comparison title already in the wild: "These Gigondas Wines Outscored Almost All of Châteauneuf" — confirms outscoring/rivaling CdP is a proven click angle, but it's taken; avoided exact framing.
- "Underrated," "hidden gem," "little secret" framing is saturated across YouTube and Wine Library TV archives — avoided.
- The Wine Pair has touched Gigondas once before, briefly, as one of three Kirkland wines in Ep15 ("Costco FTW: Red Wine Time") — this is the first full dedicated episode on the region.
- Uncovered angles: the show's own "punch you in the face" reputation-vs-reality tension, Carmela's atypical 7/10 rating on a big red (she usually dislikes the style), and the show's explicit on-air budget-rule break (~$29-30 bottles vs. their usual $25 ceiling).

**Episode Hook:** Gigondas has a reputation as a big, high-alcohol, "punch you in the face" GSM blend from the Southern Rhône — often called Châteauneuf-du-Pape's slimmer, cheaper cousin — but the two 94-95-point bottles Joe and Carmela tasted (breaking their usual $25 budget) turned out more balanced and elegant than expected, with Carmela — who typically dislikes big reds — giving both a surprising 7/10. No disappointment angle in this episode; it's a rare across-the-board high-praise result.

**Subagent Round 1 Summary:**
- "WTF is Gigondas?" — PASS, Click N/A (HR-61 exempt), curiosity 1/5 (expected for bare series format)
- "WTF is Gigondas? The Wine That Could Change Your Life." — FAIL (HR-19: no WTF installment has ever carried a subtitle) + FAIL (HR-39: spoils a rapturous positive outcome), Click 4/10
- "Gigondas Has a Reputation for Punching You in the Face. Does It Live Up to That?" — PASS, Click 8/10, curiosity 4/5 — reviewer's strongest pick
- "Gigondas Broke Our $25 Wine Budget Rule. Was It Worth It?" — PASS hard rules, Click 6/10 (below quality-gate floor) — reviewer called the hook "soft" and "insider-only"
- "Gigondas: The Slimmer, Cheaper Cousin of Châteauneuf-du-Pape. Does It Deliver?" — PASS with WARNING ("cheaper" flagged as unverified), Click 7/10, curiosity 4/5

**Quality Gate Decisions (pre-Round 2):**
- Dropped "WTF is Gigondas? The Wine That Could Change Your Life." (double FAIL — series-format violation + spoiler).
- Dropped "Gigondas Broke Our $25 Wine Budget Rule. Was It Worth It?" (6/10 Clickability, below the 7/10 floor).
- Verified "cheaper" claim against the transcript: Joe's own closing recommendation says Gigondas offers CdP fans "similar power, similar grapes, but a less heavy price tag" — sourced, not invented. WARNING cleared.
- Two replacements generated: a Carmela-surprise angle (rewritten as an open question to avoid the spoiler trap that sank the "change your life" title) and a reworked budget/critic-acclaim angle pairing the price break with the 94-95 point scores for higher stakes.

**Subagent Round 2 Summary:**
- "WTF is Gigondas?" — PASS, Click N/A (HR-61 exempt), 16 chars
- "Gigondas Has a Reputation for Punching You in the Face. Does It Live Up to That?" — PASS, Click 8/10, curiosity 4/5, 80 chars — reviewer's strongest pick
- "Gigondas: The Slimmer, Cheaper Cousin of Châteauneuf-du-Pape. Does It Deliver?" — PASS (WARNING cleared), Click 7/10, curiosity 3/5, 78 chars
- "Gigondas Is a Big, Bold Red. Could It Win Carmela Over?" — PASS, Click 8/10, curiosity 4/5, 55 chars
- "Gigondas Wines Cost More Than We Usually Spend. Are the Critic Scores Worth Believing?" — PASS, Click 8/10, curiosity 4/5, 86 chars

**Quality Gate Decisions (post-Round 2):** None dropped — all 5 cleared with zero FAILs.

**Round 2 candidates as presented (before Joe's correction):**
1. `WTF is Gigondas?` (16 chars — exact series match, HR-61 exempt)
2. `Gigondas Has a Reputation for Punching You in the Face. Does It Live Up to That?` (80 chars)
3. `Gigondas: The Slimmer, Cheaper Cousin of Châteauneuf-du-Pape. Does It Deliver?` (78 chars)
4. `Gigondas Is a Big, Bold Red. Could It Win Carmela Over?` (55 chars) — **cut post-presentation, see correction below**
5. `Gigondas Wines Cost More Than We Usually Spend. Are the Critic Scores Worth Believing?` (86 chars)

**Joe's correction (2026-07-18):** Two issues flagged on the initial presentation, both now codified in `docs/house-rules.md` as HR-66 and HR-67:
1. Option 4 (Carmela reference) should never have been presented — a co-host name means nothing to a prospective new listener, and titles exist to grow the audience, not reward existing fans. Cut entirely; the round-2 reviewer should have flagged this itself rather than passing it clean.
2. Every title needs a displayed score, including the HR-61-exempt series title — the exemption is from the quality-gate floor, not from being scored. And the final recommendation must be grounded in objective third-party research (external CTR/headline studies, or the show's own internal Meiomi benchmark), not just the internal reviewer subagent's own scoring.

**Corrected final scoring (post-correction, evidence-grounded):**

| Title | Chars | AI Discovery | Clickability | Evidence basis |
|---|---|---|---|---|
| WTF is Gigondas? | 16 | 8/10 | 4/10 | Matches "what is Gigondas" search intent directly (strong informational-query alignment), but per the Banerjee/Urminsky meta-analysis of ~9,000 headline experiments (U Chicago), very low-concreteness headlines underperform once a reader has competing, more-informative options in the same feed. Series-brand recognition play, not a curiosity driver. |
| Gigondas Has a Reputation for Punching You in the Face. Does It Live Up to That? | 80 | 7/10 | 9/10 | Concrete, specific claim + unresolved question — sits in the "optimal concreteness" zone identified by the same meta-analysis (not too vague, not fully resolved). Aggressive/negative-connotation framing ("punching you in the face") echoes Outbrain's 65,000-headline finding that negative-superlative framing out-CTRs positive framing by 63%, and directly parallels this show's own highest-performing internal data point (Meiomi: "Worst Wine We've Ever Tasted," 241 clicks). Fully self-contained — no wine expertise or show history required. |
| Gigondas: The Slimmer, Cheaper Cousin of Châteauneuf-du-Pape. Does It Deliver? | 78 | 8/10 | 6/10 | Two strong search entities (Gigondas + the much higher-volume Châteauneuf-du-Pape) — good SEO/AEO value and links to the existing Ep168 archive entry. But per curiosity-gap theory (Loewenstein), a gap only registers against what the reader already knows; a new listener with no CdP context gets two unfamiliar terms instead of a felt tension. Real but smaller-scale version of the "requires outside context" problem that killed Option 4 — general wine literacy rather than show-insider knowledge, but still a risk against the stated new-listener goal. |
| Gigondas Wines Cost More Than We Usually Spend. Are the Critic Scores Worth Believing? | 86 | 7/10 | 6/10 | Concrete stakes (price + critic scores), open question. But "more than we usually spend" presumes the listener already knows this show's normal budget — the same category of flaw that disqualified the Carmela option, just less severe since it's inferable from context. Also the longest of the set at 86 characters, closest to truncation risk on podcast apps per the 60-80-char discoverability guidance found in research. |

**Recommendation:** *Gigondas Has a Reputation for Punching You in the Face. Does It Live Up to That?* — the only option that is fully self-contained for a new listener (zero outside context required), sits in the evidence-backed "optimal concreteness" zone for curiosity-driven headlines, and uses a negative-framing device validated both by external research (Outbrain) and this show's own top-performing internal benchmark (Meiomi).

Sources: [When curiosity gaps backfire — Scientific Reports, 2024](https://www.nature.com/articles/s41598-024-81575-9) · [A Systematic Large-Scale Analysis of Headline Experiments — Banerjee/Urminsky, U Chicago](https://home.uchicago.edu/ourminsky/Banerjee_Urminsky_Headlines.pdf) · [7 Science-Backed Secrets to Improve Your Copywriting (Outbrain 65k-headline study cited)](https://ignitevisibility.com/7-science-backed-secrets-improve-copywriting/)

**Research-to-Title Alignment:** Option 2 uses the episode's own "punch you in the face" framing most directly — the strongest, least-generic hook, the reviewer's top pick, and now the evidence-backed recommendation. Option 3 exploits the confirmed CdP price-comparison angle and creates an internal-linking opportunity with the existing "WTF is Châteauneuf-du-Pape?" (Ep168) archive entry, at the cost of requiring outside wine-culture context. The Carmela angle (Option 4) was cut entirely post-presentation per Joe's correction — never should have cleared review for a title whose job is new-listener acquisition. The direct "outscored Châteauneuf" claim seen on YouTube was deliberately avoided as too close to an existing competitor title.

---

### Ep226: Verdejo (Rueda, Spain)
**Date:** 2026-07-11
**Series:** WTF is [Wine]?
**Joe's selection:** WTF is Verdejo? (Option 1 — kept the exact series format rather than the revised extinction/revival subtitle option offered alongside it.)

**Step 0 Research Findings:**
- Competitor content is 100% educational/descriptive: "Taster's Guide to Verdejo Wine," "Versatile Verdejo," "Discover Spain's Hidden Gem" — no tension, no personality, no controversy anywhere in the space.
- YouTube is dominated by pronunciation guides and dry explainer videos; zero click-optimized titles found. "Verdejo" search also collides with boxer Felix Verdejo (noise, not usable).
- Completely uncovered angles: the phylloxera near-extinction story, the single grower (Ángel Rodríguez Vidal) who saved the grape, and the 1972 Marqués de Riscal/French Bordeaux oenologist (Émile Peynaud) revival built explicitly to compete with New World Sauvignon Blanc.
- No prior full Wine Pair episode on Verdejo (only tasted once, briefly, as one of three wines back in Ep20).

**Episode Hook:** Verdejo nearly went extinct after phylloxera devastated Rueda, was saved by one grower, then deliberately revived in 1972 when Marqués de Riscal partnered with a French Bordeaux oenologist to build a wine that could compete with New World Sauvignon Blanc — today it's Spain's most popular DO white wine. Both wines tasted rated well by both hosts (7-8 range); no negative surprise.

**Subagent Round 1 Summary:**
- "WTF is Verdejo?" — PASS, exact series match, Click N/A (HR-61 exempt)
- "Verdejo Almost Went Extinct. A Local Hero and a French Legend Saved It." — FAIL (HR-19, missing series prefix), Click 7/10
- "Stuck in a Sauvignon Blanc Rut? Verdejo From Rueda Wants a Word." — FAIL (HR-19 + HR-17, competing grape name opens the title), Click 6/10
- "Verdejo Nearly Disappeared From Spain. Now It's the Country's Most Popular White." — FAIL (HR-19), curiosity 2/5 (resolution stated, not teased)
- "Sauvignon Blanc and Pinot Grigio Had a Love Child. It's Called Verdejo." — FAIL (HR-19 + HR-17), Click 6/10, weak originality (stock wine-media trope)

**Quality Gate Decisions (pre-Round 2):**
Only the series placeholder cleared Round 1 cleanly. Regenerated the two strongest angles (extinction/revival story, Sauvignon Blanc rut callback) with the series prefix restored and hooks front-loaded into the first 30 characters.

**Subagent Round 2 Summary:**
- "WTF is Verdejo?" — PASS, Click N/A (HR-61 exempt)
- "WTF is Verdejo? It Nearly Vanished From Spain. How Did It Come Back?" — PASS all hard rules, Click 8/10, curiosity 4/5. Flagged: this is the first-ever subtitle added to a WTF-series title in 17 installments — a format-precedent question for Joe, not a rule violation.
- "WTF is Verdejo? The Wine That Might Cure Your Sauvignon Blanc Rut." — PASS hard rules but curiosity only 2/5, Click 6/10 (hook falls outside first 30 chars, wastes the episode's strongest material) — dropped at quality gate (below 7/10 floor).

**Quality Gate Decisions (post-Round 2):** Dropped the Sauvignon-Blanc-rut option (6/10 Clickability, below the 7/10 floor). Two options presented.

**Final presented options:**
1. `WTF is Verdejo?` (15 chars — exact series match, HR-61 exempt)
2. `WTF is Verdejo? It Nearly Vanished From Spain. How Did It Come Back?` (68 chars — first-ever WTF-series subtitle; format-precedent decision for Joe)

**Research-to-Title Alignment:** Option 2 uses the strongest uncovered angle from Step 0 (near-extinction + deliberate 1972 Bordeaux-partnership revival) as an open question, avoiding the spoiler trap that sank the "Now It's the Country's Most Popular White" variant in Round 1. Option 1 is the safe, unconditionally compliant fallback. The Sauvignon-Blanc-rut cold-open callback was tested but left on the table — it scored weakest on curiosity and didn't use the episode's best material.

---

### Ep225: Costco Bordeaux — Pauillac and Saint-Julien (Session 1)
**Date:** 2026-07-03
**Series:** Costco Kirkland Signature Challenge
**Joe's selection:** Costco Kirkland Signature Challenge: Pauillac vs. Saint-Julien Bordeaux!

**Step 0 Research Findings:**
- Competitor content (Reverse Wine Snob, etc.) is 100% utility-first: "Kirkland Signature Saint-Julien Bordeaux Review," "A Bordeaux Bargain From Costco" — descriptive titles, no personality, no tension.
- Reverse Wine Snob reviewed the exact same Kirkland Saint-Julien (Feb 2026) and Kirkland Margaux (Dec 2025) with dry descriptive titles — no curiosity gap exploited.
- Zero competitor content uses the 7-years-since-Pauillac angle, the non-Cab-Sav-lovers framing, or the "elite appellation at warehouse prices" tension.
- YouTube required login; no title data available.
- Joe's show description confirms the intended angle: "we do not usually love Cabernet Sauvignon, so we were really pleasantly surprised" — verdict in description, not in title.

**Episode Hook:** Two 2023 Kirkland Signature Bordeaux wines from Pauillac (back at Costco for the first time in 7 years, 92 pts, under $25) and Saint-Julien ($18.49, 93 pts) tasted by hosts who openly don't love Cabernet Sauvignon. Joe notes in the intro they are "doing something different" from the usual Kirkland challenge format.

**Subagent Round 1 Summary:**
- "Costco Kirkland Signature Bordeaux Challenge: Pauillac vs. Saint-Julien!" — FAIL (HR-19 format mismatch), Click 6/10
- "Costco's Pauillac Is Back After 7 Years. Is It Still the Buy?" — PASS, Click 8/10, WARNING: Saint-Julien absent
- "They're Selling Pauillac at Costco for $20. How Is That Even Possible?" — FAIL (HR-17 filler opener), Click 7/10
- "We Don't Like Cabernet Sauvignon. Then We Tried Costco's Bordeaux." — FAIL (HR-39 spoiler: reversal structure implies positive outcome), Click 5/10
- "Costco Is Selling Bordeaux From Pauillac and Saint-Julien. Should We Be Suspicious?" — PASS, Click 8/10

**Quality Gate Decisions (pre-Round 2):**
Titles 2 and 5 passed Round 1. Three replacements generated:
- Fixed T1: "Costco Kirkland Signature Challenge: Pauillac vs. Saint-Julien Bordeaux!" (corrected HR-19 format)
- Fixed T3: "Pauillac at Costco for $20. How Is That Even Possible?" (removed filler opener)
- New T4: "Costco Has Pauillac and Saint-Julien Bordeaux Under $25. Just for Cab Sav Fans?" (removed spoiler structure; $20 flagged as unverified — corrected to "under $25" after transcript check)

**Subagent Round 2 Summary:**
- "Costco's Pauillac Is Back After 7 Years. Is It Still the Buy?" — PASS, Click 7/10
- "Costco Has Bordeaux From Pauillac and Saint-Julien. Should We Be Suspicious?" — PASS, Click 6/10 (dropped post-R2 gate)
- "Costco Kirkland Signature Challenge: Pauillac vs. Saint-Julien Bordeaux!" — PASS, Click 6/10 (dropped post-R2 gate)
- "Pauillac at Costco for $20. How Is That Even Possible?" — PASS, Click 8/10 (later revised per R3 feedback)
- "Costco Has Pauillac and Saint-Julien Bordeaux Under $25. Just for Cab Sav Fans?" — PASS, Click 6/10 (dropped post-R2 gate)

**Subagent Round 3 Summary (final 3 candidates):**
- "Costco's Pauillac Is Back After 7 Years. Is It Still the Buy?" — PASS, Click 8/10, Curiosity 4/5
- "Pauillac at Costco Under $25. How Is That Even Possible?" — PASS, Click 6/10 — revised to "Pauillac at Costco Under $25. Worth It or a Warning Sign?" per subagent suggestion
- "Bordeaux From Pauillac and Saint-Julien for Under $25 at Costco. Catch or Con?" — PASS, Click 6/10 — tightened to "Pauillac and Saint-Julien at Costco Under $25. Catch or Con?" per subagent suggestion

**Final presented options:**
1. `Costco's Pauillac Is Back After 7 Years. Is It Still the Buy?`
2. `Pauillac at Costco Under $25. Worth It or a Warning Sign?`
3. `Pauillac and Saint-Julien at Costco Under $25. Catch or Con?`

---

### Ep224: Moscato d'Asti (Session 1)
**Date:** 2026-06-27
**Series:** None — standalone episode
**Joe's selection:** Is Moscato d'Asti the Sweet Wine Serious Wine People Won't Admit They Love? (Option 2)

**Step 0 Research Findings:**
- Competitor content is dominated by educational "What is Moscato d'Asti?" pieces and generic "Best Moscato d'Asti" listicles — descriptive, verdict-forward, no personality
- YouTube runs to "Moscato d'Asti Review — Is It Worth It?" — safe consumer-guide register, no tension
- Key gap: no competitor content uses the 133g sugar/liter fact, the gummy-bear/apple-juice sensory angle, or the dry-wine-lovers-vs-sweetest-DOCG conflict
- No prior Wine Pair episode on Moscato d'Asti in archive

**Episode Hook:** Joe and Carmela, dry wine drinkers, taste Kirkland Signature Moscato d'Asti ($8.49) and Saracco Moscato d'Asti ($16.97), find both smell like a Yankee candle and taste like gummy bears/apple juice, and are genuinely charmed but conflicted on rating.

**Subagent Round 1 Summary:**
- "Moscato d'Asti Smells Like a Yankee Candle. But Should You Buy It?" — PASS ⚠️, Click 7/10, WARNING: format echoes Ep214 "smells like [absurd object]" template
- "Moscato d'Asti Is Basically a Gummy Bear in a Wine Glass. But Worth It?" — PASS ✓, Click 8/10, cleanest title in set
- "Moscato d'Asti: Is Italy's Sweetest Wine Worth the Sugar Rush?" — PASS ⚠️, Click 6/10, WARNING: false superlative + Ep216 colon echo
- "Costco's $8 Moscato d'Asti vs. a $17 Bottle: Which Is Worth It?" — PASS ⚠️, Click 7/10, Meiomi 2/5 flagged for regen
- "Is Moscato d'Asti the Wine Snob's Secret Guilty Pleasure?" — FAIL HR-18 ("Secret" banned spam word)

**Quality Gate R1:** Only Title 2 cleared. Three revised/replacement titles generated for Round 2.

**Subagent Round 2 Summary:**
- "Moscato d'Asti Has 133 Grams of Sugar Per Liter. Is That a Problem?" — PASS, Click 9/10, AI Disc 9/10, Meiomi 4/5
- "Moscato d'Asti Is Basically a Gummy Bear in a Wine Glass. But Worth It?" — PASS, Click 8/10, AI Disc 7/10, Meiomi 3/5
- "Moscato d'Asti: The Wine You'll Need to Hide From Your Kids" — PASS ⚠️, Click 7/10, WARNING: colon format echoes Ep216
- "Is Moscato d'Asti the Wine Snob's Forbidden Pleasure?" — PASS ⚠️, Click 7/10, WARNING: "Is X the Wine Snob's…?" echoes Ep219
- "$8 vs. $17: Does Costco's Moscato d'Asti Have Anything to Prove?" — FAIL HR-17 (grape name not complete in first 30 chars)

**Final presented options:**
1. `Moscato d'Asti Has 133 Grams of Sugar Per Liter. Is That a Problem?`
2. `Moscato d'Asti Is Basically a Gummy Bear in a Wine Glass. But Worth It?`
3. `Moscato d'Asti: The Wine You'll Need to Hide From Your Kids`
4. `Is Moscato d'Asti the Wine Snob's Forbidden Pleasure?`

---


---

### Ep223: Sangiovese Outside Tuscany (Session 3 — simplified rerun)
**Date:** 2026-06-20
**Series:** Italian Wine Adventure #25

**Step 0 Research Findings (reused):**
- The strongest discovery signal remains contrast against Chianti assumptions.
- First-words clarity outperforms complex phrasing for this episode.
- Region specificity (Umbria + Molise) improves AI/discovery scoring when paired with a sharp opener.

**Episode Hook:** Two non-Tuscany Sangiovese wines from Umbria and Molise challenge the idea that Sangiovese equals Chianti.

**Subagent Round 1 Summary:**
- "Italian Wine Adventure #25: Sangiovese Outside Tuscany. Better Than Chianti?" — FAIL (HR-39), Clickability 5/10, verdict-lean framing
- "Italian Wine Adventure #25: Better Than Chianti? Sangiovese Outside Tuscany" — FAIL (HR-39 + HR-17), Clickability 4/10
- "Italian Wine Adventure #25: Is Sangiovese Outside Tuscany Better Than Chianti?" — FAIL (HR-39), Clickability 6/10
- "Italian Wine Adventure #25: Sangiovese Beyond Chianti. Better Than You Think?" — FAIL (HR-39), Clickability 7/10
- "Italian Wine Adventure #25: Not Chianti. Is Sangiovese Better Outside Tuscany?" — FAIL (HR-39), Clickability 6/10

**Quality Gate Decisions:**
- Regenerated all options after Round 1 due to hard-rule failures from verdict framing.
- Round 2 drops (<7 clickability):
	- "Italian Wine Adventure #25: Sangiovese Outside Tuscany. Same Grape, New Story" (6/10)
	- "Italian Wine Adventure #25: Sangiovese Outside Tuscany. Umbria and Molise" (6/10)

**Subagent Round 2 Summary:**
- "Italian Wine Adventure #25: Sangiovese Outside Tuscany. What Changes?" — PASS, Clickability 7/10
- "Italian Wine Adventure #25: Sangiovese Beyond Chianti. What Changes?" — PASS, Clickability 7.5/10
- "Italian Wine Adventure #25: Not Chianti. Sangiovese from Umbria and Molise" — PASS, Clickability 8/10
- "Italian Wine Adventure #25: Sangiovese Outside Tuscany. Same Grape, New Story" — PASS, Clickability 6/10 (dropped)
- "Italian Wine Adventure #25: Sangiovese Outside Tuscany. Umbria and Molise" — PASS, Clickability 6/10 (dropped)

**Final Options Presented:**
1. Italian Wine Adventure #25: Not Chianti. Sangiovese from Umbria and Molise
2. Italian Wine Adventure #25: Sangiovese Beyond Chianti. What Changes?
3. Italian Wine Adventure #25: Sangiovese Outside Tuscany. What Changes?

**Research-to-Title Alignment:** Final options keep the core "not just Chianti" contrast while avoiding verdict spoilers. Option 1 is the strongest blend of click tension and discovery specificity. Options 2 and 3 retain cleaner question framing with slightly less punch.

**Joe's selection:** This Ain't Chianti: Is Italian Sangiovese Better Outside Tuscany? (Selected after final comparative pass. Kept for strongest balance of clickability, discovery, and podcast voice.)

---

### Ep223: Sangiovese Outside Tuscany (Session 2 — post-length-rule update)
**Date:** 2026-06-20
**Series:** Mixed test set (series + non-series)

**Rule update context:**
- HR-16 changed from a 60-80 range to cap-only (max 100 chars, no minimum).
- HR-17 strengthened around first-30-character signal and early information-bearing hooks.

**Step 0 Research Findings (carried forward + validated):**
- The strongest click angle remains a direct challenge to the Chianti assumption.
- Shorter titles can still be high-performing when the first words carry entity + tension.
- "Better Than Chianti" performs as the highest-energy contrast phrase for this episode.

**Episode Hook:** Two non-Tuscany Sangiovese wines from Umbria and Molise challenge the idea that Sangiovese equals Chianti.

**Titles Reviewed (updated rule set):**

| Title | Result | Clickability | Discovery | Notes |
|---|---|---|---|---|
| "Is Sangiovese Outside Tuscany Better Than Chianti?" | PASS | 7/10 | 8/10 | Clear, compact, less personality |
| "This Ain't Chianti: Is Italian Sangiovese Better Outside Tuscany?" | PASS | 9/10 | 8/10 | Strong hook + clarity |
| "Better Than Chianti? Italian Sangiovese Beyond Tuscany" | PASS | 8/10 | 8/10 | Strong question-first tension |
| "Italian Wine Adventure #25: Sangiovese Outside Tuscany. Better Than Chianti?" | PASS | 7/10 | 7/10 | Best series-format option |
| "Italian Wine Adventure #25: Better Than Chianti? Sangiovese Outside Tuscany" | PASS | 6/10 | 7/10 | Awkward reversed structure |
| "Italian Wine Adventure #25: Is Sangiovese Outside Tuscany Better Than Chianti?" | PASS | 6/10 | 7/10 | Longer, weaker opening momentum |
| "Not Chianti, Not Tuscany. Is This Italian Sangiovese Actually Better?" | PASS | 9/10 | 7/10 | High tension; verdict-adjacent phrasing |
| "Italian Sangiovese Beyond Chianti: Better, or Just Different?" | PASS | 7/10 | 8/10 | Balanced but lower punch |
| "Chianti Isn't Sangiovese. Is Tuscany Keeping You From Better Bottles?" | PASS | 9/10 | 9/10 | Strongest overall non-series |
| "If You Think Chianti Is Sangiovese, You're Missing the Good Stuff" | FAIL HR-39 | 9/10 | 7/10 | Spoils likely verdict |

**Quality Gate decisions:**
- Dropped immediately: "If You Think Chianti Is Sangiovese, You're Missing the Good Stuff" (HR-39 spoiler).
- De-prioritized: two long-form series questions with weaker first-30 impact (Clickability 6/10).

**Final options presented after rerun:**
1. This Ain't Chianti: Is Italian Sangiovese Better Outside Tuscany?
2. Chianti Isn't Sangiovese. Is Tuscany Keeping You From Better Bottles?
3. Better Than Chianti? Italian Sangiovese Beyond Tuscany
4. Italian Wine Adventure #25: Sangiovese Outside Tuscany. Better Than Chianti?
5. Is Sangiovese Outside Tuscany Better Than Chianti?

**Research-to-Title Alignment:** The rerun confirms that first-words clarity + challenge framing beats neutral explanatory phrasing for this episode. Non-series options delivered higher click tension, while the best series option remained viable for continuity.

**Joe's selection:** *(pending)*

---

### Ep223: Sangiovese Outside Tuscany (Umbria + Molise)
**Date:** 2026-06-20
**Series:** Italian Wine Adventure #25

**Step 0 Research Findings:**
- Most external Sangiovese content is educational and generic: "guide," "explained," "all about," and "best wines" lists.
- Podcast competitors on Sangiovese lean technical (history, soil, viticulture, winemaking) rather than listener-facing tension.
- YouTube titles often center Tuscany/Chianti and beginner explainers; "outside Tuscany" and "not Chianti" comparison framing appears underused.
- Strongest uncovered click angle for this episode: challenge the assumption that Sangiovese equals Chianti while keeping the verdict hidden.

**Episode Hook:** Sangiovese gets reduced to Chianti, but two non-Tuscany bottles from Umbria and Molise showed dramatically different styles and challenged that reputation.

**Titles Reviewed:**

| Title | Round | Result | Clickability | Controversy | Notes |
|---|---|---|---|---|---|
| "Italian Wine Adventure #25: Sangiovese Outside Tuscany. Better Than Chianti?" | R1 | PASS | 7/10 | 3/5 | Borderline verdict tilt in wording; revised punctuation |
| "Italian Wine Adventure #25: Sangiovese Beyond Chianti. What Changes?" | R1 | PASS | 8/10 | 4/5 | Strong neutral curiosity; revised punctuation |
| "Italian Wine Adventure #25: Umbria and Molise Sangiovese. Same Grape, New Game." | R1 | PASS | 7/10 | 4/5 | Region-specific, but dense |
| "Italian Wine Adventure #25: Sangiovese Not Chianti. Missing Half the Story?" | R1 | PASS | 8/10 | 4/5 | Strong hook; wording softened in R2 |
| "Italian Wine Adventure #25: Chianti Isn't the Whole Sangiovese Story." | R1 | FAIL HR-39 | 5/10 | 2/5 | Spoils conclusion; dropped |
| "Italian Wine Adventure #25: Sangiovese Beyond Chianti! What Changes?" | R2 | PASS | 6/10 | 3/5 | Rule-clean but too generic; dropped at quality gate |
| "Italian Wine Adventure #25: Sangiovese Outside Tuscany! Better Than Chianti?" | R2 | PASS | 7/10 | 4/5 | **FINAL - presented** |
| "Italian Wine Adventure #25: Sangiovese Beyond Chianti! Missing Half the Story?" | R2 | PASS | 8/10 | 4/5 | **FINAL - presented** - strongest |
| "Italian Wine Adventure #25: Umbria and Molise Sangiovese! Same Grape, New Game." | R2 | FAIL HR-16 | 7/10 | 4/5 | Over 80 chars per reviewer; dropped |

**Quality Gate R1:** Title 5 dropped (HR-39 FAIL and 5/10 Clickability).
**Quality Gate R2:** Title 1 dropped (6/10 Clickability) and Title 4 dropped (HR-16 FAIL).

**Final Options Presented:**
1. Italian Wine Adventure #25: Sangiovese Beyond Chianti! Missing Half the Story? (80 chars)
2. Italian Wine Adventure #25: Sangiovese Outside Tuscany! Better Than Chianti? (76 chars)

**Research-to-Title Alignment:** Final options avoid the saturated "Sangiovese explainer" format seen in competitor results and instead use a clear tension frame rooted in this episode's premise. Option 1 uses the strongest mystery gap ("missing half the story"). Option 2 uses a direct Chianti comparison, which is more search-obvious but slightly more verdict-adjacent.

**Joe's selection:** *(pending)*

---

### Ep222: Alsace Pinot Gris (Pierre Sparr Grande Reserve + Frey-Sohler Vieilles Vignes)
**Date:** 2026-06-13
**Series:** None

**Step 0 Research Findings:**
- Dominant competitor angle: "Pinot Grigio vs Pinot Gris — Alsace is better" (YouTube: "Do You Love Pinot Grigio? Pinot Gris from Alsace is BETTER") — overused, avoided
- Podcasts focus on region history or producer interviews — nobody uses a bold quality judgment or sensory surprise as a hook
- "White wine closest to red wine" structural angle completely uncovered in competitor content
- Tokay name-theft controversy also uncovered as a title hook
- "Boring/bland" reputation flip used in written content but not as a strong angle in podcast titles
- 6/10 non-buy verdict: value/price/buy framing fails HR-39 — questions must be about tasting experience or historical curiosity only

**Episode Hook:** Pinot Grigio has a worldwide boring reputation, but Alsace Pinot Gris is the same grape with a radically different identity — rich, oily, described as the white wine closest to red wine — and its name was stolen by Hungary in a legal battle that lasted decades. Both wines rated 6/10 (drinkable, not buys).

**Titles Reviewed:**

| Title | Round | Result | Clickability | Controversy | Notes |
|---|---|---|---|---|---|
| "Everyone Says Pinot Grigio Is Boring. Alsace Pinot Gris Says Hold My Wine." | R1 | PASS | 5/10 | 2/5 | Meme punchline; dropped at quality gate |
| "Alsace Pinot Gris: The White Wine Closest to Red Wine. Is That Actually True?" | R1 | PASS | 7/10 | 4/5 | [Claim. Question?] echoes Ep213; revised for R2 |
| "Alsace Pinot Gris Had Its Name Stolen by Hungary. Does the Wine Deserve Better?" | R1 | PASS | 7/10 | 4/5 | Second clause logically disconnected from name-theft; revised for R2 |
| "Pinot Grigio Is Bland and Boring. France Disagrees. Enter Alsace Pinot Gris." | R1 | PASS | 6/10 | 3/5 | Three-part structure; weak landing; dropped at quality gate |
| "Alsace Pinot Gris: The Anti-Pinot Grigio. Does It Live Up to the Billing?" | R1 | PASS | 7/10 | 3/5 | Colon-subtitle format echoes Ep204/208/213; revised for R2 |
| "Alsace Pinot Gris Is a White Wine Doing a Red Wine Impression. No, Really." | R2 | PASS | 8/10 | 4/5 | **FINAL — presented** |
| "Alsace Pinot Gris Had Its Name Stolen by Hungary. So We Got Two Bottles." | R2 | PASS | 8/10 | 4/5 | **FINAL — presented** |
| "Alsace Pinot Gris Is the Anti-Pinot Grigio. We Opened a Bottle to Find Out." | R2 | PASS | 5/10 | 3/5 | Second sentence generic to every episode; dropped at quality gate |
| "Pinot Grigio Is Boring. Alsace Pinot Gris Is Its Richer, Weirder French Cousin." | R2 | PASS | 9/10 | 5/5 | **FINAL — presented** — strongest |
| "Alsace Changed Hands Four Times. Its Pinot Gris Outlasted Every Country." | R2 | PASS | 4/10 | 2/5 | History trivia hook; fails wine-interest click test; dropped at quality gate |

**Quality Gate R1:** Titles 1 and 4 dropped (5/10 and 6/10 Clickability).
**Quality Gate R2:** Titles 3 and 5 dropped (5/10 and 4/10 Clickability).

**Key learning:** For this episode, the boring/reputation angle works best when it's punchy and confrontational (Title 4: 9/10) vs. when it's playful (Title 1: 5/10) or theatrical (original Title 4 "Enter Alsace Pinot Gris": 6/10). The name-theft hook is genuinely distinctive but must connect logically to the second clause — "Does the Wine Deserve Better?" disconnects; "So We Got Two Bottles" lands because it's an organic response to the legal drama.

**Final Options Presented:**
1. Pinot Grigio Is Boring. Alsace Pinot Gris Is Its Richer, Weirder French Cousin. (79 chars)
2. Alsace Pinot Gris Is a White Wine Doing a Red Wine Impression. No, Really. (74 chars)
3. Alsace Pinot Gris Had Its Name Stolen by Hungary. So We Got Two Bottles. (72 chars)

**Research-to-Title Alignment:** Option 1 (strongest) uses the boring-reputation flip angle, which while present in written competitor content, has not been used as a bold confrontational two-sentence format in podcast titles — that specific execution is uncovered. Option 2 uses the "white wine closest to red wine" angle, which is completely uncovered in competitor content. Option 3 uses the Tokay name-theft angle, also uncovered. All three final options exploit gaps identified in Step 0.

**Joe's selection:** Pinot Grigio Is Boring. Alsace Pinot Gris Is Its Richer, Weirder French Cousin. (Option A — reviewer's strongest, 9/10 Clickability, 5/5 controversy.)

---

### Ep221: Lebanese Wine (Massaya Le Colombier Rouge + Chateau Musar Jeune Red)
**Date:** 2026-05-30
**Series:** None

**Step 0 Research Findings:**
- "Wine and War" dominates competitor podcast content (Napa Valley Wine Academy, Wine Blast) — used heavily; avoided
- YouTube Chateau Musar titles focus on "icon", "magic", "resilience" — aspirational framing, not differentiated
- Gap: no competitor uses the Phoenician/Bible/Cana connection as a title hook — completely uncovered territory
- Key language driving engagement: "history", "resilience", "civil war" — resilience angle is strong but overused in wine media
- "They Make Wine in Lebanon" angle undersells the 7,000-year history

**Episode Hook:** Lebanon was the wine capital of the ancient world — the Phoenicians invented the global wine trade, Jesus' first miracle was at a wedding in Cana (Canaanite territory), and winemakers kept producing through a 15-year civil war — and today you can buy a bottle from that same region on wine.com for $26.

**Titles Reviewed (3 rounds — HR-39 flagged neutral vs. tilted questions across rounds 1 and 2):**

| Title | Result | Clickability | Controversy | Notes |
|---|---|---|---|---|
| WTF is Lebanese Wine? Phoenicians, the Bible, and Chateau Musar | FAIL R1 HR-19 | 6/10 | 3/5 | Series format deviation |
| They Make Wine in Lebanon?!? — And Have Been Since Biblical Times | FAIL R1 HR-16/HR-1 | 7/10 | 3/5 | 85 chars, em-dash |
| Lebanese Wine: Phoenicians Made It Famous. Does It Deserve a Comeback? | FAIL R2 HR-39 | 8/10 | 4/5 | "Comeback" tilts positive |
| Lebanese Wine Was Once the Greatest in the World. What Happened? | PASS R3 | 8/10 | 4/5 | Reviewer's second pick |
| Lebanon's Wine Gave Jesus His First Miracle. Does It Still Deliver? | FAIL R2 HR-39 | 9/10 | 5/5 | "Still Deliver" tilts negative |
| Lebanese Wine Made the Romans Great. Can It Do the Same for You? | FAIL R2 HR-39 | 3/10 | 2/5 | Setup implies deflation |
| Lebanese Wine Has a 7,000-Year Head Start. So Why Is Nobody Drinking It? | FAIL R2 HR-39 | 4/10 | 3/5 | "Nobody Drinking It" assumes conclusion |
| Lebanon's Wine Gave Jesus His First Miracle. Should You Try It? | PASS R3 | 9/10 | 5/5 | Reviewer's strongest pick |
| Lebanese Wine Has a 7,000-Year Head Start. Should You Be Drinking It? | PASS R3 | 8/10 | 4/5 | |
| Lebanese Wine Kept Flowing Through 15 Years of Civil War. Should You Try It? | PASS R3 | 7/10 | 4/5 | |

**Quality Gate:** No titles dropped (all passing titles 7/10+).

**Final Options Presented:**
1. Lebanon's Wine Gave Jesus His First Miracle. Should You Try It? (63 chars)
2. Lebanese Wine Was Once the Greatest in the World. What Happened? (64 chars)
3. Lebanese Wine Has a 7,000-Year Head Start. Should You Be Drinking It? (69 chars)
4. Lebanese Wine Kept Flowing Through 15 Years of Civil War. Should You Try It? (76 chars)

**Research-to-Title Alignment:** All four final options use the Phoenician history, 7,000-year legacy, or civil war resilience angles identified in research. The Jesus/Cana hook (biggest content gap vs. competitors) powers Option 1. HR-39 enforcement across 3 rounds revealed a pattern: questions must be fully neutral — any hint of tilt (positive or negative) toward the verdict triggers failure.

**Joe's selection:** Lebanon's Wine Gave Jesus His First Miracle. Does the Modern Stuff Hold Up? (Corrected round — reviewer's strongest, 9/10 Clickability, 5/5 controversy. Joe noted personal discomfort with the Bible angle, then chose it anyway because he recognized that discomfort as the hook.)

---

### Ep221: Lebanese Wine — Session 2 (Replacement Title)
**Date:** 2026-06-05
**Series:** None

**Context:** Joe requested a new title to replace the confirmed Ep221 title ("Lebanon's Wine Gave Jesus His First Miracle. Does the Modern Stuff Hold Up?"). Jesus/Bible angle off the table.

**Step 0 Research Findings (incremental — building on Session 1 research):**
- YouTube: "More than MUSAR???" and "Is Lebanon the Most UNDERRATED...?" signal curiosity about Lebanese wine beyond Chateau Musar — underdog/underrated framing already covered
- Competitor podcasts lean on "Wine and War," Hochar family legacy, and resilience framing — civil war angle still available but must be freshly executed
- France-comparison angle ("Lebanon predates France's wine culture") is completely uncovered in competitor content — strongest gap
- $26 price framing is a trap for this episode: 6/10 non-buy result means any price/value question resolves unfavorably → HR-39 fails throughout

**Episode Hook:** Lebanon built the wine world before France existed — Phoenicians invented the global wine trade, winemakers produced through a 15-year civil war — and today those bottles cost $26. Whether that history shows up in the glass is the open question.

**Titles Reviewed (4 rounds — price/value framing failed HR-39 across all rounds; France-comparison and civil war angles cleanest):**

| Title | Round | Result | Clickability | Controversy | Notes |
|---|---|---|---|---|---|
| Lebanese Wine Fueled the Ancient World's Wine Trade. Should You Be Drinking It? | R1 | PASS | 5/10 | 2/5 | Generic closer; dropped at quality gate |
| Lebanon Has Been Making Wine for 7,000 Years. Is It Worth $26? | R1 | PASS | 8/10 | 4/5 | Format repeat Ep213; dropped R2 (format dupe of T4) |
| Lebanese Wine Has Been Overlooked for 7,000 Years. Is It Worth Discovering? | R1 | PASS | 4/10 | 2/5 | Factually imprecise; dropped at quality gate |
| Lebanese Wine Survived Empires, Wars, and Prohibition. Is It Worth Your $26? | R1/R2 | PASS→FAIL | 7→5/10 | 3/5 | $26 value question fails HR-39 on strict re-read |
| Critics Say Lebanese Wine Punches Above Its Weight. We Put That to the Test. | R1 | PASS | 4/10 | 2/5 | Ep215 format repeat; dropped at quality gate |
| Lebanese Wine Outlasted Rome, Civil War, and Prohibition. Now It's $26. | R2 | FAIL HR-39 | 4/10 | 2/5 | Declarative form implies wine is a deal; positive spoiler |
| Lebanon Was Wine Country Before France Was France. Is $26 Too Cheap? | R2 | FAIL HR-39 | 6/10 | 3/5 | "Too cheap?" implies underpriced; positive spoiler |
| Is Lebanese Wine Worth $26? It Survived 7,000 Years to Answer That. | R2 | PASS | 4/10 | 2/5 | Dropped at quality gate |
| Lebanese Wine Survived Empires, Wars, and Prohibition. Can Your $26 Keep Up? | R3 | FAIL HR-39 | 3/10 | 2/5 | Positive-lean framing |
| Lebanon Was Wine Country Before France Was France. Do the Bottles Prove It? | R3/R4 | PASS | 8/10 | 4/5 | **FINAL — confirmed** |
| Lebanon Was Wine Country Before France Was France. Has That Changed? | R4 | PASS | 5/10 | 3/5 | Too vague; dropped at quality gate |
| Lebanese Wine Never Stopped During a 15-Year Civil War. Is That in the Glass? | R4 | PASS | 8/10 | 4/5 | **FINAL — confirmed** |
| Lebanese Wine Outlasted Rome and a 15-Year Civil War. Is It Any Good? | R4 | FAIL HR-39 | — | — | "Is It Any Good?" resolves negative at 6/10 |
| Lebanese Wine Outlasted Rome and a Civil War. What's Left in the Glass? | — | PASS (projected) | 8/10 | 4/5 | **FINAL — presented** |

**Quality Gate:** Titles below 7/10 Clickability dropped. Price/value framing abandoned entirely after R2.

**Key learning:** For any episode with a 6/10 non-buy verdict, questions framing value, price, buy/drink recommendations, or quality endorsements will fail HR-39. Use only questions about historical continuity, tasting experience, or what the wine reveals — not what the listener should do with it.

**Final Options Presented:**
1. Lebanon Was Wine Country Before France Was France. Do the Bottles Prove It? (75 chars)
2. Lebanese Wine Never Stopped During a 15-Year Civil War. Is That in the Glass? (77 chars)
3. Lebanese Wine Outlasted Rome and a Civil War. What's Left in the Glass? (71 chars)

**Research-to-Title Alignment:** France-comparison angle (biggest content gap from research) powers Options 1. Civil war resilience angle (emotionally resonant, not overused in this format) powers Options 2 and 3. The Phoenician/trade angle was folded into setup but not foregrounded in final titles — left on the table as a future episode hook if Lebanon wine is revisited.

**Joe's selection:** They Make Wine in Lebanon?!? Lebanon Was Wine Country Before France Was France. (Joe bypassed all 3 presented options. Combined the conversational surprise opener from R1's rejected title with the France-comparison clause from Title C. Feedback: "These are just not very good. We have to get better.")

---

### Ep219: Two Buck Chuck (Charles Shaw Chardonnay + Cabernet Sauvignon)
**Date:** 2026-05-22
**Series:** None

**Step 0 Research Findings:**
- Wine snob dismissal is the dominant angle in competitor content — "We Asked a Wine Snob to Review All Trader Joe's Two-Buck Chucks" is representative; snob vs. regular drinker tension is the most-used framing online
- YouTube's highest-performing format: "Can Two Buck Chuck beat a $70 Napa Cab?" — competition/does-it-hold-up framing drives clicks; blind tasting format is HR-38 banned but the "is the hate deserved?" question carries the same energy
- Chardonnay consistently scores better than Cab in external reviews; multiple sources recommend skipping the Cab — aligns with the episode result but no competitor has framed it as a surprise
- The Wine Pair already has two Two Buck Chuck episodes using "Wallet-Friendly Wine Reviews" framing — that angle is saturated and must not be echoed in future entries
- Gap: no competitor frames this as a controversy worth settling; existing content either defends or dismisses — "settling the debate" angle is uncovered

**Episode Hook:** Joe and Carmela expected the worst and were more surprised than anticipated — both wines better than expected, with the Chardonnay significantly outperforming the Cab.

**Titles Reviewed:**

| Title | Result | Clickability | Controversy | Notes |
|---|---|---|---|---|
| Is Two Buck Chuck Actually Terrible, or Is That Just Wine Snob Talk? | PASS | 9/10 | 5/5 | Reviewer's strongest pick |
| Two Buck Chuck: You Already Have an Opinion. Here's Why You're Probably Wrong. | PASS | 8/10 | 4/5 | |
| Two Buck Chuck: Wine Snobs Have Always Dismissed It. Were They Right All Along? | FAIL HR-39 | — | — | Tilts toward snob-validation verdict, telegraphs outcome |
| Two Buck Chuck: The Wine You're Not Supposed to Like. So Why Do Millions? | PASS | 7/10 | 4/5 | WARNING: two-part format echo with recent episodes |

**Quality Gate:** One title dropped (HR-39 FAIL). Three titles cleared quality gate.

**Final Options Presented:**
1. Is Two Buck Chuck Actually Terrible, or Is That Just Wine Snob Talk? (68 chars)
2. Two Buck Chuck: You Already Have an Opinion. Here's Why You're Probably Wrong. (78 chars)
3. Two Buck Chuck: The Wine You're Not Supposed to Like. So Why Do Millions? (72 chars)

**Research-to-Title Alignment:** All three final options use the wine snob dismissal tension identified as the dominant angle in Step 0. Option 1 most directly fills the content gap — framed as settling a controversy rather than just reviewing. The Chardonnay-outperforms-Cab angle (a gap in competitor content) was intentionally left out of titles to avoid spoiling the episode result.

**Joe's selection:** Is Two Buck Chuck Actually Terrible, or Is That Just Wine Snob Talk? (Option 1 — reviewer's strongest, 9/10 Clickability, 5/5 controversy)

---
