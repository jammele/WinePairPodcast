// Scoring rubric: analyzes a cheerio-parsed page and returns category scores + signal details

const QUESTION_WORDS = /^(who|what|when|where|why|how|which|is|are|can|does|do|should|will)\b/i;

function scoreLevel(score) {
  if (score >= 70) return 'green';
  if (score >= 40) return 'yellow';
  return 'red';
}

function signal(name, score, value, recommendation = null) {
  return { name, score, level: scoreLevel(score), value, recommendation };
}

function categoryScore(signals) {
  const avg = Math.round(signals.reduce((sum, s) => sum + s.score, 0) / signals.length);
  return { score: avg, level: scoreLevel(avg), signals };
}

// ─── 1. On-Page SEO ───────────────────────────────────────────────────────────

function scoreOnPage($, url) {
  const signals = [];

  // Title tag
  const title = $('title').first().text().trim();
  const titleLen = title.length;
  const titleScore = !title ? 0 : titleLen < 30 ? 30 : titleLen <= 60 ? 100 : titleLen <= 70 ? 70 : 40;
  signals.push(signal(
    'Title Tag',
    titleScore,
    title ? `"${title}" (${titleLen} chars)` : '(missing)',
    !title ? 'Add a title tag with your target keyword (50-60 characters)' :
    titleLen < 30 ? 'Title is too short — aim for 50-60 characters' :
    titleLen > 70 ? 'Title is too long — trim to under 60 characters' : null
  ));

  // Meta description
  const desc = $('meta[name="description"]').attr('content') || '';
  const descLen = desc.length;
  const descScore = !desc ? 0 : descLen < 80 ? 30 : descLen <= 160 ? 100 : 60;
  signals.push(signal(
    'Meta Description',
    descScore,
    desc ? `${descLen} characters` : '(missing)',
    !desc ? 'Add a meta description (150-160 characters) with a clear call to action' :
    descLen < 80 ? 'Meta description is too short — aim for 150-160 characters' :
    descLen > 160 ? 'Meta description is too long — trim to 160 characters' : null
  ));

  // H1 heading
  const h1s = $('h1');
  const h1Count = h1s.length;
  const h1Text = h1s.first().text().trim();
  const h1Score = h1Count === 0 ? 0 : h1Count === 1 ? 100 : 50;
  signals.push(signal(
    'H1 Heading',
    h1Score,
    h1Count === 0 ? '(missing)' : h1Count === 1 ? `"${h1Text.slice(0, 60)}"` : `${h1Count} H1s found`,
    h1Count === 0 ? 'Add exactly one H1 heading containing your primary keyword' :
    h1Count > 1 ? `Remove extra H1s — found ${h1Count}, should have exactly 1` : null
  ));

  // Heading hierarchy
  const hasH2 = $('h2').length > 0;
  const hasH3 = $('h3').length > 0;
  const headingScore = !hasH2 ? (h1Count > 0 ? 40 : 10) : hasH3 ? 100 : 80;
  signals.push(signal(
    'Heading Hierarchy',
    headingScore,
    `H1: ${h1Count}, H2: ${$('h2').length}, H3: ${$('h3').length}`,
    !hasH2 ? 'Add H2 subheadings to break up content and signal topic structure' : null
  ));

  // Content length
  const $body = $('body').clone();
  $body.find('nav, footer, header, script, style, noscript').remove();
  const bodyText = $body.text().replace(/\s+/g, ' ').trim();
  const words = bodyText.split(/\s+/).filter(w => w.length > 2);
  const wordCount = words.length;
  const wordScore = wordCount < 150 ? 10 : wordCount < 300 ? 35 : wordCount < 600 ? 65 : wordCount < 1000 ? 85 : 100;
  signals.push(signal(
    'Content Length',
    wordScore,
    `${wordCount.toLocaleString()} words`,
    wordCount < 300 ? 'Page content is very thin — add more substantive copy to improve rankings' :
    wordCount < 600 ? 'Consider expanding to at least 600 words for competitive pages' : null
  ));

  // Image alt text
  const allImgs = $('img');
  const imgsWithAlt = $('img[alt]').filter((_, el) => ($(el).attr('alt') || '').trim().length > 0);
  const imgScore = allImgs.length === 0 ? 75 : Math.round((imgsWithAlt.length / allImgs.length) * 100);
  const missingAlt = allImgs.length - imgsWithAlt.length;
  signals.push(signal(
    'Image Alt Text',
    imgScore,
    allImgs.length === 0 ? 'No images found' : `${imgsWithAlt.length}/${allImgs.length} have alt text`,
    missingAlt > 0 ? `Add descriptive alt text to ${missingAlt} image(s)` : null
  ));

  // Internal links
  let host;
  try { host = new URL(url).hostname; } catch { host = ''; }
  const internalLinks = $('a[href]').filter((_, el) => {
    const href = $(el).attr('href') || '';
    return href.startsWith('/') || (host && href.includes(host));
  });
  const intLinkCount = internalLinks.length;
  const intScore = intLinkCount === 0 ? 10 : intLinkCount < 3 ? 50 : intLinkCount < 8 ? 80 : 100;
  signals.push(signal(
    'Internal Links',
    intScore,
    `${intLinkCount} internal links`,
    intLinkCount < 3 ? 'Add more internal links to related episodes, blog posts, or pages' : null
  ));

  return categoryScore(signals);
}

// ─── 2. Technical SEO ─────────────────────────────────────────────────────────

function scoreTechnical($, url, responseUrl) {
  const signals = [];

  // HTTPS
  const isHttps = (responseUrl || url).startsWith('https://');
  signals.push(signal(
    'HTTPS',
    isHttps ? 100 : 0,
    isHttps ? 'Secure (HTTPS)' : 'Insecure (HTTP)',
    !isHttps ? 'Migrate to HTTPS — Google uses this as a ranking signal' : null
  ));

  // Canonical
  const canonical = $('link[rel="canonical"]').attr('href');
  signals.push(signal(
    'Canonical URL',
    canonical ? 100 : 30,
    canonical || '(not set)',
    !canonical ? 'Add a canonical tag to prevent duplicate content issues' : null
  ));

  // Robots meta
  const robots = $('meta[name="robots"]').attr('content') || '';
  const isNoindex = robots.toLowerCase().includes('noindex');
  signals.push(signal(
    'Robots / Indexing',
    isNoindex ? 0 : 100,
    robots || '(not set — defaults to index)',
    isNoindex ? 'Page is marked noindex — search engines will not index it' : null
  ));

  // Mobile viewport
  const viewport = $('meta[name="viewport"]').attr('content');
  signals.push(signal(
    'Mobile Viewport',
    viewport ? 100 : 0,
    viewport || '(missing)',
    !viewport ? 'Add a viewport meta tag — required for mobile-friendly ranking' : null
  ));

  // Open Graph
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDesc = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogCount = [ogTitle, ogDesc, ogImage].filter(Boolean).length;
  const ogScore = ogCount === 0 ? 10 : ogCount === 1 ? 40 : ogCount === 2 ? 70 : 100;
  signals.push(signal(
    'Open Graph Tags',
    ogScore,
    `${ogCount}/3 tags present (title, description, image)`,
    ogCount < 3 ? `Add missing Open Graph tags: ${[!ogTitle && 'og:title', !ogDesc && 'og:description', !ogImage && 'og:image'].filter(Boolean).join(', ')}` : null
  ));

  // Twitter card
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  signals.push(signal(
    'Twitter / Social Card',
    twitterCard ? 100 : 50,
    twitterCard || '(not set)',
    !twitterCard ? 'Add twitter:card meta tag for better social sharing' : null
  ));

  return categoryScore(signals);
}

// ─── 3. Schema & Structured Data ──────────────────────────────────────────────

function scoreSchema($) {
  const signals = [];

  // Parse all JSON-LD blocks, including @graph containers (used by Beamly)
  const schemas = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html());
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item['@graph']) {
          schemas.push(...item['@graph']);
        } else {
          schemas.push(item);
        }
      }
    } catch {
      // malformed JSON-LD — ignore
    }
  });

  const schemaTypes = schemas.map(s => s['@type']).filter(Boolean);
  const hasSchema = schemas.length > 0;

  signals.push(signal(
    'JSON-LD Present',
    hasSchema ? 100 : 0,
    hasSchema ? `${schemas.length} block(s) found` : '(none found)',
    !hasSchema ? 'Add JSON-LD structured data — critical for rich results and AI citation' : null
  ));

  signals.push(signal(
    'Schema Types Used',
    schemaTypes.length > 0 ? 80 : 0,
    schemaTypes.length > 0 ? schemaTypes.join(', ') : '(none)',
    null
  ));

  // Podcast-specific schema
  const hasPodcastSchema = schemaTypes.some(t =>
    ['PodcastSeries', 'PodcastEpisode', 'Podcast'].includes(t)
  );
  const podcastScore = hasPodcastSchema ? 100 : hasSchema ? 30 : 0;
  signals.push(signal(
    'Podcast Schema',
    podcastScore,
    hasPodcastSchema ? 'PodcastSeries or PodcastEpisode found' : '(not found)',
    !hasPodcastSchema ? 'Add PodcastSeries schema to help Google and Apple show rich podcast results' : null
  ));

  // FAQ schema
  const hasFaqSchema = schemaTypes.some(t => t === 'FAQPage');
  signals.push(signal(
    'FAQ Schema',
    hasFaqSchema ? 100 : 20,
    hasFaqSchema ? 'FAQPage schema found' : '(not found)',
    !hasFaqSchema ? 'Add FAQPage schema to hub/spoke and blog pages for featured snippet eligibility' : null
  ));

  // Schema completeness: check required properties on found schemas
  let completenessScore = 50;
  if (schemas.length > 0) {
    const hasName = schemas.some(s => s.name || s.headline);
    const hasUrl = schemas.some(s => s.url || s['@id']);
    const hasDesc = schemas.some(s => s.description);
    const hasAuthor = schemas.some(s => s.author || s.creator);
    completenessScore = Math.round(([hasName, hasUrl, hasDesc, hasAuthor].filter(Boolean).length / 4) * 100);
  }
  signals.push(signal(
    'Schema Completeness',
    schemas.length === 0 ? 0 : completenessScore,
    schemas.length === 0 ? 'No schema to evaluate' : `${completenessScore}% of key properties filled`,
    completenessScore < 70 && schemas.length > 0 ? 'Fill in name, url, and description on all schema objects' : null
  ));

  return categoryScore(signals);
}

// ─── 4. Featured Snippet Readiness ────────────────────────────────────────────

function scoreSnippet($) {
  const signals = [];

  // Question-style headings
  const headings = $('h2, h3').map((_, el) => $(el).text().trim()).get();
  const questionHeadings = headings.filter(h => QUESTION_WORDS.test(h));
  const qhScore = questionHeadings.length === 0 ? 10 : questionHeadings.length < 3 ? 60 : 100;
  signals.push(signal(
    'Question-Style Headings',
    qhScore,
    `${questionHeadings.length} of ${headings.length} headings are question-style`,
    questionHeadings.length === 0 ? 'Rewrite H2/H3 headings as questions (e.g., "What is Cabernet Sauvignon?") to target featured snippets' :
    questionHeadings.length < 3 ? 'Add more question-style H2/H3 headings — each one is a featured snippet opportunity' : null
  ));

  // Lists
  const listCount = $('ul, ol').length;
  const listScore = listCount === 0 ? 10 : listCount < 2 ? 60 : 100;
  signals.push(signal(
    'List Formatting',
    listScore,
    `${listCount} list(s) found`,
    listCount === 0 ? 'Add bulleted or numbered lists — Google often pulls these directly into featured snippets' : null
  ));

  // Tables
  const tableCount = $('table').length;
  signals.push(signal(
    'Table Formatting',
    tableCount > 0 ? 100 : 40,
    `${tableCount} table(s) found`,
    null
  ));

  // Short paragraph answers (40-80 words) following question headings
  let directAnswers = 0;
  $('h2, h3').each((_, heading) => {
    const text = $(heading).text().trim();
    if (QUESTION_WORDS.test(text)) {
      const nextP = $(heading).next('p');
      if (nextP.length) {
        const wordCount = nextP.text().trim().split(/\s+/).length;
        if (wordCount >= 30 && wordCount <= 100) directAnswers++;
      }
    }
  });
  const answerScore = questionHeadings.length === 0 ? 20 :
    directAnswers === 0 ? 20 : directAnswers < questionHeadings.length ? 70 : 100;
  signals.push(signal(
    'Direct Answer Paragraphs',
    answerScore,
    `${directAnswers} question heading(s) followed by a direct paragraph answer`,
    directAnswers === 0 && questionHeadings.length > 0 ? 'After each question heading, write a direct 40-80 word answer — this is the exact format Google pulls into featured snippets' : null
  ));

  return categoryScore(signals);
}

// ─── 5. Conversational Query Targeting ────────────────────────────────────────

function scoreConversational($) {
  const signals = [];

  // Question headings (overlaps with snippet but weighted separately)
  const headings = $('h2, h3, h4').map((_, el) => $(el).text().trim()).get();
  const questionHeadings = headings.filter(h => QUESTION_WORDS.test(h));
  const qhRatio = headings.length === 0 ? 0 : questionHeadings.length / headings.length;
  const qhScore = questionHeadings.length === 0 ? 10 : qhRatio < 0.3 ? 50 : qhRatio < 0.6 ? 80 : 100;
  signals.push(signal(
    'Conversational Headings',
    qhScore,
    `${questionHeadings.length} question-style headings`,
    questionHeadings.length < 2 ? 'Write headings as questions your listeners would actually ask' : null
  ));

  // FAQ section presence
  const hasFaq = $('[class*="faq"], [id*="faq"], [class*="FAQ"], [id*="FAQ"]').length > 0 ||
    headings.some(h => /faq|frequently asked|questions/i.test(h));
  signals.push(signal(
    'FAQ Section',
    hasFaq ? 100 : 20,
    hasFaq ? 'FAQ section detected' : '(not found)',
    !hasFaq ? 'Add a FAQ section — "People also ask" results drive significant podcast discovery traffic' : null
  ));

  // Natural language / conversational tone (proxy: second-person pronouns)
  const $body = $('body').clone();
  $body.find('nav, footer, header, script, style').remove();
  const bodyText = $body.text().toLowerCase();
  const youCount = (bodyText.match(/\byou\b|\byour\b/g) || []).length;
  const wordCount = bodyText.split(/\s+/).length;
  const youDensity = wordCount > 0 ? (youCount / wordCount) * 100 : 0;
  const convScore = youDensity < 0.2 ? 30 : youDensity < 0.5 ? 60 : youDensity < 1.5 ? 100 : 80;
  signals.push(signal(
    'Conversational Tone',
    convScore,
    `"you/your" density: ${youDensity.toFixed(1)}% of words`,
    youDensity < 0.2 ? 'Write more directly to the reader using "you/your" — content that speaks to the reader performs better in AI results' : null
  ));

  // Answer-first pattern: does the first content paragraph start with a direct statement?
  const firstP = $('main p, article p, .content p, section p').first();
  const firstWords = firstP.text().trim().split(/\s+/).slice(0, 8).join(' ');
  const isAnswerFirst = firstP.length > 0 && firstP.text().trim().split(/\s+/).length > 20;
  signals.push(signal(
    'Answer-First Opening',
    isAnswerFirst ? 80 : 30,
    firstWords ? `"${firstWords}..."` : '(no opening paragraph found)',
    !isAnswerFirst ? 'Lead with a clear, direct opening paragraph — AI models prefer content that states the main point first' : null
  ));

  return categoryScore(signals);
}

// ─── 6. AI Overview & Copilot Readiness ──────────────────────────────────────

function scoreAIReadiness($) {
  const signals = [];

  // Author markup
  const authorSchema = $('script[type="application/ld+json"]').toArray().some(el => {
    try { const d = JSON.parse($(el).html()); return d.author || d.creator; } catch { return false; }
  });
  const authorMeta = $('meta[name="author"]').attr('content');
  const hasAuthor = authorSchema || !!authorMeta;
  signals.push(signal(
    'Author Markup',
    hasAuthor ? 100 : 30,
    hasAuthor ? `Author identified (${authorMeta || 'in schema'})` : '(not found)',
    !hasAuthor ? 'Add author markup — AI models prioritize content with identifiable, credible authors' : null
  ));

  // Publication/update date
  const dateSchema = $('script[type="application/ld+json"]').toArray().some(el => {
    try { const d = JSON.parse($(el).html()); return d.datePublished || d.dateModified || d.uploadDate; } catch { return false; }
  });
  const dateMeta = $('meta[property="article:published_time"], meta[property="article:modified_time"]').first().attr('content');
  const hasDate = dateSchema || !!dateMeta;
  signals.push(signal(
    'Publication Date',
    hasDate ? 100 : 30,
    hasDate ? 'Date markup found' : '(not found)',
    !hasDate ? 'Add publication and update dates — AI answer engines prefer fresh, dated content' : null
  ));

  // Section structure (ratio of headings to content depth — good structure = more headings)
  const h2h3Count = $('h2, h3').length;
  const $body = $('body').clone();
  $body.find('nav, footer, header, script, style').remove();
  const wordCount = $body.text().split(/\s+/).filter(w => w.length > 2).length;
  const headingsPerKWord = wordCount > 0 ? (h2h3Count / wordCount) * 1000 : 0;
  const structureScore = h2h3Count === 0 ? 10 : headingsPerKWord < 2 ? 50 : headingsPerKWord < 8 ? 90 : 70;
  signals.push(signal(
    'Content Structure',
    structureScore,
    `${h2h3Count} section headings for ${wordCount} words`,
    h2h3Count < 2 ? 'Add more H2/H3 section headings — AI models extract from well-structured, scannable content' : null
  ));

  // Factual specificity (presence of numbers, percentages, years)
  const bodyText = $body.text();
  const factualMatches = (bodyText.match(/\b\d{1,3}(\.\d+)?(%|°|km|ml|oz|lbs|years?|months?|episodes?)\b|\b(19|20)\d{2}\b/g) || []).length;
  const factualScore = factualMatches < 2 ? 30 : factualMatches < 5 ? 65 : 100;
  signals.push(signal(
    'Factual Specificity',
    factualScore,
    `${factualMatches} specific facts/numbers detected`,
    factualMatches < 3 ? 'Include specific facts, numbers, and dates — AI models cite specific claims, not vague descriptions' : null
  ));

  // Topical depth (content length + structure combined)
  const depthScore = wordCount < 200 ? 10 : wordCount < 500 ? 40 : wordCount < 1000 ? 75 : h2h3Count >= 3 ? 100 : 85;
  signals.push(signal(
    'Topical Depth',
    depthScore,
    `${wordCount} words across ${h2h3Count} sections`,
    depthScore < 70 ? 'AI models prefer thorough, comprehensive content — aim for depth over brevity on key pages' : null
  ));

  return categoryScore(signals);
}

// ─── Main export ──────────────────────────────────────────────────────────────

const WEIGHTS = {
  onPage:         0.25,
  technical:      0.15,
  schema:         0.15,
  snippet:        0.15,
  conversational: 0.15,
  aiReadiness:    0.15,
};

export function scorePage($, url, responseUrl) {
  const categories = {
    onPage:         scoreOnPage($, url),
    technical:      scoreTechnical($, url, responseUrl),
    schema:         scoreSchema($),
    snippet:        scoreSnippet($),
    conversational: scoreConversational($),
    aiReadiness:    scoreAIReadiness($),
  };

  const overallScore = Math.round(
    Object.entries(categories).reduce((sum, [key, cat]) => sum + cat.score * WEIGHTS[key], 0)
  );

  return {
    categories,
    overallScore,
    overallLevel: scoreLevel(overallScore),
  };
}

export const CATEGORY_LABELS = {
  onPage:         'On-Page SEO',
  technical:      'Technical SEO',
  schema:         'Schema & Structured Data',
  snippet:        'Featured Snippet Readiness',
  conversational: 'Conversational Query Targeting',
  aiReadiness:    'AI Overview & Copilot Readiness',
};
