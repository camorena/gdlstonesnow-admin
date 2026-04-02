"use client";
import { revalidatePublicPages } from "@/lib/revalidate";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { Promotion, PromotionItem } from "@/types/database";

const SEASONS = ["spring", "summer", "fall", "winter"] as const;

interface Props {
  initialPromotions: Promotion[];
  initialPromotionItems: PromotionItem[];
}

interface EditingPromotion extends Promotion {
  items: PromotionItem[];
}

export function PromotionsManager({
  initialPromotions,
  initialPromotionItems,
}: Props) {
  const supabase = createClient();
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [promotionItems, setPromotionItems] =
    useState<PromotionItem[]>(initialPromotionItems);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<
    Record<string, EditingPromotion>
  >({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const getItemsForPromotion = useCallback(
    (promotionId: string) =>
      promotionItems
        .filter((item) => item.promotion_id === promotionId)
        .sort((a, b) => a.sort_order - b.sort_order),
    [promotionItems]
  );

  function toggleExpand(promotionId: string) {
    if (expandedId === promotionId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(promotionId);
    const promotion = promotions.find((p) => p.id === promotionId);
    if (promotion && !editingData[promotionId]) {
      setEditingData((prev) => ({
        ...prev,
        [promotionId]: {
          ...promotion,
          items: getItemsForPromotion(promotionId),
        },
      }));
    }
  }

  async function handleAddPromotion() {
    const maxOrder = promotions.reduce(
      (max, p) => Math.max(max, p.sort_order),
      0
    );
    const { data, error } = await supabase
      .from("promotions")
      .insert({ title: "New Promotion", sort_order: maxOrder + 1 })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create promotion");
      return;
    }

    setPromotions((prev) => [...prev, data]);
    setExpandedId(data.id);
    setEditingData((prev) => ({
      ...prev,
      [data.id]: { ...data, items: [] },
    }));
    await revalidatePublicPages("/promotions"); toast.success("Promotion created");
  }

  async function handleSave(promotionId: string) {
    const editing = editingData[promotionId];
    if (!editing) return;

    setSaving((prev) => ({ ...prev, [promotionId]: true }));

    try {
      const { items, ...promotionData } = editing;
      const { error: promotionError } = await supabase
        .from("promotions")
        .update({
          title: promotionData.title,
          season: promotionData.season,
          image_url: promotionData.image_url,
          image_alt: promotionData.image_alt,
          icon_class: promotionData.icon_class,
          is_active: promotionData.is_active,
          sort_order: promotionData.sort_order,
          start_date: promotionData.start_date,
          end_date: promotionData.end_date,
        })
        .eq("id", promotionId);

      if (promotionError) throw promotionError;

      // Delete existing items, then re-insert
      const { error: deleteError } = await supabase
        .from("promotion_items")
        .delete()
        .eq("promotion_id", promotionId);

      if (deleteError) throw deleteError;

      if (items.length > 0) {
        const { error: insertError } = await supabase
          .from("promotion_items")
          .insert(
            items.map((item, index) => ({
              promotion_id: promotionId,
              title: item.title,
              sort_order: index,
            }))
          );

        if (insertError) throw insertError;
      }

      // Refresh data
      const { data: freshPromotion } = await supabase
        .from("promotions")
        .select("*")
        .eq("id", promotionId)
        .single();

      const { data: freshItems } = await supabase
        .from("promotion_items")
        .select("*")
        .eq("promotion_id", promotionId)
        .order("sort_order", { ascending: true });

      if (freshPromotion) {
        setPromotions((prev) =>
          prev.map((p) => (p.id === promotionId ? freshPromotion : p))
        );
      }

      setPromotionItems((prev) => [
        ...prev.filter((item) => item.promotion_id !== promotionId),
        ...(freshItems ?? []),
      ]);

      setEditingData((prev) => ({
        ...prev,
        [promotionId]: {
          ...freshPromotion!,
          items: freshItems ?? [],
        },
      }));

      await revalidatePublicPages("/promotions"); toast.success("Promotion saved");
    } catch {
      toast.error("Failed to save promotion");
    } finally {
      setSaving((prev) => ({ ...prev, [promotionId]: false }));
    }
  }

  async function handleDelete(promotionId: string) {
    if (
      !confirm(
        "Are you sure you want to delete this promotion? This cannot be undone."
      )
    ) {
      return;
    }

    const { error: itemsError } = await supabase
      .from("promotion_items")
      .delete()
      .eq("promotion_id", promotionId);

    if (itemsError) {
      toast.error("Failed to delete promotion items");
      return;
    }

    const { error } = await supabase
      .from("promotions")
      .delete()
      .eq("id", promotionId);

    if (error) {
      toast.error("Failed to delete promotion");
      return;
    }

    setPromotions((prev) => prev.filter((p) => p.id !== promotionId));
    setPromotionItems((prev) =>
      prev.filter((item) => item.promotion_id !== promotionId)
    );
    setEditingData((prev) => {
      const next = { ...prev };
      delete next[promotionId];
      return next;
    });
    if (expandedId === promotionId) setExpandedId(null);
    await revalidatePublicPages("/promotions"); toast.success("Promotion deleted");
  }

  function updateEditing(
    promotionId: string,
    updates: Partial<EditingPromotion>
  ) {
    setEditingData((prev) => ({
      ...prev,
      [promotionId]: { ...prev[promotionId], ...updates },
    }));
  }

  function updateItem(promotionId: string, itemIndex: number, title: string) {
    setEditingData((prev) => {
      const editing = prev[promotionId];
      if (!editing) return prev;
      const items = [...editing.items];
      items[itemIndex] = { ...items[itemIndex], title };
      return { ...prev, [promotionId]: { ...editing, items } };
    });
  }

  function removeItem(promotionId: string, itemIndex: number) {
    setEditingData((prev) => {
      const editing = prev[promotionId];
      if (!editing) return prev;
      const items = editing.items.filter((_, i) => i !== itemIndex);
      return { ...prev, [promotionId]: { ...editing, items } };
    });
  }

  function addItem(promotionId: string) {
    setEditingData((prev) => {
      const editing = prev[promotionId];
      if (!editing) return prev;
      const maxOrder = editing.items.reduce(
        (max, item) => Math.max(max, item.sort_order),
        -1
      );
      const newItem: PromotionItem = {
        id: `temp-${Date.now()}`,
        promotion_id: promotionId,
        title: "",
        sort_order: maxOrder + 1,
      };
      return {
        ...prev,
        [promotionId]: { ...editing, items: [...editing.items, newItem] },
      };
    });
  }

  function moveItem(
    promotionId: string,
    itemIndex: number,
    direction: "up" | "down"
  ) {
    setEditingData((prev) => {
      const editing = prev[promotionId];
      if (!editing) return prev;
      const items = [...editing.items];
      const swapIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
      if (swapIndex < 0 || swapIndex >= items.length) return prev;
      [items[itemIndex], items[swapIndex]] = [items[swapIndex], items[itemIndex]];
      return { ...prev, [promotionId]: { ...editing, items } };
    });
  }

  async function handleImageUpload(promotionId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      updateEditing(promotionId, { image_url: url });
      await revalidatePublicPages("/promotions"); toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    }
  }

  function seasonLabel(season: string | null) {
    if (!season) return null;
    return season.charAt(0).toUpperCase() + season.slice(1);
  }

  const seasonColors: Record<string, string> = {
    spring: "bg-green-100 text-green-700",
    summer: "bg-yellow-100 text-yellow-700",
    fall: "bg-orange-100 text-orange-700",
    winter: "bg-blue-100 text-blue-700",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Promotions</h2>
        <Button onClick={handleAddPromotion}>
          <Plus className="h-4 w-4" />
          Add Promotion
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {promotions
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((promotion) => {
            const items = getItemsForPromotion(promotion.id);
            const isExpanded = expandedId === promotion.id;
            const editing = editingData[promotion.id];

            return (
              <Card key={promotion.id} className="py-0 overflow-hidden">
                {/* Collapsed header */}
                <button
                  type="button"
                  onClick={() => toggleExpand(promotion.id)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  {promotion.image_url ? (
                    <img
                      src={promotion.image_url}
                      alt={promotion.image_alt ?? promotion.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {promotion.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {promotion.season && (
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          seasonColors[promotion.season] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {seasonLabel(promotion.season)}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        promotion.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {promotion.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {/* Expanded edit view */}
                {isExpanded && editing && (
                  <div className="border-t px-6 py-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <Input
                          value={editing.title}
                          onChange={(e) =>
                            updateEditing(promotion.id, {
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Season
                        </label>
                        <select
                          value={editing.season ?? ""}
                          onChange={(e) =>
                            updateEditing(promotion.id, {
                              season: e.target.value || null,
                            })
                          }
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                        >
                          <option value="">No season</option>
                          {SEASONS.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Image URL
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={editing.image_url ?? ""}
                            onChange={(e) =>
                              updateEditing(promotion.id, {
                                image_url: e.target.value || null,
                              })
                            }
                            placeholder="https://..."
                          />
                          <Button
                            variant="outline"
                            size="default"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (file)
                                  handleImageUpload(promotion.id, file);
                              };
                              input.click();
                            }}
                          >
                            Upload
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Image Alt Text
                        </label>
                        <Input
                          value={editing.image_alt ?? ""}
                          onChange={(e) =>
                            updateEditing(promotion.id, {
                              image_alt: e.target.value || null,
                            })
                          }
                          placeholder="Describe the image"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Icon Class
                        </label>
                        <Input
                          value={editing.icon_class ?? ""}
                          onChange={(e) =>
                            updateEditing(promotion.id, {
                              icon_class: e.target.value || null,
                            })
                          }
                          placeholder="e.g. fa-tag"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={editing.start_date ?? ""}
                          onChange={(e) =>
                            updateEditing(promotion.id, {
                              start_date: e.target.value || null,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={editing.end_date ?? ""}
                          onChange={(e) =>
                            updateEditing(promotion.id, {
                              end_date: e.target.value || null,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Active toggle */}
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={editing.is_active}
                        onClick={() =>
                          updateEditing(promotion.id, {
                            is_active: !editing.is_active,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          editing.is_active ? "bg-[#8BB63A]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                            editing.is_active
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        {editing.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Promotion items */}
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-semibold text-gray-900">
                        Promotion Items
                      </h4>
                      <div className="flex flex-col gap-2">
                        {editing.items.map((item, index) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <button
                                type="button"
                                onClick={() =>
                                  moveItem(promotion.id, index, "up")
                                }
                                disabled={index === 0}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  moveItem(promotion.id, index, "down")
                                }
                                disabled={index === editing.items.length - 1}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </div>
                            <Input
                              value={item.title}
                              onChange={(e) =>
                                updateItem(
                                  promotion.id,
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder="Item text"
                              className="flex-1"
                            />
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() =>
                                removeItem(promotion.id, index)
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => addItem(promotion.id)}
                      >
                        <Plus className="h-3 w-3" />
                        Add Item
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(promotion.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Promotion
                      </Button>
                      <Button
                        onClick={() => handleSave(promotion.id)}
                        disabled={saving[promotion.id]}
                      >
                        <Save className="h-4 w-4" />
                        {saving[promotion.id] ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}

        {promotions.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
            <p className="text-gray-500">
              No promotions yet. Add your first promotion to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
