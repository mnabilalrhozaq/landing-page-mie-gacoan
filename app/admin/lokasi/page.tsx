"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Save, Compass, HelpCircle, ExternalLink, MapPin } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LokasiPage() {
  const [formData, setFormData] = useState({
    lokasi_embed_url: "",
    lokasi_directions_url: "",
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
            lokasi_embed_url: data.lokasi_embed_url || "",
            lokasi_directions_url: data.lokasi_directions_url || "",
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
        setSuccessMsg("Peta Lokasi berhasil diperbarui!");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal memperbarui peta.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to extract src from copy-pasted iframe tag if the user pastes the whole iframe code
  const handleEmbedUrlChange = (val: string) => {
    let cleanUrl = val.trim();
    if (cleanUrl.startsWith("<iframe")) {
      const match = cleanUrl.match(/src="([^"]+)"/);
      if (match && match[1]) {
        cleanUrl = match[1];
      }
    }
    setFormData((prev) => ({ ...prev, lokasi_embed_url: cleanUrl }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse select-none">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-[450px] bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  const previewUrl = formData.lokasi_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15865.312933939626!2d106.8271528!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e449a562ef%3A0x973a98cc78fb3c6d!2sMie%20Gacoan%20Kuningan!5e0!3m2!1sid!2sid!4v1718876400000!5m2!1sid!2sid";

  return (
    <div className="flex flex-col gap-8 text-left font-body">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-bold text-dark leading-none">Kelola Google Maps</h2>
        <p className="text-gray-400 text-xs mt-1">
          Sesuaikan koordinat peta tersemat dan link rute navigasi untuk section Lokasi di landing page.
        </p>
      </motion.div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          <CheckCircle2 className="w-4.5 h-4.5" />
          {successMsg}
        </motion.div>
      )}

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          <AlertCircle className="w-4.5 h-4.5" />
          {errorMsg}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-secondary" />
                Konfigurasi Peta
              </h3>

              {/* Embed URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Google Maps Embed URL</span>
                  <span className="text-[9px] text-gray-400 normal-case font-normal">(bisa langsung tempel kode iframe)</span>
                </label>
                <Input
                  type="text"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={formData.lokasi_embed_url}
                  onChange={(e) => handleEmbedUrlChange(e.target.value)}
                  className="font-mono text-[11px]"
                  required
                />
              </div>

              {/* Directions URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Link Navigasi (Directions URL)
                </label>
                <Input
                  type="url"
                  placeholder="https://maps.app.goo.gl/..."
                  value={formData.lokasi_directions_url}
                  onChange={(e) => setFormData({ ...formData, lokasi_directions_url: e.target.value })}
                  className="font-mono text-[11px]"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary/95 text-white flex items-center gap-2 rounded-xl font-bold py-3 shadow-md"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>

          {/* Guide Card */}
          <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-[24px] text-xs text-amber-900/80 flex flex-col gap-3">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-900 text-[11px] uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Cara Mendapatkan Kode Peta Embed:
            </h4>
            <ol className="list-decimal pl-4 flex flex-col gap-1.5 leading-relaxed text-gray-600 text-xs">
              <li>Cari outlet Gacoan di <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-bold inline-flex items-center gap-0.5">Google Maps <ExternalLink className="w-3 h-3" /></a></li>
              <li>Klik tombol <strong>Bagikan (Share)</strong>.</li>
              <li>Pilih tab <strong>Sematkan peta (Embed a map)</strong>.</li>
              <li>Klik <strong>Salin HTML (Copy HTML)</strong>.</li>
              <li>Tempelkan (paste) langsung ke kolom input <strong>Embed URL</strong> di atas. Sistem kami otomatis mengekstrak link URL dari tag HTML tersebut.</li>
            </ol>
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              Live Preview Peta Terpasang
            </h3>
            <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-bold">
              Real-time
            </span>
          </div>

          <div className="w-full aspect-video lg:h-[400px] rounded-[36px] overflow-hidden border border-gray-200/50 shadow-md relative bg-gray-100 flex items-center justify-center">
            {formData.lokasi_embed_url ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-0 absolute inset-0 transition-opacity duration-300"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 gap-2">
                <Compass className="w-10 h-10 text-gray-300 animate-spin" />
                <p className="text-gray-400 text-xs font-semibold">Memuat peta preview default...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
