import mammoth from 'mammoth';
import { writeFileSync } from 'fs';

const result = await mammoth.extractRawText({ path: 'G:/My Drive/Wine Podcast/Phase 2/App/App research document.docx' });
writeFileSync('C:/Users/jamme/OneDrive/Desktop/Documents/windr-app/gdocs/App_research_document.txt', result.value, 'utf8');
console.log(`Done. ${result.value.length} chars.`);
if (result.messages.length) console.log('Warnings:', result.messages);
