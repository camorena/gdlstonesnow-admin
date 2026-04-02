"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/promotions", label: "Promotions" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
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
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-gray-700 hover:text-[#8BB63A]"
                    : "text-white hover:text-[#8BB63A]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden rounded-md bg-[#8BB63A] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7aa832] md:inline-block"
          >
            Free Estimate
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`md:hidden ${scrolled ? "text-gray-800" : "text-white"}`}
            aria-label="Open menu"
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#1a1a1a]">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <Image
                src="/images/logo.png"
                alt="GDL Stone Snow LLC"
                width={160}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-6" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-medium text-white transition-colors hover:text-[#8BB63A]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-4 rounded-md bg-[#8BB63A] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#7aa832]"
            >
              Free Estimate
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
