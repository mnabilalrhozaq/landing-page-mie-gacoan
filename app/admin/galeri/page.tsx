"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { UploadCloud, Trash2, X, AlertCircle, CheckCircle2, FileImage, Edit2, Check, Folder, Tag } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmInline } from "@/components/admin/ConfirmInline";
import { Gallery } from "@/types";
import { cn } from "@/lib/utils";

export default function GaleriAdminPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // New Category for Upload
  const [uploadCategory, setUploadCategory] = useState("Umum");

  // Deletion inline states
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Inline edit states
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({ caption: "", category: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter category tab
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("Semua");

  // Status banners
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const res = await adminFetch("/api/admin/galleries");
      if (res.ok) {
        const data = await res.json();
        setGalleries(data);
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

  // Compute unique categories from database to build filter tabs and dropdown choices
  const existingCategories = useMemo(() => {
    const cats = new Set(galleries.map((g) => g.category).filter(Boolean));
    return Array.from(cats);
  }, [galleries]);

  const filteredGalleries = useMemo(() => {
    if (selectedCategoryTab === "Semua") return galleries;
    return galleries.filter((g) => g.category === selectedCategoryTab);
  }, [galleries, selectedCategoryTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    // Validate size (max 5MB) and type
    const validFiles: File[] = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`File "${file.name}" terlalu besar! Maksimal 5MB.`);
        return;
      }
      if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
        setErrorMsg(`Format "${file.name}" tidak didukung! Gunakan PNG, JPG, atau WEBP.`);
        return;
      }
      validFiles.push(file);
    }

    setIsUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("category", uploadCategory.trim() || "Umum");

    try {
      const res = await adminFetch("/api/admin/galleries", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccessMsg(`Berhasil mengunggah ${validFiles.length} foto ke galeri dengan kategori "${uploadCategory}"!`);
        fetchData();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Gagal mengunggah foto.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await adminFetch(`/api/admin/galleries/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccessMsg("Foto galeri berhasil dihapus!");
        setDeletingId(null);
        fetchData();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Gagal menghapus foto.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (item: Gallery) => {
    setEditingItemId(item.id);
    setEditFormData({
      caption: item.caption || "",
      category: item.category || "Umum",
    });
  };

  const handleUpdateSubmit = async (id: number) => {
    setIsUpdating(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await adminFetch(`/api/admin/galleries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: editFormData.caption.trim(),
          category: editFormData.category.trim() || "Umum",
        }),
      });

      if (res.ok) {
        setSuccessMsg("Detail foto galeri berhasil diperbarui!");
        setEditingItemId(null);
        fetchData();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Gagal memperbarui foto.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse select-none text-left">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-48 bg-gray-200 rounded-3xl" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left font-body">
      <div>
        <h2 className="text-xl font-bold text-dark leading-none">Kelola Galeri Foto</h2>
        <p className="text-gray-400 text-xs mt-1">
          Unggah foto suasana restoran, event, atau promosi Mie Gacoan lengkap dengan kategori untuk filternya.
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

      {/* Upload Zone & Category Setup */}
      <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <h3 className="font-bold text-gray-550 text-xs uppercase tracking-wider">Pengaturan Unggah</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Folder className="w-3.5 h-3.5" />
              Kategori Unggah
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Tulis kategori baru... (misal: Suasana)"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="text-xs h-9 rounded-xl border-gray-200"
              />
            </div>
            {existingCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="text-[9px] font-bold text-gray-450 self-center uppercase mr-1">Pilih Cepat:</span>
                {existingCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setUploadCategory(cat)}
                    className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all",
                      uploadCategory === cat
                        ? "bg-secondary border-secondary text-white"
                        : "bg-gray-55 border-gray-200 text-gray-550 hover:bg-gray-100"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow flex flex-col gap-4">
          <h3 className="font-bold text-gray-550 text-xs uppercase tracking-wider">Pilih File Foto</h3>
          
          <label className="border-2 border-dashed border-gray-200 hover:border-secondary rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center bg-gray-50/20">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-secondary" />
            )}
            <span className="font-bold text-dark text-xs mt-1">
              {isUploading ? "Mengunggah Gambar..." : "Klik Untuk Memilih Foto"}
            </span>
            <span className="text-gray-400 text-[10px]">
              Maks 5MB per file. format JPG/PNG/WEBP. Bisa memilih banyak file.
            </span>
          </label>
        </div>
      </div>

      {/* Gallery Filter & Grid Container */}
      <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <h3 className="font-bold text-gray-550 text-xs uppercase tracking-wider">
            Foto Galeri ({filteredGalleries.length} ditampilkan / {galleries.length} total)
          </h3>

          {/* Dynamic Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategoryTab("Semua")}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
                selectedCategoryTab === "Semua"
                  ? "bg-secondary text-white"
                  : "bg-gray-50 border border-gray-200 text-gray-550 hover:bg-gray-100"
              )}
            >
              Semua
            </button>
            {existingCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryTab(cat)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors",
                  selectedCategoryTab === cat
                    ? "bg-secondary text-white"
                    : "bg-gray-55 border border-gray-200 text-gray-550 hover:bg-gray-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {filteredGalleries.map((item) => {
            const isDeletingThis = deletingId === item.id;
            const isEditingThis = editingItemId === item.id;

            return (
              <div
                key={item.id}
                className={cn(
                  "relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group/card transition-all",
                  isDeletingThis ? "ring-2 ring-red-500 scale-[0.98] opacity-90" : "hover:shadow-md"
                )}
              >
                <Image
                  src={item.image}
                  alt={item.caption || "Foto Galeri"}
                  fill
                  className="object-cover"
                />

                {/* Category Badge on Top-Left */}
                <div className="absolute top-2.5 left-2.5 bg-dark/70 backdrop-blur-xs text-white text-[8px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm border border-white/10">
                  <Tag className="w-2.5 h-2.5 text-accent" />
                  {item.category || "Umum"}
                </div>

                {/* Action Hover Buttons overlay */}
                {!isDeletingThis && !isEditingThis && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-white text-secondary rounded-full p-1.5 border border-gray-200 hover:bg-gray-50 shadow-md focus:outline-none transition-colors"
                      title="Edit Kategori & Judul"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="bg-red-50 text-red-650 rounded-full p-1.5 border border-red-100 hover:bg-red-100 shadow-md focus:outline-none transition-colors"
                      title="Hapus Foto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Inline Edit Form Overlay */}
                {isEditingThis && (
                  <div className="absolute inset-0 bg-dark/95 backdrop-blur-xs flex flex-col justify-between p-3 text-left z-20 animate-in fade-in zoom-in duration-200">
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-extrabold text-accent uppercase tracking-wider">
                        Edit Detail Foto
                      </span>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Kategori</label>
                        <input
                          type="text"
                          value={editFormData.category}
                          onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                          className="w-full text-[10px] px-2 py-1 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-bold text-gray-450 uppercase tracking-widest leading-none">Caption / Judul</label>
                        <input
                          type="text"
                          value={editFormData.caption}
                          onChange={(e) => setEditFormData({ ...editFormData, caption: e.target.value })}
                          className="w-full text-[10px] px-2 py-1 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                        />
                      </div>
                    </div>

                    <div className="flex gap-1.5 border-t border-gray-800 pt-2 mt-auto">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateSubmit(item.id)}
                        disabled={isUpdating}
                        className="h-6 flex-1 text-[9px] font-bold py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border-0 flex items-center gap-1 justify-center"
                      >
                        <Check className="w-2.5 h-2.5" />
                        {isUpdating ? "..." : "Simpan"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingItemId(null)}
                        disabled={isUpdating}
                        className="h-6 flex-1 text-[9px] font-bold py-0.5 rounded-lg border-gray-750 bg-white hover:bg-gray-150 text-gray-800"
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                )}

                {/* Confirm Delete Overlay */}
                {isDeletingThis && (
                  <div className="absolute inset-0 bg-red-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center gap-2 z-20 animate-in fade-in zoom-in duration-200">
                    <span className="text-[9px] font-extrabold text-white uppercase tracking-wider">
                      Hapus Foto Galeri?
                    </span>
                    <div className="flex flex-col gap-1.5 w-full max-w-[90px]">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="h-6 text-[9px] font-bold py-0.5 rounded-lg text-white"
                      >
                        {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeletingId(null)}
                        disabled={isDeleting}
                        className="h-6 text-[9px] font-bold py-0.5 rounded-lg border-gray-700 bg-white hover:bg-gray-100 text-gray-800"
                      >
                        Batal
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredGalleries.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center gap-2">
              <FileImage className="w-10 h-10 text-gray-300" />
              <p className="text-gray-400 text-xs font-semibold">Tidak ada foto dalam kategori ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
