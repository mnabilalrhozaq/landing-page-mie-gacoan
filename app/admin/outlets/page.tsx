"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Trash2, Edit2, Search, MapPin, CheckCircle2, AlertCircle, Clock, Navigation } from "lucide-react";
import { adminFetch } from "@/lib/adminFetch";
import { InlineForm } from "@/components/admin/InlineForm";
import { ConfirmInline } from "@/components/admin/ConfirmInline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Outlet } from "@/types";
import { cn } from "@/lib/utils";

export default function OutletsAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");

  // State Lists
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("semua");

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    openTime: "10.00 – 22.00",
    mapsUrl: "",
    isOpen: true,
  });

  // Action states
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const res = await adminFetch("/api/admin/outlets");
      if (res.ok) {
        const data = await res.json();
        setOutlets(data);
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

  // Extract unique cities for filtering dropdown
  const uniqueCities = useMemo(() => {
    const cities = outlets.map((o) => o.city);
    return Array.from(new Set(cities)).sort();
  }, [outlets]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const isEdit = editingId !== null;
    const urlEndpoint = isEdit ? `/api/admin/outlets/${editingId}` : "/api/admin/outlets";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await adminFetch(urlEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMsg(isEdit ? "Outlet berhasil diperbarui!" : "Outlet baru berhasil ditambahkan!");
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ name: "", city: "", address: "", openTime: "10.00 – 22.00", mapsUrl: "", isOpen: true });
        fetchData();
        router.refresh();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Gagal menyimpan data outlet.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan koneksi jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (item: Outlet) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      city: item.city,
      address: item.address,
      openTime: item.openTime || "10.00 – 22.00",
      mapsUrl: item.mapsUrl || "",
      isOpen: item.isOpen,
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleOpen = async (id: number, currentVal: boolean) => {
    try {
      const res = await adminFetch(`/api/admin/outlets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: !currentVal }),
      });

      if (res.ok) {
        setOutlets(outlets.map((o) => (o.id === id ? { ...o, isOpen: !currentVal } : o)));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const res = await adminFetch(`/api/admin/outlets/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuccessMsg("Outlet berhasil dihapus!");
        setDeletingId(null);
        fetchData();
        router.refresh();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Gagal menghapus outlet.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter lists based on inputs
  const filteredOutlets = useMemo(() => {
    return outlets.filter((item) => {
      const matchesCity = selectedCity === "semua" || item.city === selectedCity;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesSearch;
    });
  }, [outlets, selectedCity, searchQuery]);

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
          <h2 className="text-xl font-bold text-dark leading-none">Kelola Outlets Restoran</h2>
          <p className="text-gray-400 text-xs mt-1">
            Tambah outlet baru, edit detail alamat, jam operasional, link Maps, dan toggle status buka/tutup resto.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", city: "", address: "", openTime: "10.00 – 22.00", mapsUrl: "", isOpen: true });
            setIsFormOpen(!isFormOpen);
          }}
          className="bg-primary hover:bg-primary/95 text-white flex items-center gap-1.5 rounded-xl text-xs font-bold h-9 self-start"
        >
          <Plus className="w-4 h-4" />
          {isFormOpen ? "Batal" : "Tambah Outlet"}
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
        title={editingId ? "Edit Item Outlet" : "Tambah Outlet Baru"}
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Outlet</label>
              <Input
                type="text"
                placeholder="Contoh: Mie Gacoan Dipatiukur"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Kota</label>
              <Input
                type="text"
                placeholder="Contoh: Bandung"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Jam Buka</label>
              <Input
                type="text"
                placeholder="Contoh: 10.00 – 22.00"
                value={formData.openTime}
                onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Alamat Lengkap</label>
              <Textarea
                placeholder="Alamat jalan lengkap..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status Operasional</label>
                <div className="flex items-center gap-3 h-9">
                  <Switch
                    checked={formData.isOpen}
                    onCheckedChange={(val) => setFormData({ ...formData, isOpen: val })}
                  />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Buka (Aktif)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Link Google Maps (Share URL)</label>
            <Input
              type="url"
              placeholder="https://maps.google.com/?q=..."
              value={formData.mapsUrl}
              onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
            />
          </div>

          <div className="border-t border-gray-100 pt-4 flex gap-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-primary hover:bg-primary/95 text-white font-bold rounded-xl h-9 px-6"
            >
              {isSaving ? "Menyimpan..." : "Simpan Outlet"}
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
        {/* City filtering tags */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCity("semua")}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
              selectedCity === "semua"
                ? "bg-secondary text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-500 hover:text-dark"
            }`}
          >
            Semua Kota
          </button>
          {uniqueCities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                selectedCity === city
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-500 hover:text-dark"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari outlet..."
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
                <TableHead>Nama Outlet</TableHead>
                <TableHead className="w-32">Kota</TableHead>
                <TableHead>Alamat Lengkap</TableHead>
                <TableHead className="w-36">Jam Operasional</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-36 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOutlets.map((item, index) => {
                const isDeletingThis = deletingId === item.id;
                
                return (
                  <TableRow
                    key={item.id}
                    className={cn(isDeletingThis && "bg-red-50 hover:bg-red-50")}
                  >
                    <TableCell className="text-center font-bold text-gray-400">{index + 1}</TableCell>
                    <TableCell className="font-bold text-dark">{item.name}</TableCell>
                    <TableCell className="capitalize text-gray-500 font-semibold text-xs">{item.city}</TableCell>
                    <TableCell className="text-gray-600 text-xs max-w-xs truncate">{item.address}</TableCell>
                    <TableCell className="text-gray-500 font-semibold text-xs">
                      {item.openTime || "10.00 – 22.00"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={item.isOpen}
                        onCheckedChange={() => handleToggleOpen(item.id, item.isOpen)}
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
                          {item.mapsUrl && (
                            <a href={item.mapsUrl} target="_blank" rel="noopener noreferrer">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-amber-500 hover:bg-amber-50 rounded-lg"
                              >
                                <Navigation className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
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
              {filteredOutlets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-400 text-xs">
                    Tidak ada outlet ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Stacked List View */}
        <div className="block md:hidden">
          <div className="flex flex-col divide-y divide-gray-100">
            {filteredOutlets.map((item) => {
              const isDeletingThis = deletingId === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 flex flex-col gap-3 text-left transition-colors",
                    isDeletingThis ? "bg-red-50" : "bg-white"
                  )}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-dark text-sm leading-snug">{item.name}</h4>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.city}</span>
                    </div>
                    {item.mapsUrl && (
                      <a href={item.mapsUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-amber-500 hover:bg-amber-50 rounded-lg"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                        </Button>
                      </a>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs leading-normal">{item.address}</p>
                  
                  <div className="flex items-center gap-1.5 text-gray-450 text-[10px] font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Jam: {item.openTime || "10.00 – 22.00"}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100/60 pt-3 mt-1">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.isOpen}
                        onCheckedChange={() => handleToggleOpen(item.id, item.isOpen)}
                      />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        {item.isOpen ? "Buka" : "Tutup"}
                      </span>
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
              );
            })}
            {filteredOutlets.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-xs">
                Tidak ada outlet ditemukan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
