import { createClient } from "@/lib/supabase/server";
import { SliderManager } from "./slider-manager";

export default async function SliderPage() {
  const supabase = await createClient();
  const { data: slides, error } = await supabase
    .from("slider_slides")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Homepage Slider
        </h2>
        <p className="text-red-600">
          Failed to load slider slides. Please try again later.
        </p>
      </div>
    );
  }

  return <SliderManager initialSlides={slides ?? []} />;
}
