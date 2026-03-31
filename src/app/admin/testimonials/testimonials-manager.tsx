"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface TestimonialsManagerProps {
  initialTestimonials: Testimonial[];
}

export function TestimonialsManager({
  initialTestimonials,
}: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(initialTestimonials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const textareaClass =
    "border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-sm";

  async function handleAdd() {
    setAdding(true);
    try {
      const supabase = createClient();
      const maxOrder = testimonials.reduce(
        (max, t) => Math.max(max, t.sort_order),
        0
      );
      const { data, error } = await supabase
        .from("testimonials")
        .insert({
          quote: "New testimonial quote",
          author_name: "Author Name",
          sort_order: maxOrder + 1,
          is_active: false,
        })
        .select()
        .single();

      if (error) throw error;
      setTestimonials((prev) => [...prev, data]);
      setEditingId(data.id);
      toast.success("Testimonial added. Edit the details below.");
    } catch {
      toast.error("Failed to add testimonial.");
    } finally {
      setAdding(false);
    }
  }

  async function handleSave(testimonial: Testimonial) {
    setSavingId(testimonial.id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("testimonials")
        .update({
          quote: testimonial.quote,
          author_name: testimonial.author_name,
          author_location: testimonial.author_location,
          is_active: testimonial.is_active,
          sort_order: testimonial.sort_order,
        })
        .eq("id", testimonial.id);

      if (error) throw error;
      toast.success("Testimonial saved successfully.");
      setEditingId(null);
    } catch {
      toast.error("Failed to save testimonial.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      if (editingId === id) setEditingId(null);
      toast.success("Testimonial deleted.");
    } catch {
      toast.error("Failed to delete testimonial.");
    } finally {
      setDeletingId(null);
    }
  }

  function updateTestimonial(id: string, updates: Partial<Testimonial>) {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
        <Button onClick={handleAdd} disabled={adding}>
          <Plus className="mr-1 h-4 w-4" />
          {adding ? "Adding..." : "Add Testimonial"}
        </Button>
      </div>

      {testimonials.length === 0 && (
        <p className="text-gray-500">
          No testimonials yet. Click &quot;Add Testimonial&quot; to get started.
        </p>
      )}

      <div className="space-y-4">
        {testimonials.map((testimonial) => {
          const isEditing = editingId === testimonial.id;
          const truncatedQuote =
            testimonial.quote.length > 120
              ? testimonial.quote.slice(0, 120) + "..."
              : testimonial.quote;

          return (
            <Card key={testimonial.id}>
              <CardHeader className="flex-row items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">
                    {testimonial.author_name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {testimonial.author_location || "No location"}
                  </p>
                  <p className="mt-1 text-sm italic text-gray-600">
                    &ldquo;{truncatedQuote}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      testimonial.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {testimonial.is_active ? "Active" : "Inactive"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() =>
                      setEditingId(isEditing ? null : testimonial.id)
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
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={deletingId === testimonial.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {isEditing && (
                <CardContent className="space-y-4 border-t pt-4">
                  <div>
                    <label className={labelClass}>Quote</label>
                    <textarea
                      rows={4}
                      className={textareaClass}
                      value={testimonial.quote}
                      onChange={(e) =>
                        updateTestimonial(testimonial.id, {
                          quote: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Author Name</label>
                      <Input
                        value={testimonial.author_name}
                        onChange={(e) =>
                          updateTestimonial(testimonial.id, {
                            author_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Location</label>
                      <Input
                        value={testimonial.author_location ?? ""}
                        onChange={(e) =>
                          updateTestimonial(testimonial.id, {
                            author_location: e.target.value,
                          })
                        }
                        placeholder="e.g. Denver, CO"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`active-${testimonial.id}`}
                      checked={testimonial.is_active}
                      onChange={(e) =>
                        updateTestimonial(testimonial.id, {
                          is_active: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor={`active-${testimonial.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Active
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleSave(testimonial)}
                      disabled={savingId === testimonial.id}
                    >
                      {savingId === testimonial.id
                        ? "Saving..."
                        : "Save Testimonial"}
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
