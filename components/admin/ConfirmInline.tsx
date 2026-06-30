import React from "react";
import { Button } from "../ui/button";

interface ConfirmInlineProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmInline({ onConfirm, onCancel, isLoading }: ConfirmInlineProps) {
  return (
    <div className="flex items-center gap-1.5 select-none" onClick={(e) => e.stopPropagation()}>
      <span className="text-[10px] font-extrabold text-red-600 animate-pulse uppercase tracking-wider mr-1">
        Yakin?
      </span>
      <Button
        size="sm"
        variant="destructive"
        onClick={onConfirm}
        disabled={isLoading}
        className="h-7 px-2.5 text-[10px] font-extrabold uppercase rounded-lg shadow-sm"
      >
        {isLoading ? "..." : "Ya, Hapus"}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="h-7 px-2.5 text-[10px] font-extrabold uppercase rounded-lg border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
      >
        Batal
      </Button>
    </div>
  );
}
