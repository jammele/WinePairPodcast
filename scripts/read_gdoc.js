/**
 * read_gdoc.js
 *
 * Reads the text content of any Google Doc by its document ID.
 * Used internally by ingest_prompts.js and other scripts.
 *
 * Usage:
 *   node scripts/read_gdoc.js <document_id>
 *   node scripts/read_gdoc.js 1D4klCn2K2p7Y1rl7R_Ay7YQuAZfI1_5oMIDM-rZ2cEY
 */

import { google } from 'googleapis';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CREDS_PATH = join(ROOT, 'google_credentials.json');
const TOKEN_PATH = join(ROOT, 'google_token.json');

export function getAuthClient() {
  if (!existsSync(CREDS_PATH)) {
    throw new Error('google_credentials.json not found. Run setup first.');
  }
  if (!existsSync(TOKEN_PATH)) {
    throw new Error('Not authorized yet. Run: node scripts/setup_google_auth.js');
  }

  const credentials = JSON.parse(readFileSync(CREDS_PATH, 'utf8'));
  const { client_id, client_secret } = credentials.installed || credentials.web;
  const tokens = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));

  const auth = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3737');
  auth.setCredentials(tokens);
  return auth;
}

export async function readGoogleDoc(docId) {
  const auth = getAuthClient();
  const docs = google.docs({ version: 'v1', auth });

  const res = await docs.documents.get({ documentId: docId });
  const doc = res.data;

  // Extract plain text from the document body
  let text = '';
  const body = doc.body?.content || [];
  for (const element of body) {
    if (element.paragraph) {
      for (const pe of element.paragraph.elements || []) {
        if (pe.textRun?.content) {
          text += pe.textRun.content;
        }
      }
    }
    if (element.table) {
      for (const row of element.table.tableRows || []) {
        for (const cell of row.tableCells || []) {
          for (const cellContent of cell.content || []) {
            if (cellContent.paragraph) {
              for (const pe of cellContent.paragraph.elements || []) {
                if (pe.textRun?.content) {
                  text += pe.textRun.content + '\t';
                }
              }
            }
          }
        }
        text += '\n';
      }
    }
  }

  return {
    title: doc.title,
    docId,
    text: text.trim(),
  };
}

// CLI usage
if (process.argv[2]) {
  const docId = process.argv[2];
  try {
    const result = await readGoogleDoc(docId);
    console.log(`\n=== ${result.title} ===\n`);
    console.log(result.text);
  } catch (err) {
    console.error('Error:', err.message);
    if (err.message.includes('Not authorized')) {
      console.error('Run: node scripts/setup_google_auth.js');
    }
  }
}
