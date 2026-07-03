/**
 * find_episode.mjs -- Search Google Drive for episode documents by name.
 *
 * Usage:
 *   node scripts/find_episode.mjs "225"
 *   node scripts/find_episode.mjs "Costco Bordeaux"
 *
 * Returns: JSON array of matching Google Docs (id, name), most recently modified first.
 */

import { readFileSync } from 'fs';
import { google } from 'googleapis';

const searchTerm = process.argv[2];
if (!searchTerm) {
  console.error('Usage: node scripts/find_episode.mjs "search term"');
  process.exit(1);
}

const creds = JSON.parse(readFileSync('google_credentials.json', 'utf8'));
const token = JSON.parse(readFileSync('google_token.json', 'utf8'));

const auth = new google.auth.OAuth2(
  creds.installed?.client_id || creds.web?.client_id,
  creds.installed?.client_secret || creds.web?.client_secret
);
auth.setCredentials(token);

const drive = google.drive({ version: 'v3', auth });
const r = await drive.files.list({
  q: `name contains '${searchTerm}' and mimeType='application/vnd.google-apps.document'`,
  fields: 'files(id,name)',
  orderBy: 'modifiedTime desc',
  pageSize: 10
});
console.log(JSON.stringify(r.data.files, null, 2));
