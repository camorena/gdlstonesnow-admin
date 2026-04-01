import { createClient } from "@/lib/supabase/server";
import type { ContentBlock, SiteSettings } from "@/types/database";
import ContactForm from "./contact-form";

export const revalidate = 60;

export default async function ContactPage() {
  const supabase = await createClient();

  const [{ data: contentBlocks }, { data: settingsRows }] = await Promise.all([
    supabase
      .from("content_blocks")
      .select("*")
      .eq("page", "contact"),
    supabase
      .from("site_settings")
      .select("*")
      .limit(1),
  ]);

  const blocks = (contentBlocks ?? []) as ContentBlock[];
  const settings = (settingsRows?.[0] ?? null) as SiteSettings | null;

  const whoWeAre = blocks.find((b) => b.section === "who_we_are");
  const ourMission = blocks.find((b) => b.section === "our_mission");

  // Parse mission items from body (expect newline-separated bullet points)
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

  return (
    <div className="theme-page padding-bottom-100">
      <div className="row gray full-width page-header vertical-align-table">
        <div className="row">
          <div className="page-header-left">
            <h1>CONTACT</h1>
          </div>
          <div className="page-header-right">
            <div className="bread-crumb-container">
              <ul className="bread-crumb">
                <li>
                  <a title="Home" href="/">
                    Home
                  </a>
                </li>
                <li className="separator">&#47;</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="clearfix">
        <div className="row page-margin-top-section">
          <div className="column column-1-2">
            <div className="row">
              <a
                href="images/pages/640x480/about-1.jpg"
                className="prettyPhoto cm-preload"
                title="About us"
              >
                <img
                  src="images/pages/640x480/about-1.jpg"
                  alt="GDL Stone Snow team and office in Bloomington MN"
                />
              </a>
            </div>
            <div className="row margin-top-30">
              <div className="column column-1-2">
                <a
                  href="images/pages/480x320/about-1.jpg"
                  className="prettyPhoto cm-preload"
                  title="About us"
                >
                  <img
                    src="images/pages/370x246/about-1.jpg"
                    alt="Landscaping services by GDL Stone Snow"
                  />
                </a>
              </div>
              <div className="column column-1-2">
                <a
                  href="images/pages/480x320/about-2.jpg"
                  className="prettyPhoto cm-preload"
                  title="About us"
                >
                  <img
                    src="images/pages/370x246/about-2.jpg"
                    alt="Stone work and masonry projects Twin Cities"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="column column-1-2">
            <div className="row padding-left-right-30">
              <h2 className="box-header align-left">
                {whoWeAre?.heading || "WHO WE ARE"}
              </h2>
              {whoWeAre?.body ? (
                whoWeAre.body.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "description"
                        : "description padding-0 margin-top-20"
                    }
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p className="description">
                    In 2003 Fernando Floersch, owner of GDL-Stone Snow LLC.,
                    created a united front and a shared belief that caring for
                    our customers and team members should be the heart of the
                    company. With consistent, excellent and proactive services,
                    steady client focus GDL could deliver future investments
                    everyday and everywhere with a wide range of people. He
                    takes great pride in his family owned and operated business.
                  </p>
                  <p className="description padding-0 margin-top-20">
                    We have been in the landscape, lawn care and snow removal
                    industry since 2003 and have successfully landed nationwide
                    accounts with large corporations such as, Pinnacle
                    Properties, Caspian Group, Sherman &amp; Associates, Walser
                    Corporation, and RMK Management. We take pride in providing
                    top notch service along with industry leading principles and
                    procedures in landscaping, design and maintenance.
                  </p>
                </>
              )}
              <h4 className="margin-top-15">
                {ourMission?.heading || "OUR MISSION IS TO:"}
              </h4>
              <ul
                className="list margin-top-15"
                style={{
                  listStyle: "none",
                  padding: 0,
                  marginLeft: 0,
                }}
              >
                {missionItems.map((item, i) => (
                  <li
                    key={i}
                    className="template-tick-1"
                    style={{
                      padding: "8px 0 8px 35px",
                      lineHeight: "24px",
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="clearfix">
        <div className="row margin-top-67">
          <div className="overflow-hidden">
            <h5 style={{ textAlign: "center" }}>FIND US</h5>
            <br />
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "40%",
                minHeight: "250px",
                overflow: "hidden",
              }}
            >
              <iframe
                src={mapsEmbed}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className="clearfix">
        <div className="row margin-top-67">
          <div className="overflow-hidden">
            <h5 style={{ textAlign: "center" }}>CONTACT US</h5>
            <br />
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
