import { createClient } from "@/lib/supabase/server";
import { TestimonialsManager } from "./testimonials-manager";

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Testimonials</h2>
        <p className="text-red-600">
          Failed to load testimonials. Please try again later.
        </p>
      </div>
    );
  }

  return <TestimonialsManager initialTestimonials={testimonials ?? []} />;
}
