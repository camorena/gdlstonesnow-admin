import { createClient } from "@/lib/supabase/server";
import type { Service, ServiceItem } from "@/types/database";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/app/(public)/components/animated-section";
import Hero from "@/app/(public)/components/hero";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Landscaping Services Bloomington MN",
  description:
    "Professional landscaping, masonry, lawn care & commercial snow plowing in Bloomington MN. Twin Cities masonry contractor since 2003. Free estimates.",
  openGraph: {
    title: "Landscaping Services Bloomington MN | GDL Stone Snow LLC",
    description:
      "Professional landscaping, masonry, lawn care & commercial snow plowing in Bloomington MN. Twin Cities masonry contractor since 2003. Free estimates.",
    url: "https://gdlstonesnow.com/services",
    siteName: "GDL Stone Snow LLC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "GDL Stone Snow LLC landscaping services in Bloomington MN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Landscaping Services Bloomington MN | GDL Stone Snow LLC",
    description:
      "Professional landscaping, masonry, lawn care & commercial snow plowing in Bloomington MN. Twin Cities masonry contractor since 2003.",
    images: ["/images/logo.png"],
  },
  alternates: {
    canonical: "https://gdlstonesnow.com/services",
  },
};

type ServiceWithItems = Service & { service_items: ServiceItem[] };

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*, service_items(*)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const sortedServices: ServiceWithItems[] = (services ?? []).map((service) => ({
    ...service,
    service_items: (service.service_items ?? []).sort(
      (a: ServiceItem, b: ServiceItem) => a.sort_order - b.sort_order
    ),
  }));

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Landscaping & Snow Removal Services in Bloomington MN",
    description: "Professional landscaping, masonry, lawn care and snow removal services offered by GDL Stone Snow LLC in the Twin Cities metro area.",
    url: "https://gdlstonesnow.com/services",
    numberOfItems: sortedServices.length,
    itemListElement: sortedServices.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.title,
        provider: {
          "@type": "HomeAndConstructionBusiness",
          "@id": "https://gdlstonesnow.com/#business",
          name: "GDL Stone Snow LLC",
        },
        areaServed: {
          "@type": "City",
          name: "Bloomington",
          sameAs: "https://en.wikipedia.org/wiki/Bloomington,_Minnesota",
        },
        ...(service.image_url ? { image: `https://gdlstonesnow.com${service.image_url}` } : {}),
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />
      <Hero
        title="Our Services"
        subtitle="From landscape design to snow removal, we keep your property looking its best year-round"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        backgroundImage="/images/slider/slider-1-3.jpg"
        size="large"
      />

      {/* Services */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {sortedServices.map((service, index) => {
          const isEven = index % 2 === 1;
          const direction = isEven ? "right" : "left";

          return (
            <AnimatedSection
              key={service.id}
              direction={direction}
            >
              <section
                className={`flex flex-col items-center gap-12 lg:gap-20 ${
                  index > 0 ? "mt-24 border-t border-gray-100 dark:border-gray-700 pt-24" : ""
                } ${isEven ? "lg:flex-row-reverse" : "lg:flex-row"}`}
              >
                {/* Image */}
                {service.image_url && (
                  <div className="w-full shrink-0 lg:w-1/2">
                    <div className="relative">
                      {/* Green accent */}
                      <div
                        className={`absolute -bottom-4 ${
                          isEven ? "-left-4" : "-right-4"
                        } h-full w-full rounded-2xl bg-[#8BB63A]/10`}
                      />
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                        <Image
                          src={service.image_url}
                          alt={
                            service.image_alt ??
                            `${service.title} service by GDL Stone Snow in Bloomington MN`
                          }
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <div className="mb-4 h-1 w-12 rounded-full bg-[#8BB63A]" />
                  <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a] dark:text-white md:text-4xl">
                    {service.title}
                  </h2>

                  {/* Pill-shaped tags grid */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    {service.service_items.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-900/30 px-4 py-2 text-sm font-medium text-green-800 dark:text-green-400 transition-colors hover:bg-green-100 dark:hover:bg-green-900/50"
                      >
                        <svg
                          className="h-4 w-4 text-[#8BB63A]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {item.title}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/contact"
                    className="mt-10 inline-flex items-center gap-2 rounded-lg bg-[#8BB63A] px-8 py-3.5 font-semibold text-white shadow-lg shadow-[#8BB63A]/25 transition-all hover:bg-[#7aa132] hover:shadow-xl hover:shadow-[#8BB63A]/30"
                  >
                    Get Your Free Quote
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </section>
            </AnimatedSection>
          );
        })}
      </div>

      {/* See Our Work link to Gallery */}
      <AnimatedSection>
        <section className="bg-[#f9fafb] dark:bg-[#111111] py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a] dark:text-white md:text-4xl">
              See Our Work in Action
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Browse our portfolio of completed landscaping, masonry, and snow removal projects throughout the Twin Cities.
            </p>
            <Link
              href="/gallery"
              className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[#8BB63A] px-8 py-4 font-semibold text-[#8BB63A] transition-all duration-300 hover:bg-[#8BB63A] hover:text-white hover:shadow-lg hover:shadow-[#8BB63A]/20"
            >
              View Project Gallery
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* Bottom CTA */}
      <AnimatedSection>
        <section className="relative overflow-hidden bg-gradient-to-r from-[#7aa132] to-[#8BB63A]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/20" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/20" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Let&apos;s Plan Your Next Project
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Every property is different. Tell us what you need and we&apos;ll create a
              plan that fits your vision and budget — free estimates, no pressure.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-10 py-4 font-bold text-[#1a1a1a] shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
            >
              Schedule a Free Consultation
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
