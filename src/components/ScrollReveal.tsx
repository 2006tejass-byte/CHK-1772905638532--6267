import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ScrollRevealProps {
  text: string;
  className?: string;
}

export function ScrollReveal({ text, className = "" }: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.5"],
  });

  return (
    <div ref={containerRef} className={`relative ${className} text-justify`}>
      <div className="inline-block w-full">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
          
          return (
            <React.Fragment key={i}>
              <motion.span
                style={{ opacity }}
                className="text-white inline transition-colors"
              >
                {word}
              </motion.span>
              {i !== words.length - 1 && " "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
