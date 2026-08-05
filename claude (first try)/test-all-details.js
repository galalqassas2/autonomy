const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, 'qa-screenshots');

async function runDetailedChecks() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0' });

  const audit = {};

  // 1. Question 2: Hero Canvas Proportion at 1440 & 1920
  {
    const measureHero = async (width) => {
      await page.setViewport({ width, height: 900 });
      await new Promise(r => setTimeout(r, 200));
      return page.evaluate(() => {
        const heroSec = document.getElementById('hero');
        const colLeft = heroSec.querySelector('.shell > div > div:first-child');
        const colRight = heroSec.querySelector('.shell > div > div:last-child');
        const card = colRight.querySelector('.card-light');
        const canvasSvg = card ? card.querySelector('svg') : null;

        return {
          viewportW: window.innerWidth,
          heroW: heroSec.offsetWidth,
          colLeftW: colLeft ? colLeft.offsetWidth : 0,
          colRightW: colRight ? colRight.offsetWidth : 0,
          cardW: card ? card.offsetWidth : 0,
          cardH: card ? card.offsetHeight : 0,
          canvasSvgW: canvasSvg ? canvasSvg.getBoundingClientRect().width : 0,
          canvasSvgH: canvasSvg ? canvasSvg.getBoundingClientRect().height : 0
        };
      });
    };

    audit.hero1440 = await measureHero(1440);
    audit.hero1920 = await measureHero(1920);
  }

  // Set back to 1440
  await page.setViewport({ width: 1440, height: 900 });

  // 2. Question 1: Trust Chapter Pillars vs Promises vs Tiles
  audit.trustChapter = await page.evaluate(() => {
    const sec = document.getElementById('your-data');
    const pillars = Array.from(sec.querySelectorAll('ul:first-of-type li')).map(li => li.innerText.replace(/\n/g, ' - '));
    const promises = Array.from(sec.querySelectorAll('dl dt')).map(dt => dt.innerText);
    const tiles = Array.from(sec.querySelectorAll('ul:last-of-type li')).map(li => li.innerText.replace(/\n/g, ' - '));
    return { pillars, promises, tiles };
  });

  // 3. Canvas Zoom Interaction Checklist Tests
  {
    await page.evaluate(() => document.getElementById('watch-it-run').scrollIntoView());
    await new Promise(r => setTimeout(r, 400));

    // Test wheel over canvas without Ctrl (should not prevent default, page should scroll)
    const wheelScrollTest = await page.evaluate(() => {
      const frame = document.querySelector('#watch-it-run [tabindex="0"], #watch-it-run .overflow-hidden');
      let prevented = false;
      const handler = (e) => { if (e.defaultPrevented) prevented = true; };
      window.addEventListener('wheel', handler, { capture: true });
      
      const evt = new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });
      frame.dispatchEvent(evt);
      window.removeEventListener('wheel', handler, { capture: true });
      return { defaultPrevented: evt.defaultPrevented };
    });

    // Test zoom controls (+, -, 0, fit)
    const zoomControlsTest = await page.evaluate(async () => {
      const readout = document.querySelector('#watch-it-run .tabular');
      const buttons = Array.from(document.querySelectorAll('#watch-it-run button, #watch-it-run [role="button"]'));
      
      const zoomOutBtn = buttons.find(b => b.getAttribute('aria-label')?.includes('Zoom out') || b.innerHTML.includes('minus'));
      const zoomInBtn = buttons.find(b => b.getAttribute('aria-label')?.includes('Zoom in') || b.innerHTML.includes('plus'));
      const fitBtn = buttons.find(b => b.getAttribute('aria-label')?.includes('Reset zoom') || b.innerText.includes('100%'));

      const initialZoom = readout ? readout.innerText : null;

      if (zoomOutBtn) zoomOutBtn.click();
      const afterZoomOut = readout ? readout.innerText : null;

      if (zoomInBtn) { zoomInBtn.click(); zoomInBtn.click(); }
      const afterZoomIn = readout ? readout.innerText : null;

      return { initialZoom, afterZoomOut, afterZoomIn, readoutPresent: Boolean(readout) };
    });

    audit.canvasZoom = { wheelScrollTest, zoomControlsTest };
  }

  // 4. KineticGrid Ripple & Scope Test
  {
    audit.kineticGridScope = await page.evaluate(() => {
      const heroSec = document.getElementById('hero');
      const marqueeSec = document.getElementById('what-we-connect');
      const trustSec = document.getElementById('your-data');
      const watchRunSec = document.getElementById('watch-it-run');

      return {
        heroCanvas: Boolean(heroSec.querySelector('canvas')),
        marqueeCanvas: Boolean(marqueeSec.querySelector('canvas')),
        trustCanvas: Boolean(trustSec.querySelector('canvas')),
        watchRunCanvas: Boolean(watchRunSec.querySelector('canvas'))
      };
    });
  }

  // 5. Buttons & Badges Styling Audit
  audit.buttonsStyle = await page.evaluate(() => {
    const allButtons = Array.from(document.querySelectorAll('.btn, button, a.btn, a[role="button"]'));
    return allButtons.map(b => {
      const cs = getComputedStyle(b);
      return {
        text: b.innerText.trim().slice(0, 30),
        borderRadius: cs.borderRadius,
        color: cs.color,
        bg: cs.backgroundColor,
        height: cs.height,
        isPill: cs.borderRadius === '9999px' || parseInt(cs.borderRadius) > 12
      };
    });
  });

  // 6. Font Weights & Typography Audit
  audit.typography = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, .t-display-xxl, .t-display-xl, .t-display-lg, .t-display-md'));
    const invalidWeights = headings.filter(h => {
      const w = parseInt(getComputedStyle(h).fontWeight);
      return w >= 600;
    }).map(h => ({ tag: h.tagName, text: h.innerText.slice(0, 30), weight: getComputedStyle(h).fontWeight }));

    return {
      totalHeadings: headings.length,
      invalidWeightCount: invalidWeights.length,
      invalidWeights
    };
  });

  // 7. Text Length & Contrast Audit
  audit.emDashes = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const emDashCount = (bodyText.match(/—/g) || []).length;
    const enDashCount = (bodyText.match(/–/g) || []).length;
    return { emDashCount, enDashCount };
  });

  // 8. Time Calculator Deep Test
  {
    await page.evaluate(() => document.getElementById('your-time').scrollIntoView());
    await new Promise(r => setTimeout(r, 400));

    audit.timeCalculatorDeep = await page.evaluate(() => {
      const section = document.getElementById('your-time');
      const sliders = Array.from(section.querySelectorAll('input[type="range"]'));

      // Check values
      const sliderVals = sliders.map(s => ({
        id: s.id || s.getAttribute('aria-label'),
        min: s.min,
        max: s.max,
        val: s.value
      }));

      // Check cost box visibility when hourly rate is empty vs filled
      const hourlyInput = section.querySelector('input[type="number"], input[placeholder*="hourly"], input[placeholder*="Cost"]');
      const costBoxBefore = section.innerText.includes('EUR') || section.innerText.includes('GBP') || section.innerText.includes('USD') || section.innerText.includes('cost per year');

      return { sliderVals, hasHourlyInput: Boolean(hourlyInput), costBoxBefore };
    });
  }

  // 9. Department Selector Layout Shift Check
  {
    await page.evaluate(() => document.getElementById('departments').scrollIntoView());
    await new Promise(r => setTimeout(r, 400));

    audit.deptPanelHeights = await page.evaluate(async () => {
      const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
      const heights = [];
      const panel = document.getElementById('department-panel');

      for (let i = 0; i < tabs.length; i++) {
        tabs[i].click();
        await new Promise(res => setTimeout(res, 300));
        heights.push({
          tabText: tabs[i].innerText.trim(),
          panelHeight: panel.offsetHeight,
          panelScrollHeight: panel.scrollHeight
        });
      }
      return heights;
    });
  }

  fs.writeFileSync(
    path.join(OUT_DIR, 'detailed-audit.json'),
    JSON.stringify(audit, null, 2)
  );

  await browser.close();
  console.log('Detailed audit finished.');
}

runDetailedChecks().catch(console.error);
