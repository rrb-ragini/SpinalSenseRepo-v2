
"use client";
import { useState } from "react";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-white border shadow-sm"
      >
        <img src="/avatar.png" alt="avatar" className="h-8 w-8 rounded-full" />
        <div className="text-sm">Ragini</div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white card p-3">
          <a href="/auth/logout" className="block py-2 px-2 rounded hover:bg-slate-50">Logout</a>
          <a href="/auth/login" className="block py-2 px-2 rounded hover:bg-slate-50">Account</a>
        </div>
      )}
    </div>
  );
}
