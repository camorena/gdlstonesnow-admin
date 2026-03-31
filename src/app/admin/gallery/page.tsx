import { createClient } from "@/lib/supabase/server";
import { GalleryManager } from "./gallery-manager";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Gallery</h2>
        <p className="text-red-600">
          Failed to load gallery items. Please try again later.
        </p>
      </div>
    );
  }

  return <GalleryManager initialItems={items ?? []} />;
}
