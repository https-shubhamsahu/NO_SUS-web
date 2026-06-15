"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const SENTENCES = [
  "I spent hours making notes.",
  "I shared them.",
  "They got forwarded.",
  "Someone uploaded them.",
  "Someone else got credit.",
  "Nobody knew they were mine.",
];

export function WhyNoSusExists() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(-1);
  const [showConclusion, setShowConclusion] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      // Mapping [0, 0.8] to sentences
      if (v < 0.05) {
        setActiveIndex(-1);
        setShowConclusion(false);
      } else if (v < 0.8) {
        const index = Math.floor(((v - 0.05) / 0.75) * SENTENCES.length);
        setActiveIndex(index);
        setShowConclusion(false);
      } else {
        setActiveIndex(SENTENCES.length); // All sentences past
        setShowConclusion(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[300vh] bg-black text-white"
    >
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        
        {/* Background gradient fade */}
        <motion.div 
          className="absolute inset-0 bg-zinc-950"
          style={{ opacity: useTransform(scrollYProgress, [0.8, 0.9], [0, 1]) }}
        />

        <div className="relative z-10 max-w-4xl w-full mx-auto text-center">
          <AnimatePresence mode="wait">
            {!showConclusion ? (
              <div className="flex flex-col items-center justify-center space-y-6">
                {SENTENCES.map((sentence, i) => {
                  const isActive = i === activeIndex;
                  const isPast = i < activeIndex;
                  if (!isActive && !isPast) return null;
                  
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                      animate={
                        isActive 
                          ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1.05 }
                          : { opacity: 0.2, y: -10, filter: "blur(2px)", scale: 0.95 }
                      }
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="origin-center"
                    >
                      <p className={`font-mono md:text-2xl lg:text-3xl tracking-tight ${isActive ? 'text-white font-bold' : 'text-zinc-600'}`}>
                        {sentence}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                key="conclusion"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <p className="text-2xl md:text-5xl font-black tracking-tighter text-zinc-500 mb-2 leading-tight">
                  NO SUS WAS NOT BUILT TO STOP SHARING.
                </p>
                <p className="text-3xl md:text-6xl font-black tracking-tighter text-white leading-tight">
                  IT WAS BUILT TO STOP LOSING CONTROL.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
