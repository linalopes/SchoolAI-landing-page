/**
 * Pepper's Ghost interactive experiment.
 * Editorial copy lives in src/content/pages/peppers-ghost.md.
 * Preserves localStorage keys, iframe sandbox, examples and optical defaults
 * from the legacy public/peppers-ghost.html application.
 */

const P5_SRC = 'https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js';

/** Compatible with pre-migration visitor state — do not rename. */
export const STORAGE = {
  code: 'peppers-ghost-code',
  example: 'peppers-ghost-example',
  scale: 'peppers-ghost-scale-v2',
  distance: 'peppers-ghost-distance-v2',
} as const;

export const EXAMPLES: Record<string, string> = {
  orb: `function ghost() {
  noFill();
  stroke(255);
  strokeWeight(1.5);

  for (let i = 0; i < 8; i++) {
    const d =
      40 +
      i * 14 +
      sin(frameCount * 0.04 + i * 0.5) * 8;

    circle(0, 0, d);
  }
}`,
  creature: `function ghost() {
  const t = frameCount * 0.03;

  noStroke();
  fill(255);
  circle(0, -34, 26);

  noFill();
  stroke(255);
  strokeWeight(1.5);

  for (let i = 0; i < 5; i++) {
    beginShape();
    for (let j = 0; j < 7; j++) {
      const x = sin(t + i + j * 0.5) * (4 + j * 3.5);
      const y = -20 + j * 11;
      vertex(x, y);
    }
    endShape();
  }
}`,
  particles: `function ghost() {
  noStroke();
  fill(255);

  for (let i = 0; i < 44; i++) {
    const a = frameCount * 0.012 + i * 0.9;
    const r = 26 + (i % 5) * 15;

    const x = cos(a) * r;
    const y = sin(a * 1.3) * r;

    circle(x, y, 2.6);
  }
}`,
  text: `function ghost() {
  fill(255);
  noStroke();

  textAlign(CENTER, CENTER);
  textSize(32);

  scale(1, -1);
  text("HELLO", 0, 0);
}`,
};

export const DEFAULT_CONFIG = { scale: 0.85, centerGap: 0.32, imageDistance: 0.35 };

type GhostConfig = {
  scale: number;
  centerGap: number;
  imageDistance: number;
};

type EditorViewLike = {
  state: { doc: { toString(): string; length: number } };
  dispatch: (spec: { changes: { from: number; to: number; insert: string } }) => void;
};

function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode / restricted storage */
  }
}

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSrcdoc(userCode: string, cfg: GhostConfig): string {
  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<style>
  html,body{margin:0;background:#000;overflow:hidden;width:100%;height:100%;}
  canvas{display:block;}
</style>
</head><body>
<script src="${P5_SRC}"><\/script>
<script>
window.ghostConfig = ${JSON.stringify(cfg)};
window.addEventListener('message', function (event) {
  if (!event.data) return;
  if (event.data.type === 'ghost-config' && event.data.config) {
    Object.assign(window.ghostConfig, event.data.config);
  }
  if (event.data.type === 'ghost-pause') { try { noLoop(); } catch (e) {} }
  if (event.data.type === 'ghost-resume') { try { loop(); } catch (e) {} }
  if (event.data.type === 'ghost-resize') {
    try {
      var w = window.innerWidth || 0;
      var h = window.innerHeight || 0;
      if (typeof resizeCanvas === 'function' && w > 1 && h > 1) resizeCanvas(w, h);
    } catch (e) {}
  }
});
window.onerror = function (msg, src, line) {
  parent.postMessage({ type: 'ghost-error', message: String(msg), line: line || 0 }, '*');
  return true;
};
<\/script>
<script>
${userCode}
<\/script>
<script>
var _readySent = false;
function fitCanvas() {
  var w = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
  var h = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0);
  if (w < 2 || h < 2) return;
  if (typeof resizeCanvas === 'function') resizeCanvas(w, h);
}
function setup() {
  var w = Math.max(window.innerWidth || 0, 2);
  var h = Math.max(window.innerHeight || 0, 2);
  createCanvas(w, h);
  if (window.ResizeObserver) {
    new ResizeObserver(fitCanvas).observe(document.documentElement);
  }
}
function windowResized() {
  fitCanvas();
}
function draw() {
  try {
    background(0);
    if (typeof ghost !== 'function') {
      throw new Error('ghost is not defined. Keep function ghost() { ... }');
    }
    var cx = width / 2;
    var cy = height / 2;
    var m = min(width, height);
    var cfg = window.ghostConfig;
    var margin = m * 0.03;
    var maxReach = m / 2 - margin;
    var minInner = cfg.centerGap * m * 0.5;
    var s = cfg.scale;
    var content = 80 * s;
    var maxContent = (maxReach - minInner) / 2;
    if (maxContent < 8) maxContent = maxReach * 0.2;
    if (content > maxContent) {
      s = s * (maxContent / content);
      content = maxContent;
    }
    var dist = cfg.imageDistance * m;
    var minDist = minInner + content;
    var maxDist = maxReach - content;
    if (minDist > maxDist) {
      dist = (minInner + maxReach) / 2;
    } else {
      if (dist < minDist) dist = minDist;
      if (dist > maxDist) dist = maxDist;
    }
    var views = [
      { x: cx, y: cy - dist, r: 180 },
      { x: cx, y: cy + dist, r: 0 },
      { x: cx - dist, y: cy, r: 90 },
      { x: cx + dist, y: cy, r: -90 }
    ];
    for (var i = 0; i < views.length; i++) {
      push();
      translate(views[i].x, views[i].y);
      rotate(radians(views[i].r));
      scale(s);
      ghost();
      pop();
    }
    if (!_readySent) {
      _readySent = true;
      parent.postMessage({ type: 'ghost-ready' }, '*');
    }
  } catch (err) {
    parent.postMessage({ type: 'ghost-error', message: String(err && err.message ? err.message : err), line: 0 }, '*');
    noLoop();
  }
}
<\/script>
</body></html>`;
}

function syntaxCheck(code: string): Error | null {
  try {
    // eslint-disable-next-line no-new-func
    new Function(code);
    return null;
  } catch (err) {
    return err as Error;
  }
}

export function startPeppersGhost(): void {
  const root = document.querySelector<HTMLElement>('[data-peppers-ghost]');
  if (!root || root.dataset.pgBooted === '1') return;
  root.dataset.pgBooted = '1';

  const replaceConfirm =
    root.dataset.replaceConfirm || 'Replace your edited sketch with this example?';
  const errorHint = root.dataset.errorHint || 'Check the spelling and press RUN again.';
  const copyLabel = root.dataset.copyLabel || 'Copy code';
  const copyDoneLabel = root.dataset.copyDoneLabel || 'Copied';

  let selectedExample = storageGet(STORAGE.example) || 'orb';
  if (!EXAMPLES[selectedExample]) selectedExample = 'orb';

  let editorView: EditorViewLike | null = null;
  let currentIframe: HTMLIFrameElement | null = null;
  let lastGoodSrcdoc = '';
  let ghostMode = false;
  let exitTimer: ReturnType<typeof setTimeout> | null = null;
  let paused = false;

  const fallback = document.getElementById('code-fallback') as HTMLTextAreaElement | null;
  const previewWrap = document.getElementById('preview-wrap');
  const ghostStage = document.getElementById('ghost-stage');
  const errorBox = document.getElementById('error-box');
  const errorDetail = document.getElementById('error-detail');
  const calSize = document.getElementById('cal-size') as HTMLInputElement | null;
  const calDist = document.getElementById('cal-dist') as HTMLInputElement | null;
  const calSizeVal = document.getElementById('cal-size-val');
  const calDistVal = document.getElementById('cal-dist-val');
  const btnCopy = document.getElementById('btn-copy');

  if (!fallback || !previewWrap || !ghostStage || !errorBox || !errorDetail || !calSize || !calDist) {
    return;
  }

  const config: GhostConfig = {
    scale: Number(storageGet(STORAGE.scale) || DEFAULT_CONFIG.scale),
    centerGap: DEFAULT_CONFIG.centerGap,
    imageDistance: Number(storageGet(STORAGE.distance) || DEFAULT_CONFIG.imageDistance),
  };
  calSize.value = String(config.scale);
  calDist.value = String(config.imageDistance);
  if (calSizeVal) calSizeVal.textContent = Number(config.scale).toFixed(2);
  if (calDistVal) calDistVal.textContent = Number(config.imageDistance).toFixed(2);

  function getCode(): string {
    return editorView ? editorView.state.doc.toString() : fallback!.value;
  }

  function setCode(value: string): void {
    fallback!.value = value;
    if (editorView) {
      editorView.dispatch({
        changes: { from: 0, to: editorView.state.doc.length, insert: value },
      });
    }
  }

  function persist(): void {
    storageSet(STORAGE.code, getCode());
    storageSet(STORAGE.example, selectedExample);
    storageSet(STORAGE.scale, String(config.scale));
    storageSet(STORAGE.distance, String(config.imageDistance));
  }

  function showError(line: number | undefined, message: string): void {
    errorBox!.classList.add('visible');
    const lineBit = line ? `Line ${line}<br>` : '';
    errorDetail!.innerHTML = `${lineBit}<code>${escapeHtml(message)}</code><br>${escapeHtml(errorHint)}`;
  }

  function clearError(): void {
    errorBox!.classList.remove('visible');
    errorDetail!.textContent = '';
  }

  function attachIframe(srcdoc: string, { provisional }: { provisional: boolean }): HTMLIFrameElement {
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('title', "Pepper's Ghost apparition");
    frame.srcdoc = srcdoc;
    if (provisional) {
      frame.style.position = 'absolute';
      frame.style.opacity = '0';
      frame.style.pointerEvents = 'none';
      frame.style.inset = '0';
    }
    const host = ghostMode ? ghostStage! : previewWrap!;
    host.appendChild(frame);
    frame.addEventListener('load', () => {
      setTimeout(() => {
        try {
          frame.contentWindow?.postMessage({ type: 'ghost-resize' }, '*');
        } catch {
          /* ignore */
        }
      }, 50);
    });
    return frame;
  }

  function runSketch(
    code: string,
    options: { keepPreviousOnError?: boolean; silent?: boolean } = {},
  ): void {
    const keepPreviousOnError = options.keepPreviousOnError !== false;
    const silent = options.silent === true;

    const syntaxError = syntaxCheck(code);
    if (syntaxError) {
      showError(0, syntaxError.message.replace(/^.*?:\s*/, '') || syntaxError.message);
      if (!currentIframe) {
        runSketch(EXAMPLES.orb, { keepPreviousOnError: false, silent: true });
      }
      return;
    }

    const srcdoc = buildSrcdoc(code, config);
    const pending = attachIframe(srcdoc, { provisional: keepPreviousOnError && !!currentIframe });
    let settled = false;

    const finishOk = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener('message', onMsg);
      if (!silent) clearError();
      if (currentIframe && currentIframe !== pending) currentIframe.remove();
      pending.style.position = '';
      pending.style.opacity = '';
      pending.style.pointerEvents = '';
      pending.style.inset = '';
      currentIframe = pending;
      lastGoodSrcdoc = srcdoc;
      void lastGoodSrcdoc;
      persist();
    };

    const finishFail = (payload: { message?: string; line?: number }) => {
      if (settled) return;
      settled = true;
      window.removeEventListener('message', onMsg);
      pending.remove();
      const raw = payload && payload.message ? payload.message : 'The sketch could not run.';
      const cleaned = raw.replace('Uncaught ', '').replace('ReferenceError: ', '');
      showError(payload && payload.line, cleaned);
      if (!currentIframe) {
        currentIframe = attachIframe(buildSrcdoc(EXAMPLES.orb, config), { provisional: false });
      }
    };

    const onMsg = (event: MessageEvent) => {
      if (event.source !== pending.contentWindow) return;
      if (event.data && event.data.type === 'ghost-ready') {
        finishOk();
      }
      if (event.data && event.data.type === 'ghost-error') {
        finishFail(event.data);
      }
    };
    window.addEventListener('message', onMsg);
    setTimeout(() => {
      if (!settled) {
        if (keepPreviousOnError && currentIframe) {
          finishFail({ message: 'The sketch took too long to start.' });
        } else {
          finishOk();
        }
      }
    }, 8000);
  }

  function sendConfig(): void {
    if (!currentIframe || !currentIframe.contentWindow) return;
    currentIframe.contentWindow.postMessage({ type: 'ghost-config', config }, '*');
  }

  function markExamples(): void {
    document.querySelectorAll('.example-btn').forEach((btn) => {
      const el = btn as HTMLElement;
      el.setAttribute('aria-pressed', el.dataset.example === selectedExample ? 'true' : 'false');
    });
  }

  function isDirty(): boolean {
    return getCode().trim() !== EXAMPLES[selectedExample].trim();
  }

  function loadExample(id: string, { force } = { force: false }): void {
    if (!EXAMPLES[id]) return;
    if (!force && isDirty()) {
      const ok = confirm(replaceConfirm);
      if (!ok) return;
    }
    selectedExample = id;
    setCode(EXAMPLES[id]);
    markExamples();
    persist();
    runSketch(getCode(), { keepPreviousOnError: false });
  }

  async function setupEditor(): Promise<void> {
    const saved = storageGet(STORAGE.code);
    fallback!.value = saved && saved.trim() ? saved : EXAMPLES[selectedExample];
    markExamples();

    try {
      // CDN modules — same URLs as the legacy page; no npm dependency.
      const importCdn = (url: string) => import(/* @vite-ignore */ url) as Promise<any>;
      const [{ EditorView, basicSetup }, { javascript }, { keymap }, { indentWithTab }] =
        await Promise.all([
          importCdn('https://esm.sh/codemirror@6.0.1'),
          importCdn('https://esm.sh/@codemirror/lang-javascript@6.2.2'),
          importCdn('https://esm.sh/@codemirror/view@6.34.1'),
          importCdn('https://esm.sh/@codemirror/commands@6.7.1'),
        ]);

      const theme = EditorView.theme(
        {
          '&': { height: '100%', background: '#22113E', color: '#FFFFFF', fontSize: '16px' },
          '.cm-scroller': {
            fontFamily: "'Courier Prime', ui-monospace, monospace",
            lineHeight: '1.5',
          },
          '.cm-content': { caretColor: '#EA7DFF', padding: '12px 0' },
          '.cm-gutters': {
            background: '#22113E',
            color: 'rgba(255,255,255,0.35)',
            border: 'none',
          },
          '.cm-activeLine': { backgroundColor: 'rgba(234,125,255,0.08)' },
        },
        { dark: true },
      );

      editorView = new EditorView({
        doc: fallback!.value,
        extensions: [
          basicSetup,
          javascript(),
          theme,
          keymap.of([
            indentWithTab,
            {
              key: 'Mod-Enter',
              run: () => {
                runSketch(getCode());
                return true;
              },
            },
          ]),
          EditorView.updateListener.of((update: { docChanged: boolean }) => {
            if (update.docChanged) persist();
          }),
        ],
        parent: document.getElementById('editor-shell'),
      }) as EditorViewLike;
      fallback!.style.display = 'none';
    } catch {
      fallback!.addEventListener('input', persist);
    }

    runSketch(getCode(), { keepPreviousOnError: false });
  }

  function enterGhost(): void {
    if (!currentIframe) return;
    ghostMode = true;
    document.body.classList.add('ghost-mode');
    ghostStage!.appendChild(currentIframe);
    const exitBtn = document.getElementById('ghost-exit');
    exitBtn?.classList.remove('dim');
    if (exitTimer) clearTimeout(exitTimer);
    exitTimer = setTimeout(() => exitBtn?.classList.add('dim'), 2800);
    if (location.hash !== '#ghost') history.pushState({ ghost: true }, '', '#ghost');
    const node = ghostStage!;
    const req =
      (
        node as HTMLElement & {
          requestFullscreen?: () => Promise<void>;
          webkitRequestFullscreen?: () => void;
        }
      ).requestFullscreen ||
      (node as HTMLElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen;
    if (req) {
      try {
        req.call(node);
      } catch {
        /* iOS often rejects; CSS fallback remains */
      }
    }
    setTimeout(() => {
      if (currentIframe?.contentWindow) {
        currentIframe.contentWindow.postMessage({ type: 'ghost-resize' }, '*');
        currentIframe.contentWindow.postMessage({ type: 'ghost-resume' }, '*');
      }
    }, 80);
  }

  function exitGhost(updateHistory: boolean): void {
    if (!ghostMode) return;
    ghostMode = false;
    document.body.classList.remove('ghost-mode');
    if (currentIframe) previewWrap!.appendChild(currentIframe);
    const doc = document as Document & {
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => void;
      webkitFullscreenElement?: Element | null;
    };
    const exitFs = doc.exitFullscreen || doc.webkitExitFullscreen;
    if (exitFs && (document.fullscreenElement || doc.webkitFullscreenElement)) {
      try {
        exitFs.call(document);
      } catch {
        /* ignore */
      }
    }
    if (updateHistory !== false && location.hash === '#ghost') {
      history.replaceState({}, '', location.pathname + location.search);
    }
    setTimeout(() => {
      if (currentIframe?.contentWindow) {
        currentIframe.contentWindow.postMessage({ type: 'ghost-resize' }, '*');
      }
    }, 80);
  }

  document.getElementById('btn-run')?.addEventListener('click', () => runSketch(getCode()));
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    setCode(EXAMPLES[selectedExample]);
    persist();
    runSketch(getCode(), { keepPreviousOnError: false });
  });
  btnCopy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getCode());
      btnCopy.textContent = copyDoneLabel;
      setTimeout(() => {
        btnCopy.textContent = copyLabel;
      }, 1200);
    } catch {
      /* clipboard may be denied */
    }
  });
  document.getElementById('btn-ghost')?.addEventListener('click', enterGhost);
  document.getElementById('ghost-exit')?.addEventListener('click', () => exitGhost(true));
  ghostStage.addEventListener('click', () => {
    const exitBtn = document.getElementById('ghost-exit');
    exitBtn?.classList.remove('dim');
    if (exitTimer) clearTimeout(exitTimer);
    exitTimer = setTimeout(() => exitBtn?.classList.add('dim'), 2800);
  });

  document.querySelectorAll('.example-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.example;
      if (id) loadExample(id);
    });
  });

  calSize.addEventListener('input', () => {
    config.scale = Number(calSize.value);
    if (calSizeVal) calSizeVal.textContent = config.scale.toFixed(2);
    persist();
    sendConfig();
  });
  calDist.addEventListener('input', () => {
    config.imageDistance = Number(calDist.value);
    if (calDistVal) calDistVal.textContent = config.imageDistance.toFixed(2);
    persist();
    sendConfig();
  });
  document.getElementById('btn-cal-reset')?.addEventListener('click', () => {
    config.scale = DEFAULT_CONFIG.scale;
    config.imageDistance = DEFAULT_CONFIG.imageDistance;
    calSize.value = String(config.scale);
    calDist.value = String(config.imageDistance);
    if (calSizeVal) calSizeVal.textContent = config.scale.toFixed(2);
    if (calDistVal) calDistVal.textContent = config.imageDistance.toFixed(2);
    persist();
    sendConfig();
  });

  window.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      runSketch(getCode());
    }
    if (event.key === 'Escape' && ghostMode) exitGhost(true);
  });
  window.addEventListener('popstate', () => {
    if (ghostMode) exitGhost(false);
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && ghostMode) exitGhost(false);
  });
  document.addEventListener('webkitfullscreenchange', () => {
    const doc = document as Document & { webkitFullscreenElement?: Element | null };
    if (!doc.webkitFullscreenElement && ghostMode) exitGhost(false);
  });

  const previewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!currentIframe || !currentIframe.contentWindow || ghostMode) return;
        if (entry.isIntersecting) {
          if (paused) {
            currentIframe.contentWindow.postMessage({ type: 'ghost-resume' }, '*');
            paused = false;
          }
        } else {
          currentIframe.contentWindow.postMessage({ type: 'ghost-pause' }, '*');
          paused = true;
        }
      });
    },
    { threshold: 0.05 },
  );
  previewObserver.observe(previewWrap);

  if (window.ResizeObserver) {
    const sizeObserver = new ResizeObserver(() => {
      if (!currentIframe || !currentIframe.contentWindow) return;
      currentIframe.contentWindow.postMessage({ type: 'ghost-resize' }, '*');
    });
    sizeObserver.observe(previewWrap);
    sizeObserver.observe(ghostStage);
  }

  fallback.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      runSketch(getCode());
    }
  });

  if (window.matchMedia('(orientation: portrait) and (max-width: 899px)').matches) {
    const hint = document.getElementById('orient-hint');
    if (hint) hint.style.display = 'block';
  }

  void setupEditor();

  if (location.hash === '#ghost') {
    history.replaceState({}, '', location.pathname + location.search);
  }

  window.addEventListener('message', (event) => {
    if (!currentIframe || event.source !== currentIframe.contentWindow) return;
    if (event.data && event.data.type === 'ghost-error') {
      const raw = event.data.message || 'The sketch could not run.';
      showError(event.data.line, String(raw).replace('Uncaught ', '').replace('ReferenceError: ', ''));
    }
  });
}
