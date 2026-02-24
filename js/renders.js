// ─── ACCORDION BUILDER ──────────────────────────────
function buildFAQ(containerId, faqs) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = faqs.map(f => `
    <div class="acc-item">
      <div class="acc-header" onclick="toggleAcc(this)">${f.q} <span class="acc-toggle">+</span></div>
      <div class="acc-body">${f.a}</div>
    </div>
  `).join('');
}

function buildCartFAQ(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = CART_FAQS.map((f, i) => `
    <div class="acc-item">
      <div class="acc-header" onclick="toggleAcc(this)" style="font-size:13px">${f.q} <span class="acc-toggle">${i === 0 ? '−' : '+'}</span></div>
      <div class="acc-body" ${i === 0 ? 'style="display:block"' : ''}>${f.a}</div>
    </div>
  `).join('');
}

// ─── HOME RENDER ────────────────────────────────────
function renderHome() {
  // Promo rows (home page)
  const promoRows = PRODUCTS.slice(0, 8);
  const promoEl = document.getElementById('home-promo-rows');
  if (promoEl) {
    promoEl.innerHTML = promoRows.map((p, i) => `
      <div class="home-promo-row" onclick="openProduct(${PRODUCTS.indexOf(p)})">
        <div class="home-promo-thumb" data-product-img="${p.id}" style="display:flex;align-items:center;justify-content:center;color:#868686">${p.img ? `<img src="${p.img}" alt="" style="width:100%;height:100%;object-fit:contain">` : icon('diamond', 'icon-lg')}</div>
        <div class="home-promo-info">
          <div class="home-promo-meta">
            <span class="home-promo-sku">${p.id}</span>
            <div class="home-promo-stock-dot ${p.stock <= 10 ? 'low' : ''}"></div>
          </div>
          <div class="home-promo-name">${p.name}</div>
        </div>
        <div class="home-promo-prices">
          <div class="home-promo-orig">£${p.orig.toFixed(2)}</div>
          <div class="home-promo-price">£${p.price.toFixed(2)}</div>
        </div>
        <div class="home-promo-actions">
          <button class="home-promo-heart" onclick="event.stopPropagation();addToWish()" title="Wishlist">${icon('heart')}</button>
          <button class="home-promo-cart" onclick="event.stopPropagation();addToCart()" title="Add to cart">${icon('cart')}</button>
        </div>
      </div>
    `).join('');
  }

  // FAQ accordion (home page)
  const faqEl = document.getElementById('home-faq-accordion');
  if (faqEl) {
    faqEl.innerHTML = FAQS.map((f, i) => `
      <div class="home-faq-item ${i === 0 ? 'open' : ''}">
        <div class="home-faq-header" onclick="toggleHomeFaq(this)">
          <span>${f.q}</span>
          <span class="home-faq-toggle">${i === 0 ? icon('minus') : icon('plus')}</span>
        </div>
        <div class="home-faq-body" ${i === 0 ? 'style="display:block"' : ''}>${f.a}</div>
      </div>
    `).join('');
  }
}

// ─── LISTING ────────────────────────────────────────
function renderListing() {
  // Update brand name in breadcrumb and title
  const brand = PRODUCTS[0]?.brand || 'OX';
  const brandUpper = brand.toUpperCase();
  const titleEl = document.getElementById('listing-brand-title');
  if (titleEl) titleEl.textContent = brandUpper;
  const bcEl = document.getElementById('listing-breadcrumb');
  if (bcEl) bcEl.innerHTML = `<a onclick="navigate('home')" style="display:inline-flex;align-items:center">${icon('home','icon-sm')}</a><span>/</span><span class="bc-active">${brand}</span>`;

  // Category tabs
  document.getElementById('cat-tabs').innerHTML = CATEGORIES.map((c, i) => `
    <div class="cat-tab ${i === selectedCat ? 'active' : ''}" onclick="selectCat(${i})">
      <span class="cat-icon">${icon(CAT_ICONS[i], 'icon-lg')}</span>${c}
    </div>
  `).join('');

  const useSegments = PRODUCTS.length > 0 && PRODUCTS[0].segment != null;
  const catName = CATEGORIES[selectedCat];
  const filtered = PRODUCTS.filter(p => {
    const matchCat = useSegments ? p.segment === catName : p.cat === catName;
    return matchCat && (!stockOnly || p.inStock);
  });

  document.getElementById('prod-count').textContent = `${filtered.length} products found`;

  document.getElementById('product-list').innerHTML = filtered.map((p, i) => `
    <div class="product-row ${i === 2 ? 'selected' : ''}" onclick="openProduct(${PRODUCTS.indexOf(p)})">
      <div class="prod-img" data-product-img="${p.id}" style="color:#868686">${p.img ? `<img src="${p.img}" alt="" style="width:100%;height:100%;object-fit:contain;border-radius:4px">` : icon('diamond', 'icon-lg')}</div>
      <div>
        <div class="prod-sku-line">
          <span class="sku">${p.id}</span>
          <div class="stock-dot ${p.stock > 10 ? 'green' : p.stock > 0 ? 'orange' : 'red'}"></div>
          <span class="stock-count">${p.stock}</span>
          ${!p.inStock ? '<span class="out-badge">Out of Stock</span>' : ''}
        </div>
        <div class="prod-name">${p.name}</div>
      </div>
      <div class="prod-price">£${p.price.toFixed(2)}</div>
      <button class="icon-btn" onclick="event.stopPropagation();addToWish()">${icon('heart')}</button>
      <button class="icon-btn" onclick="event.stopPropagation();addToCart()">${icon('cart')}</button>
    </div>
  `).join('') || '<div style="padding:40px;text-align:center;color:var(--muted)">No products found in this category.</div>';
}

// ─── PRODUCT DETAIL ─────────────────────────────────
function renderDetail() {
  const p = currentProduct;
  // Dynamic breadcrumb: Home / Brand / Category / Product name
  const brand = p.brand || 'OX';
  const bc = document.getElementById('detail-breadcrumb-bar');
  if (bc) bc.innerHTML = `
    <a onclick="navigate('home')" style="display:inline-flex;align-items:center">${icon('home','icon-sm')}</a>
    <span>/</span>
    <a onclick="navigate('listing')">${brand}</a>
    <span>/</span>
    <a onclick="navigate('listing')">${p.cat}</a>
    <span>/</span>
    <span>${p.name}</span>
  `;
  // Init gallery state (4 slots — reuse product image across all for demo)
  _galleryImages = [p.img, p.img, p.img, p.img];
  _galleryIdx    = 0;

  const sizes = ['600/25.4mm', '500/25.4mm', '450/25.4mm', '400/25.4mm', '400/20mm'];

  document.getElementById('detail-content').innerHTML = `
    <div>
      <div class="gallery-main">
        <div id="gallery-main-view" class="gallery-main-view" data-product-img="${p.id}">
          ${p.img ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain">` : icon('diamond', 'icon-lg')}
        </div>
        <div class="gallery-nav prev" onclick="galleryNav(-1)">${icon('chevronLeft')}</div>
        <div class="gallery-nav next" onclick="galleryNav(1)">${icon('chevronRight')}</div>
      </div>
      <div class="gallery-thumbs">
        ${[0, 1, 2, 3].map(i => `
          <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-product-img="${p.id}" onclick="galleryGoTo(${i})">
            ${p.img ? `<img src="${p.img}" alt="" style="width:100%;height:100%;object-fit:contain">` : icon('diamond')}
          </div>`).join('')}
      </div>
    </div>
    <div>
      <div class="prod-id-line">
        <span style="display:flex;align-items:center;gap:4px">${icon('copy', 'icon-sm')} PRODUCT ID: <strong>${p.id}</strong></span>
        <span style="display:flex;align-items:center;gap:4px">${icon('package', 'icon-sm')} BARCODE: 5060135477806</span>
      </div>
      <h1 class="prod-detail-title">${p.name}</h1>
      <div class="avail">● ${p.stock} pcs available</div>
      <div class="detail-price">£${p.price.toFixed(2)}</div>
      <div class="add-to-cart-row">
        <div class="qty-control">
          <div class="qty-btn" onclick="changeQty(-1)">−</div>
          <input class="qty-input" id="qty-val" value="1" type="number" min="1">
          <div class="qty-btn" onclick="changeQty(1)">+</div>
        </div>
        <button class="btn-atc" onclick="addToCart()">Add to Cart ${icon('cart')}</button>
        <button class="btn-wish" onclick="addToWish()">${icon('heart')}</button>
      </div>
      ${p.cat === 'Diamond Tools' ? `
      <div class="size-label">Available Size</div>
      <div class="size-options">
        ${sizes.map((s, i) => `<div class="size-btn ${i === 2 ? 'active' : ''}" onclick="selectSize(this)">${s}</div>`).join('')}
      </div>` : ''}
      <div class="detail-specs">
        <div class="spec-row"><span class="spec-label">Order Time</span><span class="spec-val">Order before 12pm despatched same day</span></div>
        <div class="spec-row"><span class="spec-label">Product Guarantee</span><span class="spec-val">No hassle guarantee – no bull. Just OX!</span></div>
        <div class="spec-row"><span class="spec-label">Product Specifications</span><span class="spec-val"><a href="#">Download PDF ↓</a></span></div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:16px">
        <h3 class="desc-title">Description</h3>
        <div class="desc-text">The ${p.name} is a dual-purpose blade that perfectly cuts through both asphalt and concrete. It comes with a 10mm segment height, wedge segment undercut protection and a narrow gullet.</div>
      </div>
    </div>
  `;

  // Related products
  const related = PRODUCTS.filter(r => r.cat === p.cat && r.id !== p.id).slice(0, 5);
  document.getElementById('related-products').innerHTML = related.map(r => `
    <div class="product-row" onclick="openProduct(${PRODUCTS.indexOf(r)})">
      <div class="prod-img" style="color:#868686">${icon(r.img, 'icon-lg')}</div>
      <div>
        <div class="prod-sku-line"><span class="sku">${r.id}</span><div class="stock-dot ${r.stock > 10 ? 'green' : 'orange'}"></div><span class="stock-count">${r.stock}</span></div>
        <div class="prod-name">${r.name}</div>
      </div>
      <div class="prod-price">£${r.price.toFixed(2)}</div>
      <button class="icon-btn" onclick="event.stopPropagation();addToWish()">${icon('heart')}</button>
      <button class="icon-btn" onclick="event.stopPropagation();addToCart()">${icon('cart')}</button>
    </div>
  `).join('');

  buildFAQ('detail-faq', FAQS.slice(0, 4));
}

// ─── CART ───────────────────────────────────────────
function renderCart() {
  const totalQty = CART_ITEMS.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count-label').textContent = `${CART_ITEMS.length} products \u00a0 ${totalQty} items`;
  document.getElementById('cart-badge').textContent = CART_ITEMS.length;

  if (CART_ITEMS.length === 0) {
    document.getElementById('cart-table').innerHTML = `
      <div class="cart-empty-state">
        <div style="color:var(--muted)">${icon('cart', 'icon-xl')}</div>
        <h2 class="cart-empty-title">There Is No Products</h2>
        <div class="cart-empty-sub">Add products to see products in cart. Explore our product list</div>
        <div class="cart-empty-btns">
          <button class="btn-explore" onclick="navigate('listing')">Explore Products</button>
          <button class="btn-csv">Upload CSV</button>
        </div>
        <div style="font-size:13px;color:var(--muted);margin-top:12px">Have any questions? <a href="#" style="color:var(--blue)">Support request</a></div>
      </div>
    `;
  } else {
    document.getElementById('cart-table').innerHTML = CART_ITEMS.map((item, i) => `
      <div class="cart-row">
        <div class="prod-img" style="color:#868686">${icon(item.img, 'icon-lg')}</div>
        <div>
          <div class="prod-sku-line"><span class="sku">${item.id}</span><div class="stock-dot ${item.stock > 10 ? 'green' : 'orange'}"></div><span class="stock-count">${item.stock}</span></div>
          <div class="prod-name">${item.name}</div>
        </div>
        <div>
          <div class="cart-orig">${item.lineOrig}</div>
          <div class="cart-price">${item.linePrice}</div>
        </div>
        <div class="qty-control">
          <div class="qty-btn" onclick="cartQty(${i},-1)">${icon('minus')}</div>
          <input class="qty-input" id="cart-qty-${i}" value="${item.qty}" type="number" min="1">
          <div class="qty-btn" onclick="cartQty(${i},1)">${icon('plus')}</div>
        </div>
        <button class="icon-btn">${icon('heart')}</button>
        <button class="icon-btn" onclick="removeCartItem(${i})" style="color:var(--red);border-color:var(--red)">${icon('trash')}</button>
      </div>
    `).join('');
  }

  buildCartFAQ('cart-faq');
}

// ─── CHECKOUT RENDERS ────────────────────────────────
function renderCheckoutShipping() {
  buildCartFAQ('checkout-shipping-faq');
}

function renderCheckoutPayment() {
  buildCartFAQ('checkout-payment-faq');
}

function renderCheckoutReview() {
  const itemsEl = document.getElementById('checkout-review-items');
  if (itemsEl) {
    itemsEl.innerHTML = CART_ITEMS.map(item => `
      <div class="review-item-row">
        <div class="prod-img" style="color:#868686">${icon(item.img, 'icon-lg')}</div>
        <div>
          <div class="prod-sku-line"><span class="sku">${item.id}</span><div class="stock-dot orange"></div><span class="stock-count">${item.stock}</span></div>
          <div class="prod-name">${item.name}</div>
        </div>
        <div class="review-qty">${item.qty}</div>
        <div class="review-price-col">
          <div class="cart-orig">${item.lineOrig}</div>
          <div class="cart-price">${item.linePrice}</div>
        </div>
      </div>
    `).join('');
  }
  // Show PO number if filled in
  const poInput = document.getElementById('po-number');
  const poDisplay = document.getElementById('review-po-display');
  if (poInput && poDisplay && poInput.value) {
    poDisplay.textContent = poInput.value;
  }
  buildCartFAQ('checkout-review-faq');
}

// ─── DATE RANGE PICKER ───────────────────────────────
function buildDateRangeFilter(instanceId, fromVal, toVal) {
  return `
    <div class="ret-date-filter">
      <label class="ret-date-label">Date filter</label>
      <div class="dp-fields-row">
        <div class="dp-field-wrap">
          <input class="ret-date-input dp-input" type="text" placeholder="From" readonly
            id="${instanceId}-from" value="${fromVal}"
            onclick="openDp('${instanceId}','from',event)">
          <div class="dp-popup" id="${instanceId}-from-popup" style="display:none"></div>
        </div>
        <div class="ret-date-sep"></div>
        <div class="dp-field-wrap">
          <input class="ret-date-input dp-input" type="text" placeholder="To" readonly
            id="${instanceId}-to" value="${toVal}"
            onclick="openDp('${instanceId}','to',event)">
          <div class="dp-popup" id="${instanceId}-to-popup" style="display:none"></div>
        </div>
      </div>
    </div>
  `;
}

// ─── CUSTOM SELECT BUILDER ───────────────────────────
function buildCustomSelect(id, opts, extraClass = '') {
  let firstLabel = '';
  const items = opts.map(opt => {
    if (opt === null) return `<div class="cust-select-sep"></div>`;
    if (!firstLabel) firstLabel = opt;
    const active = opt === firstLabel ? ' active' : '';
    const safeLabel = opt.replace(/'/g, '&#39;');
    return `<div class="cust-select-item${active}" data-label="${safeLabel}" onclick="pickCustomSelect('${id}','${safeLabel}')">${opt}<span class="cust-select-check">${icon('tick','icon-sm')}</span></div>`;
  }).join('');
  return `<div class="cust-select${extraClass ? ' ' + extraClass : ''}" id="${id}">
    <button class="cust-select-trigger" onclick="toggleCustomSelect('${id}');event.stopPropagation()">
      <span class="cust-select-value">${firstLabel}</span>${icon('chevronDown','icon-sm')}
    </button>
    <div class="cust-select-panel">${items}</div>
  </div>`;
}

// ─── ACCOUNT SETTINGS ────────────────────────────────

function buildAccSidebar(activePage) {
  const purchasesSub = ['account-purchases', 'account-returns', 'account-reorder'];
  const billingSub   = ['account-invoices', 'account-transaction-history', 'account-print-statement'];
  const settingsSub  = ['account-profile','account-email','account-address','account-password'];
  const casesSub     = ['account-cases','account-newcase'];
  const purchasesOpen = purchasesSub.includes(activePage);
  const billingOpen   = billingSub.includes(activePage);
  const settingsOpen  = settingsSub.includes(activePage);
  const casesOpen     = casesSub.includes(activePage);

  function tab(page, label, opts = {}) {
    const isActive = activePage === page;
    const right = opts.badge
      ? `<span class="acct-tab-badge">${opts.badge}</span>`
      : opts.chevron
        ? `<span class="acct-tab-chevron">${icon('chevronDown','icon-sm')}</span>`
        : '';
    const onclick = opts.onclick || (page ? `navigate('${page}')` : '');
    return `<div class="acct-tab${isActive ? ' active' : ''}" onclick="${onclick}">
      <span>${label}</span>${right ? `<span class="acct-tab-right">${right}</span>` : ''}
    </div>`;
  }

  function subtab(page, label) {
    const onclick = page ? ` onclick="navigate('${page}')"` : '';
    return `<button class="acct-subtab${activePage === page ? ' active' : ''}"${onclick}>${label}</button>`;
  }

  return `
    ${tab('account-overview', 'Overview')}
    <div class="acct-tab${purchasesOpen ? ' open' : ''}" onclick="toggleAccSection(this)">
      <span>Purchases</span>
      <span class="acct-tab-right"><span class="acct-tab-chevron">${icon('chevronDown','icon-sm')}</span></span>
    </div>
    <div class="acct-sublist${purchasesOpen ? ' open' : ''}">
      ${subtab('account-purchases', 'Purchases History')}
      ${subtab('account-returns', 'Returns')}
      ${subtab('account-reorder', 'Reorder Items')}
    </div>
    ${tab('account-favourites', 'Favourites', { badge: '25' })}
    <div class="acct-tab${billingOpen ? ' open' : ''}" onclick="toggleAccSection(this)">
      <span>Billing</span>
      <span class="acct-tab-right"><span class="acct-tab-chevron">${icon('chevronDown','icon-sm')}</span></span>
    </div>
    <div class="acct-sublist${billingOpen ? ' open' : ''}">
      ${subtab('account-invoices', 'Invoices')}
      ${subtab('account-transaction-history', 'Transaction History')}
      ${subtab('account-print-statement', 'Print a Statement')}
    </div>
    <div class="acct-tab${settingsOpen ? ' open' : ''}" onclick="toggleAccSection(this)">
      <span>Settings</span>
      <span class="acct-tab-right"><span class="acct-tab-chevron">${icon('chevronDown','icon-sm')}</span></span>
    </div>
    <div class="acct-sublist${settingsOpen ? ' open' : ''}">
      ${subtab('account-profile',  'Profile Information')}
      ${subtab('account-email',    'Email Preferences')}
      ${subtab('account-address',  'Address Book')}
      ${subtab('account-password', 'Update Your Password')}
    </div>
    <div class="acct-tab${casesOpen ? ' open' : ''}" onclick="toggleAccSection(this)">
      <span>Cases</span>
      <span class="acct-tab-right"><span class="acct-tab-chevron">${icon('chevronDown','icon-sm')}</span></span>
    </div>
    <div class="acct-sublist${casesOpen ? ' open' : ''}">
      ${subtab('account-cases',   'Support Cases')}
      ${subtab('account-newcase', 'Submit New Case')}
    </div>
    ${tab('', 'Log Out', { onclick: 'openLogoutModal()' })}
  `;
}

function buildAccBreadcrumb() {
  return `<div class="acct-breadcrumb">
    <span class="acct-breadcrumb-home" onclick="navigate('home')">${icon('home','icon-sm')}</span>
    <span class="acct-breadcrumb-sep">/</span>
    <span class="acct-breadcrumb-current">Account Settings</span>
  </div>`;
}

function buildAccFooter() {
  return `<footer class="home-footer">
    <div class="home-footer-bg"></div>
    <div class="home-footer-columns">
      <div class="home-footer-col"><h4>Products</h4><a onclick="navigateBrand('OX')">OX</a><a onclick="navigateBrand('BORA')">BORA</a><a onclick="navigateBrand('TRACER')">TRACER</a><a onclick="navigateBrand('SMART')">SMART</a><a onclick="navigateBrand('UNITEC')">UNITEC</a></div>
      <div class="home-footer-col"><h4>About Us</h4><a>Blog</a><a class="blue">News</a><a>Videos</a><a>Catalogs</a></div>
      <div class="home-footer-col"><h4>Help</h4><a>Support Requests</a><a>All Contacts</a><a>Orders</a><a>Returns</a><a>FAQs</a></div>
      <div class="home-footer-col"><h4>Social</h4><a>LinkedIn</a></div>
      <div class="home-footer-col"><div class="home-footer-contact"><span class="home-footer-contact-email">hello@oxgroup.com</span><span class="home-footer-contact-phone">+44 (0) 1522 500 700</span><div class="home-footer-contact-address">Newland House, Weaver Road, Lincoln, Lincolnshire, England, LN6 3QN</div></div></div>
    </div>
    <div class="home-footer-bottom">
      <div class="home-footer-logo-text"><span>OX</span> GROUP</div>
      <div class="home-footer-bottom-links"><a>Terms &amp; Conditions</a><a>Privacy Policy</a><a>Cookies Settings</a><a>© 2025 OX Group. All rights reserved.</a></div>
    </div>
  </footer>`;
}

function renderAccountOverview() {
  const el = document.getElementById('page-account-overview');
  const purchaseRows = PURCHASES.map((p, i) => {
    const statusClass = p.status === 'Billed' ? 'billed' : 'pending';
    return `<tr${i === 0 ? ' class="selected"' : ''}>
      <td>${p.id}</td>
      <td><span class="acct-status ${statusClass}">${p.status}</span></td>
      <td>${p.date}</td>
      <td>${p.po}</td>
      <td>${p.shipped || '—'}</td>
      <td>${p.amount}</td>
      <td>${p.track || '—'}</td>
    </tr>`;
  }).join('');

  el.innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-overview')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Overview</h1>
        <div>
          <div class="acct-table-header">
            <h2 class="acct-section-heading">Recent Purchases</h2>
            <button class="btn-view-history" onclick="navigate('account-purchases')">View Purchases History</button>
          </div>
          <table class="acct-data-table">
            <thead><tr><th>Purchase ID</th><th>Status</th><th>Order Date</th><th>PO Number</th><th>Shipped Date</th><th>Amount</th><th>Track No.</th></tr></thead>
            <tbody>${purchaseRows}</tbody>
          </table>
        </div>
        <div>
          <h2 class="acct-section-heading" style="margin-bottom:20px">My Settings</h2>
          <div class="my-settings-rows" style="display:flex;flex-direction:column;gap:24px">
            <div style="display:flex;gap:32px;align-items:flex-start">
              <div class="acct-section-label">
                <h3 class="acct-section-title">Profile</h3>
                <div class="acct-section-desc">Information of your business</div>
              </div>
              <div class="settings-info-card" style="flex:1">
                <div class="settings-info-name">Acme Corporation</div>
                <div class="settings-info-meta">
                  <span>hello@gmail.com</span>
                  <span>+44 34 5467 0123</span>
                </div>
              </div>
            </div>
            <div style="display:flex;gap:32px;align-items:flex-start">
              <div class="acct-section-label">
                <h3 class="acct-section-title">Shipping</h3>
                <div class="acct-section-desc">Where your order should be delivered and who will receive it</div>
              </div>
              <div class="settings-info-card" style="flex:1">
                <div class="settings-info-name">18 Industrial Park Road, Unit 4, Manchester, M17 1PA, UK</div>
                <div class="settings-info-meta">
                  <span>Contact Person:</span>
                  <span>Thomas (+44 34 5467 0123)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

function renderAccountProfile() {
  document.getElementById('page-account-profile').innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-profile')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Profile Information</h1>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">Company name <span style="color:var(--red)">*</span></h3>
            <div class="acct-section-desc">Official name of your business</div>
          </div>
          <div class="acct-section-control">
            <div class="acct-input-wrap">
              <span class="acct-input-icon">${icon('building','icon-sm')}</span>
              <input class="acct-input" type="text" value="Acme Corporation" placeholder="Company name">
            </div>
          </div>
        </div>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">Phone number <span style="color:var(--red)">*</span></h3>
            <div class="acct-section-desc">Your main contact number</div>
          </div>
          <div class="acct-section-control">
            <div class="acct-phone-wrap">
              <div class="acct-phone-flag">🇬🇧 +44</div>
              <input class="acct-phone-num" type="tel" value="34 5467 0123" placeholder="Phone number">
            </div>
          </div>
        </div>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">Email <span style="color:var(--red)">*</span></h3>
            <div class="acct-section-desc">Receive important notification about your orders, requests, promotions, etc</div>
          </div>
          <div class="acct-section-control">
            <div class="acct-input-wrap">
              <span class="acct-input-icon">${icon('mail','icon-sm')}</span>
              <input class="acct-input" type="email" value="hello@gmail.com" placeholder="Email address">
            </div>
            <div class="acct-btn-row">
              <button class="acct-btn-cancel">Cancel</button>
              <button class="acct-btn-update" onclick="showToast('Profile updated','check')">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

function renderAccountEmail() {
  document.getElementById('page-account-email').innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-email')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Email Preferences</h1>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">Notification <span style="color:var(--red)">*</span></h3>
            <div class="acct-section-desc">Recommendation: Leave "Important Notifications" enabled in order to receive all important messages</div>
          </div>
          <div class="acct-section-control">
            <div class="acct-checkbox-group">
              <label class="acct-checkbox-item"><input type="checkbox" checked> Important Notifications</label>
              <label class="acct-checkbox-item"><input type="checkbox" checked> Product Updates</label>
              <label class="acct-checkbox-item"><input type="checkbox" checked> TeamOX News</label>
              <label class="acct-checkbox-item"><input type="checkbox" checked> Transaction Reminders</label>
            </div>
            <div class="acct-btn-row">
              <button class="acct-btn-cancel">Cancel</button>
              <button class="acct-btn-update" onclick="showToast('Preferences updated','check')">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

function renderAccountAddress() {
  document.getElementById('page-account-address').innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-address')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Address Book</h1>
        <div class="addr-book-card">
          <div class="addr-book-addr">18 Industrial Park Road, Unit 4, Manchester, M17 1PA, UK</div>
          <div class="addr-book-contact">Contact Person:<br>Thomas (+44 34 5467 0123)</div>
          <div class="addr-book-tags">
            <span class="addr-book-tag">${icon('info','icon-sm')} Default Delivery</span>
            <span class="addr-book-tag">${icon('info','icon-sm')} Default Billing</span>
          </div>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

function renderAccountPassword() {
  document.getElementById('page-account-password').innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-password')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Update Your Password</h1>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">Current password <span style="color:var(--red)">*</span></h3>
            <div class="acct-section-desc">Enter your existing password for verification</div>
          </div>
          <div class="acct-section-control">
            <div class="acct-pwd-wrap">
              <input class="acct-input" type="password" placeholder="">
              <button class="acct-eye-btn" onclick="togglePwd(this)">${icon('eyeOff','icon-sm')}</button>
            </div>
          </div>
        </div>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">New password <span style="color:var(--red)">*</span></h3>
            <div class="acct-section-desc">Create a new password for your account</div>
          </div>
          <div class="acct-section-control">
            <div class="acct-pwd-wrap">
              <input class="acct-input" type="password" placeholder="">
              <button class="acct-eye-btn" onclick="togglePwd(this)">${icon('eyeOff','icon-sm')}</button>
            </div>
            <div class="acct-pwd-hints">
              <div class="acct-pwd-hint">✓ Must be at least 8 characters</div>
              <div class="acct-pwd-hint">✓ Must contain at least one uppercase letter (A–Z)</div>
              <div class="acct-pwd-hint">✓ Must include at least one number (0–9)</div>
            </div>
          </div>
        </div>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">Submit new password <span style="color:var(--red)">*</span></h3>
            <div class="acct-section-desc">Re-enter your new password to confirm</div>
          </div>
          <div class="acct-section-control">
            <div class="acct-pwd-wrap">
              <input class="acct-input" type="password" placeholder="">
              <button class="acct-eye-btn" onclick="togglePwd(this)">${icon('eyeOff','icon-sm')}</button>
            </div>
            <div class="acct-section-desc" style="margin-top:4px">Click the Save button at the top to apply your changes</div>
            <div class="acct-btn-row">
              <button class="acct-btn-cancel">Cancel</button>
              <button class="acct-btn-update" onclick="showToast('Password updated','check')">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

function renderAccountCases() {
  const rows = SUPPORT_CASES.map((c, i) => `
    <tr${i === 0 ? ' class="selected"' : ''}>
      <td>${c.id}</td>
      <td>${c.subject}</td>
      <td>${c.created}</td>
      <td>${c.lastMsg || '—'}</td>
      <td><span class="acct-status ${c.status.toLowerCase()}">${c.status}</span></td>
    </tr>
  `).join('');

  document.getElementById('page-account-cases').innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-cases')}</aside>
      <div class="acct-content">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px">
          <h1 class="acct-title">Support Cases</h1>
          <button class="btn-new-case" onclick="navigate('account-newcase')">${icon('plus','icon-sm')} Submit New Case</button>
        </div>
        <div>
          <div class="cases-sort-row">
            ${buildCustomSelect('cases-sort', ['Created Date: Newest', 'Created Date: Oldest', null, 'Status: Open', 'Status: Closed'])}
          </div>
          <table class="acct-data-table">
            <thead><tr><th>Case ID</th><th>Subject</th><th>Created Date</th><th>Last Message</th><th>Status</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

function renderAccountNewCase() {
  document.getElementById('page-account-newcase').innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-newcase')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Submit New Case</h1>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">Subject <span style="color:var(--red)">*</span></h3>
            <div class="acct-section-desc">Official name of your business</div>
          </div>
          <div class="acct-section-control">
            <input class="acct-input" type="text" placeholder="">
          </div>
        </div>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">Type of inquiry (optional)</h3>
            <div class="acct-section-desc">Pick one of the reasons of your request from the list and describe your request</div>
          </div>
          <div class="acct-section-control">
            ${buildCustomSelect('case-type', ['Account issues', 'Product issue', 'Missing goods', 'Warranty', 'Short-supplied goods'], 'cust-select--field')}
          </div>
        </div>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">Notes <span style="color:var(--red)">*</span></h3>
            <div class="acct-section-desc">Add detailed explanation for your request</div>
          </div>
          <div class="acct-section-control">
            <textarea class="acct-textarea" placeholder="E.g. I want to change my account email address."></textarea>
          </div>
        </div>
        <div class="acct-section">
          <div class="acct-section-label">
            <h3 class="acct-section-title">Contact email <span style="color:var(--red)">*</span></h3>
            <div class="acct-section-desc">This email will be used for communication regarding your case.</div>
          </div>
          <div class="acct-section-control">
            <div class="acct-radio-group">
              <label class="acct-radio-option" onclick="selectCaseEmail(this)">
                <input type="radio" name="case-email" checked>
                <div>
                  <div class="acct-radio-label">Send to my company email</div>
                  <div class="acct-radio-sub">hello@gmail.com</div>
                </div>
              </label>
              <label class="acct-radio-option sel" onclick="selectCaseEmail(this)">
                <input type="radio" name="case-email">
                <div style="width:100%">
                  <div class="acct-radio-label">Send to an alternative email</div>
                  <div class="acct-input-wrap" style="margin-top:10px">
                    <span class="acct-input-icon">${icon('mail','icon-sm')}</span>
                    <input class="acct-input" type="email" value="acmencorporation@gmail.com" placeholder="Alternative email">
                  </div>
                </div>
              </label>
            </div>
            <button class="btn-submit-case" onclick="showToast('Case submitted successfully','check')">Submit</button>
          </div>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

function renderAccountFavourites() {
  const el = document.getElementById('page-account-favourites');
  const all = favStockOnly ? PRODUCTS.filter(p => p.inStock) : PRODUCTS;
  const totalPages = Math.ceil(all.length / FAV_PER_PAGE);
  const items = all.slice((favPage - 1) * FAV_PER_PAGE, favPage * FAV_PER_PAGE);

  const rows = items.map(p => {
    const stockBadge = p.inStock
      ? `<span class="fav-stock-dot"></span><span class="fav-stock-count">${p.stock}</span>`
      : `<span class="fav-stock-dot out"></span><span class="fav-stock-count">Out of Stock</span>`;
    return `
      <div class="fav-row">
        <div class="fav-img-cell">
          <span class="fav-img-icon">${icon(p.img, 'icon')}</span>
        </div>
        <div class="fav-info">
          <div class="fav-meta">
            <span class="fav-code" onclick="copyFavCode('${p.id}')">${icon('copy','icon-sm')} ${p.id}</span>
            <span class="fav-stock-indicator">${stockBadge}</span>
          </div>
          <div class="fav-name">${p.name}</div>
        </div>
        <div class="fav-price-cell">£${p.price.toFixed(2)}</div>
        <div class="fav-actions">
          <button class="fav-icon-btn" title="Remove from favourites" onclick="removeFromFav('${p.id}')">${icon('heart','icon')}</button>
          <button class="fav-icon-btn" title="Add to cart" onclick="addFavToCart('${p.id}')">${icon('cart','icon')}</button>
        </div>
      </div>`;
  }).join('');

  const prevOff = favPage <= 1 ? ' disabled' : '';
  const nextOff = favPage >= totalPages ? ' disabled' : '';
  const pageNums = Array.from({length: totalPages}, (_, i) => i + 1)
    .map(n => `<button class="fav-page-btn${n === favPage ? ' active' : ''}" onclick="setFavPage(${n})">${n}</button>`)
    .join('');
  const pagination = totalPages > 1 ? `
    <div class="fav-pagination">
      <button class="fav-page-btn"${prevOff} onclick="setFavPage(${favPage - 1})">${icon('chevronLeft','icon-sm')}</button>
      ${pageNums}
      <button class="fav-page-btn"${nextOff} onclick="setFavPage(${favPage + 1})">${icon('chevronRight','icon-sm')}</button>
    </div>` : '';

  el.innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-favourites')}</aside>
      <div class="acct-content">
        <div class="fav-header">
          <h1 class="acct-title">Favourites</h1>
          <button class="fav-clear-btn" onclick="clearFavourites()">${icon('trash','icon-sm')} Clear</button>
        </div>
        <div>
          <div class="fav-filters">
            <div class="fav-toggle-wrap" onclick="toggleFavStock()">
              <div class="fav-toggle${favStockOnly ? ' on' : ''}"><div class="fav-toggle-knob"></div></div>
              <span class="fav-toggle-label">In Stock Only</span>
            </div>
            ${buildCustomSelect('fav-sort', ['Newest First', 'Price: Low to High', 'Price: High to Low'])}
          </div>
          <div class="fav-divider"></div>
          <div class="fav-rows">${rows}</div>
          ${pagination}
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

// ─── ACCOUNT RETURNS ─────────────────────────────────
function renderAccountReturns() {
  const el = document.getElementById('page-account-returns');

  const rows = RETURNS.map((r, i) => `
    <tr${i === 0 ? ' class="selected"' : ''}>
      <td>
        <span style="display:flex;align-items:center;gap:6px">
          ${r.id}
          <button class="icon-btn" onclick="copyReturnId('${r.id}')" title="Copy ID">${icon('copy','icon-sm')}</button>
        </span>
      </td>
      <td>${r.date}</td>
      <td>${r.items}</td>
      <td>${r.amount}</td>
      <td><span class="acct-status pending">${r.status}</span></td>
    </tr>
  `).join('');

  el.innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-returns')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Returns</h1>
        <div class="ph-section">
          <div class="ph-toolbar ret-toolbar">
            ${buildDateRangeFilter('ret-dp', returnsDateFrom, returnsDateTo)}
            ${buildCustomSelect('returns-sort', ['Newest First', 'Oldest First', 'Amount: High to Low', 'Amount: Low to High'])}
          </div>
          <div class="acct-divider"></div>
          <table class="acct-data-table">
            <thead><tr>
              <th>Return ID</th><th>Date</th><th>Items</th><th>Amount</th><th>Status</th>
            </tr></thead>
            <tbody>${rows || '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:32px">No returns found</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

// ─── ACCOUNT REORDER ITEMS ───────────────────────────
function renderAccountReorder() {
  const el = document.getElementById('page-account-reorder');
  const items = reorderStockOnly ? REORDER_ITEMS.filter(p => p.inStock) : REORDER_ITEMS;

  const rows = items.map((p, i) => {
    const qty = reorderQtys[i] != null ? reorderQtys[i] : 1;
    const stockDot = p.stock <= 10 ? 'orange' : 'green';
    const priceHtml = p.orig
      ? `<div class="reorder-price-orig">£${p.orig.toFixed(2)}</div><div class="reorder-price-cur">£${p.price.toFixed(2)}</div>`
      : `<div class="reorder-price-cur">£${p.price.toFixed(2)}</div>`;
    return `
      <div class="reorder-row">
        <div class="reorder-thumb">${icon(p.img, 'icon-lg')}</div>
        <div class="reorder-info">
          <div class="reorder-meta">
            <span class="reorder-sku" onclick="copyReorderCode('${p.id}')">${icon('copy','icon-sm')} ${p.id}</span>
            <span class="reorder-stock"><span class="reorder-stock-dot ${stockDot}"></span>${p.stock}</span>
            <span class="reorder-last-order">Last order: ${p.lastOrder}</span>
          </div>
          <div class="reorder-name">${p.name}</div>
        </div>
        <div class="reorder-price-cell">${priceHtml}</div>
        <div class="reorder-qty-stepper">
          <button class="reorder-qty-btn" onclick="reorderQtyChange(${i},-1)">−</button>
          <span class="reorder-qty-val" id="reorder-qty-${i}">${qty}</span>
          <button class="reorder-qty-btn" onclick="reorderQtyChange(${i},1)">+</button>
        </div>
        <button class="reorder-cart-btn" onclick="reorderAddToCart(${i})" title="Add to cart">${icon('cart','icon-sm')}</button>
      </div>`;
  }).join('');

  el.innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-reorder')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Reorder Items</h1>
        <div class="ph-section">
          <div class="ph-toolbar reorder-toolbar">
            <div class="fav-toggle-wrap" onclick="toggleReorderStock()">
              <div class="fav-toggle${reorderStockOnly ? ' on' : ''}"><div class="fav-toggle-knob"></div></div>
              <span class="fav-toggle-label">In Stock Only</span>
            </div>
            <div style="display:flex;gap:12px">
              ${buildCustomSelect('reorder-period', ['Last 15 Days', 'Last 30 Days', 'Last 90 Days', 'All Time'])}
              ${buildCustomSelect('reorder-sort', ['Most Ordered', 'Newest First', 'Price: Low to High', 'Price: High to Low'])}
            </div>
          </div>
          <div class="acct-divider"></div>
          <div class="reorder-rows">${rows || '<div style="padding:32px;text-align:center;color:var(--muted)">No items found</div>'}</div>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

// ─── ACCOUNT INVOICES ────────────────────────────────
function renderAccountInvoices() {
  const el = document.getElementById('page-account-invoices');
  const isPaid = invoicesFilter === 'paid';
  const all = INVOICES.filter(inv => inv.status === (isPaid ? 'paid' : 'open'));
  const totalPages = Math.max(1, Math.ceil(all.length / INV_PER_PAGE));
  if (invoicesPage > totalPages) invoicesPage = 1;
  const items = all.slice((invoicesPage - 1) * INV_PER_PAGE, invoicesPage * INV_PER_PAGE);

  const rows = items.map(inv => {
    const isSel = !!invoicesChecked[inv.id];
    const lastCell = isPaid
      ? `<td><span class="acct-status inv-paid">Paid</span></td>
         <td style="color:var(--muted)">${inv.paymentDate || '—'}</td>`
      : `<td>${inv.dueDate}</td>`;
    return `
      <tr${isSel ? ' class="selected"' : ''}>
        <td class="inv-cb-cell">
          <input type="checkbox" class="inv-checkbox"${isSel ? ' checked' : ''}
            onclick="toggleInvoiceCheck('${inv.id}',this)">
        </td>
        <td>
          <span style="display:flex;align-items:center;gap:6px">
            Invoice #${inv.id}
            <button class="icon-btn" onclick="copyInvoiceId('${inv.id}')" title="Copy">${icon('copy','icon-sm')}</button>
          </span>
        </td>
        <td>${inv.date}</td>
        <td>${inv.amount}</td>
        ${lastCell}
      </tr>`;
  }).join('');

  const allChecked = items.length > 0 && items.every(inv => invoicesChecked[inv.id]);
  const prevOff = invoicesPage <= 1 ? ' disabled' : '';
  const nextOff = invoicesPage >= totalPages ? ' disabled' : '';
  const pageNums = Array.from({length: totalPages}, (_, i) => i + 1)
    .map(n => `<button class="inv-page-btn${n === invoicesPage ? ' active' : ''}" onclick="setInvoicesPage(${n})">${n}</button>`)
    .join('');

  const sortOpts = isPaid
    ? ['Payment Date: Newest', 'Payment Date: Oldest', 'Amount: High to Low', 'Amount: Low to High']
    : ['Close Date: Newest', 'Close Date: Oldest', 'Amount: High to Low', 'Amount: Low to High'];

  const actionBtn = isPaid
    ? `<button class="inv-dl-btn" onclick="showToast('Downloading statement','check')">${icon('download','icon-sm')} Download Statement</button>`
    : `<button class="inv-pay-btn" onclick="showToast('Payment initiated','check')">Make a Payment</button>`;

  const colSpan = isPaid ? 6 : 5;
  const lastTh  = isPaid
    ? `<th>Status</th><th>Payment Date</th>`
    : `<th>Due Date</th>`;

  el.innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-invoices')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Invoices</h1>
        <div class="ph-section">
          <div class="ph-filter-tabs">
            <div class="ph-filter-tab${invoicesFilter === 'open' ? ' active' : ''}" onclick="setInvoicesFilter('open')">Open</div>
            <div class="ph-filter-tab${invoicesFilter === 'paid' ? ' active' : ''}" onclick="setInvoicesFilter('paid')">Paid in Full</div>
          </div>
          <div class="ph-toolbar inv-toolbar">
            <div style="display:flex;gap:12px">
              ${buildCustomSelect('inv-records', ['All Records', 'Selected Records'])}
              ${buildCustomSelect('inv-sort', sortOpts)}
            </div>
            ${actionBtn}
          </div>
          <div class="acct-divider"></div>
          <table class="acct-data-table inv-table">
            <thead><tr>
              <th class="inv-cb-cell">
                <input type="checkbox" class="inv-checkbox"${allChecked ? ' checked' : ''}
                  onclick="toggleAllInvoices(this)">
              </th>
              <th>Invoice ID</th><th>Date</th><th>Amount</th>${lastTh}
            </tr></thead>
            <tbody>${rows || `<tr><td colspan="${colSpan}" style="text-align:center;color:var(--muted);padding:32px">No invoices found</td></tr>`}</tbody>
          </table>
          <div class="inv-pagination">
            <button class="inv-page-btn"${prevOff} onclick="setInvoicesPage(${invoicesPage - 1})">${icon('chevronLeft','icon-sm')}</button>
            ${pageNums}
            <button class="inv-page-btn"${nextOff} onclick="setInvoicesPage(${invoicesPage + 1})">${icon('chevronRight','icon-sm')}</button>
          </div>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

// ─── ACCOUNT TRANSACTION HISTORY ─────────────────────
function renderAccountTransactionHistory() {
  const el = document.getElementById('page-account-transaction-history');
  const totalPages = Math.max(1, Math.ceil(TRANSACTIONS.length / TX_PER_PAGE));
  if (txPage > totalPages) txPage = 1;
  const items = TRANSACTIONS.slice((txPage - 1) * TX_PER_PAGE, txPage * TX_PER_PAGE);

  const STATUS_LABEL = { 'paid-full': 'Paid in Full', 'deposited': 'Deposited', 'fully-applied': 'Fully Applied' };

  const rows = items.map(tx => `
    <tr>
      <td>
        <span style="display:flex;align-items:center;gap:6px">
          ${tx.type} #${tx.id}
          <button class="icon-btn" onclick="copyTxId('${tx.id}')" title="Copy">${icon('copy','icon-sm')}</button>
        </span>
      </td>
      <td>${tx.date}</td>
      <td>${tx.amount}</td>
      <td><span class="acct-status tx-${tx.status}">${STATUS_LABEL[tx.status] || tx.status}</span></td>
    </tr>`).join('');

  const prevOff = txPage <= 1 ? ' disabled' : '';
  const nextOff = txPage >= totalPages ? ' disabled' : '';
  const pageNums = Array.from({length: totalPages}, (_, i) => i + 1)
    .map(n => `<button class="inv-page-btn${n === txPage ? ' active' : ''}" onclick="setTxPage(${n})">${n}</button>`)
    .join('');

  el.innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-transaction-history')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Transaction History</h1>
        <div class="ph-section">
          <div class="ph-toolbar tx-toolbar">
            ${buildDateRangeFilter('tx-dp', txDateFrom, txDateTo)}
            <div style="display:flex;gap:12px;align-items:center">
              ${buildCustomSelect('tx-records', ['All Records', 'Invoices', 'Payments', 'Credit Memos'])}
              ${buildCustomSelect('tx-sort', ['Newest First', 'Oldest First', 'Amount: High to Low', 'Amount: Low to High'])}
            </div>
          </div>
          <div class="acct-divider"></div>
          <table class="acct-data-table">
            <thead><tr>
              <th>Transaction ID</th><th>Date</th><th>Amount</th><th>Status</th>
            </tr></thead>
            <tbody>${rows || `<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:32px">No transactions found</td></tr>`}</tbody>
          </table>
          <div class="inv-pagination">
            <button class="inv-page-btn"${prevOff} onclick="setTxPage(${txPage - 1})">${icon('chevronLeft','icon-sm')}</button>
            ${pageNums}
            <button class="inv-page-btn"${nextOff} onclick="setTxPage(${txPage + 1})">${icon('chevronRight','icon-sm')}</button>
          </div>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

// ─── ACCOUNT PRINT A STATEMENT ───────────────────────
function renderAccountPrintStatement() {
  const el = document.getElementById('page-account-print-statement');

  function dateInput(instanceId, val) {
    return `
      <div class="stmt-date-wrap dp-field-wrap">
        <input class="stmt-date-input" type="text" placeholder="DD/MM/YYYY" readonly
          id="${instanceId}-from" value="${val}"
          onclick="openDp('${instanceId}','from',event)">
        <span class="stmt-cal-icon" onclick="openDp('${instanceId}','from',event)">${icon('calendar','icon-sm')}</span>
        <div class="dp-popup" id="${instanceId}-from-popup" style="display:none"></div>
      </div>`;
  }

  el.innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-print-statement')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Print a Statement</h1>
        <div class="stmt-form">

          <div class="stmt-row">
            <div class="stmt-label">
              <h4 class="stmt-label-title">Statement date <span class="stmt-req">*</span></h4>
              <div class="stmt-label-desc">The statement includes all transactions up to the selected statement date. Optionally, set a start date to limit the period.</div>
            </div>
            <div class="stmt-controls">${dateInput('stmt-date', stmtDate)}</div>
          </div>

          <div class="stmt-divider"></div>

          <div class="stmt-row">
            <div class="stmt-label">
              <h4 class="stmt-label-title">Start date (optional)</h4>
              <div class="stmt-label-desc">Use this to limit the statement period.</div>
            </div>
            <div class="stmt-controls">${dateInput('stmt-start', stmtStartDate)}</div>
          </div>

          <div class="stmt-divider"></div>

          <div class="stmt-row">
            <div class="stmt-label">
              <h4 class="stmt-label-title">Statement preferences <span class="stmt-req">*</span></h4>
              <div class="stmt-label-desc">Choose how the statement should be generated and displayed.</div>
            </div>
            <div class="stmt-controls">
              <div class="stmt-checkboxes">
                <label class="stmt-cb-row">
                  <input type="checkbox" class="stmt-cb"${stmtPrefs.includes('locale') ? ' checked' : ''}
                    onchange="toggleStmtPref('locale',this)">
                  <span class="stmt-cb-label">Print in customer's locale</span>
                </label>
                <label class="stmt-cb-row">
                  <input type="checkbox" class="stmt-cb"${stmtPrefs.includes('open-only') ? ' checked' : ''}
                    onchange="toggleStmtPref('open-only',this)">
                  <span class="stmt-cb-label">Show only Open Transactions</span>
                </label>
                <label class="stmt-cb-row">
                  <input type="checkbox" class="stmt-cb"${stmtPrefs.includes('consolidated') ? ' checked' : ''}
                    onchange="toggleStmtPref('consolidated',this)">
                  <span class="stmt-cb-label">Consolidated Statement</span>
                </label>
              </div>
            </div>
          </div>

          <div class="stmt-actions">
            <button class="stmt-btn" onclick="showToast('Downloading PDF statement','download')">Download as PDF</button>
            <button class="stmt-btn" onclick="showToast('Statement sent via email','mail')">Email</button>
          </div>

        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

// ─── ACCOUNT PURCHASES HISTORY ───────────────────────
function renderAccountPurchases() {
  const el = document.getElementById('page-account-purchases');
  const visible = purchasesFilter === 'open'
    ? PURCHASES.filter(p => p.status !== 'Billed')
    : PURCHASES;

  function statusClass(s) {
    if (s === 'Billed')            return 'billed';
    if (s === 'Pending Fulfilled') return 'fulfilled';
    return 'pending';
  }

  const rows = visible.map((p, i) => `
    <tr${i === 0 ? ' class="selected"' : ''}>
      <td>
        <span style="display:flex;align-items:center;gap:6px">
          ${p.id}
          <button class="icon-btn" onclick="copyPurchaseId('${p.id}')" title="Copy ID">${icon('copy','icon-sm')}</button>
        </span>
      </td>
      <td><span class="acct-status ${statusClass(p.status)}">${p.status}</span></td>
      <td>${p.date}</td>
      <td>${p.po}</td>
      <td>${p.shipped || '—'}</td>
      <td>${p.amount}</td>
      <td>${p.track || (p.status === 'Pending Approval' ? 'N/A' : '—')}</td>
    </tr>
  `).join('');

  el.innerHTML = `
    ${buildAccBreadcrumb()}
    <div class="acct-layout">
      <aside class="acct-sidebar">${buildAccSidebar('account-purchases')}</aside>
      <div class="acct-content">
        <h1 class="acct-title">Purchases History</h1>
        <div class="ph-section">
          <div class="ph-filter-tabs">
            <div class="ph-filter-tab${purchasesFilter === 'open' ? ' active' : ''}" onclick="setPurchasesFilter('open')">Open</div>
            <div class="ph-filter-tab${purchasesFilter === 'all'  ? ' active' : ''}" onclick="setPurchasesFilter('all')">All</div>
          </div>
          <div class="ph-toolbar">
            ${buildCustomSelect('purchases-sort', ['Newest First', 'Oldest First', 'Amount: High to Low', 'Amount: Low to High'])}
          </div>
          <div class="acct-divider"></div>
          <table class="acct-data-table">
            <thead><tr>
              <th>Purchase ID</th><th>Status</th><th>Order Date</th>
              <th>PO Number</th><th>Shipped Date</th><th>Amount</th><th>Track No.</th>
            </tr></thead>
            <tbody>${rows || '<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:32px">No orders found</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    </div>
    ${buildAccFooter()}
  `;
}

function renderCheckoutThankyou() {
  const listTitle = document.getElementById('order-list-title');
  if (listTitle) listTitle.textContent = `Order list (${CART_ITEMS.length})`;
  const table = document.getElementById('order-table');
  if (table) {
    table.innerHTML = `
      <thead><tr><th>#</th><th>Product</th><th style="text-align:right">Quantity</th><th style="text-align:right">Price</th><th style="text-align:right">Amount</th></tr></thead>
      <tbody>
        ${CART_ITEMS.map((item, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${item.name}</td>
            <td style="text-align:right">${item.qty}</td>
            <td style="text-align:right">${item.linePrice}</td>
            <td style="text-align:right">${item.linePrice}</td>
          </tr>
        `).join('')}
      </tbody>
    `;
  }
}
