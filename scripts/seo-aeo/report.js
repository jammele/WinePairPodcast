import { CATEGORY_LABELS } from './rubric.js';

const COLORS = { green: '#2d7a3a', yellow: '#b07d00', red: '#c0392b' };
const BG     = { green: '#eaf5ec', yellow: '#fef9e7', red: '#fdf0ef' };

function levelColor(level) { return COLORS[level] || '#666'; }
function levelBg(level)    { return BG[level]    || '#f5f5f5'; }

function scoreRing(score, level, size = 64) {
  const r = size / 2 - 6;
  const circ = 2 * Math.PI * r;
  const pct = (score / 100) * circ;
  const color = levelColor(level);
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="flex-shrink:0">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#e5e5e5" stroke-width="6"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="6"
        stroke-dasharray="${pct} ${circ}" stroke-dashoffset="${circ * 0.25}"
        stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"/>
      <text x="${size/2}" y="${size/2}" text-anchor="middle" dominant-baseline="central"
        font-size="${size < 50 ? 11 : 15}" font-weight="700" fill="${color}">${score}</text>
    </svg>`;
}

function scoreBar(score, level) {
  return `<div style="display:flex;align-items:center;gap:8px;flex:1">
    <div style="flex:1;height:8px;background:#e5e5e5;border-radius:4px;overflow:hidden">
      <div style="width:${score}%;height:100%;background:${levelColor(level)};border-radius:4px"></div>
    </div>
    <span style="font-size:12px;font-weight:700;color:${levelColor(level)};width:28px;text-align:right">${score}</span>
  </div>`;
}

function lighthousePanel(lh) {
  if (!lh) return `<p style="color:#999;font-size:13px">Lighthouse data not available</p>`;
  const metrics = [
    { label: 'Performance',    value: lh.performance },
    { label: 'Accessibility',  value: lh.accessibility },
    { label: 'Best Practices', value: lh.bestPractices },
    { label: 'SEO',            value: lh.seo },
  ];
  return `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
    ${metrics.map(m => {
      const level = m.value >= 90 ? 'green' : m.value >= 50 ? 'yellow' : 'red';
      return `<div style="text-align:center;background:${levelBg(level)};border-radius:8px;padding:12px 8px">
        ${scoreRing(m.value, level, 52)}
        <div style="font-size:11px;color:#555;margin-top:6px;font-weight:600">${m.label}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function signalRow(s) {
  const recs = s.recommendation;
  return `
    <tr style="border-top:1px solid #f0f0f0">
      <td style="padding:8px 12px;font-size:13px;color:#333">${s.name}</td>
      <td style="padding:8px 12px">
        <span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;
          color:${levelColor(s.level)};background:${levelBg(s.level)}">${s.score}</span>
      </td>
      <td style="padding:8px 12px;font-size:12px;color:#555;max-width:240px">${s.value}</td>
      <td style="padding:8px 12px;font-size:12px;color:${recs ? '#8B4000' : '#999'}">${recs || '—'}</td>
    </tr>`;
}

function categorySection(key, cat) {
  const label = CATEGORY_LABELS[key];
  const id = `cat-${key}`;
  return `
    <div style="margin-bottom:8px;border:1px solid #e8e8e8;border-radius:8px;overflow:hidden">
      <button onclick="toggle('${id}')" style="width:100%;display:flex;align-items:center;gap:12px;padding:12px 16px;
        background:#fafafa;border:none;cursor:pointer;text-align:left">
        ${scoreRing(cat.score, cat.level, 40)}
        <span style="flex:1;font-size:14px;font-weight:600;color:#222">${label}</span>
        <span style="font-size:18px;color:#999" id="arrow-${id}">▾</span>
      </button>
      <div id="${id}" style="display:none">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:#f5f5f5">
              <th style="padding:6px 12px;font-size:11px;text-align:left;color:#777;font-weight:600">Signal</th>
              <th style="padding:6px 12px;font-size:11px;text-align:left;color:#777;font-weight:600">Score</th>
              <th style="padding:6px 12px;font-size:11px;text-align:left;color:#777;font-weight:600">Found</th>
              <th style="padding:6px 12px;font-size:11px;text-align:left;color:#777;font-weight:600">Recommendation</th>
            </tr>
          </thead>
          <tbody>${cat.signals.map(signalRow).join('')}</tbody>
        </table>
      </div>
    </div>`;
}

function allRecommendations(scores) {
  const recs = [];
  for (const [key, cat] of Object.entries(scores.categories)) {
    for (const s of cat.signals) {
      if (s.recommendation) {
        recs.push({ category: CATEGORY_LABELS[key], signal: s.name, rec: s.recommendation, score: s.score, level: s.level });
      }
    }
  }
  return recs.sort((a, b) => a.score - b.score);
}

function pageCard(result) {
  if (result.error) {
    return `
      <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:20px;margin-bottom:16px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:64px;height:64px;border-radius:50%;background:#fee;display:flex;align-items:center;justify-content:center;font-size:24px">✗</div>
          <div>
            <div style="font-size:16px;font-weight:700;color:#222">${result.name}</div>
            <div style="font-size:13px;color:#888">${result.url}</div>
            <div style="font-size:12px;color:#c0392b;margin-top:4px">Error: ${result.error}</div>
          </div>
        </div>
      </div>`;
  }

  const { scores, lighthouse: lh } = result;
  const recs = allRecommendations(scores);
  const topRecs = recs.slice(0, 5);
  const id = result.url.replace(/[^a-z0-9]/gi, '-');

  const catGrid = Object.entries(scores.categories).map(([key, cat]) => `
    <div style="text-align:center">
      ${scoreRing(cat.score, cat.level, 44)}
      <div style="font-size:10px;color:#666;margin-top:4px;max-width:70px;line-height:1.3">
        ${CATEGORY_LABELS[key].split(' ').slice(0, 2).join(' ')}
      </div>
    </div>`).join('');

  return `
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;margin-bottom:20px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05)">
      <div style="padding:20px 24px;border-bottom:1px solid #f0f0f0">
        <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
          ${scoreRing(scores.overallScore, scores.overallLevel, 72)}
          <div style="flex:1;min-width:200px">
            <div style="font-size:18px;font-weight:700;color:#222">${result.name}</div>
            <a href="${result.url}" style="font-size:13px;color:#722F37;text-decoration:none">${result.url}</a>
            <div style="font-size:12px;color:#888;margin-top:2px">Scanned ${new Date(result.timestamp).toLocaleString()}</div>
          </div>
          <div style="display:flex;gap:16px;flex-wrap:wrap">${catGrid}</div>
        </div>
      </div>

      ${topRecs.length > 0 ? `
        <div style="padding:16px 24px;background:#fffbf5;border-bottom:1px solid #f0f0f0">
          <div style="font-size:12px;font-weight:700;color:#b07d00;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">
            Top ${topRecs.length} Recommendations
          </div>
          ${topRecs.map(r => `
            <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px">
              <span style="flex-shrink:0;font-size:11px;font-weight:700;padding:2px 6px;border-radius:3px;
                color:${levelColor(r.level)};background:${levelBg(r.level)}">${r.score}</span>
              <span style="font-size:13px;color:#444">${r.rec}</span>
            </div>`).join('')}
        </div>` : `
        <div style="padding:14px 24px;background:#f0faf2">
          <span style="font-size:13px;color:#2d7a3a;font-weight:600">No critical issues found — this page is well-optimized.</span>
        </div>`}

      <div style="padding:16px 24px">
        <button onclick="toggle('lh-${id}')" style="font-size:13px;font-weight:600;color:#722F37;background:none;border:none;cursor:pointer;padding:0;margin-bottom:12px">
          ▾ Lighthouse Scores
        </button>
        <div id="lh-${id}">${lighthousePanel(lh)}</div>

        <button onclick="toggle('detail-${id}')" style="font-size:13px;font-weight:600;color:#722F37;background:none;border:none;cursor:pointer;padding:0;margin-top:16px">
          ▾ Full Signal Breakdown
        </button>
        <div id="detail-${id}" style="display:none;margin-top:12px">
          ${Object.entries(scores.categories).map(([key, cat]) => categorySection(key, cat)).join('')}
        </div>
      </div>
    </div>`;
}

function portfolioSummary(results) {
  const valid = results.filter(r => !r.error && r.scores);
  if (valid.length === 0) return '';

  const avgOverall = Math.round(valid.reduce((s, r) => s + r.scores.overallScore, 0) / valid.length);
  const avgLevel = avgOverall >= 70 ? 'green' : avgOverall >= 40 ? 'yellow' : 'red';

  const catAvgs = Object.keys(CATEGORY_LABELS).map(key => {
    const avg = Math.round(valid.reduce((s, r) => s + (r.scores.categories[key]?.score || 0), 0) / valid.length);
    const level = avg >= 70 ? 'green' : avg >= 40 ? 'yellow' : 'red';
    return { key, label: CATEGORY_LABELS[key], avg, level };
  });

  const worstPages = [...valid].sort((a, b) => a.scores.overallScore - b.scores.overallScore).slice(0, 3);
  const bestPages  = [...valid].sort((a, b) => b.scores.overallScore - a.scores.overallScore).slice(0, 3);

  return `
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:12px;padding:24px;margin-bottom:28px;box-shadow:0 2px 8px rgba(0,0,0,0.05)">
      <h2 style="font-size:16px;font-weight:700;color:#222;margin:0 0 20px">Portfolio Summary — ${valid.length} pages analyzed</h2>
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;margin-bottom:24px">
        <div style="text-align:center">
          ${scoreRing(avgOverall, avgLevel, 80)}
          <div style="font-size:12px;color:#666;margin-top:6px;font-weight:600">Overall Average</div>
        </div>
        <div style="flex:1;min-width:300px">
          ${catAvgs.map(c => `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
              <div style="width:180px;font-size:12px;color:#444;flex-shrink:0">${c.label}</div>
              ${scoreBar(c.avg, c.level)}
            </div>`).join('')}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div style="background:#fdf0ef;border-radius:8px;padding:14px">
          <div style="font-size:11px;font-weight:700;color:#c0392b;text-transform:uppercase;margin-bottom:8px">Needs Most Attention</div>
          ${worstPages.map(r => `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:13px;font-weight:700;color:${levelColor(r.scores.overallLevel)}">${r.scores.overallScore}</span>
              <span style="font-size:13px;color:#444">${r.name}</span>
            </div>`).join('')}
        </div>
        <div style="background:#eaf5ec;border-radius:8px;padding:14px">
          <div style="font-size:11px;font-weight:700;color:#2d7a3a;text-transform:uppercase;margin-bottom:8px">Best Performing</div>
          ${bestPages.map(r => `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <span style="font-size:13px;font-weight:700;color:${levelColor(r.scores.overallLevel)}">${r.scores.overallScore}</span>
              <span style="font-size:13px;color:#444">${r.name}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

export function generateReport(results, previousResults = null) {
  const scanDate = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SEO & AEO Report — The Wine Pair Podcast</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f4; color: #222; }
  a { color: #722F37; }
  h1 { font-size: 22px; font-weight: 800; }
  table { border-collapse: collapse; width: 100%; }
</style>
</head>
<body>

<div style="background:#722F37;color:#fff;padding:20px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
  <div>
    <h1>SEO & AEO Report</h1>
    <div style="font-size:13px;opacity:0.8;margin-top:4px">The Wine Pair Podcast · ${scanDate}</div>
  </div>
  <div style="font-size:12px;opacity:0.7">
    Green ≥ 70 · Yellow 40–69 · Red &lt; 40
  </div>
</div>

<div style="max-width:1000px;margin:0 auto;padding:28px 20px">

  ${portfolioSummary(results)}

  <h2 style="font-size:16px;font-weight:700;color:#333;margin-bottom:16px">Page-by-Page Results</h2>
  ${results.map(pageCard).join('')}

</div>

<script>
function toggle(id) {
  const el = document.getElementById(id);
  const arrow = document.getElementById('arrow-' + id);
  if (!el) return;
  const open = el.style.display !== 'none';
  el.style.display = open ? 'none' : 'block';
  if (arrow) arrow.textContent = open ? '▾' : '▴';
}
// Open Lighthouse panels by default
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[id^="lh-"]').forEach(el => { el.style.display = 'block'; });
});
</script>
</body>
</html>`;
}
