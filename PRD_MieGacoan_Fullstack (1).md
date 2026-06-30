# Product Requirements Document (PRD)
## Landing Page Mie Gacoan — Full-stack Next.js Edition
**Version:** 1.3  
**Last Updated:** 2026  
**Stack:** Next.js 14 · TypeScript · Three.js · Tailwind CSS · Framer Motion · Prisma · MySQL

---

## 1. Gambaran Umum Proyek

### 1.1 Deskripsi
Website landing page untuk **Mie Gacoan** — jaringan restoran mie pedas No. 1 di Indonesia. Dibangun dengan pendekatan **Full-stack Next.js** — frontend dan backend dalam satu project, satu folder, satu command. Website ini bersifat informatif dan dapat dikelola admin melalui panel tersembunyi.

### 1.2 Tujuan
- Menampilkan informasi restoran Mie Gacoan secara menarik dan profesional
- Memudahkan admin mengelola konten tanpa menyentuh kode
- Pengalaman pengguna premium dengan animasi 3D (Three.js) + Framer Motion
- SEO-friendly secara native dengan Next.js SSR/SSG
- Setup semudah mungkin — 1 folder, 1 command

### 1.3 Target Pengguna
- **Pengunjung umum:** Pelanggan atau calon pelanggan Mie Gacoan
- **Admin:** Pengelola konten website (satu akun)

### 1.4 ⚠️ Kepatuhan Terhadap Mockup (WAJIB)

> **PENTING:** Tampilan, pewarnaan, konten, urutan section, dan animasi landing page WAJIB sama persis 1:1 dengan mockup yang sudah disepakati di awal proses brainstorming. Ini bukan rekomendasi, melainkan requirement keras.

Yang dimaksud 1:1 dengan mockup:
- **Warna**: tosca `#4DC8D0`, pink `#C2547A`, kuning `#F0D050` — tidak boleh diganti tanpa instruksi eksplisit
- **Font**: Amatic SC (heading) + Plus Jakarta Sans (body) — wajib dipakai persis
- **Urutan section**: Navbar → Hero → Welcome → About → Menu → Paket → Outlets → Galeri → Testimoni → Lokasi → Footer (tidak boleh diacak/dihilangkan)
- **Konten tiap section**: sesuai spesifikasi detail di Bab 9 (Spesifikasi Komponen Frontend)
- **Animasi**: semua animasi yang dispesifikasikan (Three.js particles, Framer Motion scroll, TypewriterEffect, CursorFollow, ExpandableTabs, ProgressiveFluxLoader) wajib diimplementasikan — bukan opsional

Jika AI builder (Antigravity/Kiro) menyimpang dari spesifikasi ini, developer wajib meminta revisi sampai sesuai.

---

## 2. Tech Stack

### 2.1 Semua dalam Satu Project
| Teknologi | Versi | Kegunaan |
|---|---|---|
| Next.js | ^14 | Frontend + Backend (App Router + Route Handlers) |
| TypeScript | ^5 | Type safety frontend & backend |
| Tailwind CSS | ^3 | Utility styling |
| shadcn/ui | latest | Komponen UI base (Button, Input, Table, dll) |
| Framer Motion | ^11 | Animasi UI (scroll, transition, stagger, splash screen, dll) |
| Three.js | ^0.165 | Animasi 3D background hero |
| @react-three/fiber | ^8 | React renderer untuk Three.js |
| @react-three/drei | ^9 | Helper components Three.js |
| Prisma ORM | ^5 | Database query & schema |
| MySQL | ^8 | Database |
| jsonwebtoken | ^9 | JWT auth |
| bcryptjs | ^2 | Hash password |
| multer | ^1 | Upload file/foto |
| slugify | ^1 | Generate slug menu |
| zustand | ^4 | State management (modal global, auth state) |
| usehooks-ts | latest | Utility hooks (dibutuhkan ExpandableTabs) |
| next/font | bawaan | Optimasi Google Fonts |

### 2.2 Struktur — Satu Folder
```
mie-gacoan/          ← satu folder, satu project
├── app/             ← frontend + backend API
├── components/      ← React components
├── prisma/          ← database schema
├── lib/             ← shared utilities
├── types/           ← shared TypeScript types
├── public/          ← static assets + uploaded files
├── package.json     ← satu package.json
└── .env
```

### 2.3 Cara Jalankan
```bash
# Install semua dependencies
npm install

# Jalankan development (frontend + backend sekaligus)
npm run dev

# Selesai! Buka http://localhost:3000
```

### 2.4 Perbandingan dengan Versi Lain
| Aspek | React+Vite+Laravel | Next.js+Laravel | Full-stack Next.js |
|---|---|---|---|
| Command dev | 2x | 2x | **1x** |
| Folder | 2 | 2 | **1** |
| Bahasa | JS + PHP | TS + PHP | **TS semua** |
| CORS config | Perlu | Perlu | **Tidak perlu** |
| Deploy | 2 server | 2 server | **1 server** |
| Shared types | Tidak | Tidak | **Ya** |

---

## 3. Design System

### 3.1 Color Palette
```ts
// tailwind.config.ts
colors: {
  primary:   '#C2547A',  // Pink Magenta — heading, CTA
  secondary: '#4DC8D0',  // Tosca — accent, divider
  accent:    '#F0D050',  // Kuning — ornamen dekoratif
  dark:      '#1a1a2e',  // Navy dark — footer, admin sidebar
  light:     '#fafafa',  // Background section alternatif
}
```

### 3.2 Typography
```ts
// app/layout.tsx
import { Amatic_SC, Plus_Jakarta_Sans } from 'next/font/google'

const amaticSC = Amatic_SC({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-amatic',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-jakarta',
})
```

```ts
// tailwind.config.ts
fontFamily: {
  heading: ['var(--font-amatic)', 'cursive'],
  body:    ['var(--font-jakarta)', 'sans-serif'],
}
```

### 3.3 Ornamen Dekoratif
Divider khas tiap section header:
```
─────── ◇◇ ───────
```
Komponen reusable `<SectionDivider />`.

---

## 4. Struktur Folder Lengkap

```
mie-gacoan/
├── app/
│   ├── layout.tsx                    ← Root layout + fonts + providers
│   ├── page.tsx                      ← Landing page / (SSG+ISR)
│   ├── globals.css
│   │
│   ├── menu/
│   │   └── page.tsx                  ← Halaman menu lengkap
│   ├── testimoni/
│   │   └── page.tsx                  ← Form submit testimoni
│   │
│   ├── admin/
│   │   ├── layout.tsx                ← Admin layout (sidebar + topbar)
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── welcome/page.tsx
│   │   ├── about/page.tsx
│   │   ├── hero/page.tsx
│   │   ├── logo/page.tsx
│   │   ├── footer/page.tsx           ← Kelola tagline & sosmed footer
│   │   ├── menu/page.tsx
│   │   ├── paket/page.tsx
│   │   ├── outlets/page.tsx
│   │   ├── galeri/page.tsx
│   │   └── testimoni/page.tsx
│   │
│   └── api/                          ← Backend API (Route Handlers)
│       ├── content/
│       │   ├── route.ts              ← GET /api/content
│       │   └── logo/
│       │       └── route.ts          ← POST/DELETE /api/content/logo
│       ├── hero-slides/
│       │   ├── route.ts              ← GET /api/hero-slides
│       │   └── [id]/
│       │       └── route.ts          ← PUT/DELETE /api/hero-slides/[id]
│       ├── menus/
│       │   ├── route.ts              ← GET /api/menus
│       │   └── [slug]/
│       │       └── route.ts          ← GET /api/menus/[slug]
│       ├── packages/
│       │   └── route.ts              ← GET /api/packages
│       ├── outlets/
│       │   └── route.ts              ← GET /api/outlets
│       ├── galleries/
│       │   └── route.ts              ← GET /api/galleries
│       ├── testimonials/
│       │   └── route.ts              ← GET/POST /api/testimonials
│       └── admin/
│           ├── auth/
│           │   ├── login/route.ts    ← POST /api/admin/auth/login
│           │   └── logout/route.ts   ← POST /api/admin/auth/logout
│           ├── dashboard/
│           │   ├── stats/route.ts    ← GET /api/admin/dashboard/stats
│           │   └── activity/route.ts ← GET /api/admin/dashboard/activity
│           ├── content/
│           │   ├── route.ts          ← PUT /api/admin/content (termasuk footer)
│           │   └── logo/route.ts     ← POST/DELETE logo
│           ├── hero-slides/
│           │   ├── route.ts          ← GET/POST
│           │   └── [id]/route.ts     ← PUT/DELETE
│           ├── menus/
│           │   ├── route.ts          ← GET/POST
│           │   └── [id]/
│           │       ├── route.ts      ← PUT/DELETE
│           │       └── image/route.ts ← POST foto
│           ├── packages/
│           │   ├── route.ts
│           │   └── [id]/
│           │       ├── route.ts
│           │       └── image/route.ts
│           ├── outlets/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           ├── galleries/
│           │   ├── route.ts
│           │   └── [id]/route.ts
│           └── testimonials/
│               └── route.ts          ← GET (read-only)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── SplashScreen.tsx          ← Pakai ProgressiveFluxLoader
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Welcome.tsx
│   │   ├── About.tsx
│   │   ├── Menu.tsx
│   │   ├── Paket.tsx
│   │   ├── Outlets.tsx
│   │   ├── Galeri.tsx
│   │   ├── Testimoni.tsx
│   │   └── Lokasi.tsx
│   ├── three/
│   │   └── ParticleBackground.tsx    ← Three.js particles
│   ├── admin/
│   │   ├── InlineForm.tsx            ← Form collapsible reusable (CRUD pattern)
│   │   ├── DataTable.tsx             ← Tabel reusable dengan aksi Edit/Hapus
│   │   ├── ConfirmInline.tsx         ← Konfirmasi hapus inline (bukan modal)
│   │   └── QuickAccessCard.tsx       ← Card dashboard dengan tombol CRUD
│   └── ui/
│       ├── SectionHeader.tsx
│       ├── SectionDivider.tsx
│       ├── MenuCard.tsx
│       ├── AnimatedSection.tsx
│       ├── AnimatedCounter.tsx
│       ├── expandable-tabs.tsx       ← Navbar (dari prompt 2)
│       ├── typewriter-effect.tsx     ← Judul section (dari prompt 3)
│       ├── cursor-follow.tsx         ← Hover menu/paket (dari prompt 4)
│       └── progressive-flux-loader.tsx ← Splash screen (dari prompt 1)
│
├── hooks/
│   ├── useScrollAnimation.ts
│   ├── useLoadingProgress.ts
│   ├── useAuth.ts                    ← Zustand store auth + auto refresh
│   └── useCounter.ts
│
├── lib/
│   ├── prisma.ts                     ← Prisma client singleton
│   ├── jwt.ts                        ← JWT helper (access + refresh token)
│   ├── auth.ts                       ← Middleware auth helper
│   ├── adminFetch.ts                 ← Fetch wrapper dgn auto-refresh token
│   ├── upload.ts                     ← Multer config
│   ├── rateLimit.ts                  ← Rate limiter config
│   └── utils.ts                      ← cn() helper untuk shadcn/ui
│
├── types/
│   └── index.ts                      ← Shared TypeScript interfaces
│
├── prisma/
│   ├── schema.prisma                 ← Database schema
│   └── seed.ts                       ← Seed data admin
│
├── public/
│   └── uploads/                      ← Folder upload foto
│       ├── logo/
│       ├── hero/
│       ├── menus/
│       ├── packages/
│       └── galleries/
│
├── middleware.ts                     ← Route protection admin
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env
└── package.json
```

---

## 5. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Admin {
  id         Int      @id @default(autoincrement())
  name       String   @db.VarChar(100)
  email      String   @unique @db.VarChar(150)
  password   String   @db.VarChar(255)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model SiteContent {
  id        Int      @id @default(autoincrement())
  key       String   @unique @db.VarChar(100)
  value     String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model HeroSlide {
  id        Int      @id @default(autoincrement())
  image     String   @db.VarChar(255)
  order     Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Sosial media footer — fleksibel, admin bisa tambah/hapus sosmed apapun
model SocialMedia {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)  // contoh: "Instagram", "WhatsApp"
  icon      String   @db.VarChar(50)   // nama icon lucide-react, contoh: "Instagram", "MessageCircle"
  url       String   @db.VarChar(500)
  isActive  Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Menu {
  id          Int          @id @default(autoincrement())
  name        String       @db.VarChar(150)
  slug        String       @unique @db.VarChar(150)
  category    MenuCategory
  description String?      @db.Text
  price       Int
  spicyLevel  Int          @default(0)  // 0-5
  image       String?      @db.VarChar(255)
  isActive    Boolean      @default(true)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

enum MenuCategory {
  mie
  dimsum
  minuman
}

model Package {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(150)
  description String?  @db.Text
  price       Int
  badge       String?  @db.VarChar(50)
  image       String?  @db.VarChar(255)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Outlet {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(150)
  city      String   @db.VarChar(100)
  address   String   @db.Text
  openTime  String?  @db.VarChar(20)
  mapsUrl   String?  @db.VarChar(500)  // Link Google Maps dari browser
  isOpen    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Gallery {
  id        Int      @id @default(autoincrement())
  image     String   @db.VarChar(255)
  caption   String?  @db.VarChar(255)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Testimonial {
  id         Int      @id @default(autoincrement())
  name       String?  @db.VarChar(100)
  outletName String?  @db.VarChar(150)
  rating     Int      // 1-5
  content    String   @db.Text
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

## 6. TypeScript Shared Types

```ts
// types/index.ts — dipakai di frontend DAN backend (Route Handlers)

export type MenuCategory = 'mie' | 'dimsum' | 'minuman'

export interface Menu {
  id: number
  name: string
  slug: string
  category: MenuCategory
  description: string | null
  price: number
  spicyLevel: number
  image: string | null
  isActive: boolean
}

export interface Package {
  id: number
  name: string
  description: string | null
  price: number
  badge: string | null
  image: string | null
  isActive: boolean
}

export interface Outlet {
  id: number
  name: string
  city: string
  address: string
  openTime: string | null
  mapsUrl: string | null
  isOpen: boolean
}

export interface Gallery {
  id: number
  image: string
  caption: string | null
  order: number
}

export interface Testimonial {
  id: number
  name: string | null
  outletName: string | null
  rating: number
  content: string
  createdAt: string
}

export interface HeroSlide {
  id: number
  image: string
  order: number
  isActive: boolean
}

export interface SocialMedia {
  id: number
  name: string
  icon: string
  url: string
  isActive: boolean
  order: number
}

export interface SiteContent {
  key: string
  value: string
}

export interface DashboardStats {
  totalMenus: number
  totalPackages: number
  totalOutlets: number
  totalGalleries: number
  totalTestimonials: number
}

export interface AuthResponse {
  token: string
  expiresIn: number
}
```

---

## 7. API Route Handlers

### 7.0 Daftar Lengkap Endpoint (Referensi Cepat)

**Public API:**
```
GET  /api/content              → Semua site content (key-value)
GET  /api/hero-slides          → Foto slideshow aktif
GET  /api/social-media         → List sosmed aktif (untuk footer)
GET  /api/menus                → List menu aktif
GET  /api/menus?category=      → Filter per kategori
GET  /api/menus/[slug]         → Detail menu
GET  /api/packages             → List paket aktif
GET  /api/outlets              → List outlet
GET  /api/outlets?city=        → Filter per kota
GET  /api/galleries            → Foto galeri
GET  /api/testimonials         → List testimoni
POST /api/testimonials         → Submit testimoni baru (langsung tampil)
```

**Admin Auth API:**
```
POST /api/admin/auth/login     → Login, set access + refresh token cookie
POST /api/admin/auth/refresh   → Refresh access token pakai refresh token
POST /api/admin/auth/logout    → Hapus kedua cookie
GET  /api/admin/auth/me        → Data admin yang sedang login
```

**Admin Protected API (semua butuh access token valid via cookie):**
```
GET    /api/admin/dashboard/stats         → Statistik dashboard
GET    /api/admin/dashboard/activity      → Aktivitas terbaru
PUT    /api/admin/content                 → Update site content (welcome, visi, misi, dll)
POST   /api/admin/content/logo            → Upload logo (dipakai navbar+splash+footer)
DELETE /api/admin/content/logo            → Hapus logo
GET    /api/admin/hero-slides             → List foto hero
POST   /api/admin/hero-slides             → Upload foto hero
PUT    /api/admin/hero-slides/[id]        → Update urutan/status
DELETE /api/admin/hero-slides/[id]        → Hapus foto
GET    /api/admin/social-media            → List sosmed
POST   /api/admin/social-media            → Tambah sosmed
PUT    /api/admin/social-media/[id]       → Update sosmed
DELETE /api/admin/social-media/[id]       → Hapus sosmed
PATCH  /api/admin/social-media/[id]       → Toggle isActive
GET    /api/admin/menus                   → List semua menu
POST   /api/admin/menus                   → Tambah menu
PUT    /api/admin/menus/[id]              → Update menu
DELETE /api/admin/menus/[id]              → Hapus menu
POST   /api/admin/menus/[id]/image        → Upload foto menu
GET    /api/admin/packages                → List paket
POST   /api/admin/packages                → Tambah paket
PUT    /api/admin/packages/[id]           → Update paket
DELETE /api/admin/packages/[id]           → Hapus paket
POST   /api/admin/packages/[id]/image     → Upload foto paket
GET    /api/admin/outlets                 → List outlet
POST   /api/admin/outlets                 → Tambah outlet
PUT    /api/admin/outlets/[id]            → Update outlet
DELETE /api/admin/outlets/[id]            → Hapus outlet
PATCH  /api/admin/outlets/[id]            → Toggle isOpen
GET    /api/admin/galleries               → List galeri
POST   /api/admin/galleries               → Upload foto
DELETE /api/admin/galleries/[id]          → Hapus foto
GET    /api/admin/testimonials            → List testimoni (read-only)
POST   /api/admin/revalidate              → Trigger ISR revalidation manual
```

**Aturan response wajib:**
- Semua endpoint return JSON dengan format konsisten: `{ data }` untuk sukses, `{ error, code }` untuk gagal
- Status code yang benar: `200` sukses, `201` created, `400` validasi gagal, `401` unauthorized, `404` not found, `500` server error
- Semua mutasi (POST/PUT/PATCH/DELETE) di admin API wajib panggil `revalidatePath()` untuk path terkait agar landing page langsung update

---

### 7.1 Contoh Public Route
```ts
// app/api/menus/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const menus = await prisma.menu.findMany({
    where: {
      isActive: true,
      ...(category ? { category: category as any } : {}),
    },
    orderBy: { id: 'asc' },
  })

  return NextResponse.json(menus)
}
```

### 7.2 Contoh Admin Protected Route (dengan Revalidation)
```ts
// app/api/admin/menus/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { verifyAuth, unauthorizedResponse } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth) return unauthorizedResponse()

  const menus = await prisma.menu.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(menus)
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth) return unauthorizedResponse()

  const body = await request.json()
  const menu = await prisma.menu.create({ data: body })

  // Wajib: revalidate agar landing page langsung update
  revalidatePath('/')
  revalidatePath('/menu')

  return NextResponse.json(menu, { status: 201 })
}
```

### 7.3 JWT Helper — Session Management yang Benar
```ts
// lib/jwt.ts
import jwt from 'jsonwebtoken'

const ACCESS_SECRET  = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

// Access token: expire 15 menit
export const signAccessToken = (payload: { id: number; email: string }) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' })

// Refresh token: expire 7 hari
export const signRefreshToken = (payload: { id: number; email: string }) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET) as { id: number; email: string }

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_SECRET) as { id: number; email: string }
```

### 7.3.1 Login Flow (Fix Auto Logout)
```ts
// app/api/admin/auth/login/route.ts
export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const valid = await bcrypt.compare(password, admin.password)
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

  const accessToken  = signAccessToken({ id: admin.id, email: admin.email })
  const refreshToken = signRefreshToken({ id: admin.id, email: admin.email })

  const response = NextResponse.json({ message: 'Login berhasil', admin: { id: admin.id, name: admin.name, email: admin.email } })

  // Set access token: httpOnly, 15 menit
  response.cookies.set('admin_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 menit
    path: '/',
  })

  // Set refresh token: httpOnly, 7 hari
  response.cookies.set('admin_refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: '/',
  })

  return response
}
```

### 7.3.2 Refresh Token Endpoint (Mencegah Auto Logout)
```ts
// app/api/admin/auth/refresh/route.ts
// Dipanggil otomatis oleh client saat access token expire
export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('admin_refresh_token')?.value
  if (!refreshToken) return NextResponse.json({ error: 'No refresh token' }, { status: 401 })

  try {
    const payload = verifyRefreshToken(refreshToken)
    const newAccessToken = signAccessToken({ id: payload.id, email: payload.email })

    const response = NextResponse.json({ message: 'Token refreshed' })
    response.cookies.set('admin_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
  }
}
```

### 7.3.3 Logout
```ts
// app/api/admin/auth/logout/route.ts
export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' })
  response.cookies.delete('admin_token')
  response.cookies.delete('admin_refresh_token')
  return response
}
```

### 7.4 Auth Middleware Helper
```ts
// lib/auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from './jwt'

export async function verifyAuth(request: NextRequest): Promise<{ id: number; email: string } | null> {
  try {
    const token = request.cookies.get('admin_token')?.value
    if (!token) return null
    return verifyAccessToken(token)
  } catch {
    return null
  }
}

// Helper: pakai di setiap Route Handler admin
// Jika 401, client wajib hit /api/admin/auth/refresh lalu retry
export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized', code: 'TOKEN_EXPIRED' }, { status: 401 })
}
```

### 7.4.1 Client-side Auth Hook (Mencegah Auto Logout)
```ts
// hooks/useAuth.ts
// Zustand store untuk auth state + auto refresh
import { create } from 'zustand'

interface AuthStore {
  admin: { id: number; name: string; email: string } | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<boolean>
}

export const useAuth = create<AuthStore>((set) => ({
  admin: null,
  isLoading: true,
  login: async (email, password) => {
    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login gagal')
    const data = await res.json()
    set({ admin: data.admin })
  },
  logout: async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    set({ admin: null })
  },
  refresh: async () => {
    try {
      const res = await fetch('/api/admin/auth/refresh', { method: 'POST' })
      return res.ok
    } catch {
      return false
    }
  },
}))
```

### 7.4.2 Axios / Fetch Interceptor (Auto Refresh Token)
```ts
// lib/adminFetch.ts
// Wrapper fetch untuk semua admin API calls
// Otomatis refresh token jika dapat 401, lalu retry request sekali
export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, { ...options, credentials: 'include' })

  if (res.status === 401) {
    // Coba refresh token
    const refreshRes = await fetch('/api/admin/auth/refresh', { method: 'POST' })
    if (refreshRes.ok) {
      // Retry request asal dengan token baru
      return fetch(url, { ...options, credentials: 'include' })
    } else {
      // Refresh gagal → redirect ke login
      window.location.href = '/admin/login'
      throw new Error('Session expired')
    }
  }

  return res
}
```

### 7.5 Prisma Client Singleton
```ts
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 8. Route Protection (Middleware)

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminPage    = pathname.startsWith('/admin') && pathname !== '/admin/login'
  const isAdminApi     = pathname.startsWith('/api/admin/') &&
                         !pathname.startsWith('/api/admin/auth')

  if (isAdminPage || isAdminApi) {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      if (isAdminPage) return NextResponse.redirect(new URL('/admin/login', request.url))
      return NextResponse.json({ error: 'Unauthorized', code: 'NO_TOKEN' }, { status: 401 })
    }

    try {
      verifyAccessToken(token)
    } catch (err: any) {
      // Token expired — biarkan client retry via /api/admin/auth/refresh
      if (isAdminPage) return NextResponse.redirect(new URL('/admin/login', request.url))
      return NextResponse.json({ error: 'Unauthorized', code: 'TOKEN_EXPIRED' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
```

### 8.1 Data Tidak Terupdate — Fix dengan Revalidation
```ts
// Masalah: data di halaman tidak langsung berubah setelah admin update

// SOLUSI 1 — Setelah mutasi (POST/PUT/DELETE) di admin, panggil router.refresh()
import { useRouter } from 'next/navigation'
const router = useRouter()

const handleDelete = async (id: number) => {
  await adminFetch(`/api/admin/menus/${id}`, { method: 'DELETE' })
  router.refresh() // ← ini yang penting: refresh server component data
}

// SOLUSI 2 — Untuk halaman SSG/ISR, gunakan on-demand revalidation
// app/api/admin/revalidate/route.ts
import { revalidatePath } from 'next/cache'
export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth) return unauthorizedResponse()
  const { path } = await request.json()
  revalidatePath(path) // contoh: revalidatePath('/')
  return NextResponse.json({ revalidated: true })
}

// SOLUSI 3 — Panggil revalidate otomatis setelah setiap mutasi admin
// Di setiap Route Handler yang mengubah data, tambahkan:
revalidatePath('/')
revalidatePath('/menu')
```

---

## 9. Spesifikasi Komponen Frontend

### 9.1 Navbar — ExpandableTabs
```
KOMPONEN: components/ui/expandable-tabs.tsx
Install: usehooks-ts, lucide-react, framer-motion

SPESIFIKASI:
- Position: fixed, top: 0, width: 100%, z-50
- Default: bg-transparent backdrop-blur-sm
- Saat scroll: bg-white/85 backdrop-blur-md shadow-sm
- Logo: next/image dari site_content key: site_logo (h-10 w-auto) di pojok kiri
  - Fallback: teks "Mie Gacoan" font-heading text-secondary
  - Logo dikelola dari /admin/logo (sama dengan logo navbar, splash screen, footer)

NAVIGASI PAKAI ExpandableTabs:
- Tiap nav item punya icon dari lucide-react + label teks
- Saat di-klik: label teks expand muncul dengan animasi spring
- Saat klik di luar: semua collapse kembali ke icon saja
- Icon per nav item:
  | Nav Item  | Lucide Icon     |
  |-----------|-----------------|
  | Home      | Home            |
  | Welcome   | Sparkles        |
  | About     | Info            |
  | Menu      | UtensilsCrossed |
  | Paket     | Package         |
  | Outlets   | MapPin          |
  | Galeri    | Image           |
  | Testimoni | Star            |
  | Lokasi    | Navigation      |

MOBILE:
- ExpandableTabs tetap dipakai di mobile (icon-only tanpa label saat collapse)
- Jika terlalu sempit: hamburger → full drawer dengan semua nav item + label

ANIMASI MASUK:
- Framer Motion: y:-20 opacity:0 → y:0 opacity:1 saat halaman load
```

### 9.2 Hero Section + Three.js
```
THREE.JS BACKGROUND:
- <Canvas> position absolute, fullscreen, z-index -1
- 'use client' + dynamic import ssr:false
- ~800 partikel melayang warna #C2547A, #4DC8D0, #F0D050
- Mouse parallax: partikel mengikuti pergerakan kursor
- Rotasi perlahan via useFrame

CAROUSEL 3 SLIDE:
- Framer Motion AnimatePresence mode="wait"
- Auto-play 4 detik, pause saat hover
- Touch swipe untuk mobile
- Dot indicator + tombol panah

SLIDE 1 — Foto Hero (dari DB hero_slides)
SLIDE 2 — Mengapa Pilih Mie Gacoan
SLIDE 3 — Info Cepat & Nilai Brand
```

### 9.3 Welcome Section
```
Section Header → Quote → Deskripsi → Grid Visi/Misi → Nilai Kami pills

JUDUL SECTION pakai TypewriterEffect (lihat 9.10)
Framer Motion whileInView untuk konten lainnya, viewport once:true
```

### 9.4 About — Animated Counter
```ts
// hooks/useCounter.ts
// Counter berjalan saat section masuk viewport
// Menggunakan useMotionValue + useTransform Framer Motion
```

### 9.5 Animasi Scroll Global
```ts
// Framer Motion variants konsisten di semua section
const titleVariants = {
  hidden:  { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}
const imageLeftVariants = {
  hidden:  { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}
const imageRightVariants = {
  hidden:  { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}
const textVariants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}
const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } }
}
```

### 9.6 Menu Card & Paket Card — CursorFollow Hover
```
KOMPONEN: components/ui/cursor-follow.tsx
Install: motion (motion/react)

SPESIFIKASI:
- Seluruh grid menu dan grid paket dibungkus dengan <CursorFollow>
- Cursor berubah menjadi bubble berwarna brand (#C2547A sebagai --color-brand)
- Tiap kartu menu punya data-cursor-text={menu.name}
- Tiap kartu paket punya data-cursor-text={paket.name}
- Saat hover kartu: bubble cursor expand menampilkan nama menu/paket
- Custom CSS var: --color-brand: #C2547A

OVERLAY KARTU (tetap ada, kombinasi dengan CursorFollow):
- Menu card: overlay slide dari bawah (translateY 100% → 0%) via Framer Motion whileHover
- Overlay berisi: nama (font-heading) + deskripsi + harga
- CursorFollow memberi efek cursor khusus DI ATAS overlay

CATATAN:
- CursorFollow hanya aktif di desktop (pointer device)
- Di mobile: cursor biasa, overlay tetap jalan via touch
- Wrapper CursorFollow wajib: style={{ cursor: 'none' }} di desktop
- Deteksi device: gunakan CSS media query pointer: fine untuk cursor:none
```

### 9.10 TypewriterEffect — Judul Tiap Section
```
KOMPONEN: components/ui/typewriter-effect.tsx
Install: framer-motion (sudah ada)

SPESIFIKASI:
- SETIAP judul section di landing page wajib pakai TypewriterEffectSmooth
- Animasi: teks muncul dari kiri seperti diketik, smooth sliding
- Trigger: whileInView (muncul saat section masuk viewport)
- Cursor: blinking cursor warna #C2547A (override --cursor-color)
- Font: font-heading (Amatic SC) dengan ukuran sesuai section

DAFTAR SECTION YANG PAKAI TypewriterEffect:
- Section Welcome → kata: ["Selamat", "Datang", "di", "Mie Gacoan!"]
  - "Mie Gacoan!" pakai className text-primary
- Section About Us → kata: ["Tentang", "Kami"]
- Section Menu → kata: ["Menu", "Kami"]
- Section Menu Paket → kata: ["Menu", "Paket"]
- Section Outlets → kata: ["Outlets", "Kami"]
- Section Galeri → kata: ["Galeri", "Foto"]
- Section Testimoni → kata: ["Testimoni", "Pelanggan"]
- Section Lokasi → kata: ["Lokasi", "Kami"]

Untuk Visi, Misi, dan sub-judul (contoh: "Visi", "Misi", "Nilai Kami"):
- Pakai TypewriterEffect (bukan Smooth) dengan stagger per karakter
- Delay: 0.1s per karakter

KONFIGURASI PER SECTION:
words={[
  { text: "Menu" },
  { text: "Kami", className: "text-primary" }
]}
className="font-heading text-5xl"
cursorClassName="bg-primary"
```

### 9.7 Splash Screen — ProgressiveFluxLoader
```
KOMPONEN: components/ui/progressive-flux-loader.tsx
Install: framer-motion (sudah ada)

SPESIFIKASI:
- Fullscreen overlay saat pertama buka website
- Background: warna light (#fafafa) atau brand gradient pastel
- Konten tengah:
  1. Logo Mie Gacoan (next/image, h-20 w-auto)
     - Fallback: teks "Mie Gacoan" font-heading text-primary text-4xl
  2. ProgressiveFluxLoader di bawah logo

KONFIGURASI ProgressiveFluxLoader:
- Gradient bar: pakai warna brand (#C2547A → #4DC8D0)
  → set CSS vars: --flux-from: #C2547A; --flux-to: #4DC8D0
- Phases (label berubah seiring loading):
  { at: 0,   label: "Menyiapkan halaman..." }
  { at: 25,  label: "Memuat menu..." }
  { at: 55,  label: "Menyiapkan konten..." }
  { at: 80,  label: "Hampir siap..." }
  { at: 100, label: "Selamat datang!" }
- value: dikontrol (controlled mode) — bukan loop otomatis
- onComplete: tutup splash screen saat 100%

LAZY LOADING IMPLEMENTATION:
- Semua section halaman di-import dengan next/dynamic + loading placeholder
- Fetch semua data API secara paralel dengan Promise.all
- Progress bar diupdate seiring:
  1. Font loaded (25%)
  2. API data fetched (50%)
  3. Komponen lazy loaded (75%)
  4. Images preloaded (100%)
- Implementasi: custom hook useLoadingProgress.ts

ANIMASI:
- Logo: Framer Motion opacity 0 → 1, y: -10 → 0 (0.5s)
- ProgressiveFluxLoader muncul setelah logo (delay 0.3s)
- Saat complete: Framer Motion AnimatePresence → seluruh splash fade out (0.4s)
- Landing page fade in (0.3s)

ATURAN:
- Hanya muncul saat pertama load / hard refresh
- Tidak muncul saat navigasi antar halaman Next.js
- Simpan flag di sessionStorage: 'splash_shown' = 'true'
```

### 9.8 Footer
```
- bg-dark (#1a1a2e)
- Logo (next/image h-9) dari site_content key: site_logo
  - Fallback: teks "Mie Gacoan" font-heading text-secondary
- Tagline dari site_content key: footer_tagline
- Sosmed icons — dari tabel SocialMedia (GET /api/social-media)
  - Hanya tampil yang isActive: true, diurutkan by order
  - Icon dirender dinamis dari nama icon lucide-react (field icon)
  - Semua link buka di tab baru (target="_blank" rel="noopener")
- Nav links
- Copyright: © 2026 All Rights Reserved.
```

---

## 10. Rendering Strategy

| Halaman | Strategy | Cara |
|---|---|---|
| `/` | SSG + ISR | `export const revalidate = 60` |
| `/menu` | SSG + ISR | `export const revalidate = 60` |
| `/testimoni` | CSR | `'use client'` |
| `/admin/*` | CSR | `'use client'` + middleware protection |

```ts
// app/page.tsx
export const revalidate = 60

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  const [content, heroSlides, menus, packages, outlets, galleries, testimonials] =
    await Promise.all([
      fetch(`${baseUrl}/api/content`).then(r => r.json()),
      fetch(`${baseUrl}/api/hero-slides`).then(r => r.json()),
      fetch(`${baseUrl}/api/menus`).then(r => r.json()),
      fetch(`${baseUrl}/api/packages`).then(r => r.json()),
      fetch(`${baseUrl}/api/outlets`).then(r => r.json()),
      fetch(`${baseUrl}/api/galleries`).then(r => r.json()),
      fetch(`${baseUrl}/api/testimonials`).then(r => r.json()),
    ])

  return { content, heroSlides, menus, packages, outlets, galleries, testimonials }
}

export default async function LandingPage() {
  const data = await getData()
  return <LandingPageClient data={data} />
}
```

---

## 11. File Upload

### 11.1 Folder Upload
```
public/uploads/
├── logo/        ← logo website
├── hero/        ← foto slideshow hero
├── menus/       ← foto menu
├── packages/    ← foto paket
└── galleries/   ← foto galeri
```

URL akses: `http://localhost:3000/uploads/menus/nama-foto.jpg`

### 11.2 Next.js Config untuk Static Files
```ts
// next.config.ts
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
}
export default nextConfig
```

### 11.3 Validasi Upload
```ts
// Foto menu, paket, galeri: maks 5MB, format jpg/png/webp
// Logo: maks 2MB, format jpg/png/webp/svg
```

---

## 12. Environment Variables

```env
# .env

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="mysql://root:@localhost:3306/mie_gacoan"

# JWT — wajib dua secret berbeda!
JWT_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_EXPIRES_IN=900       # 15 menit (access token)
JWT_REFRESH_EXPIRES=604800 # 7 hari (refresh token)
```

---

## 13. Setup & Instalasi

```bash
# 1. Clone / buat folder project
mkdir mie-gacoan && cd mie-gacoan

# 2. Install semua dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env sesuai konfigurasi lokal

# 4. Setup database
npx prisma migrate dev --name init

# 5. Seed data admin
npx prisma db seed

# 6. Jalankan (frontend + backend sekaligus)
npm run dev

# Buka http://localhost:3000
# Admin: http://localhost:3000/admin/login
```

### 13.1 package.json Scripts
```json
{
  "scripts": {
    "dev":      "next dev",
    "build":    "next build",
    "start":    "next start",
    "db:push":  "prisma db push",
    "db:seed":  "prisma db seed",
    "db:studio": "prisma studio"
  }
}
```

### 13.2 Dependencies Lengkap
```bash
# Core
npm install next react react-dom typescript

# Styling & UI
npm install tailwindcss postcss autoprefixer
npx shadcn@latest init

# Animasi & 3D
npm install framer-motion motion three @react-three/fiber @react-three/drei

# Komponen tambahan (dari prompt)
npm install usehooks-ts lucide-react

# Database & ORM
npm install @prisma/client
npm install -D prisma

# Auth
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs

# Upload & utilitas
npm install multer slugify zustand
npm install -D @types/multer
```

---

## 14. Seed Data Admin

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.admin.create({
    data: {
      name:     'Admin Mie Gacoan',
      email:    'admin@miegacoan.com',
      password: await bcrypt.hash('password123', 10),
    },
  })

  // Seed konten default
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
  ]

  await prisma.siteContent.createMany({ data: defaultContents })

  // Seed sosial media — tabel terpisah, fleksibel untuk tambah/hapus
  await prisma.socialMedia.createMany({
    data: [
      { name: 'Instagram', icon: 'Instagram', url: 'https://www.instagram.com/mie.gacoan/', isActive: true, order: 1 },
      { name: 'TikTok',    icon: 'Music2',     url: 'https://www.tiktok.com/@miegacoanofficial', isActive: true, order: 2 },
      { name: 'X',         icon: 'Twitter',    url: 'https://x.com/mie_gacoan', isActive: true, order: 3 },
      { name: 'Facebook',  icon: 'Facebook',   url: 'https://www.facebook.com/miegacoanofficial/?locale=id_ID', isActive: true, order: 4 },
    ],
  })

  console.log('✅ Seed berhasil!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## 15. Spesifikasi Admin Panel

### 15.1 Urutan Section Landing Page
| No | Section | Deskripsi |
|---|---|---|
| 1 | Navbar | Transparan + blur saat scroll |
| 2 | Hero | Carousel 3 slide + Three.js background |
| 3 | Welcome | Sapaan + Visi + Misi + Nilai Kami |
| 4 | About Us | Cerita brand + animated counter |
| 5 | Menu | Filter tab + kartu + overlay hover |
| 6 | Menu Paket | Grid paket dengan foto |
| 7 | Outlets | Search + filter kota + list cabang |
| 8 | Galeri | Grid foto 3 kolom |
| 9 | Testimoni | Stats + kartu + link form |
| 10 | Lokasi | Google Maps embed + tombol Buka di Maps |
| 11 | Footer | Sosmed + nav + copyright |

### 15.2 Admin Routes
| Route | Halaman |
|---|---|
| `/admin/login` | Form login |
| `/admin/dashboard` | Statistik + quick access + aktivitas |
| `/admin/welcome` | Edit Welcome, Visi, Misi, Nilai Kami |
| `/admin/about` | Edit deskripsi & statistik About |
| `/admin/hero` | Upload foto slideshow + edit slide 2 & 3 |
| `/admin/logo` | Upload & preview logo |
| `/admin/footer` | Edit tagline footer + semua link sosmed |
| `/admin/menu` | CRUD menu + level pedas + foto |
| `/admin/paket` | CRUD paket + foto |
| `/admin/outlets` | CRUD outlets + maps URL |
| `/admin/galeri` | Upload & hapus foto galeri |
| `/admin/testimoni` | Lihat testimoni (read-only) |

---

### 15.3 Pola CRUD Admin — Inline Form (Seperti Screenshot)

Form CRUD **tidak** menggunakan modal untuk operasi yang kompleks. Menggunakan pola **inline form di atas tabel**, seperti screenshot yang diberikan:

```
LAYOUT TIAP HALAMAN CRUD:
┌─────────────────────────────────────┐
│ [Judul Halaman]  [+ Tambah / Reset] │  ← header dengan tombol aksi
├─────────────────────────────────────┤
│                                     │
│  FORM (tampil/sembunyi toggle)      │  ← form inline, bukan modal
│  Nama | Icon | Status | URL         │
│  [Simpan Data] [Batal]              │
│                                     │
├─────────────────────────────────────┤
│ ID | ICON | NAMA | LINK | STATUS | AKSI │  ← tabel data
│ 1  |  📷  | Menu |  ... | Aktif  | ✏️ 🗑️ │
│ 2  |  📦  | Pak  |  ... | Nonaktif| ✏️ 🗑️ │
└─────────────────────────────────────┘

BEHAVIOR:
- Klik "+ Tambah" → form muncul di atas tabel (slideDown animation)
- Klik "Edit" di baris tabel → form pre-filled dengan data baris tersebut
- Klik "Batal" / setelah simpan → form collapse kembali
- Form dan tabel berada dalam satu halaman, tidak ada navigasi

TOMBOL DI TABEL:
- Edit (ikon pensil, warna secondary) → pre-fill form di atas
- Hapus (ikon tempat sampah, warna merah) → konfirmasi inline (bukan modal)
  Contoh konfirmasi: row berubah warna merah + muncul "Yakin? [Ya, Hapus] [Batal]"

STATUS BADGE:
- Aktif: background hijau muda, teks hijau
- Nonaktif: background abu, teks abu dengan ikon ×

ANIMASI FORM:
- Framer Motion: height 0 → auto, opacity 0 → 1 saat muncul
- Smooth collapse saat disembunyikan
```

### 15.4 Dashboard `/admin/dashboard`

```
STAT CARDS (baris atas, 4 kartu):
- Total Menu (aktif + nonaktif) — klik → redirect ke /admin/menu
- Total Paket — klik → redirect ke /admin/paket
- Total Outlets — klik → redirect ke /admin/outlets
- Total Testimoni — klik → redirect ke /admin/testimoni

QUICK ACCESS CARDS DENGAN TOMBOL CRUD LANGSUNG (grid 2x3 atau 3x2):
Setiap card WAJIB punya 2 tombol fungsional, bukan cuma link biasa:

┌─────────────────────────┐
│ 🍜 Kelola Menu           │
│ 12 menu aktif             │
│ [+ Tambah]  [Lihat Semua] │  ← 2 tombol di tiap card
└─────────────────────────┘

Daftar quick access card + tombolnya:
| Card           | Tombol "+Tambah" mengarah ke         | Tombol "Lihat Semua" |
|----------------|----------------------------------------|------------------------|
| Kelola Menu    | /admin/menu?action=new (auto-buka form) | /admin/menu            |
| Menu Paket     | /admin/paket?action=new                 | /admin/paket            |
| Outlets        | /admin/outlets?action=new               | /admin/outlets          |
| Galeri         | /admin/galeri (langsung scroll ke upload)| /admin/galeri          |
| Kelola Konten  | — (tidak ada tambah, edit langsung)     | /admin/welcome          |
| Testimoni      | — (read-only, tidak ada tambah)         | /admin/testimoni        |

IMPLEMENTASI TOMBOL "+ Tambah" (auto-buka form):
- Pakai query param ?action=new di URL
- Di halaman tujuan, useEffect baca searchParams, jika action=new → otomatis
  expand form inline (sama seperti klik tombol "+ Tambah" manual)

AKTIVITAS TERBARU:
- List 5 aktivitas terakhir (dari API /api/admin/dashboard/activity)
- Contoh: "Menu Mie Setan ditambahkan", "Outlet Bandung diupdate"
- Tiap item aktivitas bisa diklik → redirect ke halaman terkait

IMPLEMENTASI:
- Semua data di-fetch client-side dengan adminFetch() (auto-refresh token)
- Loading state: skeleton Tailwind animate-pulse
- Error state: pesan error + tombol retry
- Data di-refresh setiap 30 detik (setInterval) ATAU saat window focus kembali
  (gunakan event 'visibilitychange' agar data selalu fresh)
```

---

### 15.5 Kelola Menu `/admin/menu`

```
LAYOUT (inline form di atas tabel):
- Header: judul "Kelola Menu" + tombol "+ Tambah Menu" (kanan atas)
- Form inline (toggle show/hide):
  - Nama menu (text, required)
  - Kategori (select: Mie / Dimsum / Minuman, required)
  - Harga (number, required)
  - Level pedas (slider 0-5 dengan preview dot merah)
  - Deskripsi (textarea, opsional)
  - Upload foto (drag & drop, opsional)
  - Status aktif (toggle)
  - [Simpan Data] [Batal]
- Filter tab di atas tabel: Semua / Mie / Dimsum / Minuman
- Search bar
- Tabel: ID | Foto | Nama | Kategori | Harga | Level Pedas | Status | Aksi

TOMBOL AKSI TABEL:
- [Edit ✏️] → pre-fill form di atas dengan data baris
- [Hapus 🗑️] → konfirmasi inline pada baris (row highlight merah + [Ya, Hapus] [Batal])

API:
- POST   /api/admin/menus          → Tambah
- PUT    /api/admin/menus/[id]     → Update
- DELETE /api/admin/menus/[id]     → Hapus
- POST   /api/admin/menus/[id]/image → Upload foto
- router.refresh() + revalidatePath('/') setelah setiap mutasi
```

---

### 15.6 Menu Paket `/admin/paket`

```
LAYOUT (inline form di atas tabel):
- Header: judul + tombol "+ Tambah Paket"
- Form inline (toggle):
  - Nama paket (text, required)
  - Deskripsi (textarea, required)
  - Harga (number, required)
  - Badge (text, opsional — "Hemat 15%", "Best Value")
  - Upload foto (drag & drop, opsional)
  - Status aktif (toggle)
  - [Simpan Data] [Batal]
- Tabel: ID | Foto | Nama | Deskripsi | Harga | Badge | Status | Aksi

TOMBOL AKSI:
- [Edit ✏️] → pre-fill form
- [Hapus 🗑️] → konfirmasi inline

API:
- POST   /api/admin/packages
- PUT    /api/admin/packages/[id]
- DELETE /api/admin/packages/[id]
- POST   /api/admin/packages/[id]/image
- router.refresh() + revalidatePath('/') setelah mutasi
```

---

### 15.7 Outlets `/admin/outlets`

```
LAYOUT (inline form di atas tabel, persis seperti screenshot sosmed):
- Header: judul + tombol "+ Tambah Outlet"
- Form inline (toggle):
  - Nama outlet (text, required)
  - Kota (text, required)
  - Alamat lengkap (textarea, required)
  - Jam buka (text, contoh: "10.00 – 22.00")
  - Link Google Maps (text, opsional — dari browser/Share)
  - Status buka/tutup (toggle, default: Aktif)
  - [Simpan Data] [Batal]
- Search bar + filter dropdown kota
- Tabel: ID | Nama | Kota | Alamat | Jam Buka | Status | Aksi

TOMBOL AKSI:
- [Edit ✏️] → pre-fill form di atas
- [Hapus 🗑️] → konfirmasi inline

TOGGLE STATUS LANGSUNG:
- Toggle buka/tutup bisa diklik langsung di tabel tanpa buka form
- PATCH /api/admin/outlets/[id] { isOpen: boolean }
- router.refresh() setelah toggle

API:
- POST   /api/admin/outlets
- PUT    /api/admin/outlets/[id]
- DELETE /api/admin/outlets/[id]
- PATCH  /api/admin/outlets/[id] → toggle isOpen
- router.refresh() + revalidatePath('/') setelah mutasi
```

---

### 15.8 Galeri `/admin/galeri`

```
LAYOUT:
- Header: judul + tombol "Upload Foto"
- Area drag & drop upload di atas (selalu tampil, bukan toggle)
- Progress bar saat upload
- Grid foto (6 kolom desktop, 3 kolom mobile)
- Tiap foto: thumbnail + tombol [X] hapus di pojok kanan atas

HAPUS FOTO:
- Konfirmasi inline: klik [X] → foto highlight merah + muncul [Ya, Hapus] [Batal]
- Bukan modal, bukan dialog terpisah

UPLOAD:
- Multiple foto sekaligus
- Preview sebelum upload
- POST /api/admin/galleries (multipart/form-data)
- router.refresh() setelah upload/hapus
```

---

### 15.9 Kelola Footer `/admin/footer`

```
LAYOUT (inline form di atas tabel, persis seperti screenshot):
- Header: "Media Sosial" + subtitle "Kelola tautan sosial media di footer website."
- Form inline (selalu tampil di atas untuk tambah baru):
  - Nama Sosmed (text, contoh: "Instagram", "WhatsApp")
  - Pilih Icon (select dropdown berisi icon sosmed populer: Instagram, TikTok, X, Facebook, WhatsApp, YouTube, dll)
  - Tautan URL (text, contoh: https://instagram.com/akun atau https://wa.me/628xxx)
  - Status Aktif (toggle)
  - [Simpan Data] [Batal]
- Tabel: ID | Icon | Nama Media Sosial | Link URL | Status | Aksi
  - Persis seperti screenshot yang diberikan

TOMBOL AKSI:
- [Edit ✏️] → pre-fill form di atas
- [Hapus 🗑️] → konfirmasi inline

TAGLINE FOOTER:
- Section terpisah di bawah tabel sosmed
- Input text untuk footer_tagline
- Tombol [Simpan Tagline]
- PUT /api/admin/content { key: 'footer_tagline', value: '...' }

API SOSMED:
- Sosmed disimpan sebagai tabel tersendiri (bukan SiteContent)
  → lebih fleksibel, bisa tambah/hapus sembarang sosmed
- Tambah tabel baru: SocialMedia (id, name, icon, url, isActive, order)
- GET    /api/admin/social-media
- POST   /api/admin/social-media
- PUT    /api/admin/social-media/[id]
- DELETE /api/admin/social-media/[id]
- PATCH  /api/admin/social-media/[id] → toggle isActive
```

---

### 15.10 Halaman Lain (Form Statis — Tanpa Modal)

Halaman berikut menggunakan form biasa (bukan CRUD), langsung simpan dengan tombol [Simpan]:

**Welcome `/admin/welcome`:**
- Quote/sapaan utama
- Deskripsi welcome
- Teks visi
- Poin misi 1, 2, 3
- Nilai kami 1-5 (pills)
- PUT /api/admin/content

**About `/admin/about`:**
- Deskripsi about us
- Angka cabang, tahun berdiri, total pelanggan
- PUT /api/admin/content

**Hero `/admin/hero`:**
- Upload/hapus/urutkan foto slideshow (slide 1)
- Edit konten slide 2 (4 kartu keunggulan — judul + deskripsi)
- Edit konten slide 3 (jam, cabang, harga mulai)
- PUT /api/admin/content + POST/DELETE /api/admin/hero-slides

**Logo `/admin/logo`:**
- Upload logo baru (drag & drop)
- Preview logo saat ini
- Tombol hapus logo (kembali ke fallback teks)
- POST/DELETE /api/admin/content/logo

**Testimoni `/admin/testimoni`:**
- Tabel read-only semua testimoni
- Kolom: nama, outlet, rating, isi, tanggal
- Tidak ada tombol approve/reject/hapus

---

### 15.11 Responsive Admin Panel (Mobile-first)

```
SIDEBAR:
- Desktop (lg+): sidebar fixed lebar 220px, konten bergeser ke kanan
- Tablet (md): sidebar tersembunyi, muncul saat hamburger diklik (overlay drawer)
- Mobile (sm): sama dengan tablet

TOPBAR:
- Desktop: judul halaman + tombol "Lihat Website"
- Mobile: hamburger menu (kiri) + judul + notifikasi (kanan)

TABEL (menu, outlets):
- Desktop: tabel biasa dengan semua kolom
- Mobile: tampilan card per baris (bukan tabel)
  - Tiap item tampil sebagai kartu dengan info penting
  - Tombol aksi di bawah tiap kartu
  - Implementasi: hidden kolom dengan Tailwind sm:table-cell / hidden

GRID PAKET & GALERI:
- Desktop: 2-3 kolom
- Mobile: 1-2 kolom

INLINE FORM (CRUD):
- Desktop: form tampil penuh di atas tabel, multi-kolom (grid 2-3 kolom field)
- Mobile: form full-width, field disusun 1 kolom (stack vertikal)
- Form tetap collapsible di kedua ukuran layar (toggle show/hide)

FORM FIELD MOBILE:
- Semua input full-width di mobile
- Keyboard tidak menutup tombol submit (padding-bottom cukup, scroll ke field aktif)
- Input number: type="number" inputmode="numeric" untuk keyboard angka

BREAKPOINT WAJIB:
sm: 640px  → mobile landscape
md: 768px  → tablet
lg: 1024px → desktop (sidebar muncul permanen)
xl: 1280px → large desktop
```

---

### 15.12 SiteContent Keys Tambahan (Footer & Hero)

Keys yang ditambahkan ke seed `prisma/seed.ts` (tabel SiteContent):

```ts
{ key: 'footer_tagline', value: 'Pedas, Murah, Bikin Nagih' },
```

> **Catatan:** Sosial media (Instagram, TikTok, X, Facebook, dll) **tidak** disimpan sebagai SiteContent key — melainkan di tabel terpisah `SocialMedia` (lihat Bab 5) agar admin bisa tambah/hapus sosmed apapun secara dinamis dari `/admin/footer`, tanpa terbatas pada field yang sudah ditentukan di awal.


---

## 16. Catatan Tambahan

- **1 command:** `npm run dev` menjalankan frontend + backend sekaligus
- **Tidak perlu CORS:** Frontend dan API dalam satu domain (localhost:3000)
- **Shared types:** `types/index.ts` dipakai di frontend dan Route Handlers
- **Three.js SSR:** Wajib `'use client'` + `dynamic(() => import(...), { ssr: false })`
- **Prisma singleton:** Gunakan pattern singleton di `lib/prisma.ts` agar tidak boros koneksi
- **JWT di cookie:** Lebih aman dari localStorage, httpOnly cookie tidak bisa diakses JS
- **next/image:** Semua gambar pakai `<Image>` dari next/image untuk optimasi otomatis
- **Animasi:** Semua Framer Motion `whileInView` pakai `viewport={{ once: true }}`
- **TypeScript strict:** `"strict": true` di tsconfig.json
- **Admin URL:** `/admin/login` tidak ada linknya di halaman publik manapun
- **Responsive:** Semua halaman mobile-friendly (breakpoint Tailwind sm/md/lg/xl)
- **Loading state:** Skeleton loader dengan Tailwind `animate-pulse`
- **Splash screen:** Hanya muncul saat pertama load / hard refresh
- **Logo fallback:** Teks "Mie Gacoan" font-heading jika logo belum diupload
- **Maps:** Outlets pakai link URL biasa, Section Lokasi pakai iframe embed URL
- **Inline Form CRUD:** Semua aksi tambah dan edit/update WAJIB pakai inline form di atas tabel (collapsible), BUKAN modal — sesuai pola di screenshot referensi. Modal hanya cocok untuk informasi singkat, bukan form kompleks
- **Konfirmasi hapus:** Inline pada baris/kartu (row highlight + tombol Ya/Batal), bukan modal/dialog terpisah
- **Tombol CRUD wajib fungsional:** Dashboard admin wajib punya tombol "+ Tambah" dan "Lihat Semua" yang benar-benar terhubung ke halaman dan auto-buka form (via query param `?action=new`) — bukan sekadar link statis tanpa fungsi
- **Responsive admin:** Sidebar collapse di mobile jadi drawer (overlay), tabel berubah jadi card per baris di mobile, inline form jadi 1 kolom di mobile
- **Footer management:** Tagline diedit dari SiteContent, sosmed dikelola dari tabel `SocialMedia` terpisah via `/admin/footer` — admin bebas tambah/hapus sosmed apapun, tidak terbatas field tetap
- **API error handling:** Semua Route Handlers wajib return status code yang tepat (400, 401, 404, 500) dengan format `{ error, code }` yang konsisten
- **Zustand:** Dipakai untuk `useAuth` (state admin + auto refresh token), bukan untuk modal lagi
- **Session tidak auto-logout:** Access token 15 menit + refresh token 7 hari. Setiap request admin pakai `adminFetch()` wrapper yang otomatis refresh token saat 401, lalu retry — user tidak akan ter-logout mendadak selama refresh token masih valid
- **Data langsung update:** Setiap mutasi (POST/PUT/PATCH/DELETE) di admin API WAJIB panggil `revalidatePath()` untuk path terkait, dan client WAJIB panggil `router.refresh()` setelah mutasi sukses — kombinasi keduanya memastikan data di landing page dan tabel admin langsung sinkron tanpa perlu reload manual
- **Logo terpusat:** Satu logo dikelola dari `/admin/logo`, dipakai otomatis di 3 tempat: Navbar (ExpandableTabs), Splash Screen (ProgressiveFluxLoader), dan Footer
- **Komponen dari prompt wajib dipakai persis:** ExpandableTabs (navbar), TypewriterEffect/TypewriterEffectSmooth (semua judul section), CursorFollow (hover menu & paket), ProgressiveFluxLoader (splash screen) — bukan dibuat ulang dengan implementasi berbeda
- **shadcn/ui:** Dipakai sebagai base komponen (Button, Input, Select, Table, Switch, Textarea) di seluruh form admin agar konsisten

---

*PRD ini dibuat untuk digunakan sebagai input ke AI web builder seperti Antigravity atau Kiro IDE.*  
*2026*
