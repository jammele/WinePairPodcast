import { google } from 'googleapis';
import { readFileSync } from 'fs';
const ROOT = 'C:/Users/jamme/podcast-os';
const credentials = JSON.parse(readFileSync(ROOT + '/google_credentials.json', 'utf8'));
const tokens = JSON.parse(readFileSync(ROOT + '/google_token.json', 'utf8'));
const { client_id, client_secret } = credentials.installed || credentials.web;
const auth = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3737');
auth.setCredentials(tokens);
const drive = google.drive({ version: 'v3', auth });

// First find the "App" folder under Phase 2
const folderRes = await drive.files.list({
  q: "mimeType='application/vnd.google-apps.folder' and trashed=false and name='App'",
  fields: 'files(id, name, parents)',
  pageSize: 10,
});
console.log('App folders:', JSON.stringify(folderRes.data.files, null, 2));

// Also list all docs in any folder containing 'App' in name
for (const folder of folderRes.data.files || []) {
  console.log(`\nContents of folder "${folder.name}" (${folder.id}):`);
  const contentsRes = await drive.files.list({
    q: `'${folder.id}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType)',
    pageSize: 30,
  });
  for (const f of contentsRes.data.files || []) {
    console.log(`  ${f.mimeType === 'application/vnd.google-apps.document' ? '[DOC]' : '[   ]'} ${f.name}`);
  }
}
