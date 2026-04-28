/**
 * Extracts wine card data from the Winedr app's wineCards.ts file
 * and outputs blog-ready JSON for the Wine Similarity Project.
 *
 * Converts app stats (0-100 scale) to blog dimensions (1-10 scale).
 * Outputs: data/wine_similarity_data.json
 */

const fs = require('fs');
const path = require('path');

const WINE_CARDS_PATH = 'C:/Users/jamme/OneDrive/Desktop/Documents/windr-app/src/data/wineCards.ts';
const OUTPUT_PATH = path.join(__dirname, '../data/wine_similarity_data.json');
const DRIVE_OUTPUT_PATH = 'G:/My Drive/Wine Podcast/Phase 2/Wine Similarity Project/wine_data.json';

// Oak level string → 1-10 score
const OAK_MAP = {
  'none': 1,
  'light': 3,
  'medium': 6,
  'oaky': 8,
  'very_oaky': 9,
};

// wine_vector_type → style family display name
const STYLE_FAMILY_MAP = {
  // Reds
  'light_fruity_red':      'Light and Lively',
  'elegant_terroir_red':   'Graceful and Earthy',
  'old_world_elegant_red': 'Classic and Food-Friendly',
  'new_world_bold_red':    'Bold and Fruit-Forward',
  'earthy_spice_red':      'Rich and Savory',
  // Whites
  'mineral_crisp_white':   'Crisp and Mineral',
  'aromatic_dry_white':    'Bright and Aromatic',
  'rich_textured_white':   'Rich and Rounded',
  'off_dry_aromatic_white':'Off-Dry and Approachable',
  // Skin-contact / orange
  'skin_contact_white':       'Orange and Unconventional',
  'lightly_skin_contact':     'Orange and Unconventional',
  'full_amber_skin_contact':  'Orange and Unconventional',
  // Sparkling
  'classic_traditional_sparkling':  'Classic Bubbles',
  'austere_traditional_sparkling':  'Dry and Focused Bubbles',
  'fresh_easy_sparkling':           'Fresh and Easy Bubbles',
  'sweet_simple_sparkling':         'Sweet and Simple Bubbles',
  'sweet_easy_sparkling':           'Sweet and Simple Bubbles',
  'sweet_elegant_sparkling':        'Sweet and Elegant Bubbles',
  'sweet_traditional_sparkling':    'Sweet and Elegant Bubbles',
  'red_sparkling':                  'Red Bubbles',
  'sparkling_red':                  'Red Bubbles',
  'dry_focused_sparkling':          'Dry and Focused Bubbles',
  // Rosé
  'white_adjacent_rose':    'Light and Delicate Rosé',
  'structured_rose':        'Structured and Savory Rosé',
  'red_adjacent_rose':      'Structured and Savory Rosé',
  'bold_rose':              'Bold Personality Rosé',
  'varietal_character_rose':'Bold Personality Rosé',
  // Dessert / fortified
  'fortified_rich':         'Fortified and Rich',
  'fortified_rich_sweet':   'Fortified and Rich',
  'complex_sweet':          'Complex Sweet',
  // Dessert
  'complex_sweet':         'Complex Sweet',
  'fortified_rich':        'Fortified and Rich',
};

function extractField(block, fieldName) {
  const patterns = [
    new RegExp(`${fieldName}:\\s*'([^']*)'`),
    new RegExp(`${fieldName}:\\s*"([^"]*)"`),
  ];
  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractStats(block) {
  const match = block.match(/stats:\s*\{([^}]+)\}/);
  if (!match) return null;
  const statsStr = match[1];
  const result = {};
  const fields = ['body', 'alcohol', 'acidity', 'tannin', 'sweetness', 'price'];
  for (const field of fields) {
    const m = statsStr.match(new RegExp(`${field}:\\s*(\\d+)`));
    result[field] = m ? parseInt(m[1]) : 0;
  }
  return result;
}

function extractGrapes(block) {
  const match = block.match(/grapes:\s*\[([^\]]*)\]/);
  if (!match) return [];
  return match[1].match(/'([^']*)'/g)?.map(s => s.replace(/'/g, '')) || [];
}

function extractFlavors(block) {
  const matches = [...block.matchAll(/label:\s*'([^']*)'/g)];
  // Flavors are the first set of labels before foods
  const foodsIndex = block.indexOf('foods:');
  const flavorsBlock = foodsIndex > -1 ? block.substring(0, foodsIndex) : block;
  return [...flavorsBlock.matchAll(/label:\s*'([^']*)'/g)].map(m => m[1]);
}

function extractFoods(block) {
  const foodsMatch = block.match(/foods:\s*\[[\s\S]*?\]/);
  if (!foodsMatch) return [];
  return [...foodsMatch[0].matchAll(/label:\s*'([^']*)'/g)].map(m => m[1]);
}

function scaleStat(value) {
  // Convert 0-100 to 1-10, rounded to 1 decimal, minimum 1
  const scaled = Math.max(1, Math.round((value / 10) * 10) / 10);
  return Math.min(10, scaled);
}

function buildWineEntry(block) {
  const id = extractField(block, 'id');
  const name = extractField(block, 'name');
  const wine_color = extractField(block, 'wine_color');
  const oak_level = extractField(block, 'oak_level');
  const wine_vector_type = extractField(block, 'wine_vector_type');
  const hometown = extractField(block, 'hometown');
  const pronunciation = extractField(block, 'pronunciation');
  const pairing_note = extractField(block, 'pairing_note');
  const stats = extractStats(block);
  const grapes = extractGrapes(block);
  const flavors = extractFlavors(block);
  const foods = extractFoods(block);

  if (!id || !name || !stats) return null;

  const oak_score = OAK_MAP[oak_level] ?? 1;
  const style_family = STYLE_FAMILY_MAP[wine_vector_type] ?? null;

  // Price tier from stats.price (0-100): map to rough dollar range
  const priceRanges = [
    { max: 20, label: 'Under $15' },
    { max: 30, label: '$12–20' },
    { max: 40, label: '$15–25' },
    { max: 50, label: '$20–35' },
    { max: 65, label: '$25–45' },
    { max: 80, label: '$35–60' },
    { max: 100, label: '$50+' },
  ];
  const price_range = priceRanges.find(r => stats.price <= r.max)?.label ?? '$50+';

  return {
    id,
    name,
    wine_color,
    grapes,
    region: hometown,
    style_family,
    wine_vector_type,
    pronunciation,
    pairing_note,
    flavors,
    foods,
    price_range,
    dimensions: {
      body:      scaleStat(stats.body),
      acidity:   scaleStat(stats.acidity),
      tannin:    scaleStat(stats.tannin),
      sweetness: scaleStat(stats.sweetness),
      oak:       oak_score,
      alcohol:   scaleStat(stats.alcohol),
    },
  };
}

// Supplemental wines not yet in the Winedr app, scored from wine knowledge.
// Needed for Phase 1 spoke pages as "similar wine" recommendations.
const SUPPLEMENTAL_WINES = [
  {
    id: 'merlot', name: 'Merlot', wine_color: 'dark_red',
    grapes: ['Merlot'], region: 'Bordeaux, France / Napa Valley, California',
    style_family: 'Classic and Food-Friendly', wine_vector_type: 'old_world_elegant_red',
    pronunciation: 'mer-LOH', pairing_note: 'Plush tannins and dark fruit pair well with roasted meats, mushroom dishes, and aged cheeses.',
    flavors: ['plum', 'black cherry', 'chocolate'], foods: ['Roast beef', 'Mushroom pasta', 'Aged cheese'],
    price_range: '$12–25', source: 'manual',
    dimensions: { body: 7, acidity: 5.5, tannin: 5.5, sweetness: 1, oak: 5, alcohol: 6.5 },
  },
  {
    id: 'nero_davola', name: "Nero d'Avola", wine_color: 'dark_red',
    grapes: ["Nero d'Avola"], region: 'Sicily, Italy',
    style_family: 'Bold and Fruit-Forward', wine_vector_type: 'new_world_bold_red',
    pronunciation: 'NEH-ro DAH-voh-lah', pairing_note: 'Bold dark fruit and warm spice pair well with grilled lamb, pasta with rich meat sauce, and aged cheeses.',
    flavors: ['blackberry', 'plum', 'spice'], foods: ['Grilled lamb', 'Pasta Bolognese', 'Aged pecorino'],
    price_range: '$12–25', source: 'manual',
    dimensions: { body: 7, acidity: 6.5, tannin: 6, sweetness: 1, oak: 3, alcohol: 7 },
  },
  {
    id: 'primitivo', name: 'Primitivo', wine_color: 'dark_red',
    grapes: ['Primitivo'], region: 'Puglia, Italy',
    style_family: 'Bold and Fruit-Forward', wine_vector_type: 'new_world_bold_red',
    pronunciation: 'pree-MEE-tee-voh', pairing_note: 'Rich and jammy with a warming finish — built for grilled meats, hearty pasta, and strong cheeses.',
    flavors: ['blackberry jam', 'dried fig', 'black pepper'], foods: ['Grilled sausage', 'Beef stew', 'Pecorino'],
    price_range: '$10–20', source: 'manual',
    dimensions: { body: 8, acidity: 5.5, tannin: 6, sweetness: 2, oak: 5, alcohol: 7.5 },
  },
  {
    id: 'pinotage', name: 'Pinotage', wine_color: 'dark_red',
    grapes: ['Pinotage'], region: 'South Africa',
    style_family: 'Bold and Fruit-Forward', wine_vector_type: 'new_world_bold_red',
    pronunciation: 'PEE-noh-tahzh', pairing_note: 'Smoky and fruit-forward — pairs well with BBQ, grilled meats, and anything off the fire.',
    flavors: ['blackberry', 'smoke', 'coffee'], foods: ['BBQ', 'Braai', 'Grilled steak'],
    price_range: '$10–20', source: 'manual',
    dimensions: { body: 7.5, acidity: 6, tannin: 6.5, sweetness: 1, oak: 4, alcohol: 7 },
  },
  {
    id: 'mencia', name: 'Mencía', wine_color: 'light_red',
    grapes: ['Mencía'], region: 'Bierzo / Ribeira Sacra, Spain',
    style_family: 'Graceful and Earthy', wine_vector_type: 'elegant_terroir_red',
    pronunciation: 'MEN-thee-ah', pairing_note: 'Floral and mineral with a food-friendly structure — great with roast chicken, pork, and tapas.',
    flavors: ['cherry', 'violet', 'mineral'], foods: ['Roast pork', 'Tapas', 'Roast chicken'],
    price_range: '$12–25', source: 'manual',
    dimensions: { body: 5.5, acidity: 7.5, tannin: 5, sweetness: 1, oak: 2, alcohol: 5.5 },
  },
  {
    id: 'dolcetto', name: 'Dolcetto', wine_color: 'dark_red',
    grapes: ['Dolcetto'], region: 'Piedmont, Italy',
    style_family: 'Classic and Food-Friendly', wine_vector_type: 'old_world_elegant_red',
    pronunciation: 'dohl-CHET-toh', pairing_note: 'Low acid and soft tannins make it unusually food-flexible — great with pizza, antipasto, and casual Italian meals.',
    flavors: ['blackberry', 'licorice', 'bitter chocolate'], foods: ['Pizza', 'Antipasto', 'Pasta'],
    price_range: '$12–20', source: 'manual',
    dimensions: { body: 5.5, acidity: 5.5, tannin: 5.5, sweetness: 1, oak: 2, alcohol: 5.5 },
  },
  {
    id: 'mourvedre', name: 'Mourvèdre', wine_color: 'dark_red',
    grapes: ['Mourvèdre', 'Monastrell'], region: 'Southern Rhône, France / Jumilla, Spain',
    style_family: 'Rich and Savory', wine_vector_type: 'earthy_spice_red',
    pronunciation: 'moor-VEH-druh', pairing_note: 'Gamey and meaty with firm tannins — built for lamb, wild game, and hearty stews.',
    flavors: ['blackberry', 'meat', 'black olive'], foods: ['Lamb', 'Wild boar', 'Cassoulet'],
    price_range: '$12–25', source: 'manual',
    dimensions: { body: 8, acidity: 6, tannin: 7.5, sweetness: 1, oak: 4, alcohol: 7.5 },
  },
  {
    id: 'valpolicella', name: 'Valpolicella', wine_color: 'light_red',
    grapes: ['Corvina', 'Rondinella', 'Molinara'], region: 'Veneto, Italy',
    style_family: 'Classic and Food-Friendly', wine_vector_type: 'old_world_elegant_red',
    pronunciation: 'val-poh-lee-CHEL-lah', pairing_note: 'Light and tart with sour cherry fruit — perfect with pizza, pasta, and Italian-American food.',
    flavors: ['sour cherry', 'herbs', 'spice'], foods: ['Pizza', 'Pasta', 'Antipasto'],
    price_range: '$10–18', source: 'manual',
    dimensions: { body: 5, acidity: 7.5, tannin: 4, sweetness: 1, oak: 2, alcohol: 5 },
  },
  {
    id: 'cinsault', name: 'Cinsault', wine_color: 'light_red',
    grapes: ['Cinsault'], region: 'Southern France / South Africa',
    style_family: 'Light and Lively', wine_vector_type: 'light_fruity_red',
    pronunciation: 'san-SOH', pairing_note: 'Silky and fresh — excellent slightly chilled with charcuterie, grilled vegetables, and casual summer meals.',
    flavors: ['strawberry', 'red cherry', 'herbs'], foods: ['Charcuterie', 'Grilled vegetables', 'Salmon'],
    price_range: '$12–22', source: 'manual',
    dimensions: { body: 3.5, acidity: 7, tannin: 2.5, sweetness: 1, oak: 1, alcohol: 5 },
  },
];

// Main extraction
const content = fs.readFileSync(WINE_CARDS_PATH, 'utf8');

// Split into individual wine card blocks by finding each object in the array
// Each card starts with a line like: {  (after a comma or the array opening)
// We'll split on the pattern that starts each new wine: `  {\n    id:`
const blocks = content.split(/(?=\s*\{\s*\n\s*id:)/);

const wines = [];
for (const block of blocks) {
  const entry = buildWineEntry(block);
  if (entry) wines.push(entry);
}

// Merge supplemental wines (skip any whose id already exists from the app)
const existingIds = new Set(wines.map(w => w.id));
for (const w of SUPPLEMENTAL_WINES) {
  if (!existingIds.has(w.id)) wines.push(w);
}

// Sort: reds first, then whites, then rosé, then sparkling, then dessert
const colorOrder = ['light_red', 'dark_red', 'rose', 'white', 'sparkling', 'orange', 'dessert'];
wines.sort((a, b) => {
  const ai = colorOrder.indexOf(a.wine_color);
  const bi = colorOrder.indexOf(b.wine_color);
  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) || a.name.localeCompare(b.name);
});

const output = {
  generated: new Date().toISOString().split('T')[0],
  source: 'Extracted from Winedr app wineCards.ts. Supplemental wines scored from wine knowledge.',
  total_wines: wines.length,
  dimensions_scale: '1-10 (app wines converted from 0-100 stats; supplemental wines scored directly)',
  wines,
};

// Write to repo data folder
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
console.log(`Written: ${OUTPUT_PATH} (${wines.length} wines)`);

// Write to Drive project folder
try {
  fs.writeFileSync(DRIVE_OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Written: ${DRIVE_OUTPUT_PATH}`);
} catch (e) {
  console.log(`Drive write skipped: ${e.message}`);
}
