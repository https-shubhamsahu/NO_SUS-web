"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── document content ──
const BODY_A = [85, 65, 92, 70, 78, 60, 88, 75, 82, 68, 72, 58];
const BODY_B = [80, 70, 90, 68, 75, 62, 85, 72];

function DocumentContent() {
  return (
    <div className="w-full p-6 md:p-8">
      <div className="bg-zinc-950 border border-zinc-800 p-6 md:p-8">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-zinc-800">
          <div className="w-2 h-2 bg-zinc-700" />
          <span className="text-zinc-600 text-xs font-mono">CONFIDENTIAL</span>
          <span className="text-zinc-700 text-xs font-mono ml-auto">Page 1 / 4</span>
        </div>

        <div className="mb-6">
          <div className="h-3 bg-zinc-800 w-3/4 mb-2" />
          <div className="h-3 bg-zinc-800 w-1/2" />
        </div>

        <div className="space-y-2 mb-6">
          {BODY_A.map((w, i) => (
            <div key={i} className="h-2 bg-zinc-800" style={{ width: `${w}%` }} />
          ))}
        </div>

        <div className="border border-zinc-800 aspect-video mb-6 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-700" />
        </div>

        <div className="space-y-2 mb-6">
          {BODY_B.map((w, i) => (
            <div key={i} className="h-2 bg-zinc-800" style={{ width: `${w}%` }} />
          ))}
        </div>

        <div className="pt-4 border-t border-zinc-800 mt-4 flex items-center gap-3">
          <div className="w-10 h-10 border border-zinc-800" />
          <div className="space-y-1.5">
            <div className="h-1.5 bg-zinc-800 w-24" />
            <div className="h-1.5 bg-zinc-800 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

const WATERMARK_LINES = [
  "John Doe",
  "john@email.com",
  "14 June 2026",
  "Viewer ID: NS-0847",
];

function SingleWatermark({ index }: { index: number }) {
  const xRef = useRef(0);
  const yRef = useRef(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const cols = 3;
  const rows = 4;
  const col = index % cols;
  const row = Math.floor(index / cols);

  const baseLeft = (col + 0.5) * (100 / cols);
  const baseTop = (row + 0.5) * (100 / rows);

  useEffect(() => {
    let running = true;
    const phaseOffset = index * 1.5;
    const speed = 0.8 + (index % 3) * 0.2;

    function tick() {
      if (!running) return;
      const t = (Date.now() / 4000) * speed;
      xRef.current = Math.sin(t * 0.4 + phaseOffset) * 4;
      yRef.current = Math.cos(t * 0.3 + phaseOffset) * 4;
      setPos({ x: xRef.current, y: yRef.current });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return () => {
      running = false;
    };
  }, [index]);

  return (
    <div
      className="absolute whitespace-nowrap select-none pointer-events-none"
      style={{
        left: `${baseLeft + pos.x}%`,
        top: `${baseTop + pos.y}%`,
        transform: "translate(-50%, -50%) rotate(-15deg)",
      }}
    >
      {WATERMARK_LINES.map((line, i) => (
        <p
          key={i}
          className="text-white font-mono text-[11px] md:text-sm font-bold leading-relaxed tracking-widest uppercase select-none drop-shadow-[0_0_2px_rgba(0,0,0,1)]"
          style={{ opacity: 0.3 + i * 0.15 }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function WatermarkLayer({ revealed }: { revealed: boolean }) {
  const watermarkCount = 12;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
      animate={{ opacity: revealed ? 0.12 : 0.35 }}
      transition={{ duration: 0.3 }}
    >
      {Array.from({ length: watermarkCount }).map((_, idx) => (
        <SingleWatermark key={idx} index={idx} />
      ))}
    </motion.div>
  );
}

// ── audit log ──
const LOG_ENTRIES = [
  "VIEWER VERIFIED",
  "FILE OPENED",
  "AUDIT UPDATED",
  "SESSION RECORDED",
];

function AuditLog({ revealed }: { revealed: boolean }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!revealed) return;
    if (visible >= LOG_ENTRIES.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 400 + visible * 200);
    return () => clearTimeout(t);
  }, [revealed, visible]);

  useEffect(() => {
    if (!revealed) {
      const t = setTimeout(() => setVisible(0), 500);
      return () => clearTimeout(t);
    }
  }, [revealed]);

  return (
    <div className="border-t border-zinc-800 mt-3 pt-3 px-1">
      <p className="text-[9px] text-zinc-700 font-mono tracking-wider mb-2 uppercase">
        Live Audit
      </p>
      <div className="space-y-1">
        <AnimatePresence>
          {LOG_ENTRIES.slice(0, visible).map((entry, i) => (
            <motion.div
              key={entry}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <div className="w-1 h-1 bg-zinc-600 flex-shrink-0" />
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
                {entry}
              </span>
              <span className="text-[8px] font-mono text-zinc-700 ml-auto tabular-nums">
                {String(i + 1).padStart(2, "0")}:{String(23 + i * 7).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── breathing overlay ──
function BreathingOverlay() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-10"
      animate={{ scale: [1, 1.008, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="w-full h-full border border-zinc-800/30" />
    </motion.div>
  );
}

// ── main component ──
export function ViewerDemo() {
  const [revealed, setRevealed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-10%" });
  const [blurAmount, setBlurAmount] = useState(24);

  const handleStart = useCallback(() => {
    setRevealed(true);
    setHasInteracted(true);
    setBlurAmount(0);
  }, []);

  const handleEnd = useCallback(() => {
    setRevealed(false);
    setBlurAmount(24);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-black px-4 py-24 md:px-8 md:py-32 overflow-hidden select-none"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-black text-center mb-4 tracking-tight uppercase"
        >
          EVERY VIEWER LEAVES FINGERPRINTS.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-zinc-400 text-sm md:text-base font-mono text-center mb-10 max-w-lg mx-auto"
        >
          Try opening the document. Hold to reveal.
        </motion.p>

        {/* Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            onMouseDown={handleStart}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchEnd={handleEnd}
            className="relative cursor-crosshair overflow-hidden"
          >
            {/* Document */}
            <div
              className="transition-[filter] duration-150 ease-out"
              style={{ filter: `blur(${blurAmount}px)` }}
            >
              <motion.div
                animate={{ scale: [1, 1.006, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <DocumentContent />
              </motion.div>
            </div>

            {/* Watermark */}
            <WatermarkLayer revealed={revealed} />
            <BreathingOverlay />

            {/* Holding border glow */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  key="glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 border border-white/10 pointer-events-none z-10"
                  style={{ boxShadow: "inset 0 0 60px rgba(255,255,255,0.03)" }}
                />
              )}
            </AnimatePresence>

            {/* Instruction overlay */}
            {!hasInteracted && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-center px-6"
                >
                  <p className="text-white font-bold text-xl md:text-2xl tracking-tight mb-3">
                    TRY TO READ THIS DOCUMENT
                  </p>
                  <p className="text-zinc-500 font-mono text-xs tracking-widest">
                    HOLD TO REVEAL &middot; RELEASE TO HIDE
                  </p>
                </motion.div>
              </div>
            )}
          </div>

          {/* Bottom bar: audit log + status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
            <AuditLog revealed={revealed} />

            <div className="flex items-center justify-between border-t border-zinc-800 mt-3 md:mt-0 md:border-t-0 md:pt-0 pt-3 px-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 transition-colors duration-200"
                  style={{ backgroundColor: revealed ? "#ffffff" : "#27272a" }}
                />
                <span className="text-[10px] font-mono text-zinc-600 tabular-nums">
                  {revealed ? "VIEWING" : "BLURRED"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-700">
                {revealed ? "Holding..." : "Hold to view"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
