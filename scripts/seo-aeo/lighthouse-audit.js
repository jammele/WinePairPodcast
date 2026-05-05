import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

export async function runLighthouse(url) {
  let chrome;
  try {
    chrome = await launch({ chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'] });

    const result = await lighthouse(url, {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
    });

    const cats = result.lhr.categories;
    return {
      performance:    Math.round((cats.performance?.score   ?? 0) * 100),
      accessibility:  Math.round((cats.accessibility?.score ?? 0) * 100),
      bestPractices:  Math.round((cats['best-practices']?.score ?? 0) * 100),
      seo:            Math.round((cats.seo?.score ?? 0) * 100),
      fetchTime:      result.lhr.timing?.total ? Math.round(result.lhr.timing.total) : null,
    };
  } finally {
    if (chrome) await chrome.kill();
  }
}
