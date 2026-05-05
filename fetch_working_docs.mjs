import { google } from 'googleapis';
import { readFileSync, writeFileSync } from 'fs';

const ROOT = 'C:/Users/jamme/podcast-os';
const credentials = JSON.parse(readFileSync(`${ROOT}/google_credentials.json`, 'utf8'));
const tokens = JSON.parse(readFileSync(`${ROOT}/google_token.json`, 'utf8'));

const { client_id, client_secret } = credentials.installed || credentials.web;
const auth = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3737');
auth.setCredentials(tokens);

// Save refreshed token
auth.on('tokens', (newTokens) => {
  const merged = { ...tokens, ...newTokens };
  writeFileSync(`${ROOT}/google_token.json`, JSON.stringify(merged, null, 2));
});

const drive = google.drive({ version: 'v3', auth });
const docs = google.docs({ version: 'v1', auth });

const DOC_NAMES = [
  'Winedr_START HERE_for Joe',
  'Winedr_Feature_Roadmap_March5_2026',
  'Winedr_State_Snapshot_March5_2026',
  'Winedr_Session_Notes_March 5_2026',
  'Winedr_Claude_Code_Opening_Instruction',
  'Winedr Soul document v1.1',
  'Previous conversations with Claude April 12, 2026',
  'Ideas for getting wine matching right',
  'Thoughts to Claude on the quiz on Feb 25',
  'Feedback from Jack R March 6',
  'Sources for authoritative wine knowledge',
  'App Matching Design Model Exploration',
  'Fruit Dimensions',
  'App research document',
  'Notes on quiz April 14, 2026',
];

function extractText(doc) {
  let text = '';
  const body = doc.body?.content || [];
  for (const element of body) {
    if (element.paragraph) {
      for (const pe of element.paragraph.elements || []) {
        if (pe.textRun?.content) text += pe.textRun.content;
      }
    } else if (element.table) {
      for (const row of element.table.tableRows || []) {
        for (const cell of row.tableCells || []) {
          for (const ce of cell.content || []) {
            if (ce.paragraph) {
              for (const pe of ce.paragraph.elements || []) {
                if (pe.textRun?.content) text += pe.textRun.content;
              }
            }
          }
        }
        text += '\n';
      }
    }
  }
  return text;
}

for (const name of DOC_NAMES) {
  try {
    const res = await drive.files.list({
      q: `name contains '${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.document' and trashed=false`,
      fields: 'files(id, name)',
      pageSize: 5,
    });

    const files = res.data.files;
    if (!files || files.length === 0) {
      console.log(`NOT FOUND: ${name}`);
      continue;
    }

    const file = files[0];
    console.log(`\nFetching: ${file.name} (${file.id})`);

    const docRes = await docs.documents.get({ documentId: file.id });
    const text = extractText(docRes.data);

    const safeName = name.replace(/[^a-z0-9]/gi, '_');
    const outPath = `C:/Users/jamme/OneDrive/Desktop/Documents/windr-app/gdocs/${safeName}.txt`;
    writeFileSync(outPath, text, 'utf8');
    console.log(`  Saved to gdocs/${safeName}.txt (${text.length} chars)`);
  } catch (err) {
    console.error(`ERROR fetching ${name}:`, err.message);
  }
}
