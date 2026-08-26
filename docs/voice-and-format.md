# Voice, Tone, and Format Rules — The Wine Pair Podcast

Single reference for how all content should sound and be structured. Applies to blog posts, show notes, social copy, and episode support materials.

For non-negotiable process and format constraints, `docs/house-rules.md` is canonical. If this file conflicts with house rules, follow house rules.

---

## Core voice

All content should feel:
- Accessible, witty, conversational, slightly irreverent
- Anti-snob — explain jargon, never assume knowledge
- Honest and opinionated — strong takes, no hedging
- Written by Joe and Carmela, not by a wine guide

**Avoid:**
- Corny phrasing, fake excitement, smugness
- Generic AI-sounding filler
- Wine-snob language ("earthy undertones," "bright acidity," "silky tannins")
- Em dashes — never, unless Joe explicitly requests
- Overly formal or corporate tone

**Write:**
- Contractions (it's, we're, you'll)
- "We" — this is Joe and Carmela's show together
- Plain English; if a term is necessary, explain it immediately
- Specific details from the actual episode — never generic stand-ins

---

## Blog post voice

- Lead with the verdict. Never bury it.
- FAQ answers: front-load the answer in the first sentence. Never start with "It depends" without immediately giving the answer.
- 2-4 sentences per FAQ answer. Conversational, slightly irreverent. Sounds like Joe talking.
- Episode callout: one specific sentence teasing a moment from the tasting — disagreement, surprise, strong reaction. Not "Listen for more!"

---

## Social copy (Bluesky and Instagram)

**Bluesky:**
- 300 characters max including any inline URL
- Keep text under ~240 characters when a URL will be included
- For URLs over 180 characters, use a link card instead of inline text
- Mix of fact-led, opinion-led, and curiosity-led options
- Sound like a human, not ad copy
- **Do NOT include the Wine in the News segment** in Bluesky posts — the segment is for the episode only.
- **URL structure:** Posts 1-3 (teasers) link to thewinepairpodcast.com or the specific episode URL. Posts 4-10 (fact/value posts) must each link to a unique external URL — no podcast domain, no repeated URLs. Use the episode script's research links to assign one unique source per post.

**Instagram:**
- Readable, natural, not forced
- Supports the episode without sounding promotional
- Offer options with different tones or angles

**Both:**
- No repetitive "wine lover" clichés
- No generic hashtags baked into copy unless asked
- Consistent with podcast voice

---

## Episode research and support materials

**Before the episode (research brief):**
- What the wine is, where it comes from, why it matters
- A few interesting or surprising facts
- Misconception clarifications
- Question prompts for the tasting
- **Comparison angle flag (optional):** If this episode is a challenge or comparison, note whether the topic has search demand for an "X vs. Y" post (see Area 5 in `docs/seo-geo-strategy.md`) and flag it for follow-up content planning

**After the episode (standard outputs):**
- Show notes draft
- SEO/GEO summary
- Bluesky drafts (10 posts)
- Instagram captions
- Chapter marker suggestions
- Cover art concept brief (optional)
- Experience Snapshot (optional — include when the tasting surprise, disagreement, or verdict is the main reader value; required for any comparison/challenge episode blog post)

**Show notes structure:**
- Key Questions at top (questions only — no answers, no Key Insights summary block). Count follows `docs/faq-intent-model.md` and HR-52: normally 5-7, no target within that range, no padding. Below 5 requires stopping and showing Joe the smaller set with a concise explanation; Joe may approve an exception.
- Timestamps for every section
- Wine details: Region / Year / Price / Retailer / Alcohol / Grapes / Rating
- Tasting notes: Color / Nose / Mouth / Food pairings
- Q&A block at bottom headed **"FREQUENTLY ASKED QUESTIONS"** — not "Full Q&A" or any other label. Follow house rules for exact Q./A. formatting. Key Questions and FAQ questions must match exactly in wording and order.
- Research links compiled at bottom

**SEO/AEO rules for show notes:**
- Do NOT add a Key Insights block at the top — it duplicates the transcript and hurts UX
- Full transcript on the page is high-value for SEO/AEO — keep it, but formatted with H2/H3 section headers matching the script's chapter markers, not as a raw wall of text
- Q&A block: candidates are generated and selected per `docs/faq-intent-model.md` (episode-type families are candidate prompts, not reserved slots; neither broad nor narrow questions win automatically — use topic-specific evidence). Do not include questions too specific to earn search traffic unless the reviewed product itself carries independent demand (e.g. a recognized retail brand).
- Each answer: front-loaded with the direct answer, usually 25-50 words, 60-word maximum unless Joe explicitly approves an exception, no minimum, never padded, conversational voice. Every substantive statement must be grounded in the episode; external sources may only corroborate an episode-covered claim, never introduce new explanatory content.
- FAQ-only standalone guidance: FAQ answers must make sense when extracted into Google results, AI answers, or app snippets without prior episode context.
- FAQ-only narrative framing rule: avoid podcast-recap phrasing in FAQ answers. Keep recommendation voice, value judgments, style guidance, and pairing guidance, but present them as consumer-facing guidance instead of show-internal narration.
- Do not add FAQPage schema markup to new content (HR-64). Existing FAQPage blocks on already-published pages are not removed proactively.

**Episode output file:**
All SEO/AEO content for an episode — Key Questions, Frequently Asked Questions, Schema Markup, and Bluesky posts — must be written and saved to the same episode output file (e.g. `outputs/episodes/ep217-frappato.md`) in the same session. Never treat social posts as a separate deliverable.

---

## Trustworthiness rules

- Do not invent facts
- Flag anything that needs verification
- If source material is missing, draft around it and mark placeholders clearly
- Never use placeholders for ratings, tasting notes, or pairings — read the episode script first
