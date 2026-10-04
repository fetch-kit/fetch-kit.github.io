const matrixUrl = '/http-resilience/matrix.json';
const date = document.getElementById('resilience-date');
const libraries = document.getElementById('resilience-libraries');
const scenarios = document.getElementById('resilience-scenarios');
const meta = document.getElementById('resilience-meta');
const versions = document.getElementById('resilience-versions');

function setText(node, value) {
  if (node) node.textContent = value;
}

function formatDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function renderUnavailable() {
  setText(date, '-');
  setText(libraries, '-');
  setText(scenarios, '-');
  setText(meta, 'The published matrix could not be loaded right now.');
}

function render(matrix) {
  const pinned = Object.entries(matrix.versions || {});
  const scenarioCount = Array.isArray(matrix.rows) ? matrix.rows.length : 0;

  setText(date, formatDate(matrix.generatedAt) || '-');
  setText(libraries, String(pinned.length));
  setText(scenarios, String(scenarioCount));
  setText(meta, [matrix.runtime ? `Node ${matrix.runtime}` : '', 'regenerated weekly'].filter(Boolean).join(' · '));
  setText(versions, pinned.map(([name, version]) => `${name} ${version}`).join(' · '));
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
    renderUnavailable();
  }
}

loadMatrix();
