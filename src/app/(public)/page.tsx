import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "./components/animated-section";
import AnimatedCounter from "./components/animated-counter";
import TestimonialCarousel from "./components/testimonial-carousel";

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
            quote:
              "GDL Stone Snow did a terrific job. They built a beautiful monument in the backyard - they really paid attention to detail. Thank you!",
            author_name: "Stacey",
            author_location: "Edina, MN",
          },
          {
            id: "fallback-2",
            quote:
              "We would like to thank GDL Stone Snow for an outstanding effort on this recently completed project. The project involved a very aggressive schedule and it was completed on time.",
            author_name: "Mark",
            author_location: "Minnetonka, MN",
          },
          {
            id: "fallback-3",
            quote:
              "Reliable, professional, and always on time. GDL handles our snow removal every winter and our property always looks great.",
            author_name: "Sarah",
            author_location: "Bloomington, MN",
          },
        ];

  // Fallback gallery items
  const displayGallery =
    galleryItems && galleryItems.length > 0
      ? galleryItems
      : [
          {
            id: "g1",
            url: "/images/pages/480x320/landscape.jpg",
            title: "Landscape Design",
          },
          {
            id: "g2",
            url: "/images/pages/480x320/lawncare-services.jpg",
            title: "Lawn Care",
          },
          {
            id: "g3",
            url: "/images/pages/480x320/snow-removal-services.jpg",
            title: "Snow Removal",
          },
          {
            id: "g4",
            url: "/images/pages/480x320/about-1.jpg",
            title: "Masonry Work",
          },
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
            description:
              "Expert landscape design and installation throughout the Twin Cities.",
            service_items: [],
          },
          {
            id: "s2",
            title: "Lawn Care",
            image_url: "/images/pages/480x320/lawncare-services.jpg",
            image_alt: "Lawn care services",
            description:
              "Complete lawn care for commercial and residential properties.",
            service_items: [],
          },
          {
            id: "s3",
            title: "Snow Removal",
            image_url: "/images/pages/480x320/snow-removal-services.jpg",
            image_alt: "Snow removal services",
            description:
              "Reliable snow and ice removal customized to fit your needs.",
            service_items: [],
          },
        ];

  const serviceAreas = [
    "Bloomington",
    "Minneapolis",
    "St. Paul",
    "Edina",
    "Richfield",
    "Burnsville",
    "Eagan",
    "Eden Prairie",
    "Minnetonka",
  ];

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image
          src={heroImage}
          alt="Professional landscaping and snow removal services"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-transparent" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <AnimatedSection delay={200}>
            <span className="mb-6 inline-block rounded-full bg-[#8BB63A]/20 px-5 py-2 text-sm font-semibold tracking-wide text-[#8BB63A] backdrop-blur-sm ring-1 ring-[#8BB63A]/30">
              Serving the Twin Cities Since 2003
            </span>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              Professional Landscaping
              <br />
              <span className="text-[#8BB63A]">&amp;</span> Snow Removal
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={600}>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-gray-200">
              Expert landscaping, masonry, stone work, and snow removal services
              in Bloomington, MN
            </p>
          </AnimatedSection>

          <AnimatedSection delay={800}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-full bg-[#8BB63A] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#8BB63A]/25 transition-all duration-300 hover:bg-[#7aa132] hover:shadow-xl hover:shadow-[#8BB63A]/30"
              >
                Get Free Estimate
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
              >
                View Our Work
              </Link>
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex animate-bounce flex-col items-center text-white/60">
            <span className="mb-2 text-xs font-medium uppercase tracking-widest">
              Scroll
            </span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ========== SERVICES SECTION ========== */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#8BB63A]">
              What We Do
            </p>
            <h2 className="mt-3 text-4xl font-bold text-[#1a1a1a] sm:text-5xl">
              Our Services
            </h2>
          </AnimatedSection>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                <AnimatedSection
                  key={service.id}
                  delay={index * 150}
                  direction="up"
                >
                  <Link
                    href="/services"
                    className="group relative block overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={service.image_url}
                        alt={service.image_alt || service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 transition-all duration-500 group-hover:bg-black/50">
                        <span className="translate-y-4 text-lg font-bold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          {service.title}
                        </span>
                        <span className="mt-2 translate-y-4 text-sm font-medium text-[#8BB63A] opacity-0 transition-all duration-500 delay-100 group-hover:translate-y-0 group-hover:opacity-100">
                          Learn More &rarr;
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#1a1a1a]">
                        {service.title}
                      </h3>
                      {service.service_items &&
                        service.service_items.length > 0 && (
                          <p className="mt-1 text-sm font-medium text-[#8BB63A]">
                            {service.service_items.length} services available
                          </p>
                        )}
                    </div>
                  </Link>
                </AnimatedSection>
              )
            )}
          </div>

          <AnimatedSection className="mt-14 text-center">
            <Link
              href="/services"
              className="inline-block rounded-full border-2 border-[#8BB63A] px-8 py-4 font-semibold text-[#8BB63A] transition-all duration-300 hover:bg-[#8BB63A] hover:text-white hover:shadow-lg hover:shadow-[#8BB63A]/20"
            >
              View All Services
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="bg-gradient-to-r from-[#7aa132] to-[#8BB63A] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <AnimatedSection delay={0} className="text-center">
              <p className="text-5xl font-bold text-white sm:text-6xl">
                <AnimatedCounter end={23} suffix="+" duration={2} />
              </p>
              <p className="mt-3 text-sm font-medium tracking-wide text-white/90 sm:text-base">
                Years of Experience
              </p>
            </AnimatedSection>

            <AnimatedSection delay={150} className="text-center">
              <p className="text-5xl font-bold text-white sm:text-6xl">
                <AnimatedCounter end={500} suffix="+" duration={2.5} />
              </p>
              <p className="mt-3 text-sm font-medium tracking-wide text-white/90 sm:text-base">
                Projects Completed
              </p>
            </AnimatedSection>

            <AnimatedSection delay={300} className="text-center">
              <p className="text-5xl font-bold text-white sm:text-6xl">24/7</p>
              <p className="mt-3 text-sm font-medium tracking-wide text-white/90 sm:text-base">
                Emergency Service
              </p>
            </AnimatedSection>

            <AnimatedSection delay={450} className="text-center">
              <p className="text-5xl font-bold text-white sm:text-6xl">
                <AnimatedCounter end={100} suffix="%" duration={2} />
              </p>
              <p className="mt-3 text-sm font-medium tracking-wide text-white/90 sm:text-base">
                Customer Satisfaction
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== ABOUT SECTION ========== */}
      <section className="bg-[#f9fafb] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <AnimatedSection direction="left" delay={0}>
              <div className="relative">
                {/* Green accent rectangle behind image */}
                <div className="absolute -bottom-4 -left-4 h-full w-full rounded-2xl bg-[#8BB63A]/20" />
                <div className="relative overflow-hidden rounded-2xl border-l-4 border-[#8BB63A]">
                  <div className="relative aspect-[480/693]">
                    <Image
                      src="/images/pages/480x693/ourcompany.jpg"
                      alt="GDL Stone Snow company landscaping project"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={200}>
              <p className="text-sm font-bold uppercase tracking-widest text-[#8BB63A]">
                About Us
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#1a1a1a] sm:text-4xl lg:text-5xl">
                Your Trusted Partner
                <br />
                Since 2003
              </h2>
              {aboutCompany?.body ? (
                <div
                  className="mt-6 space-y-4 text-lg leading-relaxed text-gray-600"
                  dangerouslySetInnerHTML={{ __html: aboutCompany.body }}
                />
              ) : (
                <div className="mt-6 space-y-4">
                  <p className="text-lg leading-relaxed text-gray-600">
                    GDL has been in the Landscape Industry since 2003, creating
                    and mastering landscape designs throughout the Twin Cities.
                    We take pride in providing top notch service along with
                    industry leading principles and procedures in landscape
                    design.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-600">
                    Our company delivers its promise to you, our client, and
                    values your business. The needs of your business remain our
                    top priority for the entire period of service.
                  </p>
                </div>
              )}
              <ul className="mt-6 space-y-3">
                {[
                  "Licensed & Fully Insured",
                  "Commercial & Residential",
                  "Free Estimates",
                  "Satisfaction Guaranteed",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <svg
                      className="h-5 w-5 flex-shrink-0 text-[#8BB63A]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link
                  href="/contact"
                  className="inline-block rounded-full bg-[#8BB63A] px-8 py-4 font-semibold text-white shadow-lg shadow-[#8BB63A]/25 transition-all duration-300 hover:bg-[#7aa132] hover:shadow-xl"
                >
                  Contact Us
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ========== FEATURED PROJECTS ========== */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#8BB63A]">
              Our Work
            </p>
            <h2 className="mt-3 text-4xl font-bold text-[#1a1a1a] sm:text-5xl">
              Featured Projects
            </h2>
          </AnimatedSection>

          {/* Bento grid: first item large, rest smaller */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
            {displayGallery.map(
              (
                item: {
                  id: string;
                  url?: string;
                  image_url?: string;
                  title?: string;
                  alt_text?: string;
                },
                index: number
              ) => (
                <AnimatedSection
                  key={item.id}
                  delay={index * 150}
                  className={
                    index === 0
                      ? "sm:col-span-2 sm:row-span-2"
                      : ""
                  }
                >
                  <div
                    className={`group relative overflow-hidden rounded-2xl ${
                      index === 0 ? "aspect-square sm:aspect-auto sm:h-full" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={item.url || item.image_url || ""}
                      alt={item.alt_text || item.title || "Project image"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={
                        index === 0
                          ? "(max-width: 640px) 100vw, 66vw"
                          : "(max-width: 640px) 100vw, 33vw"
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-lg font-bold text-white">
                        {item.title || "Project"}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            )}
          </div>

          <AnimatedSection className="mt-14 text-center">
            <Link
              href="/gallery"
              className="inline-block rounded-full border-2 border-[#8BB63A] px-8 py-4 font-semibold text-[#8BB63A] transition-all duration-300 hover:bg-[#8BB63A] hover:text-white hover:shadow-lg hover:shadow-[#8BB63A]/20"
            >
              View Full Gallery &rarr;
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="bg-[#1a1a1a] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-16 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#8BB63A]">
              Testimonials
            </p>
            <h2 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
              What Our Clients Say
            </h2>
          </AnimatedSection>

          <TestimonialCarousel testimonials={displayTestimonials} />
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="bg-gradient-to-r from-[#7aa132] to-[#8BB63A] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Ready to Transform
              <br />
              Your Property?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
              Get a free estimate for your next landscaping or snow removal
              project
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="tel:9528826182"
                className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-[#1a1a1a] shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl"
              >
                Call Now (952) 882-6182
              </a>
              <Link
                href="/contact"
                className="rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-[#1a1a1a]"
              >
                Get Free Estimate
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ========== SERVICE AREA ========== */}
      <section className="bg-[#f9fafb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[#8BB63A]">
              Service Area
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
              Proudly Serving
            </h2>
            <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-3">
              {serviceAreas.map((area, index) => (
                <span key={area} className="flex items-center">
                  <span className="text-base font-medium text-gray-700 sm:text-lg">
                    {area}
                  </span>
                  {index < serviceAreas.length - 1 && (
                    <span className="ml-2 hidden text-[#8BB63A] sm:inline">
                      &bull;
                    </span>
                  )}
                </span>
              ))}
            </div>
            <p className="mt-6 text-gray-500">
              And surrounding communities in the Twin Cities metro area
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
