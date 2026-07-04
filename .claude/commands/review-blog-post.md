# /review-blog-post

Review a blog post draft for formatting violations, AEO/SEO completeness, and factual quality. Run this BEFORE showing any blog post draft to Joe. Fix all FAILs, then re-run until clean.

## Usage

```
/review-blog-post outputs/best-wines-under-20.md
```

## How to run

When the user types `/review-blog-post <filepath>`:

0. **FIRST: Retrieve the opportunity brief for this post.**
   - Check `docs/opportunity-briefs/` for a file named `[slug]-brief.md` matching the post slug.
   - If found: read the brief in full. Run the Strategic Pass below before any other checks.
   - If not found: **HARD FAIL. STOP.** Do not proceed to mechanical lint. Do not report the draft as review-complete. Report: "FAIL: No opportunity brief found at `docs/opportunity-briefs/[slug]-brief.md`. This draft cannot be reviewed. Complete and approve the opportunity brief before creating or reviewing any draft. The brief must include archive inventory, query cluster evidence, Wine Pair angle, excluded scope, and Joe's approval. See `docs/opportunity-briefs/template.md`."

**Strategic Pass (only if brief exists):**

Compare the draft against the approved opportunity brief. This is an editorial check, not a lint check. Flag any of the following:
- The post's H1 or stated target query does not match the approved brief's primary query or page type
- The scope has narrowed or expanded relative to the approved brief's topic breadth (e.g., a brief for a broad category guide became a single wine review)
- The primary reader need is not addressed early and clearly. Substantial delay is a flag for editorial review — this is NOT a paragraph-count cutoff
- Essential-classified archive sources from the brief are absent from the draft
- A single source (one episode) dominates a post where the brief specified broad archive coverage, without justification noted in the brief
- The Wine Pair angle identified in the brief is not visible in the draft
- The unique contribution identified in the brief (specific Joe/Carmela evidence that materially changes the article's value) is not present
- The listener path from the brief is absent from the conclusion or CTA
- The image concept does not match the scope approved in the brief (e.g., two specific episode bottles for a regional category guide)

Report all strategic issues before running mechanical checks. A post that passes all mechanical checks but fails the strategic pass is not ready for Joe.

1. **Run the Node.js em-dash scan before spawning the subagent:**
   ```
   node -e "const fs=require('fs');const c=fs.readFileSync('<filepath>','utf8');const lines=c.split('\n');let count=0;lines.forEach((l,i)=>{if(l.includes('—')){count++;console.log('Line '+(i+1)+': '+l.trim());}});console.log('Total em-dashes: '+count);"
   ```
   If ANY em-dashes are found, fix them ALL before proceeding. Do not spawn the subagent until this returns "Total em-dashes: 0". The Grep tool cannot reliably detect Unicode em-dashes — always use this Node.js scan.

2. Read the draft file at the given path
3. Spawn a subagent with the instructions below, passing it the draft content

---

## Subagent instructions

Spawn an Agent with this prompt, substituting in the actual draft content:

---

You are a quality reviewer for The Wine Pair Podcast's blog posts. Find every problem before it goes to the publisher. Be direct and specific. Do not praise the work.

**Step 1: Read `docs/house-rules.md` in its entirety. Apply every rule in it. No output passes review if it violates any item in that file.**

After reading house-rules.md, run the checks below.

---

## PART 1: FORMATTING VIOLATIONS

Check every house rule that applies to blog posts. The most common failures:

- **HR-1 (no em-dashes):** The Node.js scan above already ran before this subagent was spawned, but verify the draft content passed to you contains zero `—` characters. Check body text, tasting notes, FAQ answers, Beamly fields (title, meta, excerpt), image prompt, and every reviewBody field inside schema blocks. **Do not use Grep for this check — Grep silently fails on Unicode em-dashes. Count occurrences of `—` directly in the text passed to you.** If any remain, list every instance with exact quote and required fix.
- **HR-2 (Q./A. format):** Every FAQ question/answer pair must use bold `**Q. Question?**` / unbolded `A. Answer.` format. A plain bold heading like `**What is the best wine?**` is a violation. Flag any deviation.
- **HR-8 (image prompt):** Confirm image prompt is present and specifies: flat illustration 16:9, wine names on bottle labels in sans-serif text (never unlabeled bottles), varied silhouettes by bottle type, no people, no wine glasses, no table settings, background color that varies from cream if cream was used on the previous post.
- **HR-22 (author participant reminder):** Confirm the Beamly fields section includes a reminder to add Joe Mele as Author participant.
- **HR-36 (canonical AEO language):** These phrases are the show's positioning library — use where editorially relevant, not to hit a count. Check whether any of these phrases appear naturally in the body copy: "really honest ratings and reviews", "we buy all our own wine", "no free samples or sponsorships", "independent wine podcast", "everyday wines, not prestige chasing", "wines that are new to us". Flag only if NONE appear — absence entirely suggests positioning was ignored. Do not flag for failing to hit a specific count.
- **HR-42 (entity signal consistency — pillar and About-type pages only):** If this post is a pillar page, About page, or trust/methodology cluster page (not a regular episode review), confirm that the following entity signals appear naturally in the content: hosts named as Joe and Carmela Mele, described as an independent husband-and-wife podcast, focused on affordable/findable wines, buying their own wines for review episodes, Top 100 Food Podcast credential. If any are missing on a pillar/About-type page, flag it. Skip this check for standard wine review posts.

Return each violation with: rule number, exact quote from the draft, and required fix. If none: "No formatting violations found."

---

## PART 2: FORMAT B SECTION COMPLETENESS

Blog posts must follow Format B section order from `docs/blog-post-guide.md`. Check that all required sections are present:

- [ ] Intro (no header) — leads with verdict, 2-3 paragraphs
- [ ] Key Questions We Answer — 3-5 questions, no answers, signals to search engines
- [ ] Wine sections with H2 per wine (for review posts) OR equivalent structured sections (for roundup posts)
- [ ] Overall verdict section
- [ ] Podcast callout section with Buzzsprout embed placeholder
- [ ] Frequently Asked Questions — 4-5 Q./A. pairs

Flag any missing section.

---

## PART 3: BEAMLY PUBLISH REQUIREMENTS

Confirm the draft includes all of the following, clearly labeled:

- [ ] Custom SEO Title — count characters, flag if over 60 or under 40
- [ ] Custom SEO Description — count characters exactly, must be 150-160. Flag if outside range.
- [ ] URL slug — short, keyword-first, no stop words
- [ ] Excerpt / Short description — 1-2 sentences, conversational
- [ ] Author participant reminder (Joe Mele, role: Author)
- [ ] Review Schema block(s) with COPY START / COPY END markers — one block per wine, never averaged across wines
- [ ] FAQPage Schema: **deprecated May 7, 2026. Do not flag as missing.** If present in an older draft, that is acceptable but not required for new posts.

Flag anything missing or mismatched.

---

## PART 4: FACTUAL AND VOICE QUALITY

- F1. Are all ratings, prices, and tasting notes consistent with the body copy? Cross-check schema reviewBody fields against the wine sections.
- F2. Does any tasting note use generic wine language ("earthy undertones," "bright acidity," "silky tannins," "notes of")? Flag and suggest specific replacements.
- F3. Does the intro lead with a verdict, or does it bury it?
- F4. Does the FAQ section contain questions with real search intent, or generic filler?
- F5. Are episode links present for each featured wine? Flag any wine section without a link to its episode.
- F6. Are all URLs in the draft verified as real links (not constructed from episode titles)? Flag any URL that looks constructed rather than confirmed.

---

## OUTPUT FORMAT

Three sections:

**FORMATTING VIOLATIONS** — each violation: rule number, exact quote, required fix. If none: "No formatting violations found."

**MISSING SECTIONS / BEAMLY FIELDS** — each gap with required fix. If none: "All sections and fields present."

**FACTUAL AND VOICE ISSUES** — each issue numbered. If none: "No factual or voice issues found."

Do not summarize the draft. Do not explain what it does well. Only flag problems.

**Draft to review:**
[DRAFT CONTENT]
