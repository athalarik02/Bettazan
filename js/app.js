/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modul Utama Aplikasi (Orchestrator) - Bettazan Betta Gallery
 */

import { CONFIG } from './config.js';
import { CATEGORIES, PRODUCTS, PRODUCTS_MAP } from './data.js';
import { addItem, updateQuantity, removeItem, calculateCartSummary, formatCurrency } from './cart.js';
import { loadCartFromStorage, saveCartToStorage, clearCartStorage } from './storage.js';
import { validateOrderForm, generateWhatsAppOrderLink, generateVideoRequestLink } from './checkout.js';

// Application State
const state = {
  cartItems: [],
  shippingMethod: CONFIG.EXPEDITIONS[0],
  selectedCategory: 'semua',
  searchQuery: '',
  isReviewed: false,
  lastValidatedSummary: null
};

// DOM Elements Cache
const elements = {
  cartNavBadges: document.querySelectorAll('.cart-badge-count'),
  
  // Catalog
  categoryFilterList: document.getElementById('categoryFilterList'),
  catalogSearchInput: document.getElementById('catalogSearchInput'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  productsGrid: document.getElementById('productsGrid'),
  emptyCatalogState: document.getElementById('emptyCatalogState'),
  resetFilterBtn: document.getElementById('resetFilterBtn'),
  resultsCountText: document.getElementById('resultsCountText'),
  
  // Cart
  cartItemsList: document.getElementById('cartItemsList'),
  emptyCartState: document.getElementById('emptyCartState'),
  btnClearCart: document.getElementById('btnClearCart'),
  totalUnitsBadge: document.getElementById('totalUnitsBadge'),
  
  // Shipping & Cost
  shippingMethodSelect: document.getElementById('shippingMethodSelect'),
  cartSubtotalPrice: document.getElementById('cartSubtotalPrice'),
  cartPackingPrice: document.getElementById('cartPackingPrice'),
  cartTotalPrice: document.getElementById('cartTotalPrice'),
  freePackingNotice: document.getElementById('freePackingNotice'),
  
  // Buyer Form
  customerNameInput: document.getElementById('customerNameInput'),
  customerNameError: document.getElementById('customerNameError'),
  customerPhoneInput: document.getElementById('customerPhoneInput'),
  customerPhoneError: document.getElementById('customerPhoneError'),
  customerAddressInput: document.getElementById('customerAddressInput'),
  customerAddressError: document.getElementById('customerAddressError'),
  btnReviewOrder: document.getElementById('btnReviewOrder'),
  
  // Review Preview Box
  reviewPreviewModal: document.getElementById('reviewPreviewModal'),
  reviewCustomerDetails: document.getElementById('reviewCustomerDetails'),
  reviewShippingDetails: document.getElementById('reviewShippingDetails'),
  reviewItemsList: document.getElementById('reviewItemsList'),
  reviewTotalAmount: document.getElementById('reviewTotalAmount'),
  btnSubmitWhatsApp: document.getElementById('btnSubmitWhatsApp'),
  btnEditDraft: document.getElementById('btnEditDraft'),
  waDisabledNotice: document.getElementById('waDisabledNotice'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer')
};

function showToast(message, type = 'success') {
  if (!elements.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3500);
}

function renderCategoryFilters() {
  if (!elements.categoryFilterList) return;
  elements.categoryFilterList.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `filter-chip ${state.selectedCategory === cat.id ? 'active' : ''}`;
    chip.setAttribute('aria-pressed', state.selectedCategory === cat.id ? 'true' : 'false');
    chip.textContent = cat.label;
    chip.addEventListener('click', () => {
      state.selectedCategory = cat.id;
      renderCategoryFilters();
      renderCatalog();
    });
    elements.categoryFilterList.appendChild(chip);
  });
}

function getFilteredProducts() {
  const query = state.searchQuery.toLowerCase().trim();
  const category = state.selectedCategory;

  return PRODUCTS.filter(prod => {
    if (category !== 'semua' && prod.category !== category) {
      return false;
    }

    if (query) {
      const matchName = prod.name.toLowerCase().includes(query);
      const matchCode = prod.code.toLowerCase().includes(query);
      const matchDesc = prod.description.toLowerCase().includes(query);
      const matchGender = (prod.gender || '').toLowerCase().includes(query);
      const matchGrade = (prod.grade || '').toLowerCase().includes(query);
      return matchName || matchCode || matchDesc || matchGender || matchGrade;
    }

    return true;
  });
}

function renderCatalog() {
  if (!elements.productsGrid) return;

  const filtered = getFilteredProducts();

  if (elements.resultsCountText) {
    elements.resultsCountText.textContent = `Menampilkan ${filtered.length} dari ${PRODUCTS.length} produk pilihan (Stok Unlimited)`;
  }

  if (elements.searchClearBtn) {
    elements.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
  }

  if (filtered.length === 0) {
    elements.productsGrid.innerHTML = '';
    if (elements.emptyCatalogState) elements.emptyCatalogState.style.display = 'block';
    return;
  }

  if (elements.emptyCatalogState) elements.emptyCatalogState.style.display = 'none';
  elements.productsGrid.innerHTML = '';

  filtered.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';

    // Unboxed specs with middle dot separators (Zero-pill compliance)
    const specsHtml = `<span>${product.gender}</span><span class="meta-dot">·</span><span>${product.sizeGrade}</span><span class="meta-dot">·</span><span>${product.grade}</span>`;

    card.innerHTML = `
      <div class="card-image-wrap">
        <img 
          src="${product.image}" 
          alt="${product.imageAlt}" 
          class="card-image"
          loading="lazy"
          width="800"
          height="533"
          onerror="this.src='./assets/images/hero_betta_fish_1793264512616.jpg'"
        />
        <span class="card-code-badge">${product.code}</span>
        <span class="card-grade-badge">${product.grade}</span>
      </div>
      <div class="card-content">
        <h3 class="product-title">${product.name}</h3>
        <div class="product-meta-row">
          ${specsHtml}
        </div>
        <p class="product-desc">${product.description}</p>
        <div class="card-footer">
          <div class="price-container">
            <span class="price-label">Harga Satuan</span>
            <span class="price-amount">${formatCurrency(product.price)}</span>
          </div>
          <div class="card-action-btns">
            ${product.category !== 'perawatan' ? `
              <a 
                href="${generateVideoRequestLink(product)}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn-video-wa"
                title="Minta video ngedok (flaring) via WhatsApp"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span>Video WA</span>
              </a>
            ` : ''}
            <button 
              type="button" 
              class="btn-add-item" 
              data-id="${product.id}"
              aria-label="Pesan ${product.name}"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>+ Beli</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const addBtn = card.querySelector('.btn-add-item');
    addBtn.addEventListener('click', () => {
      handleAddToCart(product);
    });

    elements.productsGrid.appendChild(card);
  });
}

function handleAddToCart(product) {
  state.cartItems = addItem(state.cartItems, product, 1);
  const currentItem = state.cartItems.find(i => i.productId === product.id);
  const currentQty = currentItem ? currentItem.quantity : 1;

  invalidateReviewStatus();
  persistState();
  renderCart();
  updateCalculationUI();
  showToast(`[${product.code}] ditambahkan ke keranjang (Jumlah: ${currentQty}).`);
}

function handleQuantityChange(productId, newQty) {
  const targetProduct = PRODUCTS_MAP.get(productId);
  state.cartItems = updateQuantity(state.cartItems, productId, newQty);
  invalidateReviewStatus();
  persistState();
  renderCart();
  updateCalculationUI();

  if (targetProduct) {
    const updated = state.cartItems.find(i => i.productId === productId);
    if (!updated) {
      showToast(`[${targetProduct.code}] dihapus dari keranjang.`, 'info');
    }
  }
}

function handleRemoveItem(productId, productName) {
  state.cartItems = removeItem(state.cartItems, productId);
  invalidateReviewStatus();
  persistState();
  renderCart();
  updateCalculationUI();
  showToast(`${productName || 'Item'} dihapus dari keranjang.`, 'info');
}

function handleClearAllCart() {
  if (state.cartItems.length === 0) return;
  state.cartItems = [];
  invalidateReviewStatus();
  clearCartStorage();
  renderCart();
  updateCalculationUI();
  showToast('Keranjang belanja berhasil dikosongkan.', 'info');
}

function renderCart() {
  const totalUnits = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);

  elements.cartNavBadges.forEach(badge => {
    badge.textContent = totalUnits;
  });

  if (elements.totalUnitsBadge) {
    elements.totalUnitsBadge.textContent = `${totalUnits} item`;
  }

  if (state.cartItems.length === 0) {
    if (elements.cartItemsList) elements.cartItemsList.innerHTML = '';
    if (elements.emptyCartState) elements.emptyCartState.style.display = 'block';
    if (elements.btnClearCart) elements.btnClearCart.style.display = 'none';
    return;
  }

  if (elements.emptyCartState) elements.emptyCartState.style.display = 'none';
  if (elements.btnClearCart) elements.btnClearCart.style.display = 'inline-block';
  if (!elements.cartItemsList) return;

  elements.cartItemsList.innerHTML = '';

  state.cartItems.forEach(item => {
    const product = PRODUCTS_MAP.get(item.productId);
    if (!product) return;

    const row = document.createElement('div');
    row.className = 'cart-item-row';

    const itemSubtotal = product.price * item.quantity;

    row.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-code">${product.code}</span>
        <h4 class="cart-item-name" title="${product.name}">${product.name}</h4>
        <div class="cart-item-price-calc">
          <span class="cart-item-unit-price">${formatCurrency(product.price)}</span>
          <span class="cart-item-times">× ${item.quantity} =</span>
          <strong class="cart-item-subtotal-val">${formatCurrency(itemSubtotal)}</strong>
        </div>
      </div>
      <div class="cart-qty-control" role="group" aria-label="Ubah jumlah ${product.name}">
        <button 
          type="button" 
          class="btn-qty-step btn-qty-minus" 
          aria-label="Kurangi 1 ${product.name}"
          title="Kurangi jumlah"
        >−</button>
        <input 
          type="number" 
          class="input-qty" 
          value="${item.quantity}" 
          min="1" 
          max="${CONFIG.MAX_ITEM_QTY}"
          aria-label="Kuantitas ${product.name}"
        />
        <button 
          type="button" 
          class="btn-qty-step btn-qty-plus" 
          aria-label="Tambah 1 ${product.name}"
          title="Tambah jumlah"
        >+</button>
      </div>
      <button 
        type="button" 
        class="btn-item-delete" 
        aria-label="Hapus ${product.name} dari keranjang"
        title="Hapus dari keranjang"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    `;

    const minusBtn = row.querySelector('.btn-qty-minus');
    const plusBtn = row.querySelector('.btn-qty-plus');
    const qtyInput = row.querySelector('.input-qty');
    const deleteBtn = row.querySelector('.btn-item-delete');

    // Tombol Kurang (-)
    minusBtn.addEventListener('click', () => {
      if (item.quantity > 1) {
        handleQuantityChange(item.productId, item.quantity - 1);
      } else {
        // Jika 1 dikurangi, hapus dari keranjang
        handleRemoveItem(item.productId, product.name);
      }
    });

    // Tombol Tambah (+)
    plusBtn.addEventListener('click', () => {
      handleQuantityChange(item.productId, item.quantity + 1);
    });

    // Input Angka Langsung (Otomatis hitung saat diketik / diubah)
    qtyInput.addEventListener('change', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > CONFIG.MAX_ITEM_QTY) val = CONFIG.MAX_ITEM_QTY;
      handleQuantityChange(item.productId, val);
    });

    qtyInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val >= 1) {
        if (val > CONFIG.MAX_ITEM_QTY) val = CONFIG.MAX_ITEM_QTY;
        // Update subtotal dan harga otomatis saat user mengetik
        item.quantity = val;
        updateCalculationUI();
      }
    });

    // Tombol Hapus (Trash)
    deleteBtn.addEventListener('click', () => {
      handleRemoveItem(item.productId, product.name);
    });

    elements.cartItemsList.appendChild(row);
  });
}

function updateCalculationUI() {
  const summary = calculateCartSummary(state.cartItems, PRODUCTS_MAP, state.shippingMethod);

  // Update Subtotal Belanja Otomatis
  if (elements.cartSubtotalPrice) {
    elements.cartSubtotalPrice.textContent = formatCurrency(summary.subtotal);
  }

  // Update Biaya Packing Otomatis
  if (elements.cartPackingPrice) {
    if (summary.isFreePacking) {
      elements.cartPackingPrice.textContent = 'GRATIS (Promo Belanja > 250rb)';
      elements.cartPackingPrice.style.color = '#10B981';
      elements.cartPackingPrice.style.fontWeight = '700';
    } else if (summary.packingFee > 0) {
      elements.cartPackingPrice.textContent = formatCurrency(summary.packingFee);
      elements.cartPackingPrice.style.color = 'var(--text-secondary)';
      elements.cartPackingPrice.style.fontWeight = '600';
    } else {
      elements.cartPackingPrice.textContent = 'Rp 0 (Ambil di galeri)';
      elements.cartPackingPrice.style.color = 'var(--text-secondary)';
      elements.cartPackingPrice.style.fontWeight = '600';
    }
  }

  // Update Total Keseluruhan Otomatis
  if (elements.cartTotalPrice) {
    elements.cartTotalPrice.textContent = formatCurrency(summary.totalAmount);
  }

  // Notice Promo Box Styrofoam
  if (elements.freePackingNotice) {
    if (summary.subtotal > 0 && summary.subtotal < CONFIG.FREE_PACKING_THRESHOLD && !state.shippingMethod.toLowerCase().includes('ambil')) {
      const remaining = CONFIG.FREE_PACKING_THRESHOLD - summary.subtotal;
      elements.freePackingNotice.textContent = `💡 Tambah ${formatCurrency(remaining)} lagi untuk dapat GRATIS Box Styrofoam!`;
      elements.freePackingNotice.style.display = 'block';
    } else {
      elements.freePackingNotice.style.display = 'none';
    }
  }

  // Jika Review Modal sedang terbuka, otomatis update rincian dan link WhatsApp juga
  if (state.isReviewed && state.lastValidatedSummary) {
    state.lastValidatedSummary.cartSummary = summary;
    renderReviewSummary(state.lastValidatedSummary);
  }
}

function persistState() {
  saveCartToStorage(state.cartItems, state.shippingMethod);
}

function invalidateReviewStatus() {
  if (state.isReviewed) {
    state.isReviewed = false;
    state.lastValidatedSummary = null;
    if (elements.reviewPreviewModal) {
      elements.reviewPreviewModal.classList.remove('visible');
    }
  }
}

function handleReviewSubmission() {
  if (elements.customerNameError) elements.customerNameError.classList.remove('visible');
  if (elements.customerPhoneError) elements.customerPhoneError.classList.remove('visible');
  if (elements.customerAddressError) elements.customerAddressError.classList.remove('visible');

  if (elements.customerNameInput) elements.customerNameInput.removeAttribute('aria-invalid');
  if (elements.customerPhoneInput) elements.customerPhoneInput.removeAttribute('aria-invalid');
  if (elements.customerAddressInput) elements.customerAddressInput.removeAttribute('aria-invalid');

  const customerName = elements.customerNameInput ? elements.customerNameInput.value : '';
  const customerPhone = elements.customerPhoneInput ? elements.customerPhoneInput.value : '';
  const customerAddress = elements.customerAddressInput ? elements.customerAddressInput.value : '';

  const validation = validateOrderForm({
    name: customerName,
    phone: customerPhone,
    cityAddress: customerAddress,
    shippingMethod: state.shippingMethod,
    cartItems: state.cartItems,
    productsMap: PRODUCTS_MAP
  });

  if (!validation.valid) {
    const errors = validation.errors;

    if (errors.cart) {
      showToast(errors.cart, 'error');
      const catalogEl = document.getElementById('katalog');
      if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (errors.name) {
      if (elements.customerNameError) {
        elements.customerNameError.textContent = errors.name;
        elements.customerNameError.classList.add('visible');
      }
      if (elements.customerNameInput) {
        elements.customerNameInput.setAttribute('aria-invalid', 'true');
        elements.customerNameInput.focus();
      }
      return;
    }

    if (errors.phone) {
      if (elements.customerPhoneError) {
        elements.customerPhoneError.textContent = errors.phone;
        elements.customerPhoneError.classList.add('visible');
      }
      if (elements.customerPhoneInput) {
        elements.customerPhoneInput.setAttribute('aria-invalid', 'true');
        elements.customerPhoneInput.focus();
      }
      return;
    }

    if (errors.address) {
      if (elements.customerAddressError) {
        elements.customerAddressError.textContent = errors.address;
        elements.customerAddressError.classList.add('visible');
      }
      if (elements.customerAddressInput) {
        elements.customerAddressInput.setAttribute('aria-invalid', 'true');
        elements.customerAddressInput.focus();
      }
      return;
    }

    return;
  }

  state.isReviewed = true;
  state.lastValidatedSummary = validation.summary;
  renderReviewSummary(validation.summary);

  // Otomatis buka chat konfirmasi pesanan ke WhatsApp toko (088973462934)
  const waResult = generateWhatsAppOrderLink(validation.summary);
  if (waResult.isConfigured && waResult.url) {
    try {
      window.open(waResult.url, '_blank');
      showToast(`Pesanan siap! Mengalihkan ke WhatsApp ${CONFIG.SHOP_PHONE}...`, 'info');
    } catch {
      showToast(`Pesanan siap! Silakan klik tombol 'Kirim Ulang via WhatsApp' di bawah.`, 'info');
    }
  }
}

function renderReviewSummary(summary) {
  if (!elements.reviewPreviewModal) return;

  if (elements.reviewCustomerDetails) {
    elements.reviewCustomerDetails.innerHTML = '';
    const pName = document.createElement('div');
    pName.className = 'review-meta-item';
    pName.textContent = `Pemesan: ${summary.customerName} (${summary.customerPhone})`;

    const pAddress = document.createElement('div');
    pAddress.className = 'review-meta-item';
    pAddress.textContent = `Tujuan: ${summary.cityAddress}`;

    elements.reviewCustomerDetails.appendChild(pName);
    elements.reviewCustomerDetails.appendChild(pAddress);
  }

  if (elements.reviewShippingDetails) {
    elements.reviewShippingDetails.innerHTML = '';
    const pShip = document.createElement('div');
    pShip.className = 'review-meta-item';
    pShip.textContent = `Ekspedisi: ${summary.shippingMethod}`;
    elements.reviewShippingDetails.appendChild(pShip);
  }

  if (elements.reviewItemsList) {
    elements.reviewItemsList.innerHTML = '';
    summary.cartSummary.itemsDetail.forEach(item => {
      const row = document.createElement('div');
      row.className = 'review-meta-item';
      row.textContent = `• [${item.code}] ${item.name} (${item.quantity} unit) = ${formatCurrency(item.subtotal)}`;
      elements.reviewItemsList.appendChild(row);
    });
    if (summary.cartSummary.packingFee > 0) {
      const packRow = document.createElement('div');
      packRow.className = 'review-meta-item';
      packRow.textContent = `• Packing Box Styrofoam: ${formatCurrency(summary.cartSummary.packingFee)}`;
      elements.reviewItemsList.appendChild(packRow);
    } else if (summary.cartSummary.isFreePacking) {
      const packRow = document.createElement('div');
      packRow.className = 'review-meta-item';
      packRow.textContent = `• Packing Box Styrofoam: GRATIS (Promo Belanja > 250rb)`;
      elements.reviewItemsList.appendChild(packRow);
    }
  }

  if (elements.reviewTotalAmount) {
    elements.reviewTotalAmount.textContent = formatCurrency(summary.cartSummary.totalAmount);
  }

  const waResult = generateWhatsAppOrderLink(summary);

  if (elements.btnSubmitWhatsApp) {
    if (waResult.isConfigured && waResult.url) {
      elements.btnSubmitWhatsApp.href = waResult.url;
      elements.btnSubmitWhatsApp.classList.remove('disabled');
      elements.btnSubmitWhatsApp.removeAttribute('aria-disabled');
      if (elements.waDisabledNotice) elements.waDisabledNotice.classList.remove('visible');
    } else {
      elements.btnSubmitWhatsApp.removeAttribute('href');
      elements.btnSubmitWhatsApp.classList.add('disabled');
      elements.btnSubmitWhatsApp.setAttribute('aria-disabled', 'true');
      if (elements.waDisabledNotice) {
        elements.waDisabledNotice.textContent = waResult.error || 'Nomor WhatsApp toko belum diatur.';
        elements.waDisabledNotice.classList.add('visible');
      }
    }
  }

  elements.reviewPreviewModal.classList.add('visible');
  elements.reviewPreviewModal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function initApp() {
  const savedState = loadCartFromStorage(PRODUCTS_MAP);
  state.cartItems = savedState.items || [];
  state.shippingMethod = savedState.shippingMethod || CONFIG.EXPEDITIONS[0];

  // Inisialisasi dropdown ekspedisi
  if (elements.shippingMethodSelect) {
    elements.shippingMethodSelect.innerHTML = '';
    CONFIG.EXPEDITIONS.forEach(exp => {
      const opt = document.createElement('option');
      opt.value = exp;
      opt.textContent = exp;
      if (exp === state.shippingMethod) opt.selected = true;
      elements.shippingMethodSelect.appendChild(opt);
    });

    elements.shippingMethodSelect.addEventListener('change', (e) => {
      state.shippingMethod = e.target.value;
      invalidateReviewStatus();
      persistState();
      updateCalculationUI();
    });
  }

  // Setup Event Listeners
  if (elements.catalogSearchInput) {
    elements.catalogSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderCatalog();
    });
  }

  if (elements.searchClearBtn) {
    elements.searchClearBtn.addEventListener('click', () => {
      state.searchQuery = '';
      if (elements.catalogSearchInput) elements.catalogSearchInput.value = '';
      renderCatalog();
    });
  }

  if (elements.resetFilterBtn) {
    elements.resetFilterBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.selectedCategory = 'semua';
      if (elements.catalogSearchInput) elements.catalogSearchInput.value = '';
      renderCategoryFilters();
      renderCatalog();
    });
  }

  if (elements.btnClearCart) {
    elements.btnClearCart.addEventListener('click', () => {
      handleClearAllCart();
    });
  }

  if (elements.customerNameInput) {
    elements.customerNameInput.addEventListener('input', () => {
      invalidateReviewStatus();
      if (elements.customerNameError) elements.customerNameError.classList.remove('visible');
      elements.customerNameInput.removeAttribute('aria-invalid');
    });
  }

  if (elements.customerPhoneInput) {
    elements.customerPhoneInput.addEventListener('input', () => {
      invalidateReviewStatus();
      if (elements.customerPhoneError) elements.customerPhoneError.classList.remove('visible');
      elements.customerPhoneInput.removeAttribute('aria-invalid');
    });
  }

  if (elements.customerAddressInput) {
    elements.customerAddressInput.addEventListener('input', () => {
      invalidateReviewStatus();
      if (elements.customerAddressError) elements.customerAddressError.classList.remove('visible');
      elements.customerAddressInput.removeAttribute('aria-invalid');
    });
  }

  if (elements.btnReviewOrder) {
    elements.btnReviewOrder.addEventListener('click', (e) => {
      e.preventDefault();
      handleReviewSubmission();
    });
  }

  if (elements.btnEditDraft) {
    elements.btnEditDraft.addEventListener('click', () => {
      invalidateReviewStatus();
      if (elements.customerNameInput) elements.customerNameInput.focus();
    });
  }

  // Render awal
  renderCategoryFilters();
  renderCatalog();
  renderCart();
  updateCalculationUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
