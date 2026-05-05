import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'fs';

const ROOT = 'C:/Users/jamme/podcast-os';
const credentials = JSON.parse(readFileSync(ROOT + '/google_credentials.json', 'utf8'));
const tokens = JSON.parse(readFileSync(ROOT + '/google_token.json', 'utf8'));
const { client_id, client_secret } = credentials.installed || credentials.web;
const auth = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3737');
auth.setCredentials(tokens);
const drive = google.drive({ version: 'v3', auth });

// Find the docx in the App folder
const res = await drive.files.list({
  q: "name='App research document.docx' and trashed=false",
  fields: 'files(id, name)',
  pageSize: 5,
});

const file = res.data.files?.[0];
if (!file) { console.log('NOT FOUND'); process.exit(1); }
console.log(`Found: ${file.name} (${file.id})`);

// Export as plain text via Google Drive export
const exportRes = await drive.files.export({
  fileId: file.id,
  mimeType: 'text/plain',
}, { responseType: 'text' });

const outPath = 'C:/Users/jamme/OneDrive/Desktop/Documents/windr-app/gdocs/App_research_document.txt';
writeFileSync(outPath, exportRes.data, 'utf8');
console.log(`Saved to gdocs/App_research_document.txt (${exportRes.data.length} chars)`);
