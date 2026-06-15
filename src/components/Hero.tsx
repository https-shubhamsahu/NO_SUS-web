"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelButton } from "./PixelButton";
import { PixelParticles } from "./PixelParticles";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRand(seed: number) {
  const rng = mulberry32(seed);
  return {
    next: () => rng(),
    range: (min: number, max: number) => rng() * (max - min) + min,
  };
}

const DOC_WIDTHS = [70, 45, 85, 55, 65, 40, 75, 50, 60, 80];

function DocPreview({ className }: { className?: string }) {
  return (
    <div className={`p-4 ${className ?? ""}`} style={{ width: 200 }}>
      <div className="border border-zinc-800 bg-zinc-950/90 p-3">
        <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-zinc-800">
          <div className="w-2 h-2 border border-zinc-700" />
          <div className="w-2 h-2 border border-zinc-700" />
          <span className="text-zinc-600 text-[8px] font-mono ml-auto">LEAKED</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="w-8 h-8 border border-zinc-800 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-zinc-800 w-3/4" />
              <div className="h-1.5 bg-zinc-800 w-1/2" />
            </div>
          </div>
          {DOC_WIDTHS.slice(0, 4).map((w, i) => (
            <div key={i} className="h-1.5 bg-zinc-800" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

type PdfGhost = {
  id: number;
  x: number;
  y: number;
  scale: number;
  rot: number;
  opacity: number;
};

function usePdfGhosts(phase: number): PdfGhost[] {
  return useMemo(() => {
    const rand = seededRand(42 + phase * 100);
    const counts = [6, 12, 18, 24, 32];
    const count = counts[Math.min(phase, counts.length - 1)] ?? 30;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: rand.range(-10, 110),
      y: rand.range(-10, 110),
      scale: rand.range(0.3, 1.1),
      rot: rand.range(-15, 15),
      opacity: rand.range(0.04, 0.18),
    }));
  }, [phase]);
}

function PdfDuplication({ phase }: { phase: number }) {
  const ghosts = usePdfGhosts(phase);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="sync">
        {ghosts.map((g) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: g.opacity, scale: g.scale }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute"
            style={{
              left: `${g.x}%`,
              top: `${g.y}%`,
              transform: `translate(-50%, -50%) rotate(${g.rot}deg)`,
            }}
          >
            <DocPreview />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

type LinePhase = {
  text: string;
  sub: string;
};

const LINES: LinePhase[] = [
  { text: "You made the notes.", sub: "" },
  { text: "You shared them.", sub: "" },
  { text: "They shared them.", sub: "" },
  { text: "Now everyone has them.", sub: "" },
];

function SequenceLine({
  line,
  isActive,
  isPast,
}: {
  line: LinePhase;
  isActive: boolean;
  isPast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={
        isActive
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : isPast
            ? { opacity: 0.25, y: -8, filter: "blur(2px)", scale: 0.97 }
            : { opacity: 0, y: 30, filter: "blur(8px)" }
      }
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="text-center">
        <p
          className={`
            font-bold leading-none tracking-tight transition-all duration-700
            ${isActive ? "text-white" : "text-zinc-500"}
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
          `}
        >
          {line.text}
        </p>
        <motion.p
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={
            isActive
              ? { clipPath: "inset(0 0% 0 0)" }
              : { clipPath: "inset(0 100% 0 0)" }
          }
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`
            font-bold leading-none tracking-tight mt-2 transition-all duration-700
            ${isActive ? "text-zinc-400" : "text-zinc-700"}
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
          `}
        >
          {line.sub}
        </motion.p>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(-1);
  const [revealed, setRevealed] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  // Sequence timer
  useEffect(() => {
    if (revealed) return;
    if (phase === -1) {
      const t = setTimeout(() => setPhase(0), 600);
      return () => clearTimeout(t);
    }
    if (phase < 4) {
      const t = setTimeout(() => {
        if (phase === 3) {
          setPhase(4);
          const r = setTimeout(() => setRevealed(true), 400);
          return () => clearTimeout(r);
        }
        setPhase((p) => p + 1);
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [phase, revealed]);

  // Mouse / touch tracking
  useEffect(() => {
    function update(clientX: number, clientY: number) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setSpotlightPos({
        x: ((clientX - rect.left) / rect.width) * 100,
        y: ((clientY - rect.top) / rect.height) * 100,
      });
    }
    function onMouse(e: MouseEvent) { update(e.clientX, e.clientY); }
    function onTouch(e: TouchEvent) {
      const t = e.touches[0];
      if (t) update(t.clientX, t.clientY);
    }
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const spotlightSize = "clamp(120px, 30vw, 200px)";
  const spotlightStyle = {
    WebkitMaskImage: `radial-gradient(circle ${spotlightSize} at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(0,0,0,0.85) 0%, transparent 100%)`,
    maskImage: `radial-gradient(circle ${spotlightSize} at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(0,0,0,0.85) 0%, transparent 100%)`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black select-none"
    >
      <PixelParticles count={30} />

      {/* PDF duplication background — visible from the start */}
      <PdfDuplication phase={Math.max(0, phase)} />

      {/* Spotlight layer — clear PDF visible through cursor */}
      <div
        className="absolute inset-0 z-10"
        style={spotlightStyle}
      >
        <PdfDuplication phase={Math.max(0, phase)} />
      </div>

      {/* Cinematic typography sequence */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
        {/* Phase-based text sequence */}
        {!revealed && (
          <div className="relative w-full max-w-4xl mx-auto" style={{ height: "8rem" }}>
            <AnimatePresence mode="popLayout">
              {LINES.map((line, i) => {
                const isPast = phase > i;
                const isActive = phase === i;
                if (!isPast && !isActive) return null;
                return (
                  <SequenceLine
                    key={i}
                    line={line}
                    isActive={isActive}
                    isPast={isPast}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Massive reveal */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter text-white"
              >
                NOW EVERYONE
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter text-zinc-400 mt-2"
              >
                HAS IT.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
              >
                <PixelButton
                  variant="primary"
                  onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                >
                  BECOME AN ALPHA TESTER
                </PixelButton>
                <PixelButton
                  variant="outline"
                  onClick={() => document.getElementById("leak-simulator")?.scrollIntoView({ behavior: "smooth" })}
                >
                  SEE THE LEAK
                </PixelButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3 cursor-pointer pointer-events-auto"
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="font-mono text-[10px] text-zinc-500 tracking-[0.3em] uppercase">Scroll</span>
            <motion.div 
              animate={{ y: [0, 6, 0] }} 
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-zinc-500" style={{ shapeRendering: "crispEdges" }}>
                <path d="M7 0h1v10H7V0zM6 9h1v1H6V9zM5 8h1v1H5V8zM4 7h1v1H4V7zM8 9h1v1H8V9zM9 8h1v1H9V8zM10 7h1v1H10V7z" fill="currentColor"/>
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20" />
    </section>
  );
}
