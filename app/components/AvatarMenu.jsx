"use client";
import { useState } from "react";
import { User, LogOut, FileText, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border border-slate-200 px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
          <User className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-slate-700">Digital Spine ID</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl p-2 z-[60] animate-fade-in shadow-2xl border-indigo-50">
          <Link href="/terms" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors text-sm font-semibold">
            <FileText className="w-4 h-4" />
            Patient Terms
          </Link>
          <div className="h-px bg-slate-100 my-1 mx-2"></div>
          <Link href="/auth/logout" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors text-sm font-semibold">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      )}
    </div>
  );
}
