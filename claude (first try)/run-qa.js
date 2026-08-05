const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, 'qa-screenshots');

async function run() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test Console logs
  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    }
  });

  page.on('pageerror', err => {
    consoleMessages.push({ type: 'pageerror', text: err.message });
  });

  console.log('Navigating to', URL);
  await page.goto(URL, { waitUntil: 'networkidle0' });

  // Check 6 viewports
  const viewports = [320, 375, 768, 1024, 1440, 1920];
  for (const w of viewports) {
    console.log(`Setting viewport ${w}x900...`);
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(OUT_DIR, `vp-${w}.png`),
      fullPage: true
    });
  }

  // Set back to 1440 for detailed inspection
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0' });

  // Section screenshots
  const sections = [
    { name: 'header', sel: 'header' },
    { name: 'hero', sel: '#hero' },
    { name: 'trust-strip', sel: 'main > section:nth-of-type(2)' }, // block 2
    { name: 'automation-stage', sel: '#watch-it-run' },
    { name: 'departments', sel: '#departments' },
    { name: 'the-work', sel: '#the-work' },
    { name: 'your-time', sel: '#your-time' },
    { name: 'the-build', sel: '#the-build' },
    { name: 'what-we-connect', sel: '#what-we-connect' },
    { name: 'the-choice', sel: 'main > section:nth-of-type(9)' }, // Block 10
    { name: 'your-data', sel: '#your-data' },
    { name: 'faq', sel: '#faq' },
    { name: 'start', sel: '#start' },
    { name: 'footer', sel: 'footer' }
  ];

  for (const sec of sections) {
    try {
      const el = await page.$(sec.sel);
      if (el) {
        await el.screenshot({ path: path.join(OUT_DIR, `section-${sec.name}.png`) });
      } else {
        console.log(`Could not find selector for ${sec.name}: ${sec.sel}`);
      }
    } catch (e) {
      console.log(`Error taking screenshot for ${sec.name}:`, e.message);
    }
  }

  // Programmatic checks on the page
  const pageAudit = await page.evaluate(() => {
    const results = {};

    // Check h1 count
    const h1s = document.querySelectorAll('h1');
    results.h1Count = h1s.length;

    // Check icon plates
    const iconPlates = document.querySelectorAll('.icon-plate');
    results.iconPlateCount = iconPlates.length;

    // Check tool tiles
    const toolTiles = document.querySelectorAll('.tool-tile');
    results.toolTileCount = toolTiles.length;

    // Em-dashes check
    const textContent = document.body.innerText;
    results.hasEmDash = textContent.includes('—');
    results.hasEnDash = textContent.includes('–');

    // Check dark islands background colors
    const islandWatchRun = document.querySelector('#watch-it-run');
    const islandMarquee = document.querySelector('#what-we-connect');
    const islandTrust = document.querySelector('#your-data');

    const getBg = (el) => el ? getComputedStyle(el).backgroundColor : null;
    results.islandsBg = {
      watchRun: getBg(islandWatchRun),
      marquee: getBg(islandMarquee),
      trust: getBg(islandTrust)
    };

    // Check section backgrounds across all main sections
    const sections = Array.from(document.querySelectorAll('main > section'));
    results.sectionsBg = sections.map((sec, idx) => ({
      index: idx,
      id: sec.id || `section-${idx}`,
      bg: getComputedStyle(sec).backgroundColor,
      class: sec.className
    }));

    // Check green buttons styling
    const buttons = Array.from(document.querySelectorAll('.btn-primary, button.bg-\\[\\#3ecf8e\\], a.bg-\\[\\#3ecf8e\\]'));
    results.greenButtons = buttons.map(b => {
      const style = getComputedStyle(b);
      return {
        text: b.innerText.trim(),
        color: style.color,
        bg: style.backgroundColor,
        borderRadius: style.borderRadius
      };
    });

    // Check all button radii across site
    const allButtons = Array.from(document.querySelectorAll('.btn, button, a[role="button"]'));
    results.buttonRadii = allButtons.map(b => ({
      text: b.innerText.trim().slice(0, 20),
      borderRadius: getComputedStyle(b).borderRadius,
      className: b.className
    }));

    // Check typography weights on headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, .t-display-xxl, .t-display-xl, .t-display-lg, .t-display-md'));
    results.headingWeights = headings.map(h => ({
      tag: h.tagName,
      text: h.innerText.trim().slice(0, 30),
      weight: getComputedStyle(h).fontWeight,
      letterSpacing: getComputedStyle(h).letterSpacing
    }));

    // Check for orphaned words in headings
    results.orphanedHeadings = headings.map(h => {
      const words = h.innerText.trim().split(/\s+/);
      const isOrphan = words.length > 1 && words[words.length - 1].length < 10; 
      // check if last line has only 1 word via clientRects if possible or simple line break check
      return {
        text: h.innerText.trim(),
        wordCount: words.length
      };
    });

    // Check icon plate dimensions and styling
    results.iconPlatesDetail = Array.from(iconPlates).map(p => {
      const rect = p.getBoundingClientRect();
      const style = getComputedStyle(p);
      return {
        width: rect.width,
        height: rect.height,
        borderRadius: style.borderRadius,
        border: style.border,
        svgSize: p.querySelector('svg') ? {
          w: p.querySelector('svg').getBoundingClientRect().width,
          h: p.querySelector('svg').getBoundingClientRect().height
        } : null
      };
    });

    return results;
  });

  console.log('Audit Results:', JSON.stringify(pageAudit, null, 2));

  fs.writeFileSync(
    path.join(OUT_DIR, 'audit-results.json'),
    JSON.stringify({ consoleMessages, pageAudit }, null, 2)
  );

  await browser.close();
  console.log('Done script run.');
}

run().catch(console.error);
