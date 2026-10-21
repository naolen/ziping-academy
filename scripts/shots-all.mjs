import { chromium } from 'file:///C:/Users/78495/.workbuddy-ai/binaries/node/workspace/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';

const EXE = 'C:/Users/78495/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe';
const BASE = 'http://localhost:4188/#';
const OUT = 'E:/naolen/workbuddy-workspace/玄学/ziping-academy/.shots/all';

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 1180, height: 1000 }, deviceScaleFactor: 2 });
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', (e) => errs.push(String(e)));

const ids = [];
for (let s = 1; s <= 5; s++) {
  const n = { 1: 9, 2: 6, 3: 8, 4: 5, 5: 4 }[s];
  for (let i = 1; i <= n; i++) ids.push(`k${s}-${i}`);
}

const rows = [];
for (const id of ids) {
  await page.goto(`${BASE}/card/${id}`, { waitUntil: 'networkidle' });
  await page.waitForSelector('.viz', { timeout: 10000 });
  await page.waitForTimeout(1000);
  const el = await page.$('.viz');
  const box = await el.boundingBox();
  await el.screenshot({ path: `${OUT}/${id}.png` });
  const cap = await page.$eval('.viz figcaption', (e) => e.textContent.slice(0, 18));
  rows.push(`${id}  ${Math.round(box.width)}x${Math.round(box.height)}  ${cap}`);
}
console.log(rows.join('\n'));
console.log('errors:', errs.length ? errs.slice(0, 6) : 'none');
await browser.close();
