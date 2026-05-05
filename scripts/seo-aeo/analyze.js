import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import { scorePage } from './rubric.js';
import { runLighthouse } from './lighthouse-audit.js';
import { generateReport } from './report.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../..');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

const SKIP_LIGHTHOUSE = process.argv.includes('--skip-lighthouse');

async function fetchPage(url) {
  const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(20000), redirect: 'follow' });
  const html = await res.text();
  return { html, finalUrl: res.url };
}

async function analyzePage(page) {
  console.log(`\n  Fetching ${page.url}...`);
  const { html, finalUrl } = await fetchPage(page.url);
  const $ = cheerio.load(html);
  const scores = scorePage($, page.url, finalUrl);
  console.log(`  Content scored: ${scores.overallScore}/100`);

  let lighthouse = null;
  if (!SKIP_LIGHTHOUSE) {
    console.log(`  Running Lighthouse...`);
    lighthouse = await runLighthouse(finalUrl);
    console.log(`  Lighthouse: perf=${lighthouse.performance} a11y=${lighthouse.accessibility} seo=${lighthouse.seo}`);
  }

  return { scores, lighthouse, finalUrl };
}

async function loadPreviousResults(historyDir) {
  if (!existsSync(historyDir)) return null;
  const { readdir } = await import('fs/promises');
  const files = (await readdir(historyDir)).filter(f => f.endsWith('.json')).sort();
  if (files.length < 2) return null;
  const prev = files[files.length - 2];
  return JSON.parse(await readFile(join(historyDir, prev), 'utf8'));
}

async function main() {
  const portfolioPath = join(__dirname, 'page-portfolio.json');
  const portfolio = JSON.parse(await readFile(portfolioPath, 'utf8'));
  const { outputDir, historyDir, reportFile } = portfolio.settings;

  const absHistory = join(ROOT, historyDir);
  const absReport  = join(ROOT, reportFile);
  await mkdir(absHistory, { recursive: true });

  console.log(`\nSEO & AEO Analyzer — The Wine Pair Podcast`);
  console.log(`Scanning ${portfolio.pages.length} pages${SKIP_LIGHTHOUSE ? ' (Lighthouse skipped)' : ' + Lighthouse'}...\n`);

  const results = [];

  for (const page of portfolio.pages) {
    console.log(`[${results.length + 1}/${portfolio.pages.length}] ${page.name}`);
    try {
      const { scores, lighthouse, finalUrl } = await analyzePage(page);
      results.push({ ...page, timestamp: new Date().toISOString(), scores, lighthouse, finalUrl });
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      results.push({ ...page, timestamp: new Date().toISOString(), error: err.message });
    }
  }

  // Save timestamped history
  const ts = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const historyFile = join(absHistory, `scan-${ts}.json`);
  await writeFile(historyFile, JSON.stringify(results, null, 2));

  // Load previous scan for comparison (future use)
  const previous = await loadPreviousResults(absHistory);

  // Generate HTML report
  const html = generateReport(results, previous);
  await writeFile(absReport, html, 'utf8');

  // Print summary
  console.log('\n─────────────────────────────────────');
  console.log('RESULTS SUMMARY');
  console.log('─────────────────────────────────────');
  for (const r of results) {
    if (r.error) {
      console.log(`  ✗  ${r.name} — ERROR: ${r.error}`);
    } else {
      const level = r.scores.overallLevel.toUpperCase().padEnd(6);
      console.log(`  ${level} ${r.scores.overallScore.toString().padStart(3)}/100  ${r.name}`);
    }
  }

  console.log(`\nReport saved: ${absReport}`);
  console.log('Open report.html in your browser to view full results.\n');
}

main().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
