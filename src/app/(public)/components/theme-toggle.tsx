"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./theme-provider";

const themes = ["light", "dark", "system"] as const;

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
      {/* Twinkling stars */}
      <motion.circle
        cx="19"
        cy="5"
        r="0.8"
        fill="currentColor"
        stroke="none"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 2, delay: 0 }}
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
      <motion.circle
        cx="22"
        cy="9"
        r="0.6"
        fill="currentColor"
        stroke="none"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.15, 0.85] }}
        transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }}
      />
    </motion.svg>
  );
}

function MonitorIcon() {
  return (
    <motion.svg
      key="monitor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      initial={{ scale: 0, y: 5 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -5 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </motion.svg>
  );
}

const labels: Record<string, string> = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System",
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  function cycle() {
    const idx = themes.indexOf(theme);
    const next = themes[(idx + 1) % themes.length];
    setTheme(next);
  }

  return (
    <div className="relative">
      <button
        onClick={cycle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-200/60 dark:text-gray-200 dark:hover:bg-gray-700/60"
        aria-label={`Current theme: ${labels[theme]}. Click to switch.`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === "light" && <SunIcon />}
          {theme === "dark" && <MoonIcon />}
          {theme === "system" && <MonitorIcon />}
        </AnimatePresence>
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg dark:bg-gray-100 dark:text-gray-900"
          >
            {labels[theme]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
