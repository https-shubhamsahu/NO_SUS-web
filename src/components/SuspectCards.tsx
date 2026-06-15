"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── pixel face definitions (4×4 grid) ──
// 0 = empty, 1 = eye, 2 = mouth, 3 = glasses, 4 = sweat
type FaceDef = number[];

const FACES: Record<string, FaceDef> = {
  forwarder: [
    0, 1, 1, 0,
    0, 1, 1, 0,
    0, 2, 2, 2,
    0, 0, 0, 0,
  ],
  archivist: [
    3, 1, 1, 3,
    3, 1, 1, 3,
    0, 0, 2, 0,
    0, 0, 0, 0,
  ],
  screenshot: [
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 2, 2,
    0, 0, 0, 0,
  ],
  prophet: [
    0, 1, 1, 0,
    0, 1, 0, 0,
    0, 2, 2, 0,
    0, 0, 0, 0,
  ],
  ghost: [
    0, 1, 0, 1,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 1, 1, 1,
  ],
  merchant: [
    1, 0, 0, 1,
    0, 4, 4, 0,
    0, 2, 2, 0,
    0, 0, 0, 0,
  ],
};

// face when hovered (altered expression)
const FACES_HOVER: Record<string, FaceDef> = {
  forwarder: [
    0, 1, 1, 0,
    0, 1, 1, 0,
    2, 2, 2, 2,
    0, 0, 0, 0,
  ],
  archivist: [
    3, 1, 1, 3,
    3, 1, 1, 3,
    0, 2, 2, 0,
    0, 0, 0, 0,
  ],
  screenshot: [
    0, 0, 1, 1,
    0, 0, 1, 1,
    2, 2, 0, 0,
    0, 0, 0, 0,
  ],
  prophet: [
    0, 1, 0, 1,
    0, 1, 0, 0,
    2, 2, 2, 0,
    0, 0, 0, 0,
  ],
  ghost: [
    1, 0, 0, 1,
    0, 0, 0, 0,
    0, 0, 0, 0,
    1, 2, 2, 1,
  ],
  merchant: [
    1, 1, 0, 0,
    0, 4, 4, 0,
    0, 2, 2, 2,
    0, 0, 0, 0,
  ],
};

// ── data ──
type Suspect = {
  id: string;
  name: string;
  title: string;
  description: string;
  dialogue: string;
  interaction: string;
  statLabel: string;
  statValues: string[];
};

const SUSPECTS: Suspect[] = [
  {
    id: "forwarder",
    name: "The Forwarder",
    title: "Chain Reaction Starter",
    description:
      "One innocent 'lol check this' to the group chat and suddenly it's in 47 DMs, 3 Telegram channels, and a Discord server you've never heard of.",
    dialogue: "\"Bro don't worry, I only sent it to 47 people.\"",
    interaction: "Forward count",
    statLabel: "copies",
    statValues: ["1", "4", "17", "82", "∞"],
  },
  {
    id: "archivist",
    name: "The Telegram Archivist",
    title: "Digital Hoarder",
    description:
      "Has every exam paper since 2018 organized by subject, year, and color code. Runs four private channels. Has never opened a single PDF.",
    dialogue: "\"I have it. Do I read it? No. But I have it.\"",
    interaction: "Archive size",
    statLabel: "",
    statValues: ["0.4 GB", "3.2 GB", "12.4 GB", "48 GB", "—"],
  },
  {
    id: "screenshot",
    name: "The Screenshot Collector",
    title: "Evidence Vault",
    description:
      "Takes screenshots of everything. The assignment? Screenshot. The grade sheet? Screenshot. Their own notes? Screenshot. 14,000 images. Zero shame.",
    dialogue: "\"My camera roll is 90% other people's notes.\"",
    interaction: "Screenshots taken",
    statLabel: "",
    statValues: ["1", "14", "53", "128", "∞"],
  },
  {
    id: "prophet",
    name: "The Guess Paper Prophet",
    title: "Self-Proclaimed Oracle",
    description:
      "Claims 'sources inside the exam department.' Posts guess papers that are just last year's paper with the date changed. When wrong? 'Pattern changed last minute.'",
    dialogue: "\"The pattern changed last minute bro I swear.\"",
    interaction: "Accuracy rate",
    statLabel: "",
    statValues: ["94%", "72%", "31%", "8%", "3%"],
  },
  {
    id: "ghost",
    name: "The Ghost Contributor",
    title: "Anonymous Benefactor",
    description:
      "Shares links with no name, no photo, no trace. 'Found this, might help.' Where did they find it? Is it even the right syllabus? Nobody knows. They vanish as mysteriously as they appear.",
    dialogue: "\"I am the hero this group chat doesn't deserve.\"",
    interaction: "Messages sent",
    statLabel: "",
    statValues: ["1", "0", "12", "0", "47"],
  },
  {
    id: "merchant",
    name: "The Night Before Exam Merchant",
    title: "Last-Minute Dealership",
    description:
      "Slides into DMs at 2 AM. 'I have the cheat sheet, 200 bucks.' The cheat sheet is a badly summarized Wikipedia article. But you pay. You always pay. Business is booming.",
    dialogue: "\"Last minute desperation is my favorite business model.\"",
    interaction: "Revenue generated",
    statLabel: "",
    statValues: ["₹200", "₹2.4K", "₹14K", "₹62K", "₹2.4L"],
  },
];

// ── Pixel Portrait ──
function PixelPortrait({ def }: { def: FaceDef }) {
  return (
    <div className="w-20 h-20 border-2 border-zinc-700 bg-zinc-900 flex items-center justify-center mx-auto mb-3 flex-shrink-0">
      <div className="grid grid-cols-4 gap-[1px]">
        {def.map((cell, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 ${
              cell === 1
                ? "bg-white"
                : cell === 2
                  ? "bg-zinc-500"
                  : cell === 3
                    ? "bg-zinc-600"
                    : cell === 4
                      ? "bg-zinc-400"
                      : "bg-zinc-900"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Mini stat counter that loops ──
function MiniStat({ values }: { values: string[] }) {
  const [idx, setIdx] = useState(0);

  const next = useCallback(() => {
    setIdx((p) => (p + 1) % values.length);
  }, [values.length]);

  return (
    <div className="flex items-center gap-2" onClick={(e) => { e.stopPropagation(); next(); }}>
      <motion.span
        key={idx}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white font-mono text-sm font-bold tabular-nums"
      >
        {values[idx]}
      </motion.span>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="text-zinc-600 hover:text-zinc-400 text-xs font-mono border border-zinc-800 px-1.5 py-0.5 transition-colors"
      >
        ↻
      </button>
    </div>
  );
}

// ── Card ──
function SuspectCard({ suspect, index }: { suspect: Suspect; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  const faceDef = hovered ? FACES_HOVER[suspect.id] : FACES[suspect.id];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      whileHover={{ scale: 1.05 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((p) => !p)}
      className="group relative border border-zinc-800 bg-zinc-950 p-5 transition-all duration-300 cursor-default hover:border-zinc-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <motion.div
            animate={hovered ? { scale: 1.1, rotate: [0, -3, 3, -2, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: hovered ? 0.4 : 0.3 }}
          >
            <PixelPortrait def={faceDef} />
          </motion.div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-zinc-600 font-mono tracking-wider uppercase mb-0.5">
            {suspect.title}
          </p>
          <h3 className="text-sm font-bold text-white tracking-tight mb-1">
            {suspect.name}
          </h3>

          <AnimatePresence mode="wait">
            {hovered ? (
              <motion.div
                key="hover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-2"
              >
                <p className="text-[11px] text-zinc-400 font-mono italic leading-relaxed">
                  {suspect.dialogue}
                </p>
                <div className="pt-1 border-t border-zinc-800">
                  <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider mb-1">
                    {suspect.interaction}
                  </p>
                  <MiniStat values={suspect.statValues} />
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] text-zinc-500 leading-relaxed font-mono"
              >
                {suspect.description}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-transparent group-hover:border-white transition-colors duration-300" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-transparent group-hover:border-white transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-transparent group-hover:border-white transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-transparent group-hover:border-white transition-colors duration-300" />
    </motion.div>
  );
}

// ── Section ──
export function SuspectCards() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(headingRef, { once: true, margin: "-10%" });

  return (
    <section className="w-full px-4 py-24 md:px-8 md:py-32 bg-black">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-4xl font-bold text-center mb-3"
        >
          MEET THE SUSPECTS
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-zinc-500 text-sm font-mono text-center mb-12 max-w-lg mx-auto"
        >
          Hover a card. Click the ↻ button. Recognise anyone?
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {SUSPECTS.map((suspect, i) => (
            <SuspectCard key={suspect.id} suspect={suspect} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
