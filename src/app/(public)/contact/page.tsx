import { createClient } from "@/lib/supabase/server";
import type { ContentBlock, SiteSettings } from "@/types/database";
import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./contact-form";
import AnimatedSection from "../components/animated-section";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact Us | GDL Stone Snow Bloomington MN",
  description:
    "Get in touch with GDL Stone Snow LLC for a free estimate. Landscaping, masonry, stone work, and snow removal in Bloomington and the Twin Cities metro.",
};

export default async function ContactPage() {
  const supabase = await createClient();

  const [{ data: contentBlocks }, { data: settingsRows }] = await Promise.all([
    supabase.from("content_blocks").select("*").eq("page", "contact"),
    supabase.from("site_settings").select("*").limit(1),
  ]);

  const blocks = (contentBlocks ?? []) as ContentBlock[];
  const settings = (settingsRows?.[0] ?? null) as SiteSettings | null;

  const whoWeAre = blocks.find((b) => b.section === "who_we_are");
  const ourMission = blocks.find((b) => b.section === "our_mission");

  const missionItems = ourMission?.body
    ? ourMission.body.split("\n").filter((line) => line.trim())
    : [
        "Offer a full range of services to residential and commercial customers.",
        "Deliver high quality work and consistent customer service.",
        "Build lasting relationships with our employees, customers and community.",
        "Take pride in turning your vision into reality!",
      ];

  const mapsEmbed =
    settings?.google_maps_embed ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2826.5!2d-93.2866!3d44.8408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f6276e1e6e0e5d%3A0x0!2s1000+W+94th+St%2C+Bloomington%2C+MN+55420!5e0!3m2!1sen!2sus!4v1";

  const fullAddress = settings
    ? `${settings.address_street}, ${settings.address_city}, ${settings.address_state} ${settings.address_zip}`
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-1/3 top-0 h-96 w-96 rounded-full bg-[#8BB63A] blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-[#8BB63A] blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-[#8BB63A]"
                >
                  Home
                </Link>
              </li>
              <li className="select-none">/</li>
              <li className="text-[#8BB63A]">Contact</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
            Get In Touch
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-300">
            We&apos;d love to hear from you. Reach out for a free estimate or to
            learn more about our services.
          </p>
          <div className="mt-6 h-1 w-20 rounded-full bg-[#8BB63A]" />
        </div>
      </section>

      {/* Contact Form + Info - Two columns */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Left: Contact Form (wider) */}
          <AnimatedSection className="lg:col-span-3" direction="left">
            <ContactForm />
          </AnimatedSection>

          {/* Right: Info Panel */}
          <AnimatedSection className="lg:col-span-2" delay={200} direction="right">
            <div className="h-full rounded-2xl bg-[#1a1a1a] p-8 shadow-xl lg:p-10">
              <h2 className="text-2xl font-bold text-white">
                Contact Information
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Feel free to reach out through any of these channels.
              </p>

              <div className="mt-8 space-y-7">
                {/* Address */}
                {settings?.address_street && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#8BB63A]/15">
                      <svg
                        className="h-5 w-5 text-[#8BB63A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Address
                      </p>
                      <p className="mt-1 text-white">{fullAddress}</p>
                    </div>
                  </div>
                )}

                {/* Office Phone */}
                {settings?.phone_office && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#8BB63A]/15">
                      <svg
                        className="h-5 w-5 text-[#8BB63A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Office Phone
                      </p>
                      <a
                        href={`tel:${settings.phone_office.replace(/\D/g, "")}`}
                        className="mt-1 inline-block text-white transition-colors hover:text-[#8BB63A]"
                      >
                        {settings.phone_office}
                      </a>
                    </div>
                  </div>
                )}

                {/* Sales Phone */}
                {settings?.phone_sales && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#8BB63A]/15">
                      <svg
                        className="h-5 w-5 text-[#8BB63A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Sales Phone
                      </p>
                      <a
                        href={`tel:${settings.phone_sales.replace(/\D/g, "")}`}
                        className="mt-1 inline-block text-white transition-colors hover:text-[#8BB63A]"
                      >
                        {settings.phone_sales}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {settings?.email && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#8BB63A]/15">
                      <svg
                        className="h-5 w-5 text-[#8BB63A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Email
                      </p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="mt-1 inline-block text-white transition-colors hover:text-[#8BB63A]"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Hours */}
                {settings?.hours_display && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#8BB63A]/15">
                      <svg
                        className="h-5 w-5 text-[#8BB63A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Hours
                      </p>
                      <p className="mt-1 whitespace-pre-line text-white">
                        {settings.hours_display}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Icons */}
              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Follow Us
                </p>
                <div className="flex items-center gap-3">
                  {settings?.facebook_url && (
                    <a
                      href={settings.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gray-400 transition-all hover:bg-[#8BB63A] hover:text-white"
                      aria-label="Facebook"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {settings?.instagram_url && (
                    <a
                      href={settings.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gray-400 transition-all hover:bg-[#8BB63A] hover:text-white"
                      aria-label="Instagram"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                  )}
                  {settings?.youtube_url && (
                    <a
                      href={settings.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gray-400 transition-all hover:bg-[#8BB63A] hover:text-white"
                      aria-label="YouTube"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Google Maps - Full Width */}
      <AnimatedSection className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <div
            className="relative w-full"
            style={{ paddingBottom: "40%", minHeight: "300px" }}
          >
            <iframe
              src={mapsEmbed}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GDL Stone Snow LLC location on Google Maps"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Who We Are */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
              {whoWeAre?.heading || "Who We Are"}
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full bg-[#8BB63A]" />
            {whoWeAre?.body ? (
              <div className="mt-8 max-w-4xl space-y-4 leading-relaxed text-gray-600">
                {whoWeAre.body.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="mt-8 max-w-4xl space-y-4 leading-relaxed text-gray-600">
                <p>
                  In 2003 Fernando Floersch, owner of GDL-Stone Snow LLC.,
                  created a united front and a shared belief that caring for our
                  customers and team members should be the heart of the company.
                  With consistent, excellent and proactive services, steady
                  client focus GDL could deliver future investments everyday and
                  everywhere with a wide range of people. He takes great pride in
                  his family owned and operated business.
                </p>
                <p>
                  We have been in the landscape, lawn care and snow removal
                  industry since 2003 and have successfully landed nationwide
                  accounts with large corporations such as, Pinnacle Properties,
                  Caspian Group, Sherman &amp; Associates, Walser Corporation,
                  and RMK Management. We take pride in providing top notch
                  service along with industry leading principles and procedures
                  in landscaping, design and maintenance.
                </p>
              </div>
            )}
          </AnimatedSection>

          <AnimatedSection delay={200} className="mt-12">
            <h3 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
              {ourMission?.heading || "Our Mission Is To:"}
            </h3>
            <ul className="mt-6 max-w-3xl space-y-4">
              {missionItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 rounded-xl border-l-4 border-[#8BB63A] bg-green-50/50 py-3 pl-5 pr-4"
                >
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#8BB63A]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="leading-relaxed text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
