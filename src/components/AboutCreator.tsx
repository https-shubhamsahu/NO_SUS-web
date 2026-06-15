"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PixelButton } from "./PixelButton";
import Image from "next/image";



export function AboutCreator() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="w-full py-24 md:py-32 bg-zinc-950 text-white relative border-y border-white/5">
      <div className="max-w-4xl mx-auto px-6 relative z-10" ref={ref}>
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center md:items-start">
          
          {/* Creator Avatar / Image Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 relative group"
          >
            <div className="w-40 h-40 md:w-56 md:h-56 relative border border-zinc-800 bg-black overflow-hidden z-10 p-2">
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full relative z-10">
                  <Image src="/creator.jpeg" alt="Creator" fill sizes="(max-width: 768px) 160px, 224px" className="object-cover" />
                </div>
                {/* Glitch lines */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCINCi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay" />
              </div>
            </div>
            {/* Shadow / Glow */}
            <div className="absolute -inset-2 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>

          {/* Text Content */}
          <div className="flex-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Shubham Sahu</h2>
              <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Creator of NO SUS</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 font-mono text-sm md:text-base text-zinc-300 leading-relaxed"
            >
              <p>NO SUS started during a 5-day Flutter workshop.</p>
              <p>I originally built it for my Kaam25 group.</p>
              <p>Then I realized the problem existed everywhere.</p>
              <p>People share things with good intentions.<br />Then they lose control.</p>
              <p className="text-white font-bold">NO SUS is my attempt to fix that.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="pt-4 border-t border-zinc-800"
            >
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-2">Current Focus</p>
              <p className="font-mono text-white text-sm">Secure collaboration platform.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <a href="https://instagram.com/https.shubham.sahu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all group hover:scale-105">
                <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} style={{ width: "24px", height: "auto" }} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="font-mono text-xs uppercase tracking-wider hidden sm:inline-block">Instagram</span>
              </a>
              <a href="https://linkedin.com/in/shubhamsahu9372" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all group hover:scale-105">
                <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} style={{ width: "24px", height: "auto" }} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="font-mono text-xs uppercase tracking-wider hidden sm:inline-block">LinkedIn</span>
              </a>
              <a href="https://github.com/https-shubhamsahu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all group hover:scale-105">
                <Image src="/icons/github.png" alt="GitHub" width={24} height={24} style={{ width: "24px", height: "auto" }} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="font-mono text-xs uppercase tracking-wider hidden sm:inline-block">GitHub</span>
              </a>
              <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all group hover:scale-105">
                <Image src="/icons/x.png" alt="X" width={24} height={24} style={{ width: "24px", height: "auto" }} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className="font-mono text-xs uppercase tracking-wider hidden sm:inline-block">X</span>
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
