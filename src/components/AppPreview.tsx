"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const STORY_STAGES = [
  { id: 1, title: "COMMUNITIES", desc: "Isolate your groups securely.", img: "/app-screens/1.png" },
  { id: 2, title: "CREATE GROUP", desc: "Build encrypted enclaves.", img: "/app-screens/2.png" },
  { id: 3, title: "UPLOAD", desc: "Share without losing control.", img: "/app-screens/3.png" },
  { id: 4, title: "SECURE VIEWER", desc: "Evaporates when they look away.", img: "/app-screens/4.png" },
  { id: 5, title: "AUDIT LOGS", desc: "Track every single interaction.", img: "/app-screens/5.png" },
  { id: 6, title: "PROFILE", desc: "Total command of your identity.", img: "/app-screens/6.png" },
];

// Remaining screenshots for the constellation gallery
const GALLERY_IMAGES = Array.from({ length: 13 }, (_, i) => `/app-screens/${i + 7}.png`);

export default function AppPreview() {
  const narrativeRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress: narrativeProgress } = useScroll({
    target: narrativeRef,
    offset: ["start start", "end end"]
  });

  // 1. Scroll-driven Phone Story Sequence
  return (
    <section className="w-full bg-black relative">
      {/* ── Sticky Narrative Section (600vh for scroll duration) ── */}
      <div ref={narrativeRef} className="h-[600vh] relative w-full border-t border-zinc-900">
        
        {/* Sticky viewport container */}
        <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center overflow-hidden px-6 lg:px-24">
          
          {/* Background subtle radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-[500px] h-[500px] bg-zinc-900 rounded-full blur-[120px]" />
          </div>

          {/* Left: Dynamic Text */}
          <div className="relative z-20 w-full md:w-1/2 flex items-center justify-center md:justify-start h-32 md:h-auto mb-8 md:mb-0">
            {STORY_STAGES.map((stage, idx) => {
              const start = idx / STORY_STAGES.length;
              const peak = (idx + 0.5) / STORY_STAGES.length;
              const end = (idx + 1) / STORY_STAGES.length;
              
              // Fade in slightly before peak, fade out slightly after peak
              const opacity = useTransform(
                narrativeProgress,
                [start, start + 0.05, peak, end - 0.05, end],
                [0, 1, 1, 0, 0]
              );
              
              const y = useTransform(
                narrativeProgress,
                [start, peak, end],
                [30, 0, -30]
              );
              
              const filterBlur = useTransform(
                narrativeProgress,
                [start, start + 0.05, peak, end - 0.05, end],
                ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)", "blur(10px)"]
              );

              return (
                <motion.div
                  key={stage.id}
                  className="absolute w-full text-center md:text-left pointer-events-none"
                  style={{ opacity, y, filter: filterBlur }}
                >
                  <p className="text-zinc-500 font-mono text-sm tracking-[0.3em] uppercase mb-4">
                    Phase 0{idx + 1}
                  </p>
                  <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-3 leading-none">
                    {stage.title}
                  </h3>
                  <p className="text-zinc-400 font-mono text-sm md:text-base">
                    {stage.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Phone Mockup */}
          <div className="relative w-full md:w-1/2 flex items-center justify-center z-10 perspective-1000">
            {/* The Phone Hardware Frame */}
            <motion.div 
              className="relative w-[280px] sm:w-[320px] aspect-[9/19.5] rounded-[2.5rem] md:rounded-[3rem] border-[6px] md:border-[8px] border-zinc-900 bg-black shadow-2xl overflow-hidden"
              style={{
                // Slight 3D rotation effect tied to scroll
                rotateX: useTransform(narrativeProgress, [0, 0.5, 1], [5, 0, -5]),
                rotateY: useTransform(narrativeProgress, [0, 0.5, 1], [-5, 0, 5]),
              }}
            >
              {/* Dynamic Screen Images */}
              {STORY_STAGES.map((stage, idx) => {
                const start = Math.max(0, (idx - 0.2) / STORY_STAGES.length);
                const peak = idx / STORY_STAGES.length;
                const end = (idx + 1) / STORY_STAGES.length;

                // For the first image, ensure it starts fully visible
                const inputRange = idx === 0 
                  ? [0, end - 0.05, end]
                  : [start, peak, end - 0.05, end];
                const opacityRange = idx === 0
                  ? [1, 1, 0]
                  : [0, 1, 1, 0];

                const scaleRange = idx === 0
                  ? [1, 1, 1.05]
                  : [0.95, 1, 1, 1.05];

                const opacity = useTransform(narrativeProgress, inputRange, opacityRange);
                const scale = useTransform(narrativeProgress, inputRange, scaleRange);

                return (
                  <motion.div
                    key={stage.id}
                    className="absolute inset-0 origin-center"
                    style={{ opacity, scale }}
                  >
                    <Image
                      src={stage.img}
                      alt={stage.title}
                      fill
                      sizes="(max-width: 768px) 280px, 320px"
                      priority={idx < 2}
                      className="object-cover"
                      unoptimized
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Floating Constellation Gallery ── */}
      <ConstellationGallery />
      
    </section>
  );
}

// Separate component for the gallery to manage its own scroll ref
function ConstellationGallery() {
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });

  // Helper to generate varied positions and speeds
  // We hardcode an array of layout properties for 13 images so it's stable on render
  const LAYOUTS = [
    { top: "10%", left: "5%", width: "clamp(120px, 20vw, 200px)", speed: 1.5, z: 10 },
    { top: "25%", left: "70%", width: "clamp(110px, 18vw, 180px)", speed: 0.8, z: 5 },
    { top: "40%", left: "15%", width: "clamp(140px, 24vw, 240px)", speed: 1.2, z: 20 },
    { top: "15%", left: "45%", width: "clamp(100px, 16vw, 160px)", speed: 0.6, z: 2 },
    { top: "50%", left: "65%", width: "clamp(130px, 22vw, 220px)", speed: 1.8, z: 25 },
    { top: "65%", left: "5%", width: "clamp(90px, 15vw, 150px)", speed: 0.9, z: 15 },
    { top: "80%", left: "75%", width: "clamp(150px, 26vw, 260px)", speed: 1.4, z: 30 },
    { top: "75%", left: "30%", width: "clamp(110px, 19vw, 190px)", speed: 0.7, z: 8 },
    { top: "90%", left: "15%", width: "clamp(100px, 17vw, 170px)", speed: 1.1, z: 12 },
    { top: "35%", left: "35%", width: "clamp(160px, 28vw, 280px)", speed: 1.6, z: 40 }, // Center-ish big
    { top: "55%", left: "85%", width: "clamp(80px, 14vw, 140px)", speed: 0.5, z: 4 },
    { top: "5%", left: "75%", width: "clamp(120px, 21vw, 210px)", speed: 1.3, z: 18 },
    { top: "95%", left: "55%", width: "clamp(130px, 23vw, 230px)", speed: 1.7, z: 35 },
  ];

  return (
    <div ref={galleryRef} className="relative w-full h-[200vh] bg-black overflow-hidden py-32 border-t border-zinc-900 mt-24">
      
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black opacity-60" />

      <div className="relative z-20 text-center mb-32 pt-24 px-6 pointer-events-none">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
          THE FULL ARSENAL
        </h2>
        <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
          Explore the Ecosystem
        </p>
      </div>

      <div className="absolute inset-0 top-64 pointer-events-auto">
        {GALLERY_IMAGES.map((src, i) => {
          const layout = LAYOUTS[i];
          if (!layout) return null;

          // Parallax calculation
          const y = useTransform(scrollYProgress, [0, 1], [0, -400 * layout.speed]);

          return (
            <motion.div
              key={src}
              className="absolute group rounded-[1.5rem] md:rounded-[2rem] border-[4px] border-zinc-900 bg-black overflow-hidden shadow-2xl transition-all duration-500 cursor-crosshair"
              style={{
                top: layout.top,
                left: layout.left,
                width: layout.width,
                aspectRatio: "9/19",
                zIndex: layout.z,
                y,
              }}
              whileHover={{ 
                scale: 1.15, 
                zIndex: 50,
                borderColor: "#ffffff",
                boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.15)"
              }}
            >
              <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                <Image
                  src={src}
                  alt={`Screenshot ${i + 7}`}
                  fill
                  sizes="(max-width: 768px) 30vw, 200px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      
    </div>
  );
}
