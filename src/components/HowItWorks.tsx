"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

function PixelUploadIcon() {
  return (
    <div className="w-16 h-16 relative bg-zinc-950 border-2 border-white/20 flex flex-col items-center justify-center p-2 group-hover:border-white transition-colors duration-500">
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="w-4 h-4 border-t-2 border-l-2 border-white rotate-45 translate-y-1"
      />
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="w-1 h-6 bg-white -translate-y-2"
      />
      <div className="w-10 h-1 bg-white absolute bottom-3" />
    </div>
  );
}

function PixelTrackIcon() {
  return (
    <div className="w-16 h-16 relative bg-zinc-950 border-2 border-white/20 flex items-center justify-center p-2 group-hover:border-white transition-colors duration-500">
      <div className="relative w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="w-full h-full absolute top-0 left-0"
          style={{ clipPath: "polygon(50% 50%, 50% 0, 100% 0, 100% 50%)" }}
        >
          <div className="w-full h-full bg-white/30 rounded-full" />
        </motion.div>
        <div className="w-2 h-2 bg-white rounded-full z-10" />
      </div>
    </div>
  );
}

function PixelControlIcon() {
  return (
    <div className="w-16 h-16 relative bg-zinc-950 border-2 border-white/20 flex items-center justify-center p-2 group-hover:border-white transition-colors duration-500">
      <div className="flex gap-2">
        <motion.div
          animate={{ height: ["40%", "80%", "40%"] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          className="w-2 bg-white"
        />
        <motion.div
          animate={{ height: ["80%", "30%", "80%"] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
          className="w-2 bg-white"
        />
        <motion.div
          animate={{ height: ["50%", "100%", "50%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.4 }}
          className="w-2 bg-white"
        />
      </div>
    </div>
  );
}

const STEPS = [
  {
    num: "1",
    title: "UPLOAD",
    desc: "Share notes, projects, PDFs, research, and files.",
    Icon: PixelUploadIcon,
  },
  {
    num: "2",
    title: "TRACK",
    desc: "Every viewer leaves a trail.",
    Icon: PixelTrackIcon,
  },
  {
    num: "3",
    title: "CONTROL",
    desc: "Know where your content goes.",
    Icon: PixelControlIcon,
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="w-full py-24 md:py-32 bg-black text-white relative">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            HOW NO SUS WORKS
          </h2>
          <p className="text-zinc-500 font-mono text-sm max-w-md mx-auto">
            Zero friction sharing. Maximum accountability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-8">
                <step.Icon />
              </div>
              <div className="text-xs font-mono text-zinc-500 mb-2 tracking-widest uppercase">
                STEP {step.num}
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3">
                {step.title}
              </h3>
              <p className="text-zinc-400 font-mono text-sm leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
