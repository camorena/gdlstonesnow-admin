import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "./components/animated-section";
import { Quote } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const [
    { data: slides },
    { data: services },
    { data: contentBlocks },
    { data: testimonials },
    { data: galleryItems },
  ] = await Promise.all([
    supabase
      .from("slider_slides")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("services")
      .select("*, service_items(*)")
      .order("sort_order", { ascending: true }),
    supabase.from("content_blocks").select("*").eq("page", "home"),
    supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .limit(4),
  ]);

  const block = (slug: string) =>
    contentBlocks?.find((b: { slug: string }) => b.slug === slug);

  const aboutCompany = block("about-company");

  // Hero background from first slide or fallback
  const heroImage =
    slides && slides.length > 0
      ? slides[0].image_url
      : "/images/slider/slider-1-1.jpg";

  // Fallback testimonials
  const displayTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials
      : [
          {
            id: "fallback-1",
            body: "GDL Stone Snow did a terrific job. They built a beautiful monument in the backyard - they really paid attention to detail. Thank you!",
            author: "Stacey",
            location: "Edina, MN",
          },
          {
            id: "fallback-2",
            body: "We would like to thank GDL Stone Snow for an outstanding effort on this recently completed project. The project involved a very aggressive schedule and it was completed on time.",
            author: "Mark",
            location: "Minnetonka, MN",
          },
        ];

  // Fallback gallery items
  const displayGallery =
    galleryItems && galleryItems.length > 0
      ? galleryItems
      : [
          { id: "g1", image_url: "/images/pages/480x320/landscape.jpg", title: "Landscape Design" },
          { id: "g2", image_url: "/images/pages/480x320/lawncare-services.jpg", title: "Lawn Care" },
          { id: "g3", image_url: "/images/pages/480x320/snow-removal-services.jpg", title: "Snow Removal" },
          { id: "g4", image_url: "/images/pages/480x320/about-1.jpg", title: "Masonry Work" },
        ];

  // Fallback services
  const displayServices =
    services && services.length > 0
      ? services
      : [
          {
            id: "s1",
            title: "Landscape",
            image_url: "/images/pages/480x320/landscape.jpg",
            image_alt: "Professional landscape design",
            description: "Expert landscape design and installation throughout the Twin Cities.",
            service_items: [],
          },
          {
            id: "s2",
            title: "Lawn Care",
            image_url: "/images/pages/480x320/lawncare-services.jpg",
            image_alt: "Lawn care services",
            description: "Complete lawn care for commercial and residential properties.",
            service_items: [],
          },
          {
            id: "s3",
            title: "Snow Removal",
            image_url: "/images/pages/480x320/snow-removal-services.jpg",
            image_alt: "Snow removal services",
            description: "Reliable snow and ice removal customized to fit your needs.",
            service_items: [],
          },
        ];

  const stats = [
    { value: "23+", label: "Years Experience" },
    { value: "500+", label: "Projects Completed" },
    { value: "24/7", label: "Emergency Service" },
    { value: "100%", label: "Customer Satisfaction" },
  ];

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt="Professional landscaping and snow removal services"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <AnimatedSection className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Professional Landscaping &amp; Snow Removal
          </h1>
          <p className="mt-4 text-lg text-gray-200 sm:text-xl">
            Serving the Twin Cities Since 2003
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-md bg-[#8BB63A] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[#7aa832]"
            >
              Get Free Estimate
            </Link>
            <Link
              href="/services"
              className="rounded-md border-2 border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white hover:text-[#1a1a1a]"
            >
              Our Services
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
              Our Services
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              We provide exceptional services to a wide range of commercial and
              residential customers
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayServices.map(
              (
                service: {
                  id: string;
                  title: string;
                  image_url: string;
                  image_alt?: string;
                  description?: string;
                  service_items?: { id: string }[];
                },
                index: number
              ) => (
                <AnimatedSection key={service.id} delay={index * 0.1}>
                  <Link
                    href="/services"
                    className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <Image
                        src={service.image_url}
                        alt={service.image_alt || service.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {service.service_items &&
                        service.service_items.length > 0 && (
                          <span className="absolute right-3 top-3 rounded-full bg-[#8BB63A] px-3 py-1 text-xs font-semibold text-white">
                            {service.service_items.length} services
                          </span>
                        )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-[#1a1a1a]">
                        {service.title}
                      </h3>
                      {service.description && (
                        <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </AnimatedSection>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="bg-[#8BB63A] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1} className="text-center">
                <p className="text-4xl font-bold text-white sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-white/90 sm:text-base">
                  {stat.label}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ABOUT SECTION ========== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <AnimatedSection>
              <div className="relative aspect-[480/693] overflow-hidden rounded-xl">
                <Image
                  src="/images/pages/480x693/ourcompany.jpg"
                  alt="GDL Stone Snow company landscaping project"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
                {aboutCompany?.title || "About Our Company"}
              </h2>
              <p className="mt-2 text-lg text-[#8BB63A]">
                {aboutCompany?.subtitle || "Exceptional level of service."}
              </p>
              {aboutCompany?.body ? (
                <div
                  className="mt-6 space-y-4 leading-relaxed text-gray-600"
                  dangerouslySetInnerHTML={{ __html: aboutCompany.body }}
                />
              ) : (
                <p className="mt-6 leading-relaxed text-gray-600">
                  GDL has been in the Landscape Industry since 2003, creating and
                  mastering landscape designs throughout the Twin Cities. We take
                  pride in providing top notch service along with industry leading
                  principles and procedures in landscape design. Our company
                  delivers its promise to you, our client, and values your
                  business. The needs of your business remain our top priority for
                  the entire period of service.
                </p>
              )}
              <Link
                href="/contact"
                className="mt-8 inline-block rounded-md bg-[#8BB63A] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#7aa832]"
              >
                Learn More
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== GALLERY PREVIEW ========== */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
              Our Work
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Browse some of our recent projects
            </p>
          </AnimatedSection>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayGallery.map(
              (
                item: {
                  id: string;
                  image_url: string;
                  title?: string;
                  image_alt?: string;
                },
                index: number
              ) => (
                <AnimatedSection key={item.id} delay={index * 0.1}>
                  <div className="group relative aspect-square overflow-hidden rounded-xl">
                    <Image
                      src={item.image_url}
                      alt={item.image_alt || item.title || "Gallery image"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="p-4 text-sm font-medium text-white">
                        {item.title || "Project"}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            )}
          </div>

          <AnimatedSection className="mt-10 text-center">
            <Link
              href="/gallery"
              className="inline-block rounded-md border-2 border-[#8BB63A] px-8 py-3 font-semibold text-[#8BB63A] transition-colors hover:bg-[#8BB63A] hover:text-white"
            >
              View All Projects
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="bg-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h2 className="text-3xl font-bold text-[#1a1a1a] sm:text-4xl">
              What Our Clients Say
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayTestimonials.map(
              (
                testimonial: {
                  id?: string;
                  body: string;
                  author: string;
                  location?: string;
                  title?: string;
                },
                index: number
              ) => (
                <AnimatedSection key={testimonial.id || index} delay={index * 0.1}>
                  <div className="flex h-full flex-col rounded-xl bg-white p-6 shadow-md">
                    <Quote className="mb-4 h-8 w-8 text-[#8BB63A]" />
                    <p className="flex-1 text-gray-600 italic leading-relaxed">
                      &ldquo;{testimonial.body}&rdquo;
                    </p>
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <p className="font-semibold text-[#1a1a1a]">
                        {testimonial.author}
                      </p>
                      {(testimonial.location || testimonial.title) && (
                        <p className="text-sm text-gray-500">
                          {testimonial.location || testimonial.title}
                        </p>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="bg-[#8BB63A] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Transform Your Property?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Get in touch with our team for a free, no-obligation estimate. We
              are here to bring your vision to life.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block rounded-md bg-white px-8 py-3 text-lg font-semibold text-[#8BB63A] transition-colors hover:bg-gray-100"
            >
              Contact Us
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
