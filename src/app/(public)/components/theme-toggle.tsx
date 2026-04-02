"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";

function SunIcon() {
  return (
    <motion.svg
      key="sun"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      initial={{ rotate: -90, scale: 0 }}
      animate={{ rotate: 0, scale: 1 }}
      exit={{ rotate: 90, scale: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <circle cx="12" cy="12" r="5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 12 + 8 * Math.cos(rad);
        const y1 = 12 + 8 * Math.sin(rad);
        const x2 = 12 + 10 * Math.cos(rad);
        const y2 = 12 + 10 * Math.sin(rad);
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
          />
        );
      })}
    </motion.svg>
  );
}

function MoonIcon() {
  return (
    <motion.svg
      key="moon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      initial={{ rotate: 90, scale: 0 }}
      animate={{ rotate: 0, scale: 1 }}
      exit={{ rotate: -90, scale: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      <motion.circle
        cx="19"
        cy="5"
        r="0.8"
        fill="currentColor"
        stroke="none"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <motion.circle
        cx="16"
        cy="2.5"
        r="0.5"
        fill="currentColor"
        stroke="none"
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
      />
    </motion.svg>
  );
}

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  function toggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 dark:text-gray-200 dark:hover:bg-gray-700/60 [.header-scrolled_&]:text-gray-700 [.header-scrolled_&]:hover:bg-gray-200/60 [.header-scrolled_&]:dark:text-gray-200 [.header-scrolled_&]:dark:hover:bg-gray-700/60"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
      </AnimatePresence>
    </button>
  );
}
