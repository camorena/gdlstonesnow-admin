import { createClient } from "@/lib/supabase/server";
import { PromotionsManager } from "./promotions-manager";

export default async function PromotionsPage() {
  const supabase = await createClient();

  const { data: promotions } = await supabase
    .from("promotions")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: promotionItems } = await supabase
    .from("promotion_items")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <PromotionsManager
      initialPromotions={promotions ?? []}
      initialPromotionItems={promotionItems ?? []}
    />
  );
}
