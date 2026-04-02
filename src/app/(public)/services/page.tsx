import { createClient } from "@/lib/supabase/server";
import type { Service, ServiceItem } from "@/types/database";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/app/(public)/components/animated-section";
import Hero from "@/app/(public)/components/hero";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Services | Landscaping & Snow Removal | GDL Stone Snow",
  description:
    "Professional landscaping, lawn care, masonry, stone work, and snow removal services in Bloomington MN. Serving the Twin Cities metro since 2003. Free estimates.",
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f]">
      <Hero
        title="Our Services"
        subtitle="Comprehensive landscaping, masonry, and snow removal solutions for residential and commercial properties"
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
                            `${service.title} service by GDL Stone Snow`
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
                    Request Quote
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

      {/* Bottom CTA */}
      <AnimatedSection>
        <section className="relative overflow-hidden bg-gradient-to-r from-[#7aa132] to-[#8BB63A]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/20" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/20" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Need a Custom Solution?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Every property is unique. Let us create a tailored plan that fits your
              specific needs and budget.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-10 py-4 font-bold text-[#1a1a1a] shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
            >
              Contact Us Today
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
