import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data to avoid conflicts if re-run
  console.log('Clearing database tables...');
  await prisma.admin.deleteMany({});
  await prisma.siteContent.deleteMany({});
  await prisma.socialMedia.deleteMany({});
  await prisma.menu.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.outlet.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.testimonial.deleteMany({});

  // Seed default Admin
  console.log('Seeding admin account...');
  const hashedPassword = await bcrypt.hash('nabilar123', 10);
  await prisma.admin.create({
    data: {
      name: 'Admin Mie Gacoan',
      email: 'admin@miegacoan.com',
      password: hashedPassword,
    },
  });

  // Seed default site contents
  console.log('Seeding site contents...');
  const defaultContents = [
    { key: 'welcome_quote', value: 'Selamat Datang di Mie Gacoan!' },
    { key: 'welcome_desc',  value: 'Mie Gacoan hadir dengan semangat memberi pengalaman bersantap modern, terjangkau, dan selalu bikin ketagihan.' },
    { key: 'visi',    value: 'Menjadi jaringan restoran mie pedas terbesar dan terpercaya di Indonesia.' },
    { key: 'misi_1',  value: 'Menyajikan mie pedas berkualitas dengan harga terjangkau' },
    { key: 'misi_2',  value: 'Menghadirkan pengalaman bersantap modern' },
    { key: 'misi_3',  value: 'Terus berinovasi dalam menu dan layanan' },
    { key: 'nilai_1', value: 'Pedas' },
    { key: 'nilai_2', value: 'Murah' },
    { key: 'nilai_3', value: 'Nagih' },
    { key: 'nilai_4', value: 'Modern' },
    { key: 'nilai_5', value: 'Untuk Semua' },
    { key: 'about_desc',      value: 'Mie Gacoan adalah jaringan restoran mie pedas No. 1 di Indonesia. Berdiri sejak tahun 2016, kami terus menyajikan kebahagiaan lewat sepiring mie pedas dan dimsum lezat bagi jutaan pelanggan di seluruh penjuru negeri.' },
    { key: 'about_cabang',    value: '500+' },
    { key: 'about_tahun',     value: '2016' },
    { key: 'about_pelanggan', value: '1 Juta+' },
    { key: 'hero_info_jam',    value: '10.00 – 22.00' },
    { key: 'hero_info_cabang', value: '500+' },
    { key: 'hero_info_harga',  value: '14rb' },
    { key: 'footer_tagline',  value: 'Pedas, Murah, Bikin Nagih' },
    { key: 'lokasi_embed_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.312933939626!2d106.8271528!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e449a562ef%3A0x973a98cc78fb3c6d!2sMie%20Gacoan%20Kuningan!5e0!3m2!1sid!2sid!4v1718876400000!5m2!1sid!2sid' },
    { key: 'lokasi_directions_url', value: 'https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA' },
    { key: 'lokasi_title', value: 'Kunjungi Outlet Jagoan Terdekat Anda!' },
    { key: 'lokasi_desc', value: 'Makan langsung di tempat (*dine-in*) untuk merasakan suasana ramai, seru, dan asik khas Mie Gacoan. Kami juga melayani pesan antar (*delivery*) atau dibawa pulang (*take-away*).' },
    { key: 'lokasi_button_text', value: 'Buka di Google Maps' },
  ];

  await prisma.siteContent.createMany({ data: defaultContents });

  // Seed social media links
  console.log('Seeding social media...');
  await prisma.socialMedia.createMany({
    data: [
      { name: 'Instagram', icon: 'Instagram', url: 'https://www.instagram.com/mie.gacoan/', isActive: true, order: 1 },
      { name: 'TikTok',    icon: 'Music2',     url: 'https://www.tiktok.com/@miegacoanofficial', isActive: true, order: 2 },
      { name: 'X',         icon: 'Twitter',    url: 'https://x.com/mie_gacoan', isActive: true, order: 3 },
      { name: 'Facebook',  icon: 'Facebook',   url: 'https://www.facebook.com/miegacoanofficial/?locale=id_ID', isActive: true, order: 4 },
    ],
  });

  // Seed Menu Items
  console.log('Seeding menu items...');
  await prisma.menu.createMany({
    data: [
      {
        name: 'Mie Suit',
        slug: 'mie-suit',
        category: 'mie',
        description: 'Mie polos gurih lembut dibumburi racikan rahasia, ditaburi ayam cincang halus, bawang goreng, dan daun bawang segar. Nikmat gurih asli tanpa rasa pedas sama sekali.',
        price: 12000,
        spicyLevel: 0,
        image: '/uploads/menus/mie-suit.png',
        isActive: true,
      },
      {
        name: 'Mie Hompimpa',
        slug: 'mie-hompimpa',
        category: 'mie',
        description: 'Mie pedas gurih asin khas Mie Gacoan. Disajikan dengan taburan ayam cincang melimpah, daun bawang segar, dan 2 keping kerupuk pangsit renyah tiada tanding.',
        price: 14000,
        spicyLevel: 3,
        image: '/uploads/menus/mie-hompimpa.png',
        isActive: true,
      },
      {
        name: 'Mie Gacoan',
        slug: 'mie-gacoan',
        category: 'mie',
        description: 'Menu andalan kami! Mie pedas manis gurih berpadu dengan kecap manis pilihan, ditaburi ayam cincang lembut, daun bawang, dan pangsit goreng super renyah.',
        price: 14000,
        spicyLevel: 4,
        image: '/uploads/menus/mie-gacoan.png',
        isActive: true,
      },
      {
        name: 'Udang Rambutan',
        slug: 'udang-rambutan',
        category: 'dimsum',
        description: 'Dimsum bola udang goreng yang dibungkus dengan rajangan kulit pangsit renyah menyerupai buah rambutan. Sensasi krispi di luar dan super lembut berdaging di dalam.',
        price: 11000,
        spicyLevel: 0,
        image: '/uploads/menus/udang-rambutan.png',
        isActive: true,
      },
      {
        name: 'Udang Keju',
        slug: 'udang-keju',
        category: 'dimsum',
        description: 'Olahan udang lembut dibalut tepung roti renyah berbentuk bulat lonjong dengan kejutan keju mozarella meleleh yang lumer lumer manis di dalamnya.',
        price: 11000,
        spicyLevel: 0,
        image: '/uploads/menus/udang-keju.png',
        isActive: true,
      },
      {
        name: 'Es Gobak Sodor',
        slug: 'es-gobak-sodor',
        category: 'minuman',
        description: 'Minuman es buah segar berpadu susu kental manis, cincau hitam lembut, nata de coco kenyal, jelly kelapa, buah tropis segar, serta sirup khas merah menyala.',
        price: 10000,
        spicyLevel: 0,
        image: '/uploads/menus/es-gobak-sodor.png',
        isActive: true,
      },
      {
        name: 'Es Genderuwo',
        slug: 'es-genderuwo',
        category: 'minuman',
        description: 'Es pelepas dahaga nomor satu! Porsi besar serutan es manis bersirup mawar merah dengan campuran potongan agar-agar jelly warna-warni, nata de coco segar, dan selasih.',
        price: 10000,
        spicyLevel: 0,
        image: '/uploads/menus/es-genderuwo.png',
        isActive: true,
      },
    ],
  });

  // Seed Package Combos
  console.log('Seeding packages...');
  await prisma.package.createMany({
    data: [
      {
        name: 'Paket Mabar',
        description: 'Solusi nongkrong asyik berdua! Dapatkan 2 porsi Mie (bebas pilih Mie Hompimpa atau Mie Gacoan), 1 porsi Udang Keju lumer, dan 2 gelas Es Gobak Sodor manis segar.',
        price: 45000,
        badge: 'Paling Populer',
        image: '/uploads/packages/paket-mabar.png',
        isActive: true,
      },
      {
        name: 'Paket Kenyang',
        description: 'Makan kenyang sendirian tanpa bikin dompet nangis! Combo 1 porsi Mie Gacoan manis pedas, 1 porsi Udang Rambutan krispi, dan 1 porsi Es Genderuwo jumbo pelepas pedas.',
        price: 32000,
        badge: 'Hemat Juara',
        image: '/uploads/packages/paket-kenyang.png',
        isActive: true,
      },
    ],
  });

  // Seed Outlets
  console.log('Seeding outlets...');
  await prisma.outlet.createMany({
    data: [
      {
        name: 'Mie Gacoan Kuningan',
        city: 'Jakarta',
        address: 'Jl. Prof. DR. Satrio No.18, Kuningan, Karet Kuningan, Kecamatan Setiabudi, Jakarta Selatan',
        openTime: '10.00 – 22.00',
        mapsUrl: 'https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA',
        isOpen: true,
      },
      {
        name: 'Mie Gacoan Margonda',
        city: 'Depok',
        address: 'Jl. Margonda Raya No. 23, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat',
        openTime: '09.00 – 23.00',
        mapsUrl: 'https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA',
        isOpen: true,
      },
      {
        name: 'Mie Gacoan Dago',
        city: 'Bandung',
        address: 'Jl. Ir. H. Juanda No.145, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat',
        openTime: '10.00 – 22.00',
        mapsUrl: 'https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA',
        isOpen: true,
      },
    ],
  });

  // Seed Galleries
  console.log('Seeding galleries...');
  await prisma.gallery.createMany({
    data: [
      {
        image: '/uploads/galleries/gacoan-ambience.png',
        caption: 'Desain interior outlet Mie Gacoan yang modern, bersih, berlampu hangat, dan sangat nyaman untuk berkumpul.',
        category: 'Outlet',
        order: 1,
      },
      {
        image: '/uploads/galleries/gacoan-kitchen.png',
        caption: 'Proses penyiapan hidangan mie segar secara higienis oleh tim dapur profesional kami setiap hari.',
        category: 'Dapur',
        order: 2,
      },
      {
        image: '/uploads/galleries/gacoan-crowd.png',
        caption: 'Senyum ceria kehangatan berkumpul bersama teman sambil menikmati sensasi pedas mantap di sore hari.',
        category: 'Momen',
        order: 3,
      },
      {
        image: '/uploads/galleries/gacoan-food.png',
        caption: 'Close-up kelezatan sepiring Mie Gacoan manis pedas bertabur topping ayam cincang melimpah yang menggoda selera.',
        category: 'Makanan',
        order: 4,
      },
      {
        image: '/uploads/galleries/gacoan-dimsum.png',
        caption: 'Cemilan wajib Udang Keju hangat berbalut tepung krispi dengan keju mozzarella meleleh di dalam.',
        category: 'Dimsum',
        order: 5,
      },
      {
        image: '/uploads/galleries/gacoan-drink.png',
        caption: 'Segarnya racikan buah, jelly kenyal, sirup mawar merah Es Genderuwo untuk meredakan kepedasan Anda.',
        category: 'Minuman',
        order: 6,
      },
    ],
  });

  // Seed Testimonials
  console.log('Seeding testimonials...');
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Rian Prasetya',
        rating: 5,
        content: 'Mie Gacoan level 3 selalu jadi andalan saya tiap akhir pekan! Pedas gurihnya pas banget, ditambah dimsum Udang Rambutan krispi luar biasa. Harganya sangat merakyat.',
      },
      {
        name: 'Siti Rahmawati',
        rating: 5,
        content: 'Tempatnya luas banget, pas buat arisan atau sekadar nugas kuliah. Favorit saya Udang Keju lumernya, kejunya molor banget! Es Gobak Sodornya juga juara segar manisnya.',
      },
      {
        name: 'Andi Wijaya',
        rating: 5,
        content: 'Pelayanannya cepat sekali walaupun antrian selalu ramai mengular. Karyawannya ramah-ramah. Mie Suit-nya aman buat anak saya yang tidak bisa makan pedas.',
      },
      {
        name: 'Clara Amanda',
        rating: 4,
        content: 'Es Genderuwo-nya segar parah, isinya buah jackfruit manis dan agar-agar melimpah. Cocok banget dipadukan dengan kepedasan Mie Hompimpa level 4. Nagih banget!',
      },
      {
        name: 'Budi Santoso',
        rating: 5,
        content: 'Sangat direkomendasikan! Cita rasa mie pedas No. 1 dengan kebersihan outlet yang terus terjaga dengan baik. Selalu rindu rasa pedas manis khas Mie Gacoan.',
      },
    ],
  });

  console.log('✅ Database Seeding Berhasil Lengkap!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
