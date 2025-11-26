"use client";
import { usePathname } from "next/navigation";
import AvatarMenu from "./AvatarMenu";

export default function NavBar() {
  const pathname = usePathname();
  const hideAvatar = pathname.startsWith("/auth");

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-10" />
          <div>
            <div className="text-xl font-semibold">SpinalSense</div>
            <div className="text-sm text-slate-500">AI Spine Assistant</div>
          </div>
        </div>

        {/* Hide avatar on login/logout pages */}
        {!hideAvatar && <AvatarMenu />}
      </div>
    </header>
  );
}
