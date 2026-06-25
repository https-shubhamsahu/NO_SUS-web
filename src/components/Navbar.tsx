"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="font-black text-xl tracking-tighter text-white cursor-pointer select-none"
          onClick={handleLogoClick}
        >
          NO SUS<span className="text-zinc-500">.</span>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-6">
          {pathname === "/" ? (
            <>
              <Link
                href="/alpha-testers"
                className="font-mono text-xs uppercase tracking-widest text-white border border-white/20 px-3 py-1.5 hover:border-white hover:bg-white hover:text-black transition-all rounded-sm"
              >
                [ Alpha Program ]
              </Link>
            </>
          ) : (
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              [ Back to Home ]
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

