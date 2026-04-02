import "@/app/globals.css";
import { createClient } from "@/lib/supabase/server";
import Script from "next/script";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/header";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}
function InstagramIcon({ className }: { className?: string }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
}
function YoutubeIcon({ className }: { className?: string }) {
  return <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
}

export const revalidate = 60;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  const raw = settings ?? {};
  const s = {
    address_street: raw.address_street || "1000 W. 94th St",
    address_city: raw.address_city || "Bloomington",
    address_state: raw.address_state || "MN",
    address_zip: raw.address_zip || "55420",
    address_full: raw.address_street
      ? `${raw.address_street}, ${raw.address_city}, ${raw.address_state} ${raw.address_zip}`
      : "1000 W. 94th St, Bloomington, MN 55420",
    phone_office: raw.phone_office || "(952) 882 6182",
    phone_office_raw: (raw.phone_office || "9528826182").replace(/\D/g, ""),
    phone_sales: raw.phone_sales || "(612) 236 6190",
    phone_sales_raw: (raw.phone_sales || "6122366190").replace(/\D/g, ""),
    hours: raw.hours_display || "Always Open",
    facebook_url: raw.facebook_url || "https://m.facebook.com/GDLStoneSnow/?_rdr",
    instagram_url: raw.instagram_url || "https://instagram.com/gdlstonesnowllc",
    youtube_url: raw.youtube_url || "https://www.youtube.com/channel/UC4ingZfTXS1jpl1vKMjNVJw/videos",
    business_name: raw.business_name || "GDL Stone Snow LLC",
    email: raw.email || "camoren000@gmail.com",
    meta_description: raw.meta_description || "GDL Stone Snow LLC offers expert landscaping, masonry, lawn care & snow removal in Bloomington MN & the Twin Cities metro. Serving since 2003. Free estimates!",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": "https://gdlstonesnow.com/#business",
    name: s.business_name,
    url: "https://gdlstonesnow.com/",
    logo: "https://gdlstonesnow.com/images/logo.png",
    image: "https://gdlstonesnow.com/images/logo.png",
    description:
      "Expert landscaping, masonry, lawn care and snow removal services in Bloomington MN and the Minneapolis-St. Paul metro area since 2003.",
    telephone: s.phone_office,
    email: s.email,
    foundingDate: "2003",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address_street,
      addressLocality: s.address_city,
      addressRegion: s.address_state,
      postalCode: s.address_zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 44.8408,
      longitude: -93.2866,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: [
      { "@type": "City", name: "Bloomington", sameAs: "https://en.wikipedia.org/wiki/Bloomington,_Minnesota" },
      { "@type": "City", name: "Minneapolis", sameAs: "https://en.wikipedia.org/wiki/Minneapolis" },
      { "@type": "City", name: "St. Paul", sameAs: "https://en.wikipedia.org/wiki/Saint_Paul,_Minnesota" },
      { "@type": "City", name: "Edina" },
      { "@type": "City", name: "Richfield" },
      { "@type": "City", name: "Burnsville" },
      { "@type": "City", name: "Eagan" },
      { "@type": "City", name: "Eden Prairie" },
      { "@type": "City", name: "Minnetonka" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Landscaping & Snow Removal Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Landscaping" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Lawn Care" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Masonry & Stone Work" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Irrigation" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Snow Removal" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ice Management" } },
      ],
    },
    sameAs: [s.facebook_url, s.instagram_url, s.youtube_url].filter(Boolean),
  };

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/promotions", label: "Promotions" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta name="ai-content-declaration" content="This website contains information about GDL Stone Snow LLC, a landscaping, masonry, and snow removal company in Bloomington, Minnesota. Founded in 2003 by Fernando Floersch. Serving the Minneapolis-St. Paul metro area. Office: (952) 882-6182. Services include landscaping, lawn care, masonry, stone work, irrigation, snow removal, and ice management." />
        <link rel="author" href="/humans.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <Header />

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-gray-300 dark:bg-[#0a0a0a] dark:text-gray-400">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Col 1: Logo + Description */}
            <div>
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt={`${s.business_name} - Landscaping and Snow Removal in Bloomington MN`}
                  width={180}
                  height={56}
                  className="mb-4 h-14 w-auto"
                />
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-gray-400 dark:text-gray-500">
                Locally owned and operated since 2003, {s.business_name} delivers
                dependable landscaping, masonry, and snow removal to homes and
                businesses across the Minneapolis-St. Paul metro. Licensed, insured,
                and built on 23+ years of trust.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <nav aria-label="Footer navigation">
              <h3 className="mb-4 text-lg font-semibold text-white dark:text-gray-100">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-[#8BB63A] dark:text-gray-500 dark:hover:text-[#8BB63A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Col 3: Contact Info + Social */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white dark:text-gray-100">Contact Info</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8BB63A]" />
                  <span>{s.address_full}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8BB63A]" />
                  <div>
                    <a href={`tel:${s.phone_office_raw}`} className="transition-colors hover:text-[#8BB63A]">
                      Office: {s.phone_office}
                    </a>
                    <br />
                    <a href={`tel:${s.phone_sales_raw}`} className="transition-colors hover:text-[#8BB63A]">
                      Sales: {s.phone_sales}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8BB63A]" />
                  <a href={`mailto:${s.email}`} className="transition-colors hover:text-[#8BB63A]">
                    {s.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#8BB63A]" />
                  <span>{s.hours}</span>
                </li>
              </ul>

              {/* Social Icons */}
              <div className="mt-6 flex gap-4">
                {s.facebook_url && (
                  <a
                    href={s.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our Facebook page"
                    className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-[#8BB63A] hover:text-white dark:bg-gray-800/60 dark:text-gray-500 dark:hover:bg-[#8BB63A] dark:hover:text-white"
                  >
                    <FacebookIcon className="h-5 w-5" />
                  </a>
                )}
                {s.instagram_url && (
                  <a
                    href={s.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our Instagram profile"
                    className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-[#8BB63A] hover:text-white dark:bg-gray-800/60 dark:text-gray-500 dark:hover:bg-[#8BB63A] dark:hover:text-white"
                  >
                    <InstagramIcon className="h-5 w-5" />
                  </a>
                )}
                {s.youtube_url && (
                  <a
                    href={s.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our YouTube channel"
                    className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-[#8BB63A] hover:text-white dark:bg-gray-800/60 dark:text-gray-500 dark:hover:bg-[#8BB63A] dark:hover:text-white"
                  >
                    <YoutubeIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="border-t border-gray-800 dark:border-gray-800/60">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-600">
              &copy; {new Date().getFullYear()} {s.business_name}. All rights reserved. Bloomington, MN.
            </p>
          </div>
        </div>
      </footer>

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-3W3QSQZ30N"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3W3QSQZ30N');
        `}
      </Script>
    </>
  );
}
