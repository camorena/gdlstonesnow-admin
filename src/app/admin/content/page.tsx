import { createClient } from "@/lib/supabase/server";
import { ContentManager } from "./content-manager";

export default async function ContentPage() {
  const supabase = await createClient();
  const { data: blocks, error } = await supabase
    .from("content_blocks")
    .select("*")
    .order("page", { ascending: true });

  if (error) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Content Blocks
        </h2>
        <p className="text-red-600">
          Failed to load content blocks. Please try again later.
        </p>
      </div>
    );
  }

  return <ContentManager initialBlocks={blocks ?? []} />;
}
