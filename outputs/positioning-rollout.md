# Positioning Rollout — Ready-to-Paste Copy

**Source:** `docs/soul-document.md` → "Positioning Statement (canonical)" (added 2026-06-14, see HR-48)
**Context:** Reviewed ChatGPT's positioning/podcast-directory/SEO action plan against the live Buzzsprout RSS description, house rules, and current site state. See `docs/work-log.md` session 24 for the full review and what was cut/changed from ChatGPT's plan.

**Status: APPROVED by Joe 2026-06-14. Ready to paste into Buzzsprout.**

---

## 1. Buzzsprout — Podcast Description (RSS source)

Replaces the current description (opens with the Decanter quote, says "three wines... under $25 each... easy to find," no buying verdict, no "new to us," no independence framing, contact info eating space at the bottom). This is the highest-leverage edit — it syndicates to Apple Podcasts, Spotify, Amazon Music, iHeartRadio, and most directories via RSS.

Not every wine is worth buying. The Wine Pair Podcast features a married couple as they try wines they haven't had before, share their brutally honest opinions, and tell you which bottles are actually worth your money. Each week, Joe and Carmela take on a different grape, wine style, or region, then taste two or three reasonably priced bottles, usually under $25, and describe what they are tasting in ways that are hilarious and actually make sense. Some are great, some are fine, and some absolutely are not worth buying. From Chardonnay and Pinot Noir to grapes you may never have heard of, the show combines useful wine education in plain language, food pairings, affordable recommendations, and the natural chemistry of two people who know each other well enough to disagree. A lot. Joe and Carmela purchase the wines featured in their regular review episodes and do not accept free samples for review, so the opinions and ratings are entirely their own. Recommended by Decanter Magazine, which called the show "fun, irreverent, chatty, and entertaining." New episodes every Sunday. Contact: joe@thewinepairpodcast.com. Instagram: @thewinepairpodcast. Website: thewinepairpodcast.com.

**HR-1 check:** no em-dashes. **HR-38 check:** no "blind tasting" language anywhere.

---

## 2. Buzzsprout — Keywords (max 12, currently 6/12 used)

Current: `wine, wine reviews, funny podcast, wine ratings, humor, everyday wines`

Add these 6 to fill all 12 slots: `affordable wine, wine podcast, wine education, wine tasting, independent wine podcast, husband and wife podcast`

Full proposed list (12, comma-separated for the Buzzsprout field):
```
wine, wine reviews, funny podcast, wine ratings, humor, everyday wines, affordable wine, wine podcast, wine education, wine tasting, independent wine podcast, husband and wife podcast
```

---

## 3. YouTube — Channel About

> Joe and Carmela explore wines that are new to them, explain what makes each one interesting, and tell you honestly whether it's worth buying. The Wine Pair Podcast is an independent, husband-and-wife wine podcast: they buy every bottle themselves, don't take free samples for review, and taste two or three bottles (usually under $25) every week.
>
> New episodes every Sunday. Recommended by Decanter Magazine as "fun, irreverent, chatty, and entertaining," and named a Top 100 Food Podcast on Apple Podcasts.
>
> Listen and subscribe: https://thewinepairpodcast.com/
> Contact: joe@thewinepairpodcast.com
> Instagram: @thewinepairpodcast

---

## 4. Homepage — Hero (new copy, homepage only)

**H1:** Discover wines worth drinking. Skip the ones that aren't.

**Supporting text:** Joe and Carmela explore wines that are new to them, explain what makes them interesting, and tell you honestly whether the bottles are worth buying. They buy every bottle themselves, usually for less than $25, and don't take free samples for review.

**Primary button:** Listen to the latest episode
**Secondary button:** Browse wine reviews → links to `/shopwine`

**Homepage meta description** (~150 chars):
> Joe and Carmela explore wines that are new to them and tell you honestly whether the bottles are worth buying. Independent, affordable wine reviews.

**Note on the site-wide title tag suffix:** Several pages currently end their `<title>` tag with "- Find Great Wines Without Breaking the Bank" (e.g. "Shop Wine | The Wine Pair Podcast - Find Great Wines Without Breaking the Bank," confirmed via `outputs/seo-aeo/history/`). If that suffix is a single global Beamly setting, changing it is a separate, bigger decision than this rollout — check whether it's global before touching it. The hero and meta description above only change the homepage body content, not this site-wide suffix.

---

## 5. Media Kit — Opening Paragraph

> The Wine Pair Podcast is an independent wine education and review show hosted by married couple Joe and Carmela. Each week, they explore a grape, region, style, or wine question, taste two or three bottles that are new to them (usually under $25), and tell listeners honestly whether those wines are worth buying. They buy every bottle themselves and don't accept free samples for review.

Pairs with the existing media kit material on Top 100 Food Podcast, Decanter, Ear Worthy, and 50 Over 50 recognition — no changes needed there.

---

## 6. Social Bios (Instagram / Bluesky)

Current: "Honest reviews for wines regular people drink. Edumacation. Witty banter. Decanter recommended. PNW."

> We taste wines that are new to us and tell you honestly if they're worth buying. Edumacation, witty banter, no free samples ever. Decanter recommended. PNW.

---

## A note on "Joe and Carmela Mele"

HR-42 requires "Joe and Carmela Mele" on pillar/About-type website pages for entity consistency. None of the copy above uses the surname — current podcast directory listings, YouTube, and social bios all use "Joe and Carmela" without a surname, and that's a more casual register appropriate to those surfaces. The full-name entity block stays reserved for the website methodology/About pages where HR-42 already applies.

---

## What's NOT in this rollout (and why)

- **Topic hubs / wine-review database (ChatGPT's Steps 11-12):** already live. The similar-wines hub (`/blog/similar-wines`, all 6 spokes) and Shop Wine (`/shopwine`, every wine ever reviewed, organized by rating with buy links) already cover this. No new pages needed.
- **"How We Choose, Taste, and Rate Wine" methodology page (ChatGPT's Step 9):** queued into `docs/seo-geo-strategy.md` Area 4 trust cluster, after the current SEO sprint (Portuguese wine post is still priority #1). Not part of this rollout.
- **Directory audit** (Apple, Spotify, Amazon, iHeart, Podchaser, Goodpods, Rephonic, Feedspot, Google): do this *after* the Buzzsprout description above is live and the feed has had a few days to propagate. See `docs/work-log.md` immediate next actions.
