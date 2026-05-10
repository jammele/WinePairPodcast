# SEO Updates: Chillable Red Wine Pages
**Date:** 2026-05-10  
**Pages affected:** Blog post + Minisode #19 episode page

---

## Why we're doing this

The Minisode #19 episode page has 21,923 impressions at position 4.84 but only 0.07% CTR — people see it and skip it because the title signals "podcast episode" not "article that answers my question." The blog post exists and would convert better, but it's only 11 days old and being outranked by the episode page. These three updates give the blog post the best chance to close that gap and start capturing those clicks.

---

## UPDATE 1: Meta description — Blog post

**Page:** `thewinepairpodcast.com/blog/should-you-chill-red-wine-most-people-get-this-wrong`

**Where to make this change:** In your CMS/Yoast SEO field for this post — the "Meta Description" or "SEO Description" field, NOT the post body.

**Paste this exactly:**

> Most people serve red wine too warm. A quick 20 minutes in the fridge makes almost every red taste better. Here's which reds to chill, which to skip, and for how long.

---

## UPDATE 2: Meta description — Minisode #19 episode page

**Page:** `thewinepairpodcast.com/episode/minisode-19-can-you-chill-a-red-wine-the-2020-rule-chillable-red-wines`

**Where to make this change:** Same — SEO/meta description field for that episode page.

**Paste this exactly:**

> It's not a wine sin to chill a red. Most reds actually taste better slightly chilled. The 20/20 rule: 20 minutes in the fridge before you open the bottle. Here's how it works.

---

## UPDATE 3: Add Frappato to the blog post body

**Page:** `thewinepairpodcast.com/blog/should-you-chill-red-wine-most-people-get-this-wrong`

**Where to make this change:** Find the section called "Which Red Wines Should You Chill?" in the post body. Add the paragraph below at the end of that section, before the next heading.

**Paste this paragraph:**

> One more to add to the list: Frappato. It's a light, floral Sicilian red with low tannins and bright cherry fruit — a textbook chillable red. We just covered it on the podcast if you want to go deeper: [Italian Wine Adventure #24: Frappato! The Chillable Red Wine!](https://thewinepairpodcast.com/episode/italian-wine-adventure-24-frappato-the-chillable-red-wine)

**Also update the FAQ answer** for "What reds can you serve chilled?" — find that Q&A in the FAQ section of the post and replace the current answer with this:

> Gamay and Beaujolais are the most common chillable reds. Grignolino, Frappato, Valpolicella, Blaufränkisch, Zweigelt, Grenache, and lighter Pinot Noirs all do well slightly chilled. Full-bodied, tannic reds like Cabernet Sauvignon and Barolo should be served closer to room temperature.

*(Only change: added "Frappato" after "Grignolino" in the list.)*

---

## UPDATE 4: Add FAQPage schema to the blog post

**Page:** `thewinepairpodcast.com/blog/should-you-chill-red-wine-most-people-get-this-wrong`

**Where to make this change:** At the very bottom of the post body, in a code block — same place you put Review Schema and Buzzsprout embeds. Do NOT add it to the page head.

**Canonical source:** This schema lives in `outputs/seo-aeo/faqpage-schema-blocks.md` under "Should You Chill Red Wine?" — that file is the single source of truth. The block below matches it (with Frappato added to the chillable reds list).

**Paste this entire block:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Should you chill red wine?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Most red wines taste better slightly chilled at 55-65°F rather than at room temperature, which is typically too warm. Lighter reds like Gamay and Grignolino benefit most. Full-bodied reds like Cabernet Sauvignon should get minimal chilling."
      }
    },
    {
      "@type": "Question",
      "name": "How long should you chill red wine before serving?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The 20/20 rule: put a red wine that's been at room temperature in the fridge for 20 minutes before serving. That brings it to roughly the right temperature without over-chilling. Light reds like Beaujolais can go 30 minutes."
      }
    },
    {
      "@type": "Question",
      "name": "What reds can you serve chilled?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Gamay and Beaujolais are the most common chillable reds. Grignolino, Frappato, Valpolicella, Blaufränkisch, Zweigelt, Grenache, and lighter Pinot Noirs all do well slightly chilled. Full-bodied, tannic reds like Cabernet Sauvignon and Barolo should be served closer to room temperature."
      }
    },
    {
      "@type": "Question",
      "name": "What temperature should red wine be served at?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Light reds: 55-60°F. Medium reds: 60-65°F. Full-bodied reds: 65°F. Most American homes run 70-75°F, which is too warm for any red wine."
      }
    },
    {
      "@type": "Question",
      "name": "Does chilling red wine ruin it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Over-chilling a tannic red can make it taste harsh, but a moderate chill improves most reds. The most common mistake is serving red wine too warm, not too cold."
      }
    }
  ]
}
</script>
```

---

## Checklist

- [ ] Blog post meta description updated (Update 1)
- [ ] Minisode #19 meta description updated (Update 2)
- [ ] Frappato paragraph added to "Which Red Wines Should You Chill?" section (Update 3)
- [ ] FAQ answer updated to include Frappato (Update 3)
- [ ] FAQPage schema block added at bottom of blog post (Update 4)

Once you've made all five changes, let me know and I'll run `/verify-published` on the blog post to confirm the schema is rendering.
