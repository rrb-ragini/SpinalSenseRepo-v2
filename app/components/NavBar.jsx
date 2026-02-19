"use client";
import { usePathname } from "next/navigation";
import AvatarMenu from "./AvatarMenu";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const hideAvatar = pathname.startsWith("/auth");
  const isLanding = pathname === "/";

  return (
    <header className="sticky top-0 w-full z-50 glass-card border-none bg-white/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/logo.png" className="h-10 w-auto" alt="SpinalSense Logo" />
          <div className="hidden sm:block">
            <div className="text-xl font-bold tracking-tight text-slate-900 leading-tight">SpinalSense</div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-600">AI Spine Analysis</div>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {!isLanding && (
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Marketing
            </Link>
          )}
          {!hideAvatar && <AvatarMenu />}
          {hideAvatar && (
            <Link href="/auth/login" className="text-sm font-semibold text-indigo-600 px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
