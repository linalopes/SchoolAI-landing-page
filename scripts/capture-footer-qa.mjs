#!/usr/bin/env node
/**
 * Capture footer screenshots at key widths via CDP clip.
 * Usage: node scripts/capture-footer-qa.mjs <url> <label> <outdir>
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const [url, label, outdir] = process.argv.slice(2);
if (!url || !label || !outdir) {
  console.error('Usage: node scripts/capture-footer-qa.mjs <url> <label> <outdir>');
  process.exit(1);
}

const chrome =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9241;
const widths = [1920, 1440, 1280, 1024, 768, 390];

mkdirSync(outdir, { recursive: true });

function launch() {
  return spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=/tmp/schoolai-footer-qa-${label}-${Date.now()}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );
}

async function getWs() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
        method: 'PUT',
      });
      const page = await res.json();
      if (page.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      await delay(250);
    }
  }
  throw new Error('Chrome DevTools did not start');
}

function cdp(ws) {
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  });
  return (method, params = {}) =>
    new Promise((resolve, reject) => {
      const next = ++id;
      pending.set(next, (msg) => {
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      });
      ws.send(JSON.stringify({ id: next, method, params }));
    });
}

async function shootFooter(send, width) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width <= 768,
  });
  await send('Page.navigate', { url });
  await delay(3500);

  const info = await send('Runtime.evaluate', {
    expression: `(() => {
      const footer = document.querySelector('footer');
      if (!footer) return { error: 'footer missing' };
      const rect = footer.getBoundingClientRect();
      const absoluteTop = rect.top + (document.scrollingElement?.scrollTop || window.scrollY || 0);
      const h = Math.min(Math.max(rect.height + 48, 360), 1200);
      const explore = document.querySelector('.footer-col--explore');
      return {
        explorePos: explore ? getComputedStyle(explore).position : null,
        title:
          document.querySelector('.footer-program-link')?.textContent ||
          document.querySelector('footer a')?.textContent ||
          '',
        clip: {
          x: 0,
          y: Math.max(0, absoluteTop - 24),
          width: ${width},
          height: h,
          scale: 1,
        },
      };
    })()`,
    returnByValue: true,
  });

  const value = info.result?.value;
  console.log(`width ${width}:`, value);
  if (!value || value.error || !value.clip) {
    throw new Error(value?.error || 'no clip');
  }

  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    fromSurface: true,
    clip: value.clip,
  });
  const path = join(outdir, `footer-${width}.png`);
  await writeFile(path, Buffer.from(shot.data, 'base64'));
  console.log(`wrote ${path} (${shot.data.length})`);
}

const proc = launch();
try {
  const wsUrl = await getWs();
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });
  const send = cdp(ws);
  await send('Page.enable');
  await send('Runtime.enable');
  for (const width of widths) {
    await shootFooter(send, width);
  }
  ws.close();
} finally {
  proc.kill('SIGKILL');
}
