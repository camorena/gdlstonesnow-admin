"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home", sectionId: "hero" },
  { href: "/services", label: "Services", sectionId: "services" },
  { href: "/gallery", label: "Gallery", sectionId: "gallery" },
  { href: "/promotions", label: "Promotions", sectionId: "promotions" },
  { href: "/contact", label: "Contact", sectionId: "contact" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [utilityVisible, setUtilityVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > 20);

    if (currentY > lastScrollY && currentY > 80) {
      setUtilityVisible(false);
    } else {
      setUtilityVisible(true);
    }

    setLastScrollY(currentY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[number]
  ) {
    if (isHome && link.sectionId) {
      const el = document.getElementById(link.sectionId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Utility bar */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: utilityVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#1a1a1a] text-white"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="tel:9528826182"
              className="flex items-center gap-1.5 transition-colors hover:text-[#8BB63A]"
            >
              <Phone className="h-3 w-3" />
              <span className="hidden sm:inline">(952) 882-6182</span>
            </a>
            <a
              href="mailto:info@gdlstonesnow.com"
              className="flex items-center gap-1.5 transition-colors hover:text-[#8BB63A]"
            >
              <Mail className="h-3 w-3" />
              <span className="hidden sm:inline">info@gdlstonesnow.com</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock className="h-3 w-3" />
            <span>Always Open</span>
          </div>
        </div>
      </motion.div>

      {/* Main header */}
      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
          utilityVisible ? "top-[33px]" : "top-0"
        } ${
          scrolled
            ? "bg-white/80 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="GDL Stone Snow LLC - Landscaping and Snow Removal Bloomington MN"
              width={160}
              height={50}
              className="h-10 w-auto sm:h-12"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`group relative px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-[#8BB63A]"
                      : scrolled
                        ? "text-gray-700 hover:text-[#8BB63A]"
                        : "text-white hover:text-[#8BB63A]"
                  }`}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#8BB63A] transition-all duration-300 ease-out ${
                      active
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="group relative hidden overflow-hidden rounded-lg bg-[#8BB63A] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#8BB63A]/25 md:inline-block"
          >
            <span className="relative z-10">Free Estimate</span>
            <span className="absolute inset-0 animate-pulse rounded-lg bg-white/10" />
          </Link>

          {/* Mobile hamburger — morphing icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`relative z-[70] h-7 w-7 md:hidden ${
              scrolled && !menuOpen ? "text-gray-800" : "text-white"
            }`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              animate={
                menuOpen
                  ? { rotate: 45, y: 0, top: "50%" }
                  : { rotate: 0, y: -4, top: "50%" }
              }
              transition={{ duration: 0.3 }}
              className="absolute left-0 h-0.5 w-full -translate-y-1/2 rounded bg-current"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-current"
            />
            <motion.span
              animate={
                menuOpen
                  ? { rotate: -45, y: 0, top: "50%" }
                  : { rotate: 0, y: 4, top: "50%" }
              }
              transition={{ duration: 0.3 }}
              className="absolute left-0 h-0.5 w-full -translate-y-1/2 rounded bg-current"
            />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
            }}
          >
            {/* Top spacing for logo area */}
            <div className="h-20" />

            <nav
              className="flex flex-1 flex-col items-center justify-center gap-6"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`text-3xl font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-[#8BB63A]"
                        : "text-white hover:text-[#8BB63A]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: navLinks.length * 0.05 }}
              >
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="mt-6 inline-block rounded-lg bg-[#8BB63A] px-10 py-4 text-lg font-semibold text-white transition-colors hover:bg-[#7aa832]"
                >
                  Free Estimate
                </Link>
              </motion.div>

              {/* Contact info in mobile menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col items-center gap-3 text-sm text-gray-400"
              >
                <a
                  href="tel:9528826182"
                  className="transition-colors hover:text-[#8BB63A]"
                >
                  (952) 882-6182
                </a>
                <a
                  href="mailto:info@gdlstonesnow.com"
                  className="transition-colors hover:text-[#8BB63A]"
                >
                  info@gdlstonesnow.com
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
