import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types/database";
import type { Metadata } from "next";
import Link from "next/link";
import GalleryClient from "./gallery-client";
import Hero from "@/app/(public)/components/hero";

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111]">
      <Hero
        title="Project Gallery"
        subtitle="Browse our portfolio of completed landscaping, masonry, and snow removal projects"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        backgroundImage="/images/pages/480x320/landscape.jpg"
        size="large"
      />

      {/* Gallery content */}
      <div className="py-16">
        <GalleryClient items={items} />
      </div>
    </div>
  );
}
