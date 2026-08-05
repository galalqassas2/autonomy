const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, 'qa-screenshots');

async function runScratchQA() {
  console.log('Starting visual QA runner from scratch...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Track console messages and page errors
  const consoleLogs = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    }
  });
  page.on('pageerror', err => {
    consoleLogs.push({ type: 'pageerror', text: err.message });
  });

  console.log('Navigating to', URL);
  await page.goto(URL, { waitUntil: 'networkidle0' });

  // 1. Capture 6 Viewport Full Page Screenshots
  const viewports = [320, 375, 768, 1024, 1440, 1920];
  for (const w of viewports) {
    console.log(`Capturing viewport ${w}x900...`);
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(OUT_DIR, `vp-${w}.png`),
      fullPage: true
    });
  }

  // 2. Set viewport to 1440 for detailed component and interaction captures
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0' });

  const auditData = {};

  // DOM Structure and Computed Styles Audit
  console.log('Auditing DOM structure and computed styles...');
  auditData.domAudit = await page.evaluate(() => {
    const results = {};

    // 1. H1 Count
    results.h1Count = document.querySelectorAll('h1').length;

    // 2. Icon Plates Audit
    const iconPlates = Array.from(document.querySelectorAll('.icon-plate'));
    results.iconPlateCount = iconPlates.length;
    results.iconPlatesDetail = iconPlates.map((p, idx) => {
      const rect = p.getBoundingClientRect();
      const style = getComputedStyle(p);
      const parent = p.closest('section') || p.closest('header') || p.closest('main') || p.parentElement;
      const svg = p.querySelector('svg');
      return {
        index: idx,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        borderRadius: style.borderRadius,
        border: style.border,
        parentSectionId: parent ? (parent.id || parent.className) : 'unknown',
        className: p.className,
        svgSize: svg ? {
          w: Math.round(svg.getBoundingClientRect().width),
          h: Math.round(svg.getBoundingClientRect().height)
        } : null
      };
    });

    // 3. Tool Tiles Audit
    results.toolTileCount = document.querySelectorAll('.tool-tile').length;

    // 4. Dash Banned Characters Check
    const bodyText = document.body.innerText;
    results.emDashCount = (bodyText.match(/—/g) || []).length;
    results.enDashCount = (bodyText.match(/–/g) || []).length;

    // 5. Typography Font Weights & Letter Spacing
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, .t-display-xxl, .t-display-xl, .t-display-lg, .t-display-md'));
    results.headingsCount = headings.length;
    results.headingsDetail = headings.map(h => {
      const cs = getComputedStyle(h);
      return {
        tag: h.tagName,
        text: h.innerText.trim().slice(0, 35),
        fontWeight: cs.fontWeight,
        fontSize: cs.fontSize,
        letterSpacing: cs.letterSpacing,
        lineHeight: cs.lineHeight
      };
    });
    results.invalidHeadingWeights = results.headingsDetail.filter(h => parseInt(h.fontWeight) >= 600);

    // 6. Buttons Styling, Colors, and Radii
    const buttons = Array.from(document.querySelectorAll('.btn, button, a.btn, a[role="button"]'));
    results.buttonsCount = buttons.length;
    results.buttonsDetail = buttons.map(b => {
      const cs = getComputedStyle(b);
      return {
        text: b.innerText.trim().slice(0, 30),
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        height: cs.height,
        className: b.className
      };
    });

    // Green buttons specific check
    const greenButtons = buttons.filter(b => {
      const cs = getComputedStyle(b);
      return cs.backgroundColor.includes('62, 207, 142') || cs.backgroundColor.includes('36, 180, 126') || b.classList.contains('btn-primary');
    });
    results.greenButtonsDetail = greenButtons.map(b => {
      const cs = getComputedStyle(b);
      return {
        text: b.innerText.trim(),
        textColor: cs.color,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius
      };
    });

    // 7. Sections Backgrounds (Dark Islands vs White Track)
    const sections = Array.from(document.querySelectorAll('main > section'));
    results.sectionsBackground = sections.map((sec, idx) => {
      const cs = getComputedStyle(sec);
      return {
        index: idx,
        id: sec.id || `section-${idx}`,
        backgroundColor: cs.backgroundColor,
        className: sec.className
      };
    });

    // 8. KineticGrid Mount Locations
    const kineticMounts = Array.from(document.querySelectorAll('[data-kinetic-grid], canvas'));
    results.kineticMountsLocation = kineticMounts.map(m => {
      const sec = m.closest('section');
      return {
        tagName: m.tagName,
        sectionId: sec ? sec.id : 'none',
        sectionClass: sec ? sec.className : 'none'
      };
    });

    // 9. HoverButton Locations
    const hoverButtons = Array.from(document.querySelectorAll('button, a')).filter(el => {
      return el.className.includes('bg-white/[0.04]') || el.className.includes('backdrop-blur-lg') || (el.innerText.includes('Run') && el.closest('#watch-it-run'));
    });
    results.hoverButtonsLocation = hoverButtons.map(hb => {
      const sec = hb.closest('section');
      return {
        text: hb.innerText.trim(),
        sectionId: sec ? sec.id : 'none',
        disabled: hb.hasAttribute('disabled') || hb.getAttribute('aria-disabled') === 'true' || hb.className.includes('opacity-50')
      };
    });

    return results;
  });

  // 3. Detailed Component & Section Captures + Interactive Scenarios
  console.log('Testing Header behavior...');
  // Header initial (scroll 0)
  auditData.headerInitial = await page.evaluate(() => {
    const h = document.querySelector('header > div');
    const nav = document.querySelector('header nav');
    return {
      height: h.offsetHeight,
      scrolled: h.getAttribute('data-scrolled'),
      dark: h.getAttribute('data-dark'),
      navOpacity: getComputedStyle(nav).opacity
    };
  });

  // Scroll down 250px (partway through hero)
  await page.evaluate(() => window.scrollTo(0, 250));
  await new Promise(r => setTimeout(r, 400));
  auditData.headerScrolled250 = await page.evaluate(() => {
    const h = document.querySelector('header > div');
    const nav = document.querySelector('header nav');
    return {
      height: h.offsetHeight,
      scrolled: h.getAttribute('data-scrolled'),
      dark: h.getAttribute('data-dark'),
      navOpacity: getComputedStyle(nav).opacity
    };
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'header-scrolled-250.png') });

  // Scroll down 800px (past hero)
  await page.evaluate(() => window.scrollTo(0, 800));
  await new Promise(r => setTimeout(r, 400));
  auditData.headerScrolled800 = await page.evaluate(() => {
    const h = document.querySelector('header > div');
    const nav = document.querySelector('header nav');
    const activeLink = nav.querySelector('a[aria-current="true"]');
    const underline = nav.querySelector('span[aria-hidden="true"]');
    return {
      height: h.offsetHeight,
      scrolled: h.getAttribute('data-scrolled'),
      dark: h.getAttribute('data-dark'),
      navOpacity: getComputedStyle(nav).opacity,
      activeChapter: activeLink ? activeLink.innerText : null,
      underlineStyle: underline ? underline.getAttribute('style') : null
    };
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'header-scrolled-800.png') });

  // Scroll over dark island (#watch-it-run)
  await page.evaluate(() => document.getElementById('watch-it-run').scrollIntoView());
  await new Promise(r => setTimeout(r, 400));
  auditData.headerDarkIsland = await page.evaluate(() => {
    const h = document.querySelector('header > div');
    return {
      scrolled: h.getAttribute('data-scrolled'),
      dark: h.getAttribute('data-dark'),
      color: getComputedStyle(h).color
    };
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'header-dark-island.png') });

  // 4. Hero Proportions at 1440px and 1920px (Question 2)
  console.log('Testing Hero proportions at 1440px & 1920px...');
  const measureHero = async (w) => {
    await page.setViewport({ width: w, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 300));
    const metrics = await page.evaluate(() => {
      const hero = document.getElementById('hero');
      const colLeft = hero.querySelector('.shell > div > div:first-child');
      const colRight = hero.querySelector('.shell > div > div:last-child');
      const card = colRight.querySelector('.card-light');
      const svg = card ? card.querySelector('svg') : null;
      return {
        viewportWidth: window.innerWidth,
        heroWidth: hero.offsetWidth,
        heroHeight: hero.offsetHeight,
        leftColWidth: colLeft ? colLeft.offsetWidth : 0,
        rightColWidth: colRight ? colRight.offsetWidth : 0,
        cardWidth: card ? card.offsetWidth : 0,
        cardHeight: card ? card.offsetHeight : 0,
        canvasSvgWidth: svg ? svg.getBoundingClientRect().width : 0,
        canvasSvgHeight: svg ? svg.getBoundingClientRect().height : 0
      };
    });
    await page.screenshot({ path: path.join(OUT_DIR, `hero-proportion-${w}.png`) });
    return metrics;
  };

  auditData.hero1440Metrics = await measureHero(1440);
  auditData.hero1920Metrics = await measureHero(1920);

  // Set back to 1440px
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });

  // 5. Automation Stage (Block 3) Timeline and Controls
  console.log('Testing Automation Stage execution...');
  await page.evaluate(() => document.getElementById('watch-it-run').scrollIntoView({ block: 'center' }));
  await new Promise(r => setTimeout(r, 500));

  const timeline = [];
  const startT = Date.now();
  for (let i = 0; i < 9; i++) {
    const snap = await page.evaluate(() => {
      const caption = document.querySelector('#watch-it-run p.t-heading-md')?.innerText;
      const logLines = Array.from(document.querySelectorAll('#watch-it-run .t-mono')).map(el => el.innerText);
      const totalTimeText = document.querySelector('#watch-it-run .tabular')?.innerText;
      const replayBtn = Array.from(document.querySelectorAll('#watch-it-run button')).find(b => b.innerText.includes('Replay'));
      return {
        caption,
        logLineCount: logLines.length,
        totalTimeText,
        hasReplayBtn: Boolean(replayBtn)
      };
    });
    timeline.push({ timeMs: Date.now() - startT, snap });
    await new Promise(r => setTimeout(r, 900));
  }
  auditData.automationTimeline = timeline;
  await page.screenshot({ path: path.join(OUT_DIR, 'automation-stage-complete.png') });

  // 6. Department Selector (Block 4) Tab Height & Layout Shift Test
  console.log('Testing Department Selector tab switching...');
  await page.evaluate(() => document.getElementById('departments').scrollIntoView());
  await new Promise(r => setTimeout(r, 400));

  const deptTabs = ['finance', 'sales', 'operations', 'support', 'hr'];
  const deptResults = [];
  for (const tabId of deptTabs) {
    await page.evaluate((id) => {
      const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
      const target = tabs.find(t => t.innerText.toLowerCase().includes(id));
      if (target) target.click();
    }, tabId);
    await new Promise(r => setTimeout(r, 350));

    const panelMetrics = await page.evaluate(() => {
      const panel = document.getElementById('department-panel');
      return {
        panelHeight: panel.offsetHeight,
        panelScrollHeight: panel.scrollHeight,
        headingText: panel.querySelector('.t-display-md')?.innerText,
        hasConversationPlayer: panel.innerText.toLowerCase().includes('forty questions') || Boolean(panel.querySelector('[data-conversation-player]'))
      };
    });
    deptResults.push({ tabId, panelMetrics });
    await page.screenshot({ path: path.join(OUT_DIR, `dept-tab-${tabId}.png`) });
  }
  auditData.departmentSelectorHeights = deptResults;

  // 7. Time Calculator (Block 6) Test
  console.log('Testing Time Calculator sliders and hourly rate input...');
  await page.evaluate(() => document.getElementById('your-time').scrollIntoView());
  await new Promise(r => setTimeout(r, 400));

  // Check state with empty rate
  const calcStateInitial = await page.evaluate(() => {
    const sec = document.getElementById('your-time');
    const costPerYearResult = sec.innerText.includes('cost per year');
    return { costPerYearResultVisible: costPerYearResult };
  });

  // Type hourly cost "45"
  await page.type('#your-time input[placeholder*="blank"]', '45');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUT_DIR, 'time-calculator-with-rate.png') });

  const calcStateWithRate = await page.evaluate(() => {
    const sec = document.getElementById('your-time');
    const costPerYearResult = sec.innerText.includes('cost per year');
    const resultText = sec.querySelector('.grid.gap-8')?.innerText;
    return { costPerYearResultVisible: costPerYearResult, resultText };
  });

  auditData.timeCalculatorTest = { calcStateInitial, calcStateWithRate };

  // 8. Integration Marquee (Block 8) Search and Tooltips
  console.log('Testing Integration Marquee search...');
  await page.evaluate(() => document.getElementById('what-we-connect').scrollIntoView());
  await new Promise(r => setTimeout(r, 400));

  await page.type('#what-we-connect input[type="search"]', 'Jira');
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUT_DIR, 'marquee-search-jira.png') });

  auditData.marqueeSearch = await page.evaluate(() => {
    const countText = document.querySelector('#what-we-connect p[aria-live="polite"]')?.innerText;
    const tilesCount = document.querySelectorAll('#what-we-connect ul.flex-wrap li').length;
    return { countText, tilesCount };
  });

  await page.click('#what-we-connect button[aria-label="Clear search"]');
  await new Promise(r => setTimeout(r, 300));

  // 9. FAQ Accordion (Block 13) Test
  console.log('Testing FAQ accordion...');
  await page.evaluate(() => document.getElementById('faq').scrollIntoView());
  await new Promise(r => setTimeout(r, 400));

  // Open item 1
  await page.evaluate(() => {
    const btns = document.querySelectorAll('#faq button');
    if (btns[1]) btns[1].click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUT_DIR, 'faq-item-1-open.png') });

  auditData.faqTest = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('#faq button'));
    return buttons.map((b, idx) => ({
      index: idx,
      question: b.innerText.trim(),
      expanded: b.getAttribute('aria-expanded') === 'true'
    }));
  });

  // 10. Reduced Motion Test
  console.log('Testing Reduced Motion state...');
  const rmPage = await browser.newPage();
  await rmPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await rmPage.setViewport({ width: 1440, height: 900 });
  await rmPage.goto(URL, { waitUntil: 'networkidle0' });

  auditData.reducedMotionTest = await rmPage.evaluate(() => {
    const marqueeTrack = document.querySelector('.marquee-track');
    const kineticCanvas = document.querySelector('#watch-it-run canvas');
    const replayBtn = Array.from(document.querySelectorAll('#watch-it-run button')).find(b => b.innerText.includes('Replay'));
    return {
      marqueeAnimation: marqueeTrack ? getComputedStyle(marqueeTrack).animationName : null,
      kineticCanvasMounted: Boolean(kineticCanvas),
      replayBtnVisible: Boolean(replayBtn && getComputedStyle(replayBtn).display !== 'none')
    };
  });
  await rmPage.screenshot({ path: path.join(OUT_DIR, 'reduced-motion.png') });
  await rmPage.close();

  // Save audit data to JSON
  fs.writeFileSync(
    path.join(OUT_DIR, 'scratch-audit-results.json'),
    JSON.stringify({ consoleLogs, auditData }, null, 2)
  );

  await browser.close();
  console.log('Visual QA runner from scratch completed successfully.');
}

runScratchQA().catch(console.error);
