import { createClient } from "@/lib/supabase/server";
import type { Promotion, PromotionItem } from "@/types/database";

export const revalidate = 60;

type PromotionWithItems = Promotion & {
  promotion_items: PromotionItem[];
};

export default async function PromotionsPage() {
  const supabase = await createClient();

  const { data: promotions } = await supabase
    .from("promotions")
    .select("*, promotion_items(*)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  // Sort promotion_items within each promotion by sort_order
  const sortedPromotions: PromotionWithItems[] = (promotions ?? []).map(
    (promo: PromotionWithItems) => ({
      ...promo,
      promotion_items: [...(promo.promotion_items || [])].sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    })
  );

  return (
    <div className="theme-page padding-bottom-100">
      <div className="row gray full-width page-header vertical-align-table">
        <div className="row">
          <div className="page-header-left">
            <h1>PROMOTIONS</h1>
          </div>
          <div className="page-header-right">
            <div
              className="bread-crumb-container"
              role="navigation"
              aria-label="Breadcrumb"
            >
              <ul className="bread-crumb">
                <li>
                  <a title="Home" href="/">
                    {" "}
                    Home{" "}
                  </a>
                </li>
                <li className="separator">&#47;</li>
                <li>Promotions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="clearfix">
        <div className="row page-margin-top-section">
          <ul className="services-list gray clearfix">
            {sortedPromotions.map((promo) => (
              <li key={promo.id}>
                <a>
                  {promo.image_url && (
                    <img
                      src={promo.image_url}
                      alt={promo.image_alt || promo.title}
                    />
                  )}
                </a>
                {promo.icon_class && (
                  <span className={`service-icon ${promo.icon_class}`}></span>
                )}
                <br />
                <br />
                <br />
                <div className="align-center">
                  <a className="promo">{promo.title}</a>
                </div>
                <br />
                <br />
                <br />
                <div style={{ textAlign: "left" }}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {promo.promotion_items.map((item: any) => (
                    <p key={item.id} className="template-tag">
                      {item.title || item.text}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
