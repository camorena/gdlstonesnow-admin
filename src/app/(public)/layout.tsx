import { createClient } from "@/lib/supabase/server";
import Script from "next/script";

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

  // Map DB fields to template fields
  const raw = settings ?? {};
  const s = {
    address: raw.address_street ? `${raw.address_street} ${raw.address_city} ${raw.address_state} ${raw.address_zip}` : "1000 W. 94th St. Bloomington MN 55420",
    address_short: raw.address_street ? `${raw.address_street} ${raw.address_city}` : "1000 W.94th St. Bloomington",
    address_state_zip: raw.address_state ? `${raw.address_state} ${raw.address_zip}` : "MN 55420",
    office_phone: raw.phone_office || "(952) 882 6182",
    office_phone_raw: (raw.phone_office || "9528826182").replace(/\D/g, ""),
    sales_phone: raw.phone_sales || "(612) 236 6190",
    sales_phone_raw: (raw.phone_sales || "6122366190").replace(/\D/g, ""),
    hours: raw.hours_display || "Always Open",
    facebook_url: raw.facebook_url || "https://m.facebook.com/GDLStoneSnow/?_rdr",
    instagram_url: raw.instagram_url || "https://instagram.com/gdlstonesnowllc",
    youtube_url: raw.youtube_url || "https://www.youtube.com/channel/UC4ingZfTXS1jpl1vKMjNVJw/videos",
    site_name: raw.business_name || "GDL Stone Snow",
    email: raw.email || "camoren000@gmail.com",
    google_maps_embed: raw.google_maps_embed || "",
    logo_alt: "GDL Stone Snow LLC - Landscaping and Snow Removal Bloomington MN",
    meta_title: "Landscaping & Snow Removal Bloomington MN | GDL Stone Snow",
    meta_description: raw.meta_description || "GDL Stone Snow LLC offers expert landscaping, masonry, lawn care & snow removal in Bloomington MN & the Twin Cities metro. Serving since 2003. Free estimates!",
    meta_keywords: "landscaping Bloomington MN, snow removal Minneapolis, masonry contractor, lawn care Twin Cities, stone work Minnesota, ice control management",
  };

  return (
    <>
      <head>
        {/* Revolution Slider */}
        <link rel="stylesheet" type="text/css" href="/rs-plugin/css/settings.css" />
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="//fonts.googleapis.com/css?family=Raleway:300,400,500&subset=latin-ext"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="//fonts.googleapis.com/css?family=Lato:300,400,700,900&subset=latin-ext"
          rel="stylesheet"
          type="text/css"
        />
        {/* Stylesheets */}
        <link rel="stylesheet" type="text/css" href="/style/reset.css" />
        <link rel="stylesheet" type="text/css" href="/style/superfish.css" />
        <link rel="stylesheet" type="text/css" href="/style/prettyPhoto.css" />
        <link rel="stylesheet" type="text/css" href="/style/jquery.qtip.css" />
        <link rel="stylesheet" type="text/css" href="/style/alerts.css" />
        <link rel="stylesheet" type="text/css" href="/style/style.css" />
        <link rel="stylesheet" type="text/css" href="/style/animations.css" />
        <link rel="stylesheet" type="text/css" href="/style/responsive.css" />
        <link rel="stylesheet" type="text/css" href="/style/odometer-theme-default.css" />
        {/* Icon fonts */}
        <link rel="stylesheet" type="text/css" href="/fonts/features/style.css" />
        <link rel="stylesheet" type="text/css" href="/fonts/template/style.css" />
        <link rel="stylesheet" type="text/css" href="/fonts/social/style.css" />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HomeAndConstructionBusiness",
              name: s.site_name || "GDL Stone Snow LLC",
              url: "https://gdlstonesnow.com/",
              logo: "https://gdlstonesnow.com/images/logo.png",
              image: "https://gdlstonesnow.com/images/logo.png",
              description:
                "Expert landscaping, masonry, lawn care and snow removal services in Bloomington MN and the Minneapolis-St. Paul metro area since 2003.",
              telephone: s.office_phone,
              foundingDate: "2003",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1000 W. 94th St",
                addressLocality: "Bloomington",
                addressRegion: "MN",
                postalCode: "55420",
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
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
              },
              areaServed: {
                "@type": "GeoCircle",
                geoMidpoint: {
                  "@type": "GeoCoordinates",
                  latitude: 44.9778,
                  longitude: -93.265,
                },
                geoRadius: "50000",
                name: "Minneapolis-St. Paul Metro Area",
              },
              sameAs: [
                s.facebook_url,
                s.instagram_url,
                s.youtube_url,
              ].filter(Boolean),
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://gdlstonesnow.com/",
                },
              ],
            }),
          }}
        />
      </head>

      <div className="site-container">
        {/* Header Top Bar */}
        <div className="header-top-bar-container clearfix">
          <div className="header-top-bar">
            <ul className="contact-details clearfix">
              <li className="template-location">
                {s.address}
              </li>
              <li className="features-phone">
                Office
                <a href={`tel:${s.office_phone_raw}`}>{s.office_phone} </a>
              </li>
              <li className="template-mobile">
                Sales
                <a href={`tel:${s.sales_phone_raw}`}>{s.sales_phone}</a>
              </li>
              <li className="template-clock">{s.hours}</li>
            </ul>
            <ul className="social-icons">
              {s.facebook_url && (
                <li>
                  <a
                    target="_blank"
                    href={s.facebook_url}
                    className="social-facebook"
                    title="facebook"
                    aria-label="Visit our Facebook page"
                    rel="noopener"
                  ></a>
                </li>
              )}
              {s.instagram_url && (
                <li>
                  <a
                    target="_blank"
                    href={s.instagram_url}
                    className="social-instagram"
                    title="instagram"
                    aria-label="Visit our Instagram profile"
                    rel="noopener"
                  ></a>
                </li>
              )}
              {s.youtube_url && (
                <li>
                  <a
                    target="_blank"
                    href={s.youtube_url}
                    className="social-youtube"
                    title="youtube"
                    aria-label="Visit our YouTube channel"
                    rel="noopener"
                  ></a>
                </li>
              )}
            </ul>
          </div>
          <a href="#" className="header-toggle template-arrow-vertical-3" aria-label="Toggle header bar"></a>
        </div>

        {/* Header */}
        <div className="header-container sticky">
          <div className="header clearfix">
            <div className="menu-container first-menu clearfix">
              <nav aria-label="Main navigation">
                <ul className="sf-menu">
                  <li>
                    <a href="/" title="Home"> HOME </a>
                  </li>
                  <li>
                    <a href="/services" title="Services"> SERVICES </a>
                  </li>
                  <li>
                    <a href="/gallery" title="Gallery"> GALLERY </a>
                  </li>
                </ul>
              </nav>
              <div className="mobile-menu-container">
                <nav aria-label="Mobile navigation">
                  <ul className="mobile-menu collapsible-mobile-submenus">
                    <li className="selected">
                      <a className="template-arrow-vertical-3" href="#">&nbsp;</a>
                    </li>
                    <li>
                      <a href="/" title="Home"> HOME </a>
                    </li>
                    <li>
                      <a href="/services" title="Services"> SERVICES </a>
                    </li>
                    <li>
                      <a href="/gallery" title="Gallery"> GALLERY </a>
                    </li>
                    <li>
                      <a href="/promotions" title="Promotions"> PROMOTIONS </a>
                    </li>
                    <li>
                      <a href="/contact" title="Contact"> CONTACT </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="logo">
              <h1>
                <a href="/" title={s.site_name}>
                  <img
                    src="/images/logo.png"
                    srcSet="/images/logo.png 2x"
                    className="primary-logo"
                    alt={s.logo_alt}
                  />
                  <img
                    src="/images/logo_transparent.png"
                    srcSet="/images/logo_transparent.png 2x"
                    className="secondary-logo"
                    alt={s.logo_alt}
                  />
                  <span className="logo-text">{s.site_name}</span>
                </a>
              </h1>
              <div className="logo-clone">
                <h1>
                  <a href="/" title={s.site_name}>
                    <img
                      src="/images/logo.png"
                      srcSet="/images/logo.png 2x"
                      className="primary-logo"
                      alt={s.logo_alt}
                    />
                    <img
                      src="/images/logo_transparent.png"
                      srcSet="/images/logo_transparent.png 2x"
                      className="secondary-logo"
                      alt={s.logo_alt}
                    />
                    <span className="logo-text">{s.site_name}</span>
                  </a>
                </h1>
              </div>
            </div>
            <a href="#" className="mobile-menu-switch" aria-label="Open mobile menu">
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </a>
            <div className="menu-container clearfix first-menu">
              <nav aria-label="Secondary navigation">
                <ul className="sf-menu">
                  <li>
                    <a href="/promotions" title="Promotions"> PROMOTIONS </a>
                  </li>
                  <li>
                    <a href="/contact" title="Contact"> CONTACT </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {children}

        {/* Pre-Footer */}
        <div className="row dark footer-row full-width padding-top-30">
          <div className="row padding-bottom-33">
            <div className="column column-1-3">
              <ul className="contact-details-list">
                <li className="features-phone">
                  <label>CALL US TODAY</label>
                  <p>
                    <a href={`tel:${s.office_phone_raw}`}>{s.office_phone}</a>
                  </p>
                </li>
              </ul>
            </div>
            <div className="column column-1-3">
              <ul className="contact-details-list">
                <li className="features-map">
                  <label>{s.address_short}</label>
                  <p>{s.address_state_zip}</p>
                </li>
              </ul>
            </div>
            <div className="column column-1-3">
              <ul className="contact-details-list">
                <li className="features-wallet">
                  <label>CONTACT US</label>
                  <p>
                    <a href="/contact" title="Free Estimate">Get a free Estimate</a>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="row dark-gray footer-row full-width padding-top-61 padding-bottom-36">
          <div className="row row-3-4">
            <div className="column column-1-2">
              <div className="our-clients-list-container margin-top-40 type-list">
                <ul className="our-clients-list type-list">
                  <li className="vertical-align">
                    <div className="our-clients-item-container">
                      <div className="vertical-align-cell">
                        <a>
                          <img src="/images/logos/bbb.png" alt="Better Business Bureau member" loading="lazy" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="vertical-align">
                    <div className="our-clients-item-container">
                      <div className="vertical-align-cell">
                        <a>
                          <img src="/images/logos/nfib.jpg" alt="National Federation of Independent Business member" loading="lazy" />
                        </a>
                      </div>
                    </div>
                  </li>
                  <li className="vertical-align">
                    <div className="our-clients-item-container">
                      <div className="vertical-align-cell">
                        <a>
                          <img src="/images/logos/mnla.png" alt="Minnesota Nursery and Landscape Association member" loading="lazy" />
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="column column-1-2">
              <h6>CONTACT INFO</h6>
              <ul className="contact-data margin-top-20">
                <li className="template-location">
                  <div className="value">{s.address}</div>
                </li>
                <li className="template-mobile">
                  <div className="value">
                    <a href={`tel:${s.office_phone_raw}`}>Office {s.office_phone}</a>
                  </div>
                </li>
                <li className="template-mobile">
                  <div className="value">
                    <a href={`tel:${s.sales_phone_raw}`}>Sales {s.sales_phone}</a>
                  </div>
                </li>
                <li className="template-clock">
                  <div className="value">{s.hours}</div>
                </li>
              </ul>
            </div>
          </div>
          <div className="row page-padding-top">
            <ul className="social-icons align-center">
              {s.facebook_url && (
                <li>
                  <a
                    target="_blank"
                    href={s.facebook_url}
                    className="social-facebook"
                    title="facebook"
                    aria-label="Visit our Facebook page"
                    rel="noopener"
                  ></a>
                </li>
              )}
              {s.instagram_url && (
                <li>
                  <a
                    target="_blank"
                    href={s.instagram_url}
                    className="social-instagram"
                    title="instagram"
                    aria-label="Visit our Instagram profile"
                    rel="noopener"
                  ></a>
                </li>
              )}
              {s.youtube_url && (
                <li>
                  <a
                    target="_blank"
                    href={s.youtube_url}
                    className="social-youtube"
                    title="youtube"
                    aria-label="Visit our YouTube channel"
                    rel="noopener"
                  ></a>
                </li>
              )}
            </ul>
          </div>
          <div className="row align-center padding-top-30">
            <span className="copyright">
              &copy; Copyright {new Date().getFullYear()}{" "}
              <a href="" title="" target="_blank">Powered</a> by{" "}
              <a href="http://datelica.com" title="Datelica" target="_blank">
                Datelica
              </a>
            </span>
          </div>
        </div>
      </div>

      <a
        href="#top"
        className="scroll-top animated-element template-arrow-vertical-3"
        title="Scroll to top"
      ></a>
      <div className="background-overlay"></div>

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

      {/* JS Dependencies */}
      <Script src="/js/jquery-1.12.4.min.js" strategy="beforeInteractive" />
      <Script src="/js/jquery-migrate-1.4.1.min.js" strategy="beforeInteractive" />
      {/* Revolution Slider */}
      <Script src="/rs-plugin/js/jquery.themepunch.tools.min.js" strategy="afterInteractive" />
      <Script src="/rs-plugin/js/jquery.themepunch.revolution.min.js" strategy="afterInteractive" />
      {/* jQuery Plugins */}
      <Script src="/js/jquery.ba-bbq.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery-ui-1.12.1.custom.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery.ui.touch-punch.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery.easing.1.3.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery.carouFredSel-6.2.1-packed.js" strategy="afterInteractive" />
      <Script src="/js/jquery.touchSwipe.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery.transit.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery.timeago.js" strategy="afterInteractive" />
      <Script src="/js/jquery.hint.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery.costCalculator.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery.parallax.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery.prettyPhoto.js" strategy="afterInteractive" />
      <Script src="/js/jquery.qtip.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery.blockUI.min.js" strategy="afterInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />
      <Script src="/js/custom.js" strategy="afterInteractive" />
      <Script src="/js/odometer.min.js" strategy="afterInteractive" />
    </>
  );
}
