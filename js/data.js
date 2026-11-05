/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Data Katalog 20 Produk Ikan Cupang Hias, Kontes & Perawatan - Bettazan Betta Gallery
 * Setiap produk memiliki foto unik (WYSIWYG) tanpa ada foto yang sama.
 */

export const CATEGORIES = [
  { id: 'semua', label: 'Semua Produk (20)' },
  { id: 'plakat', label: 'Plakat (PK)' },
  { id: 'halfmoon', label: 'Halfmoon (HM)' },
  { id: 'crowntail', label: 'Crown Tail (Serit)' },
  { id: 'doubletail', label: 'Double Tail (Cagak)' },
  { id: 'dumboear', label: 'Dumbo Ear' },
  { id: 'giant', label: 'Giant Betta' },
  { id: 'perawatan', label: 'Pakan & Perlengkapan' }
];

export const PRODUCTS = [
  // 1. Plakat Galaxy Koi Copper
  {
    id: 'bz-pk-galaxy',
    code: 'BZ-PK01',
    name: 'Plakat Galaxy Koi Copper Champion',
    category: 'plakat',
    gender: 'Jantan (Male)',
    sizeGrade: 'M (BO 3.8 cm)',
    age: '4.5 Bulan',
    grade: 'Kontes / Show Grade',
    stock: 'Unlimited Ready',
    price: 275000,
    description: 'Sisik metallic copper tebal dengan motif calico koi merah-hitam-oranye tegas. Sirip dorsal dan anal lebar tegak, mental agresif dan ngedok lincah.',
    image: './assets/images/betta_plakat_galaxy_koi_1793264513640.jpg',
    imageAlt: 'Ikan cupang Plakat Galaxy Koi Copper pose ngedok dengan sisik tembaga berkilau'
  },

  // 2. Halfmoon Rosetail Lavender
  {
    id: 'bz-hm-rosetail',
    code: 'BZ-HM04',
    name: 'Halfmoon Lavender Rosetail Royal',
    category: 'halfmoon',
    gender: 'Jantan (Male)',
    sizeGrade: 'M+ (BO 4.0 cm)',
    age: '4 Bulan',
    grade: 'Top Grade',
    stock: 'Unlimited Ready',
    price: 225000,
    description: 'Bukaan ekor caudal mekar sempurna 180 derajat berlekuk rosetail bak kelopak mawar. Warna lavender pastel berkilap, sirip utuh bersih tanpa robek.',
    image: './assets/images/betta_halfmoon_rosetail_1793264514553.jpg',
    imageAlt: 'Ikan cupang Halfmoon Rosetail warna ungu lavender dengan bukaan ekor 180 derajat'
  },

  // 3. Plakat Blue Rim Pristine
  {
    id: 'bz-pk-bluerim',
    code: 'BZ-PK07',
    name: 'Plakat Blue Rim Pristine Clean Grade A',
    category: 'plakat',
    gender: 'Jantan (Male)',
    sizeGrade: 'S+ (BO 3.5 cm)',
    age: '3.5 Bulan',
    grade: 'Kontes / Show Grade',
    stock: 'Unlimited Ready',
    price: 350000,
    description: 'Tubuh putih padat mulus tanpa bocor flek (clean solid body) dengan rim biru safir rapi melingkari seluruh ujung sirip. Standar kualitas kontes bergengsi.',
    image: './assets/images/betta_plakat_blue_rim_1793264517320.jpg',
    imageAlt: 'Ikan cupang Plakat Blue Rim tubuh putih bersih dengan tepi sirip biru elektrik'
  },

  // 4. Crown Tail Red Dragon
  {
    id: 'bz-ct-reddragon',
    code: 'BZ-CT02',
    name: 'Crown Tail Red Dragon Spider Spikes',
    category: 'crowntail',
    gender: 'Jantan (Male)',
    sizeGrade: 'M (BO 3.7 cm)',
    age: '4 Bulan',
    grade: 'Top Grade',
    stock: 'Unlimited Ready',
    price: 165000,
    description: 'Cupang serit asli Indonesia kualitas ekspor. Duri sirip rapat tajam ganda menyerupai mahkota, sisik naga putih berpadu warna merah rubi pekat.',
    image: './assets/images/betta_crown_tail_red_1793264517026.jpg',
    imageAlt: 'Ikan cupang Serit Crown Tail warna merah menyala dengan duri sirip tajam sempurna'
  },

  // 5. Plakat Samurai Black Armor
  {
    id: 'bz-pk-samurai',
    code: 'BZ-PK11',
    name: 'Plakat Samurai Black Armor Platinum',
    category: 'plakat',
    gender: 'Jantan (Male)',
    sizeGrade: 'M (BO 3.9 cm)',
    age: '4.5 Bulan',
    grade: 'Top Grade',
    stock: 'Unlimited Ready',
    price: 240000,
    description: 'Topeng sisik metallic platinum tebal di bagian kepala dan punggung layaknya zirah ksatria Samurai, berpadu badan hitam legam beludru pekat.',
    image: './assets/images/betta_samurai_black_1793264550907.jpg',
    imageAlt: 'Ikan cupang Plakat Samurai hitam pekat dengan sisik kepala platinum armor tebal'
  },

  // 6. Plakat Nemo Candy Tiger
  {
    id: 'bz-pk-nemocandy',
    code: 'BZ-PK15',
    name: 'Plakat Nemo Candy Tiger Multicolor',
    category: 'plakat',
    gender: 'Jantan (Male)',
    sizeGrade: 'S+ (BO 3.6 cm)',
    age: '3.5 Bulan',
    grade: 'Top Grade',
    stock: 'Unlimited Ready',
    price: 210000,
    description: 'Kombinasi corak loreng harimau cerah warna oranye cerah, kuning lemon, bercak hitam tegas, dan sirip cellophane transparan yang estetik.',
    image: './assets/images/betta_nemo_candy_1793264551311.jpg',
    imageAlt: 'Ikan cupang Plakat Nemo Candy motif belang harimau oranye cerah'
  },

  // 7. Giant Betta Koi Marble Jumbo
  {
    id: 'bz-gt-koi',
    code: 'BZ-GT01',
    name: 'Giant Betta Koi Marble Jumbo BO 6.0',
    category: 'giant',
    gender: 'Jantan (Male)',
    sizeGrade: 'Giant BO 6.0 cm',
    age: '5 Bulan',
    grade: 'Giant Show Grade',
    stock: 'Unlimited Ready',
    price: 385000,
    description: 'Ikan cupang berbadan raksasa kekar dengan panjang badan murni (BO) 6.0 cm. Kepala tebal, nafsu makan tinggi, cocok sebagai maskot akuarium utama.',
    image: './assets/images/betta_giant_koi_1793264553377.jpg',
    imageAlt: 'Ikan cupang Giant berpostur besar motif koi marbel warna warni'
  },

  // 8. Double Tail Cyan Violet
  {
    id: 'bz-dt-cyan',
    code: 'BZ-DT01',
    name: 'Double Tail Cyan Violet Split Fin',
    category: 'doubletail',
    gender: 'Jantan (Male)',
    sizeGrade: 'M (BO 3.8 cm)',
    age: '4 Bulan',
    grade: 'Top Grade',
    stock: 'Unlimited Ready',
    price: 195000,
    description: 'Cupang ekor ganda dengan dua cuping sirip caudal simetris sempurna dan sirip punggung (dorsal) ekstra lebar. Warna biru cyan berkilau dipadu ungu violet.',
    image: './assets/images/betta_double_tail_1793266393113.jpg',
    imageAlt: 'Ikan cupang Double Tail ekor ganda simetris warna cyan elektrik dan violet'
  },

  // 9. Dumbo Ear Big Ear Angel White
  {
    id: 'bz-de-lavender',
    code: 'BZ-DE01',
    name: 'Dumbo Ear Big Ear Angel Wings Pastel',
    category: 'dumboear',
    gender: 'Jantan (Male)',
    sizeGrade: 'M (BO 3.9 cm)',
    age: '4.2 Bulan',
    grade: 'Top Grade',
    stock: 'Unlimited Ready',
    price: 215000,
    description: 'Sirip dayung (pectoral fin) putih salju ekstra besar mekar bak sayap malaikat atau telinga gajah. Sangat anggun saat berenang di dalam akuarium.',
    image: './assets/images/betta_dumbo_ear_1793266393576.jpg',
    imageAlt: 'Ikan cupang Dumbo Ear dengan sirip dayung putih besar seperti sayap'
  },

  // 10. Halfmoon Super Black Melano
  {
    id: 'bz-hm-superblack',
    code: 'BZ-HM08',
    name: 'Halfmoon Super Black Melano Solid',
    category: 'halfmoon',
    gender: 'Jantan (Male)',
    sizeGrade: 'M+ (BO 4.1 cm)',
    age: '4.5 Bulan',
    grade: 'Kontes / Show Grade',
    stock: 'Unlimited Ready',
    price: 230000,
    description: 'Warna hitam legam pekat tanpa noda merah atau biru (pure solid black melano). Ekor mekar 180 derajat lebar dengan tekstur sirip beludru malam.',
    image: './assets/images/betta_halfmoon_super_black_1793266393993.jpg',
    imageAlt: 'Ikan cupang Halfmoon Super Black Melano hitam legam mekar sempurna'
  },

  // 11. Plakat Avatar Gordon Black Blue Star
  {
    id: 'bz-pk-avatar',
    code: 'BZ-PK19',
    name: 'Plakat Avatar Gordon Blue Star Dots',
    category: 'plakat',
    gender: 'Jantan (Male)',
    sizeGrade: 'M (BO 3.7 cm)',
    age: '4 Bulan',
    grade: 'Kontes / Show Grade',
    stock: 'Unlimited Ready',
    price: 320000,
    description: 'Line keturunan Avatar Gordon legendaris dengan tubuh hitam matte dihiasi bintik mutiara biru elektrik seperti gugusan bintang di langit malam.',
    image: './assets/images/betta_avatar_gordon_1793374940136.jpg',
    imageAlt: 'Ikan cupang Plakat Avatar tubuh hitam bintik mutiara biru elektrik'
  },

  // 12. Plakat Hellboy Blood Red Solid
  {
    id: 'bz-pk-hellboy',
    code: 'BZ-PK22',
    name: 'Plakat Hellboy Solid Blood Red',
    category: 'plakat',
    gender: 'Jantan (Male)',
    sizeGrade: 'M (BO 3.8 cm)',
    age: '4 Bulan',
    grade: 'Top Grade',
    stock: 'Unlimited Ready',
    price: 190000,
    description: 'Warna merah darah menyala solid pekat dari kepala hingga ujung ekor dengan sedikit sentuhan hitam di punggung. Mental sangat galak dan responsif cermin.',
    image: './assets/images/betta_hellboy_red_1793374940654.jpg',
    imageAlt: 'Ikan cupang Plakat Hellboy warna merah darah pekat dan mental galak'
  },

  // 13. Halfmoon Red Dragon Scaled
  {
    id: 'bz-hm-reddragon',
    code: 'BZ-HM12',
    name: 'Halfmoon Red Dragon Platinum Scale',
    category: 'halfmoon',
    gender: 'Jantan (Male)',
    sizeGrade: 'M (BO 4.0 cm)',
    age: '4 Bulan',
    grade: 'Top Grade',
    stock: 'Unlimited Ready',
    price: 205000,
    description: 'Lapisan sisik naga putih keperakan tebal membungkus tubuh, berkontras tajam dengan sirip ekor merah menyala yang mekar 180 derajat lebar.',
    image: './assets/images/betta_hm_red_dragon_1793374942114.jpg',
    imageAlt: 'Ikan cupang Halfmoon Red Dragon sisik putih naga dan sirip merah mekar'
  },

  // 14. Crown Tail King Cross Balok
  {
    id: 'bz-ct-kingcrown',
    code: 'BZ-CT05',
    name: 'Crown Tail King Cross Balok Ekor Silang',
    category: 'crowntail',
    gender: 'Jantan (Male)',
    sizeGrade: 'M (BO 3.8 cm)',
    age: '4.5 Bulan',
    grade: 'Kontes / Show Grade',
    stock: 'Unlimited Ready',
    price: 180000,
    description: 'Varietas serit langka dengan duri ekor menyilang rapi (King Crown Tail Cross). Bukaan sirip mengembang penuh dan duri sirip kokoh tidak lemas.',
    image: './assets/images/betta_king_crowntail_1793374942529.jpg',
    imageAlt: 'Ikan cupang Crown Tail King Cross dengan sirip duri menyilang kokoh'
  },

  // 15. Giant Plakat Nemo Multicolor BO 6.2
  {
    id: 'bz-gt-nemo',
    code: 'BZ-GT04',
    name: 'Giant Plakat Nemo Multicolor Big Body BO 6.2',
    category: 'giant',
    gender: 'Jantan (Male)',
    sizeGrade: 'Giant BO 6.2 cm',
    age: '5.5 Bulan',
    grade: 'Giant Show Grade',
    stock: 'Unlimited Ready',
    price: 420000,
    description: 'Postur jumbo raksasa panjang badan 6.2 cm (total panjang dengan ekor 7.8 cm). Warna belang Nemo cerah, tulang tebal, dan sangat jinak saat diberi pakan.',
    image: './assets/images/betta_giant_nemo_1793374943425.jpg',
    imageAlt: 'Ikan cupang Giant Nemo Multicolor ukuran super besar BO 6.2 cm'
  },

  // 16. Sepasang Indukan (Pair) Galaxy Koi Siap Pijah
  {
    id: 'bz-fm-pair',
    code: 'BZ-PR01',
    name: 'Paket Indukan Sepasang (Pair) Galaxy Koi Siap Pijah',
    category: 'plakat',
    gender: '1 Jantan + 1 Betina',
    sizeGrade: 'Sepasang Matang Telur',
    age: '5 Bulan',
    grade: 'Breeding Pair',
    stock: 'Unlimited Ready',
    price: 360000,
    description: 'Paket lengkap ternak: 1 Jantan Galaxy Koi form rapi + 1 Betina Galaxy Koi full telur siap pijah. Lineage terjamin menghasilkan anakan calico koi berkualitas.',
    image: './assets/images/betta_pair_breeding_1793374944618.jpg',
    imageAlt: 'Sepasang indukan jantan dan betina ikan cupang Galaxy Koi siap breeding'
  },

  // 17. Paket Perawatan Cupang Juara 3-in-1
  {
    id: 'bz-care-kit',
    code: 'BZ-CK01',
    name: 'Paket Perawatan Cupang Juara 3-in-1 (Ketapang + Pelet + Garam)',
    category: 'perawatan',
    gender: 'Perawatan Harian',
    sizeGrade: '1 Paket Lengkap',
    age: 'Ekstrak & Pakan',
    grade: 'Essential Care',
    stock: 'Unlimited Ready',
    price: 65000,
    description: 'Set lengkap kesehatan cupang: 1 botol Ekstrak Daun Ketapang Laut Olahan 100ml, 1 kaleng Pelet Protein 60% pemacu warna, dan 250g garam ikan mineral alami.',
    image: './assets/images/betta_care_kit_1793264552662.jpg',
    imageAlt: 'Set perawatan cupang: botol ekstrak daun ketapang laut, pelet dan garam'
  },

  // 18. Ekstrak Daun Ketapang Laut Olahan 250ml
  {
    id: 'bz-care-ketapang',
    code: 'BZ-KT25',
    name: 'Ekstrak Daun Ketapang Laut Murni Olahan 250ml',
    category: 'perawatan',
    gender: 'Kondisioner Air',
    sizeGrade: '250 ml Botol Segel',
    age: 'Formula Alami',
    grade: 'Water Conditioner',
    stock: 'Unlimited Ready',
    price: 35000,
    description: 'Ekstrak daun ketapang laut tua yang sudah diproses steril tanpa minyak. Menstabilkan pH air, mencegah jamur/fin rot, dan membuat warna ikan semakin pekat bersinar.',
    image: './assets/images/ketapang_extract_bottle_1793374945586.jpg',
    imageAlt: 'Botol ekstrak daun ketapang laut murni 250ml untuk perawatan air ikan cupang'
  },

  // 19. Pelet Cupang Super Growth & Color 60g
  {
    id: 'bz-care-pellet',
    code: 'BZ-PL60',
    name: 'Pelet Cupang Super Growth & Color Flaring 60g',
    category: 'perawatan',
    gender: 'Pakan Khusus',
    sizeGrade: '60 gram Tin Can',
    age: 'Protein 60%',
    grade: 'Premium Feed',
    stock: 'Unlimited Ready',
    price: 45000,
    description: 'Pelet mikro butiran 0.5mm kaya spirulina, astaxanthin murni, dan vitamin kompleks. Mempercepat pertumbuhan sirip, menebalkan badan, dan memicu mental agresif.',
    image: './assets/images/betta_pellet_can_1793374944562.jpg',
    imageAlt: 'Kaleng pakan pelet cupang protein tinggi penambah warna dan pertumbuhan'
  },

  // 20. Soliter Akrilik Sekat Hitam 2 Kamar
  {
    id: 'bz-acc-tank',
    code: 'BZ-TK02',
    name: 'Soliter Akrilik Bening Sekat Hitam Geser (2 Kamar Display)',
    category: 'perawatan',
    gender: 'Wadah Display',
    sizeGrade: 'Dimensi 20 x 10 x 15 cm',
    age: 'Tebal 2 mm',
    grade: 'Display Tank',
    stock: 'Unlimited Ready',
    price: 75000,
    description: 'Soliter display akrilik ultra-clear dengan sekat hitam geser untuk latihan ngedok. Tahan pecah, jernih tanpa bayangan, cocok untuk foto dan pajangan meja kerja.',
    image: './assets/images/betta_soliter_tank_1793266394801.jpg',
    imageAlt: 'Soliter display akrilik bening 2 kamar dengan sekat hitam untuk ikan cupang'
  }
];

export const PRODUCTS_MAP = new Map(PRODUCTS.map(p => [p.id, p]));
