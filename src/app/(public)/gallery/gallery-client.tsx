"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { GalleryItem } from "@/types/database";
import Lightbox from "./lightbox";

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Landscaping", value: "Landscaping" },
  { label: "Masonry", value: "Masonry" },
  { label: "Snow Removal", value: "Snow Removal" },
] as const;

function isVideo(item: GalleryItem): boolean {
  const url = (item.image_url || item.url || "").toLowerCase();
  return url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com") || url.endsWith(".mp4") || url.endsWith(".webm");
}

function getVideoUrl(item: GalleryItem): string {
  return item.image_url || item.url || "";
}

function getThumbnail(item: GalleryItem): string {
  if (item.thumbnail_url) return item.thumbnail_url;
  const url = getVideoUrl(item);
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
  return item.image_url || "";
}

interface GalleryClientProps {
  items: GalleryItem[];
}

export default function GalleryClient({ items }: GalleryClientProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeFilter === "all"
      ? items
      : items.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filtered.length - 1 : prev - 1;
    });
  }, [filtered.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === filtered.length - 1 ? 0 : prev + 1;
    });
  }, [filtered.length]);

  return (
    <>
      {/* Premium Filter Bar */}
      <div role="group" aria-label="Filter gallery by category" className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 px-4 sm:px-6 lg:px-8">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveFilter(tab.value);
              setLightboxIndex(null);
            }}
            aria-label={`Filter by ${tab.label}`}
            aria-pressed={activeFilter === tab.value}
            className={`rounded-full px-7 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeFilter === tab.value
                ? "bg-[#8BB63A] text-white shadow-lg shadow-[#8BB63A]/25"
                : "border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#8BB63A]/50 hover:text-[#8BB63A]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="columns-1 gap-4 sm:columns-2 lg:columns-3"
          >
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="mb-4 break-inside-avoid"
              >
                <button
                  onClick={() => openLightbox(index)}
                  aria-label={`View ${item.title || "project"} - ${item.category || "landscaping"} in the Twin Cities`}
                  className="group relative w-full overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BB63A] focus-visible:ring-offset-2"
                >
                  <Image
                    src={isVideo(item) ? getThumbnail(item) : (item.thumbnail_url || item.image_url || item.url || "")}
                    alt={item.alt_text ?? `${item.title || "Project"} by GDL Stone Snow in Bloomington MN`}
                    width={600}
                    height={isVideo(item) ? 338 : 450}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a]/70 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {item.title && (
                      <p className="mb-3 px-4 text-center text-lg font-semibold text-white">
                        {item.title}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#8BB63A] px-5 py-2 text-sm font-semibold text-white shadow-lg">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                      View
                    </span>
                  </div>

                  {/* Video play button */}
                  {isVideo(item) && (
                    <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1a1a]/60 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <svg
                          className="ml-1 h-7 w-7 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="mt-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No projects in this category yet — check back soon or browse another category.
          </p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  );
}
