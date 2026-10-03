const matrixUrl = '/http-resilience/matrix.json';
const stats = document.getElementById('resilience-stats');
const meta = document.getElementById('resilience-meta');
const versions = document.getElementById('resilience-versions');

const tiles = [
  { label: 'PASS', className: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' },
  { label: 'FAIL', className: 'border-rose-500/40 bg-rose-500/10 text-rose-200' },
  { label: 'N/A', className: 'border-slate-700 bg-slate-900 text-slate-300' },
];

function renderMessage(message) {
  if (stats) {
    stats.innerHTML = `<p class="text-sm text-slate-500">${message}</p>`;
  }
  if (meta) {
    meta.textContent = 'The published matrix could not be loaded; open it directly instead.';
  }
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function render(matrix) {
  const counts = matrix.counts || {};
  const libraries = Object.keys(matrix.versions || {}).length;
  const scenarios = Array.isArray(matrix.rows) ? matrix.rows.length : 0;
  const values = [counts.pass, counts.fail, counts['not-applicable']].map((value) => value ?? 0);

  if (stats) {
    stats.innerHTML = tiles
      .map((tile, index) => `
        <div class="rounded-lg border p-3 ${tile.className}">
          <p class="text-2xl font-semibold">${values[index]}</p>
          <p class="text-xs uppercase tracking-wide">${tile.label}</p>
        </div>
      `)
      .concat(`
        <div class="rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-300">
          <p class="text-2xl font-semibold">${libraries} x ${scenarios}</p>
          <p class="text-xs uppercase tracking-wide">libraries x scenarios</p>
        </div>
      `)
      .join('');
  }

  if (meta) {
    const generated = formatDate(matrix.generatedAt);
    meta.textContent = [generated ? `Latest run ${generated}` : '', matrix.runtime ? `Node ${matrix.runtime}` : '', `${libraries} libraries pinned`]
      .filter(Boolean)
      .join(' · ');
  }

  if (versions) {
    versions.textContent = Object.entries(matrix.versions || {})
      .map(([name, version]) => `${name} ${version}`)
      .join(' · ');
  }
}

async function loadMatrix() {
  try {
    const res = await fetch(matrixUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Matrix returned ${res.status}`);
    }
    const matrix = await res.json();
    if (!matrix || typeof matrix !== 'object' || !matrix.counts) {
      throw new Error('Unexpected matrix payload');
    }
    render(matrix);
  } catch (err) {
    renderMessage('Could not load the latest published matrix right now.');
  }
}

loadMatrix();
