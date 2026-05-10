# Project Brief

## What this project is

A local-first podcast operating system for The Wine Pair Podcast.

The goal is not to create a flashy autonomous agent. The goal is to create a durable, searchable, reusable workflow system that reduces repeated work and preserves podcast context over time.

## Why this exists

Core pain points this system addresses:
- Episode work (titles, SEO, social posts, show notes) repeats every week with the same rules — automation enforces those rules so Joe never corrects the same mistake twice
- Context (episode scripts, ratings, tasting notes, research links) lived in Google Drive with no fast retrieval — now indexed and accessible via `node scripts/read_gdoc.js`
- AI chat memory drifts between sessions — house-rules.md and slash commands make behavior deterministic across sessions

## What the system does today

**Weekly episode workflow (fully automated):**
- `/generate-episode-content` — reads script, generates Key Questions, FAQ, Review Schema, FAQPage schema, and 10 Bluesky posts; validates with `validate_episode.js` before showing Joe
- `/review-titles` — reviews title options against 5 non-negotiable rules + archive; re-runs after fixes to confirm clean pass
- `/generate-cover-art` — generates 3 scored concepts with ChatGPT-ready prompts; reads recent scene history from `data/cover-art-scenes.md` to prevent repetition
- `/verify-published` — checks live page for card re-encoding, schema, author byline, meta description after every Beamly publish

**Content pipeline (spoke pages and blog posts):**
- `validate_spoke.js` — mechanical checks on spoke page drafts
- `/review-wine-cards` — sub-agent review of HTML card descriptions, badge assignments, bar math
- `/review-spoke` — sub-agent review of formatting, Beamly fields, factual accuracy

**Infrastructure:**
- Google Drive sync via `scripts/find_source_files.js --scan`
- Episode script retrieval via `scripts/read_gdoc.js <docId>`
- Episode title archive at `data/episode-titles.md` (217+ episodes, named series patterns)
- Cover art scene history at `data/cover-art-scenes.md`
- Single rule authority at `docs/house-rules.md` (HR-1 through HR-32)

## The mission

Grow The Wine Pair Podcast's listener base. The site grows by becoming discoverable to people searching for wine and wine podcasts — through Google and AI models (Gemini, ChatGPT, Claude, Copilot, Perplexity).

**The ecosystem has three pillars:**
1. The podcast — the core product
2. The website + blog — discovery engine (blog posts, spoke pages, FAQPage schema, AEO canonical language)
3. The Winedr companion app — engagement tool (React Native, in development; shares wine data via `data/wine_similarity_data.json`)

## Current priorities

1. **Spoke pages (blog posts)** — spoke pages ARE blog posts. Cabernet Sauvignon draft ready; Chardonnay, Sauvignon Blanc, 6th spoke TBD. All must be live before the hub.
2. **Episode copy and social** — weekly, when each episode is recorded
3. **Episode-based blog posts** — lower priority while spoke work is active, but not absolutely blocked
