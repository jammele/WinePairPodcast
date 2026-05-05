/**
 * write_seo_content.js
 *
 * One-time script: inserts EP213 SEO & GEO content into the show notes doc.
 * Finds the "KEY INSIGHTS & FREQUENTLY ASKED QUESTIONS" heading and inserts
 * the content immediately after it.
 *
 * Usage: node scripts/write_seo_content.js
 */

import { google } from 'googleapis';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CREDS_PATH = join(ROOT, 'google_credentials.json');
const TOKEN_PATH  = join(ROOT, 'google_token.json');

const DOC_ID = '18adYm3LfHQ2WZsSxtgteZLiN3lA4KrbwS9L4sB6gHiY';

const SEO_CONTENT = `

KEY INSIGHTS

• Pét-Nat (short for Pétillant Naturel) is the oldest sparkling wine method in the world, dating to 16th-century France -- more than 200 years before the Méthode Champenoise used to make Champagne was developed.
• Pét-Nat is made using the Méthode Ancestrale: the wine is bottled before fermentation is complete, trapping naturally produced CO2 to create bubbles. There is no secondary fermentation, no added sugar, and no riddling -- making it fundamentally simpler and more ancient than Champagne production.
• Because Pét-Nat is bottled mid-fermentation and typically unfiltered, it is often cloudy, slightly unpredictable from bottle to bottle, and can range from bright and fruity to funky and earthy -- which is exactly what divides opinion about it.
• Pét-Nat is closely associated with the natural wine movement and is typically sealed with a crown cap (like a beer bottle) rather than a cork -- a deliberate signal of low-intervention, non-traditional winemaking.
• In this episode, Joe and Carmela tasted two Pét-Nats from very different corners of the world: Domaine Lingot-Martin Gueule de Gamay (Bugey, eastern France) and Lubanzi 'Rainboat' Pét-Nat (Swartland, South Africa) -- one bright, fizzy, and instantly likable; one funky, murky, and genuinely divisive.
• The ratings split sharply: Carmela gave the Lingot-Martin a 9/10 and the Lubanzi a 4/10. Joe gave the Lubanzi an 8/10 and the Lingot-Martin a 7/10. Same two wines, almost opposite reactions -- which tells you everything about what Pét-Nat is.

FREQUENTLY ASKED QUESTIONS

What is Pét-Nat wine?
Pét-Nat is short for Pétillant Naturel, a French term meaning "naturally sparkling." It refers to wine made using the Méthode Ancestrale, in which the wine is bottled before fermentation is complete. The yeast finishes converting sugar to alcohol inside the sealed bottle, producing CO2 that has nowhere to go -- creating bubbles naturally, with no additional steps.

Is Pét-Nat older than Champagne?
Yes, significantly. The Méthode Ancestrale dates to the 1500s in southern France, making it the oldest sparkling wine production method in the world. The Méthode Champenoise used to make Champagne was not developed until the late 1600s and early 1700s. Pét-Nat predates Champagne by roughly 200 years.

What is the difference between Pét-Nat and Champagne?
Champagne is made using a two-step process: the wine is fermented dry, bottled, and then a second fermentation is triggered inside the bottle by adding sugar and yeast. Pét-Nat skips all of that. It is bottled while the original fermentation is still happening. The result is a simpler, less controlled, lower-pressure wine that is typically cloudier, lower in alcohol, and more variable than Champagne.

Why is Pét-Nat wine cloudy?
Most Pét-Nat is unfiltered and unfined, meaning the dead yeast cells (lees) that remain after fermentation are left in the bottle. This is intentional -- it is part of the natural, low-intervention philosophy behind most Pét-Nat production. The cloudiness is a feature, not a flaw, though it does contribute to the funky, yeasty character some people love and others find off-putting.

What does Pét-Nat taste like?
It depends entirely on the grape and the producer. Pét-Nat made from Gamay (like the Domaine Lingot-Martin in this episode) tends to be bright, fruity, and refreshing -- raspberry, cherry, light bubbles, easy to love. Pét-Nat made from Cinsault (like the Lubanzi Rainboat) can go in a completely different direction -- earthier, funkier, with wild fruit and a hint of the barnyard that natural wine fans describe as "terroir" and skeptics describe as "faulty." The spectrum is wide.

Is Pét-Nat a natural wine?
Most Pét-Nat is made with a natural wine philosophy -- minimal sulfites, no fining or filtering, organic or biodynamic farming -- but it does not have to be. The Méthode Ancestrale is simply a production method. That said, in practice, Pét-Nat and the natural wine movement are deeply intertwined, and most producers making Pét-Nat today are working within a low-intervention framework.

Why does Pét-Nat have a crown cap instead of a cork?
The crown cap (the same closure used on beer bottles) became standard for Pét-Nat partly for practical reasons -- it is easier to seal and open during production. But it has also become a cultural symbol of the natural wine movement: a deliberate rejection of the ceremony and formality associated with Champagne and traditional sparkling wine. If you see a crown cap, you are almost certainly looking at a Pét-Nat or a natural sparkling wine.

Should I buy the Domaine Lingot-Martin Pet Nat Gueule de Gamay?
Yes -- Joe and Carmela both rated it a BUY. It is a bright, raspberry-pink Gamay Pét-Nat from the Bugey region of eastern France, priced around $20. Carmela gave it a 9/10 and called it her clear winner. Joe gave it a 7/10. It is one of the more approachable and crowd-pleasing Pét-Nats you will find at that price.

Should I buy the Lubanzi 'Rainboat' Pét-Nat?
This one is genuinely divisive. Joe gave it an 8/10 and loved its funky, unconventional character -- a Cinsault Pét-Nat from the Swartland region of South Africa, priced around $23. Carmela gave it a 4/10 and found it too far into funky territory to enjoy. If you like natural wine and are curious about the wild side of Pét-Nat, it is worth trying. If you prefer your wine clean and fruit-forward, start with the Lingot-Martin.

What food pairs well with Pét-Nat?
Pét-Nat's natural acidity and light bubbles make it a versatile food wine. Brighter, fruitier styles (like Gamay Pét-Nat) pair well with charcuterie, soft cheeses, salmon, and light appetizers. Funkier, earthier styles pair well with aged cheeses, mushroom dishes, and foods that can hold up to more complexity. Both styles work beautifully as aperitifs.

`;

function getAuthClient() {
  const credentials = JSON.parse(readFileSync(CREDS_PATH, 'utf8'));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
  const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const token = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'));
  auth.setCredentials(token);
  return auth;
}

async function findInsertionIndex(docs, docId) {
  const res = await docs.documents.get({ documentId: docId });
  const content = res.data.body.content;

  const target = 'KEY INSIGHTS & FREQUENTLY ASKED QUESTIONS';

  for (const element of content) {
    if (!element.paragraph) continue;
    const text = element.paragraph.elements
      .map(e => e.textRun?.content || '')
      .join('');
    if (text.trim() === target) {
      // Return the end index of this paragraph
      const lastEl = element.paragraph.elements[element.paragraph.elements.length - 1];
      return lastEl.endIndex;
    }
  }

  throw new Error(`Could not find target heading: "${target}"`);
}

async function main() {
  const auth = getAuthClient();
  const docs = google.docs({ version: 'v1', auth });

  console.log('Finding insertion point...');
  const insertIndex = await findInsertionIndex(docs, DOC_ID);
  console.log(`Inserting at index ${insertIndex}`);

  await docs.documents.batchUpdate({
    documentId: DOC_ID,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: insertIndex },
            text: SEO_CONTENT,
          },
        },
      ],
    },
  });

  console.log('Done. SEO & GEO content written to EP213 show notes.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
