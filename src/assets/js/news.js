const feedUrl = 'https://blog.gaborkoos.com/feed.xml';
const list = document.getElementById('news-list');

function renderMessage(message) {
  if (!list) return;
  list.innerHTML = `<p class="text-slate-500">${message}</p>`;
}

function hasFetchKitCategory(item) {
  const categories = Array.from(item.querySelectorAll('category')).map((n) => n.textContent?.trim().toLowerCase());
  return categories.includes('fetch-kit');
}

function parseItems(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'text/xml');
  const items = Array.from(xml.querySelectorAll('item'));

  return items
    .filter(hasFetchKitCategory)
    .map((item) => {
      const title = item.querySelector('title')?.textContent?.trim() || 'Untitled';
      const link = item.querySelector('link')?.textContent?.trim() || '#';
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
      const description = item.querySelector('description')?.textContent?.trim() || '';
      return { title, link, pubDate, description };
    })
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, 5);
}

function render(items) {
  if (!list) return;
  if (!items.length) {
    renderMessage('No tagged fetch-kit announcements found yet.');
    return;
  }

  list.innerHTML = items
    .map((item) => {
      const date = item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
      const blurb = item.description.length > 130 ? `${item.description.slice(0, 130)}...` : item.description;
      return `
        <article class="rounded-lg border border-slate-800 bg-slate-900 p-3">
          <p class="mb-1 text-xs text-slate-500">${date}</p>
          <a class="font-medium text-slate-100 hover:text-teal-300" href="${item.link}" target="_blank" rel="noreferrer">${item.title}</a>
          <p class="mt-1 text-xs text-slate-400">${blurb}</p>
        </article>
      `;
    })
    .join('');
}

async function loadNews() {
  try {
    const res = await fetch(feedUrl);
    if (!res.ok) {
      throw new Error(`Feed returned ${res.status}`);
    }
    const xmlText = await res.text();
    render(parseItems(xmlText));
  } catch (err) {
    renderMessage('Could not load announcements right now.');
  }
}

loadNews();
