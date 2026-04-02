"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
  distance?: number;
  stagger?: boolean;
}

function getInitialOffset(
  direction: Direction,
  distance: number
): { x: number; y: number } {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
  }
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 40,
  stagger = false,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const offset = getInitialOffset(direction, distance);

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
        className={className}
      >
        {React.Children.map(children, (child, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, x: offset.x, y: offset.y },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  delay: delay / 1000,
                },
              },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: offset.x, y: offset.y }
      }
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 20,
        delay: delay / 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
