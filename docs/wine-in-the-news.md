# Wine in the News This Week — Instructions

Read this before finding story options or writing the segment script.

---

## The test: "Wait, what?!"

Every story must pass this test: would a listener laugh out loud, say "wait, what?!", or immediately want to tell someone else? If yes, it qualifies. If it would make a listener sigh or feel worried, it does not.

Joe's exact description: "funny, crazy, outrageous — something that people will laugh at or be surprised by."

---

## Story types that work

- **Crime or theft with an absurd twist** — a Memphis woman told police she was picking up items "for the children" and walked out of her incarcerated ex-husband's home with $30K in art, wine, and photos while his boyfriend watched. Joe approved this immediately. This is the template.
- **Pop culture crossovers where wine appears unexpectedly** — a $6 wine at the most exclusive sporting event in America (The Masters).
- **Science with a counterintuitive punchline** — wine drinkers have 21% lower cardiovascular death risk than beer/spirits drinkers. Works because it gives listeners permission to feel smug.
- **Scandals, lawsuits, or fraud with a human character at the center** — ideally someone who made a spectacularly bad decision involving wine.

---

## Story types that do NOT work

- Tariff news, even when wine is the subject
- Winery permitting disputes, fines, or regulatory battles
- Sales decline or industry financial reports
- Harvest reports, appellation changes, any insider wine industry coverage
- Stories about large institutions failing — these read as depressing, not funny

---

## Date window

Must be within the last 14 days. Verify publication dates before presenting. A study presentation date at a conference counts even if the original article published a few days earlier.

---

## Search strategy

Before running any searches, read `data/wine-in-the-news-archive.md`. Do not suggest any story on the same topic, incident, or person as any entry in that archive. A general category (fraud, theft, health study) does not disqualify all stories in that category -- but the same scheme, defendant, event, or study does.

Cast a wide net. The source does not matter — a wine publication can run a funny crime story; a general news site can run a boring industry piece. Filter by story quality, not outlet.

Good search terms:
- "wine [month year] arrested"
- "wine [month year] theft"
- "wine [month year] study"
- "wine [month year] lawsuit"
- "wine [month year] bizarre"
- "wine funny news [month year]"

---

## Research depth

When a story involves named people, search each one separately. The Memphis story looked like a simple theft until searching the ex-husband's name revealed he was also facing a $500,000 bond on a five-year theft scheme — which is what made "this is quite the couple" the actual punchline. Stop at the first article and you miss the whole story.

---

## How to present options

Present 3 story options with headlines, one-line summaries, and source links. Draft the full script for the best one. The best one is whichever has the most absurd human element, not the most wine-forward one.

If Joe provides a specific article, skip the options step and go straight to the full script.

---

## Before writing the script

Before writing a single word of the script, fetch the article in full and extract:
- Every named person (full name and role)
- Every specific number (people, dollars, counts, dates)
- The complete sequence of events, including backstory
- Any detail that makes the story more absurd or human

A WebFetch summary is not sufficient -- summaries drop details. Fetch the full article and read it carefully.

If Joe provides a specific article URL, that is the only source for the script. Do not mix in facts from other articles about the same story -- different outlets have different details and mixing them creates errors. Every fact in the script must be traceable to the provided article.

Do not start writing until this checklist is complete.

---

## Fact-check before presenting

After the script is drafted, spawn a sub-agent before showing Joe anything. The sub-agent receives:
- The full text of every source article (paste the WebFetch output, not a summary)
- The finished script

The sub-agent checks every factual claim in the script against the source material:
- Named people and their roles
- Specific numbers (counts, dollar amounts, dates, addresses, distances)
- Direct quotes (must match the source word for word)
- Sequence of events (order, timing, causation)
- Any claim about what a person said or did

The sub-agent returns a pass/fail report. For each discrepancy: quote the script claim, quote the source text, and state what is wrong.

The main agent fixes all errors before presenting the script to Joe. Do not present a script that has not passed the fact-check.

---

## Segment format

The segment has a loose 5-part shape. Treat it as a description of what naturally happens when the story is told well — not a template to fill in. Complex multi-twist stories use more scaffolding. Simple one-finding stories use less. Joe's word count is roughly 30% lower than AI drafts; everything that exists for effect rather than information gets cut.

**1. News desk transition line (standard opener):**
"And now it is time to head over to our news desk so that we can cover our wine in the news this week segment."

**2. Attribution line:**
"This week our wine in the news comes to us from [Author Name] writing for [Publication] in [City if applicable]. And the article is called '[Exact Article Title].'"

If no author is listed: "This week our wine in the news comes to us from [Publication], and we don't have an author, but the title is '[Exact Article Title].'"

After the title, add a personal hook: "And what I liked about this article is [one genuine reason — tie-in to episode, counterintuitive finding, surprising character]." This is Joe inserting himself honestly, not theatrically.

Always fetch the article (use WebFetch on the article URL) to get the exact author name and headline. Do not approximate.

**3. Overview (1-2 sentences):**
Give the core finding. Start naturally: "Evidently,", "So,", or just begin the sentence. Do NOT use "Right away, this feels like a [good/great/wild] story, and the short version of the story is this:" — Joe does not use this phrase.

**4. Story beats:**
Tell the story in the order that makes it land best. Paragraphs follow each other naturally.

- Do NOT use "Now let me back up, because there are some details here that are too good to skip." as a default device. Only use it if the story has a complex timeline that genuinely requires rewinding (a multi-year scheme, a sequence of legal events). For a single finding or a simple sequence of events, just start the next paragraph.
- Do NOT use "But wait, it gets more interesting." as a default beat. Only use it if the story has a genuine second twist that escalates beyond the first (EP218's AI fake-citations story had two real escalations; use it only in cases like that). For a story with one main finding and one cool coda, skip it.
- When context is needed for listeners who may not know the subject, embed it as a natural clause: "...and it produced white berries, which is really interesting since the region is known today for being overwhelmingly a red wine region." Not as a standalone dramatic sentence. Not as a follow-up paragraph explaining why the fact is significant.
- When Joe has a genuine reaction or reflection, it is short and understated: "Pretty cool that we can trace all of that history... Makes you think." Not performed: "For the love of Pete." Not pre-packaged: "I want to just sit with that for a second."

**5. Closing question to Carmela:**
Direct and curious. One sentence. Ask what Carmela thinks about the most specific interesting fact. Do NOT make it meta (referencing the episode structure). Do NOT construct a clever hypothetical. Joe asks what he actually wants to know.

Good: "Carmela, what do you think about the fact that the oldest traceable wine in Tuscany was a white wine?"
Not good: "Carmela, we just spent this entire episode talking about Sangiovese from outside Tuscany, and now I find out that ancient Tuscany wasn't even making red wine to begin with. I genuinely do not know what to do with that information."

---

## AI writing tells — never write these

These phrases and patterns appear in AI drafts and do not match Joe's voice. If you are about to write any of these, stop and rewrite.

**Scripted framing devices (default use only — see Segment format for when they are permitted):**
- "Right away, this feels like a [good/great/wild] story, and the short version of the story is this:"
- "Here is the overview:"
- "Now let me back up, because there are some details here that are too good to skip."
- "But wait, it gets more interesting."
- "And this is where it gets interesting."
- "I want to just sit with that for a second."

**Theatrical amplification paragraphs:**
Any paragraph whose purpose is to tell the listener why the fact just stated is surprising or significant. State the fact. Do not follow it with an explanation of why it is surprising. Joe trusts the listener to feel the surprise themselves.

**Literary or poetic flourishes:**
- "An unbroken genetic thread from..."
- Any sentence that sounds like it belongs in a magazine feature rather than someone talking

**Punchy isolated-sentence reveals:**
"And it produced white berries." as a standalone sentence designed for dramatic effect. Integrate naturally: "...and it produced white berries, which is really interesting since..."

**Clever meta-observations:**
"And we only know this because ancient people kept throwing their grape seeds into wells." Witty observations that exist to show the writer noticed something. Joe doesn't write these. Cut.

**Performed exclamations:**
"For the love of Pete." Any expression that sounds like a character performance rather than genuine speech. Joe's actual reactions are quieter: "Pretty cool." "Makes you think." "Which is really interesting."

---

## Reference example: Chianti DNA story (Ep223)

Joe's rewrite of an AI draft — the clearest evidence of the gap. Every difference maps to a pattern above.

**Attribution — AI vs Joe:**
- AI: "Now, the article title looks like a dry academic press release, but it is sitting on top of something genuinely wild. The title of this article is..."
- Joe: "...and we don't have an author, but the title is '...' And what I liked about this article is that it has a bit of tie-in to our episode today."

**Overview intro — AI vs Joe:**
- AI: "Here is the overview: researchers just sequenced..."
- Joe: "Evidently, researchers just sequenced..."

**Transition into details — AI vs Joe:**
- AI: "Now let me back up, because there are some details here that are too good to skip."
- Joe: [omitted — next paragraph starts directly]

**Key reveal — AI vs Joe:**
- AI: "One variety, unchanged for centuries. And it produced white berries." [dramatic standalone sentence]
- Joe: "...a single dominant grape variety ruled the entire region, and it produced white berries, which is really interesting since the region is known today for being overwhelmingly a red wine region." [natural clause with embedded context]

**Theatrical amplification — AI vs Joe:**
- AI: "I want to just sit with that for a second, because this is Chianti. This is the same region where Sangiovese is now essentially the law, where the Chianti Classico DOCG exists, where Italian red wine built its entire reputation..."
- Joe: [entire paragraph gone, not replaced]

**Escalation device — AI vs Joe:**
- AI: "But wait, it gets more interesting."
- Joe: [omitted]

**Meta-observation — AI vs Joe:**
- AI: "And we only know this because ancient people kept throwing their grape seeds into wells."
- Joe: [gone]

**Flourish vs genuine reflection — AI vs Joe:**
- AI: "An unbroken genetic thread from ancient Tuscan white wine to a vine that has been alive since the 1600s. For the love of Pete."
- Joe: "Pretty cool that we can trace all of that history and see how, like people, plants, animals, and all living creatures are basically immigrants. At some point, everything on the earth was living somewhere else. Makes you think."

**Carmela question — AI vs Joe:**
- AI: "Carmela, we just spent this entire episode talking about how great Sangiovese is when it comes from somewhere other than Tuscany. And now I am reading that ancient Tuscany was not even making red wine to begin with. I genuinely do not know what to do with that information."
- Joe: "Carmela, what do you think about the fact that the oldest traceable wine in Tuscany, which was evidently very popular, was a white wine?"

---

## Saving the output

Save the finished Wine in the News script to the episode output file (`outputs/episodes/ep[N]-[slug].md`) alongside the SEO/AEO and Bluesky content. Do not leave it only in the chat.

Immediately after Joe selects a story, add it to `data/wine-in-the-news-archive.md` -- episode number, approximate date, publication, one-line description, and tags. Commit the archive file along with the episode output. Do not leave this until the next session.
