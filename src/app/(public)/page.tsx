import { createClient } from "@/lib/supabase/server";

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
    supabase
      .from("content_blocks")
      .select("*")
      .eq("page", "home"),
    supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .limit(3),
  ]);

  // Helper to find a content block by slug
  const block = (slug: string) =>
    contentBlocks?.find((b: { slug: string }) => b.slug === slug);

  const servicesIntro = block("services-intro");
  const reasonsToChoose = block("reasons-to-choose");
  const aboutCompany = block("about-company");
  const ourMission = block("our-mission");
  const ourServicesSection = block("our-services");
  const wantToTalk = block("want-to-talk");
  const statsSection = block("stats");

  // Fallback slides if DB is empty
  const displaySlides = slides && slides.length > 0 ? slides : [
    {
      image_url: "/images/slider/slider-1-1.jpg",
      image_alt: "Professional landscape maintenance services in Bloomington MN",
      subtitle: "Complete grounds maintenance services to suit any budget.",
      title_line1: "Landscape",
      title_line2: "Maintenance Service",
      cta_text: "GET A NO OBLIGATION QUOTE TODAY!",
      cta_url: "/contact",
    },
    {
      image_url: "/images/slider/slider-1-1.jpg",
      image_alt: "Lawn care and grounds maintenance by GDL Stone Snow",
      subtitle: "Lawn care Maintenance",
      title_line1: "CONTINUOUS PURSUIT",
      title_line2: "FOR PERFECTION",
      cta_text: "GET A FREE ESTIMATE!",
      cta_url: "/contact",
    },
    {
      image_url: "/images/slider/slider-1-3.jpg",
      image_alt: "Winter snow removal and ice control services in Minneapolis-St. Paul",
      subtitle: "Discover what we can do",
      title_line1: "WINTER SERVICES",
      title_line2: "TO KEEP YOU UP & RUNNING",
      cta_text: "CONTACT US!",
      cta_url: "/contact",
    },
  ];

  // Fallback testimonials
  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : [
    {
      body: "GDL Stone Snow did a terrific job. They build a beautiful monument in the backyard - they really paid attention to detail. Thank you!",
      author: "STACEY, EDINA",
    },
    {
      body: "We would like to thank GDL Stone Snow for an outstanding effort on this recently completed project located in Minnetonka. The project involved a very aggressive schedule and it was completed on time.",
      author: "MARK, MINNETONKA",
    },
  ];

  return (
    <>
      {/* Revolution Slider */}
      <div className="revolution-slider-container">
        <div
          className="revolution-slider"
          data-version="5.4.5"
          style={{ display: "none" }}
        >
          <ul>
            {displaySlides.map((slide: Record<string, string>, index: number) => (
              <li
                key={index}
                data-transition="fade"
                data-masterspeed="500"
                data-slotamount="1"
                data-delay="6000"
              >
                {/* MAIN IMAGE */}
                <img
                  src={slide.image_url}
                  alt={slide.image_alt || ""}
                  data-bgfit="cover"
                />
                {/* LAYER 01 */}
                <div
                  className={`tp-caption${index > 0 ? " customin customout" : ""}`}
                  data-frames='[{"delay":500,"speed":1500,"from":"y:-40;o:0;","ease":"easeInOutExpo"},{"delay":"wait","speed":500,"to":"o:0;","ease":"easeInOutExpo"}]'
                  data-x="center"
                  data-y="['211', '197', '120', '148']"
                >
                  <h4>{slide.subtitle}</h4>
                </div>
                {/* LAYER 02 */}
                <div
                  className={`tp-caption${index > 0 ? " customin customout" : ""}`}
                  data-frames='[{"delay":900,"speed":2000,"from":"y:40;o:0;","ease":"easeInOutExpo"},{"delay":"wait","speed":500,"to":"o:0;","ease":"easeInOutExpo"}]'
                  data-x="center"
                  data-y="['273', '253', '160', '190']"
                >
                  <h2 className="slider-subtitle">
                    <strong>{slide.title_line1}</strong>
                  </h2>
                </div>
                {/* LAYER 03 */}
                <div
                  className={`tp-caption${index > 0 ? " customin customout" : ""}`}
                  data-frames='[{"delay":1100,"speed":2000,"from":"y:40;o:0;","ease":"easeInOutExpo"},{"delay":"wait","speed":500,"to":"o:0;","ease":"easeInOutExpo"}]'
                  data-x="center"
                  data-y="['345', '308', '196', '220']"
                >
                  <h2 className="slider-subtitle">
                    <strong>{slide.title_line2}</strong>
                  </h2>
                </div>
                {/* LAYER 04 */}
                <div
                  className={`tp-caption${index > 0 ? " customin customout" : ""}`}
                  data-frames='[{"delay":1500,"speed":1500,"from":"y:40;o:0;","ease":"easeInOutExpo"},{"delay":"wait","speed":500,"to":"o:0;","ease":"easeInOutExpo"}]'
                  data-x="center"
                  data-y="['476', '418', '264', '283']"
                >
                  <div className="align-center">
                    <a className="more" href={slide.cta_url || "/contact"} title="Quote">
                      {slide.cta_text}
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="theme-page">
        <div className="clearfix">
          {/* Services Cards */}
          <div className="row margin-top-89">
            <div className="row">
              <h2 className="box-header">
                {servicesIntro?.title || "OUR SERVICES"}
              </h2>
              <p className="description align-center">
                {servicesIntro?.subtitle ||
                  "We provide exceptional services to a wide range of commercial and residential customers"}
              </p>
              <div className="carousel-container margin-top-65 clearfix">
                <ul className="services-list horizontal-carousel clearfix page-margin-top">
                  {services && services.length > 0 ? (
                    services.slice(0, 3).map(
                      (
                        service: {
                          id: string;
                          slug: string;
                          title: string;
                          image_url: string;
                          image_alt: string;
                          description: string;
                        },
                        index: number
                      ) => (
                        <li className="column column-1-3" key={service.id || index}>
                          <a href="/services" title={`${service.title} Services`}>
                            <img
                              src={service.image_url}
                              alt={service.image_alt || service.title}
                              loading="lazy"
                            />
                          </a>
                          <h4 className="box-header">
                            <a href="/services" title={`${service.title} Services`}>
                              {service.title}
                            </a>
                          </h4>
                          <p>{service.description}</p>
                        </li>
                      )
                    )
                  ) : (
                    <>
                      <li className="column column-1-3">
                        <a href="/services" title="Landscape Services">
                          <img
                            src="/images/pages/480x320/landscape.jpg"
                            alt="Professional landscape design services in the Twin Cities"
                            loading="lazy"
                          />
                        </a>
                        <h4 className="box-header">
                          <a href="/services" title="Landscape Services">LANDSCAPE</a>
                        </h4>
                        <p>
                          We take pride in providing top notch service along with
                          industry leading principles and procedures in landscape
                          design.GDL has been in the Ladscape Industry since 2003
                          creating and mastering landscape designs throughout the Twin
                          Cities.
                        </p>
                      </li>
                      <li className="column column-1-3">
                        <a href="/services" title="Lawncare Services">
                          <img
                            src="/images/pages/480x320/lawncare-services.jpg"
                            alt="Commercial and residential lawn care services in Bloomington MN"
                            loading="lazy"
                          />
                        </a>
                        <h4 className="box-header">
                          <a href="/services" title="Lawncare Services">LAWN CARE</a>
                        </h4>
                        <p>
                          We provide lawn care services to a wide range of commercial
                          and residential properties. Our company delivers its promise
                          to you, our client, and values your business. The needs of
                          your business remain our top focus for the entire period of
                          service
                        </p>
                      </li>
                      <li className="column column-1-3">
                        <a href="/services" title="Snow Removal Services">
                          <img
                            src="/images/pages/480x320/snow-removal-services.jpg"
                            alt="Snow removal and ice management services in Minneapolis-St. Paul"
                            loading="lazy"
                          />
                        </a>
                        <h4 className="box-header">
                          <a href="/services" title="Snow Removal Services">
                            SNOW REMOVAL
                          </a>
                        </h4>
                        <p>
                          Snow and ice removal services can be customized to fit your
                          need. We have the equipment to accommodate any residential or
                          commercial request, while providing the best possible
                          solution.
                        </p>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Reasons to Choose Us */}
          <div className="row full-width gray flex-box page-margin-top-section">
            <div className="column column-1-2 background-1">
              <a className="flex-hide" href="/about" title="About">
                <img
                  src={reasonsToChoose?.image_url || "/images/pages/960x750/ourservices-1.jpg"}
                  alt={reasonsToChoose?.image_alt || "GDL Stone Snow landscaping and grounds maintenance work"}
                />
              </a>
            </div>
            <div className="column column-1-2 padding-bottom-96">
              <div className="row padding-left-right-100">
                <h2 className="box-header align-left margin-top-89">
                  {reasonsToChoose?.title || "REASONS TO CHOOSE US"}
                </h2>
                {reasonsToChoose?.body ? (
                  <div dangerouslySetInnerHTML={{ __html: reasonsToChoose.body }} />
                ) : (
                  <>
                    <p className="description">
                      GDL has been in the Landscape Industry since 2003 creating and
                      mastering landscape designs throughout the Twin Cities. We take
                      pride in providing top notch service along with industry leading
                      principles and procedures in landscape design.
                    </p>
                    <div className="row page-margin-top">
                      <ol className="features-list">
                        <li className="column column-1-2">
                          <span className="list-number">1</span>
                          <h4>SERVICES</h4>
                          <p>
                            Professional Landscape and Snow management services. Our
                            company has many years of experience and our customer
                            focused approach makes the difference.
                          </p>
                        </li>
                        <li className="column column-1-2">
                          <span className="list-number">2</span>
                          <h4>CREATING DREAMS</h4>
                          <p>
                            Our experienced crews set the standard by creating elegant
                            landscape designs and making dreams come true.
                          </p>
                        </li>
                      </ol>
                    </div>
                    <div className="row page-margin-top">
                      <ol className="features-list">
                        <li className="column column-1-2">
                          <span className="list-number">3</span>
                          <h4>SNOW PROS</h4>
                          <p>Leading the industry on snow removal.</p>
                        </li>
                        <li className="column column-1-2">
                          <span className="list-number">4</span>
                          <h4>MASTER GARDENER</h4>
                          <p>
                            Dedicated floral designer to create and design flower bed
                            and seasonal poting arrangements.
                          </p>
                        </li>
                      </ol>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* About Our Company */}
          <div className="row page-margin-top-section padding-bottom-100">
            <div className="column column-1-2">
              <h2 className="box-header">
                {aboutCompany?.title || "ABOUT OUR COMPANY"}
              </h2>
              <p className="description align-center">
                {aboutCompany?.subtitle || "Exceptional level of service."}
              </p>
              {aboutCompany?.body ? (
                <div
                  className="align-center padding-0 margin-top-27 padding-left-right-35"
                  dangerouslySetInnerHTML={{ __html: aboutCompany.body }}
                />
              ) : (
                <p className="align-center padding-0 margin-top-27 padding-left-right-35">
                  GDL has been in the Landscape Industry since 2003, creating and
                  mastering landscape designs throughout the Twin Cities. We take
                  pride in providing top notch service along with industry leading
                  principles and procedures in landscape design. Our company
                  delivers its promise to you, our client, and values your
                  business. The needs of your business remain our top priority for
                  the entire period of service.
                </p>
              )}
              <div className="align-center page-margin-top padding-bottom-16">
                <a className="more" href="/contact" title="Learn more">
                  Learn more
                </a>
              </div>
            </div>
            <div className="column column-1-4">
              <div className="row">
                <a
                  href="/images/pages/480x693/ourcompany.jpg"
                  className="prettyPhoto cm-preload"
                  title="Our Company"
                >
                  <img
                    src="/images/pages/480x693/ourcompany.jpg"
                    alt="GDL Stone Snow company landscaping project"
                  />
                </a>
              </div>
              <div className="row margin-top-30">
                <a
                  href="/images/pages/480x320/about-1.jpg"
                  className="prettyPhoto cm-preload"
                  title="Our Company"
                >
                  <img
                    src="/images/pages/480x320/about-1.jpg"
                    alt="Masonry and stone work by GDL Stone Snow"
                  />
                </a>
              </div>
            </div>
            <div className="column column-1-4">
              <div className="row">
                <a
                  href="/images/pages/480x320/about-2.jpg"
                  className="prettyPhoto cm-preload"
                  title="Our Company"
                >
                  <img
                    src="/images/pages/480x320/about-2.jpg"
                    alt="Outdoor living space design and installation"
                  />
                </a>
              </div>
              <div className="row margin-top-30">
                <a
                  href="/images/pages/480x320/about-3.jpg"
                  className="prettyPhoto cm-preload"
                  title="Our Company"
                >
                  <img
                    src="/images/pages/480x320/about-3.jpg"
                    alt="Professional grounds maintenance and garden design"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Our Services / Our Mission / Want to Talk */}
          <div className="row full-width gray flex-box">
            <div className="column column-1-3 padding-bottom-96">
              <div className="row padding-left-right-70 margin-top-89">
                <h4>{ourMission?.title || "OUR MISSION IS TO:"}</h4>
                {ourMission?.body ? (
                  <div
                    className="margin-top-20"
                    dangerouslySetInnerHTML={{ __html: ourMission.body }}
                  />
                ) : (
                  <ul className="list margin-top-20">
                    <li className="template-tick-1">
                      Offer a different kind of services to families and Business
                    </li>
                    <li className="template-tick-1">
                      Deliver high quality and consistent services
                    </li>
                    <li className="template-tick-1">
                      Use friendly environmental products
                    </li>
                    <li className="template-tick-1">
                      Provide stable jobs with reasonable wages
                    </li>
                    <li className="template-tick-1">
                      Concentrate our resources on maintaining standards
                    </li>
                    <li className="template-tick-1">
                      Make you an extremely satisfied customer
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="column column-1-3 background-3">
              <a className="flex-hide" href="/contact" title="Our Mission">
                <img
                  src={ourMission?.image_url || "/images/pages/960x750/ourmission.jpg"}
                  alt={ourMission?.image_alt || "GDL Stone Snow team completing a landscaping project"}
                />
              </a>
            </div>
            <div className="column column-1-3 padding-bottom-100">
              <div className="row padding-left-right-70 margin-top-89">
                <h2 className="font-weight-300">
                  {wantToTalk?.title || "Want to talk?"}
                </h2>
                {wantToTalk?.body ? (
                  <div dangerouslySetInnerHTML={{ __html: wantToTalk.body }} />
                ) : (
                  <>
                    <h2>
                      Please call now:{" "}
                      <a href="tel:9528826182">(952) 882 6182</a>
                    </h2>
                    <p className="description margin-top-20">
                      Need a special service? We are happy to fulfill every request
                      in order to exceed your expectations.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Free Estimate CTA */}
          <div className="row full-width padding-top-59 padding-bottom-60 align-center">
            <h3>
              <span className="button-label">DO YOU LIKE WHAT YOU SEE?</span>
              <a className="more" href="/contact" title="Get a free Estimate">
                Get a free Estimate
              </a>
            </h3>
          </div>

          {/* Testimonials */}
          <div className="row full-width padding-top-112 padding-bottom-115 parallax parallax-3 overlay">
            <div className="row testimonials-container">
              <a
                href="#"
                className="slider-control left template-arrow-horizontal-3"
                aria-label="Previous testimonial"
              ></a>
              <ul className="testimonials-list testimonials-carousel">
                {displayTestimonials.map(
                  (
                    testimonial: { id?: string; body: string; author: string; title?: string },
                    index: number
                  ) => (
                    <li key={testimonial.id || index}>
                      <div className="testimonials-icon template-quote"></div>
                      <p>{testimonial.body}</p>
                      <h6>{testimonial.author}</h6>
                      {testimonial.title && (
                        <div className="author-details">{testimonial.title}</div>
                      )}
                    </li>
                  )
                )}
              </ul>
              <a
                href="#"
                className="slider-control right template-arrow-horizontal-3"
                aria-label="Next testimonial"
              ></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
