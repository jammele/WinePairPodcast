/**
 * gsc_query_page.js
 *
 * Pulls Google Search Console query+page combined dimension data for a given
 * query filter. Used by the blog opportunity brief process to answer:
 * "For queries in this cluster, which Wine Pair URL is actually receiving impressions?"
 *
 * Usage:
 *   node scripts/gsc_query_page.js "meiomi"
 *   node scripts/gsc_query_page.js "meiomi" --start 2026-06-06 --end 2026-07-04
 *
 * Requires: google_credentials.json and google_token.json in project root.
 * The token must include the webmasters.readonly scope.
 * If the current token lacks this scope, run: node scripts/setup_google_auth.js
 * (setup_google_auth.js must include 'https://www.googleapis.com/auth/webmasters.readonly')
 */

import { google } from 'googleapis';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CREDS_PATH = join(ROOT, 'google_credentials.json');
const TOKEN_PATH = join(ROOT, 'google_token.json');

const SITE_URL = 'https://thewinepairpodcast.com';

function getAuthClient() {
  if (!existsSync(CREDS_PATH)) {
    throw new Error('google_credentials.json not found. Run setup first.');
  }
  if (!existsSync(TOKEN_PATH)) {
    throw new Error('Not authorized. Run: node scripts/setup_google_auth.js');
  }

  const credentials = JSON.parse(readFileSync(CREDS_PATH, 'utf8'));
  const { client_id, client_secret } = credentials.installed || credentials.web;
  const tokens = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));

  const auth = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3737');
  auth.setCredentials(tokens);

  auth.on('tokens', (newTokens) => {
    const current = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
    writeFileSync(TOKEN_PATH, JSON.stringify({ ...current, ...newTokens }, null, 2));
  });

  return auth;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const filter = args[0] || '';
  let start = '2026-06-06';
  let end = '2026-07-04';
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--start' && args[i + 1]) start = args[++i];
    if (args[i] === '--end' && args[i + 1]) end = args[++i];
  }
  return { filter, start, end };
}

async function main() {
  const { filter, start, end } = parseArgs();

  if (!filter) {
    console.error('Usage: node scripts/gsc_query_page.js <query-filter> [--start YYYY-MM-DD] [--end YYYY-MM-DD]');
    console.error('Example: node scripts/gsc_query_page.js "meiomi"');
    process.exit(1);
  }

  console.log(`\nGSC Query+Page Analysis`);
  console.log(`Site: ${SITE_URL}`);
  console.log(`Filter: queries containing "${filter}"`);
  console.log(`Window: ${start} to ${end}\n`);

  let auth;
  try {
    auth = getAuthClient();
  } catch (err) {
    console.error('Auth error:', err.message);
    process.exit(1);
  }

  const webmasters = google.webmasters({ version: 'v3', auth });

  let response;
  try {
    response = await webmasters.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: {
        startDate: start,
        endDate: end,
        dimensions: ['query', 'page'],
        dimensionFilterGroups: [{
          filters: [{
            dimension: 'query',
            operator: 'contains',
            expression: filter
          }]
        }],
        rowLimit: 500,
        dataState: 'all'
      }
    });
  } catch (err) {
    if (err.code === 401 || (err.message && err.message.includes('insufficient authentication scopes'))) {
      console.error('\nAUTH SCOPE ERROR: The current google_token.json lacks the webmasters.readonly scope.');
      console.error('\nTo fix:');
      console.error('1. In scripts/setup_google_auth.js, add this line to the SCOPES array:');
      console.error("     'https://www.googleapis.com/auth/webmasters.readonly'");
      console.error('2. Delete google_token.json: rm google_token.json');
      console.error('3. Re-run: node scripts/setup_google_auth.js');
      console.error('4. Re-run: node scripts/gsc_query_page.js "meiomi"');
    } else if (err.code === 403) {
      console.error('\nPERMISSION ERROR (403):', err.message);
      console.error('\nPossible causes:');
      console.error('1. The Google Cloud project has not enabled the Search Console API.');
      console.error('   Fix: https://console.developers.google.com/ → APIs → Enable "Google Search Console API"');
      console.error('2. The authenticated user does not have access to ' + SITE_URL + ' in Search Console.');
      console.error('   Fix: verify the account used during setup_google_auth.js has property access in GSC.');
      console.error('\nRaw error:', JSON.stringify(err.errors || err.message, null, 2));
    } else {
      console.error('\nAPI ERROR:', err.message);
      console.error('Code:', err.code);
      if (err.errors) console.error('Details:', JSON.stringify(err.errors, null, 2));
    }
    process.exit(1);
  }

  const rows = response.data.rows || [];
  if (rows.length === 0) {
    console.log(`No data found for filter "${filter}" in this date range.`);
    process.exit(0);
  }

  console.log(`Found ${rows.length} query+page rows.\n`);

  // Sort by impressions descending
  rows.sort((a, b) => b.impressions - a.impressions);

  // Print markdown table
  const col = (s, w) => String(s).padEnd(w);
  const header = `| ${'Query'.padEnd(50)} | ${'Page URL'.padEnd(65)} | ${'Clicks'.padStart(6)} | ${'Impr'.padStart(6)} | ${'CTR'.padStart(7)} | ${'Pos'.padStart(5)} |`;
  const sep    = `|${'-'.repeat(52)}|${'-'.repeat(67)}|${'-'.repeat(8)}|${'-'.repeat(8)}|${'-'.repeat(9)}|${'-'.repeat(7)}|`;

  console.log(header);
  console.log(sep);
  for (const row of rows) {
    const query = row.keys[0];
    const page = row.keys[1].replace('https://thewinepairpodcast.com', '');
    const clicks = row.clicks;
    const impr = row.impressions;
    const ctr = (row.ctr * 100).toFixed(2) + '%';
    const pos = row.position.toFixed(1);
    console.log(`| ${col(query, 50)} | ${col(page, 65)} | ${String(clicks).padStart(6)} | ${String(impr).padStart(6)} | ${ctr.padStart(7)} | ${pos.padStart(5)} |`);
  }

  console.log(`\nTotal rows: ${rows.length}`);
  console.log(`Date window: ${start} to ${end}`);
  console.log(`\nNote: page URLs shown without domain prefix (${SITE_URL})`);
}

main();
