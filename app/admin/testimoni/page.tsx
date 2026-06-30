"use client";

import React, { useState, useEffect } from "react";
import { Star, AlertCircle, RefreshCw, Plus, Trash2, Edit2, CheckCircle2, Save } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InlineForm } from "@/components/admin/InlineForm";
import { ConfirmInline } from "@/components/admin/ConfirmInline";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Testimonial } from "@/types";

export default function TestimonialAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form & Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    content: "",
  });

  // Action feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await adminFetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      } else {
        setErrorMsg("Gagal memuat ulasan pelanggan.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const isEdit = editingId !== null;
    const urlEndpoint = isEdit ? `/api/admin/testimonials/${editingId}` : "/api/admin/testimonials";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await adminFetch(urlEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMsg(isEdit ? "Testimoni berhasil diperbarui!" : "Testimoni baru berhasil ditambahkan!");
        setIsFormOpen(false);
        setFormData({ name: "", rating: 5, content: "" });
        setEditingId(null);
        fetchData();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal menyimpan ulasan.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (item: Testimonial) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || "",
      rating: item.rating,
      content: item.content,
    });
    setIsFormOpen(true);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await adminFetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccessMsg("Testimoni berhasil dihapus!");
        setDeletingId(null);
        fetchData();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal menghapus testimoni.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (rating: number, sizeClass = "w-3.5 h-3.5") => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClass} ${
              i < rating ? "fill-amber-500 text-amber-500" : "text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading && testimonials.length === 0) {
    return (
      <div className="flex flex-col gap-6 animate-pulse select-none">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="h-64 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left font-body">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-dark leading-none">Log Ulasan & Testimoni</h2>
          <p className="text-gray-400 text-xs mt-1">
            Kelola ulasan dan rating pelanggan. Data yang aktif akan langsung muncul di halaman depan.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <Button
            onClick={() => {
              setEditingId(null);
              setFormData({ name: "", rating: 5, content: "" });
              setIsFormOpen(true);
              setSuccessMsg("");
              setErrorMsg("");
            }}
            className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 rounded-xl text-xs font-bold h-9"
          >
            <Plus className="w-4 h-4" />
            Tambah Testimoni
          </Button>

          <Button
            onClick={fetchData}
            variant="outline"
            className="border-gray-200 text-gray-650 hover:bg-gray-50 flex items-center gap-1.5 rounded-xl text-xs font-bold h-9"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-hover-spin" />
            Segarkan
          </Button>
        </div>
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

      {/* Form Slide Down */}
      <InlineForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId !== null ? "Edit Ulasan Testimoni" : "Tambah Testimoni Manual"}
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Pelanggan</label>
              <Input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Interactive Rating Star Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Rating Bintang</label>
              <div className="flex items-center gap-1 select-none h-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="text-amber-500 transition-transform active:scale-95 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 cursor-pointer transition-all duration-200 ${
                        star <= formData.rating ? "fill-amber-500 text-amber-500" : "text-gray-200 hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Textarea Content */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Isi Ulasan</label>
            <Textarea
              placeholder="Tulis ulasan menarik pelanggan di sini..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              className="border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 rounded-xl text-xs font-bold"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Menyimpan..." : "Simpan Ulasan"}
            </Button>
          </div>
        </form>
      </InlineForm>

      {/* Responsive Data Table */}
      <div className="bg-white border border-gray-200/60 rounded-[28px] overflow-hidden shadow-sm">
        {/* Desktop View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">No</TableHead>
                <TableHead className="w-44">Nama Pelanggan</TableHead>
                <TableHead className="w-28 text-center">Rating</TableHead>
                <TableHead>Isi Ulasan</TableHead>
                <TableHead className="w-40 text-center">Tanggal Masuk</TableHead>
                <TableHead className="w-32 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((item, index) => {
                const isDeletingThis = deletingId === item.id;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="text-center font-bold text-gray-400">{index + 1}</TableCell>
                    <TableCell className="font-bold text-dark">{item.name || "Anonim"}</TableCell>
                    <TableCell className="flex justify-center items-center h-12">
                      {renderStars(item.rating)}
                    </TableCell>
                    <TableCell className="text-gray-600 text-xs py-4 leading-normal">{item.content}</TableCell>
                    <TableCell className="text-center text-[10px] text-gray-400 font-bold">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {isDeletingThis ? (
                        <ConfirmInline
                          onConfirm={() => handleDelete(item.id)}
                          onCancel={() => setDeletingId(null)}
                          isLoading={isDeleting}
                        />
                      ) : (
                        <div className="flex items-center justify-center gap-1">
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
              {testimonials.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400 text-xs">
                    Belum ada ulasan pelanggan masuk.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Stacked List View */}
        <div className="block md:hidden">
          <div className="flex flex-col divide-y divide-gray-100">
            {testimonials.map((item) => {
              const isDeletingThis = deletingId === item.id;
              return (
                <div key={item.id} className="p-4 flex flex-col gap-2 text-left bg-white">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-dark text-sm">{item.name || "Anonim"}</h4>
                    <span className="text-[9px] text-gray-450 font-bold">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center my-1">
                    {renderStars(item.rating, "w-4 h-4")}
                    
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
                  <p className="text-gray-600 text-xs mt-1 leading-normal border-t border-gray-50 pt-2">{item.content}</p>
                </div>
              );
            })}
            {testimonials.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-xs">
                Belum ada ulasan pelanggan masuk.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
