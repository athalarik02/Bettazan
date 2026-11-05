/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modul Keranjang & Perhitungan Otomatis - Bettazan Betta Gallery
 */

import { CONFIG } from './config.js';

/**
 * Menambahkan produk ke keranjang belanja (Stok Unlimited).
 * Jika produk sudah ada di keranjang, jumlahnya otomatis bertambah.
 */
export function addItem(items, product, quantityToAdd = 1) {
  const qtyToAdd = Math.max(1, Math.floor(quantityToAdd) || 1);
  const existingIndex = items.findIndex(item => item.productId === product.id);

  if (existingIndex >= 0) {
    return items.map((item, idx) => {
      if (idx === existingIndex) {
        const newQty = Math.min(CONFIG.MAX_ITEM_QTY, item.quantity + qtyToAdd);
        return { ...item, quantity: newQty };
      }
      return item;
    });
  }

  return [...items, { productId: product.id, quantity: Math.min(CONFIG.MAX_ITEM_QTY, qtyToAdd) }];
}

/**
 * Mengubah jumlah produk yang dipilih di dalam keranjang.
 * Jika newQuantity <= 0, item otomatis dihapus dari keranjang.
 */
export function updateQuantity(items, productId, newQuantity) {
  const qty = Math.floor(newQuantity);

  if (isNaN(qty) || qty <= 0) {
    return removeItem(items, productId);
  }

  const clampedQty = Math.min(CONFIG.MAX_ITEM_QTY, qty);

  return items.map(item => {
    if (item.productId === productId) {
      return { ...item, quantity: clampedQty };
    }
    return item;
  });
}

/**
 * Menghapus produk dari keranjang belanja.
 */
export function removeItem(items, productId) {
  return items.filter(item => item.productId !== productId);
}

/**
 * Menghitung rincian total keranjang secara real-time dan otomatis:
 * - Subtotal setiap item (harga * kuantitas)
 * - Subtotal belanja keseluruhan
 * - Biaya packing box styrofoam (Gratis jika subtotal >= 250rb atau ambil di galeri)
 * - Total keseluruhan belanja
 */
export function calculateCartSummary(items, productsMap, shippingMethod = '') {
  let subtotal = 0;
  let totalUnits = 0;

  const itemsDetail = items.map(item => {
    const product = productsMap.get(item.productId);
    if (!product) return null;

    totalUnits += item.quantity;
    const itemSubtotal = product.price * item.quantity;
    subtotal += itemSubtotal;

    return {
      productId: item.productId,
      code: product.code,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal: itemSubtotal
    };
  }).filter(Boolean);

  // Perhitungan packing box styrofoam standar ikan hidup
  const isPickupAtFarm = (shippingMethod || '').toLowerCase().includes('ambil');
  let packingFee = 0;

  if (items.length > 0 && !isPickupAtFarm) {
    if (subtotal >= CONFIG.FREE_PACKING_THRESHOLD) {
      packingFee = 0; // Promo Gratis Packing Box
    } else {
      packingFee = CONFIG.STANDARD_PACKING_FEE;
    }
  }

  const totalAmount = subtotal + packingFee;

  return {
    itemsDetail,
    subtotal,
    packingFee,
    isFreePacking: subtotal >= CONFIG.FREE_PACKING_THRESHOLD && items.length > 0 && !isPickupAtFarm,
    totalAmount,
    totalUnits
  };
}

/**
 * Memformat angka ke format Rupiah standar Indonesia.
 * Contoh: 275000 -> "Rp 275.000"
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}
