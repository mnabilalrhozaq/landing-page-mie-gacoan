"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Save } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AboutPage() {
  const [formData, setFormData] = useState({
    about_desc: "",
    about_cabang: "",
    about_tahun: "",
    about_pelanggan: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            about_desc: data.about_desc || "",
            about_cabang: data.about_cabang || "",
            about_tahun: data.about_tahun || "",
            about_pelanggan: data.about_pelanggan || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await adminFetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMsg("Konten About Section berhasil diperbarui!");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal memperbarui konten.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse select-none">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-64 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left font-body">
      <div>
        <h2 className="text-xl font-bold text-dark leading-none">Kelola About Us Section</h2>
        <p className="text-gray-400 text-xs mt-1">
          Ubah deskripsi sejarah brand dan data angka-angka statistik pencapaian restoran.
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

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-8 max-w-2xl">
        <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">Deskripsi Sejarah</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Teks Deskripsi</label>
            <Textarea
              value={formData.about_desc}
              onChange={(e) => setFormData({ ...formData, about_desc: e.target.value })}
              rows={4}
              required
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">Angka Statistik (Counter)</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Jumlah Cabang</label>
              <Input
                type="number"
                inputMode="numeric"
                value={formData.about_cabang}
                onChange={(e) => setFormData({ ...formData, about_cabang: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tahun Berdiri</label>
              <Input
                type="number"
                inputMode="numeric"
                value={formData.about_tahun}
                onChange={(e) => setFormData({ ...formData, about_tahun: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Pelanggan (Juta)</label>
              <Input
                type="number"
                step="0.1"
                inputMode="decimal"
                value={formData.about_pelanggan}
                onChange={(e) => setFormData({ ...formData, about_pelanggan: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 rounded-xl h-10 w-fit font-bold self-start"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Konten About
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
