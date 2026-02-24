// ─── SALSIFY CLIENT ─────────────────────────────────────────────────────────
const SALSIFY_FILTER   = "='Brand Name':'OX'";
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

// ─── Field mapping ───────────────────────────────────────────────────────────
function _mapProduct(raw) {
  const priceStr = raw['Dealer Price']?.['en-GB'];
  const price    = priceStr ? parseFloat(priceStr) : 0;

  return {
    id:         raw['Product SKU'] || raw['salsify:id'],
    name:       raw['Global Product Name'] || raw['salsify:id'] || '',
    cat:        raw['Product Type'] || 'Other',
    price:      price,
    orig:       price,
    stock:      0,
    inStock:    raw['Available in UK?'] === true || raw['Available in UK?'] === 'Yes',
    img:        null,
    imgAssetId: raw['Front View'] || null,
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
    const params = new URLSearchParams({ filter: SALSIFY_FILTER, per_page: SALSIFY_PER_PAGE });
    if (_cursor) params.set('cursor', _cursor);

    const res  = await fetch(`/api/products?${params}`);
    const json = await res.json();

    const fresh = (json.data || []).map(_mapProduct);
    PRODUCTS.push(...fresh);

    _cursor = json.meta?.cursor || null;
    _total  = json.meta?.total_entries ?? PRODUCTS.length;

    _rebuildCategories();
    renderListing();

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
    const res       = await fetch(`/api/asset?id=${id}`);
    const { url }   = await res.json();
    if (url) {
      _assetCache[id] = url;
      product.img     = url;
      _applyImage(product.id, url);
    }
  } catch (_) { /* skip */ }
}

function _applyImage(productId, imgUrl) {
  document.querySelectorAll(`[data-product-img="${CSS.escape(productId)}"]`).forEach(el => {
    el.innerHTML = `<img src="${imgUrl}" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:4px">`;
  });
}
