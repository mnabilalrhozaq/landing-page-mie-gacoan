"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { Button } from "@/components/ui/button";

export default function LogoPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchLogo = async () => {
    try {
      const res = await fetch("/api/content");
      if (res.ok) {
        const data = await res.json();
        setLogoUrl(data.site_logo || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB for logo)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg("File terlalu besar! Maksimal 2MB.");
      return;
    }

    // Validate format
    if (!["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"].includes(file.type)) {
      setErrorMsg("Format file salah! Harus PNG, JPG, WEBP, atau SVG.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await adminFetch("/api/admin/content/logo", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setLogoUrl(data.logoUrl);
        setSuccessMsg("Logo berhasil diunggah!");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal mengunggah logo.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus logo dan menggunakan teks fallback?")) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await adminFetch("/api/admin/content/logo", {
        method: "DELETE",
      });

      if (res.ok) {
        setLogoUrl(null);
        setSuccessMsg("Logo berhasil dihapus! Menggunakan teks fallback.");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal menghapus logo.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
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
    <div className="flex flex-col gap-8 text-left max-w-xl font-body">
      <div>
        <h2 className="text-xl font-bold text-dark leading-none">Kelola Logo Restoran</h2>
        <p className="text-gray-400 text-xs mt-1">
          Logo ini akan dipakai terpusat di Navbar, Splash Screen, dan Footer website.
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

      <div className="grid grid-cols-1 gap-8">
        {/* Preview Current Logo */}
        <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Logo Saat Ini</h3>
          <div className="border border-gray-100 bg-gray-50 rounded-2xl p-8 flex items-center justify-center min-h-[140px]">
            {logoUrl ? (
              <div className="relative w-48 h-16">
                <Image
                  src={logoUrl}
                  alt="Mie Gacoan Logo Preview"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="font-heading text-4xl text-secondary tracking-wide font-bold">
                Mie Gacoan (Fallback Text)
              </span>
            )}
          </div>

          {logoUrl && (
            <Button
              onClick={handleDeleteLogo}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-fit flex items-center gap-1.5 self-end rounded-xl font-bold text-xs h-9"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Logo
            </Button>
          )}
        </div>

        {/* Upload New Logo box */}
        <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Unggah Logo Baru</h3>
          
          <label className="border-2 border-dashed border-gray-200 hover:border-secondary rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-secondary" />
            )}
            <span className="font-bold text-dark text-sm mt-2">Pilih File Logo</span>
            <span className="text-gray-400 text-xs">Maksimal 2MB. Format PNG, JPG, WEBP, atau SVG.</span>
          </label>
        </div>
      </div>
    </div>
  );
}
