"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Search, CheckCircle2, AlertCircle, FileImage, Sparkles } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { InlineForm } from "@/components/admin/InlineForm";
import { ConfirmInline } from "@/components/admin/ConfirmInline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Package } from "@/types";
import { cn } from "@/lib/utils";

export default function PaketAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");

  // State Lists
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    badge: "",
    description: "",
    isActive: true,
  });

  // Action states
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const res = await adminFetch("/api/admin/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
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

  // Expand form automatically if action=new parameter exists
  useEffect(() => {
    if (actionParam === "new") {
      setIsFormOpen(true);
    }
  }, [actionParam]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const isEdit = editingId !== null;
    const urlEndpoint = isEdit ? `/api/admin/packages/${editingId}` : "/api/admin/packages";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await adminFetch(urlEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const savedPkg = await res.json();
        
        // Handle image upload if a file was selected
        if (fileToUpload) {
          const imgFormData = new FormData();
          imgFormData.append("file", fileToUpload);

          const uploadRes = await adminFetch(`/api/admin/packages/${savedPkg.id}/image`, {
            method: "POST",
            body: imgFormData,
          });

          if (!uploadRes.ok) {
            setErrorMsg("Paket berhasil disimpan tetapi gagal mengunggah gambar.");
          }
        }

        setSuccessMsg(isEdit ? "Paket berhasil diperbarui!" : "Paket baru berhasil ditambahkan!");
        setIsFormOpen(false);
        setEditingId(null);
        setFileToUpload(null);
        setFormData({ name: "", price: "", badge: "", description: "", isActive: true });
        fetchData();
        router.refresh();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Gagal menyimpan data paket.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan koneksi jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (item: Package) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      price: String(item.price),
      badge: item.badge || "",
      description: item.description || "",
      isActive: item.isActive,
    });
    setFileToUpload(null);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleActive = async (id: number, currentVal: boolean) => {
    try {
      const res = await adminFetch(`/api/admin/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentVal }),
      });

      if (res.ok) {
        setPackages(packages.map((p) => (p.id === id ? { ...p, isActive: !currentVal } : p)));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccessMsg("Paket berhasil dihapus!");
        setDeletingId(null);
        fetchData();
        router.refresh();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Gagal menghapus paket.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter lists based on inputs
  const filteredPackages = useMemo(() => {
    return packages.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [packages, searchQuery]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-dark leading-none">Kelola Menu Paket Promo</h2>
          <p className="text-gray-400 text-xs mt-1">
            Tambah bundle paket promo hemat, edit badge diskon, deskripsi, harga, dan upload foto paket.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFileToUpload(null);
            setFormData({ name: "", price: "", badge: "", description: "", isActive: true });
            setIsFormOpen(!isFormOpen);
          }}
          className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 rounded-xl text-xs font-bold h-9 self-start"
        >
          <Plus className="w-4 h-4" />
          {isFormOpen ? "Batal" : "Tambah Paket"}
        </Button>
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

      {/* Collapsible Inline Form */}
      <InlineForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? "Edit Item Paket" : "Tambah Paket Promo Baru"}
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Paket</label>
              <Input
                type="text"
                placeholder="Contoh: Paket Mie + Es"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Harga (Rp)</label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 25.000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Badge Info (Diskon/Promo)</label>
              <Input
                type="text"
                placeholder="Contoh: Hemat 15%"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Description */}
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Deskripsi Paket</label>
              <Textarea
                placeholder="Keterangan isi menu paket..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="flex flex-col gap-5">
              {/* File Upload drag-and-drop */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Foto Paket</label>
                <label className="flex-grow border border-dashed border-gray-200 hover:border-secondary rounded-2xl p-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-center bg-gray-50/50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <FileImage className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-dark text-xs mt-1 truncate max-w-[180px]">
                    {fileToUpload ? fileToUpload.name : "Pilih Gambar"}
                  </span>
                  <span className="text-[9px] text-gray-400">Maks 5MB. JPG/PNG/WEBP</span>
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status Paket</label>
                <div className="flex items-center gap-3 h-9">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
                  />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Paket Aktif</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 flex gap-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl h-9 px-6"
            >
              {isSaving ? "Menyimpan..." : "Simpan Paket"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              className="text-gray-600 border-gray-200 hover:bg-gray-50 rounded-xl font-bold h-9"
            >
              Batal
            </Button>
          </div>
        </form>
      </InlineForm>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Paket: {filteredPackages.length}</span>
        </div>

        {/* Search Input bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari paket..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary shadow-sm"
          />
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="bg-white border border-gray-200/60 rounded-[28px] overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">No</TableHead>
                <TableHead className="w-20 text-center">Foto</TableHead>
                <TableHead>Nama Paket</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="w-32">Harga</TableHead>
                <TableHead className="w-32">Badge Promo</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-36 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((item, index) => {
                const isDeletingThis = deletingId === item.id;
                
                return (
                  <TableRow
                    key={item.id}
                    className={cn(isDeletingThis && "bg-red-50 hover:bg-red-50")}
                  >
                    <TableCell className="text-center font-bold text-gray-400">{index + 1}</TableCell>
                    <TableCell className="text-center">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-dark">{item.name}</TableCell>
                    <TableCell className="text-gray-500 font-semibold text-xs max-w-xs truncate">{item.description}</TableCell>
                    <TableCell className="font-bold text-gray-700">Rp {item.price.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      {item.badge ? (
                        <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-extrabold uppercase border border-amber-100/60">
                          {item.badge}
                        </span>
                      ) : (
                        <span className="text-gray-350 text-xs font-semibold">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={() => handleToggleActive(item.id, item.isActive)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      {isDeletingThis ? (
                        <ConfirmInline
                          onConfirm={() => handleDelete(item.id)}
                          onCancel={() => setDeletingId(null)}
                          isLoading={isDeleting}
                        />
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditClick(item)}
                            className="h-8 w-8 p-0 text-secondary hover:bg-secondary/10 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingId(item.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredPackages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-400 text-xs">
                    Tidak ada paket promo ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Stacked List View */}
        <div className="block md:hidden">
          <div className="flex flex-col divide-y divide-gray-100">
            {filteredPackages.map((item) => {
              const isDeletingThis = deletingId === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 flex gap-4 text-left items-start transition-colors",
                    isDeletingThis ? "bg-red-50" : "bg-white"
                  )}
                >
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-dark text-sm truncate">{item.name}</h4>
                      {item.badge && (
                        <span className="bg-amber-50 text-amber-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-amber-100/60 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 leading-snug line-clamp-2 mt-0.5">{item.description}</p>
                    <span className="font-bold text-dark text-xs mt-1">Rp {item.price.toLocaleString("id-ID")}</span>

                    <div className="flex items-center justify-between border-t border-gray-100/60 pt-3 mt-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.isActive}
                          onCheckedChange={() => handleToggleActive(item.id, item.isActive)}
                        />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Aktif</span>
                      </div>

                      {isDeletingThis ? (
                        <ConfirmInline
                          onConfirm={() => handleDelete(item.id)}
                          onCancel={() => setDeletingId(null)}
                          isLoading={isDeleting}
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditClick(item)}
                            className="h-8 px-2.5 text-xs text-secondary hover:bg-secondary/10 rounded-lg flex items-center gap-1 font-bold"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingId(item.id)}
                            className="h-8 px-2.5 text-xs text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-1 font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredPackages.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-xs">
                Tidak ada paket promo ditemukan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
