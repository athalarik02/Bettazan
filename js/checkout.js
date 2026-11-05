/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modul Validasi Formulir & Pembentukan Pesanan WhatsApp - Bettazan Betta Gallery
 */

import { CONFIG } from './config.js';
import { calculateCartSummary, formatCurrency } from './cart.js';

export function normalizePhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = phone.replace(/[^\d]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

export function validateOrderForm({ name, phone, cityAddress, shippingMethod, cartItems, productsMap }) {
  const errors = {};

  if (!cartItems || cartItems.length === 0) {
    errors.cart = 'Keranjang pesanan masih kosong. Pilih minimal 1 ikan atau produk perawatan.';
  }

  const trimmedName = (name || '').trim();
  if (!trimmedName) {
    errors.name = 'Nama lengkap pemesan wajib diisi.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Nama pemesan minimal 2 karakter.';
  } else if (trimmedName.length > 80) {
    errors.name = 'Nama pemesan maksimal 80 karakter.';
  }

  const cleanPhone = normalizePhoneNumber(phone);
  if (!cleanPhone) {
    errors.phone = 'Nomor WhatsApp aktif wajib diisi.';
  } else if (cleanPhone.length < 8 || cleanPhone.length > 15) {
    errors.phone = 'Nomor WhatsApp tidak valid. Masukkan 8-15 digit angka (contoh: 08123456789).';
  }

  const trimmedAddress = (cityAddress || '').trim();
  if (!trimmedAddress && !shippingMethod.toLowerCase().includes('ambil')) {
    errors.address = 'Kota tujuan atau alamat lengkap pengiriman wajib diisi untuk estimasi ongkir.';
  }

  const isValid = Object.keys(errors).length === 0;

  let summary = null;
  if (isValid) {
    const cartSummary = calculateCartSummary(cartItems, productsMap, shippingMethod);
    summary = {
      customerName: trimmedName,
      customerPhone: cleanPhone,
      cityAddress: trimmedAddress || 'Ambil langsung di Galeri Bettazan',
      shippingMethod,
      cartSummary
    };
  }

  return {
    valid: isValid,
    errors,
    summary
  };
}

export function composeWhatsAppOrderMessage(summary) {
  const { customerName, customerPhone, cityAddress, shippingMethod, cartSummary } = summary;

  let msg = `Halo *${CONFIG.SHOP_NAME}*,\n`;
  msg += `Saya ingin memesan ikan cupang koleksi Bettazan dengan rincian berikut:\n\n`;

  msg += `👤 *DATA PEMESAN*\n`;
  msg += `• Nama: ${customerName}\n`;
  msg += `• No. WA: ${customerPhone}\n`;
  msg += `• Alamat/Kota: ${cityAddress}\n`;
  msg += `• Ekspedisi Pilihan: ${shippingMethod}\n\n`;

  msg += `🐟 *RINCIAN IKAN & PRODUK (${cartSummary.totalUnits} item)*\n`;
  cartSummary.itemsDetail.forEach((item, idx) => {
    msg += `${idx + 1}. [${item.code}] ${item.name}\n`;
    msg += `   ${item.quantity} unit @ ${formatCurrency(item.price)} = ${formatCurrency(item.subtotal)}\n`;
  });

  msg += `\n📦 *BIAYA & ESTIMASI*\n`;
  msg += `• Subtotal Produk: ${formatCurrency(cartSummary.subtotal)}\n`;
  if (cartSummary.isFreePacking) {
    msg += `• Packing Box Styrofoam: *GRATIS (Promo Belanja > 250rb)*\n`;
  } else if (cartSummary.packingFee > 0) {
    msg += `• Packing Box Styrofoam Standar Ikan: ${formatCurrency(cartSummary.packingFee)}\n`;
  } else {
    msg += `• Packing: Tanpa box styrofoam (Ambil di galeri)\n`;
  }
  msg += `• *TOTAL TRANSAKSI: ${formatCurrency(cartSummary.totalAmount)}*\n`;
  msg += `_(Ongkos kirim ekspedisi dihitung terpisah oleh admin)_\n\n`;

  msg += `🛡️ *Garansi D.O.A (Death On Arrival):*\n`;
  msg += `Saya memahami bahwa Bettazan memberikan garansi hidup 100% dengan syarat video unboxing tanpa cut saat paket tiba.\n\n`;
  msg += `Mohon konfirmasi ketersediaan dan nomor rekening pembayaran. Terima kasih!`;

  return msg;
}

export function generateWhatsAppOrderLink(summary) {
  const cleanShopPhone = normalizePhoneNumber(CONFIG.SHOP_PHONE);
  if (!cleanShopPhone) {
    return {
      url: null,
      isConfigured: false,
      error: 'Nomor WhatsApp toko belum diatur.'
    };
  }

  const rawMessage = composeWhatsAppOrderMessage(summary);
  const encoded = encodeURIComponent(rawMessage);
  const url = `https://wa.me/${cleanShopPhone}?text=${encoded}`;

  return {
    url,
    isConfigured: true,
    rawMessage
  };
}

export function generateVideoRequestLink(product) {
  const cleanShopPhone = normalizePhoneNumber(CONFIG.SHOP_PHONE);
  const msg = `Halo ${CONFIG.SHOP_SHORT_NAME}, saya tertarik dengan ikan cupang [${product.code}] - ${product.name} seharga ${formatCurrency(product.price)}. Boleh minta video ngedok (flaring) terbarunya? Terima kasih!`;
  return `https://wa.me/${cleanShopPhone}?text=${encodeURIComponent(msg)}`;
}
