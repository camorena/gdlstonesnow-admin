"use client";

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  backgroundImage?: string;
  size?: "full" | "large" | "medium";
  children?: ReactNode;
  overlay?: "dark" | "gradient" | "mesh";
}

/* ---------- Floating particle ---------- */
function Particle({ index, total }: { index: number; total: number }) {
  const size = useMemo(() => 2 + Math.random() * 4, []);
  const left = useMemo(() => (index / total) * 100 + Math.random() * (100 / total), [index, total]);
  const opacity = useMemo(() => 0.2 + Math.random() * 0.3, []);
  const duration = useMemo(() => 10 + Math.random() * 10, []);
  const delay = useMemo(() => Math.random() * duration, [duration]);

  return (
    <motion.div
      className="absolute rounded-full bg-[#8BB63A] pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        opacity,
      }}
      initial={{ y: "100vh" }}
      animate={{ y: "-10vh" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

/* ---------- Animated gradient blob ---------- */
function GradientBlob({
  className,
  duration,
  x1,
  y1,
  x2,
  y2,
}: {
  className?: string;
  duration: number;
  x1: string;
  y1: string;
  x2: string;
  y2: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className ?? ""}`}
      animate={{
        x: [x1, x2, x1],
        y: [y1, y2, y1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ---------- Word-stagger animation ---------- */
function AnimatedTitle({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <motion.h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 40, rotateX: 40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3 + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

/* ========== Main Hero Component ========== */
export default function Hero({
  title,
  subtitle,
  breadcrumbs,
  backgroundImage,
  size = "large",
  children,
  overlay = "dark",
}: HeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  /* Responsive check */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* Parallax */
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 800], [0, 200]);

  /* Mouse glow */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 30 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  /* Size classes */
  const sizeClass =
    size === "full"
      ? "min-h-screen"
      : size === "large"
        ? "min-h-[70vh]"
        : "py-32";

  const particleCount = isMobile ? 4 : 7;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative flex items-center justify-center overflow-hidden ${sizeClass}`}
    >
      {/* Layer 1 - Background image with parallax */}
      {backgroundImage && (
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover scale-110"
            priority
            sizes="100vw"
          />
        </motion.div>
      )}

      {/* Layer 2 - Dark overlay */}
      <div
        className={`absolute inset-0 ${
          overlay === "gradient"
            ? "bg-gradient-to-b from-black/80 via-black/60 to-black/40"
            : overlay === "mesh"
              ? "bg-gradient-to-br from-black/80 via-black/60 to-[#8BB63A]/20"
              : "bg-gradient-to-r from-[#1a1a1a]/90 via-[#1a1a1a]/80 to-[#1a1a1a]/70"
        }`}
      />

      {/* Layer 3 - Animated gradient mesh blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <GradientBlob
          className="h-[500px] w-[500px] bg-[#8BB63A]/[0.07] -left-40 -top-40"
          duration={18}
          x1="0px"
          y1="0px"
          x2="120px"
          y2="80px"
        />
        <GradientBlob
          className="h-[400px] w-[400px] bg-[#8BB63A]/[0.05] right-[-100px] bottom-[-100px]"
          duration={22}
          x1="0px"
          y1="0px"
          x2="-100px"
          y2="-60px"
        />
        <GradientBlob
          className="h-[300px] w-[300px] bg-[#1a1a1a]/[0.15] left-1/2 top-1/4"
          duration={15}
          x1="0px"
          y1="0px"
          x2="80px"
          y2="100px"
        />
      </div>

      {/* Layer 4 - Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: particleCount }).map((_, i) => (
          <Particle key={i} index={i} total={particleCount} />
        ))}
      </div>

      {/* Layer 5 - Mouse-responsive glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            [springX, springY],
            ([x, y]) =>
              `radial-gradient(600px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(139,182,58,0.08), transparent 60%)`,
          ),
        }}
      />

      {/* Layer 6 - Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`${size === "full" ? "text-center max-w-5xl mx-auto" : ""}`}>
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <motion.nav
              className="mb-6"
              aria-label="Breadcrumb"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <ol className="flex items-center gap-2 text-sm text-gray-400">
                {breadcrumbs.map((crumb, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="select-none">/</span>}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="transition-colors hover:text-[#8BB63A]"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-[#8BB63A]">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </motion.nav>
          )}

          {/* Title with word stagger */}
          <AnimatedTitle text={title} />

          {/* Animated green underline */}
          <motion.div
            className="mt-4 h-1 rounded-full bg-[#8BB63A]"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={size === "full" ? { marginInline: "auto" } : undefined}
          />

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              className={`mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl ${
                size === "full" ? "mx-auto" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {subtitle}
            </motion.p>
          )}

          {/* Children (CTA buttons etc) */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
