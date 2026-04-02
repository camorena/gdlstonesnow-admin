import { createClient } from "@/lib/supabase/server";
import type { ContentBlock, SiteSettings } from "@/types/database";
import ContactForm from "./contact-form";
import AnimatedSection from "../components/animated-section";

export const revalidate = 60;

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
      <div className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-[#8BB63A] transition-colors">
                  Home
                </a>
              </li>
              <li>/</li>
              <li className="text-[#8BB63A]">Contact</li>
            </ol>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl">
            Get in touch with our team for a free estimate or to learn more about our services.
          </p>
        </div>
      </div>

      {/* Contact Form + Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Contact Form */}
          <AnimatedSection className="lg:col-span-3">
            <ContactForm />
          </AnimatedSection>

          {/* Right: Company Info */}
          <AnimatedSection className="lg:col-span-2" delay={200}>
            <div className="bg-white rounded-2xl shadow-md p-8 h-full">
              <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">
                Get In Touch
              </h2>

              <div className="space-y-6">
                {/* Address */}
                {settings?.address_street && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#8BB63A]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#8BB63A]"
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
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Address
                      </p>
                      <p className="text-[#1a1a1a] mt-1">{fullAddress}</p>
                    </div>
                  </div>
                )}

                {/* Office Phone */}
                {settings?.phone_office && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#8BB63A]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#8BB63A]"
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
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Office Phone
                      </p>
                      <a
                        href={`tel:${settings.phone_office.replace(/\D/g, "")}`}
                        className="text-[#1a1a1a] hover:text-[#8BB63A] transition-colors mt-1 inline-block"
                      >
                        {settings.phone_office}
                      </a>
                    </div>
                  </div>
                )}

                {/* Sales Phone */}
                {settings?.phone_sales && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#8BB63A]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#8BB63A]"
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
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Sales Phone
                      </p>
                      <a
                        href={`tel:${settings.phone_sales.replace(/\D/g, "")}`}
                        className="text-[#1a1a1a] hover:text-[#8BB63A] transition-colors mt-1 inline-block"
                      >
                        {settings.phone_sales}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email */}
                {settings?.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#8BB63A]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#8BB63A]"
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
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Email
                      </p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-[#1a1a1a] hover:text-[#8BB63A] transition-colors mt-1 inline-block"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Hours */}
                {settings?.hours_display && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#8BB63A]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#8BB63A]"
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
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        Hours
                      </p>
                      <p className="text-[#1a1a1a] mt-1 whitespace-pre-line">
                        {settings.hours_display}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Google Maps */}
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl overflow-hidden shadow-md">
          <div className="relative w-full" style={{ paddingBottom: "40%", minHeight: "300px" }}>
            <iframe
              src={mapsEmbed}
              className="absolute inset-0 w-full h-full border-0"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">
              {whoWeAre?.heading || "Who We Are"}
            </h2>
            {whoWeAre?.body ? (
              <div className="space-y-4 text-gray-600 leading-relaxed max-w-4xl">
                {whoWeAre.body.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="space-y-4 text-gray-600 leading-relaxed max-w-4xl">
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

          <AnimatedSection delay={200} className="mt-10">
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-6">
              {ourMission?.heading || "Our Mission Is To:"}
            </h3>
            <ul className="space-y-4 max-w-3xl">
              {missionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-[#8BB63A] mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
