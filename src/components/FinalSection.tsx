"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PixelButton } from "./PixelButton";

export function FinalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="w-full py-32 md:py-48 bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl md:text-5xl font-black text-zinc-500 mb-2 leading-none tracking-tighter"
        >
          THE INTERNET WAS BUILT FOR SHARING.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-6xl font-black text-white mb-16 leading-none tracking-tighter"
        >
          NO SUS WAS BUILT FOR ACCOUNTABILITY.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <PixelButton
            variant="primary"
            onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
          >
            REQUEST ACCESS
          </PixelButton>
        </motion.div>
      </div>
    </section>
  );
}
