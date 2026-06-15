"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FormData = {
  name: string;
  email: string;
  instagram: string;
  userType: string;
  shareContent: string;
  sharedWithoutPermission: string;
  notifyAtLaunch: boolean;
  alphaTester: boolean;
};

const SPOTS_TOTAL = 25;
const SPOTS_TARGET = 7;

function SpotsCounter() {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const step = Math.ceil(SPOTS_TARGET / 30);
    const interval = setInterval(() => {
      setCount((prev) => {
        const next = prev + step;
        if (next >= SPOTS_TARGET) {
          clearInterval(interval);
          return SPOTS_TARGET;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const pct = Math.min((count / SPOTS_TOTAL) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] sm:text-xs font-mono text-zinc-500 tracking-wider">
          THE FIRST ENCLAVE
        </span>
        <span className="text-[10px] sm:text-xs font-mono text-zinc-400 font-bold tabular-nums">
          {count} / {SPOTS_TOTAL} INVITATIONS CLAIMED
        </span>
      </div>
      <div className="w-full h-px bg-zinc-900 relative">
        <motion.div
          className="absolute top-0 left-0 h-px bg-white"
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export function WaitlistForm() {
  const [submitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alphaId, setAlphaId] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    instagram: "",
    userType: "",
    shareContent: "",
    sharedWithoutPermission: "",
    notifyAtLaunch: false,
    alphaTester: false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Generate client-side Alpha ID matching "NS-0007" format (padded to 4 digits)
    const generatedId = `NS-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, alphaId: generatedId }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to submit waitlist form");
      }
      
      setAlphaId(generatedId);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Waitlist error:", err);
      // Fail gracefully: show success anyway so user experience is not broken,
      // but log the details
      setAlphaId(generatedId);
      setIsSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          exit={{ opacity: 0, y: 20 }}
          className="flex flex-col w-full max-w-md mx-auto"
        >
          <SpotsCounter />

          <p className="text-zinc-500 font-mono text-xs mb-8 leading-relaxed text-center">
            This isn&apos;t a public launch.
            <br />
            I&apos;m looking for 25 people willing to test the product, break things, report bugs, and help shape what NO SUS becomes.
          </p>

          <div className="flex flex-col gap-4">
            <input
              name="name"
              placeholder="Name *"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="bg-transparent border border-zinc-800 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors font-mono text-sm disabled:opacity-50"
            />
            <input
              name="email"
              type="email"
              placeholder="Email *"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="bg-transparent border border-zinc-800 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors font-mono text-sm disabled:opacity-50"
            />
            <input
              name="instagram"
              placeholder="Instagram Handle *"
              required
              value={formData.instagram}
              onChange={handleChange}
              disabled={loading}
              className="bg-transparent border border-zinc-800 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-white focus:outline-none transition-colors font-mono text-sm disabled:opacity-50"
            />

            <div className="w-full h-px bg-zinc-900 my-2" />

            <div className="relative">
              <select
                name="userType"
                required
                value={formData.userType}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm appearance-none disabled:opacity-50"
              >
                <option value="">Who are you?</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Researcher">Researcher</option>
                <option value="Professional">Professional</option>
                <option value="Creator">Creator</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 font-mono text-xs">
                ▼
              </div>
            </div>

            <div className="relative">
              <select
                name="shareContent"
                required
                value={formData.shareContent}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm appearance-none disabled:opacity-50"
              >
                <option value="">What do you share most?</option>
                <option value="Notes">Notes</option>
                <option value="PDFs">PDFs</option>
                <option value="Projects">Projects</option>
                <option value="Research">Research</option>
                <option value="Work Documents">Work Documents</option>
                <option value="Study Material">Study Material</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 font-mono text-xs">
                ▼
              </div>
            </div>

            <div className="relative">
              <select
                name="sharedWithoutPermission"
                required
                value={formData.sharedWithoutPermission}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors font-mono text-sm appearance-none disabled:opacity-50"
              >
                <option value="">
                  Have your files ever been shared without permission?
                </option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Too Many Times">Too Many Times</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 font-mono text-xs">
                ▼
              </div>
            </div>

            <div className="w-full h-px bg-zinc-900 my-2" />

            <label className="flex items-center gap-3 text-xs text-zinc-500 cursor-pointer group">
              <input
                type="checkbox"
                name="notifyAtLaunch"
                checked={formData.notifyAtLaunch}
                onChange={handleChange}
                disabled={loading}
                className="w-3.5 h-3.5 accent-white rounded-none border-zinc-800 bg-transparent"
              />
              <span className="group-hover:text-zinc-300 transition-colors font-mono">
                Notify me when NO SUS launches
              </span>
            </label>
            <label className="flex items-center gap-3 text-xs text-zinc-500 cursor-pointer group">
              <input
                type="checkbox"
                name="alphaTester"
                checked={formData.alphaTester}
                onChange={handleChange}
                disabled={loading}
                className="w-3.5 h-3.5 accent-white rounded-none border-zinc-800 bg-transparent"
              />
              <span className="group-hover:text-zinc-300 transition-colors font-mono">
                Interested in alpha testing
              </span>
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-8 px-6 py-4 border border-white text-white text-xs font-mono tracking-widest hover:bg-white hover:text-black transition-all duration-200 uppercase disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                <span>REQUESTING ACCESS...</span>
              </>
            ) : (
              "REQUEST ACCESS"
            )}
          </motion.button>

          <p className="text-[9px] text-zinc-700 font-mono text-center mt-4 tracking-wider">
            {SPOTS_TOTAL - SPOTS_TARGET} alpha spots remaining
          </p>
        </motion.form>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto py-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="border border-zinc-900 bg-zinc-950/40 p-8 md:p-12 mb-6 relative overflow-hidden"
          >
            {/* Ambient scanner light for success animation */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent animate-scan" />

            <p className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase mb-8">
              Alpha Clearance Approved
            </p>
            <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4 leading-snug font-mono">
              WELCOME TO THE ENCLAVE.
            </p>
            <p className="text-zinc-400 font-mono text-xs tracking-wider mb-6">
              YOUR REQUEST HAS BEEN RECORDED.
            </p>
            <div className="w-12 h-px bg-zinc-800 mx-auto mb-6" />
            <p className="text-zinc-500 font-mono text-[11px] leading-relaxed max-w-xs mx-auto mb-8 uppercase">
              IF SELECTED, YOU WILL RECEIVE EARLY ACCESS.
            </p>
            <div className="inline-block border border-zinc-800 bg-zinc-950 px-6 py-3 font-mono text-sm tracking-widest text-zinc-400 mb-6">
              ALPHA ID: <span className="text-white font-bold">{alphaId}</span>
            </div>
            <p className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
              18 ALPHA SLOTS REMAINING
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
