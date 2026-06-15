"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Answer = "A" | "B" | "C" | "D" | null;

const QUESTIONS = [
  {
    question: "A friend sends you a confidential PDF. You:",
    answers: [
      { label: "A", text: "Save it. Read it later. Maybe." },
      { label: "B", text: "Forward it to a few close friends." },
      { label: "C", text: "Upload it to a Telegram group." },
      { label: "D", text: "Screenshot every page." },
    ],
  },
  {
    question: "Your professor emails the exam paper to you by mistake. You:",
    answers: [
      { label: "A", text: "Reply and inform them immediately." },
      { label: "B", text: "Share it with your study group." },
      { label: "C", text: "Post it on the class WhatsApp group." },
      { label: "D", text: "Take photos and save them offline." },
    ],
  },
  {
    question: "You receive a leaked document about your company. You:",
    answers: [
      { label: "A", text: "Delete it. Never speak of it." },
      { label: "B", text: "Forward it to one trusted colleague." },
      { label: "C", text: "Post it on an anonymous forum." },
      { label: "D", text: "Annotate it and share it widely." },
    ],
  },
];

const WEIGHTS: Record<string, Record<string, number>> = {
  Q0_A: { Prophet: 2, Ghost: 1 },
  Q0_B: { Forwarder: 2, Ghost: 1 },
  Q0_C: { Archivist: 2, Forwarder: 1 },
  Q0_D: { Collector: 2, Archivist: 1 },
  Q1_A: { Prophet: 2, Archivist: 1 },
  Q1_B: { Forwarder: 2, Collector: 1 },
  Q1_C: { Archivist: 2, Prophet: 1 },
  Q1_D: { Collector: 2, Forwarder: 1 },
  Q2_A: { Ghost: 2, Prophet: 1 },
  Q2_B: { Forwarder: 2, Collector: 1 },
  Q2_C: { Archivist: 2, Ghost: 1 },
  Q2_D: { Collector: 2, Prophet: 1 },
};

const RESULTS: Record<
  string,
  { title: string; tagline: string; description: string; icon: string }
> = {
  Forwarder: {
    title: "The Forwarder",
    tagline: "Information wants to be free.",
    description:
      "You believe everything is worth sharing. A document lands in your hands and within minutes it's in five different group chats. You're not malicious — you're just efficient.",
    icon: "\u2197",
  },
  Archivist: {
    title: "The Telegram Archivist",
    tagline: "If it's not in the cloud, it doesn't exist.",
    description:
      "You run a private archive of everyone else's documents. Your Telegram channels have more PDFs than the Library of Alexandria. You're not hoarding — you're preserving.",
    icon: "\u2630",
  },
  Collector: {
    title: "The Screenshot Collector",
    tagline: "Capture. Everything.",
    description:
      "Your camera roll is a museum of other people's private moments. Screenshots, screen recordings, photos of screens — if it appears on a display, you own a copy of it.",
    icon: "\u2317",
  },
  Ghost: {
    title: "The Ghost Contributor",
    tagline: "No trace. No credit. No problem.",
    description:
      "You share without a name. Documents appear in the wild with no origin, no watermark, no accountability. You are the invisible hand of information spread.",
    icon: "\u2298",
  },
  Prophet: {
    title: "The Guess Paper Prophet",
    tagline: "You saw it coming.",
    description:
      "You have a sixth sense for leaks. Before a document drops, you already know what's in it. You don't just share — you anticipate. Your friends think you're psychic.",
    icon: "\u2318",
  },
};

function computeResult(answers: Answer[]): string {
  const scores: Record<string, number> = {
    Forwarder: 0,
    Archivist: 0,
    Collector: 0,
    Ghost: 0,
    Prophet: 0,
  };

  answers.forEach((answer, i) => {
    if (!answer) return;
    const weights = WEIGHTS[`Q${i}_${answer}`];
    if (weights) {
      Object.entries(weights).forEach(([personality, pts]) => {
        scores[personality] += pts;
      });
    }
  });

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

export function SuspectQuiz() {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([null, null, null]);
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);
  const result = computeResult(answers);
  const resultData = RESULTS[result];

  const handleAnswer = (label: Answer) => {
    const next = [...answers];
    next[currentQ] = label;
    setAnswers(next);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
    }
  };

  const handleShare = () => {
    const text = [
      `I got "${resultData.title}" on NO SUS.`,
      resultData.tagline,
      "",
      "Take the quiz:",
    ].join("\n");

    if (navigator.share) {
      navigator.share({ title: resultData.title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  };

  if (!started) {
    return (
      <section className="w-full bg-black px-6 py-32 md:py-48">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase mb-8 text-zinc-500">
            Which Suspect Are You?
          </p>
          <p className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
            Three questions to find out which data leaker lives inside you.
          </p>
          <p className="text-zinc-600 text-sm font-mono mb-12">
            Answer honestly. We&rsquo;re all watching.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="inline-block px-10 py-4 border border-white text-white text-sm font-mono tracking-widest hover:bg-white hover:text-black transition-all duration-200 uppercase"
          >
            Begin Quiz
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-black px-6 py-32 md:py-48">
      <div className="max-w-xl mx-auto">
        {!finished ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-zinc-600 tracking-wider">
                  Question {currentQ + 1} / {QUESTIONS.length}
                </span>
                <span className="text-xs font-mono text-zinc-700">
                  {QUESTIONS.length - currentQ - 1} remaining
                </span>
              </div>

              <div className="w-full h-px bg-zinc-800 mb-8" />

              <p className="text-xl md:text-2xl font-bold text-white mb-10 leading-snug">
                {QUESTIONS[currentQ].question}
              </p>

              <div className="space-y-3">
                {QUESTIONS[currentQ].answers.map((ans) => (
                  <button
                    key={ans.label}
                    onClick={() => handleAnswer(ans.label as Answer)}
                    className="w-full text-left px-5 py-4 border border-zinc-800 text-zinc-400 hover:border-white hover:text-white transition-all duration-200 flex items-center gap-4 group"
                  >
                    <span className="text-xs font-mono text-zinc-600 group-hover:text-white w-5 flex-shrink-0">
                      {ans.label}
                    </span>
                    <span className="text-sm md:text-base leading-relaxed">
                      {ans.text}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <span className="text-5xl block mb-6">{resultData.icon}</span>

              <p className="text-xs font-mono tracking-[0.2em] text-zinc-600 uppercase mb-4">
                You are
              </p>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {resultData.title}
              </h3>

              <p className="text-sm font-mono text-zinc-500 mb-8 italic">
                &ldquo;{resultData.tagline}&rdquo;
              </p>

              <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed mb-10">
                {resultData.description}
              </p>

              <div className="w-px h-6 bg-zinc-800 mx-auto mb-8" />

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleShare}
                  className="px-8 py-3 border border-white text-white text-xs font-mono tracking-widest hover:bg-white hover:text-black transition-all duration-200 uppercase"
                >
                  Share Result
                </button>
                <button
                  onClick={() => {
                    setStarted(true);
                    setCurrentQ(0);
                    setAnswers([null, null, null]);
                    setFinished(false);
                    setCopied(false);
                  }}
                  className="px-8 py-3 border border-zinc-800 text-zinc-500 text-xs font-mono tracking-widest hover:border-zinc-500 transition-all duration-200 uppercase"
                >
                  Retake
                </button>
              </div>

              {copied && (
                <p className="text-xs text-zinc-600 font-mono mt-4">
                  Copied to clipboard
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
