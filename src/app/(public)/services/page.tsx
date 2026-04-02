import { createClient } from "@/lib/supabase/server";
import type { Service, ServiceItem } from "@/types/database";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/app/(public)/components/animated-section";

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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a1a1a] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Our Services
          </h1>
          <nav className="mt-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="transition-colors hover:text-[#8BB63A]">
                  Home
                </Link>
              </li>
              <li className="select-none">/</li>
              <li className="text-[#8BB63A]">Services</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Services */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {sortedServices.map((service, index) => {
          const isEven = index % 2 === 1;

          return (
            <AnimatedSection key={service.id}>
              <section
                className={`flex flex-col items-center gap-10 lg:gap-16 ${
                  index > 0 ? "mt-20 border-t border-gray-100 pt-20" : ""
                } ${isEven ? "lg:flex-row-reverse" : "lg:flex-row"}`}
              >
                {/* Image */}
                {service.image_url && (
                  <div className="w-full shrink-0 lg:w-1/2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                      <Image
                        src={service.image_url}
                        alt={
                          service.image_alt ??
                          `${service.title} service by GDL Stone Snow`
                        }
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <h2 className="text-3xl font-bold text-[#1a1a1a]">
                    {service.title}
                  </h2>

                  <ul className="mt-6 space-y-3">
                    {service.service_items.map((item) => (
                      <li key={item.id} className="flex items-start gap-3">
                        {/* Green checkmark */}
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-[#8BB63A]"
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
                        <span className="text-gray-700">{item.title}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className="mt-8 inline-block rounded-lg bg-[#8BB63A] px-8 py-3 font-semibold text-white shadow transition-all hover:bg-[#7aa132] hover:shadow-md"
                  >
                    Get a Free Estimate
                  </Link>
                </div>
              </section>
            </AnimatedSection>
          );
        })}
      </div>
    </div>
  );
}
