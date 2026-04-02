import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types/database";
import type { Metadata } from "next";
import Link from "next/link";
import GalleryClient from "./gallery-client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Project Gallery | GDL Stone Snow Bloomington MN",
  description:
    "Browse landscaping, masonry, stone work, and snow removal projects by GDL Stone Snow LLC. Serving Bloomington and the Twin Cities metro since 2003.",
};

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: galleryItems } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const items: GalleryItem[] = galleryItems ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-[#8BB63A] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#8BB63A] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="transition-colors hover:text-[#8BB63A]">
                  Home
                </Link>
              </li>
              <li className="select-none">/</li>
              <li className="text-[#8BB63A]">Gallery</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            Project Gallery
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-300">
            Browse our portfolio of completed projects showcasing expert
            craftsmanship in landscaping, masonry, and snow removal.
          </p>
          <div className="mt-6 h-1 w-20 rounded-full bg-[#8BB63A]" />
        </div>
      </section>

      {/* Gallery content */}
      <div className="py-16">
        <GalleryClient items={items} />
      </div>
    </div>
  );
}
