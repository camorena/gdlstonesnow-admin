import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  if (error || !settings) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-red-600">
          Failed to load settings. Please ensure a site_settings row exists in
          the database.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Settings</h2>
      <SettingsForm initialData={settings} />
    </div>
  );
}
