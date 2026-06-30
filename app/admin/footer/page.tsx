"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, CheckCircle2, AlertCircle, Save } from "lucide-react";
import * as Icons from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { InlineForm } from "@/components/admin/InlineForm";
import { ConfirmInline } from "@/components/admin/ConfirmInline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { SocialMedia } from "@/types";
import { cn } from "@/lib/utils";

const iconOptions = [
  { value: "Instagram", label: "Instagram" },
  { value: "Music2", label: "TikTok (Music2)" },
  { value: "Twitter", label: "Twitter / X" },
  { value: "Facebook", label: "Facebook" },
  { value: "MessageCircle", label: "WhatsApp (MessageCircle)" },
  { value: "Youtube", label: "YouTube" },
  { value: "Globe", label: "Website (Globe)" },
];

export default function FooterPage() {
  const router = useRouter();

  // State for Tagline
  const [tagline, setTagline] = useState("");
  const [isSavingTagline, setIsSavingTagline] = useState(false);

  // State for Social Media List
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "Instagram",
    url: "",
    isActive: true,
    order: 0,
  });

  // Deletion States
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Message States
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const [contentRes, socialsRes] = await Promise.all([
        fetch("/api/content"),
        adminFetch("/api/admin/social-media"),
      ]);

      if (contentRes.ok && socialsRes.ok) {
        const contentData = await contentRes.json();
        const socialsData = await socialsRes.json();
        setTagline(contentData.footer_tagline || "");
        setSocials(socialsData);
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

  const handleSaveTagline = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingTagline(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await adminFetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ footer_tagline: tagline }),
      });

      if (res.ok) {
        setSuccessMsg("Tagline footer berhasil disimpan!");
      } else {
        setErrorMsg("Gagal menyimpan tagline.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsSavingTagline(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const isEdit = editingId !== null;
    const urlEndpoint = isEdit
      ? `/api/admin/social-media/${editingId}`
      : "/api/admin/social-media";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await adminFetch(urlEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMsg(
          isEdit
            ? "Data sosial media berhasil diperbarui!"
            : "Sosial media baru berhasil ditambahkan!"
        );
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ name: "", icon: "Instagram", url: "", isActive: true, order: 0 });
        fetchData();
        router.refresh();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Gagal menyimpan data.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    }
  };

  const handleEditClick = (item: SocialMedia) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      icon: item.icon,
      url: item.url,
      isActive: item.isActive,
      order: item.order,
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleActive = async (id: number, currentVal: boolean) => {
    try {
      const res = await adminFetch(`/api/admin/social-media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentVal }),
      });

      if (res.ok) {
        setSocials(
          socials.map((s) => (s.id === id ? { ...s, isActive: !currentVal } : s))
        );
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/social-media/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccessMsg("Sosial media berhasil dihapus!");
        setDeletingId(null);
        fetchData();
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-dark leading-none">Kelola Footer & Sosial Media</h2>
          <p className="text-gray-400 text-xs mt-1">
            Edit tagline penutup dan kelola tombol-tombol link sosial media aktif di footer.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", icon: "Instagram", url: "", isActive: true, order: 0 });
            setIsFormOpen(!isFormOpen);
          }}
          className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 rounded-xl text-xs font-bold h-9 self-start"
        >
          <Plus className="w-4 h-4" />
          {isFormOpen ? "Batal" : "Tambah Sosmed"}
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

      {/* Collapsible Form Container */}
      <InlineForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? "Edit Sosial Media" : "Tambah Sosial Media Baru"}
      >
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Platform</label>
            <Input
              type="text"
              placeholder="Contoh: Instagram"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ikon Lucide</label>
            <Select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            >
              {iconOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Urutan Tampil (Order)</label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tautan URL</label>
            <Input
              type="url"
              placeholder="https://instagram.com/akun-anda"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center gap-3 mt-6">
            <Switch
              checked={formData.isActive}
              onCheckedChange={(val) => setFormData({ ...formData, isActive: val })}
            />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tampilkan (Aktif)</span>
          </div>

          <div className="md:col-span-3 border-t border-gray-100 pt-4 flex gap-2">
            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl h-9">
              {editingId ? "Simpan Perubahan" : "Simpan Baru"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(false)}
              className="text-gray-600 border-gray-200 hover:bg-gray-50 rounded-xl font-bold h-9"
            >
              Batal
            </Button>
          </div>
        </form>
      </InlineForm>

      {/* Social Media Table (CRUD List) */}
      <div className="bg-white border border-gray-200/60 rounded-[28px] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">No</TableHead>
              <TableHead className="w-16 text-center">Ikon</TableHead>
              <TableHead>Nama Platform</TableHead>
              <TableHead className="hidden md:table-cell">Tautan URL</TableHead>
              <TableHead className="w-20 text-center">Urutan</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
              <TableHead className="w-32 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {socials.map((item, index) => {
              const IconComp = Icons[item.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
              const isDeletingThis = deletingId === item.id;
              
              return (
                <TableRow
                  key={item.id}
                  className={cn(isDeletingThis && "bg-red-50 hover:bg-red-50")}
                >
                  <TableCell className="text-center font-bold text-gray-400">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex p-2 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 items-center justify-center">
                      {IconComp ? <IconComp className="w-4 h-4" /> : <Icons.Globe className="w-4 h-4" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-dark">{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-gray-400 text-xs truncate max-w-xs select-all">
                    {item.url}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-gray-600">{item.order}</TableCell>
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
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingId(item.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {socials.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-gray-400 text-xs">
                  Belum ada data sosial media.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Tagline editor */}
      <div className="bg-white border border-gray-200/60 p-6 rounded-[28px] shadow-sm flex flex-col gap-4 max-w-xl">
        <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">Tagline Footer</h3>
        <form onSubmit={handleSaveTagline} className="flex flex-col gap-4 text-left items-start w-full">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Teks Tagline</label>
            <Input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSavingTagline}
            className="bg-secondary hover:bg-secondary/95 text-white flex items-center gap-1.5 rounded-xl text-xs font-bold h-9"
          >
            {isSavingTagline ? (
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Tagline
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
