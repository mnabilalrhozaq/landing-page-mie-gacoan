import React from "react";
import { prisma } from "@/lib/prisma";
import LandingPageClient from "./LandingPageClient";
import { Menu, Package, Outlet, Gallery, Testimonial, HeroSlide, SocialMedia } from "@/types";

export const dynamic = 'force-dynamic';

async function getLandingPageData() {
  try {
    const [contents, heroSlides, menus, packages, outlets, galleries, testimonials, socials] = await Promise.all([
      prisma.siteContent.findMany(),
      prisma.heroSlide.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.menu.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
      }),
      prisma.package.findMany({
        where: { isActive: true },
        orderBy: { id: "asc" },
      }),
      prisma.outlet.findMany({
        orderBy: { id: "asc" },
      }),
      prisma.gallery.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.socialMedia.findMany({
        orderBy: { order: "asc" },
      }),
    ]);

    // Convert key-value array into a single dictionary
    const contentMap = contents.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      content: contentMap,
      // JSON-serialize dates to prevent hydration mismatch warnings
      heroSlides: JSON.parse(JSON.stringify(heroSlides)) as HeroSlide[],
      menus: JSON.parse(JSON.stringify(menus)) as Menu[],
      packages: JSON.parse(JSON.stringify(packages)) as Package[],
      outlets: JSON.parse(JSON.stringify(outlets)) as Outlet[],
      galleries: JSON.parse(JSON.stringify(galleries)) as Gallery[],
      testimonials: JSON.parse(JSON.stringify(testimonials)) as Testimonial[],
      socials: JSON.parse(JSON.stringify(socials)) as SocialMedia[],
    };
  } catch (error) {
    console.error("Database connection failed. Serving fallback mock data.", error);
    
    const fallbackContents = [
      { key: "welcome_quote", value: "Selamat Datang di Mie Gacoan!" },
      { key: "welcome_desc", value: "Mie Gacoan hadir dengan semangat memberi pengalaman bersantap modern, terjangkau, dan selalu bikin ketagihan." },
      { key: "visi", value: "Menjadi jaringan restoran mie pedas terbesar dan terpercaya di Indonesia." },
      { key: "misi_1", value: "Menyajikan mie pedas berkualitas dengan harga terjangkau" },
      { key: "misi_2", value: "Menghadirkan pengalaman bersantap modern" },
      { key: "misi_3", value: "Terus berinovasi dalam menu dan layanan" },
      { key: "nilai_1", value: "Pedas" },
      { key: "nilai_2", value: "Murah" },
      { key: "nilai_3", value: "Nagih" },
      { key: "nilai_4", value: "Modern" },
      { key: "nilai_5", value: "Untuk Semua" },
      { key: "about_desc", value: "Mie Gacoan adalah jaringan restoran mie pedas No. 1 di Indonesia. Berdiri sejak tahun 2016, kami terus menyajikan kebahagiaan lewat sepiring mie pedas dan dimsum lezat bagi jutaan pelanggan di seluruh penjuru negeri." },
      { key: "about_cabang", value: "500+" },
      { key: "about_tahun", value: "2016" },
      { key: "about_pelanggan", value: "1 Juta+" },
      { key: "hero_info_jam", value: "10.00 – 22.00" },
      { key: "hero_info_cabang", value: "500+" },
      { key: "hero_info_harga", value: "14rb" },
      { key: "footer_tagline", value: "Pedas, Murah, Bikin Nagih" },
      { key: "lokasi_embed_url", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.312933939626!2d106.8271528!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e449a562ef%3A0x973a98cc78fb3c6d!2sMie%20Gacoan%20Kuningan!5e0!3m2!1sid!2sid!4v1718876400000!5m2!1sid!2sid" },
      { key: "lokasi_directions_url", value: "https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA" },
    ];

    const contentMap = fallbackContents.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);    return JSON.parse(
      JSON.stringify({
        content: contentMap,
        heroSlides: [
          { id: 1, image: "/uploads/menus/mie-gacoan.png", order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
          { id: 2, image: "/uploads/menus/mie-hompimpa.png", order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
          { id: 3, image: "/uploads/menus/mie-suit.png", order: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() }
        ] as any[],
        menus: [
          {
            id: 1,
            name: "Mie Suit",
            slug: "mie-suit",
            category: "mie",
            description: "Mie polos gurih lembut dibumburi racikan rahasia, ditaburi ayam cincang halus, bawang goreng, dan daun bawang segar. Nikmat gurih asli tanpa rasa pedas sama sekali.",
            price: 12000,
            spicyLevel: 0,
            image: "/uploads/menus/mie-suit.png",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            name: "Mie Hompimpa",
            slug: "mie-hompimpa",
            category: "mie",
            description: "Mie pedas gurih asin khas Mie Gacoan. Disajikan dengan taburan ayam cincang melimpah, daun bawang segar, dan 2 keping kerupuk pangsit renyah tiada tanding.",
            price: 14000,
            spicyLevel: 3,
            image: "/uploads/menus/mie-hompimpa.png",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 3,
            name: "Mie Gacoan",
            slug: "mie-gacoan",
            category: "mie",
            description: "Menu andalan kami! Mie pedas manis gurih berpadu dengan kecap manis pilihan, ditaburi ayam cincang lembut, daun bawang, dan pangsit goreng super renyah.",
            price: 14000,
            spicyLevel: 4,
            image: "/uploads/menus/mie-gacoan.png",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 4,
            name: "Udang Rambutan",
            slug: "udang-rambutan",
            category: "dimsum",
            description: "Dimsum bola udang goreng yang dibungkus dengan rajangan kulit pangsit renyah menyerupai buah rambutan. Sensasi krispi di luar and super lembut berdaging di dalam.",
            price: 11000,
            spicyLevel: 0,
            image: "/uploads/menus/udang-rambutan.png",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 5,
            name: "Udang Keju",
            slug: "udang-keju",
            category: "dimsum",
            description: "Olahan udang lembut dibalut tepung roti renyah berbentuk bulat lonjong dengan kejutan keju mozzarella meleleh yang lumer lumer manis di dalamnya.",
            price: 11000,
            spicyLevel: 0,
            image: "/uploads/menus/udang-keju.png",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 6,
            name: "Es Gobak Sodor",
            slug: "es-gobak-sodor",
            category: "minuman",
            description: "Minuman es buah segar berpadu susu kental manis, cincau hitam lembut, nata de coco kenyal, jelly kelapa, buah tropis segar, serta sirup khas merah menyala.",
            price: 10000,
            spicyLevel: 0,
            image: "/uploads/menus/es-gobak-sodor.png",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 7,
            name: "Es Genderuwo",
            slug: "es-genderuwo",
            category: "minuman",
            description: "Es pelepas dahaga nomor satu! Porsi besar serutan es manis bersirup mawar merah dengan campuran potongan agar-agar jelly warna-warni, nata de coco segar, dan selasih.",
            price: 10000,
            spicyLevel: 0,
            image: "/uploads/menus/es-genderuwo.png",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ] as any[],
        packages: [
          {
            id: 1,
            name: "Paket Mabar",
            description: "Solusi nongkrong asyik berdua! Dapatkan 2 porsi Mie (bebas pilih Mie Hompimpa atau Mie Gacoan), 1 porsi Udang Keju lumer, dan 2 gelas Es Gobak Sodor manis segar.",
            price: 45000,
            badge: "Paling Populer",
            image: "/uploads/packages/paket-mabar.png",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            name: "Paket Kenyang",
            description: "Makan kenyang sendirian tanpa bikin dompet nangis! Combo 1 porsi Mie Gacoan manis pedas, 1 porsi Udang Rambutan krispi, dan 1 porsi Es Genderuwo jumbo pelepas pedas.",
            price: 32000,
            badge: "Hemat Juara",
            image: "/uploads/packages/paket-kenyang.png",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ] as any[],
        outlets: [
          {
            id: 1,
            name: "Mie Gacoan Kuningan",
            city: "Jakarta",
            address: "Jl. Prof. DR. Satrio No.18, Kuningan, Karet Kuningan, Kecamatan Setiabudi, Jakarta Selatan",
            openTime: "10.00 – 22.00",
            mapsUrl: "https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA",
            isOpen: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            name: "Mie Gacoan Margonda",
            city: "Depok",
            address: "Jl. Margonda Raya No. 23, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat",
            openTime: "09.00 – 23.00",
            mapsUrl: "https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA",
            isOpen: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 3,
            name: "Mie Gacoan Dago",
            city: "Bandung",
            address: "Jl. Ir. H. Juanda No.145, Lb. Siliwangi, Kecamatan Coblong, Kota Bandung, Jawa Barat",
            openTime: "10.00 – 22.00",
            mapsUrl: "https://maps.app.goo.gl/y5f6XNuHn3sVqDkPA",
            isOpen: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ] as any[],
        galleries: [
          {
            id: 1,
            image: "/uploads/menus/mie-gacoan.png",
            caption: "Desain interior outlet Mie Gacoan yang modern, bersih, berlampu hangat, dan sangat nyaman untuk berkumpul.",
            category: "Outlet",
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ] as any[],
        testimonials: [
          {
            id: 1,
            name: "Rian Prasetya",
            rating: 5,
            content: "Mie Gacoan level 3 selalu jadi andalan saya tiap akhir pekan! Pedas gurihnya pas banget, ditambah dimsum Udang Rambutan krispi luar biasa. Harganya sangat merakyat.",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        socials: [
          {
            id: 1,
            name: "Instagram",
            icon: "Instagram",
            url: "https://www.instagram.com/mie.gacoan/",
            isActive: true,
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
      })
    ) as any;
  }
}

export default async function Home() {
  const data = await getLandingPageData();

  return <LandingPageClient data={data} />;
}
