import { createClient } from "@/lib/supabase/server";
import type { Promotion, PromotionItem } from "@/types/database";
import Image from "next/image";
import AnimatedSection from "../components/animated-section";

export const revalidate = 60;

type PromotionWithItems = Promotion & {
  promotion_items: PromotionItem[];
};

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}

const seasonStyles: Record<string, { badge: string; label: string }> = {
  spring: {
    badge: "bg-green-500 text-white",
    label: "Spring",
  },
  summer: {
    badge: "bg-amber-500 text-white",
    label: "Summer",
  },
  fall: {
    badge: "bg-orange-500 text-white",
    label: "Fall",
  },
  winter: {
    badge: "bg-sky-500 text-white",
    label: "Winter",
  },
};

export default async function PromotionsPage() {
  const supabase = await createClient();

  const { data: promotions } = await supabase
    .from("promotions")
    .select("*, promotion_items(*)")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const sortedPromotions: PromotionWithItems[] = (promotions ?? []).map(
    (promo: PromotionWithItems) => ({
      ...promo,
      promotion_items: [...(promo.promotion_items || [])].sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    })
  );

  const currentSeason = getCurrentSeason();

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
              <li className="text-[#8BB63A]">Promotions</li>
            </ol>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Seasonal Promotions
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl">
            Take advantage of our seasonal offers on landscaping, stone work, and snow removal services.
          </p>
        </div>
      </div>

      {/* Promotions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {sortedPromotions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No active promotions at this time. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPromotions.map((promo, index) => {
              const promoSeason = promo.season?.toLowerCase() || "";
              const isCurrentSeason = promoSeason === currentSeason;
              const style = seasonStyles[promoSeason] || seasonStyles["spring"];

              return (
                <AnimatedSection key={promo.id} delay={index * 100}>
                  <div
                    className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col ${
                      isCurrentSeason
                        ? "ring-2 ring-[#8BB63A] shadow-[0_0_20px_rgba(139,182,58,0.3)]"
                        : ""
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      {promo.image_url ? (
                        <Image
                          src={promo.image_url}
                          alt={promo.image_alt || promo.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Season Badge */}
                      {promoSeason && (
                        <div className="absolute top-4 left-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${style.badge}`}
                          >
                            {style.label}
                          </span>
                        </div>
                      )}

                      {/* Current Season Indicator */}
                      {isCurrentSeason && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#8BB63A] text-white">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Current Season
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">
                        {promo.title}
                      </h3>

                      {promo.promotion_items.length > 0 && (
                        <ul className="space-y-3 flex-1">
                          {promo.promotion_items.map((item) => (
                            <li key={item.id} className="flex items-start gap-3">
                              <svg
                                className="w-5 h-5 text-[#8BB63A] mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-gray-600 text-sm leading-relaxed">
                                {item.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
