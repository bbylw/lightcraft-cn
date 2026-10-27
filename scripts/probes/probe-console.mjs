import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) =>
  errors.push(`[reqfail] ${r.url()} :: ${r.failure()?.errorText}`),
);
await page.goto('https://lightcraft.localhost/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
console.log('root children:', await page.evaluate(() => document.getElementById('root')?.childElementCount));
console.log('body text len:', await page.evaluate(() => document.body.innerText.length));
console.log(errors.join('\n') || '(no console errors)');
await browser.close();
