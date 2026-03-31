"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface SettingsFormProps {
  initialData: SiteSettings;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [formData, setFormData] = useState<SiteSettings>(initialData);
  const [saving, setSaving] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("site_settings")
        .update({
          business_name: formData.business_name,
          email: formData.email,
          address_street: formData.address_street,
          address_city: formData.address_city,
          address_state: formData.address_state,
          address_zip: formData.address_zip,
          phone_office: formData.phone_office,
          phone_sales: formData.phone_sales,
          hours_display: formData.hours_display,
          facebook_url: formData.facebook_url,
          instagram_url: formData.instagram_url,
          youtube_url: formData.youtube_url,
          meta_description: formData.meta_description,
          google_maps_embed: formData.google_maps_embed,
        })
        .eq("id", formData.id);

      if (error) throw error;

      toast.success("Settings saved successfully.");
    } catch {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const textareaClass =
    "border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Business Info */}
      <Card>
        <CardHeader>
          <CardTitle>Business Info</CardTitle>
          <CardDescription>
            Your business name and contact email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="business_name" className={labelClass}>
              Business Name
            </label>
            <Input
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>Your business address.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="address_street" className={labelClass}>
              Street
            </label>
            <Input
              id="address_street"
              name="address_street"
              value={formData.address_street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="address_city" className={labelClass}>
                City
              </label>
              <Input
                id="address_city"
                name="address_city"
                value={formData.address_city}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="address_state" className={labelClass}>
                State
              </label>
              <Input
                id="address_state"
                name="address_state"
                value={formData.address_state}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="address_zip" className={labelClass}>
                Zip
              </label>
              <Input
                id="address_zip"
                name="address_zip"
                value={formData.address_zip}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phone Numbers */}
      <Card>
        <CardHeader>
          <CardTitle>Phone Numbers</CardTitle>
          <CardDescription>Office and sales phone numbers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone_office" className={labelClass}>
                Office Phone
              </label>
              <Input
                id="phone_office"
                name="phone_office"
                type="tel"
                value={formData.phone_office}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="phone_sales" className={labelClass}>
                Sales Phone
              </label>
              <Input
                id="phone_sales"
                name="phone_sales"
                type="tel"
                value={formData.phone_sales}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Hours</CardTitle>
          <CardDescription>
            Display text for your business hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <label htmlFor="hours_display" className={labelClass}>
              Hours Display
            </label>
            <Input
              id="hours_display"
              name="hours_display"
              value={formData.hours_display}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Links to your social profiles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="facebook_url" className={labelClass}>
              Facebook URL
            </label>
            <Input
              id="facebook_url"
              name="facebook_url"
              type="url"
              value={formData.facebook_url ?? ""}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label htmlFor="instagram_url" className={labelClass}>
              Instagram URL
            </label>
            <Input
              id="instagram_url"
              name="instagram_url"
              type="url"
              value={formData.instagram_url ?? ""}
              onChange={handleChange}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label htmlFor="youtube_url" className={labelClass}>
              YouTube URL
            </label>
            <Input
              id="youtube_url"
              name="youtube_url"
              type="url"
              value={formData.youtube_url ?? ""}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
          <CardDescription>
            Search engine optimization metadata.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <label htmlFor="meta_description" className={labelClass}>
              Meta Description
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              rows={3}
              className={textareaClass}
              value={formData.meta_description ?? ""}
              onChange={handleChange}
              placeholder="A brief description of your business for search engines..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>Map</CardTitle>
          <CardDescription>
            Google Maps embed code for your location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <label htmlFor="google_maps_embed" className={labelClass}>
              Google Maps Embed
            </label>
            <textarea
              id="google_maps_embed"
              name="google_maps_embed"
              rows={4}
              className={textareaClass}
              value={formData.google_maps_embed ?? ""}
              onChange={handleChange}
              placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-6">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
