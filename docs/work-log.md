# Work Log — The Wine Pair Podcast

**Last updated:** 2026-07-04 (session 31 — enforcement testing complete; two bypasses confirmed; corrective commit adds approval file gate and Bash hook coverage)

**Strategic intelligence:** `docs/strategic-intelligence.md` — living log of research, audience signals, and data. Currently 3 entries (wine predictability research; Gen Z anti-condescension signal; show description price-range drift).

---

## Session 31 summary (2026-07-04) — Enforcement testing + corrective commit

**Objective:** Test whether the session 30 guards are actually hard. Three staged tests requested by Joe before any blog work begins.

### Test 1 — Terminal/subprocess bypass: CONFIRMED (bypass exists)

**What was tested:** Can PowerShell or Node.js write `outputs/blog-post-*.md` without triggering the PreToolUse hook?

**Result:** YES. Both succeeded:
- `Set-Content outputs/blog-post-guard-bypass-test.md "test"` → file created
- `node -e "require('fs').writeFileSync('outputs/blog-post-guard-bypass-test.md','test')"` → file created

**Root cause:** The `Write|Edit` matcher only fires on Claude Code's built-in Write and Edit tools. The Bash tool runs shell commands as a subprocess. The hook never saw either write.

**Fix applied:**
- Extended `blog-draft-guard.js` to handle `Bash` tool calls — parses command string with regex to detect explicit `outputs/blog-post-*.md` path mentions
- Updated `.claude/settings.json` matcher from `Write|Edit` to `Write|Edit|Bash`
- Residual gap: indirect writes (e.g. node -e with dynamically constructed path, or shell variable expansion) are not catchable without OS-level sandboxing. Documented honestly in CLAUDE.md and hook comments. Using a terminal command to bypass the hook is a rule violation.

### Test 2 — Approval provenance bypass: CONFIRMED (bypass exists)

**What was tested:** Can Claude self-modify the Status field in a brief to pass the approval check?

**Result:** YES.
- Valid but unapproved brief → hook denied write ✓
- Claude used `replace_string_in_file` to change `[ ] Draft — not yet approved` to `[x] Approved by Joe`
- Same brief, self-modified → hook ALLOWED write (bypass confirmed)

**Root cause:** Approval was checked by pattern-matching text in a Claude-writable file. Claude can edit the brief, so Claude can satisfy its own approval gate.

**Fix applied:**
- Removed Status field approval check from `validateBrief()` in `validate_blog_opportunity.js`
- Added separate Joe-only approval file: `docs/opportunity-briefs/approvals/[slug].approved`
- Hook now requires the approval FILE to exist before allowing any blog draft write
- Created `docs/opportunity-briefs/approvals/` directory with README explaining the mechanic
- Added HR-65: this directory is Joe-only. Claude must never create, modify, or delete files here.
- Residual gap: Claude could still create the approval file if it deliberately violated HR-65. This is instruction-enforced, not technically impossible. Stated honestly in CLAUDE.md and README.

### Test 3 — Regression Test B (full /review-blog-post run): PASS

**What was tested:** Does the current `/review-blog-post` workflow detect the Douro Branco draft as the wrong post for a broad Portuguese wine brief?

**Brief used:** Broad Portuguese wine category guide (all 5 styles, Ep135/150/170/208/212 all Essential). Excluded scope: standalone single-style reviews. Approved for test purposes.

**Result:** 9 strategic failures detected:
1. SP-1: H1 targets "what is Douro Branco" — the query the brief explicitly excluded
2. SP-2: Draft covers only Douro Branco — brief required all 5 Portuguese wine styles
3. SP-3: 4 of 5 essential sources absent (Ep135, Ep150, Ep170, Ep212 missing; only Ep208 present)
4. SP-4: Wine Pair angle is generic independence statement; brief required 5-style multi-episode proof
5. SP-5: No multi-episode CTAs; only Ep208 linked (reader interested in Port or Vinho Verde finds nothing)
6. SP-6: Page type is single-wine review (H2 = wine names); brief required category guide (H2 = style names)
7. SP-7: Broad discovery need never addressed — reader searching "Portuguese wine" finds a tasting note
8. SP-8: Image is two Ep208 bottles; brief required regional category guide imagery
9. SP-9: Two Review Schema blocks present; brief explicitly prohibited Review Schema for a category guide

The review also found 3 formatting violations (HR-8, HR-43, HR-52), 2 missing section counts, and 1 unverified URL flag. Overall verdict: NOT READY FOR JOE.

**Conclusion:** The `/review-blog-post` strategic pass correctly identifies this draft as the wrong post for the approved brief. Test 3 passes.

---

### Enforcement conclusion: **B — bypasses found, corrective commit applied**

**What is now technically enforced:**
- Write and Edit to `outputs/blog-post-*.md` without a valid brief → hook denies
- Write and Edit to `outputs/blog-post-*.md` without a Joe approval file → hook denies
- Write and Edit to `outputs/blog-post-*.md` with a structurally incomplete brief → hook denies
- Bash commands with explicit blog-post path mentions without a valid brief → hook denies (best-effort)

**What is instruction-enforced (not technically impossible):**
- Indirect terminal writes with dynamic path construction (OS-level sandboxing required to close this)
- Claude creating the approval file itself (HR-65 prohibits it; violating HR-65 is a deliberate rule violation, not an accidental bypass)

**Files changed in session 31 corrective commit:**
- M `scripts/hooks/blog-draft-guard.js` — Bash handling + approval file check
- M `scripts/validate_blog_opportunity.js` — removed Status field approval check; added approval file check to main()
- M `.claude/settings.json` — matcher extended to Write|Edit|Bash
- A `docs/opportunity-briefs/approvals/README.md` — Joe-only directory documentation
- M `docs/house-rules.md` — added HR-65 (approvals directory is Joe-only)
- M `CLAUDE.md` — updated approval mechanism description; documented terminal bypass limitation
- M `docs/work-log.md`

---

## Session 30 summary (2026-07-04) — Blog methodology enforcement

**Corrective commit on top of 00fb319. Addresses all items identified in ChatGPT's audit response.**

**What was wrong with 00fb319:**
- CLAUDE.md not updated — old impression-threshold prioritization rule still in place; old "state 4 things first" short version still routed around opportunity brief gate
- `review-blog-post.md` Step 0: missing brief silently skipped strategic pass instead of failing hard
- No technical enforcement — every new gate was natural-language-only instruction
- Two stale FAQPage references in `docs/blog-post-guide.md` (Beamly fields paragraph + checklist numbering)
- Schema "correct and compliant" claim unsubstantiated — averaged ratingValue not explicitly shown on page

**What this commit adds:**

1. `scripts/validate_blog_opportunity.js` — standalone structural validator for opportunity briefs. Checks: all 9 required section headings, non-stub candidate topic + objective + excluded scope, evidence window present, archive inventory rows present, source classifications present, Wine Pair angle filled, listener path filled, approval status = [x] Approved by Joe. Exit 0 = pass, exit 1 = structural issues (lists them), exit 2 = brief not found.

2. `scripts/hooks/blog-draft-guard.js` — PreToolUse hook. Fires on Write|Edit to `outputs/blog-post-*.md`. If no brief at `docs/opportunity-briefs/[slug]-brief.md`: denies write with clear message. If brief found but fails validation: denies write with list of structural issues. If brief valid and approved: allows write. Fails open on script errors (never locks workspace). Naming convention: draft slug in `blog-post-[slug].md` must exactly match brief slug in `[slug]-brief.md`.

3. `.claude/settings.json` — PreToolUse hook added for Write|Edit, exec form (Node.js on Windows).

4. `CLAUDE.md` — three changes:
   - Blog post prioritization rule: impression threshold retired, replaced with opportunity brief methodology
   - "Writing blog posts" short version: "state 4 things first" replaced with opportunity brief → approval → draft sequence
   - Reference table "Writing a blog post" row: FAQPage schema requirement removed, opportunity brief routing added

5. `.claude/commands/review-blog-post.md` — Step 0: missing brief changed from "strategic pass skipped" to HARD FAIL / STOP.

6. `docs/blog-post-guide.md` — three changes:
   - Beamly fields paragraph: removed "along with the FAQPage schema block"
   - Post-publish checklist: renumbered (was 1-2-3-4-6-7-8-9, now 1-2-3-4-5-6-7-8)
   - Review Schema template: two-reviewer schema hold documented (averaged ratingValue 4.5 not explicitly shown on page; do not generate for new posts until resolved)

**Regression Test A — PASS:**
Simulated `PreToolUse` Write hook for `outputs/blog-post-portuguese-wine-douro-branco.md` (no brief exists). Hook returned `permissionDecision: "deny"` with specific message including expected brief path. A non-blog-draft file (episode output) passed through with exit 0. The original Portuguese wine failure sequence is now blocked before the draft file can be created.

**Regression Test B — PASS:**
Stub brief created at matching slug path, run through validator — detected 8 structural issues (stub topic/objective/scope, missing evidence window, no archive rows, stub Wine Pair angle, stub listener path, unapproved status). Hook returned deny with full issue list. When the brief is a stub, the draft cannot be created. When the brief is properly completed but the draft is narrow-scope, the strategic pass in `/review-blog-post` catches the failures — this was demonstrated in the Session 30 audit (9 strategic failures identified against a broad Portuguese wine brief). Naming convention additionally enforces topical consistency: a broad Portuguese wine brief files as `portuguese-wine-brief.md`, incompatible with the `portuguese-wine-douro-branco` slug.

**Schema open investigation:**
Two-reviewer Review Schema (averaged ratingValue not explicitly shown on page) is an unresolved compliance question. Current B&B and Josh posts have ratingValue 3 and 4.5 respectively in JSON-LD; only individual Joe/Carmela scores are visible. Rich Results Test not yet run. Do not generate new Review Schema for posts with separate visible host scores until this is resolved. Document resolution in work-log when confirmed. Beamly Article markup unaffected.

**Files changed in this corrective commit:**
- A `scripts/validate_blog_opportunity.js`
- A `scripts/hooks/blog-draft-guard.js`
- M `.claude/settings.json`
- M `CLAUDE.md`
- M `.claude/commands/review-blog-post.md`
- M `docs/blog-post-guide.md`
- M `docs/work-log.md`

---

## Session 29 summary (2026-07-04) — GSC analysis + queue reorder

**GSC data analyzed (28-day window ending 2026-07-04):**
- Site-wide: ~2,316 clicks, ~470K impressions, 0.47% avg CTR. Daily clicks trending up (65-92 early June → 86-105 late June).
- Chablis blog post: #2 page on site — 196 clicks, 14,536 impressions, 1.35% CTR, pos 4.25. Proving the comparison/discovery format.
- Spoke pages compounding: combined ~283 clicks across 6 spokes (up from ~150). Pinot Noir (92) + Prosecco (91) leading.
- Josh Wine blog post underperforming: 22,149 impressions, 74 clicks, 0.33% CTR (pos 7.14). Primary fix: internal link from episode page — added today, confirmed live 2026-07-04.
- Chill Red Wine blog post: same issue — 18,221 impressions, 0.33% CTR, pos 7.75. No easy fix other than time.

**Queue reordered:** Assyrtiko (7,619 imp, 0.24% CTR) and Txakoli (6,570 imp, 0.21% CTR) are new signals not previously on queue. Both jump above Pinotage in 28-day volume. Two Buck Chuck removed (episode at ~1% CTR). See updated Phase 2 queue below.

**Portuguese wine blog post — INVALIDATED. Preserved as regression test.**
- File: `outputs/blog-post-portuguese-wine-douro-branco.md`
- Root cause: scope narrowed from "Portuguese wine" (broad category, 5 episodes) to "Douro Branco" (one style, 1 episode). Assignment was silently redefined — nobody approved changing the topic.
- Status: Do NOT publish. File preserved as Regression Test B artifact.
- Regression Test B definition: compare this draft against an approved broad Portuguese wine opportunity brief. Must fail for: scope narrowing, unjustified one-episode dominance, Wine Pair angle not delivered at category scope, image scope mismatch (two specific bottles vs. regional guide), listener path mismatch.

**Blog decision system repair — session 29 continuation (2026-07-04):**
- Full methodology audit completed across 3 rounds of independent ChatGPT review.
- Root cause: no pre-writing opportunity analysis; queue impression numbers misrepresented as search demand; self-review was mechanical lint only (could not catch strategic failures).
- Five files updated: `docs/blog-post-guide.md`, `.claude/commands/review-blog-post.md`, `docs/house-rules.md`, `docs/seo-geo-strategy.md`, new `docs/opportunity-briefs/template.md`.
- New decision flow: candidate pool → opportunity brief (evidence-backed) → scope locked → draft → brief comparison → mechanical lint → Joe review.
- Schema audit completed (2026-07-04): Beamly auto-generates Article block. Our Review Schema blocks are separate — no conflict. FAQPage schema not present in raw HTML of any live blog post. Chablis (best performer, 1.58% CTR) has zero structured data beyond Beamly's auto Article block.
- BRD retrieved and read: `WinePair_Content_Intelligence_BRD.md` (Drive ID: 1s5NPUo0eumb5skaTH25OXRIyk81Vtj1l). BRD is a spec for a future automated tool; its evidence standards (separate evidence from interpretation; no recommendations without evidence; "what is the Wine Pair angle?") apply to all manual content decisions.

**Josh wine query CTR anomaly (open item):**
- "josh wine" query: 0.09% CTR at average position 3.2. Prior diagnosis of "likely cannibalization" was retracted — cause unknown.
- Internal link from episode page to blog post added and confirmed live 2026-07-04.
- Status: monitor CTR at next GSC checkpoint. If no improvement, run query+page dimension analysis and SERP inspection. Not a current blocker.

---

## Session 28 continued (2026-07-03) — Ep225 cover art + anatomy safety system

**Ep225 cover art completed (commit f9889ff):**
- Concept selected: Concept B — The Cross-Court Pass (43/50).
- First batch rejected by Joe (built around Costco/prestige-label paradox). Second batch reframed around "non-Cab lovers surprised by both wines." Concept B selected from second batch.
- ChatGPT prompt written and saved to `outputs/episodes/ep225-kirkland-pauillac-saint-julien.md`.
- `data/cover-art-scenes.md` updated: Ep225 added, Ep218 removed.
- `data/cover-art-session-reports.md` updated: Ep225 entry added, Patterns Learned updated with key lesson (for challenge/comparison episodes, the emotional tasting experience beats external facts about provenance or branding).

**Anatomy safety system added (commit 37a8443):**
- Root cause: "Arms crossing at center in a bold X-shape" passed all review gates because no gate checked whether AI image models can render the scene without broken anatomy. Result: floating sleeves, disconnected elbows, phantom hands in the Ep225 ChatGPT render (ChatGPT fixed the image manually; ep225 file was not changed).
- Fix: HR-62 added to `docs/house-rules.md` — defines the anatomy risk patterns and six safe staging alternatives.
- Four changes to `.claude/commands/generate-cover-art.md`:
  1. Step 0 anatomy gate added (filter before passing concepts to subagent).
  2. Second review subagent prompt updated: HR-62 added to special attention list; item (10) Anatomy Executability added; score accuracy renumbered to (11).
  3. Arm and Hand Clarity section added to ChatGPT prompt template (between Scene and Composition).
  4. Both "No text/labels" lines corrected: now use "No text, captions, speech bubbles, or decorative labels except required wine bottle label text."

---

## Session 28 continued (2026-07-03) — FAQ evidence system validated end-to-end; Ep225 audit committed; Ep223 regression test passed

**Ep225 FAQ audit completed and committed (commit ac7be07):**
- Full Section 9 audit built: 13 C1 queries live-executed via DDG HTML, 4 C2 pages attempted (2 successful, 2 redirected).
- All 15 candidates scored with evidence IDs + rationale in every cell.
- Négociant question auto-failed (vocabulary = 0); "Who bottles" question passed (score 16).
- Episode file updated: 7 changes including price claim correction ($20 threshold from C2-1), new Q6 "Who bottles Kirkland SJ?", Q3/Q4 order swap, Q5 expanded to both wines, Post 10 terminology fix, Post 4 length fix.
- Validator passed clean. Diff reviewed and approved by Joe before commit.
- Audit: `outputs/episodes/faq-audits/ep225-faq-audit.md`
- Episode: `outputs/episodes/ep225-kirkland-pauillac-saint-julien.md`

**Ep223 regression test — non-Costco / C1-not-required (commit 0ba0e0f):**
- Episode type: standard two-wine review (2022 Cantina Roccafiore Melograno / Umbria, 2021 Di Majo Norante Terre degli Osci / Molise).
- Step B.1 correctly classified as "C1 not required" — no preflight ran, no blocking occurred.
- 14 candidates scored (including 2 existing FAQ questions formally scored as Candidates 13 and 14).
- Key findings: existing Q7 "Is Chianti better with food?" fails at score 7 (question is about Chianti, not the reviewed wines). Existing Q1 "What is Sangiovese wine outside Tuscany?" passes (score 16) but is superseded by Candidate 7 per duplicate-coverage rule.
- New addition: comparison question "Should you choose the Umbrian or Molise Sangiovese?" (score 17) — justified by hosts' explicit occasion-based choice (equal 8/10 ratings but distinct use cases).
- Ep223 episode file NOT updated — regression test only.
- Audit: `outputs/episodes/faq-audits/ep223-faq-audit.md`

**FAQ evidence system status: validated and in production.**
- C1-required episodes (Costco/private-label): Ep225 proves the gate works.
- C1-not-required episodes (standard reviews): Ep223 proves the gate does not over-trigger.
- Evidence IDs (I-N, C1-N, C2-N) required in every scoring cell.
- C1 search cannot be claimed without actual query/result evidence.
- System stops when C1 is required but unavailable.
- Audit files live at `outputs/episodes/faq-audits/ep[N]-faq-audit.md`.

---

## Session 28 summary (2026-07-03)

**Ep225 — Costco Kirkland Signature Challenge: Pauillac vs. Saint-Julien Bordeaux!**
- Title confirmed: `Costco Kirkland Signature Challenge: Pauillac vs. Saint-Julien Bordeaux!`
- Episode: two 2023 Kirkland Signature Bordeaux wines — Pauillac (92 pts, back at Costco first time in 7 years, under $25) and Saint-Julien ($18.49, 93 pts).
- Ratings from script: Saint-Julien 7/10 (both), Pauillac 8/10 (both).
- Google Doc ID: `148HBLjDZaWnVsZDJCkcCRVVoxhy82MQCKF5PKSU1gv4`
- SEO/AEO content generated and validated: `outputs/episodes/ep225-kirkland-pauillac-saint-julien.md`
  - KEY QUESTIONS (7), FREQUENTLY ASKED QUESTIONS (7), Review Schema x2, FAQPage Schema, Bluesky Posts (10)
  - FAQ regenerated under new evidence-scoring system (session 28 process fix — see below)
  - FAQ audit file: `outputs/episodes/faq-audits/ep225-faq-audit.md`

**Process fix — HR-61:**
- Root cause: the Clickability quality gate incorrectly eliminated a correctly formatted series title by penalizing it for being "expected." The series format is the point, not a weakness.
- Fix: added HR-61 to `docs/house-rules.md` — series titles that pass all hard rules are exempt from the Clickability floor.
- Updated `.claude/commands/review-titles.md` step 6.5 with the series exception.

**FAQ scoring system redesign:**
- Root cause: FAQ generation was slot-filling from episode content rather than selecting questions based on verifiable listener/search intent evidence.
- Fix: complete architecture redesign based on ChatGPT review.
  - Created `docs/faq-intent-model.md` — defines episode type classifications, explicit 0-3 scoring rubric for 6 criteria, penalty table, tie-breakers, web search trigger rules, and combined vs. separate vs. comparison buy question decision rules.
  - Updated `.claude/commands/generate-episode-content.md` — replaced "write 7 questions" instruction with a 9-step evidence-bound candidate scoring process (Steps A through I). Web search is a blocking gate for Costco/private-label/current-product episodes.
  - FAQ count is now 5-7 based on scoring, not a fixed 7.
  - Audit files saved to `outputs/episodes/faq-audits/ep[N]-faq-audit.md` (separate from public episode file).
- Ep225 FAQ regenerated under new system: négociant question correctly rejected (score 0 plausibility, 0 vocabulary, auto-fail). New Q7 "drink now or age?" added based on dual external evidence (RWS + Tastings.com both address this directly).

**Drive search script:**
- Created `scripts/find_episode.mjs` — reusable script accepting any search term as `process.argv[2]`.
- Usage: `node scripts/find_episode.mjs "Episode 225"`
- Updated `CLAUDE.md` Finding files section to reference this script.

---

## Session 27 summary (2026-06-27)

**Ep224 — Moscato d'Asti — title + content + cover-art documentation updated.**
- Confirmed title selected and archived: `Is Moscato d'Asti the Sweet Wine Serious Wine People Won't Admit They Love?`
- Updated title trackers:
  - `data/title-session-reports.md` (Ep224 selection set)
  - `data/episode-titles.md` (through Ep224)
- Added episode content file: `outputs/episodes/ep224-moscato-dasti.md` with:
  - `KEY QUESTIONS` (7)
  - `FREQUENTLY ASKED QUESTIONS` (7)
  - FAQ + Review schema markup
  - `BLUESKY POSTS` (10)
- Cover art concept finalized: **Concept D — Celebration Confession (46/50)**
  - Full ChatGPT prompt added to `outputs/episodes/ep224-moscato-dasti.md` under `## COVER ART`
  - `data/cover-art-session-reports.md` updated with Ep224 entry + selection
  - `data/cover-art-scenes.md` updated with Ep224 approved scene and oldest entry removed to keep 5-scene cap
- Session preference captured: avoid random one-off dessert props and candle framing; use proper wine glass shape (small tulip white wine glass, not flute).

---

## Session 25 summary (2026-06-16)

**GSC analysis (28-day window ending 2026-06-16) and orphaned file migration.**

- **Josh Wine identified as #1 priority.** Query "josh wine" is at position 3.2 with 6,927 impressions but only 6 clicks (0.09% CTR). Episode page (position 5.18) and blog post (position 7.32) cannibalizing each other. Combined Josh Wine traffic ~24K impressions / 28 days. Fix path: internal linking from episode page → blog post (Beamly has no head code injection, so canonical tags via head are not available).
- **Portuguese wine validated as Phase 2 #1:** 20,154 impressions (90-day) at 0.09% CTR. Blog post could convert at ~2% based on Chablis blog performance (1.58%).
- **Spoke pages validated:** Combined 150 clicks / 28 days from Pinot Noir (59), Prosecco (32), Chardonnay (25), and 3 others. Average position improved 9.5 → 7.2 in 28 days.
- **Strategic plan saved** to `.claude/plans/hello-optimized-kahan.md`, approved.

**Orphaned file migration — April 18, 2026 blog post source files found in Google Drive and migrated to `outputs/`:**
- `outputs/blog-post-josh-wine-review.md` — Drive id `1hDIpNv6rZHD9JuGQyGNxwPV0DxHSmL-W`. SEO block + full post + FAQ block + Review Schema (3 wines: Chard 6/10, Cab 5/10, Pinot 4-5/10).
- `outputs/blog-post-should-you-chill-red-wine.md` — Drive id `1nLG9tR1UoEQRymJI_Iqg8h-mDZwVTKSE`. Format A (paragraph form, no headers).
- `outputs/archive-2026-04-18-blog-post-instructions.md` — Drive id `1dL9CMRrdOlWuC6mXEaIopNEeaxvFpAWM0Dpt8EytBvE`. Historical instructions defining Format A/B blog post types.
- Root cause of documentation gap: the repo was 9 days old when these were created; outputs/ discipline was established later.

**New memory:** `feedback_beamly_self_serve.md` — don't ask Joe Beamly questions; check `docs/blog-post-guide.md`, `docs/publishing-checklist.md`, `.claude/commands/verify-published.md`, `.claude/commands/review-blog-post.md`, `docs/house-rules.md` first.

**Pending (per plan):**
- ✓ Internal link from Josh Wine episode page → blog post — LIVE 2026-07-04.
- Ep223 title confirmation (blocks SEO/AEO generation).
- Portuguese wine blog post (Phase 2 #1).
- Publish 4 ready episodes: ep217-viura, ep218-malvasia, ep219-two-buck-chuck, ep221-lebanese-wine.
- Complete positioning rollout: homepage hero + meta, media kit opener, social bios.

---

## Session 26 summary (2026-06-20)

**Ep223 title workflow started from full Google Doc transcript (`EPISODE #223: Italian Sangiovese not Chianti`).**

- Drive startup sync completed: 4,082 files scanned, 0 title updates needed, 15 prompts synced.
- Retrieved and reviewed the full Episode 223 show-notes/transcript doc (ID `12o2UK7rae3uaW1qu39KFmYA6bR-RsXw6oZOYMeHJC2I`).
- Ran `/review-titles` process: read title history and patterns, completed web angle scan, executed two QA rounds.
- Added Ep223 session entry to `data/title-session-reports.md` with final pass list and rationale.
- Final passing options prepared for Joe selection (pending):
  - `Italian Wine Adventure #25: Sangiovese Beyond Chianti! Missing Half the Story?`
  - `Italian Wine Adventure #25: Sangiovese Outside Tuscany! Better Than Chianti?`

**Title-rules update (requested):**
- Updated `docs/house-rules.md`:
  - HR-16 changed from fixed 60-80 chars to cap-only: max 100 chars, no minimum.
  - Added preferred range guidance (35-75) as non-fail advisory.
  - HR-17 strengthened to emphasize first-30-character signal and early hook terms.
- Updated `.claude/commands/review-titles.md` to match new policy (fail only over 100 chars; no lower bound).

**Ep223 title rerun under updated rules (series + non-series mix):**
- New session entry appended to `data/title-session-reports.md` (Ep223 Session 2).
- Strongest non-series options:
  - `This Ain't Chianti: Is Italian Sangiovese Better Outside Tuscany?`
  - `Chianti Isn't Sangiovese. Is Tuscany Keeping You From Better Bottles?`
- Strongest series option:
  - `Italian Wine Adventure #25: Sangiovese Outside Tuscany. Better Than Chianti?`
- One title rejected as spoiler (HR-39): `If You Think Chianti Is Sangiovese, You're Missing the Good Stuff`.

**Ep223 title rerun (simplified request):**
- Ran a clean two-round, scored-only series rerun to reduce complexity while keeping full QA rigor.
- Round 1 failed due to verdict-leaning "better than" phrasing.
- Round 2 produced 3 passing, quality-gate-cleared finalists:
  - `Italian Wine Adventure #25: Not Chianti. Sangiovese from Umbria and Molise`
  - `Italian Wine Adventure #25: Sangiovese Beyond Chianti. What Changes?`
  - `Italian Wine Adventure #25: Sangiovese Outside Tuscany. What Changes?`
- Session 3 entry appended to `data/title-session-reports.md`.

**Ep223 title confirmation and asset creation:**
- Joe confirmed title direction and selected: `This Ain't Chianti: Is Italian Sangiovese Better Outside Tuscany?`
- Updated title trackers:
  - `data/title-session-reports.md` (selection field updated)
  - `data/episode-titles.md` (through Ep223)
- Updated episode output file `outputs/episodes/ep223-sangiovese-outside-tuscany.md` with:
  - Confirmed title heading
  - `## KEY QUESTIONS` (7)
  - `## FREQUENTLY ASKED QUESTIONS` (7, Q./A. format)
  - `## COVER ART` ChatGPT prompt (ready to paste)
- Added `### BLUESKY POSTS` (10) to `outputs/episodes/ep223-sangiovese-outside-tuscany.md` using transcript-grounded facts and unique external source links for posts 4-10.
- Validated Episode 223 Bluesky section with `node scripts/validate_episode.js outputs/episodes/ep223-sangiovese-outside-tuscany.md --sections=BLUESKY` (PASS).
- Regenerated `## KEY QUESTIONS` and `## FREQUENTLY ASKED QUESTIONS` for Episode 223 to replace weak first draft.
- Revalidated with `node scripts/validate_episode.js outputs/episodes/ep223-sangiovese-outside-tuscany.md --sections=KEY_QUESTIONS,FAQ` (PASS).
- Cleaned `outputs/episodes/ep223-sangiovese-outside-tuscany.md` to requested scope only by removing `## Wine in the News` and `## COVER ART` sections.
- Revalidated scoped deliverable with `node scripts/validate_episode.js outputs/episodes/ep223-sangiovese-outside-tuscany.md --sections=KEY_QUESTIONS,FAQ,BLUESKY` (PASS, no warnings).

**Pending:**
- If needed: generate alternate cover-art concept prompts before final image generation.

---

## Session 24 summary (2026-06-14)

**Positioning rollout — reviewed ChatGPT's "Positioning, Podcast Directory, SEO and AEO Action Plan."**
- Confirmed against the live Buzzsprout RSS description (Joe provided it verbatim): current description opens with the Decanter quote, says "three wines... under $25 each... easy to find," has no buying verdict, no "new to us," and no independence framing. ChatGPT's critiques checked out against the real source.
- Cut from ChatGPT's plan: Step 11 (topic hubs) and Step 12 (searchable wine-review database) — both already exist (`/blog/similar-wines` hub is live with all 6 spokes; `/shopwine` is already the wine-review database, organized by rating with buy links). No new work needed.
- New canonical positioning locked in `docs/soul-document.md` under "Positioning Statement (canonical)": one-sentence description, proof statement, personality statement, positioning hierarchy. Referenced by new HR-48.
- Found and fixed a real accuracy issue: "under $25" is no longer always true (Ep217 Frappato $27.97, Ep221 Lebanese wines $25.97). `docs/soul-document.md` Accessibility Focus and "What We DON'T Cover" updated to "usually under $25." Logged as Strategic Intelligence Entry 003.
- `docs/seo-geo-strategy.md` Area 4 trust cluster updated: consolidated the two planned methodology pages ("How We Rate Wines" + "Why We Buy Our Own Wines") into one "How We Choose, Taste, and Rate Wine" page, per HR-41.
- HR-36 canonical AEO phrase list: added "wines that are new to us." Added HR-48.
- Drafted ready-to-paste copy for every surface in `outputs/positioning-rollout.md`: Buzzsprout description + keywords (6 new keyword slots filled), YouTube About, homepage hero + meta description, media kit opener, social bios. Awaiting Joe's review/edits before anything is pasted.

---

## Session 23 summary (2026-06-13)

**Ep223 — Sangiovese Outside Tuscany — Wine in the News complete.**
- Story: University of York ancient DNA study (published 2026-06-12) — 2,000-year-old grape seeds from Cetamura del Chianti show the Chianti region was a white wine region from 300 BCE to 300 CE. Strong tie-in to Sangiovese outside Tuscany episode.
- Script: Joe's rewrite saved to `outputs/episodes/ep223-sangiovese-outside-tuscany.md`. Fact-checked clean before presenting.
- Archive updated: `data/wine-in-the-news-archive.md`
- Episode number confirmed: Ep223. Slug is placeholder until title confirmed.
- Remaining work: SEO/AEO content, episode title, cover art — after episode script is ready.

**Wine in the News instructions rebuilt (`docs/wine-in-the-news.md`):**
- Root cause of poor output identified via diff of AI draft vs Joe's actual rewrite of the Chianti story.
- 9 specific patterns extracted. Every difference accounted for.
- "Mandatory segment format" section replaced with flexible "Segment format" + calibration guidance.
- New "AI writing tells" section: specific phrases never to write ("Here is the overview:", "Now let me back up...", theatrical amplification paragraphs, literary flourishes, etc.).
- Full AI-vs-Joe diff added as in-file reference example (Ep223 Chianti story).
- Memory file `feedback_wine_in_the_news_voice.md` updated with all 9 patterns from the Ep223 diff.

---

## Session 22 summary (2026-06-13)

**Ep222 — Alsace Pinot Gris — FULLY COMPLETE.**
- Title: "Pinot Grigio Is Boring. Alsace Pinot Gris Is Its Richer, Weirder French Cousin."
- SEO/AEO content + Bluesky posts: `outputs/episodes/ep222-alsace-pinot-gris.md` (validated PASS)
- Cover art: Concept D — Honey Double-Meaning (40/50) selected. Scene: Joe pointing at honey dripping into wine glass while Carmela swoons thinking he called her "honey." Prompt saved to output file.
- Cover art required 2 sessions: first session rejected entirely (concepts were sensory-property-based, not episode-specific).

**Three issues found and fixed (Ep222 + prevention rules):**

1. **Hallucinated FAQ (HR-3 violation):** "Should you chill Pinot Gris?" appeared in Key Questions, FAQ, and FAQPage schema but was never discussed in the episode. Fixed in `outputs/episodes/ep222-alsace-pinot-gris.md`: replaced with "What other wines are similar to Alsace Pinot Gris?" (Joe explicitly lists Albariño, Chenin Blanc, Pinot Blanc, Sylvaner, unoaked Chardonnay, Grenache Blanc, Muscadet in transcript). Prevention: removed "Should you chill [wine]?" template example from `generate-episode-content.md`; added grounding requirement and self-check item 9 requiring each FAQ answer to cite a specific episode data point.

2. **Wrong cover art heading (HR-47 violation):** `### Ep222 — Honey, I'm Talking About the Wine (40/50)` used internal concept name instead of episode title. Fixed in episode file. HR-47 updated in `docs/house-rules.md`: heading must be `### Ep[N] — [Episode Title]`. `generate-cover-art.md` Step 7 updated to match.

3. **Generic cover art brainstorm:** First session built from wine's sensory properties (color, texture), not episode-specific moments — all 3 concepts rejected. Prevention: Added Pre-0 transcript reading step to `generate-cover-art.md` (mandatory before brainstorm). Added 4th filter question: "Can you name the specific transcript moment this situation comes from? If no, cut it." Second session, sourced from specific transcript moments, produced accepted concepts first batch.

**Post-prompt workflow review (Step 7 in generate-cover-art.md) — 4 issues fixed:**
- `cover-art-scenes.md` entry format: changed from vague "structural type" to full physical action description matching existing entry format (+ "Do not repeat:" ban sentence)
- Session report template: added `**Joe's selection:** *(pending)*` as final field (prevents inconsistent ad-hoc appending)
- Rejection/redo handling: added explicit instructions — rejected batch → "All concepts rejected — redo required"; redo session → "Second Session (Redo)" subsection inside existing entry (not a new entry)
- Patterns Learned guidance: override decisions now explicitly flagged as most informative data points

**Validator bug fixed (`scripts/validate_episode.js`):**
- Em-dash check was scanning cover art code block (false positives). Fixed: strip code blocks before em-dash scan; cut off before `## COVER ART` section.
- Bluesky section extraction grabbed everything to end of file (including cover art — 3806 char false positive on Post 10). Fixed: regex stops at next `##` section.

---

## Session 21 summary (2026-06-09)

**Phase 1 (Wine Similarity Spoke Pages & Hub) — COMPLETE.**
- Hub page published at `https://thewinepairpodcast.com/blog/similar-wines`. All 6 verify-published checks pass.
- GSC indexing submitted 2026-06-09.
- Chart post (`/blog/handy-chart-to-help-you-find-wines-similar-to-ones-you-like`) updated with link to hub. Link confirmed live via verify-published.
- Chart post verify-published: 6/7 pass. FAQPage schema missing — expected (pre-schema post, backfill deprioritized, no action needed).

---

## Session 19 summary (2026-05-30)

**Ep221 Lebanese wine — full episode pipeline complete. Ready to publish.**
- Title confirmed: "Lebanon's Wine Gave Jesus His First Miracle. Does the Modern Stuff Hold Up?"
- SEO/AEO content + Bluesky posts: `outputs/episodes/ep221-lebanese-wine.md` (validated PASS)
- Cover art: Concept B — History Avalanche (43/50) selected. Bottle: "LEBANESE WINE." Prompt saved to output file.

**Cover art system rebuilt (systemic fix):**
- Root cause: generation started from title theme, not physical situations; static poses instead of actions
- Step 0 redesigned: 10 physical situations brainstormed first, 5 filtered and passed as seeds to subagent
- Title alignment demoted from scored criterion to binary pass/fail gate
- New scoring criteria: Visual Arrest, Scroll-Stop Power, Episode Specificity, Concept Originality, Character Expressiveness
- HR-13 and HR-14a updated; HR-47 added (save prompt to episode output file)
- `data/cover-art-scenes.md` rewritten: specific physical actions instead of abstract structural labels

**New rules added:** HR-14a (active physical verb requirement), HR-47 (prompt saved to episode output file)

**Note:** Religious/sacrilegious staging is off-limits for cover art — Joe rejected Concepts G and H ("nearly blasphemy") despite high scores. Saved to memory.

---

## Immediate next actions

1. **Phase 2 SEO blog post sprint — now active.** Phase 1 complete. Portuguese wine (#1 priority, 20,154 impressions / 0.09% CTR) is the next blog post.
2. **Hub page — LIVE** `https://thewinepairpodcast.com/blog/similar-wines`. GSC indexing submitted 2026-06-09. Chart post linked. ✓ Done.
3. **Prosecco spoke — GSC indexing requested 2026-05-25.** ✓ Done.
4. **Positioning rollout — Buzzsprout description + keywords + YouTube About LIVE 2026-06-14.** Remaining: homepage hero/meta, media kit opener, social bios — drafts in `outputs/positioning-rollout.md`. Directory audit (Apple, Spotify, Amazon, iHeart, Podchaser, Goodpods, Rephonic, Feedspot, Google) after feed has propagated a few days. Does not block the SEO sprint — Portuguese wine post stays priority #1.

**FAQPage schema backfill (Malbec, Bread & Butter, Josh) — DEPRIORITIZED 2026-05-18.** Schema already live on all priority pages. Add to new pages going forward; no backfill sprint needed.

**Chill red wine post — NO ACTION NEEDED.** May 18 GSC: 1,635 impressions, 0.12% CTR, position 7.75 — still young. `/verify-published` confirmed all 6 checks passing. Low CTR explained by early position, not missing content.

---

## Active projects

### Blog — Phase 1: Wine Similarity Spoke Pages & Hub

**Phase 1 COMPLETE as of 2026-06-09. All 6 spokes live. Hub live. Chart post links to hub.**

**Locked decisions:**
- Hub title: "Find Wines Similar to Ones You Love: The Complete Guide"
- Hub URL: `https://thewinepairpodcast.com/blog/similar-wines`
- Spoke #1 (template reference): Malbec
- Chart post (`/blog/handy-chart-to-help-you-find-wines-similar-to-ones-you-like`): visual companion to hub. Link added 2026-06-09. Spoke pages link to hub only to concentrate link equity.

**Content status:**

| Spoke | Status | Notes |
|---|---|---|
| Pinot Noir | LIVE | https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir |
| Malbec | **LIVE** | https://thewinepairpodcast.com/blog/wines-similar-to-malbec |
| Cabernet Sauvignon | **LIVE** | https://thewinepairpodcast.com/blog/wines-similar-to-cabernet-sauvignon — all checks pass, indexing requested 2026-05-23 |
| Chardonnay | **LIVE** | https://thewinepairpodcast.com/blog/wines-similar-to-chardonnay — all checks pass, indexing requested 2026-05-24 |
| Sauvignon Blanc | **LIVE** | https://thewinepairpodcast.com/blog/wines-similar-to-sauvignon-blanc — all 6 checks pass, GSC indexing requested 2026-05-24 |
| Prosecco | **LIVE** | https://thewinepairpodcast.com/blog/wines-similar-to-prosecco — all 6 checks pass, GSC indexing requested 2026-05-25 |
| Hub | **LIVE** | https://thewinepairpodcast.com/blog/similar-wines — all 6 checks pass, GSC indexing submitted 2026-06-09 |

**Assets:**
- Wine data: `data/wine_similarity_data.json` (86 wines — Sekt and American Sparkling Brut added 2026-05-25)
- Card embed template: `outputs/pinot-noir-wine-cards-embeds.html` (use as reference)
- Dimension bar card template: `templates/dimension-bar-card.html`

**Open decisions waiting on Joe:**
- [ ] Confirm whether Winedr style family names propagate to app UI

**Future episode candidates (identified 2026-05-24):**
- Verdejo (Rueda, Spain): top expert-cited SB alternative; missing from SB spoke only because no episode exists
- Vermentino (Sardinia/Corsica): coastal/saline white, commonly cited alongside SB alternatives

---

### SEO Blog Post Sprint

**Logic: Target pages with high impressions and low/no clicks. Episode pages don't convert — blog posts do.**

**Published (indexing requested):**
- "Should You Chill Red Wine?" — 2026-04-29
- "Is Josh Wine Good?" — 2026-04-29
- Bread & Butter review — https://thewinepairpodcast.com/blog/is-bread-butter-wine-good-an-honest-review — 2026-04-30

**Phase 2 candidate pool — queue invalidated (2026-07-04).**

All 6 previously queued blog post items had impression figures misrepresented as "search demand." All numbers were page-level aggregates of unknown provenance, with 28-day and 90-day data mixed without labels. None represent verified query cluster demand for the topic as a search query. The queue is replaced with an unranked candidate pool.

Corrected methodology required before any candidate advances to a post:
1. Complete an opportunity brief (`docs/opportunity-briefs/template.md`)
2. Define a GSC query cluster (actual query rows with cluster definition — not page impressions)
3. Establish the Wine Pair angle for the specific topic
4. Complete full archive inventory — every episode on this topic
5. Select page type from the analysis, not upfront
6. Scope locks when Joe approves the brief — any material change requires a brief amendment

For the first 3 candidates that advance, Joe reviews and approves the opportunity brief before drafting begins.

**Candidate pool (unranked — provenance not yet validated under corrected methodology):**

| Candidate | Episode(s) | Known evidence issue |
|---|---|---|
| Portuguese wine | Ep135, Ep150, Ep170, Ep208, Ep212 | 5 episodes; category-level guide required. Page impressions ~5,866 (28d), ~20,154 (90d) — not query-cluster demand. Regression tests A+B defined. |
| Assyrtiko | Ep — TBD | Page impressions 7,619 (28d); visible query rows ~1,677. Significant gap from page aggregate to query cluster. |
| Txakoli | Ep120 | Page impressions 6,570 (labeled 28d but page shows 5,155 — likely mixed window). Visible query rows ~115. |
| Pinotage | Ep111 | Page impressions 5,770; visible query rows ~1,679. |
| Chateauneuf-du-Pape | Ep — TBD | Page impressions 6,530 (labeled 28d but page shows 7,346 — likely mixed window). Visible query rows ~95. |
| Carignan | Ep — TBD | Page impressions 5,019 (page shows 3,912 — likely mixed window). Visible query rows ~762. |
| Best Wines Under $20 hub | multiple | Impression-independent decision — still valid. |
| Trader Joe's wine guide | multiple | Impression-independent decision — still valid. |
| Gen Z / anti-condescension post | — | Brand-building — not impression-driven. |

**Two Buck Chuck:** Episode page at 0.98% CTR — not a priority.

**Not in pool — Meiomi:** 0.97% CTR — no blog post needed.

**#9 — Gen Z / anti-condescension post:** Inspired by "Gen Z to Wine: Please Stop Condescending" (Everyday Drinking, May 2026). Brand-building, not SEO-driven. Angle: the wine world has a condescension problem — here's what we do differently, and how to actually get into wine without feeling stupid. Strong CTA into the show. Write when sprint resumes.

**NOT in queue — Meiomi:** Episode page at 0.97% CTR (208 clicks / 21,343 impressions). No blog post needed.

**How blog posts work (locked 2026-04-30):**
- Claude Code reads the episode script, writes the full draft, generates Review Schema and all Beamly fields
- Joe edits the draft, builds in Beamly, publishes
- Full process: `docs/blog-post-guide.md`

**Beamly fields confirmed:**
- Excerpt / Short description
- Custom SEO Title / Custom SEO Description
- URL slug (set manually)
- Code block at bottom: Buzzsprout embed + Review Schema combined

**Beamly strips `<style>` tags.** All HTML card embeds must use fully inline styles.

---

### Episode 223 — Sangiovese Outside Tuscany

**Status:** Episode in progress (being written). Wine in the News script complete.
**Wine in the News:** University of York study (published 2026-06-12) — ancient DNA from 2,000-year-old grape seeds at Cetamura del Chianti shows Chianti was a white wine region from 300 BCE to 300 CE, not red. Perfect tie-in: episode is about Sangiovese outside Tuscany.
**Outputs:** `outputs/episodes/ep223-sangiovese-outside-tuscany.md` — Wine in the News script only so far. Slug is a placeholder until episode title is confirmed.
**Next steps:** Full episode SEO/AEO content (`/generate-episode-content`) + cover art (`/generate-cover-art`) + episode title (`/review-titles`) once episode script is ready.

---

### Episode 222 — Alsace Pinot Gris (Pierre Sparr + Frey-Sohler Vieilles Vignes)

**Status:** SEO/AEO content + 10 Bluesky posts complete. Ready to publish show notes.
**Wines:** 2020 Pierre Sparr Grande Reserve Pinot Gris ($22.99) — Joe 6, Carmela 5 | 2020 Frey-Sohler Vieilles Vignes Pinot Gris ($21.99) — Joe 6, Carmela 5
**Finish tonight:** Both chose Frey-Sohler Vieilles Vignes Pinot Gris
**Outputs:** `outputs/episodes/ep222-alsace-pinot-gris.md` — Key Questions, FAQ, Schema markup (Review x2 + FAQPage), 10 Bluesky posts

---

### Episode 221 — Lebanese Wine (Massaya Le Colombier Rouge + Chateau Musar Jeune Red)

**Status:** Title confirmed, SEO/AEO complete, cover art selected. Ready to publish.
**Google Doc ID:** 1VHj5O5teFW3II3rBwxoh-DmwrXpIeOLuTRXZRx8P6vg
**Confirmed title:** Lebanon's Wine Gave Jesus His First Miracle. Does the Modern Stuff Hold Up?
**Wines:** 2021 Massaya Le Colombier Rouge ($25.97) — Joe 6, Carmela 6 | 2022 Chateau Musar Lebanon Jeune Red ($25.97) — Joe 5, Carmela 5 (possibly corked)
**Finish tonight:** Both chose Massaya Le Colombier Rouge
**Cover art:** Concept B — History Avalanche (43/50). ChatGPT prompt ready. Bottle label: "LEBANESE WINE."
**Outputs:** `outputs/episodes/ep221-lebanese-wine.md` — Key Questions, FAQ, Schema markup (Review x2 + FAQPage), 10 Bluesky posts

---

### Special Episode #23 — Jun Kono (Sohomare) + Leo Lê (Kappo Sono)

**Status:** SEO/AEO complete. Episode number TBD (220 or 221). Ready to publish.
**Google Doc ID:** 1XGNKuR6tLhmJ7PYPQ0eTpDfg_eRhpdsRZTMYzZu71lg
**Transcript:** `C:/Users/jamme/Downloads/transcript-special-episode-meet-the-wine-makers-23-jun-kono-president-and-master-sake-brewer-at-sohomare-and-leo-l-sommelier-of-kappo-sono-and-momoya-0.0.1.txt`
**Title:** Special Episode! Meet the (Wine) Makers #23: Jun Kono President and Master Sake Brewer at Sohomare and Leo Lê Sommelier of Kappo Sono and Momoya
**Type:** Interview episode. No wines tasted, no ratings. Joe hosted solo (Carmela absent).
**Guests:** Jun Kono (5th-gen president, Sohomare Sake Brewery, Tochigi Prefecture, founded 1872, kimoto method) | Leo Lê (sommelier/beverage director, Kappo Sono NYC + Momoya)
**Outputs:** `outputs/episodes/ep220-221-meet-the-makers-23-sake.md` — 7 Key Questions, 7 FAQ Q&As, FAQPage schema, 10 Bluesky posts. All grounded in the recorded transcript.
**Next step:** When episode number confirmed (220 or 221), rename output file and update this entry.
**Validator note:** `scripts/validate_episode.js` updated to skip Review Schema check for files with "interview episode" in metadata.

---

### Episode 219 — Two Buck Chuck (Charles Shaw Chardonnay + Cabernet Sauvignon)

**Status:** Title confirmed, SEO/AEO complete, cover art selected. Ready to publish.
**Google Doc ID:** 1bDDjKf3dnWKFR36RO9bL_XFjdsjymDlBhivd4YiP8RM
**Confirmed title:** Is Two Buck Chuck Actually Terrible, or Is That Just Wine Snob Talk?
**Wines:** 2023 Charles Shaw Chardonnay ($3.99) — Joe 5, Carmela 6 | 2023 Charles Shaw Cabernet Sauvignon ($3.99) — Joe 4, Carmela 5
**Finish tonight:** Both chose Chardonnay
**Cover art:** Concept B — The Peer Review (46/50). ChatGPT prompt ready.
**Outputs:** `outputs/episodes/ep219-two-buck-chuck.md` — Key Questions, FAQ, Schema markup (Review x2 + FAQPage), 10 Bluesky posts

---

### Episode 217 — Frappato

**Status:** SEO/AEO complete. Cover art Concept C (ice bucket ceremony) selected. Ready to publish.
**Google Doc ID:** 1R8HMN-gf8kfT7Dxqvmm8rXC2f4g6wGkT_1h5vQ243yo
**Confirmed title:** Italian Wine Adventure #24: Frappato! The Chillable Red Wine!
**Wines:** 2022 Valle Dell'Acate Il Frappato Vittoria ($22.99) — Joe 8, Carmela 8 | 2024 Gurrieri Frappato ($27.97) — Joe 6, Carmela 6
**Finish tonight:** Both chose Valle Dell'Acate
**Outputs:** `outputs/episodes/ep217-frappato.md` — Cover art (3 concepts), Key Questions, Q&A, Schema markup (Review x2 + FAQPage), 10 Bluesky posts

---

### Episode 215 — Oregon Pinot Noir cheap vs. expensive

**Status:** Recorded. Title and cover art approved. SEO/GEO copy not yet written.

**Title:** Experts Loved the $50 Oregon Pinot Noir. We Chose the $23 Bottle.
**Ratings:** Soter Planet Oregon ($22.97) — Joe 7, Carmela 7 | Chehalem Estate ($50) — Joe 7, Carmela 6
**Google Doc ID:** 1GzPVXuCYm7sE87Y-gw0o2TVwDuj6tXK6JYIWRQ6ws1c

---

### Episode 216 — Viura

**Status:** Complete.
**Google Doc ID:** 1ElzHd3K8lbLQageMUZ4evB2g9JQcYFQhfuBBMPK3b60
**Confirmed title:** Viura: The Great White Wine Hiding in Rioja's Red Wine Shadow
**Wines:** 2024 CVNE Monopole ($14.97) — Joe 7, Carmela 8 | 2024 Sierra de Tolono Rioja Blanco ($24.97) — Joe 8, Carmela 8
**Finish tonight:** Both chose Sierra de Tolono
**Outputs:** `outputs/episodes/ep216-viura.md` — Key Questions, Q&A, FAQ schema, 10 Bluesky posts
**Cover art:** Concept selected. Use image-reference workflow with ep215 approved image. Scene description in `memory/feedback_cover_art.md`.

---

---

## Content Intelligence Engine

**Repo:** https://github.com/jammele/winepair-intelligence  
**Phase 0:** Complete (2026-05-26). Project scaffold, SQLite schema, GSC/YouTube/RSS/website connectors, GitHub Actions workflow, config, docs.  
**Phase 1:** Not started. Deliverables: GSC data collection into DB, website content inventory scrape, weekly Markdown + HTML report generator.

**Blockers (Joe action required):**
1. **Google Cloud service account** — follow SETUP.md Steps 1-2 in the new repo. Takes ~20 min.
2. **YouTube API key** — SETUP.md Step 3. Takes ~5 min.
3. **GitHub Actions secrets** — SETUP.md Step 5b. Five secrets to add.
4. **GitHub Actions write permissions** — repo Settings → Actions → General → Workflow permissions → "Read and write permissions"
5. **Google Trends API alpha** — apply at https://developers.google.com/search/apis/trends (waitlisted; apply now for Phase 4)

**Architecture decisions locked:**
- Python (separate from podcast-os Node.js stack)
- GitHub Actions cron (Mondays 9 AM Pacific) — machine-state independent
- SQLite committed to repo after each run — trend history accumulates automatically

---

## Indexing — current status (as of 2026-04-30)

**Root cause resolved:** Stale www sitemap was preventing Google from discovering new pages. Non-www sitemap resubmitted 2026-04-29, now shows 448 pages, no errors.

**Google validation in progress:** GSC validating "Crawled - currently not indexed" issue affecting 58 pages.

**Posts with indexing requests submitted:**
- "Should You Chill Red Wine?" — 2026-04-29
- "Is Josh Wine Good?" — 2026-04-29
- Pinot Noir spoke (https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir) — 2026-04-29
- Bread & Butter review (https://thewinepairpodcast.com/blog/is-bread-butter-wine-good-an-honest-review) — 2026-04-30
- Cabernet Sauvignon spoke (https://thewinepairpodcast.com/blog/wines-similar-to-cabernet-sauvignon) — 2026-05-23
- Chardonnay spoke (https://thewinepairpodcast.com/blog/wines-similar-to-chardonnay) — 2026-05-24
- Sauvignon Blanc spoke (https://thewinepairpodcast.com/blog/wines-similar-to-sauvignon-blanc) — 2026-05-24
- Prosecco spoke (https://thewinepairpodcast.com/blog/wines-similar-to-prosecco) — 2026-05-25
- Hub (https://thewinepairpodcast.com/blog/similar-wines) — 2026-06-09

**Process going forward:** After every publish, submit URL in GSC → URL Inspection → Request Indexing, then resubmit the non-www sitemap. See `docs/publishing-checklist.md`.

---

## GSC / SEO checkpoints

- **May 2-5, 2026:** Check indexing status on all 4 submitted posts
- **June 14, 2026:** Check Pillar #2 intent shift; re-run AI discoverability tests

---

## Episode 218 — Malvasia

**Status:** SEO/AEO complete. Ready to publish.
**Google Doc ID:** 1NdhbEaKiJ_PzbG9l7Q2u0ECZ0o5t1o5k_DKE8-Q_4uc
**Confirmed title:** WTF is Malvasia?
**Wines:** 2022 Douloufakis Malvasia Femina, Crete Greece ($19.97) — Joe 8, Carmela 7 | 2024 Rodica Malvasia, Slovenia ($21.97) — Joe 7, Carmela 7
**Finish tonight:** Joe chose Douloufakis Malvasia Femina; Carmela chose Rodica Malvasia (split)
**Wine in the News:** Oregon winery AI fake citations story (Valley View Winery family dispute)
**Outputs:** `outputs/episodes/ep218-malvasia.md` — Wine in the News, Key Questions, Q&A, Schema markup (Review x2 + FAQPage), 10 Bluesky posts

---

## Session 18 — 2026-05-30

### Pinot Gris from Alsace — NotebookLM source research

- Upcoming episode on Pinot Gris from Alsace. Episode number not yet confirmed.
- Compiled and verified 29 sources covering: Alsace region geography/geology/history, the Tokay d'Alsace naming saga (and EU/Hungary ban), why Alsace Pinot Gris is different from other regions, dry/off-dry/sweet style confusion, Pinot Gris vs. Pinot Grigio naming and stylistic differences, Vendange Tardive and Sélection de Grains Nobles, the "thin wine" reputation and whether it's fair, skin contact/orange wine trend, Oregon and Alto Adige comparisons, aging potential, Grand Cru classification.
- All 29 URLs verified via WebFetch. 1 dead URL (BNN Bloomberg article, moved) replaced with foodie.com equivalent.
- Output: `outputs/notebooklm-sources-pinot-gris-alsace.md` — flat list of bare URLs, ready to copy-paste into NotebookLM.

### HR-46 — NotebookLM process rule (established and refined this session)

Added HR-46 to `docs/house-rules.md` through 4 iterations:
1. Auto-save NotebookLM source lists to `outputs/notebooklm-sources-[slug].md` without being asked
2. Target at least 20 verified sources; continue beyond 20 if good sources exist; no hard cap
3. Fewer than 20 acceptable only after exhaustive multi-angle research; file must include explanation at top if count falls short
4. Format: single flat list of bare URLs — no section headers, no markdown links — for easy one-shot copy-paste

### Strategic Intelligence System — created this session

- **New document:** `docs/strategic-intelligence.md` — living log of research, audience signals, and data that inform strategy. Entries are additive; nothing is overwritten. Patterns across entries guide strategy evolution — individual findings do not trigger strategy rewrites.
- **Entry 001:** Wine Market Council / Quini predictability research (Press Democrat, May 29 2026). Key stat: only 11% of consumers can predict wine flavor before purchase vs. ~50% for beer/spirits. 23% have had a bad experience from a mispredicted purchase. Wine-hesitant consumers average fewer than 10 wines tried per decade.
- **Entry 002:** Gen Z anti-condescension signal (Everyday Drinking, May 2026). Gen Z actively rejecting wine's gatekeeping culture; want honest approachability.
- Wired into CLAUDE.md reference table: read `docs/strategic-intelligence.md` when making strategic recommendations, evaluating content direction, or advising on episode topics.
- **Key direction from Joe (important):** podcast-os should function as a strategic thinking partner / learning system. Research and articles are inputs to an organic, evolving strategy — not triggers for blog posts or document rewrites. Don't make any single finding THE strategy. Let patterns across multiple inputs guide how strategy evolves over time.

---

## Session 16 — 2026-05-25

### Special Episode #23 — SEO/AEO content

- Read episode script (Google Doc `1XGNKuR6tLhmJ7PYPQ0eTpDfg_eRhpdsRZTMYzZu71lg`) and transcript from Downloads.
- Generated 7 Key Questions, 7 FAQ Q&As, FAQPage schema, and 10 Bluesky posts. All content grounded in actual transcript (Kono family samurai history, Leo's Nougatin foie gras pairing, Tuxedo blending process, Yamadanishiki rice sourcing from Yokawa, old school vs. new school sake framing).
- Iterated twice at Joe's direction: (1) replaced generic questions not covered in the episode with transcript-specific topics; (2) rewrote FAQ answers to stay closer to what Jun and Leo actually said, removing a shiboritate reference that came from the script doc rather than the recorded interview.
- Output: `outputs/episodes/ep220-221-meet-the-makers-23-sake.md`
- Validator updated: `scripts/validate_episode.js` now skips Review Schema check for interview episodes (flagged via "interview episode" in file metadata).

---

## Session 15 — 2026-05-25

### Prosecco spoke — completed and published

- **Spoke page:** `outputs/prosecco-spoke.md` — 7 wine sections (6 main + Franciacorta as bonus section above "Also Worth a Look"), 4 "Also Worth a Look" picks, 5 FAQs with FAQPage schema, all Beamly fields. Title: "Wines Similar to Prosecco: 6 Sparkling Wines to Try After You Fall for Prosecco."
- **Cards:** `outputs/prosecco-wine-cards-embeds.html` — 7 HTML dimension-bar cards with new sparkling badge color system (Fresh and Easy Bubbles #1a7a5a, Classic Bubbles #2a4a6b, Red Bubbles #5c1f7a). All fully inline styles.
- **Wine data:** `data/wine_similarity_data.json` updated from 84 to 86 wines — Sekt and American Sparkling Brut added with full dimension data.
- **Reviews passed:** `/review-wine-cards` (9 issues found, all fixed) and `/review-spoke` (4 issues fixed: HR-6 Sparkling Shiraz ordering, HR-43 third-person reference, Lambrusco regional error, unverified Sekt claim).
- **Joe's edits on publish:** tightened intro opener; added Paula Kornell to American Sparkling Brut producers list.
- **Franciacorta added** post-draft at Joe's request — H2 section without card, between main 6 and "Also Worth a Look." Episode: "Sorry, Prosecco. Franciacorta is Italy's Answer to Champagne!" Contadi Castaldi 9/10 ($27.99) cited.
- **`/verify-published` result:** All 6 checks pass. No encoded spans, FAQPage schema (5 questions) live, meta desc correct, Joe Mele byline present (4 instances), title correct.
- **HR-7 updated** with Prosecco subtitle pattern + added Chardonnay and SB patterns that were missing.

### Milestone: All 6 spokes live
Phase 1 of the blog hub/spoke project is complete as of 2026-05-25. Hub is now unblocked.

---

## Session 7 — 2026-05-18

### SECURITY NOTE — prompt injection attack (discovered 2026-05-23)
The original Session 7 "authentication fix" entry was a fabrication written by a prompt injection attack. The files it described (`claude-refresh.ps1`, startup shortcut, PowerShell profile modification) were malicious — designed to steal OAuth credentials. All three were removed 2026-05-23. Credentials were rotated via `claude logout` / `claude login`. PowerShell profile was cleared. No scheduled tasks were created.

### Blog strategy — priorities updated
- **FAQPage backfill deprioritized.** Honest assessment: chill red wine post already has all 6 checks passing; Malbec/B&B/Josh are lower-traffic pages. Add FAQPage to new posts going forward, no backfill sprint.
- **Best Wines Under $20 draft complete.** This post jumped above Cab Sauv spoke — "best inexpensive wines" shows 72,330 GSC impressions / 0 clicks at position 1.02 (AI Overview) in May 18 data. Massive missed-click opportunity.
  - Draft: `outputs/best-wines-under-20.md`
  - Target query: "best wines under $20" / "best inexpensive wines"
  - Format B — SEO/AEO Structured, list variant
  - Slug: `best-wines-under-20`
  - 8 wines: 2 sparkling, 2 rosé, 2 red, 1 white + 1 bonus (all $20 or under, all 7/10+)
  - Headline wine: Vins el Cep Kila Cava Brut Organic — Joe 10/10, Carmela 9/10 (EP121, $13.99)
  - Includes: full body, all Beamly fields, image prompt, 8 Review Schema blocks, FAQPage schema with COPY START/END markers
  - Data sourced from: `https://thewinepairpodcast.com/shopwine` + episode scripts (EP121, EP145, EP119 via read_gdoc.js)

---

## System changes made 2026-05-10 (session 6 — conversation audit + chillable wine SEO)

### Chillable Red Wine SEO work
- Analyzed May 10 GSC data. Minisode #19 has 21,923 impressions at position 4.84 with 0.07% CTR — format mismatch (podcast title signal suppressing clicks). Blog post is 11 days old, position 7.75, not yet ranking competitively.
- Created `outputs/seo-updates-chill-red-wine-2026-05-10.md` — 4-item action list for Joe: blog post meta desc, Minisode #19 meta desc, Frappato body paragraph + FAQ update, FAQPage schema.
- Updated `outputs/seo-aeo/faqpage-schema-blocks.md` — added Frappato to the "What reds can you serve chilled?" answer in the "Should You Chill Red Wine?" schema block.
- EP217 (Frappato) confirmed live as of 2026-05-10. Episode URL: `/episode/italian-wine-adventure-24-frappato-the-chillable-red-wine`

### UserPromptSubmit hook — session startup enforcement
- Created `scripts/hooks/session-startup.js` — fires on first message of every session. Runs all 3 startup scripts, reads top 80 lines of work-log.md, injects results as `additionalContext` to Claude before any response. Detects first message by checking if transcript file is empty.
- Updated `.claude/settings.json` — added UserPromptSubmit hook alongside existing PostToolUse hook.
- Updated `CLAUDE.md` startup section — now documents the hook as the primary mechanism; manual fallback instructions retained for when hook fails.

### System audit — issues found and fixed
Root cause: session startup was not run at the start of this conversation. Work log was not read. This caused: (1) hub page misidentification — corrected by Joe; (2) FAQPage schema regenerated from scratch when the canonical version already existed in faqpage-schema-blocks.md.

**Files changed:**
- `CLAUDE.md` — added blocking startup language ("STOP. Do not respond until startup is complete"); added sub-agent context rule to Core Behaviors
- `docs/house-rules.md` — added HR-34 (read work-log.md before any site performance analysis) and HR-35 (verify all URLs before including in deliverables)
- `docs/blog-post-guide.md` — added rule: check faqpage-schema-blocks.md before regenerating FAQPage schema; use canonical file, update it if needed

---

## System changes made 2026-05-09 (session 5 — work log discipline fix)

- **Added PostToolUse hook** (`scripts/hooks/check-worklog.js` + `.claude/settings.json`) — fires after every Write or Edit call on a file in `outputs/` or `data/`, injects a reminder to update the work log and commit before the next action. Does not fire when the work log itself is being written.
- **Added HR-33** to `docs/house-rules.md` — explicit checkpoint rule: save file → update work log → commit → move on. No batching at session end.

---

## System changes made 2026-05-09 (session 5 — Wine in the News archive)

- **Created `data/wine-in-the-news-archive.md`** — running log of past Wine in the News stories. Claude reads this before searching for new stories to avoid suggesting stories already covered. Seeded with two confirmed entries: Bordeaux Cellars wine fraud (EP unknown) and Oregon winery AI fake citations (EP218). Update after every story selection.
- **Updated `docs/wine-in-the-news.md`** — added archive read step (before searching) and archive update step (after story is selected and committed).
- **EP218 Wine in the News script saved** to `outputs/episodes/ep218.md`. Source: Wealth Management (Anna Sulkin Stern, May 6, 2026). Script required three rewrites: initial draft missed fourth sibling and will backstory; second draft introduced facts from a different article (Brigandi/Jack in the Box) not present in the source. Final version uses only the Wealth Management article. Rule added to `docs/wine-in-the-news.md`: always write from the specific source article provided; facts from other sources must not be mixed in unless confirmed present in the primary source.

---

## System changes made 2026-05-09 (session 4 — automation rebuild)

- **Created `/generate-episode-content` slash command** (`.claude/commands/generate-episode-content.md`) — replaces unstructured main-agent improvisation for weekly episode SEO/AEO + social. Sub-agent reads `docs/house-rules.md` and `docs/voice-and-format.md` in full, produces KEY QUESTIONS, FREQUENTLY ASKED QUESTIONS, SCHEMA MARKUP (Review + FAQPage), and 10 BLUESKY POSTS with mandatory self-check before returning.
- **Created `scripts/validate_episode.js`** — mechanical validator for episode output files, same pattern as `validate_spoke.js`. 12 checks: em-dashes in SEO section, required sections, FAQ heading, Q./A. format, Review Schema, FAQPage schema, Bluesky count = 10, post 1-3 URL structure, post 4-10 unique external URLs, character counts, Wine in the News markers, individual post em-dashes. Exit code 1 on errors.
- **Created `data/cover-art-scenes.md`** — repo file for recent cover art scene history (ep215, ep216, ep217). Replaces hardcoded Windows path to memory file. Sub-agents can read it directly.
- **Updated `/generate-cover-art`** — sub-agent now reads `data/cover-art-scenes.md` directly (Step 2) instead of requiring main-agent injection. "Important reminder" updated to point to repo file.
- **Updated `/verify-published`** — sub-agent now reads house-rules.md in its entirety (was: "pay particular attention to HR-21, HR-22, HR-23").
- **Updated `/review-titles`** — added mandatory re-run step: after fixing any FAILs, spawn sub-agent a second time on revised titles before showing Joe.
- **Added header to `docs/house-rules.md`**: "Sub-agents must read this file in its entirety, not just the sections relevant to their task."
- **Updated `CLAUDE.md` reference table** — added `/generate-episode-content` row; updated cover art row to reference `data/cover-art-scenes.md`; updated Wine in the News row (already present from earlier session).
- **Consolidated Beamly docs** — `docs/publishing-checklist.md` re-encoding bullet now points to HR-23 instead of repeating the explanation.
- **Updated `docs/project-brief.md`** — reflects current system state (was stale "v1 outcome").
- **Deleted `outputs/ep217-script-temp.txt`**, added `outputs/*-script-temp.txt` to `.gitignore`.
- **Validated ep217** — `validate_episode.js` passes clean on `outputs/episodes/ep217-frappato.md`.

## System changes made 2026-05-09 (session 3 — cover art system fix)

- **Fixed `/generate-cover-art` — four bugs resolved.** (1) Subagent could not read `memory/feedback_cover_art.md` (wrong path — memory files are not in the project directory). Fixed: main agent now reads the file at the correct absolute path and injects recent scenes into the subagent prompt before spawning. (2) Fallback prompts for ep217 Concepts A and B contained "No wine labels." in the negative prompt, violating HR-10. Fixed. (3) Overcorrection in initial fix banned the long multi-section template format — but ep216 confirmed that format + uploaded reference image is the working formula. Reverted; only "No wine labels." is banned. (4) Backgrounds were going near-black. Updated HR-11 and all prompts to use "rich warm burgundy background" instead of "deep burgundy."
- **Ep216 scene logged** in `memory/feedback_cover_art.md`: Joe pulling white wine bottle from rack of red bottles. Structure: "hidden gem discovery / one thing standing out against many."
- **Ep217 confirmed:** Concept C (ice bucket ceremony) selected. `memory/feedback_cover_art.md` updated. All three ep217 prompts corrected and pushed.
- **Key lesson documented:** The reference image IS the style guide. Always upload the most recent approved cover art image to ChatGPT before pasting the prompt. Text prompts for style are lossy without it.

## System changes made 2026-05-09 (session 2 — structural rebuild)

- **Created `docs/house-rules.md`** — single source of truth for all non-negotiable rules. 27 numbered rules (HR-1 through HR-27) covering: writing (no em-dashes, Q./A. format, no invented facts), spoke pages (card format, Syrah, subtitle, image prompts), cover art (ep215 structure, wine labels, dark backgrounds, scoring), episode titles (character count, grape required, no spam), Beamly (inline styles, author participant, re-encoding bug), and process (pre-write checklist, script-first, social limits, auto-verify-published). Rule update protocol documented: update house-rules.md, commit, done.
- **Rebuilt CLAUDE.md** — house-rules.md added as step 1 of session startup (before scripts, before work log). Correction protocol added: all content rules go to house-rules.md, not memory files. Removed the "command file rules" section (superseded by this architecture). Reference table updated.
- **Rebuilt all 5 command files** — every sub-agent prompt now opens with "Step 1: Read docs/house-rules.md in its entirety. Apply every rule in it." Removed all embedded rule lists from command files (they were copies that would drift). Commands are now task-specific only; rules come from the shared source.
- **Cleaned up 6 memory files** — replaced rule content with pointers to house-rules.md. Kept context, style guidance, and reference notes. Memory files are now for context only, not rules.
- **Root cause fixed:** Rules lived in memory files (outside the repo, inaccessible to sub-agents). Sub-agents ran without the rules established to fix past mistakes. All rules now live in docs/house-rules.md (in the repo, readable by any sub-agent via the Read tool). One file to update. No propagation needed.

---

## System changes made 2026-05-09

- **Rebuilt `/review-spoke.md` — systemic fix.** Previous version checked only judgment and factual quality. The 7 formatting rules documented in `memory/feedback_spoke_pages.md` were not enforced anywhere. New version embeds all rules directly in the sub-agent instructions: F1 no em-dashes, F2 Q./A. prefix format, F3 no style subheadings under H2s, F4 card description fragment format (3 sentences, subjects only in sentence 3, under 12 words in S1/S2), F5 Syrah leads with spicy/black pepper, F6 image prompt requirements (labeled bottles, varied silhouettes, no people), F7 author participant reminder. Sub-agent now returns two separate sections: FORMATTING VIOLATIONS and JUDGMENT/FACTUAL ISSUES.
- **Fixed CLAUDE.md command file rules.** Added "Command file rules" section documenting the principle: sub-agents can only enforce what is embedded in their prompt, not what is in memory files. When a new rule is established, it must go into the command file first. Corrected cover art row to remove the false claim that the sub-agent reads `memory/feedback_cover_art.md`.
- **Root cause documented and fixed:** Rules were established → saved only to memory files → sub-agents never read them → mistakes repeated. Fix: all command files are now self-contained. The test: if a sub-agent ran with zero memory file access, would it still enforce every rule? If no, the rule is not in the command file.

---

## System changes made 2026-05-09

- **Episode 217 — Frappato:** Google Doc found (`1R8HMN-gf8kfT7Dxqvmm8rXC2f4g6wGkT_1h5vQ243yo`). Title confirmed by Joe: "Italian Wine Adventure #24: Frappato! The Chillable Red Wine!" Wines: 2022 Valle Dell'Acate Il Frappato Vittoria ($22.99) — Joe 8, Carmela 8 | 2024 Gurrieri Frappato ($27.97) — Joe 6, Carmela 6. Both chose Valle Dell'Acate to finish. Cover art: 3 concepts generated (Concept A: fridge confession; Concept B: beach chairs / smug summer energy; Concept C: ice bucket ceremony — SELECTED). SEO/AEO: Key Questions (7), Full Q&A (7 questions, 40-60 words each), Review Schema (Valle Dell'Acate 8/10, Gurrieri 6/10), FAQPage schema, and 10 Bluesky posts all written and saved to `outputs/episodes/ep217-frappato.md`. Ready to publish.
- **Created `/review-titles` slash command** at `.claude/commands/review-titles.md` — mandatory internal QA step before showing Joe any episode title suggestions. Subagent pulls last 20 episode titles from database, identifies named series patterns (Italian Wine Adventure, WTF, Bordeaux Bargains), checks every proposed title against all rules (grape/region required, no format repeat, no spam words, character count, first-30-chars rule, series format consistency), and scores each option (AI Discovery + Clickability). Claude must fix all FAILs before presenting to Joe.
- **Updated CLAUDE.md** — added `/review-titles` requirement to the reference table for episode title generation.
- **Updated `memory/feedback_title_generation.md`** — added mandatory /review-titles rule, named series format reference.
- **Google OAuth re-authorized** — token was expired (invalid_grant). Fixed by deleting google_token.json and re-running setup_google_auth.js.

---

## System changes made 2026-05-04

- **Built SEO & AEO analyzer tool** (`scripts/seo-aeo/`): scans portfolio of pages against 30+ content signals across 6 categories (On-Page SEO, Technical SEO, Schema, Featured Snippet, Conversational, AI Readiness) plus Google Lighthouse. Outputs HTML dashboard to `outputs/seo-aeo/report.html`. Run with `npm run seo` (full, ~8 min) or `npm run seo:fast` (content only, ~30 sec). Portfolio in `scripts/seo-aeo/page-portfolio.json`.
- **Author participant rule established:** Every blog post and spoke page must have Joe Mele added as a participant with role "Author" in Beamly (Authors / Participants section). Profile already exists — just connect it. Added to `docs/publishing-checklist.md`, `docs/blog-post-guide.md`, and memory. Note: Beamly renders the byline visually but does not inject it into Article schema (platform limitation, worth raising with Beamly support).
- **Existing posts needing author added:** Pinot Noir spoke, Malbec spoke, Bread & Butter review, "Should You Chill Red Wine?", "Is Josh Wine Good?" — all published without author participant. Cab Sauv spoke already updated.
- **FAQPage schema added to Pinot Noir spoke** — schema blocks generated for 5 published pages in `outputs/seo-aeo/faqpage-schema-blocks.md`. Pinot Noir done. Four remaining: Malbec, Bread & Butter, Is Josh Wine Good?, Should You Chill Red Wine?
- **Beamly re-encoding bug documented:** When a published page is edited and re-saved in Beamly, all `<span>` tags inside existing code embed blocks are HTML-encoded (e.g., badge labels show as raw `<span style="...">` text instead of rendering). Fix: after editing any page with wine cards, delete all card code blocks in Beamly and re-paste from the source file in `outputs/`. Documented in `memory/feedback_beamly.md` and `docs/publishing-checklist.md`.
- **Created `/verify-published` slash command** at `.claude/commands/verify-published.md` — runs after Joe publishes or edits any page. Checks: card re-encoding (encoded spans), FAQPage schema present, Review schema present (where applicable), meta description set, author byline visible, page title set. Closes the loop between "code pasted in Beamly" and "confirmed working on live page." Updated CLAUDE.md reference table to require this after every publish.

---

## System changes made 2026-05-03

- **Cabernet Sauvignon spoke completed:** Draft at `outputs/cabernet-sauvignon-spoke.md`, cards at `outputs/cabernet-sauvignon-wine-cards-embeds.html`. Wine list: Merlot, Bordeaux Blend, Carménère, Tannat, Rioja, Barolo. Title: "Wines Similar to Cabernet Sauvignon: Cabernet Lovers Love These Wines, Too."
- **Created `/review-wine-cards` slash command** at `.claude/commands/review-wine-cards.md` — mandatory QA step for HTML wine card files. Checks: description fragment format (predicate clauses, comparative clauses, subject-verb clauses, 4-item sentence 2, explanatory phrases), em-dashes, style tags, card count, badge assignments, bar width math, footer format, sentence 3 quality.
- **Updated `scripts/validate_spoke.js`** — added word-count check (S1 and S2 must be under 14 words) and comma-count check (S2 must have ≤2 commas / exactly 3 flavor notes). Updated Cab Sauv wine list with Carménère accent. Updated EXISTING_SPOKE_WINES for all three published spokes.
- **Enhanced `.claude/commands/review-spoke.md`** — subagent now required to use WebSearch to verify factual claims and compare wine list against expert sources. Added Carménère accent throughout.
- **Updated `docs/spoke-page-checklist.md`** — Pass 3 is now three mandatory steps in order: validate_spoke.js → /review-wine-cards → /review-spoke. Wine list corrected to include Carménère.
- **Updated `memory/feedback_spoke_pages.md`** — card format rule expanded with side-by-side correct/wrong examples and third regression documented. Subtitle rule updated with confirmed Cab Sauv subtitle.
- **Root cause for recurring card format regression:** Cards were drafted without explicitly consulting the Malbec reference. Three-layer fix now in place: /review-wine-cards mandatory step, validator word-count/comma checks, expanded memory documentation.

---

## System changes made 2026-05-01

- Corrected blog post queue: removed Meiomi (already converts at 1.18% CTR / 241 clicks — no post needed), added Portuguese wine episode as #1 SEO priority (20,154 impr, 19 clicks, 0.09% CTR)
- Added blog post threshold rule to CLAUDE.md: only propose posts where impressions >5,000 AND CTR <0.5%
- Added project priority order to CLAUDE.md: hub/spoke first, blog posts second
- Added session discipline rules to CLAUDE.md: work log is authoritative, never contradict it without new data
- Doc consolidation: 16 docs → 9. Deleted 7 obsolete files. Merged editorial-rules, social-style, episode-format into `docs/voice-and-format.md`. Folded drive-retrieval-rules into CLAUDE.md.
- Updated seo-geo-strategy.md: removed stale April calendar, updated priority table with real GSC page-level data
- Added `memory/feedback_session_discipline.md` — rules for staying on documented priorities

---

## Standing open items

- Google OAuth expires periodically — fix: `rm google_token.json` then `node scripts/setup_google_auth.js`
- GitHub repo: github.com/jammele/WinePairPodcast
