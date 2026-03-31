"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { SliderSlide } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface SliderManagerProps {
  initialSlides: SliderSlide[];
}

export function SliderManager({ initialSlides }: SliderManagerProps) {
  const [slides, setSlides] = useState<SliderSlide[]>(initialSlides);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  async function handleAdd() {
    setAdding(true);
    try {
      const supabase = createClient();
      const maxOrder = slides.reduce(
        (max, s) => Math.max(max, s.sort_order),
        0
      );
      const { data, error } = await supabase
        .from("slider_slides")
        .insert({
          image_url: "/placeholder.jpg",
          image_alt: "New slide",
          headline: "New Slide",
          sort_order: maxOrder + 1,
          is_active: false,
        })
        .select()
        .single();

      if (error) throw error;
      setSlides((prev) => [...prev, data]);
      setEditingId(data.id);
      toast.success("Slide added. Edit the details below.");
    } catch {
      toast.error("Failed to add slide.");
    } finally {
      setAdding(false);
    }
  }

  async function handleSave(slide: SliderSlide) {
    setSavingId(slide.id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("slider_slides")
        .update({
          image_url: slide.image_url,
          image_alt: slide.image_alt,
          headline: slide.headline,
          subtitle: slide.subtitle,
          sub_subtitle: slide.sub_subtitle,
          cta_text: slide.cta_text,
          cta_link: slide.cta_link,
          is_active: slide.is_active,
          sort_order: slide.sort_order,
        })
        .eq("id", slide.id);

      if (error) throw error;
      toast.success("Slide saved successfully.");
      setEditingId(null);
    } catch {
      toast.error("Failed to save slide.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("slider_slides")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSlides((prev) => prev.filter((s) => s.id !== id));
      if (editingId === id) setEditingId(null);
      toast.success("Slide deleted.");
    } catch {
      toast.error("Failed to delete slide.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleImageUpload(
    slideId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(slideId);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();
      setSlides((prev) =>
        prev.map((s) => (s.id === slideId ? { ...s, image_url: url } : s))
      );
      toast.success("Image uploaded.");
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setUploadingId(null);
    }
  }

  function updateSlide(id: string, updates: Partial<SliderSlide>) {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Homepage Slider</h2>
        <Button onClick={handleAdd} disabled={adding}>
          <Plus className="mr-1 h-4 w-4" />
          {adding ? "Adding..." : "Add Slide"}
        </Button>
      </div>

      {slides.length === 0 && (
        <p className="text-gray-500">
          No slides yet. Click &quot;Add Slide&quot; to get started.
        </p>
      )}

      <div className="space-y-4">
        {slides.map((slide) => {
          const isEditing = editingId === slide.id;
          return (
            <Card key={slide.id}>
              <CardHeader className="flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-24 overflow-hidden rounded border bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.image_url}
                      alt={slide.image_alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {slide.headline || "Untitled Slide"}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {slide.subtitle || "No subtitle"}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      slide.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {slide.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setEditingId(isEditing ? null : slide.id)
                    }
                  >
                    {isEditing ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => handleDelete(slide.id)}
                    disabled={deletingId === slide.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {isEditing && (
                <CardContent className="space-y-4 border-t pt-4">
                  <div>
                    <label className={labelClass}>Slide Image</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(slide.id, e)}
                      disabled={uploadingId === slide.id}
                    />
                    {uploadingId === slide.id && (
                      <p className="mt-1 text-sm text-gray-500">
                        Uploading...
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Image Alt Text</label>
                    <Input
                      value={slide.image_alt}
                      onChange={(e) =>
                        updateSlide(slide.id, { image_alt: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Headline</label>
                    <Input
                      value={slide.headline ?? ""}
                      onChange={(e) =>
                        updateSlide(slide.id, { headline: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Subtitle</label>
                    <Input
                      value={slide.subtitle ?? ""}
                      onChange={(e) =>
                        updateSlide(slide.id, { subtitle: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Sub-subtitle</label>
                    <Input
                      value={slide.sub_subtitle ?? ""}
                      onChange={(e) =>
                        updateSlide(slide.id, {
                          sub_subtitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>CTA Text</label>
                      <Input
                        value={slide.cta_text ?? ""}
                        onChange={(e) =>
                          updateSlide(slide.id, { cta_text: e.target.value })
                        }
                        placeholder="e.g. Learn More"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>CTA Link</label>
                      <Input
                        value={slide.cta_link ?? ""}
                        onChange={(e) =>
                          updateSlide(slide.id, { cta_link: e.target.value })
                        }
                        placeholder="e.g. /services"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`active-${slide.id}`}
                      checked={slide.is_active}
                      onChange={(e) =>
                        updateSlide(slide.id, {
                          is_active: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor={`active-${slide.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Active
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleSave(slide)}
                      disabled={savingId === slide.id}
                    >
                      {savingId === slide.id ? "Saving..." : "Save Slide"}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
