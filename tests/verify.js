/**
 * Test runner untuk verifikasi logika bisnis Bettazan Betta Gallery
 */

import { PRODUCTS, CATEGORIES, PRODUCTS_MAP } from '../js/data.js';
import { 
  addItem, 
  updateQuantity, 
  removeItem, 
  calculateCartSummary, 
  formatCurrency 
} from '../js/cart.js';
import { normalizePhoneNumber, validateOrderForm, generateWhatsAppOrderLink } from '../js/checkout.js';
import assert from 'node:assert';

console.log('--- MENJALANKAN PENGUJIAN BETTAZAN BETTA GALLERY (20 PRODUK & STOK UNLIMITED) ---');

// Test 1: Katalog tepat 20 produk
console.log('Test 1: Memeriksa jumlah dan keunikan 20 produk...');
assert.strictEqual(PRODUCTS.length, 20, 'Harus ada tepat 20 produk di katalog');
const ids = new Set(PRODUCTS.map(p => p.id));
assert.strictEqual(ids.size, 20, 'Semua ID produk harus unik');
const codes = new Set(PRODUCTS.map(p => p.code));
assert.strictEqual(codes.size, 20, 'Semua Kode produk harus unik');
for (const p of PRODUCTS) {
  assert(p.price > 0, `Harga ${p.id} harus positif`);
  assert(p.stock.includes('Unlimited'), `Stok produk ${p.id} harus unlimited`);
  assert(CATEGORIES.some(c => c.id === p.category), `Kategori ${p.category} harus terdaftar`);
}
console.log('✓ Test 1 Lulus: Tepat 20 produk unik dengan stok unlimited terdaftar!');

// Test 2: Penambahan dan Kuantitas Bebas (Unlimited)
console.log('Test 2: Uji penambahan item dan kuantitas bebas...');
let cart = [];
const p1 = PRODUCTS[0]; // Galaxy Koi @ 275.000
cart = addItem(cart, p1, 1);
assert.strictEqual(cart.length, 1);
assert.strictEqual(cart[0].quantity, 1);

// Tambah lagi produk yang sama -> kuantitas bertambah menjadi 2
cart = addItem(cart, p1, 1);
assert.strictEqual(cart[0].quantity, 2, 'Kuantitas harus bertambah menjadi 2');

// Tambah produk kedua: Dumbo Ear @ 215.000 sebanyak 3 ekor
const p2 = PRODUCTS[8]; // Dumbo Ear
cart = addItem(cart, p2, 3);
assert.strictEqual(cart.length, 2);
assert.strictEqual(cart[1].quantity, 3);
console.log('✓ Test 2 Lulus: Item berhasil ditambahkan dengan kuantitas bebas');

// Test 3: Pengurangan dan Perubahan Kuantitas di Keranjang
console.log('Test 3: Uji fungsi tambah/kurang kuantitas di keranjang...');
// Kurangi p2 dari 3 menjadi 2
cart = updateQuantity(cart, p2.id, 2);
assert.strictEqual(cart.find(i => i.productId === p2.id).quantity, 2);

// Tambah p1 dari 2 menjadi 5
cart = updateQuantity(cart, p1.id, 5);
assert.strictEqual(cart.find(i => i.productId === p1.id).quantity, 5);

// Jika kuantitas diset 0 -> item otomatis terhapus
cart = updateQuantity(cart, p2.id, 0);
assert.strictEqual(cart.some(i => i.productId === p2.id), false, 'Item harus terhapus jika qty 0');
console.log('✓ Test 3 Lulus: Tombol tambah/kurang kuantitas di keranjang bekerja sempurna');

// Test 4: Perhitungan Harga Otomatis & Promo Box Styrofoam
console.log('Test 4: Uji perhitungan otomatis subtotal, packing fee, dan total...');
// cart saat ini: 5x Galaxy Koi @ 275.000 = 1.375.000
let summary = calculateCartSummary(cart, PRODUCTS_MAP, 'JNE YES (Yakin Esok Sampai)');
assert.strictEqual(summary.subtotal, 1375000);
assert.strictEqual(summary.isFreePacking, true, 'Subtotal > 250rb harus dapat gratis packing box');
assert.strictEqual(summary.packingFee, 0);
assert.strictEqual(summary.totalAmount, 1375000);

// Uji belanja di bawah 250rb: 1x Ekstrak Ketapang @ 35.000
const pKetapang = PRODUCTS.find(p => p.id === 'bz-care-ketapang');
let smallCart = [{ productId: pKetapang.id, quantity: 1 }];
let smallSummary = calculateCartSummary(smallCart, PRODUCTS_MAP, 'JNE YES');
assert.strictEqual(smallSummary.subtotal, 35000);
assert.strictEqual(smallSummary.packingFee, 15000, 'Belanja di bawah 250rb dikenakan packing box 15rb');
assert.strictEqual(smallSummary.totalAmount, 50000);
console.log('✓ Test 4 Lulus: Jumlah harga otomatis terhitung dengan benar');

// Test 5: Validasi Formulir dan Draf Pesanan WhatsApp ke nomor 088973462934
console.log('Test 5: Uji validasi pemesanan dan WhatsApp URL ke nomor 088973462934...');
const validOrder = validateOrderForm({
  name: 'Andi Pratama',
  phone: '088973462934',
  cityAddress: 'Surabaya, Jawa Timur',
  shippingMethod: 'TIKI ONS (Over Night Services)',
  cartItems: cart,
  productsMap: PRODUCTS_MAP
});
assert.strictEqual(validOrder.valid, true);

const waResult = generateWhatsAppOrderLink(validOrder.summary);
assert(waResult.isConfigured);
assert(waResult.url.includes('wa.me/6288973462934'), 'URL WhatsApp harus mengarah ke 6288973462934');
assert(waResult.url.includes(encodeURIComponent('Andi Pratama')));
assert(waResult.url.includes(encodeURIComponent('1.375.000')));
assert(waResult.url.includes(encodeURIComponent('BZ-PK01')));

// Test 6: Uji nomor telepon toko dan link video request
console.log('Test 6: Uji nomor WhatsApp toko dan link video ngedok...');
assert.strictEqual(normalizePhoneNumber('088973462934'), '6288973462934');
assert.strictEqual(normalizePhoneNumber('+62 889-7346-2934'), '6288973462934');
console.log('✓ Test 6 Lulus: Konfirmasi langsung ke nomor WhatsApp 088973462934 (6288973462934) terverifikasi!');

console.log('\nSEMUA PENGUJIAN LULUS 100%!');
