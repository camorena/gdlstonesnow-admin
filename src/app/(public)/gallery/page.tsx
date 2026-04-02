import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types/database";
import type { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/app/(public)/components/animated-section";
import GalleryClient from "./gallery-client";
import Hero from "@/app/(public)/components/hero";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Landscaping Portfolio Bloomington MN",
  description:
    "View our landscaping portfolio and stone work projects in the Twin Cities. Browse completed masonry, lawn care & snow removal work by GDL Stone Snow LLC.",
  openGraph: {
    title: "Landscaping Portfolio Bloomington MN | GDL Stone Snow LLC",
    description:
      "View our landscaping portfolio and stone work projects in the Twin Cities. Browse completed masonry, lawn care & snow removal work by GDL Stone Snow LLC.",
    url: "https://gdlstonesnow.com/gallery",
    siteName: "GDL Stone Snow LLC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "GDL Stone Snow LLC landscaping portfolio in Bloomington MN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Landscaping Portfolio Bloomington MN | GDL Stone Snow LLC",
    description:
      "View our landscaping portfolio and stone work projects in the Twin Cities. Browse completed masonry, lawn care & snow removal work.",
    images: ["/images/logo.png"],
  },
  alternates: {
    canonical: "https://gdlstonesnow.com/gallery",
  },
};

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: galleryItems } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const items: GalleryItem[] = galleryItems ?? [];

  const galleryJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Landscaping & Stone Work Portfolio - GDL Stone Snow LLC",
    description: "Browse completed landscaping, masonry, stone work, and snow removal projects by GDL Stone Snow LLC in Bloomington and the Twin Cities metro area.",
    url: "https://gdlstonesnow.com/gallery",
    publisher: {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://gdlstonesnow.com/#business",
      name: "GDL Stone Snow LLC",
    },
    about: {
      "@type": "Thing",
      name: "Landscaping and masonry projects in the Twin Cities, MN",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
      />
      <Hero
        title="Project Gallery"
        subtitle="See the craftsmanship behind 23+ years of transforming Twin Cities properties"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        backgroundImage="/images/pages/480x320/landscape.jpg"
        size="large"
      />

      {/* Gallery content */}
      <div className="py-16">
        <GalleryClient items={items} />
      </div>

      {/* Internal links to Services and Contact */}
      <section className="bg-white dark:bg-[#0f0f0f] py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a] dark:text-white md:text-4xl">
              Ready to Start Your Project?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Explore our full range of <Link href="/services" className="font-semibold text-[#8BB63A] hover:underline">landscaping, masonry, and snow removal services</Link> or <Link href="/contact" className="font-semibold text-[#8BB63A] hover:underline">request a free estimate</Link> for your property.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#8BB63A] px-8 py-4 font-semibold text-[#8BB63A] transition-all duration-300 hover:bg-[#8BB63A] hover:text-white"
              >
                View Our Services
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#8BB63A] px-8 py-4 font-semibold text-white shadow-lg shadow-[#8BB63A]/25 transition-all duration-300 hover:bg-[#7aa132] hover:shadow-xl"
              >
                Get a Free Estimate
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
