"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type AnimatedHeadingProps = {
  children: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
  }),
};

export function AnimatedHeading({
  children,
  as: Tag = "h2",
  className = "",
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  const letters = children.split("");

  return (
    <Tag ref={ref} className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </Tag>
  );
}
