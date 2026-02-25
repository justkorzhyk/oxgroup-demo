// ─── SALSIFY CLIENT ─────────────────────────────────────────────────────────
const SALSIFY_PER_PAGE = 20;
const ASSET_CONCURRENCY = 4;

const CAT_ICON_MAP = {
  'Diamond Blade':        'diamond',
  'Diamond Core Drill':   'diamond',
  'Diamond Core Drill Set': 'diamond',
  'Core Bit Accessory':   'tool',
  'Core Drill':           'diamond',
  'Pencil':               'tool',
  'Screws':               'tool',
};

let _loading    = false;
let _cursor     = null;
let _total      = null;
let _assetCache = {};
let _assetQueue = [];
let _inFlight   = 0;
const _catLoadedBrands = new Set(); // brands whose CAT_DATA has been built from Salsify

// ─── Field mapping ───────────────────────────────────────────────────────────
function _mapProduct(raw) {
  const priceStr = raw['Dealer Price']?.['en-GB'];
  const price    = priceStr ? parseFloat(priceStr) : 0;

  return {
    id:         raw['Product SKU'] || raw['salsify:id'],
    name:       raw['Global Product Name'] || raw['salsify:id'] || '',
    cat:        raw['Product Type'] || 'Other',
    segment:    raw['Category Test']?.['en-US'] || raw['Category Test']?.['en-GB'] || raw['Segment'] || raw['Product Segment'] || raw['Product Group'] || null,
    subType:    raw['Product Category'] || raw['Sub-Type'] || raw['Sub Type'] || raw['Product Sub-Type'] || null,
    price:      price,
    orig:       price,
    stock:      0,
    inStock:    raw['Available in UK?'] === true || raw['Available in UK?'] === 'Yes',
    img:        null,
    imgAssetId: (Array.isArray(raw['Front View']) ? raw['Front View'][0] : raw['Front View']) || null,
    brand:      raw['Brand Name'] || 'OX',
  };
}

// ─── Rebuild CATEGORIES from loaded PRODUCTS ─────────────────────────────────
function _rebuildCategories() {
  const seen = new Set();
  PRODUCTS.forEach(p => { if (p.cat) seen.add(p.cat); });

  CATEGORIES.length = 0;
  CAT_ICONS.length  = 0;

  [...seen].sort().forEach(cat => {
    CATEGORIES.push(cat);
    CAT_ICONS.push(CAT_ICON_MAP[cat] || 'tag');
  });
}

// ─── Build dynamic CAT_DATA for mega menu ─────────────────────────────────────
function _buildDynamicCatData(brand, products) {
  const hasSegments = products.some(p => p.segment);

  if (hasSegments) {
    // 3-level: segment → product type → sub-types
    const segMap = new Map();
    products.forEach(p => {
      const seg = p.segment;
      const cat = p.cat;
      if (!segMap.has(seg)) segMap.set(seg, new Map());
      if (!segMap.get(seg).has(cat)) segMap.get(seg).set(cat, new Set());
      if (p.subType) segMap.get(seg).get(cat).add(p.subType);
    });
    CAT_DATA[brand] = [...segMap.entries()].map(([seg, catMap]) => ({
      name: seg,
      icon: CAT_ICON_MAP[seg] || 'tag',
      subs: [...catMap.entries()].map(([cat, subTypes]) => ({
        heading: cat,
        items:   subTypes.size > 0 ? [...subTypes].sort() : [cat],
      })),
    }));
  } else {
    // 2-level: product type → sub-types (or just the type itself)
    const typeMap = new Map();
    products.forEach(p => {
      if (!typeMap.has(p.cat)) typeMap.set(p.cat, new Set());
      if (p.subType) typeMap.get(p.cat).add(p.subType);
    });
    CAT_DATA[brand] = [...typeMap.entries()].map(([cat, subTypes]) => ({
      name: cat,
      icon: CAT_ICON_MAP[cat] || 'tag',
      subs: subTypes.size > 0 ? [{ heading: cat, items: [...subTypes].sort() }] : [],
    }));
  }

  _catLoadedBrands.add(brand);

  // Re-render the dropdown if it's open
  if (document.getElementById('cat-dropdown')?.classList.contains('open')) {
    renderCatDropdown();
  }
}

// ─── Lazy-load CAT_DATA for a brand (for the dropdown tabs) ──────────────────
async function loadCatDataForBrand(brand) {
  if (_catLoadedBrands.has(brand)) return;
  _catLoadedBrands.add(brand); // mark as in-progress so we don't double-fetch
  try {
    const params = new URLSearchParams({ filter: `='Brand Name':'${brand}'`, per_page: 100 });
    const res    = await fetch(`/api/products?${params}`);
    const json   = await res.json();
    const prods  = (json.data || []).map(raw => ({
      cat:     raw['Product Type'] || 'Other',
      segment: raw['Category Test']?.['en-US'] || raw['Category Test']?.['en-GB'] || raw['Segment'] || raw['Product Segment'] || raw['Product Group'] || null,
      subType: raw['Product Category'] || raw['Sub-Type'] || raw['Sub Type'] || raw['Product Sub-Type'] || null,
    }));
    _buildDynamicCatData(brand, prods);
  } catch (e) {
    console.warn('[Salsify] Cat load failed for', brand, e);
    _catLoadedBrands.delete(brand); // allow retry
  }
}

// ─── Load products ───────────────────────────────────────────────────────────
async function loadSalsifyProducts(reset = true) {
  if (_loading) return;

  if (reset) {
    _cursor = null;
    _total  = null;
    PRODUCTS.length = 0;
    selectedCat = 0;
  }

  _loading = true;

  const listEl = document.getElementById('product-list');
  if (listEl && reset) {
    listEl.innerHTML = `
      <div class="salsify-loading">
        <div class="salsify-spinner"></div>
        Loading products…
      </div>`;
  }

  try {
    const params = new URLSearchParams({ filter: `='Brand Name':'${selectedBrand}'`, per_page: SALSIFY_PER_PAGE });
    if (_cursor) params.set('cursor', _cursor);

    const res  = await fetch(`/api/products?${params}`);
    const json = await res.json();

    // Diagnostic: log first raw product to inspect field names & types
    if (json.data?.[0]) {
      console.log('[Salsify] First raw product keys:', Object.keys(json.data[0]));
      console.log('[Salsify] Front View value:', json.data[0]['Front View']);
      console.log('[Salsify] Full first product:', json.data[0]);
    }

    const fresh = (json.data || []).map(_mapProduct);
    PRODUCTS.push(...fresh);

    _cursor = json.meta?.cursor || null;
    _total  = json.meta?.total_entries ?? PRODUCTS.length;

    _rebuildCategories();
    if (reset) _buildDynamicCatData(selectedBrand, PRODUCTS);

    // Resolve a pending segment slug (e.g. direct URL /ox/diamond-tools)
    if (_pendingSegSlug) {
      const slug = _pendingSegSlug;
      _pendingSegSlug = null;
      const cats  = CAT_DATA[selectedBrand] || [];
      const match = cats.find(c => slugify(c.name) === slug);
      if (match) {
        selectedSegment     = match.name;
        selectedCat         = 0;
        _pendingProductSlug = null; // it's a segment, not a product
      }
    }

    // If brand returned no products AND we're on the listing page, show 404
    if (reset && PRODUCTS.length === 0) {
      _pendingProductSlug = null;
      const listingActive = document.getElementById('page-listing')?.classList.contains('active');
      if (listingActive) navigate('404');
      _loading = false;
      return;
    }

    renderListing();
    // Refresh home promo rows so images appear there too
    if (document.getElementById('home-promo-rows')) renderHome();

    // If we were navigating directly to a product URL, open it now
    if (_pendingProductSlug) {
      const slug = _pendingProductSlug;
      _pendingProductSlug = null;
      const found = PRODUCTS.find(p => slugify(p.name) === slug);
      if (found) {
        currentProduct = found;
        navigate('detail', { skipHistory: true });
      }
    }

    // Show real total in header
    const countEl = document.getElementById('prod-count');
    if (countEl) countEl.textContent = `${_total} products found`;

    // Wire "Show More" button
    const showMore = document.querySelector('#page-listing .show-more');
    if (showMore) {
      showMore.style.display = _cursor ? '' : 'none';
      showMore.onclick = () => loadSalsifyProducts(false);
    }

    // Lazy-load images
    fresh.forEach(p => { if (p.imgAssetId) _enqueue(p); });

  } catch (e) {
    console.error('[Salsify]', e);
    if (listEl) listEl.innerHTML = `
      <div style="padding:40px;text-align:center;color:var(--muted)">
        Failed to load products. <a onclick="loadSalsifyProducts()" style="color:var(--blue);cursor:pointer">Retry</a>
      </div>`;
  } finally {
    _loading = false;
  }
}

// ─── Image loading queue ──────────────────────────────────────────────────────
function _enqueue(product) {
  _assetQueue.push(product);
  _drain();
}

function _drain() {
  while (_inFlight < ASSET_CONCURRENCY && _assetQueue.length > 0) {
    const p = _assetQueue.shift();
    _inFlight++;
    _fetchAsset(p).finally(() => { _inFlight--; _drain(); });
  }
}

async function _fetchAsset(product) {
  const id = product.imgAssetId;
  if (!id) return;

  if (_assetCache[id]) {
    product.img = _assetCache[id];
    _applyImage(product.id, _assetCache[id]);
    return;
  }

  try {
    const res  = await fetch(`/api/asset?id=${encodeURIComponent(id)}`);
    const data = await res.json();
    console.log('[Salsify] Asset', id, '→', data);
    const url = data.url;
    if (url) {
      _assetCache[id] = url;
      product.img     = url;
      _applyImage(product.id, url);
    }
  } catch (err) { console.warn('[Salsify] Asset fetch failed:', id, err); }
}

function _applyImage(productId, imgUrl) {
  document.querySelectorAll(`[data-product-img="${CSS.escape(productId)}"]`).forEach(el => {
    el.innerHTML = `<img src="${imgUrl}" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:4px">`;
  });
}
