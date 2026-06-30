import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data to avoid conflicts if re-run
  await prisma.admin.deleteMany({});
  await prisma.siteContent.deleteMany({});
  await prisma.socialMedia.deleteMany({});

  // Seed default Admin
  await prisma.admin.create({
    data: {
      name: 'Admin Mie Gacoan',
      email: 'admin@miegacoan.com',
      password: await bcrypt.hash('password123', 10),
    },
  });

  // Seed default site contents
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
    { key: 'about_desc',      value: 'Mie Gacoan adalah jaringan restoran mie pedas No. 1 di Indonesia.' },
    { key: 'about_cabang',    value: '500+' },
    { key: 'about_tahun',     value: '2016' },
    { key: 'about_pelanggan', value: '1 Juta+' },
    { key: 'hero_info_jam',    value: '10.00 – 22.00' },
    { key: 'hero_info_cabang', value: '500+' },
    { key: 'hero_info_harga',  value: '14rb' },
    { key: 'footer_tagline',  value: 'Pedas, Murah, Bikin Nagih' },
    { key: 'lokasi_embed_url', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.312933939626!2d106.8271528!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e449a562ef%3A0x973a98cc78fb3c6d!2sMie%20Gacoan%20Kuningan!5e0!3m2!1sid!2sid!4v1718876400000!5m2!1sid!2sid' },
    { key: 'lokasi_directions_url', value: 'https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA' },
  ];

  await prisma.siteContent.createMany({ data: defaultContents });

  // Seed social media links
  await prisma.socialMedia.createMany({
    data: [
      { name: 'Instagram', icon: 'Instagram', url: 'https://www.instagram.com/mie.gacoan/', isActive: true, order: 1 },
      { name: 'TikTok',    icon: 'Music2',     url: 'https://www.tiktok.com/@miegacoanofficial', isActive: true, order: 2 },
      { name: 'X',         icon: 'Twitter',    url: 'https://x.com/mie_gacoan', isActive: true, order: 3 },
      { name: 'Facebook',  icon: 'Facebook',   url: 'https://www.facebook.com/miegacoanofficial/?locale=id_ID', isActive: true, order: 4 },
    ],
  });

  console.log('✅ Seed berhasil!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
