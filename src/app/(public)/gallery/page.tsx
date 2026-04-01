import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/types/database";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Project Gallery | GDL Stone Snow Bloomington MN",
  description:
    "Browse landscaping, masonry, stone work, and snow removal projects by GDL Stone Snow LLC. Serving Bloomington and the Twin Cities metro since 2003.",
};

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: galleryItems } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const items: GalleryItem[] = galleryItems ?? [];

  // Split items into rows of 3
  const rows: GalleryItem[][] = [];
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3));
  }

  return (
    <div className="theme-page padding-bottom-100">
      <div className="row gray full-width page-header vertical-align-table">
        <div className="row">
          <div className="page-header-left">
            <h1>GALLERY</h1>
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
                <li>Gallery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row page-margin-top-section">
        <div className="container mb-5 pb-3">
          <div className="column">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex}>
                {rowIndex > 0 && <div className="margin-top-27"></div>}
                <div className="row">
                  {row.map((item, itemIndex) => (
                    <div key={item.id} className="column column-1-3">
                      {item.type === "video" ? (
                        <a
                          href={item.url}
                          className="prettyPhoto cm-preload"
                          title={item.title ?? ""}
                          data-rel="prettyPhoto"
                          style={{ position: "relative", display: "block" }}
                        >
                          <img
                            src={item.thumbnail_url ?? item.url}
                            alt={item.alt_text ?? item.title ?? "Video"}
                            {...(rowIndex > 0 ? { loading: "lazy" } : {})}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: "60px",
                              height: "60px",
                              background: "rgba(0,0,0,0.6)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div
                              style={{
                                width: 0,
                                height: 0,
                                borderTop: "12px solid transparent",
                                borderBottom: "12px solid transparent",
                                borderLeft: "20px solid white",
                                marginLeft: "4px",
                              }}
                            />
                          </div>
                        </a>
                      ) : (
                        <a
                          href={item.url}
                          className="prettyPhoto cm-preload"
                          title={item.title ?? ""}
                        >
                          <img
                            src={item.thumbnail_url ?? item.url}
                            alt={item.alt_text ?? item.title ?? "Gallery image"}
                            {...(rowIndex > 0 ? { loading: "lazy" } : {})}
                          />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="divider margin-top-27"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
