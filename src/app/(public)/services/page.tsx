import { createClient } from "@/lib/supabase/server";
import type { Service, ServiceItem } from "@/types/database";
import type { Metadata } from "next";

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

  // Sort service_items within each service by sort_order
  const sortedServices: ServiceWithItems[] = (services ?? []).map((service) => ({
    ...service,
    service_items: (service.service_items ?? []).sort(
      (a: ServiceItem, b: ServiceItem) => a.sort_order - b.sort_order
    ),
  }));

  // Split services into rows of 3
  const rows: ServiceWithItems[][] = [];
  for (let i = 0; i < sortedServices.length; i += 3) {
    rows.push(sortedServices.slice(i, i + 3));
  }

  return (
    <div className="theme-page padding-bottom-100">
      <div className="row gray full-width page-header vertical-align-table">
        <div className="row">
          <div className="page-header-left">
            <h1>SERVICES</h1>
          </div>
          <div className="page-header-right">
            <div className="bread-crumb-container">
              <ul className="bread-crumb" aria-label="Breadcrumb">
                <li>
                  <a title="Home" href="/">
                    {" "}
                    Home{" "}
                  </a>
                </li>
                <li className="separator">&#47;</li>
                <li>Services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="clearfix">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row page-margin-top-section">
            <ul className="services-list gray clearfix">
              {row.map((service) => (
                <li key={service.id}>
                  <a title={service.title}>
                    {service.image_url && (
                      <img
                        src={service.image_url}
                        alt={
                          service.image_alt ??
                          `${service.title} service by GDL Stone Snow`
                        }
                      />
                    )}
                  </a>
                  <h4 className="box-header">
                    {service.title.toUpperCase()}
                  </h4>
                  <div className="align-left">
                    {service.service_items.map((item) => (
                      <p
                        key={item.id}
                        className="template-arrow-horizontal-2"
                      >
                        {item.text}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
