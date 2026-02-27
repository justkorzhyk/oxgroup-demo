// ─── ASYNC PRODUCTS LOADER ───────────────────────────
const _brandCache = {};

// Silently fetch a brand into cache without affecting the UI
async function _prefetchBrand(brand) {
  const key = brand.toLowerCase();
  if (_brandCache[key]) return;
  try {
    const res = await fetch(`/data/products-${key}.json`);
    if (res.ok) _brandCache[key] = await res.json();
  } catch (e) { /* silently ignore prefetch failures */ }
}

async function loadBrandProducts(brand) {
  const key = brand.toLowerCase();

  if (_brandCache[key]) {
    _applyBrandData(brand, _brandCache[key]);
    return;
  }

  // Show loading state
  const listEl  = document.getElementById('product-list');
  const countEl = document.getElementById('prod-count');
  if (listEl)  listEl.innerHTML = `
    <div class="products-loading">
      <div class="products-spinner"></div>
      Loading products…
    </div>`;
  if (countEl) countEl.textContent = '';

  try {
    const res = await fetch(`/data/products-${key}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    _brandCache[key] = data;
    _applyBrandData(brand, data);
  } catch (e) {
    console.error('[Loader]', e);
    if (listEl) listEl.innerHTML = `
      <div style="padding:40px;text-align:center;color:var(--muted)">
        Failed to load products.
        <a onclick="loadBrandProducts('${brand}')" style="color:var(--blue);cursor:pointer">Retry</a>
      </div>`;
  }
}

function _applyBrandData(brand, products) {
  PRODUCTS.length = 0;
  PRODUCTS.push(...products);

  // Rebuild CATEGORIES (Level2 segments) + CAT_ICONS
  const catSet = new Set();
  products.forEach(p => { if (p.segment) catSet.add(p.segment); });
  CATEGORIES.length = 0;
  CAT_ICONS.length  = 0;
  [...catSet].sort().forEach(seg => {
    CATEGORIES.push(seg);
    CAT_ICONS.push(CAT_ICON_MAP[seg] || 'tag');
  });

  // Rebuild CAT_DATA for mega menu
  _buildCatDataFromProducts(brand, products);

  selectedCat     = 0;
  selectedSegment = null;
  selectedSubCat  = null;
  listingPage     = 0;
  renderListing();

  if (document.getElementById('home-promo-rows')) renderHome();
}

function _buildCatDataFromProducts(brand, products) {
  const catMap = new Map();
  products.forEach(p => {
    if (!p.cat) return;
    if (!catMap.has(p.cat)) catMap.set(p.cat, new Map());
    if (p.segment) {
      if (!catMap.get(p.cat).has(p.segment)) catMap.get(p.cat).set(p.segment, new Set());
      if (p.subType) catMap.get(p.cat).get(p.segment).add(p.subType);
    }
  });

  CAT_DATA[brand] = [...catMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([cat, segMap]) => ({
      name: cat,
      icon: CAT_ICON_MAP[cat] || 'tag',
      subs: [...segMap.entries()].map(([seg, subSet]) => ({
        heading: seg,
        items:   subSet.size > 0 ? [...subSet].sort() : [seg],
      })),
    }));
}
