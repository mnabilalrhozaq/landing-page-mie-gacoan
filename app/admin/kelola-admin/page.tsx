"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  User,
  Key,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { adminFetch } from "@/lib/adminFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface AdminUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function KelolaAdminPage() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Deletion State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Message State
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await adminFetch("/api/admin/accounts");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      } else {
        setErrorMsg("Gagal mengambil data administrator.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      confirmPassword: "",
    });
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAdmin(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validation
    if (!formData.name || !formData.email) {
      setErrorMsg("Nama dan email wajib diisi!");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Format email tidak valid!");
      return;
    }

    // Password validation for new admin
    if (!editingAdmin && !formData.password) {
      setErrorMsg("Password wajib diisi untuk admin baru!");
      return;
    }

    // Password match validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMsg("Konfirmasi password tidak cocok!");
      return;
    }

    setSubmitLoading(true);

    try {
      const url = editingAdmin
        ? `/api/admin/accounts/${editingAdmin.id}`
        : "/api/admin/accounts";
      const method = editingAdmin ? "PUT" : "POST";

      const res = await adminFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(
          editingAdmin
            ? `Akun admin "${formData.name}" berhasil diperbarui!`
            : `Akun admin baru "${formData.name}" berhasil ditambahkan!`
        );
        setIsFormOpen(false);
        fetchAdmins();
      } else {
        setErrorMsg(data.error || "Gagal menyimpan data admin.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setErrorMsg("");
    setSuccessMsg("");
    setDeleteLoading(true);

    try {
      const res = await adminFetch(`/api/admin/accounts/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("Akun admin berhasil dihapus!");
        setDeleteConfirmId(null);
        fetchAdmins();
      } else {
        setErrorMsg(data.error || "Gagal menghapus akun admin.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredAdmins = admins.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && admins.length === 0) {
    return (
      <div className="flex flex-col gap-6 animate-pulse select-none">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="h-9 bg-gray-200 rounded w-32" />
        </div>
        <div className="h-64 bg-gray-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 text-left font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-dark leading-none">Kelola Akun Admin</h2>
          <p className="text-gray-400 text-xs mt-1">
            Tambah, ubah, atau hapus akun administrator yang memiliki akses ke panel ini.
          </p>
        </div>
        {!isFormOpen && (
          <Button
            onClick={handleOpenAdd}
            className="bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold text-xs h-9 flex items-center gap-1.5 w-fit"
          >
            <Plus className="w-4 h-4" />
            Tambah Admin
          </Button>
        )}
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4.5 h-4.5 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Inline Form */}
      <InlineForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingAdmin ? "Edit Akun Admin" : "Tambah Admin Baru"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Nama Lengkap
              </label>
              <Input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-xl border-gray-200/80 focus-visible:ring-secondary h-10"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> Email
              </label>
              <Input
                type="email"
                placeholder="Masukkan alamat email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="rounded-xl border-gray-200/80 focus-visible:ring-secondary h-10"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Password {editingAdmin && "(Kosongkan jika tidak diubah)"}
              </label>
              <Input
                type="password"
                placeholder={editingAdmin ? "••••••••" : "Masukkan password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingAdmin}
                className="rounded-xl border-gray-200/80 focus-visible:ring-secondary h-10"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Konfirmasi Password
              </label>
              <Input
                type="password"
                placeholder={editingAdmin ? "••••••••" : "Masukkan kembali password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required={!editingAdmin && !!formData.password}
                className="rounded-xl border-gray-200/80 focus-visible:ring-secondary h-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={submitLoading}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs h-10 px-5"
            >
              {submitLoading ? "Menyimpan..." : "Simpan Akun"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseForm}
              className="rounded-xl border-gray-200 text-gray-500 hover:bg-gray-50 font-bold text-xs h-10 px-5"
            >
              Batal
            </Button>
          </div>
        </form>
      </InlineForm>

      {/* Admin Table Card */}
      <div className="bg-white border border-gray-200/60 rounded-[28px] shadow-sm overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <h3 className="font-bold text-dark text-sm">Daftar Akun ({admins.length})</h3>
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <Input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 rounded-xl border-gray-200/80 focus-visible:ring-secondary h-9 text-xs"
            />
          </div>
        </div>

        {/* Table Content */}
        {filteredAdmins.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            Tidak ada akun admin yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] pl-6">No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="w-[200px] text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.map((item, index) => {
                  const isCurrent = currentAdmin?.id === item.id;
                  return (
                    <TableRow key={item.id} className="group">
                      <TableCell className="font-medium text-gray-400 pl-6 text-xs">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-dark">
                        <div className="flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {isCurrent && (
                            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">
                              Anda
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 font-medium">
                        {item.email}
                      </TableCell>
                      <TableCell className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {deleteConfirmId === item.id ? (
                            <ConfirmInline
                              onConfirm={() => handleDelete(item.id)}
                              onCancel={() => setDeleteConfirmId(null)}
                              isLoading={deleteLoading}
                            />
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleOpenEdit(item)}
                                className="h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/10"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteConfirmId(item.id)}
                                // Disable delete button if there's only 1 admin, but still allow self-deletion check in backend
                                disabled={admins.length <= 1}
                                className={`h-8 w-8 p-0 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
