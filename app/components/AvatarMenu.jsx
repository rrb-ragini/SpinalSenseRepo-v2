"use client";
import { useState } from "react";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white border px-3 py-1.5 rounded-md shadow-sm">
        <img src="/avatar.png" className="h-8 w-8 rounded-full" />
        <span className="text-sm">User</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white card p-3">
          <a className="block px-2 py-2 rounded hover:bg-slate-50" href="/terms">Terms & Conditions</a>
          <a className="block px-2 py-2 rounded hover:bg-slate-50" href="/auth/logout">Logout</a>
        </div>
      )}
    </div>
  );
}
