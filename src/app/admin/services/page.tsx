import { createClient } from "@/lib/supabase/server";
import { ServicesManager } from "./services-manager";

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: serviceItems } = await supabase
    .from("service_items")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <ServicesManager
      initialServices={services ?? []}
      initialServiceItems={serviceItems ?? []}
    />
  );
}
