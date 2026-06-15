"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelButton } from "./PixelButton";

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
  return { next: () => rng(), range: (min: number, max: number) => rng() * (max - min) + min };
}

type PdfPos = { x: number; y: number; rot: number; scale: number; zIndex: number };

const STAGE_MESSAGES = [
  "",
  "Shared with a friend.",
  "Forwarded.",
  "Forwarded again.",
  "Uploaded.",
  "Ownership lost.",
  "Ownership lost.",
];

function PdfCard({
  dimmed = false,
  highlighted = false,
  style,
}: {
  dimmed?: boolean;
  highlighted?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className="absolute select-none"
      style={style}
    >
      <div
        className={`
          relative w-24 sm:w-28 md:w-36
          bg-white/5 border transition-all duration-700
          ${highlighted
            ? "border-white/60 bg-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            : dimmed
              ? "border-white/[0.02] bg-white/[0.01]"
              : "border-white/10"
          }
        `}
        style={{
          boxShadow: highlighted
            ? "0 0 50px rgba(255,255,255,0.25)"
            : dimmed
              ? "none"
              : "0 10px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-white/5">
          <div className="w-1.5 h-1.5 bg-white/20" />
          <div className="w-1.5 h-1.5 bg-white/10" />
          <div className="w-1.5 h-1.5 bg-white/10" />
          <span className="text-[6px] font-mono tracking-widest text-white/20 ml-auto">PDF</span>
        </div>
        <div className="p-2 sm:p-3 space-y-1.5">
          <div className="flex items-start gap-1.5 mb-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border border-white/10 flex items-center justify-center">
              <span className="text-[6px] text-white/30 font-mono">F</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-white/10 w-3/4" />
              <div className="h-1.5 bg-white/5 w-1/2" />
            </div>
          </div>
          {[80, 55, 85, 40].map((w, i) => (
            <div key={i} className="h-1 bg-white/5" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const MAX_STAGE = 6;
const MAX_PDFS = Math.pow(2, MAX_STAGE);

function generatePositions(): PdfPos[] {
  const rand = seededRand(42);
  const positions: PdfPos[] = [];
  for (let i = 0; i < MAX_PDFS; i++) {
    const t = i / MAX_PDFS;
    const angle = t * Math.PI * 8;
    const radius = 4 + t * 38;
    const x = 50 + Math.cos(angle) * radius + rand.range(-6, 6);
    const y = 50 + Math.sin(angle) * radius + rand.range(-6, 6);
    const scale = rand.range(0.7, 1.25);
    const zIndex = Math.floor(rand.range(1, 40));
    positions.push({ x: Math.min(94, Math.max(6, x)), y: Math.min(94, Math.max(6, y)), rot: rand.range(-15, 15), scale, zIndex });
  }
  return positions;
}

export function LeakSimulator() {
  const positions = useMemo(() => generatePositions(), []);

  const [stage, setStage] = useState(0);
  const [started, setStarted] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  const [showCongrats, setShowCongrats] = useState(false);
  const [dimAll, setDimAll] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showFinalReveal, setShowFinalReveal] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const pdfCount = started ? Math.pow(2, stage) : 1;
  const isFinal = stage > MAX_STAGE;

  const highlightPool = useMemo(() => {
    const rand = seededRand(99);
    const pool: number[] = [];
    const count = Math.min(pdfCount, 64);
    if (count < 4) {
      return [1, 2, 3];
    }
    while (pool.length < 3) {
      const idx = Math.floor(rand.range(1, count));
      if (!pool.includes(idx)) pool.push(idx);
    }
    return pool;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCongrats, pdfCount]);

  useEffect(() => {
    if (!started || stage > MAX_STAGE) return;
    const msg = STAGE_MESSAGES[stage];
    if (!msg) return;
    const id = setTimeout(() => {
      setMessageText(msg);
      setShowMessage(true);
    }, 0);
    const hide = setTimeout(() => setShowMessage(false), 2200 + 50);
    return () => { clearTimeout(id); clearTimeout(hide); };
  }, [stage, started]);

  // final sequence
  useEffect(() => {
    if (stage <= MAX_STAGE) return;
    const seq: (() => void)[] = [
      () => { setMessageText("Ownership status: Lost"); setShowMessage(true); },
      () => { setShowMessage(false); setShowCongrats(true); },
      () => { setShowCongrats(false); setDimAll(true); },
      () => { setShowQuestion(true); },
      () => { setCurrentHighlight(highlightPool[0]); },
      () => { setCurrentHighlight(null); },
      () => { setCurrentHighlight(highlightPool[1]); },
      () => { setCurrentHighlight(null); },
      () => { setCurrentHighlight(highlightPool[2]); },
      () => { setCurrentHighlight(null); setShowQuestion(false); setShowAnswer(true); },
      () => { setShowAnswer(false); setDimAll(false); setShowFinalReveal(true); },
      () => { setShowReset(true); },
    ];

    const delays = [2000, 2500, 1500, 1000, 2000, 1200, 2000, 1200, 2000, 2000, 2000, 800];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let acc = 400;
    for (let i = 0; i < seq.length; i++) {
      const fn = seq[i];
      const delay = delays[i];
      const t = setTimeout(fn, acc);
      timers.push(t);
      acc += delay;
    }
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const handleForward = useCallback(() => {
    if (!started) {
      setStarted(true);
      setStage(1);
      return;
    }
    if (stage < MAX_STAGE) {
      setStage((s) => s + 1);
    } else if (stage === MAX_STAGE) {
      setStage(MAX_STAGE + 1);
    }
  }, [started, stage]);

  const handleReset = useCallback(() => {
    setStage(0);
    setStarted(false);
    setShowMessage(false);
    setMessageText("");
    setShowCongrats(false);
    setDimAll(false);
    setShowQuestion(false);
    setCurrentHighlight(null);
    setShowAnswer(false);
    setShowFinalReveal(false);
    setShowReset(false);
  }, []);

  return (
    <section id="leak-simulator" className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* PDF layer */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: isFinal ? MAX_PDFS : pdfCount }).map((_, i) => {
            const pos = positions[i];
            const isHighlighted = currentHighlight === i;
            const itemDimmed = dimAll && !isHighlighted;
            const itemOpacity = dimAll ? (isHighlighted ? 1 : 0.04) : 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: itemOpacity, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: Math.min(i * 0.015, 0.35),
                }}
                className="absolute inset-0"
                style={{ zIndex: isHighlighted ? 50 : 1 }}
              >
                <PdfCard
                  dimmed={itemDimmed}
                  highlighted={isHighlighted}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: `translate(-50%, -50%) rotate(${pos.rot}deg) scale(${isHighlighted ? 1.4 : pos.scale})`,
                    opacity: itemOpacity,
                    zIndex: isHighlighted ? 50 : pos.zIndex,
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Center overlay content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pointer-events-none">
        <AnimatePresence mode="wait">
          {!started && (
            <motion.div
              key="initial"
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-2 mb-4"
            >
              <p className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-white/20">
                ONE FILE
              </p>
              <p className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-white/20">
                ONE RECIPIENT
              </p>
              <p className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-white/20">
                ONE DECISION
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage counter */}
        <AnimatePresence>
          {started && !isFinal && !showFinalReveal && (
            <motion.div
              key="counter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-baseline gap-2 mb-2"
            >
              <span className="text-5xl sm:text-6xl md:text-7xl font-bold font-mono tracking-tighter text-white">
                {pdfCount.toLocaleString()}
              </span>
              <span className="text-sm sm:text-base text-white/30 font-mono">
                copies
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage message */}
        <AnimatePresence>
          {showMessage && !showCongrats && !showQuestion && !showAnswer && !showFinalReveal && (
            <motion.p
              key={messageText}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-mono text-white/50 text-center max-w-xs"
            >
              {messageText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Congratulations */}
        <AnimatePresence>
          {showCongrats && (
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="text-lg sm:text-xl md:text-2xl font-mono text-white/70">
                Congratulations.
              </p>
              <p className="text-sm sm:text-base font-mono text-white/40 mt-2 max-w-sm">
                Your notes are now public infrastructure.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question */}
        <AnimatePresence>
          {showQuestion && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center tracking-tight"
            >
              WHICH ONE WAS YOURS?
            </motion.p>
          )}
        </AnimatePresence>

        {/* Answer */}
        <AnimatePresence>
          {showAnswer && (
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl md:text-2xl font-mono text-white/60 text-center"
            >
              THAT&apos;S THE PROBLEM.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Final reveal */}
        <AnimatePresence>
          {showFinalReveal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl sm:text-3xl md:text-5xl font-black leading-none tracking-tighter text-white"
              >
                YOU SHARED IT
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl sm:text-3xl md:text-5xl font-black leading-none tracking-tighter text-zinc-400 mt-1"
              >
                WITH ONE PERSON.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl sm:text-3xl md:text-5xl font-black leading-none tracking-tighter text-zinc-500 mt-3"
              >
                NOW EVERYONE HAS IT.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset button */}
        <AnimatePresence>
          {showReset && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8"
            >
              <PixelButton variant="outline" onClick={handleReset}>
                WATCH AGAIN
              </PixelButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Forward button */}
      {!isFinal && !showFinalReveal && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: started ? 0 : 0.5 }}
          >
            <PixelButton variant="outline" onClick={handleForward}>
              {!started ? "FORWARD" : "FORWARD"}
            </PixelButton>
          </motion.div>
        </div>
      )}

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black via-black/40 to-transparent pointer-events-none z-10" />
    </section>
  );
}
