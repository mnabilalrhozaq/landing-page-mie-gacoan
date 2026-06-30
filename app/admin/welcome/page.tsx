"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Save } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function WelcomePage() {
  const [formData, setFormData] = useState({
    welcome_quote: "",
    welcome_desc: "",
    visi: "",
    misi_1: "",
    misi_2: "",
    misi_3: "",
    nilai_1: "",
    nilai_2: "",
    nilai_3: "",
    nilai_4: "",
    nilai_5: "",
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
            welcome_quote: data.welcome_quote || "",
            welcome_desc: data.welcome_desc || "",
            visi: data.visi || "",
            misi_1: data.misi_1 || "",
            misi_2: data.misi_2 || "",
            misi_3: data.misi_3 || "",
            nilai_1: data.nilai_1 || "",
            nilai_2: data.nilai_2 || "",
            nilai_3: data.nilai_3 || "",
            nilai_4: data.nilai_4 || "",
            nilai_5: data.nilai_5 || "",
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
        setSuccessMsg("Konten Welcome Section berhasil diperbarui!");
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
        <div className="h-96 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left font-body">
      <div>
        <h2 className="text-xl font-bold text-dark leading-none">Kelola Welcome Section</h2>
        <p className="text-gray-400 text-xs mt-1">
          Ubah sapaan pembuka, pernyataan visi, misi, dan pilar nilai-nilai utama restoran.
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

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
        {/* Quote & Desc */}
        <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">Sapaan Selamat Datang</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Judul Sapaan</label>
            <Input
              type="text"
              value={formData.welcome_quote}
              onChange={(e) => setFormData({ ...formData, welcome_quote: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deskripsi Sapaan</label>
            <Textarea
              value={formData.welcome_desc}
              onChange={(e) => setFormData({ ...formData, welcome_desc: e.target.value })}
              rows={3}
              required
            />
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">Visi & Misi Resto</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pernyataan Visi</label>
            <Textarea
              value={formData.visi}
              onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Misi 1</label>
              <Input
                type="text"
                value={formData.misi_1}
                onChange={(e) => setFormData({ ...formData, misi_1: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Misi 2</label>
              <Input
                type="text"
                value={formData.misi_2}
                onChange={(e) => setFormData({ ...formData, misi_2: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Misi 3</label>
              <Input
                type="text"
                value={formData.misi_3}
                onChange={(e) => setFormData({ ...formData, misi_3: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Nilai Kami */}
        <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">Nilai-Nilai Kami (Pills)</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pilar 1</label>
              <Input
                type="text"
                value={formData.nilai_1}
                onChange={(e) => setFormData({ ...formData, nilai_1: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pilar 2</label>
              <Input
                type="text"
                value={formData.nilai_2}
                onChange={(e) => setFormData({ ...formData, nilai_2: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pilar 3</label>
              <Input
                type="text"
                value={formData.nilai_3}
                onChange={(e) => setFormData({ ...formData, nilai_3: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pilar 4</label>
              <Input
                type="text"
                value={formData.nilai_4}
                onChange={(e) => setFormData({ ...formData, nilai_4: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pilar 5</label>
              <Input
                type="text"
                value={formData.nilai_5}
                onChange={(e) => setFormData({ ...formData, nilai_5: e.target.value })}
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
              Simpan Konten Welcome
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
