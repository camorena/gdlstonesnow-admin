"use client";

import { useRef, useEffect } from "react";
import {
  useInView,
  useMotionValue,
  useTransform,
  animate,
  motion,
} from "framer-motion";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function AnimatedCounter({
  end,
  suffix = "",
  duration = 2,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, end, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    });

    return () => controls.stop();
  }, [isInView, end, duration, motionValue]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const unsubscribe = rounded.on("change", (v) => {
      el.textContent = `${v.toLocaleString()}${suffix}`;
    });

    return () => unsubscribe();
  }, [rounded, suffix]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      0{suffix}
    </motion.span>
  );
}
