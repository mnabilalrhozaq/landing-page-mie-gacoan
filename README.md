# 🍜 Landing Page & Admin Panel Mie Gacoan — Full-stack Next.js Edition

Landing Page dan Portal Admin terintegrasi untuk **Restoran Mie Gacoan** (Restoran Mie Pedas No. 1 di Indonesia). Dibangun menggunakan arsitektur **Full-stack Next.js 14 App Router** dalam satu folder, satu codebase, dan satu command untuk mempermudah pengerjaan dan deploy.

---

## 🚀 Tech Stack

| Teknologi | Kategori | Deskripsi |
|---|---|---|
| **Next.js 14** | Core Framework | App Router + Route Handlers (Backend API) |
| **TypeScript** | Language | Type-safety penuh untuk frontend & backend |
| **Prisma ORM** | Database Tool | Database schema & queries management |
| **MySQL / MariaDB** | Database | Penyimpanan relasional terstruktur |
| **Tailwind CSS** | Styling | Desain responsif utility-first |
| **Framer Motion** | Animation | Transisi, scroll animations, & micro-interactions |
| **Three.js** | 3D Graphics | Particle background interaktif pada Hero Section |
| **Zustand** | State | Pengelolaan session state & auto refresh token |
| **shadcn/ui** | UI Components | Komponen dasar UI seperti Button, Input, Table, dll. |

---

## ✨ Fitur Utama

### 🖥️ Frontend (Landing Page)
1. **Premium Splash Screen**: Menggunakan loader progresif interaktif (`ProgressiveFluxLoader`) dengan transisi halus.
2. **Interactive 3D Hero**: Background partikel interaktif Three.js yang mengikuti pergerakan kursor mouse + slide carousel autoplay.
3. **Smooth Scroll Animation**: Animasi scroll modern yang dinamis di seluruh section.
4. **Dynamic Menu Catalog & Combo**: Navigasi kategori menu dengan efek hover gelembung kursor (`CursorFollow`) + slider tingkat kepedasan dengan indikator warna api.
5. **Interactive Branch Outlets**: Pencarian outlet cabang dan filtering berdasarkan kota.
6. **Form Ulasan Pelanggan**: Form kirim testimoni instan yang terintegrasi ke database.
7. **Google Maps Integration**: Peta interaktif lokasi outlet utama beserta tombol penunjuk jalan.

### 🔐 Backend & Portal Admin (`/admin`)
1. **JWT-based Auth Session**: Menggunakan `access_token` (15 menit) dan `refresh_token` (7 hari) yang disimpan di HTTP-only cookie.
2. **Auto-Refresh Session**: Terintegrasi `adminFetch` interceptor untuk me-refresh token secara otomatis sebelum sesi kedaluwarsa sehingga admin tidak akan ter-logout mendadak.
3. **Pola CRUD Inline Form**: Semua operasi penambahan dan pengeditan data menggunakan form inline lipat (*collapsible*) di atas tabel tanpa pop-up modal yang mengganggu.
4. **Konfirmasi Hapus Inline**: Konfirmasi penghapusan data secara langsung pada baris tabel (baris ditandai merah + muncul konfirmasi inline Ya/Batal).
5. **Dashboard Analytics**: Statistik menu, paket, cabang, ulasan, serta log aktivitas mutasi admin terbaru.
6. **On-Demand ISR Revalidation**: Pemicu pembaruan halaman statis secara instan ketika ada modifikasi data admin.

---

## 🔑 Kredensial Akun Dummy (Default)

Gunakan akun berikut untuk login ke Portal Administrasi:

- **Halaman Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@miegacoan.com`
- **Password**: `nabilar123`

---

## 💻 Panduan Instalasi Lokal

### Prasyarat
- Node.js versi 18 atau lebih baru.
- MySQL Server (bisa melalui Laragon, XAMPP, WAMP, atau Docker).

### Langkah Setup

1. **Clone & Install Dependensi**
   ```bash
   cd "Landing Page Mie Gacoan (Next.js)"
   npm install
   ```

2. **Konfigurasi Environment Variable**
   Duplikat file `.env.example` menjadi `.env` dan sesuaikan koneksi database Anda:
   ```env
   # Database URL (contoh untuk local MySQL)
   DATABASE_URL="mysql://root:@localhost:3306/mie_gacoan"

   # JWT secrets (ubah dengan string acak yang kuat)
   JWT_SECRET="super_secret_access_token_key_12345"
   JWT_REFRESH_SECRET="super_secret_refresh_token_key_67890"

   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Sinkronisasi Database**
   Buat tabel database secara otomatis berdasarkan skema Prisma:
   ```bash
   npx prisma db push
   ```

4. **Database Seeding**
   Populasikan database dengan data admin dan konfigurasi default awal website:
   ```bash
   npm run db:seed
   ```

5. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 🌐 Panduan Deploy ke Web Hosting / Production

### Opsi A: Deploy ke Cloud Server / VPS (Self-Hosted)
Metode ini adalah opsi terbaik jika Anda menggunakan MySQL lokal pada server hosting Anda (misal Ubuntu VPS).

1. **Siapkan Node.js & MySQL** pada VPS Anda.
2. **Clone project** ke server Anda dan buat file `.env` produksi.
3. **Build Aplikasi** untuk kompilasi production:
   ```bash
   npm run build
   ```
4. **Jalankan Sesi menggunakan PM2** agar aplikasi tetap menyala di background:
   ```bash
   npm install -g pm2
   pm2 start npm --name "mie-gacoan" -- run start
   ```
5. **Konfigurasikan Nginx** sebagai Reverse Proxy untuk mengarahkan domain Anda ke port aplikasi (port default Next.js: `3000`):
   ```nginx
   server {
       listen 80;
       server_name domainkamu.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

### Opsi B: Deploy ke Serverless Hosting (Vercel / Netlify)
Next.js teroptimasi secara native untuk dideploy ke Vercel.

1. **Miliki Database MySQL Online**: Karena Vercel adalah serverless, Anda memerlukan database MySQL cloud eksternal (seperti PlanetScale, Aiven, Railway, Supabase MySQL, atau AWS RDS).
2. **Hubungkan GitHub Repository** ke akun Vercel Anda.
3. **Konfigurasikan Environment Variables** pada dashboard Vercel settings:
   - `DATABASE_URL` (arahkan ke MySQL cloud Anda)
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `NEXT_PUBLIC_APP_URL` (arahkan ke URL domain produksi Vercel Anda)
4. **Lakukan Deploy**: Vercel secara otomatis mendeteksi konfigurasi Next.js dan menjalankan `npm run build` serta deploy secara instan.

*Catatan: Pastikan database cloud Anda mengizinkan koneksi dari luar IP serverless.*

---

## 📈 Alur Penggunaan Aplikasi

1. **Mengirim Testimoni**:
   - Pengunjung dapat membuka bagian **Testimoni** di landing page.
   - Klik tombol pengisian ulasan untuk mengisi ulasan.
   - Isian ulasan akan masuk database dan langsung ditampilkan di website.

2. **Login Admin**:
   - Buka `/admin/login` (Halaman ini tersembunyi dari navigasi publik).
   - Masukkan email dan password admin.

3. **Manajemen Konten via Dashboard**:
   - Admin dapat menambah/mengedit hidangan baru di **Kelola Menu** (termasuk tingkat kepedasan, harga, dan mengunggah gambar).
   - Admin dapat menambah outlet cabang baru, yang secara otomatis diperbarui di landing page berkat fitur on-demand revalidation.
   - Perubahan logo utama restoran dapat dilakukan melalui **Kelola Logo** dan akan langsung terupdate di Navbar, Splash Screen, dan Footer sekaligus.
