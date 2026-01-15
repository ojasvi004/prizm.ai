"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Hide Navbar on chats, login, and register pages
  if (
    pathname?.startsWith("/chats") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-6 px-4">
      <nav className="flex items-center justify-between px-6 py-3 w-full max-w-5xl bg-white/70 backdrop-blur-lg border border-white/40 shadow-xl shadow-blue-900/5 rounded-full ring-1 ring-white/50">
        

        {/* Logo */}
        <div className="flex items-center gap-2">
           <img src="/logo.png" alt="Prizm AI Logo" width={32} height={32} className="object-contain" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-900 select-none">
            Prizm AI
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
           <Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
           <Link href="/#reviews" className="hover:text-blue-600 transition-colors">Customer Reviews</Link>
           <Link href="/#subscription-packages" className="hover:text-blue-600 transition-colors">Subscription</Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link 
            href="/login" 
            className="hidden sm:block px-5 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-900 text-white rounded-full hover:opacity-90 transition-all duration-300 shadow-md shadow-blue-500/20 active:scale-95"
          >
            Get Started
          </Link>
        </div>

      </nav>
    </div>
  );
}
