import { createClient } from "@/lib/supabase/server";
import type { Promotion, PromotionItem } from "@/types/database";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "../components/animated-section";
import Hero from "@/app/(public)/components/hero";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Seasonal Promotions | GDL Stone Snow Bloomington MN",
  description:
    "Take advantage of seasonal offers on landscaping, stone work, and snow removal services from GDL Stone Snow LLC in Bloomington MN.",
};

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

const seasonStyles: Record<
  string,
  { badge: string; label: string; gradient: string }
> = {
  spring: {
    badge: "bg-green-500 text-white",
    label: "Spring",
    gradient: "from-green-600 via-[#8BB63A] to-emerald-500",
  },
  summer: {
    badge: "bg-amber-500 text-white",
    label: "Summer",
    gradient: "from-amber-500 via-orange-400 to-yellow-400",
  },
  fall: {
    badge: "bg-orange-500 text-white",
    label: "Fall",
    gradient: "from-orange-600 via-amber-500 to-orange-400",
  },
  winter: {
    badge: "bg-sky-500 text-white",
    label: "Winter",
    gradient: "from-sky-600 via-blue-500 to-cyan-400",
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
  const heroGradient =
    seasonStyles[currentSeason]?.gradient ?? seasonStyles.spring.gradient;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111]">
      <Hero
        title="Seasonal Promotions"
        subtitle="Take advantage of our seasonal offers on landscaping, stone work, and snow removal services"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Promotions" }]}
        backgroundImage="/images/pages/480x320/promotions-1.jpg"
        size="large"
      />

      {/* Promotions Grid */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {sortedPromotions.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No active promotions at this time. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedPromotions.map((promo, index) => {
              const promoSeason = promo.season?.toLowerCase() || "";
              const isCurrentSeason = promoSeason === currentSeason;
              const style =
                seasonStyles[promoSeason] || seasonStyles["spring"];

              return (
                <AnimatedSection key={promo.id} delay={index * 120}>
                  <div
                    className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1e1e1e] shadow-md dark:shadow-black/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/30 ${
                      isCurrentSeason
                        ? "ring-2 ring-[#8BB63A] animate-[pulse-glow_3s_ease-in-out_infinite]"
                        : ""
                    }`}
                    style={
                      isCurrentSeason
                        ? {
                            animationName: "pulse-glow",
                          }
                        : undefined
                    }
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      {promo.image_url ? (
                        <Image
                          src={promo.image_url}
                          alt={promo.image_alt || promo.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                          <svg
                            className="h-12 w-12 text-gray-400"
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

                      {/* Gradient overlay at bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Season badge on gradient */}
                      {promoSeason && (
                        <div className="absolute bottom-4 left-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider ${style.badge} shadow-lg`}
                          >
                            {style.label}
                          </span>
                        </div>
                      )}

                      {/* Current season indicator */}
                      {isCurrentSeason && (
                        <div className="absolute right-4 top-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8BB63A] px-3.5 py-1.5 text-xs font-bold text-white shadow-lg">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                            </span>
                            Active Now
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-7">
                      <h3 className="text-xl font-bold tracking-tight text-[#1a1a1a] dark:text-white">
                        {promo.title}
                      </h3>

                      {promo.promotion_items.length > 0 && (
                        <ul className="mt-5 flex-1 space-y-3">
                          {promo.promotion_items.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-start gap-3"
                            >
                              <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#8BB63A]" />
                              <span className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                {item.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Glass hover effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-white/10 backdrop-blur-[1px]" />
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </div>

      {/* Inline keyframes for pulse-glow animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(139,182,58,0.3); }
              50% { box-shadow: 0 0 35px rgba(139,182,58,0.5); }
            }
          `,
        }}
      />
    </div>
  );
}
