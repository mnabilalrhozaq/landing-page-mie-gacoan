"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertTriangle, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { admin, login, checkAuth, isLoading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (admin) {
      router.replace("/admin/dashboard");
    }
  }, [admin, router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Harap masukkan email dan password!");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Email atau password salah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm w-full bg-white border border-gray-200/80 p-8 rounded-[32px] shadow-sm flex flex-col gap-6"
      >
        {/* Header Title branding */}
        <div className="flex flex-col items-center justify-center text-center gap-1.5">
          <span className="font-heading text-4xl font-bold text-primary tracking-wide leading-none">
            Gacoan Resto
          </span>
          <h2 className="font-body text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            Portal Administrasi
          </h2>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
          {/* Email Box */}
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                placeholder="admin@miegacoan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 h-9"
                required
              />
            </div>
          </div>

          {/* Password Box */}
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 h-9"
                required
              />
            </div>
          </div>

          {/* Submit Trigger */}
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 rounded-xl h-10 mt-2 font-bold w-full"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Masuk Dashboard
                <Send className="w-3.5 h-3.5 fill-white" />
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
