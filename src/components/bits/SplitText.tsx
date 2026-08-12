"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/components/bits/usePrefersReducedMotion";

export function SplitText({
  text,
  className = "",
  delay = 0.045,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "p";
}) {
  const reduced = usePrefersReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[Tag];

  if (reduced) {
    const Static = Tag;
    return <Static className={className}>{text}</Static>;
  }

  return (
    <MotionTag className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom pr-[0.28em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: i * delay, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
