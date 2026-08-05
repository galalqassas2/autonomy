const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, 'qa-screenshots');

async function runLhMetrics() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const navStart = performance.now();
  await page.goto(URL, { waitUntil: 'networkidle0' });
  const loadMs = performance.now() - navStart;

  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paints = performance.getEntriesByType('paint');
    return {
      domContentLoaded: nav ? nav.domContentLoadedEventEnd : 0,
      loadEventEnd: nav ? nav.loadEventEnd : 0,
      paints: paints.map(p => ({ name: p.name, startTime: p.startTime }))
    };
  });

  // Measure LCP
  const lcpMs = await page.evaluate(() => {
    return new Promise(resolve => {
      let lcp = 0;
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        if (entries.length > 0) lcp = entries[entries.length - 1].startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve(lcp), 800);
    });
  });

  // Measure CLS
  const clsVal = await page.evaluate(() => {
    return new Promise(resolve => {
      let cls = 0;
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => resolve(cls), 800);
    });
  });

  const report = {
    loadMs,
    timing,
    lcpMs,
    clsVal
  };

  fs.writeFileSync(path.join(OUT_DIR, 'fresh-perf-report.json'), JSON.stringify(report, null, 2));
  await browser.close();
  console.log('Fresh perf metrics collected.');
}

runLhMetrics().catch(console.error);
