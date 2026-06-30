"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  Info,
  UtensilsCrossed,
  Package,
  MapPin,
  Image as ImageIcon,
  Star,
  Compass,
  FileImage,
  List,
  Menu as Hamburger,
  X,
  LogOut,
  ExternalLink,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Kelola Logo", href: "/admin/logo", icon: FileImage },
  { label: "Hero Slider", href: "/admin/hero", icon: ImageIcon },
  { label: "Welcome Page", href: "/admin/welcome", icon: Sparkles },
  { label: "About Page", href: "/admin/about", icon: Info },
  { label: "Kelola Menu", href: "/admin/menu", icon: UtensilsCrossed },
  { label: "Menu Paket", href: "/admin/paket", icon: Package },
  { label: "Outlets Cabang", href: "/admin/outlets", icon: MapPin },
  { label: "Galeri Foto", href: "/admin/galeri", icon: FileImage },
  { label: "Testimoni", href: "/admin/testimoni", icon: Star },
  { label: "Kelola Lokasi", href: "/admin/lokasi", icon: Compass },
  { label: "Kelola Footer", href: "/admin/footer", icon: List },
  { label: "Kelola Admin", href: "/admin/kelola-admin", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const { admin, isLoading, checkAuth, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize and check JWT cookie session state
  useEffect(() => {
    if (pathname !== "/admin/login") {
      checkAuth();
    }
  }, [pathname, checkAuth]);

  // Handle redirects on load completion
  useEffect(() => {
    if (!isLoading && !admin && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [admin, isLoading, pathname, router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  // If loading session check, display standard pulsate page placeholder
  if (isLoading && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-light flex flex-col items-center justify-center select-none">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="font-body text-xs text-gray-500 font-semibold mt-4 animate-pulse">
          Memuat sesi admin...
        </span>
      </div>
    );
  }

  // Bypass shell wrapper for login screen
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const currentPageTitle = menuItems.find((item) => item.href === pathname)?.label || "Admin Panel";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Desktop Sidebar (lg+ persistent) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-56 sticky top-0 h-screen bg-dark text-white border-r border-gray-800 shrink-0 select-none">
        {/* Brand logo header */}
        <div className="h-16 border-b border-gray-800 flex items-center px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold text-secondary tracking-wide">
              Gacoan Admin
            </span>
          </Link>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-gray-850 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Bottom Footer */}
        <div className="p-4 border-t border-gray-850">
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-4 py-2.5 mb-2 rounded-xl text-xs font-bold uppercase tracking-wider text-secondary hover:bg-secondary/10 transition-colors"
          >
            <Compass className="w-4 h-4 shrink-0" />
            Halaman Utama
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation (Slide-in overlay) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            {/* Sidebar element */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-64 bg-dark text-white border-r border-gray-800 z-50 flex flex-col lg:hidden"
            >
              <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
                <span className="font-heading text-2xl font-bold text-secondary tracking-wide">
                  Gacoan Admin
                </span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-800 text-gray-400 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-400 hover:bg-gray-850 hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-gray-850">
                <Link
                  href="/"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 mb-2 rounded-xl text-xs font-bold uppercase tracking-wider text-secondary hover:bg-secondary/10 transition-colors"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  Halaman Utama
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Keluar Sesi
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Core Content Container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-6 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-dark focus:outline-none"
            >
              <Hamburger className="w-5 h-5" />
            </button>
            <h1 className="font-body font-bold text-base text-dark leading-none">
              {currentPageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline font-body text-xs text-gray-400 font-semibold mr-1">
              Hi, {admin?.name || "Administrator"}
            </span>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 flex items-center gap-1.5 h-8 font-semibold rounded-lg text-xs">
                Lihat Web
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
          </div>
        </header>

        {/* Content Body Layout */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
