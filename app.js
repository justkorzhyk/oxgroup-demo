// ─── NAVIGATION ─────────────────────────────────────
const CHECKOUT_PAGES = ['checkout-shipping', 'checkout-payment', 'checkout-review', 'checkout-thankyou'];
const ACCOUNT_PAGES  = ['account-overview', 'account-profile', 'account-email', 'account-address', 'account-password', 'account-cases', 'account-newcase', 'account-favourites', 'account-purchases', 'account-returns', 'account-reorder', 'account-invoices', 'account-transaction-history', 'account-print-statement'];

const ROUTES = {
  home:                 '/',
  listing:              '/listing',
  detail:               '/detail',
  cart:                 '/cart',
  'checkout-shipping':  '/checkout/shipping',
  'checkout-payment':   '/checkout/payment',
  'checkout-review':    '/checkout/review',
  'checkout-thankyou':  '/checkout/thankyou',
  'account-overview':   '/account',
  'account-profile':    '/account/profile',
  'account-email':      '/account/email',
  'account-address':    '/account/address',
  'account-password':   '/account/password',
  'account-cases':      '/account/cases',
  'account-newcase':    '/account/cases/new',
  'account-favourites': '/account/favourites',
  'account-purchases':  '/account/purchases',
  'account-returns':    '/account/returns',
  'account-reorder':    '/account/reorder',
  'account-invoices':             '/account/invoices',
  'account-transaction-history': '/account/transaction-history',
  'account-print-statement':     '/account/print-statement',
};
const PATH_TO_PAGE = Object.fromEntries(Object.entries(ROUTES).map(([k, v]) => [v, k]));

function pageFromPath(path) {
  return PATH_TO_PAGE[path] || PATH_TO_PAGE['/' + path.replace(/^\//, '')] || 'home';
}

function navigate(page, opts = {}) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  window.scrollTo(0, 0);
  document.body.classList.toggle('page-checkout-mode', CHECKOUT_PAGES.includes(page));
  if (!opts.skipHistory) {
    history.pushState({ page }, '', ROUTES[page] || '/' + page);
  }
  if (page === 'home')                  renderHome();
  if (page === 'listing')               renderListing();
  if (page === 'detail')                renderDetail();
  if (page === 'cart')                  renderCart();
  if (page === 'checkout-shipping')     renderCheckoutShipping();
  if (page === 'checkout-payment')      renderCheckoutPayment();
  if (page === 'checkout-review')       renderCheckoutReview();
  if (page === 'checkout-thankyou')     renderCheckoutThankyou();
  if (page === 'account-overview')      renderAccountOverview();
  if (page === 'account-profile')       renderAccountProfile();
  if (page === 'account-email')         renderAccountEmail();
  if (page === 'account-address')       renderAccountAddress();
  if (page === 'account-password')      renderAccountPassword();
  if (page === 'account-cases')         renderAccountCases();
  if (page === 'account-newcase')       renderAccountNewCase();
  if (page === 'account-favourites')    renderAccountFavourites();
  if (page === 'account-purchases')     renderAccountPurchases();
  if (page === 'account-returns')       renderAccountReturns();
  if (page === 'account-reorder')       renderAccountReorder();
  if (page === 'account-invoices')             renderAccountInvoices();
  if (page === 'account-transaction-history')  renderAccountTransactionHistory();
  if (page === 'account-print-statement')      renderAccountPrintStatement();
}

// ─── TOAST ──────────────────────────────────────────
function showToast(msg, iconName='check') {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  document.getElementById('toast-icon').innerHTML = ICONS[iconName] || ICONS.check;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── ACCORDION ──────────────────────────────────────
function toggleAcc(el) {
  const body = el.nextElementSibling;
  const isOpen = body && body.classList.contains('open');
  const toggle = el.querySelector('.acc-toggle');
  if (body) { body.classList.toggle('open', !isOpen); body.style.display = isOpen ? 'none' : 'block'; }
  if (toggle) toggle.textContent = isOpen ? '+' : '−';
}

function toggleHomeFaq(header) {
  const item = header.parentElement;
  const body = item.querySelector('.home-faq-body');
  const toggle = item.querySelector('.home-faq-toggle');
  const isOpen = item.classList.contains('open');
  // close all
  item.closest('.home-faq-accordion').querySelectorAll('.home-faq-item').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.home-faq-body').style.display = 'none';
    el.querySelector('.home-faq-toggle').innerHTML = ICONS.plus;
  });
  // open this one if it was closed
  if (!isOpen) {
    item.classList.add('open');
    body.style.display = 'block';
    toggle.innerHTML = ICONS.minus;
  }
}

// ─── QUICK ADD ───────────────────────────────────────
function toggleQuickAdd() {
  const body = document.getElementById('quick-add-body');
  const toggle = document.getElementById('quick-add-toggle');
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  toggle.textContent = isOpen ? '+' : '−';
}

// ─── LISTING ACTIONS ────────────────────────────────
function selectCat(i) {
  selectedCat = i;
  renderListing();
}

function toggleStock() {
  stockOnly = !stockOnly;
  const t = document.getElementById('stock-toggle');
  t.classList.toggle('on', stockOnly);
  renderListing();
}

// ─── PRODUCT DETAIL ACTIONS ─────────────────────────
function openProduct(idx) {
  currentProduct = PRODUCTS[idx];
  navigate('detail');
}

function changeQty(delta) {
  const inp = document.getElementById('qty-val');
  inp.value = Math.max(1, parseInt(inp.value || 1) + delta);
}

function selectSize(el) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// ─── CART ACTIONS ───────────────────────────────────
function cartQty(i, delta) {
  CART_ITEMS[i].qty = Math.max(1, CART_ITEMS[i].qty + delta);
  document.getElementById('cart-qty-' + i).value = CART_ITEMS[i].qty;
}

function removeCartItem(i) {
  CART_ITEMS.splice(i, 1);
  renderCart();
  showToast('Item removed from cart', 'trash');
}

function clearCart() {
  CART_ITEMS.length = 0;
  renderCart();
  closeClearModal();
  showToast('Cart cleared', 'trash');
}

function addToCart() {
  const badge = document.getElementById('cart-badge');
  badge.textContent = parseInt(badge.textContent) + 1;
  showToast('Added to cart', 'cart');
}

function addToWish() { showToast('Added to wishlist', 'heart'); }

// ─── CLEAR CART MODAL ───────────────────────────────
function openClearModal() { document.getElementById('clear-modal').classList.add('open'); }
function closeClearModal() { document.getElementById('clear-modal').classList.remove('open'); }

// ─── CHECKOUT ACTIONS ───────────────────────────────
function selectShipping(el, type) {
  document.querySelectorAll('.ship-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

function placeOrder() {
  showToast('Order placed successfully!', 'check');
  setTimeout(() => navigate('checkout-thankyou'), 600);
}

// ─── ACCOUNT HELPERS ────────────────────────────────
function openLogoutModal()  { document.getElementById('logout-modal').classList.add('open'); }
function closeLogoutModal() { document.getElementById('logout-modal').classList.remove('open'); }
function confirmLogout() {
  closeLogoutModal();
  navigate('home');
  showToast('Logged out successfully', 'check');
}

function toggleAccSection(tab) {
  const sublist = tab.nextElementSibling;
  if (!sublist || !sublist.classList.contains('acct-sublist')) return;
  const isOpen = sublist.classList.contains('open');
  tab.classList.toggle('open', !isOpen);
  sublist.classList.toggle('open', !isOpen);
}

function togglePwd(btn) {
  const input = btn.previousElementSibling;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.innerHTML = isHidden ? icon('eye', 'icon-sm') : icon('eyeOff', 'icon-sm');
}

function selectCaseEmail(label) {
  document.querySelectorAll('.acct-radio-option').forEach(o => o.classList.remove('sel'));
  label.classList.add('sel');
}

// ─── FAVOURITES ──────────────────────────────────────
function toggleFavStock() {
  favStockOnly = !favStockOnly;
  favPage = 1;
  renderAccountFavourites();
}
function setFavPage(n) {
  const total = Math.ceil((favStockOnly ? PRODUCTS.filter(p => p.inStock) : PRODUCTS).length / FAV_PER_PAGE);
  if (n < 1 || n > total) return;
  favPage = n;
  renderAccountFavourites();
}
function removeFromFav(_id) { showToast('Removed from favourites', 'heart'); }
function addFavToCart(_id) { showToast('Added to cart', 'check'); }
function clearFavourites() { showToast('Favourites cleared', 'trash'); }
function copyFavCode(text) {
  navigator.clipboard?.writeText(text).then(() => showToast('Copied to clipboard', 'copy'));
}

// ─── PURCHASES HISTORY ───────────────────────────────
function setPurchasesFilter(f) {
  purchasesFilter = f;
  renderAccountPurchases();
}
function copyPurchaseId(id) {
  navigator.clipboard?.writeText(id).then(() => showToast('Copied to clipboard', 'copy'));
}
function copyReturnId(id) {
  navigator.clipboard?.writeText(id).then(() => showToast('Copied to clipboard', 'copy'));
}

// ─── REORDER ITEMS ────────────────────────────────────
function toggleReorderStock() {
  reorderStockOnly = !reorderStockOnly;
  renderAccountReorder();
}
function reorderQtyChange(idx, delta) {
  if (reorderQtys[idx] == null) reorderQtys[idx] = 1;
  reorderQtys[idx] = Math.max(1, reorderQtys[idx] + delta);
  const el = document.getElementById('reorder-qty-' + idx);
  if (el) el.textContent = reorderQtys[idx];
}
function reorderAddToCart(idx) {
  const item = (reorderStockOnly ? REORDER_ITEMS.filter(p => p.inStock) : REORDER_ITEMS)[idx];
  if (!item) return;
  showToast('Added to cart', 'cart');
}
function copyReorderCode(id) {
  navigator.clipboard?.writeText(id).then(() => showToast('Copied to clipboard', 'copy'));
}

// ─── INVOICES ─────────────────────────────────────────
function setInvoicesFilter(f) {
  invoicesFilter = f;
  invoicesPage = 1;
  renderAccountInvoices();
}
function setInvoicesPage(n) {
  const all = INVOICES.filter(inv => inv.status === (invoicesFilter === 'open' ? 'open' : 'paid'));
  const total = Math.max(1, Math.ceil(all.length / INV_PER_PAGE));
  if (n < 1 || n > total) return;
  invoicesPage = n;
  renderAccountInvoices();
}
function toggleInvoiceCheck(id, el) {
  invoicesChecked[id] = el.checked;
  const row = el.closest('tr');
  if (row) row.classList.toggle('selected', el.checked);
  // sync header checkbox
  const all = document.querySelectorAll('.inv-table tbody .inv-checkbox');
  const allChecked = all.length > 0 && [...all].every(c => c.checked);
  const hdr = document.getElementById('inv-check-all');
  if (hdr) hdr.checked = allChecked;
}
function toggleAllInvoices(el) {
  const all = document.querySelectorAll('.inv-table tbody .inv-checkbox');
  all.forEach(cb => {
    cb.checked = el.checked;
    const id = cb.closest('tr')?.querySelector('button.icon-btn')?.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
    if (id) invoicesChecked[id] = el.checked;
    cb.closest('tr')?.classList.toggle('selected', el.checked);
  });
}
function copyInvoiceId(id) {
  navigator.clipboard?.writeText(id).then(() => showToast('Copied to clipboard', 'copy'));
}

// ─── TRANSACTION HISTORY ──────────────────────────────
function setTxPage(n) {
  txPage = n;
  renderAccountTransactionHistory();
}
function copyTxId(id) {
  navigator.clipboard?.writeText(id).then(() => showToast('Copied to clipboard', 'copy'));
}

// ─── PRINT A STATEMENT ───────────────────────────────
function toggleStmtPref(pref, el) {
  if (el.checked) { if (!stmtPrefs.includes(pref)) stmtPrefs.push(pref); }
  else            { stmtPrefs = stmtPrefs.filter(p => p !== pref); }
}

// ─── BRAND CARDS ─────────────────────────────────────
function activateBrand(card) {
  document.querySelectorAll('.home-brand-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
}
function resetBrands() {
  document.querySelectorAll('.home-brand-card').forEach(c => c.classList.remove('active'));
  const first = document.querySelector('.home-brand-card');
  if (first) first.classList.add('active');
}

// ─── CATEGORIES DROPDOWN ─────────────────────────────
const CAT_BRANDS = ['OX', 'BORA', 'TRACER', 'SMART', 'UNITEC'];
let catActiveBrand = 0;
let catActiveItem  = 0;

function toggleCategoryDropdown() {
  const isOpen = document.getElementById('cat-dropdown').classList.contains('open');
  isOpen ? closeCategoryDropdown() : openCategoryDropdown();
}

function openCategoryDropdown() {
  closeSearch();
  document.getElementById('cat-overlay').classList.add('open');
  document.getElementById('cat-dropdown').classList.add('open');
  renderCatDropdown();
}

function closeCategoryDropdown() {
  document.getElementById('cat-overlay').classList.remove('open');
  document.getElementById('cat-dropdown').classList.remove('open');
}

function renderCatDropdown() {
  const brand = CAT_BRANDS[catActiveBrand];
  const cats  = CAT_DATA[brand] || [];

  document.getElementById('cat-tabs').innerHTML = CAT_BRANDS.map((b, i) =>
    `<div class="cat-tab${i === catActiveBrand ? ' active' : ''}" onclick="selectCatBrand(${i})">${b}</div>`
  ).join('');

  document.getElementById('cat-left').innerHTML = cats.map((cat, i) =>
    `<div class="cat-item${i === catActiveItem ? ' active' : ''}" onclick="selectCatItem(${i})">
       ${icon(cat.icon, 'icon-sm')}
       <span class="cat-item-label">${cat.name}</span>
       ${cat.subs && cat.subs.length ? `<span class="cat-item-chevron">${icon('chevronRight', 'icon-sm')}</span>` : ''}
     </div>`
  ).join('');

  const activeCat = cats[catActiveItem];
  if (activeCat && activeCat.subs && activeCat.subs.length) {
    document.getElementById('cat-right').innerHTML = activeCat.subs.map(sub =>
      `<div class="cat-subgroup">
         <div class="cat-subgroup-title">${sub.heading}</div>
         ${sub.items.map(item => `<div class="cat-subitem" onclick="navigate('listing');closeCategoryDropdown()">${item}</div>`).join('')}
       </div>`
    ).join('');
  } else {
    document.getElementById('cat-right').innerHTML = '';
  }
}

function selectCatBrand(i) {
  catActiveBrand = i;
  catActiveItem  = 0;
  renderCatDropdown();
}

function selectCatItem(i) {
  catActiveItem = i;
  renderCatDropdown();
}

// ─── SEARCH ──────────────────────────────────────────
function openSearchIfValue() {
  const val = document.getElementById('nav-search-input').value.trim();
  if (val.length >= 1) renderSearchResults(val);
}

function closeSearch() {
  document.getElementById('search-dropdown').classList.remove('open');
  document.getElementById('search-overlay').classList.remove('open');
  document.getElementById('nav-search').classList.remove('open');
}

function clearSearch() {
  const input = document.getElementById('nav-search-input');
  input.value = '';
  document.getElementById('nav-search').classList.remove('has-value', 'open');
  document.getElementById('search-dropdown').classList.remove('open');
  document.getElementById('search-overlay').classList.remove('open');
  input.focus();
}

function handleSearch(val) {
  document.getElementById('nav-search').classList.toggle('has-value', val.length > 0);
  if (val.trim().length >= 1) {
    renderSearchResults(val.trim());
  } else {
    document.getElementById('search-dropdown').classList.remove('open');
    document.getElementById('search-overlay').classList.remove('open');
    document.getElementById('nav-search').classList.remove('open');
  }
}

function renderSearchResults(query) {
  const q = query.toLowerCase();

  const matchedProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
  ).slice(0, 5);

  const matchedCats = [];
  Object.values(CAT_DATA).forEach(brandCats => {
    brandCats.forEach(cat => {
      cat.subs.forEach(sub => {
        sub.items.forEach(item => {
          if (item.toLowerCase().includes(q) && matchedCats.length < 4) {
            matchedCats.push({ name: item, brand: 'OX' });
          }
        });
      });
    });
  });

  function highlight(text) {
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return text;
    return `${text.slice(0, idx)}<strong class="search-highlight">${text.slice(idx, idx + q.length)}</strong>${text.slice(idx + q.length)}`;
  }

  document.getElementById('search-products').innerHTML = matchedProducts.map(p =>
    `<div class="search-product-row" onclick="openProductFromSearch('${p.id}');closeSearch()">
       <div class="search-product-img">${icon(p.img, 'icon-sm')}</div>
       <span class="search-product-name">${highlight(p.name)}</span>
       <span class="search-product-id">${p.id}</span>
     </div>`
  ).join('');

  const showDivider = matchedProducts.length > 0 && matchedCats.length > 0;
  document.getElementById('search-divider').style.display = showDivider ? 'block' : 'none';

  document.getElementById('search-cats').innerHTML = matchedCats.map(c =>
    `<div class="search-cat-row" onclick="navigate('listing');closeSearch()">
       ${icon('dotsGrid', 'icon-sm')}
       <span class="search-cat-name">${highlight(c.name)}</span>
       <span class="search-cat-brand">${c.brand}</span>
     </div>`
  ).join('');

  const hasResults = matchedProducts.length > 0 || matchedCats.length > 0;
  document.getElementById('search-dropdown').classList.toggle('open', hasResults);
  document.getElementById('search-overlay').classList.toggle('open', hasResults);
  document.getElementById('nav-search').classList.toggle('open', hasResults);
}

function openProductFromSearch(id) {
  const idx = PRODUCTS.findIndex(p => p.id === id);
  if (idx !== -1) { currentProduct = PRODUCTS[idx]; navigate('detail'); }
}

// ─── SYNC MODAL ─────────────────────────────────────
function openSyncModal() { document.getElementById('sync-modal').classList.add('open'); }

function closeSyncModal() {
  document.getElementById('sync-modal').classList.remove('open');
  document.getElementById('sync-log').style.display = 'none';
  document.getElementById('sync-log').innerHTML = '';
  document.getElementById('modal-sync-btn').textContent = 'Run Sync';
  document.getElementById('modal-sync-btn').disabled = false;
}

function runSync() {
  const log = document.getElementById('sync-log');
  const btn = document.getElementById('modal-sync-btn');
  log.style.display = 'block';
  log.innerHTML = '';
  btn.textContent = 'Syncing...';
  btn.disabled = true;

  const steps = [
    '[00:00] Connecting to API endpoint...',
    '[00:01] Authentication successful ✓',
    '[00:02] Fetching product catalogue...',
    '[00:03] Received 1,387 records',
    '[00:04] Processing Diamond Tools (342 items)...',
    '[00:05] Processing Hand Tools (89 items)...',
    '[00:06] Processing Safety (156 items)...',
    '[00:07] Updating prices & stock levels...',
    '[00:08] Syncing images...',
    '[00:09] Cleaning up stale records...',
    '[00:10] ✅ Sync complete — 1,387 products updated',
  ];

  let i = 0;
  const interval = setInterval(() => {
    if (i < steps.length) {
      log.innerHTML += steps[i] + '\n';
      log.scrollTop = log.scrollHeight;
      i++;
    } else {
      clearInterval(interval);
      btn.textContent = 'Done ✓';
      btn.style.background = 'var(--green)';
      updateSyncStatus();
      setTimeout(closeSyncModal, 1200);
    }
  }, 260);
}

function updateSyncStatus() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const statusEl = document.getElementById('sync-status');
  if (statusEl) {
    statusEl.innerHTML = ` — Last synced: today at ${time} · <strong style="color:var(--white)">1,387 products</strong> loaded`;
  }
  showToast('Product sync complete — 1,387 products updated', 'check');
}

// ─── CUSTOM SELECT ───────────────────────────────────
function toggleCustomSelect(id) {
  const el = document.getElementById(id);
  const isOpen = el.classList.contains('open');
  closeAllCustomSelects();
  if (!isOpen) el.classList.add('open');
}
function closeAllCustomSelects() {
  document.querySelectorAll('.cust-select.open').forEach(el => el.classList.remove('open'));
}
function pickCustomSelect(id, label) {
  const el = document.getElementById(id);
  el.querySelector('.cust-select-value').textContent = label;
  el.querySelectorAll('.cust-select-item').forEach(item => {
    item.classList.toggle('active', item.dataset.label === label);
  });
  el.classList.remove('open');
}

// ─── DATE PICKER ─────────────────────────────────────
const DP_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let dpInst  = null;   // e.g. 'ret-dp'
let dpFld   = null;   // 'from' | 'to'
let dpYear  = 0;
let dpMonth = 0;

function openDp(instanceId, field, event) {
  if (event) event.stopPropagation();
  const isSame = dpInst === instanceId && dpFld === field;
  closeDp();
  if (isSame) return;
  dpInst  = instanceId;
  dpFld   = field;
  const today = new Date();
  // Initialise to current value's month if already set, otherwise today
  const inputEl = document.getElementById(dpInst + '-' + dpFld);
  if (inputEl && inputEl.value) {
    const parts = inputEl.value.split('/'); // DD/MM/YYYY
    if (parts.length === 3) { dpMonth = parseInt(parts[1], 10) - 1; dpYear = parseInt(parts[2], 10); }
    else { dpYear = today.getFullYear(); dpMonth = today.getMonth(); }
  } else {
    dpYear = today.getFullYear(); dpMonth = today.getMonth();
  }
  renderDpCalendar();
  const popup = document.getElementById(dpInst + '-' + dpFld + '-popup');
  if (popup) popup.style.display = 'block';
}

function closeDp() {
  if (dpInst && dpFld) {
    const popup = document.getElementById(dpInst + '-' + dpFld + '-popup');
    if (popup) popup.style.display = 'none';
  }
  dpInst = null;
  dpFld  = null;
}

function dpNav(delta) {
  dpMonth += delta;
  if (dpMonth > 11) { dpMonth = 0; dpYear++; }
  if (dpMonth < 0)  { dpMonth = 11; dpYear--; }
  renderDpCalendar();
}

function dpPickDay(day) {
  const formatted = String(day).padStart(2,'0') + '/' + String(dpMonth + 1).padStart(2,'0') + '/' + dpYear;
  const input = document.getElementById(dpInst + '-' + dpFld);
  if (input) input.value = formatted;
  if (dpInst === 'ret-dp') {
    if (dpFld === 'from') returnsDateFrom = formatted;
    else                  returnsDateTo   = formatted;
  } else if (dpInst === 'tx-dp') {
    if (dpFld === 'from') txDateFrom = formatted;
    else                  txDateTo   = formatted;
  } else if (dpInst === 'stmt-date') {
    stmtDate = formatted;
  } else if (dpInst === 'stmt-start') {
    stmtStartDate = formatted;
  }
  closeDp();
}

function renderDpCalendar() {
  const popup = document.getElementById(dpInst + '-' + dpFld + '-popup');
  if (!popup) return;
  const today    = new Date();
  const firstDow = new Date(dpYear, dpMonth, 1).getDay();       // 0=Sun
  const totalDays = new Date(dpYear, dpMonth + 1, 0).getDate();
  const prevTotal = new Date(dpYear, dpMonth, 0).getDate();
  const prevCount = firstDow === 0 ? 7 : firstDow; // always show a prior row when month starts on Sunday

  const inputEl    = document.getElementById(dpInst + '-' + dpFld);
  const selectedStr = inputEl ? inputEl.value : '';

  let cells = '';
  for (let i = prevCount - 1; i >= 0; i--) {
    cells += `<div class="dp-cell dp-muted">${prevTotal - i}</div>`;
  }
  for (let d = 1; d <= totalDays; d++) {
    const isToday = dpYear === today.getFullYear() && dpMonth === today.getMonth() && d === today.getDate();
    const cellStr = String(d).padStart(2,'0') + '/' + String(dpMonth + 1).padStart(2,'0') + '/' + dpYear;
    const isSel   = cellStr === selectedStr;
    let cls = 'dp-cell';
    if (isToday) cls += ' dp-today';
    if (isSel)   cls += ' dp-selected';
    cells += `<div class="${cls}" onclick="dpPickDay(${d});event.stopPropagation()">${d}</div>`;
  }
  const remaining = 42 - prevCount - totalDays;
  for (let d = 1; d <= remaining; d++) {
    cells += `<div class="dp-cell dp-muted">${d}</div>`;
  }

  popup.innerHTML = `
    <div class="dp-header">
      <button class="dp-nav-btn" onclick="dpNav(-1);event.stopPropagation()">${icon('chevronLeft','icon-sm')}</button>
      <span class="dp-month-label">${DP_MONTHS[dpMonth]} ${dpYear}</span>
      <button class="dp-nav-btn" onclick="dpNav(1);event.stopPropagation()">${icon('chevronRight','icon-sm')}</button>
    </div>
    <div class="dp-dow-row">${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<div class="dp-dow">${d}</div>`).join('')}</div>
    <div class="dp-grid">${cells}</div>
  `;
}

// ─── INIT ────────────────────────────────────────────
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCategoryDropdown(); closeSearch(); closeAllCustomSelects(); closeDp(); } });
document.addEventListener('click', e => {
  if (!e.target.closest('.cust-select')) closeAllCustomSelects();
  if (!e.target.closest('.dp-field-wrap')) closeDp();
});
window.addEventListener('popstate', e => {
  navigate(e.state?.page || pageFromPath(location.pathname), { skipHistory: true });
});
navigate(pageFromPath(location.pathname), { skipHistory: true });
