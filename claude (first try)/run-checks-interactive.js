const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, 'qa-screenshots');

async function runInteractiveTests() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {};

  // TEST 1: Header Scroll & Underline & Glass & Overlap
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    // Initial state
    const headerInitial = await page.evaluate(() => {
      const h = document.querySelector('header > div');
      const nav = document.querySelector('header nav');
      return {
        height: h.offsetHeight,
        scrolled: h.getAttribute('data-scrolled'),
        dark: h.getAttribute('data-dark'),
        navOpacity: getComputedStyle(nav).opacity
      };
    });

    // Scroll down 200px (past hero)
    await page.evaluate(() => window.scrollTo(0, 500));
    await new Promise(r => setTimeout(r, 400));

    const headerScrolled = await page.evaluate(() => {
      const h = document.querySelector('header > div');
      const nav = document.querySelector('header nav');
      const underline = document.querySelector('header nav span[aria-hidden="true"]');
      const activeLink = document.querySelector('header nav a[aria-current="true"]');
      const rectNav = nav.getBoundingClientRect();
      const rectUnderline = underline ? underline.getBoundingClientRect() : null;
      const rectHeader = h.getBoundingClientRect();
      return {
        height: h.offsetHeight,
        scrolled: h.getAttribute('data-scrolled'),
        dark: h.getAttribute('data-dark'),
        navOpacity: getComputedStyle(nav).opacity,
        activeChapter: activeLink ? activeLink.innerText : null,
        underlineTopRelativeToHeader: rectUnderline ? (rectUnderline.top - rectHeader.top) : null,
        headerHeight: rectHeader.height,
        isUnderlineVisible: rectUnderline ? (rectUnderline.top >= rectHeader.top && rectUnderline.bottom <= rectHeader.bottom) : false
      };
    });

    await page.screenshot({ path: path.join(OUT_DIR, 'header-scrolled-1440.png') });

    // Scroll over dark island (#watch-it-run)
    await page.evaluate(() => {
      const el = document.getElementById('watch-it-run');
      el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 400));

    const headerDarkIsland = await page.evaluate(() => {
      const h = document.querySelector('header > div');
      return {
        scrolled: h.getAttribute('data-scrolled'),
        dark: h.getAttribute('data-dark'),
        color: getComputedStyle(h).color
      };
    });

    await page.screenshot({ path: path.join(OUT_DIR, 'header-dark-island-1440.png') });

    results.header = { headerInitial, headerScrolled, headerDarkIsland };
    await page.close();
  }

  // TEST 2: Question 2 - Hero Canvas Proportion at 1440px & 1920px
  {
    const page = await browser.newPage();
    
    // 1440px
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });
    const hero1440 = await page.evaluate(() => {
      const colLeft = document.querySelector('#hero .shell > div > div:first-child');
      const colRight = document.querySelector('#hero .shell > div > div:last-child');
      const canvasCard = colRight.querySelector('.card-light') || colRight.firstElementChild;
      return {
        colLeftRect: colLeft.getBoundingClientRect(),
        colRightRect: colRight.getBoundingClientRect(),
        canvasCardRect: canvasCard ? canvasCard.getBoundingClientRect() : null
      };
    });
    await page.screenshot({ path: path.join(OUT_DIR, 'hero-1440.png') });

    // 1920px
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(URL, { waitUntil: 'networkidle0' });
    const hero1920 = await page.evaluate(() => {
      const colLeft = document.querySelector('#hero .shell > div > div:first-child');
      const colRight = document.querySelector('#hero .shell > div > div:last-child');
      const canvasCard = colRight.querySelector('.card-light') || colRight.firstElementChild;
      return {
        colLeftRect: colLeft.getBoundingClientRect(),
        colRightRect: colRight.getBoundingClientRect(),
        canvasCardRect: canvasCard ? canvasCard.getBoundingClientRect() : null
      };
    });
    await page.screenshot({ path: path.join(OUT_DIR, 'hero-1920.png') });

    results.heroProportions = { hero1440, hero1920 };
    await page.close();
  }

  // TEST 3: Automation Stage (Block 3) - Auto play, Captions, Replay, Run Log, KineticGrid
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    // Scroll to #watch-it-run
    await page.evaluate(() => {
      document.getElementById('watch-it-run').scrollIntoView({ block: 'center' });
    });
    await new Promise(r => setTimeout(r, 600));

    // Capture captions over time
    const captionTimeline = [];
    const startTime = Date.now();
    for (let i = 0; i < 9; i++) {
      const capInfo = await page.evaluate(() => {
        const p = document.querySelector('#watch-it-run p.t-heading-md');
        const logLines = Array.from(document.querySelectorAll('#watch-it-run .t-mono')).map(el => el.innerText);
        const glowingNodes = document.querySelectorAll('#watch-it-run [data-glowing="true"], #watch-it-run .glow-edge, #watch-it-run .shadow-glow-edge').length;
        const totalText = document.querySelector('#watch-it-run .tabular')?.innerText;
        return {
          caption: p ? p.innerText : null,
          logLinesCount: logLines.length,
          totalText,
          glowingNodes
        };
      });
      captionTimeline.push({ elapsedMs: Date.now() - startTime, capInfo });
      await new Promise(r => setTimeout(r, 1000));
    }

    await page.screenshot({ path: path.join(OUT_DIR, 'automation-stage-complete.png') });

    // Check Replay button click
    const replayExists = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('#watch-it-run button')).find(b => b.innerText.includes('Replay'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    await new Promise(r => setTimeout(r, 500));
    const postReplayCaption = await page.evaluate(() => {
      return document.querySelector('#watch-it-run p.t-heading-md')?.innerText;
    });

    results.automationStage = { captionTimeline, replayExists, postReplayCaption };
    await page.close();
  }

  // TEST 4: Department Selector (Block 4) & Support tab Conversation Player
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    await page.evaluate(() => document.getElementById('departments').scrollIntoView());
    await new Promise(r => setTimeout(r, 400));

    // Click each tab
    const tabs = ['finance', 'sales', 'operations', 'support', 'hr'];
    const tabResults = [];

    for (const tabId of tabs) {
      await page.evaluate((id) => {
        const btn = document.querySelector(`[aria-controls="department-panel"][role="tab"]:nth-child(${['finance','sales','operations','support','hr'].indexOf(id)+1})`);
        if (btn) btn.click();
      }, tabId);
      await new Promise(r => setTimeout(r, 400));

      const tabState = await page.evaluate(() => {
        const panel = document.getElementById('department-panel');
        return {
          panelHeight: panel.offsetHeight,
          text: panel.querySelector('.t-display-md')?.innerText,
          hasFlowCanvas: Boolean(panel.querySelector('canvas') || panel.querySelector('.relative')),
          hasConversationPlayer: Boolean(panel.querySelector('[data-conversation-player]')) || panel.innerText.includes('support')
        };
      });
      tabResults.push({ tabId, tabState });
      await page.screenshot({ path: path.join(OUT_DIR, `dept-tab-${tabId}.png`) });
    }

    results.departmentSelector = tabResults;
    await page.close();
  }

  // TEST 5: Time Calculator (Block 6) Sliders & Week Grid
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    await page.evaluate(() => document.getElementById('your-time').scrollIntoView());
    await new Promise(r => setTimeout(r, 400));

    const initialCalc = await page.evaluate(() => {
      const res = document.querySelector('#your-time');
      return {
        text: res.innerText.slice(0, 300)
      };
    });

    // Check sliders aria labels and valuetext
    const sliderInfo = await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('#your-time input[type="range"], #your-time [role="slider"]'));
      return sliders.map(s => ({
        ariaLabel: s.getAttribute('aria-label'),
        ariaValuetext: s.getAttribute('aria-valuetext'),
        val: s.value || s.getAttribute('aria-valuenow')
      }));
    });

    await page.screenshot({ path: path.join(OUT_DIR, 'time-calculator-1440.png') });

    results.timeCalculator = { initialCalc, sliderInfo };
    await page.close();
  }

  // TEST 6: Marquee Search & Tooltip
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    await page.evaluate(() => document.getElementById('what-we-connect').scrollIntoView());
    await new Promise(r => setTimeout(r, 400));

    // Search query
    await page.type('#what-we-connect input[type="search"]', 'Slack');
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUT_DIR, 'marquee-search-slack.png') });

    const searchState = await page.evaluate(() => {
      const matchText = document.querySelector('#what-we-connect p[aria-live="polite"]')?.innerText;
      const count = document.querySelectorAll('#what-we-connect ul.flex-wrap li').length;
      return { matchText, count };
    });

    // Clear search
    await page.click('#what-we-connect button[aria-label="Clear search"]');
    await new Promise(r => setTimeout(r, 300));

    results.marquee = { searchState };
    await page.close();
  }

  // TEST 7: FAQ Accordion
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    await page.evaluate(() => document.getElementById('faq').scrollIntoView());
    await new Promise(r => setTimeout(r, 400));

    // Click 1st accordion item
    await page.evaluate(() => {
      const btn = document.querySelector('#faq button');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUT_DIR, 'faq-item-1-open.png') });

    // Click 2nd accordion item
    await page.evaluate(() => {
      const btns = document.querySelectorAll('#faq button');
      if (btns[1]) btns[1].click();
    });
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUT_DIR, 'faq-item-2-open.png') });

    const faqState = await page.evaluate(() => {
      const openPanels = document.querySelectorAll('#faq [data-state="open"]');
      return { openCount: openPanels.length };
    });

    results.faq = { faqState };
    await page.close();
  }

  // TEST 8: Reduced Motion Check
  {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    const rmState = await page.evaluate(() => {
      const marqueeTrack = document.querySelector('.marquee-track');
      const kineticGrid = document.querySelector('canvas');
      const replayBtn = Array.from(document.querySelectorAll('#watch-it-run button')).find(b => b.innerText.includes('Replay'));
      return {
        marqueeAnimation: marqueeTrack ? getComputedStyle(marqueeTrack).animationName : null,
        hasKineticCanvas: Boolean(kineticGrid),
        replayVisible: Boolean(replayBtn && getComputedStyle(replayBtn).display !== 'none')
      };
    });

    await page.screenshot({ path: path.join(OUT_DIR, 'reduced-motion.png') });
    results.reducedMotion = rmState;
    await page.close();
  }

  // TEST 9: KineticGrid Mount locations check
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    const kineticLocations = await page.evaluate(() => {
      const mounts = Array.from(document.querySelectorAll('[data-kinetic-grid], canvas'));
      return mounts.map(m => {
        let parent = m.parentElement;
        while (parent && !parent.id && parent.tagName !== 'SECTION' && parent.tagName !== 'MAIN') {
          parent = parent.parentElement;
        }
        return {
          tag: m.tagName,
          id: parent ? parent.id : null,
          sectionClass: parent ? parent.className : null
        };
      });
    });

    results.kineticGridLocations = kineticLocations;
    await page.close();
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'interactive-results.json'),
    JSON.stringify(results, null, 2)
  );

  await browser.close();
  console.log('Interactive tests complete.');
}

runInteractiveTests().catch(console.error);
