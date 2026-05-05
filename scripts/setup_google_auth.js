/**
 * setup_google_auth.js
 *
 * One-time Google authorization for the Podcast OS.
 * Run this once after placing google_credentials.json in the project root.
 *
 * Usage:  node scripts/setup_google_auth.js
 *
 * What happens:
 *   1. A browser window opens to Google's authorization page.
 *   2. You click Allow.
 *   3. A token is saved to google_token.json.
 *   4. Done. You never need to do this again.
 */

import { google } from 'googleapis';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CREDS_PATH  = join(ROOT, 'google_credentials.json');
const TOKEN_PATH  = join(ROOT, 'google_token.json');

const SCOPES = [
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive',
];

if (!existsSync(CREDS_PATH)) {
  console.error('\nError: google_credentials.json not found.');
  console.error('Expected location:', CREDS_PATH);
  console.error('\nPlease follow the setup instructions to download your credentials file.');
  process.exit(1);
}

if (existsSync(TOKEN_PATH)) {
  console.log('\nGoogle authorization already complete.');
  console.log('Token file exists at:', TOKEN_PATH);
  console.log('To re-authorize, delete google_token.json and run this script again.\n');
  process.exit(0);
}

const credentials = JSON.parse(readFileSync(CREDS_PATH, 'utf8'));
const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

const auth = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3737');

const authUrl = auth.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent',
});

console.log('\nOpening Google authorization in your browser...');
console.log('\nIf it does not open automatically, paste this URL into your browser:');
console.log(authUrl);

// Open browser automatically
exec(`start "" "${authUrl}"`);

// Start a local server to catch the redirect
const server = createServer(async (req, res) => {
  const code = new URL(req.url, 'http://localhost:3737').searchParams.get('code');
  if (!code) {
    res.end('Waiting...');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h2>Authorization complete. You can close this tab and return to the terminal.</h2>');
  server.close();

  try {
    const { tokens } = await auth.getToken(code);
    writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    console.log('\nAuthorization successful. Token saved to:', TOKEN_PATH);
    console.log('\nYou can now run:');
    console.log('  node scripts/ingest_prompts.js   (to import your Drive prompts)');
    console.log('  node scripts/read_gdoc.js <doc_id>  (to read any Google Doc)\n');
  } catch (err) {
    console.error('\nFailed to get token:', err.message);
  }
}).listen(3737, () => {
  console.log('\nWaiting for authorization (listening on localhost:3737)...');
});
