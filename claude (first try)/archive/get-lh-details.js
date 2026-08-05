const fs = require('fs');

const report = JSON.parse(fs.readFileSync('C:\\Users\\PC\\AppData\\Local\\Temp\\chrome-devtools-mcp-RhyQT1\\report.json', 'utf8'));

const categories = {};
for (const [key, cat] of Object.entries(report.categories || {})) {
  categories[key] = {
    title: cat.title,
    score: cat.score !== null ? Math.round(cat.score * 100) : null
  };
}

const metrics = {
  lcp: report.audits['largest-contentful-paint']?.displayValue,
  cls: report.audits['cumulative-layout-shift']?.displayValue,
  tbt: report.audits['total-blocking-time']?.displayValue,
  fcp: report.audits['first-contentful-paint']?.displayValue,
  speedIndex: report.audits['speed-index']?.displayValue
};

const failedAudits = [];
for (const [key, audit] of Object.entries(report.audits || {})) {
  if (audit.score !== null && audit.score < 0.9 && audit.scoreDisplayMode !== 'notApplicable') {
    failedAudits.push({
      id: key,
      title: audit.title,
      score: audit.score,
      displayValue: audit.displayValue,
      explanation: audit.explanation || audit.description
    });
  }
}

console.log('Categories:', JSON.stringify(categories, null, 2));
console.log('Metrics:', JSON.stringify(metrics, null, 2));
console.log('Failed Audits Count:', failedAudits.length);
console.log('Failed Audits:', JSON.stringify(failedAudits, null, 2));
