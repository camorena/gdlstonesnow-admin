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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1a] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Project Gallery
          </h1>
          <nav className="mt-4" aria-label="Breadcrumb">
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
        </div>
      </section>

      {/* Gallery content */}
      <div className="py-12">
        <GalleryClient items={items} />
      </div>
    </div>
  );
}
