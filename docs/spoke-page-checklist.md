# Spoke Page Pre-Flight Checklist

Run this checklist in two passes: once before writing, once before saving. Do not hand work to Joe until both passes are complete.

---

## Pass 1: Before writing anything

**Wine list planning**

- [ ] Pull the full wine list from every existing spoke page. Current spokes and their wines:
  - Pinot Noir: Frappato, Beaujolais, Cinsault, Mencia, Etna Rosso, Red Burgundy
  - Malbec: Syrah/Shiraz, Zinfandel, Grenache, Nero d'Avola, Pinotage, Primitivo
  - Cabernet Sauvignon: Merlot, Bordeaux Blend, Carmenere, Tannat, Rioja, Barolo
- [ ] Build the proposed wine list for the new spoke
- [ ] Confirm: zero wines overlap with any existing spoke list
- [ ] Confirm: none of the 6 alternatives is a wine that already has its own spoke page (e.g., do not list Malbec as an alternative in any other spoke)
- [ ] Confirm: all 6 wines are specifically relevant to the anchor wine's character, not just a generic "bold reds" or "crisp whites" grab-bag

**Title**

- [ ] Check published and drafted subtitles (kept current in `memory/feedback_spoke_pages.md`)
- [ ] New subtitle must be distinct in format and angle from all existing subtitles
- [ ] Propose 2-3 subtitle options for Joe to choose from before writing the full draft

**Episode links**

- [ ] Search `site:thewinepairpodcast.com` for each wine on the list before writing
- [ ] Record the exact URLs -- never construct or guess a URL
- [ ] If no episode exists for a wine, note it and omit the episode link section for that wine

---

## Pass 2: Before saving the draft

**Formatting**

- [ ] Search the full document for em-dashes (—). Remove every one. There are no exceptions.
- [ ] Search for double-hyphens (--) used as dashes. Remove every one.
- [ ] FAQ section: every question uses **Q.** (bold) and every answer uses A. (plain). Exact format:
  ```
  **Q. Question here?**
  A. Answer here.
  ```
- [ ] No style family subheadings in body text. The style badge (Bold and Fruit-Forward, etc.) belongs on the HTML card only, not as a heading or subheading in the post body.

**Wine section structure**

- [ ] Every wine section follows this exact structure, no variations:
  1. H2 wine name
  2. [INSERT CARD: Wine Name]
  3. **What you'll recognize from [anchor wine]:**
  4. **What's different:**
  5. **Try this if:**
  6. Episode link(s) if they exist
- [ ] Anchor wine section: 2-3 paragraphs of description + episode links, no subsections

**Syrah rule (if Syrah appears)**

- [ ] "What's different" section leads with spicy/black pepper, not savory or meaty
- [ ] Card description leads with spicy as the defining characteristic

**HTML cards**

- [ ] No `<style>` tags anywhere -- all styles fully inline
- [ ] 7 cards total: anchor wine + 6 alternatives
- [ ] Each card description: exactly 3 sentences. Format: [texture/character]. [flavor notes]. [personality one-liner.]
- [ ] No em-dashes in any card description
- [ ] Bar widths are value/10 as a percentage (e.g., 8 tannin = 80%)
- [ ] Badge colors follow the established scheme:
  - Bold and Fruit-Forward: `#5c1f7a`
  - Classic and Food-Friendly: `#2a4a6b`
  - Rich and Spicy: `#7a3200`
- [ ] Footer of each card: grape name in italic (left), price range in bold red (right)

**Image prompt**

- [ ] Image prompt is included at the bottom of the draft
- [ ] Background color is different from the previous spoke (check before writing)
  - Pinot Noir spoke: (check published image)
  - Malbec spoke: terracotta
  - Cabernet Sauvignon spoke: slate-grey
- [ ] Bottle labels show wine names in clean sans-serif text
- [ ] Bottle silhouettes vary by wine type (Bordeaux-style, Burgundy-style, tall-narrow, etc.)
- [ ] Anchor wine bottle is center, slightly larger and forward
- [ ] No wine glasses, no people, no table setting

**Beamly fields**

- [ ] Excerpt / Short description (1 sentence)
- [ ] Custom SEO Title (matches H1)
- [ ] Custom SEO Description (under 160 characters)
- [ ] URL slug
- [ ] Author participant: add Joe Mele with role "Author" in the Authors / Participants section
- [ ] FAQPage schema block: Claude Code generates this at the end of the draft. Add as a code embed block at the very bottom of the page in Beamly (after all other content). Copy everything between COPY START and COPY END lines.

**Final cross-checks**

- [ ] Title subtitle is distinct from all previously published subtitles
- [ ] Wine list is confirmed against all existing spokes one more time before saving
- [ ] No wine that has its own spoke page appears as an alternative in this page

---

## Pass 3: Automated validation (mandatory before handing to Joe)

Run both files through the validator script:

```
node scripts/validate_spoke.js outputs/<slug>-spoke.md outputs/<slug>-wine-cards-embeds.html
```

All errors must be resolved. Warnings must be reviewed. Do not proceed until the script exits with no errors.

Then run the wine card reviewer:

```
/review-wine-cards outputs/<slug>-wine-cards-embeds.html
```

This checks description format, badge assignments, bar math, and footer structure. Fix all issues before proceeding.

Then run the spoke reviewer:

```
/review-spoke outputs/<slug>-spoke.md
```

Fix any issues the subagent flags before presenting work to Joe. Joe should only see output that has passed all three passes.
