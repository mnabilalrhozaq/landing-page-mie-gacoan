"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, MessageSquare, Compass, Send, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Testimonial } from "@/types";

export default function TestimoniPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    content: "",
  });
  
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      setErrorMsg("Harap isi semua kolom wajib!");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", rating: 5, content: "" });
        setTimeout(() => {
          router.push("/");
        }, 2500);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Gagal mengirim ulasan.");
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Return Home Button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Beranda
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white border border-gray-100 p-8 rounded-[36px] shadow-sm text-left"
      >
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
            <h2 className="font-heading text-4xl text-dark font-bold mt-2">Ulasan Terkirim!</h2>
            <p className="font-body text-gray-500 text-sm leading-relaxed max-w-xs">
              Terima kasih atas ulasan Anda. Halaman akan dialihkan kembali ke beranda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full w-fit">
                <MessageSquare className="w-3.5 h-3.5" />
                ULASAN PELANGGAN
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-dark font-bold tracking-wide mt-1">
                TULIS TESTIMONI
              </h2>
              <p className="font-body text-gray-500 text-xs">
                Bagikan pengalaman bersantap Anda di outlet Mie Gacoan pilihan Anda.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Input Nama */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wider">
                Nama Lengkap <span className="text-primary">*</span>
              </label>
              <Input
                type="text"
                placeholder="Masukkan nama Anda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>



            {/* Star Rating Selector */}
            <div className="flex flex-col gap-2">
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wider">
                Skor Penilaian <span className="text-primary">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((ratingVal) => (
                  <button
                    type="button"
                    key={ratingVal}
                    onClick={() => setFormData({ ...formData, rating: ratingVal })}
                    onMouseEnter={() => setHoverRating(ratingVal)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        ratingVal <= (hoverRating ?? formData.rating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Input Content Review */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-xs font-bold text-gray-500 uppercase tracking-wider">
                Pesan Ulasan <span className="text-primary">*</span>
              </label>
              <Textarea
                placeholder="Bagikan ulasan lezat Anda mengenai menu, pelayanan, atau tempat outlet kami..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 rounded-xl h-10 mt-2 font-bold"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 fill-white" />
                  Kirim Testimoni
                </>
              )}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
