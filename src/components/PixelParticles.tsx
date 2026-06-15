"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRandom(seed: number) {
  const rng = mulberry32(seed);
  return {
    range: (min: number, max: number) => rng() * (max - min) + min,
    int: (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min,
  };
}

export function PixelParticles({ count = 25 }: { count?: number }) {
  const particles = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      xPct: rand.range(0, 100),
      yPct: rand.range(0, 100),
      size: rand.int(2, 10),
      opacity: rand.range(0.05, 0.35),
      delay: rand.range(0, 5),
      duration: rand.range(10, 20),
      driftX: rand.range(-20, 20),
      driftY: rand.range(-20, 20),
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.xPct}%`,
            top: `${p.yPct}%`,
            opacity: 0,
          }}
          animate={{
            opacity: [0, p.opacity, p.opacity, 0],
            x: ["0vw", `${p.driftX}vw`, `${-p.driftX}vw`, "0vw"],
            y: ["0vh", `${-p.driftY}vh`, `${p.driftY}vh`, "0vh"],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
