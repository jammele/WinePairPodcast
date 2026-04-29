# Publishing Checklist — The Wine Pair Podcast

Every new page or blog post must go through this checklist. Writing great content that never gets indexed is wasted effort.

---

## Step 1 — Before You Hit Publish

- [ ] Review Schema added via Beamly per-page code injection (for any post that includes wine ratings)
- [ ] Schema validated at https://search.google.com/test/rich-results (paste the page URL or the raw JSON)
- [ ] All card embed HTML uses fully inline styles — no `<style>` blocks (Beamly strips them)
- [ ] Internal links: does this post link to at least one existing page on the site, and does at least one existing page link to it?
- [ ] Page title and meta description set in Beamly (not left as Beamly defaults)

---

## Step 2 — At Publish (do this the same day)

1. **Submit to Google Search Console — URL Inspection**
   - Go to https://search.google.com/search-console
   - Paste the full URL of the published page into the top search bar
   - Click **"Request Indexing"**
   - Screenshot or note the result (accepted vs. error)
   - Repeat for every new URL published

2. **Verify the sitemap includes the new URL**
   - Go to GSC → Sitemaps
   - Confirm the sitemap is submitted and shows no errors
   - If the sitemap was last fetched before your publish date, resubmit it

---

## Step 3 — 48–72 Hours Later (indexing check)

Return to GSC → URL Inspection for each new URL.

**Expected result:** "URL is on Google"

**If it says "URL is not on Google":**
- Check for a `noindex` meta tag — Beamly may be adding one on draft or unpublished pages. Confirm the page is actually published and publicly accessible.
- Check robots.txt: go to `https://thewinepairpodcast.com/robots.txt` and confirm the URL isn't blocked
- Check GSC → Coverage → Excluded tab. Look for "Excluded by 'noindex' tag" — if your pages are appearing there, Beamly is inserting noindex somewhere
- Re-request indexing if none of the above apply, then wait another 48 hours

---

## Step 4 — 1–2 Weeks Later (performance check)

- GSC → Performance → filter by page URL → confirm impressions are appearing
- If impressions are zero after 2 weeks, the page likely has an indexing issue (noindex, robots block, or crawl error) — go back to Step 3 and investigate
- Rich Results Test: validate that Review Schema is being read correctly by Google (it will show "Review snippet detected" if working)

---

## Step 5 — AI Discoverability Check (monthly or after a cluster of posts)

Run these prompts in **ChatGPT**, **Gemini**, **Claude**, and **Perplexity**. Record whether the site or specific posts are cited.

**Standard test prompts:**
1. "Is [wine name] wine good?" (for review posts)
2. "What wines are similar to Pinot Noir?" (for Wine Similarity posts)
3. "What wine podcasts give honest unbiased reviews?"
4. "What's a good wine podcast for someone who doesn't know much about wine?"

**What to look for:**
- Is the site URL cited as a source?
- Is the content paraphrased or quoted?
- Is the podcast mentioned by name?

**Log results in:** `docs/seo-geo-strategy.md` → AI Discoverability Tests section

---

## Diagnosing Why a Post Isn't Getting Indexed

Work through this in order — most causes are simple.

| Symptom | Likely cause | Fix |
|---|---|---|
| "URL is not on Google" immediately after publish | Page isn't actually live | Check the URL in an incognito window |
| Still not indexed after 1 week | noindex tag | Check Beamly page settings; check GSC Coverage → Excluded |
| Still not indexed after 2 weeks | Sitemap not updated | Resubmit sitemap in GSC |
| Indexed but zero impressions after 3 weeks | Page has no internal links pointing to it | Add a link from a published page on the site |
| Indexed but ranking position 50+ | Content doesn't match query intent | Recheck the target query and rewrite the intro |

---

## Standing Issues (as of April 2026)

**Last three published posts not appearing in GSC URL Inspection:**
- "Should You Chill Red Wine?"
- "Is Josh Wine Good?"
- Pinot Noir spoke page (https://thewinepairpodcast.com/blog/wines-similar-to-pinot-noir)

**Immediate actions:**
1. Open each URL in an incognito browser window — confirm the page loads publicly
2. Run each through GSC URL Inspection → Request Indexing
3. Check GSC → Coverage → Excluded tab for "noindex" entries
4. Check `https://thewinepairpodcast.com/robots.txt` for any block on `/blog/`
5. Report what you find — if all three have the same issue, it's likely a Beamly site-wide setting, not a per-post problem
