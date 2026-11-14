/**
 * Generates the static images in /public using a local headless Chrome/Edge:
 *   - og.png               1200×630 Open Graph / Twitter card
 *   - apple-touch-icon.png 180×180
 *   - favicon-32.png       32×32 PNG fallback for the SVG favicon
 *
 * Run with `npm run images` after changing your name/role. The outputs are
 * committed, so the CI build does not need a browser.
 * Set CHROME_PATH if Chrome/Edge isn't found automatically.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const pub = join(root, 'public');
const fontUrl = (file) => pathToFileURL(join(root, 'src', 'fonts', file)).href;

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error('Chrome/Edge not found. Set CHROME_PATH to a Chromium-based browser.');
  process.exit(1);
}

const fonts = `
@font-face { font-family: 'Plex Sans'; font-weight: 400; src: url('${fontUrl('ibm-plex-sans-latin-400-normal.woff2')}') format('woff2'); }
@font-face { font-family: 'Plex Sans'; font-weight: 600; src: url('${fontUrl('ibm-plex-sans-latin-600-normal.woff2')}') format('woff2'); }
@font-face { font-family: 'Plex Mono'; font-weight: 400; src: url('${fontUrl('ibm-plex-mono-latin-400-normal.woff2')}') format('woff2'); }
@font-face { font-family: 'Plex Mono'; font-weight: 500; src: url('${fontUrl('ibm-plex-mono-latin-500-normal.woff2')}') format('woff2'); }
html, body { margin: 0; background: #f7f6f2; }
`;

const ogHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
  body { width: 1200px; height: 630px; overflow: hidden; color: #464a52; font-family: 'Plex Sans'; background-image: radial-gradient(circle, #d6d3ca 1.5px, transparent 1.8px); background-size: 30px 30px; }
  .frame::after { content: ''; position: absolute; left: -88px; right: -88px; bottom: -72px; height: 14px; background: #2b55d1; }
  .frame { position: absolute; inset: 72px 88px; display: flex; flex-direction: column; }
  .top { display: flex; align-items: center; justify-content: space-between; font: 400 22px 'Plex Mono'; letter-spacing: .04em; }
  .mark { display: inline-grid; place-items: center; width: 56px; height: 56px; border-radius: 8px; background: #2b55d1; color: #ffffff; font: 500 20px 'Plex Mono'; letter-spacing: .04em; }
  .eyebrow { margin-top: auto; color: #2b55d1; font: 500 22px 'Plex Mono'; letter-spacing: .12em; text-transform: uppercase; }
  h1 { margin: 22px 0 0; color: #14161b; font: 600 96px/1 'Plex Sans'; letter-spacing: -.035em; }
  .rule { margin: 44px 0 26px; border-top: 1.5px solid #c4c1b8; }
  .bottom { display: flex; justify-content: space-between; font: 400 22px 'Plex Mono'; letter-spacing: .06em; color: #676a72; }
</style></head><body><div class="frame">
  <div class="top"><span class="mark">TA</span><span>ablecan.github.io</span></div>
  <p class="eyebrow">Programming &amp; Computer Science Graduate</p>
  <h1>Turki Abdullah Aljohani</h1>
  <div class="rule"></div>
  <div class="bottom"><span>Java / SQL / Linux</span><span>Makkah, Saudi Arabia</span></div>
</div></body></html>`;

const favicon = readFileSync(join(pub, 'favicon.svg'), 'utf8');
const iconHtml = (size, fullBleed) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html, body { margin: 0; width: ${size}px; height: ${size}px; overflow: hidden; background: #2b55d1; }
  svg { display: block; width: ${size}px; height: ${size}px; }
</style></head><body>${fullBleed ? favicon.replace('rx="4"', 'rx="0"') : favicon}</body></html>`;

const jobs = [
  { out: 'og.png', html: ogHtml, w: 1200, h: 630 },
  { out: 'apple-touch-icon.png', html: iconHtml(180, true), w: 180, h: 180 },
  { out: 'favicon-32.png', html: iconHtml(32, false), w: 32, h: 32 },
];

const work = mkdtempSync(join(tmpdir(), 'og-'));
try {
  for (const job of jobs) {
    const page = join(work, job.out.replace('.png', '.html'));
    writeFileSync(page, job.html);
    const out = join(pub, job.out);
    execFileSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--allow-file-access-from-files',
      `--user-data-dir=${join(work, 'profile')}`,
      `--window-size=${job.w},${job.h}`,
      '--virtual-time-budget=2000',
      `--screenshot=${out}`,
      pathToFileURL(page).href,
    ], { stdio: 'ignore' });
    const png = readFileSync(out);
    const w = png.readUInt32BE(16);
    const h = png.readUInt32BE(20);
    console.log(`${job.out}: ${w}×${h}${w !== job.w || h !== job.h ? '  <-- unexpected size!' : ''}`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
