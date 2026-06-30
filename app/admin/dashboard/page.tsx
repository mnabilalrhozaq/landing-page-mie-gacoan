"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Package,
  MapPin,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { Button } from "@/components/ui/button";

interface Stats {
  totalMenus: number;
  totalPackages: number;
  totalOutlets: number;
  totalGalleries: number;
  totalTestimonials: number;
}

interface Activity {
  id: string;
  text: string;
  date: string;
  href: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalMenus: 0,
    totalPackages: 0,
    totalOutlets: 0,
    totalGalleries: 0,
    totalTestimonials: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        adminFetch("/api/admin/dashboard/stats"),
        adminFetch("/api/admin/dashboard/activity"),
      ]);

      if (statsRes.ok && activitiesRes.ok) {
        const statsData = await statsRes.json();
        const activitiesData = await activitiesRes.json();
        setStats(statsData);
        setActivities(activitiesData);
        setErrorMsg("");
      } else {
        setErrorMsg("Gagal memuat data terbaru.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan koneksi jaringan.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Auto-refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);

    // Refresh when user returns to window
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse select-none">
        <div className="h-8 bg-gray-200 rounded-xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-[24px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[400px] bg-gray-200 rounded-[32px]" />
          <div className="h-[400px] bg-gray-200 rounded-[32px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left font-body">
      {/* Welcome Banner */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-dark leading-none">Beranda Dashboard</h2>
          <p className="text-gray-400 text-xs mt-1">
            Ringkasan data, jalan pintas aksi, dan log mutasi terbaru.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* 4 Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <Link href="/admin/menu" className="group">
          <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-all group-hover:-translate-y-0.5">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Menu</span>
              <span className="text-3xl font-extrabold text-dark mt-1">{stats.totalMenus}</span>
            </div>
            <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
          </div>
        </Link>

        {/* Card 2 */}
        <Link href="/admin/paket" className="group">
          <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-all group-hover:-translate-y-0.5">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Paket</span>
              <span className="text-3xl font-extrabold text-dark mt-1">{stats.totalPackages}</span>
            </div>
            <div className="p-4 bg-secondary/15 text-secondary rounded-2xl group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </Link>

        {/* Card 3 */}
        <Link href="/admin/outlets" className="group">
          <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-all group-hover:-translate-y-0.5">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Outlets</span>
              <span className="text-3xl font-extrabold text-dark mt-1">{stats.totalOutlets}</span>
            </div>
            <div className="p-4 bg-accent/20 text-amber-600 rounded-2xl group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        </Link>

        {/* Card 4 */}
        <Link href="/admin/testimoni" className="group">
          <div className="bg-white p-6 rounded-[24px] border border-gray-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-all group-hover:-translate-y-0.5">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Testimoni</span>
              <span className="text-3xl font-extrabold text-dark mt-1">{stats.totalTestimonials}</span>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-105 transition-transform">
              <Star className="w-6 h-6" />
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Quick Access Card Grid (lg:8) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Aksi Cepat Menu Kelola
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 1: Menu */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/60 shadow-sm flex flex-col gap-4 text-left justify-between">
              <div>
                <h4 className="font-bold text-dark text-base">Kelola Menu</h4>
                <p className="text-gray-400 text-xs mt-1">Tambahkan makanan pedas atau edit data harga menu.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/menu?action=new">
                  <Button size="sm" className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1 text-xs rounded-xl font-bold h-8">
                    <Plus className="w-3.5 h-3.5" />
                    Tambah
                  </Button>
                </Link>
                <Link href="/admin/menu">
                  <Button size="sm" variant="outline" className="text-gray-600 border-gray-200 hover:bg-gray-50 text-xs rounded-xl font-bold h-8">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 2: Paket */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/60 shadow-sm flex flex-col gap-4 text-left justify-between">
              <div>
                <h4 className="font-bold text-dark text-base">Menu Paket</h4>
                <p className="text-gray-400 text-xs mt-1">Kelola bundle hemat promo kombo menu Gacoan.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/paket?action=new">
                  <Button size="sm" className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1 text-xs rounded-xl font-bold h-8">
                    <Plus className="w-3.5 h-3.5" />
                    Tambah
                  </Button>
                </Link>
                <Link href="/admin/paket">
                  <Button size="sm" variant="outline" className="text-gray-600 border-gray-200 hover:bg-gray-50 text-xs rounded-xl font-bold h-8">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 3: Outlets */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/60 shadow-sm flex flex-col gap-4 text-left justify-between">
              <div>
                <h4 className="font-bold text-dark text-base">Outlets Cabang</h4>
                <p className="text-gray-400 text-xs mt-1">Ubah status buka/tutup atau edit koordinat Maps.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/outlets?action=new">
                  <Button size="sm" className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1 text-xs rounded-xl font-bold h-8">
                    <Plus className="w-3.5 h-3.5" />
                    Tambah
                  </Button>
                </Link>
                <Link href="/admin/outlets">
                  <Button size="sm" variant="outline" className="text-gray-600 border-gray-200 hover:bg-gray-50 text-xs rounded-xl font-bold h-8">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 4: Galeri */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/60 shadow-sm flex flex-col gap-4 text-left justify-between">
              <div>
                <h4 className="font-bold text-dark text-base">Galeri Foto</h4>
                <p className="text-gray-400 text-xs mt-1">Upload foto-foto suasana seru outlet secara instan.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/galeri">
                  <Button size="sm" className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1 text-xs rounded-xl font-bold h-8">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Upload
                  </Button>
                </Link>
                <Link href="/admin/galeri">
                  <Button size="sm" variant="outline" className="text-gray-600 border-gray-200 hover:bg-gray-50 text-xs rounded-xl font-bold h-8">
                    Lihat Semua
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 5: Kelola Konten */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/60 shadow-sm flex flex-col gap-4 text-left justify-between">
              <div>
                <h4 className="font-bold text-dark text-base">Kelola Konten</h4>
                <p className="text-gray-400 text-xs mt-1">Edit sapaan, deskripsi visi, misi, dan tagline resto.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/welcome">
                  <Button size="sm" className="bg-secondary hover:bg-secondary/95 text-white flex items-center gap-1 text-xs rounded-xl font-bold h-8">
                    <FileText className="w-3.5 h-3.5" />
                    Edit Konten
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 6: Testimoni */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/60 shadow-sm flex flex-col gap-4 text-left justify-between">
              <div>
                <h4 className="font-bold text-dark text-base">Log Ulasan</h4>
                <p className="text-gray-400 text-xs mt-1">Baca komentar dan nilai rating yang diposting pembeli.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/testimoni">
                  <Button size="sm" className="bg-secondary hover:bg-secondary/95 text-white flex items-center gap-1 text-xs rounded-xl font-bold h-8">
                    <Star className="w-3.5 h-3.5" />
                    Lihat Ulasan
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities Panel (lg:4) */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Aktivitas Terakhir
          </h3>

          <div className="bg-white border border-gray-200/60 rounded-[32px] p-6 shadow-sm flex flex-col gap-4 text-left">
            {activities.length > 0 ? (
              <div className="flex flex-col gap-5">
                {activities.map((act) => (
                  <Link key={act.id} href={act.href} className="group flex items-start gap-4">
                    <div className="p-2 bg-gray-50 border border-gray-100 group-hover:bg-primary/10 group-hover:text-primary rounded-xl text-gray-400 transition-colors shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-body text-gray-700 text-xs font-bold leading-tight group-hover:text-primary transition-colors">
                        {act.text}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(act.date).toLocaleDateString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 text-xs">Belum ada aktivitas terekam.</p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 mt-2 flex justify-end">
              <Button onClick={fetchData} variant="ghost" size="sm" className="text-gray-400 text-[10px] font-extrabold uppercase tracking-wider hover:text-dark">
                Segarkan Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
