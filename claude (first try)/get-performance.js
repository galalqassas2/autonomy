const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function measurePerf() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Collect performance timing metrics via CDP
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');

  const navStart = Date.now();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const loadTime = Date.now() - navStart;

  const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  );
  const performanceEntries = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('navigation')[0]))
  );
  const paintEntries = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('paint')))
  );

  const lcp = await page.evaluate(() => {
    return new Promise(resolve => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry ? lastEntry.startTime : 0);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      setTimeout(() => resolve(0), 1000);
    });
  });

  const cls = await page.evaluate(() => {
    return new Promise(resolve => {
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => resolve(clsValue), 1000);
    });
  });

  console.log('Navigation Performance Metrics:');
  console.log('DOM Content Loaded:', performanceEntries.domContentLoadedEventEnd - performanceEntries.startTime, 'ms');
  console.log('Load Complete:', performanceEntries.loadEventEnd - performanceEntries.startTime, 'ms');
  console.log('Paints:', paintEntries);
  console.log('LCP (ms):', lcp);
  console.log('CLS:', cls);

  await browser.close();
}

measurePerf().catch(console.error);
