"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Cyberpunk particles component
function CyberGridParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate particles client-side to avoid hydration mismatches
    const items = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-[radial-gradient(ellipse_at_center,rgba(16,16,24,0.3),#000000)]">
      {/* Cyber Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] z-10" />

      {/* Floating Encrypted Particle Elements */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-white/20 rounded-sm font-mono text-[8px] text-white/10"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: ["0vh", "-100vh"],
            opacity: [0, 0.4, 0.4, 0],
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

// Matrix Data Streams component
function MatrixStreams() {
  const [streams, setStreams] = useState<{ id: number; left: number; text: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const chars = "01SECUREPRIVACYTRUSTSHIELDENCLAVENOSUS01";
    const items = Array.from({ length: 15 }, (_, i) => {
      const length = Math.floor(Math.random() * 10) + 8;
      let text = "";
      for (let j = 0; j < length; j++) {
        text += chars[Math.floor(Math.random() * chars.length)];
      }
      return {
        id: i,
        left: Math.random() * 100,
        text,
        delay: Math.random() * 8,
        duration: Math.random() * 12 + 8,
      };
    });
    setStreams(items);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-15">
      {streams.map((s) => (
        <motion.div
          key={s.id}
          className="absolute text-white font-mono text-[9px] tracking-widest writing-mode-vertical select-none"
          style={{
            left: `${s.left}%`,
            top: "-20%",
            writingMode: "vertical-rl",
          }}
          animate={{
            y: ["0vh", "120vh"],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {s.text.split("").map((char, index) => (
            <span key={index} className={index === s.text.length - 1 ? "text-white font-bold brightness-125" : "text-white/40"}>
              {char}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

export default function AlphaTestersPage() {
  // Vault Access State
  const [accessGranted, setAccessGranted] = useState(false);
  const [decryptionProgress, setDecryptionProgress] = useState(0);
  const [decryptionStage, setDecryptionStage] = useState(0);
  
  // Feedback Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSuggestion, setFormSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // Dynamic API Counts & Contributors
  const [supportersJoined, setSupportersJoined] = useState(10);
  const [contributors, setContributors] = useState<string[]>([
    "🛡️ Aditi S.",
    "🛡️ Aditya J.",
    "🛡️ Anuj J.",
    "🛡️ Binay N.",
    "🛡️ Hari S.",
    "🛡️ Krutika M.",
    "🛡️ Ramya K.",
    "🛡️ Suyash S.",
    "🛡️ Vinit",
    "🛡️ Yuvraj S."
  ]);

  // Handle Decryption Sequence
  useEffect(() => {
    if (accessGranted) return;

    const interval = setInterval(() => {
      setDecryptionProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 12) + 4;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [accessGranted]);

  useEffect(() => {
    if (decryptionProgress < 25) setDecryptionStage(0);
    else if (decryptionProgress < 50) setDecryptionStage(1);
    else if (decryptionProgress < 75) setDecryptionStage(2);
    else if (decryptionProgress < 100) setDecryptionStage(3);
    else setDecryptionStage(4);
  }, [decryptionProgress]);

  // Fetch Live Contributor Wall data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/alpha-feedback");
        if (res.ok) {
          const data = await res.json();
          if (data.count) {
            setSupportersJoined(data.count);
          }
          if (data.contributors && data.contributors.length > 0) {
            const founding = [
              "🛡️ Aditi S.",
              "🛡️ Aditya J.",
              "🛡️ Anuj J.",
              "🛡️ Binay N.",
              "🛡️ Hari S.",
              "🛡️ Krutika M.",
              "🛡️ Ramya K.",
              "🛡️ Suyash S.",
              "🛡️ Vinit",
              "🛡️ Yuvraj S."
            ];
            const dbContributors = data.contributors.map((c: string) => c.startsWith("🛡️") ? c : `🛡️ ${c}`);
            const combined = [...dbContributors, ...founding];
            const unique = Array.from(new Set(combined));
            setContributors(unique);
          }
        }
      } catch (e) {
        console.error("Failed to load live counter stats", e);
      }
    };
    fetchStats();
  }, [submitResult]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formSuggestion.trim()) return;

    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/alpha-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formName,
          phone_number: formPhone,
          suggestion: formSuggestion,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitResult({
          success: true,
          message: "Feedback securely transmitted. Contribution logged successfully.",
        });
        // Clear fields
        setFormName("");
        setFormPhone("");
        setFormSuggestion("");
      } else {
        setSubmitResult({
          success: false,
          message: data.error || "Transmission interrupted. Please check security connection.",
        });
      }
    } catch (err) {
      setSubmitResult({
        success: false,
        message: "Failed to connect to secure servers. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const stages = [
    "[SYS]: CONNECTING TO SECURE ENCLAVE...",
    "[SYS]: RUNNING INTEGRITY DIAGNOSTICS...",
    "[SYS]: DECRYPTING PROGRAM FILES...",
    "[SYS]: VERIFYING SECURE STORAGE VAULT...",
    "[SYS]: READY FOR DECRYPTED ACCESS.",
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans flex flex-col justify-between overflow-x-hidden pt-20">
      <CyberGridParticles />
      <MatrixStreams />

      {/* Access/Decryption Gate */}
      <AnimatePresence>
        {!accessGranted && (
          <motion.div 
            key="decryption-gate"
            exit={{ 
              opacity: 0, 
              scale: 1.05,
              transition: { duration: 0.8, ease: "easeInOut" } 
            }}
            className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 border-4 border-zinc-900"
          >
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            <div className="w-full max-w-md border border-zinc-800 bg-zinc-950/80 p-8 rounded-lg relative overflow-hidden backdrop-blur-md shadow-2xl">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
                <div className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-[0.2em]">SECURITY VERIFICATION</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="text-sm font-bold tracking-tight uppercase">NO SUS ALPHA ACCESS INTERFACE</div>
                <div className="h-6 font-mono text-[10px] text-zinc-400 truncate">
                  {stages[decryptionStage]}
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-2 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${decryptionProgress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>SECURE CHANNEL STATUS: ENGAGED</span>
                  <span>{decryptionProgress}%</span>
                </div>
              </div>

              <button
                disabled={decryptionProgress < 100}
                onClick={() => setAccessGranted(true)}
                className={`w-full py-4 text-xs font-mono font-bold uppercase tracking-[0.25em] rounded-sm transition-all duration-300 relative border ${
                  decryptionProgress === 100
                    ? "bg-white text-black border-white hover:bg-zinc-200 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    : "bg-transparent text-zinc-600 border-zinc-850 cursor-not-allowed"
                }`}
              >
                {decryptionProgress === 100 ? "[ ENTER VAULT ]" : "[ ENCRYPTED ]"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Content */}
      <AnimatePresence>
        {accessGranted && (
          <motion.main
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 max-w-6xl mx-auto px-6 w-full z-10"
          >
            {/* HERO SECTION */}
            <section className="py-16 md:py-24 text-center relative overflow-hidden flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="mb-6 relative"
              >
                {/* Cybersecurity Ring Shield SVG */}
                <svg className="w-32 h-32 text-white animate-spin opacity-20" style={{ animationDuration: "12s" }} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="10 5" />
                  <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="3 3" />
                </svg>
                {/* Nested Shield Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
              </motion.div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-white mb-4">
                Welcome to the <span className="font-mono text-zinc-400">NO SUS</span> Alpha
              </h1>
              <p className="text-sm md:text-base font-mono tracking-widest text-zinc-500 uppercase max-w-2xl mb-8">
                [ ACCESS GRANTED: ENCLAVE BETA STAGE-1 ]
              </p>
              <div className="w-16 h-0.5 bg-white/20 mb-8" />
            </section>

            {/* ALPHA MESSAGE & COUNTER */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {/* Alpha Message Card */}
              <div className="md:col-span-2 border border-zinc-800 bg-zinc-950/70 p-6 md:p-8 rounded-lg relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-600" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-600" />
                
                <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full inline-block animate-ping" />
                  ALPHA CONTRIBUTOR DIRECTIVE
                </h3>
                <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
                  <p>
                    You are helping build <strong className="text-white">NO SUS</strong> before public launch. Every suggestion, bug report, feature idea, and piece of feedback directly shapes the future of secure communication.
                  </p>
                  <p>
                    As NO SUS grows, contributors and early supporters will receive premium status, exclusive future rewards, and recognition as early pioneers.
                  </p>
                  <p className="text-zinc-500 text-xs font-mono">
                    All contributions are tied directly to your unique contributor record.
                  </p>
                </div>
              </div>

              {/* Supporter Counter Card */}
              <div className="border border-zinc-800 bg-zinc-950/70 p-6 md:p-8 rounded-lg flex flex-col justify-between items-center text-center relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-600" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-600" />
                
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-4">LIVE ENLISTMENT BOARD</span>
                
                <div className="my-auto">
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="text-6xl md:text-7xl font-black text-white tabular-nums tracking-tighter"
                  >
                    {supportersJoined}+
                  </motion.div>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mt-2">EARLY SUPPORTERS JOINED</span>
                </div>

                <div className="mt-4 w-full bg-zinc-900/50 p-2 rounded-sm border border-zinc-850">
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">ACTIVE ACCESS TOKENS</span>
                </div>
              </div>
            </section>

            {/* FEEDBACK SUBMISSION SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-20">
              {/* Glassmorphism Form Card */}
              <div className="lg:col-span-2 border border-white/10 bg-zinc-950/50 p-6 md:p-8 rounded-xl shadow-2xl relative overflow-hidden backdrop-blur-md">
                {/* Glow border line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">Secure Submission Portal</h2>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-6">TRANSMISSION ENCRYPTED VIA POSTGREST</p>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Phone Number</label>
                      <input 
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full bg-black/60 border border-zinc-850 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
                      <input 
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-black/60 border border-zinc-850 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Suggestion Box</label>
                    <textarea 
                      required
                      rows={5}
                      value={formSuggestion}
                      onChange={(e) => setFormSuggestion(e.target.value)}
                      placeholder="Tell us:&#10;• Bugs you found&#10;• Features you want&#10;• Things you dislike&#10;• Ideas that could make NO SUS better"
                      className="w-full bg-black/60 border border-zinc-850 rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-white transition-all font-mono leading-relaxed"
                    />
                  </div>

                  <p className="text-[10px] font-mono text-zinc-500 leading-normal">
                    We collect this information so we can properly track contributions and reward early supporters in the future.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full md:w-auto px-10 py-4 bg-white text-black hover:bg-zinc-300 font-bold uppercase tracking-[0.2em] text-xs cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 relative rounded-sm shadow-[4px_4px_0_rgba(255,255,255,0.2)] disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        SECURELY TRANSMITTING...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </button>
                </form>

                {/* Submit Feedback Notification Banner */}
                <AnimatePresence>
                  {submitResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mt-6 p-4 rounded-sm border font-mono text-xs ${
                        submitResult.success 
                          ? "bg-zinc-950/90 border-white/20 text-white" 
                          : "bg-red-950/20 border-red-900/50 text-red-400"
                      }`}
                    >
                      <div className="flex gap-2.5 items-start">
                        <span className="font-bold">{submitResult.success ? "[SUCCESS]" : "[ERROR]"}</span>
                        <span>{submitResult.message}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* APK DOWNLOAD SECTION */}
              <div className="border border-zinc-800 bg-zinc-950/70 p-6 md:p-8 rounded-xl relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-zinc-700" />
                
                <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-6 pb-2 border-b border-zinc-800 flex items-center justify-between">
                  <span>ALPHA INSTALLER</span>
                  <span className="px-2 py-0.5 bg-zinc-900 text-zinc-400 text-[8px] rounded border border-zinc-800 animate-pulse">ACTIVE</span>
                </h3>

                <div className="flex flex-col items-center text-center mb-8">
                  {/* Android Icon SVG */}
                  <div className="w-16 h-16 bg-zinc-900/80 border border-zinc-800 rounded-full flex items-center justify-center mb-4 relative shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.523 15.3414C17.523 15.7607 17.1837 16.1 16.7644 16.1C16.345 16.1 16.0058 15.7607 16.0058 15.3414C16.0058 14.922 16.345 14.5827 16.7644 14.5827C17.1837 14.5827 17.523 14.922 17.523 15.3414ZM7.99424 15.3414C7.99424 15.7607 7.65497 16.1 7.23563 16.1C6.81628 16.1 6.47701 15.7607 6.47701 15.3414C6.47701 14.922 6.81628 14.5827 7.23563 14.5827C7.65497 14.5827 7.99424 14.922 7.99424 15.3414ZM17.9174 11.2335L19.8247 7.92988C19.9579 7.69919 19.8789 7.40428 19.6482 7.27106C19.4175 7.13783 19.1226 7.21685 18.9894 7.44754L17.0601 10.7891C15.6171 10.1345 13.9142 9.77013 12 9.77013C10.0858 9.77013 8.38287 10.1345 6.93992 10.7891L5.01062 7.44754C4.87739 7.21685 4.58248 7.13783 4.35179 7.27106C4.1211 7.40428 4.04208 7.69919 4.17531 7.92988L6.08258 11.2335C2.69766 13.1492 0.380481 16.6433 0 20.8122H24C23.6195 16.6433 21.3023 13.1492 17.9174 11.2335Z" />
                    </svg>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1">Try the Latest Alpha Build</h4>
                  <p className="text-zinc-500 font-mono text-[10px] uppercase">File: app-release.apk</p>
                </div>

                <div className="space-y-3 font-mono text-[10px] text-zinc-400 mb-6 bg-black/40 p-4 rounded border border-zinc-850">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">VERSION:</span>
                    <span>v0.1.0-alpha.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">SIZE:</span>
                    <span>35.3 MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">SHA-256:</span>
                    <span className="text-zinc-500 truncate w-32 text-right hover:text-white transition-colors" title="4a2d8e96bf0f055627db83fe135e679b">4a2d8e...fe135e</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">PLATFORM:</span>
                    <span>Android 8.0+</span>
                  </div>
                </div>

                <a
                  href="/apk/app-release.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 text-xs font-mono font-bold uppercase tracking-[0.2em] rounded-sm bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download Alpha APK
                </a>
              </div>
            </section>

            {/* CONTRIBUTION WALL */}
            <section className="mb-20">
              <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-[0.25em] text-center mb-6">
                Founding Alpha Testers
              </h3>
              
              {/* Scrolling Contributor Wall */}
              <div className="w-full overflow-hidden border border-zinc-800 bg-zinc-950/40 py-6 rounded-lg relative">
                <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

                <div className="flex gap-16 animate-marquee-scroll whitespace-nowrap overflow-x-auto scrollbar-none px-8 py-2">
                  {contributors.map((name, i) => (
                    <div key={i} className="flex items-center gap-3 inline-block shrink-0">
                      <div className="w-2 h-2 bg-white rotate-45 opacity-50" />
                      <span className="font-mono text-sm tracking-widest text-zinc-300 font-medium">
                        {name}
                      </span>
                    </div>
                  ))}
                  {/* Triple the list to ensure infinite marquee coverage */}
                  {contributors.map((name, i) => (
                    <div key={`dup-${i}`} className="flex items-center gap-3 inline-block shrink-0">
                      <div className="w-2 h-2 bg-white rotate-45 opacity-50" />
                      <span className="font-mono text-sm tracking-widest text-zinc-300 font-medium">
                        {name}
                      </span>
                    </div>
                  ))}
                  {contributors.map((name, i) => (
                    <div key={`dup2-${i}`} className="flex items-center gap-3 inline-block shrink-0">
                      <div className="w-2 h-2 bg-white rotate-45 opacity-50" />
                      <span className="font-mono text-sm tracking-widest text-zinc-300 font-medium">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FUTURE REWARDS SECTION */}
            <section className="mb-24">
              <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-[0.25em] text-center mb-12">
                FUTURE CONTRIBUTOR REWARDS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Reward 1 */}
                <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-lg text-center relative hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300">
                  <div className="w-10 h-10 border border-zinc-800 rounded-sm flex items-center justify-center mx-auto mb-4 text-zinc-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-2 uppercase tracking-wide">Lifetime Alpha Badge</h4>
                  <p className="text-zinc-500 text-xs font-mono leading-normal">
                    Permanent visual indicator on your account showing you shaped the product first.
                  </p>
                </div>

                {/* Reward 2 */}
                <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-lg text-center relative hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300">
                  <div className="w-10 h-10 border border-zinc-800 rounded-sm flex items-center justify-center mx-auto mb-4 text-zinc-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-2 uppercase tracking-wide">Premium Access</h4>
                  <p className="text-zinc-500 text-xs font-mono leading-normal">
                    Free access to paid/advanced features once the public network launches.
                  </p>
                </div>

                {/* Reward 3 */}
                <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-lg text-center relative hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300">
                  <div className="w-10 h-10 border border-zinc-800 rounded-sm flex items-center justify-center mx-auto mb-4 text-zinc-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-2 uppercase tracking-wide">Early Feature Access</h4>
                  <p className="text-zinc-500 text-xs font-mono leading-normal">
                    Test next-gen enclave features before they go to staging or Play Store.
                  </p>
                </div>

                {/* Reward 4 */}
                <div className="border border-zinc-900 bg-zinc-950/40 p-6 rounded-lg text-center relative hover:border-zinc-800 hover:bg-zinc-950/60 transition-all duration-300">
                  <div className="w-10 h-10 border border-zinc-800 rounded-sm flex items-center justify-center mx-auto mb-4 text-zinc-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-sm text-white mb-2 uppercase tracking-wide">Contributor Recognition</h4>
                  <p className="text-zinc-500 text-xs font-mono leading-normal">
                    Option to be listed inside the public NO SUS mobile application Credits wall.
                  </p>
                </div>
              </div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="py-8 border-t border-zinc-900 bg-black/40 backdrop-blur-sm z-10 w-full">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-650 font-mono text-[10px] uppercase">
          <span>NO SUS &copy; {new Date().getFullYear()} — SECURE SYSTEM SHIELD</span>
          <span>STATION PROTOCOL: ACTIVE-07</span>
        </div>
      </footer>
    </div>
  );
}
