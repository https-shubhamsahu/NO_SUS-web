"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

type PixelButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
  className?: string;
  type?: "button" | "submit";
};

export function PixelButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: PixelButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative px-8 py-4 text-sm font-bold uppercase tracking-[0.15em]
        transition-colors duration-200
        ${
          variant === "primary"
            ? "bg-white text-black hover:bg-zinc-300"
            : "border border-white text-white hover:bg-white hover:text-black"
        }
        ${className}
      `}
      style={{
        boxShadow: variant === "primary"
          ? "4px 4px 0 rgba(255,255,255,0.3)"
          : "none",
      }}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
