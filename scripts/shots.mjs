import { chromium } from 'file:///C:/Users/78495/.workbuddy-ai/binaries/node/workspace/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';

const EXE = 'C:/Users/78495/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe';
const BASE = 'http://localhost:4188/#';
const OUT = 'E:/naolen/workbuddy-workspace/玄学/ziping-academy/.shots';

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 1180, height: 900 }, deviceScaleFactor: 2 });
const errs = [];
page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', (e) => errs.push(String(e)));

const snap = async (name) => {
  await page.waitForTimeout(450);
  await (await page.$('.viz')).screenshot({ path: `${OUT}/${name}.png` });
  console.log('  ->', name);
};

await page.goto(`${BASE}/card/k1-4`, { waitUntil: 'networkidle' });
await page.waitForSelector('.viz');
await snap('wuxing');

await page.goto(`${BASE}/card/k1-5`, { waitUntil: 'networkidle' });
await page.waitForSelector('.viz');
await snap('shishen-map');

// 关系盘：逐模式 + 点击隔离
await page.goto(`${BASE}/card/k1-8`, { waitUntil: 'networkidle' });
await page.waitForSelector('.viz');
await snap('dial-chong');

await page.click('.viz-tabs button:has-text("六合")');
await snap('dial-he');
await page.click('.viz-tabs button:has-text("六害")');
await snap('dial-hai');
await page.click('.viz-tabs button:has-text("三合")');
await snap('dial-sanhe');
await page.click('.viz-tabs button:has-text("三会")');
await snap('dial-sanhui');
await page.click('.viz-tabs button:has-text("三刑")');
await snap('dial-sanxing');

// 点「寅」看隔离高亮
await page.click('.viz-tabs button:has-text("六冲")');
const node = await page.$('.viz svg g[style*="cursor"] >> nth=2');
await node.click();
await snap('dial-chong-sel');

// 移动端
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/card/k1-8`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/mobile-dial.png` });
console.log('  -> mobile-dial');

console.log('console errors:', errs.length ? errs.slice(0, 5) : 'none');
await browser.close();
