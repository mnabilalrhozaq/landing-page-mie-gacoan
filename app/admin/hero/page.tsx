"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, CheckCircle2, AlertCircle, Save, Sparkles, Image as ImageIcon } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { HeroSlide } from "@/types";

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingTexts, setIsSavingTexts] = useState(false);

  // Form inputs for slides 2 & 3 content
  const [textData, setTextData] = useState({
    // Slide 2 keunggulan
    hero_card1_title: "Pedasnya Juara",
    hero_card1_desc: "Level pedas 0-6 yang menantang nyali.",
    hero_card2_title: "Harga Sahabat",
    hero_card2_desc: "Sangat bersahabat untuk semua kantong.",
    hero_card3_title: "Tempat Asik",
    hero_card3_desc: "Desain outlet luas, nyaman & modern.",
    hero_card4_title: "Kualitas Terjaga",
    hero_card4_desc: "Bahan segar pilihan diolah higienis.",
    // Slide 3 info
    hero_info_jam: "10.00 – 22.00",
    hero_info_cabang: "500+",
    hero_info_harga: "14rb",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      // Fetch hero slides
      const slidesRes = await adminFetch("/api/admin/hero-slides");
      if (slidesRes.ok) {
        const slidesData = await slidesRes.json();
        setSlides(slidesData);
      }

      // Fetch site content for text slides
      const contentRes = await fetch("/api/content");
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setTextData((prev) => ({
          ...prev,
          hero_card1_title: contentData.hero_card1_title || prev.hero_card1_title,
          hero_card1_desc: contentData.hero_card1_desc || prev.hero_card1_desc,
          hero_card2_title: contentData.hero_card2_title || prev.hero_card2_title,
          hero_card2_desc: contentData.hero_card2_desc || prev.hero_card2_desc,
          hero_card3_title: contentData.hero_card3_title || prev.hero_card3_title,
          hero_card3_desc: contentData.hero_card3_desc || prev.hero_card3_desc,
          hero_card4_title: contentData.hero_card4_title || prev.hero_card4_title,
          hero_card4_desc: contentData.hero_card4_desc || prev.hero_card4_desc,
          hero_info_jam: contentData.hero_info_jam || prev.hero_info_jam,
          hero_info_cabang: contentData.hero_info_cabang || prev.hero_info_cabang,
          hero_info_harga: contentData.hero_info_harga || prev.hero_info_harga,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File gambar terlalu besar! Maksimal 5MB.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await adminFetch("/api/admin/hero-slides", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccessMsg("Hero slide berhasil diunggah!");
        fetchData();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal mengunggah hero slide.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleActive = async (id: number, currentVal: boolean) => {
    try {
      const res = await adminFetch(`/api/admin/hero-slides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentVal }),
      });

      if (res.ok) {
        setSlides(slides.map((s) => (s.id === id ? { ...s, isActive: !currentVal } : s)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlide = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus slide ini?")) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await adminFetch(`/api/admin/hero-slides/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccessMsg("Hero slide berhasil dihapus!");
        fetchData();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal menghapus slide.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTexts(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await adminFetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(textData),
      });

      if (res.ok) {
        setSuccessMsg("Konten slide 2 dan 3 berhasil diperbarui!");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal menyimpan konten text.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsSavingTexts(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse select-none">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="h-48 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left font-body">
      <div>
        <h2 className="text-xl font-bold text-dark leading-none">Kelola Hero Section</h2>
        <p className="text-gray-400 text-xs mt-1">
          Kelola foto slide 1, deskripsi kartu keunggulan slide 2, serta informasi outlet slide 3.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5" />
          {errorMsg}
        </div>
      )}

      {/* Slide 1 - Slideshow Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <ImageIcon className="w-4.5 h-4.5" />
              Daftar Foto Hero (Slide 1)
            </h3>
            
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
              {slides.map((slide) => (
                <div key={slide.id} className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                  <div className="relative w-20 h-12 rounded-xl overflow-hidden bg-white border border-gray-200/60 shrink-0">
                    <Image
                      src={slide.image}
                      alt="Hero slide"
                      fill
                      className="object-contain"
                    />
                  </div>
                  
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={slide.isActive}
                        onCheckedChange={() => handleToggleActive(slide.id, slide.isActive)}
                      />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {slide.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    
                    <Button
                      onClick={() => handleDeleteSlide(slide.id)}
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {slides.length === 0 && (
                <p className="text-gray-400 text-xs py-8 text-center">Belum ada slide diunggah. Teks fallback akan digunakan.</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Unggah Slide Baru</h3>
            <label className="border-2 border-dashed border-gray-200 hover:border-secondary rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center bg-gray-50/10">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8 text-gray-400" />
              )}
              <span className="font-bold text-dark text-xs mt-1">Pilih File Slide</span>
              <span className="text-gray-450 text-[10px]">Maks 5MB. Format JPG, PNG, atau WEBP.</span>
            </label>
          </div>
        </div>

        {/* Text Form (Slides 2 & 3 Content) */}
        <form onSubmit={handleTextSubmit} className="flex flex-col gap-6">
          <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-6">
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <Sparkles className="w-4.5 h-4.5 text-primary" />
              Slide 2 — Kartu Keunggulan (Villar Nilai)
            </h3>

            {/* Card 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-50 pb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Kartu 1 Judul (Icon: 🌶️)</label>
                <Input
                  value={textData.hero_card1_title}
                  onChange={(e) => setTextData({ ...textData, hero_card1_title: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Kartu 1 Deskripsi</label>
                <Input
                  value={textData.hero_card1_desc}
                  onChange={(e) => setTextData({ ...textData, hero_card1_desc: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-50 pb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Kartu 2 Judul (Icon: 💰)</label>
                <Input
                  value={textData.hero_card2_title}
                  onChange={(e) => setTextData({ ...textData, hero_card2_title: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Kartu 2 Deskripsi</label>
                <Input
                  value={textData.hero_card2_desc}
                  onChange={(e) => setTextData({ ...textData, hero_card2_desc: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-50 pb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Kartu 3 Judul (Icon: 🏠)</label>
                <Input
                  value={textData.hero_card3_title}
                  onChange={(e) => setTextData({ ...textData, hero_card3_title: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Kartu 3 Deskripsi</label>
                <Input
                  value={textData.hero_card3_desc}
                  onChange={(e) => setTextData({ ...textData, hero_card3_desc: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Card 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Kartu 4 Judul (Icon: ✨)</label>
                <Input
                  value={textData.hero_card4_title}
                  onChange={(e) => setTextData({ ...textData, hero_card4_title: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Kartu 4 Deskripsi</label>
                <Input
                  value={textData.hero_card4_desc}
                  onChange={(e) => setTextData({ ...textData, hero_card4_desc: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">
              Slide 3 — Informasi Cepat
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Jam Buka</label>
                <Input
                  value={textData.hero_info_jam}
                  onChange={(e) => setTextData({ ...textData, hero_info_jam: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Total Cabang</label>
                <Input
                  value={textData.hero_info_cabang}
                  onChange={(e) => setTextData({ ...textData, hero_info_cabang: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Harga Mulai</label>
                <Input
                  value={textData.hero_info_harga}
                  onChange={(e) => setTextData({ ...textData, hero_info_harga: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSavingTexts}
            className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl h-10 w-fit self-end flex items-center gap-2"
          >
            {isSavingTexts ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Konten Hero
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
