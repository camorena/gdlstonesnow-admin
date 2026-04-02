"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/types/database";
import Lightbox from "./lightbox";

const FILTER_TABS = [
  { label: "All", value: "all" },
  { label: "Landscaping", value: "Landscaping" },
  { label: "Masonry", value: "Masonry" },
  { label: "Snow Removal", value: "Snow Removal" },
] as const;

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
      {/* Filter tabs */}
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-4 sm:px-6 lg:px-8">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveFilter(tab.value);
              setLightboxIndex(null);
            }}
            className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
              activeFilter === tab.value
                ? "bg-[#8BB63A] text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {filtered.map((item, index) => (
          <button
            key={item.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BB63A] focus-visible:ring-offset-2"
          >
            <Image
              src={item.thumbnail_url ?? item.url}
              alt={item.alt_text ?? item.title ?? "Gallery image"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {item.title && (
                <span className="p-4 text-left text-sm font-medium text-white">
                  {item.title}
                </span>
              )}
            </div>

            {/* Video play button */}
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-gray-400">
          No items found in this category.
        </p>
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
