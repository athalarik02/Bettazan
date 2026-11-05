/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modul Penyimpanan Lokal Aman - Bettazan Betta Gallery
 */

import { CONFIG } from './config.js';

export function loadCartFromStorage(productsMap) {
  const defaultState = {
    items: [],
    shippingMethod: CONFIG.EXPEDITIONS[0],
    storageAvailable: true
  };

  try {
    const rawData = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (!rawData) {
      return defaultState;
    }

    const parsed = JSON.parse(rawData);
    if (typeof parsed !== 'object' || parsed === null || parsed.schemaVersion !== CONFIG.SCHEMA_VERSION) {
      return defaultState;
    }

    const validItems = [];
    if (Array.isArray(parsed.items)) {
      for (const item of parsed.items) {
        if (
          item &&
          typeof item.productId === 'string' &&
          productsMap.has(item.productId) &&
          Number.isInteger(item.quantity) &&
          item.quantity >= 1 &&
          item.quantity <= CONFIG.MAX_ITEM_QTY
        ) {
          validItems.push({
            productId: item.productId,
            quantity: item.quantity
          });
        }
      }
    }

    const shippingMethod = typeof parsed.shippingMethod === 'string' && parsed.shippingMethod.trim() 
      ? parsed.shippingMethod.trim() 
      : CONFIG.EXPEDITIONS[0];

    return {
      items: validItems,
      shippingMethod,
      storageAvailable: true
    };
  } catch (error) {
    return {
      items: [],
      shippingMethod: CONFIG.EXPEDITIONS[0],
      storageAvailable: false,
      warning: 'Penyimpanan lokal dibatasi oleh browser. Keranjang tetap dapat digunakan dalam sesi ini.'
    };
  }
}

export function saveCartToStorage(items, shippingMethod) {
  try {
    const payload = {
      schemaVersion: CONFIG.SCHEMA_VERSION,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      shippingMethod: shippingMethod || CONFIG.EXPEDITIONS[0]
    };

    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Tidak dapat menyimpan keranjang ke browser.' };
  }
}

export function clearCartStorage() {
  try {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
