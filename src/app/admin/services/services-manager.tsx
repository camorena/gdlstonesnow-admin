"use client";

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
import type { Service, ServiceItem } from "@/types/database";

interface Props {
  initialServices: Service[];
  initialServiceItems: ServiceItem[];
}

interface EditingService extends Service {
  items: ServiceItem[];
}

export function ServicesManager({ initialServices, initialServiceItems }: Props) {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(initialServiceItems);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Record<string, EditingService>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const getItemsForService = useCallback(
    (serviceId: string) =>
      serviceItems
        .filter((item) => item.service_id === serviceId)
        .sort((a, b) => a.sort_order - b.sort_order),
    [serviceItems]
  );

  function toggleExpand(serviceId: string) {
    if (expandedId === serviceId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(serviceId);
    const service = services.find((s) => s.id === serviceId);
    if (service && !editingData[serviceId]) {
      setEditingData((prev) => ({
        ...prev,
        [serviceId]: {
          ...service,
          items: getItemsForService(serviceId),
        },
      }));
    }
  }

  async function handleAddService() {
    const maxOrder = services.reduce((max, s) => Math.max(max, s.sort_order), 0);
    const { data, error } = await supabase
      .from("services")
      .insert({ title: "New Service", sort_order: maxOrder + 1 })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create service");
      return;
    }

    setServices((prev) => [...prev, data]);
    setExpandedId(data.id);
    setEditingData((prev) => ({
      ...prev,
      [data.id]: { ...data, items: [] },
    }));
    toast.success("Service created");
  }

  async function handleSave(serviceId: string) {
    const editing = editingData[serviceId];
    if (!editing) return;

    setSaving((prev) => ({ ...prev, [serviceId]: true }));

    try {
      const { items, ...serviceData } = editing;
      const { error: serviceError } = await supabase
        .from("services")
        .update({
          title: serviceData.title,
          image_url: serviceData.image_url,
          image_alt: serviceData.image_alt,
          icon_class: serviceData.icon_class,
          is_active: serviceData.is_active,
          sort_order: serviceData.sort_order,
        })
        .eq("id", serviceId);

      if (serviceError) throw serviceError;

      // Delete existing items for this service, then re-insert
      const { error: deleteError } = await supabase
        .from("service_items")
        .delete()
        .eq("service_id", serviceId);

      if (deleteError) throw deleteError;

      if (items.length > 0) {
        const { error: insertError } = await supabase
          .from("service_items")
          .insert(
            items.map((item, index) => ({
              service_id: serviceId,
              text: item.text,
              sort_order: index,
            }))
          );

        if (insertError) throw insertError;
      }

      // Refresh data
      const { data: freshService } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId)
        .single();

      const { data: freshItems } = await supabase
        .from("service_items")
        .select("*")
        .eq("service_id", serviceId)
        .order("sort_order", { ascending: true });

      if (freshService) {
        setServices((prev) =>
          prev.map((s) => (s.id === serviceId ? freshService : s))
        );
      }

      setServiceItems((prev) => [
        ...prev.filter((item) => item.service_id !== serviceId),
        ...(freshItems ?? []),
      ]);

      setEditingData((prev) => ({
        ...prev,
        [serviceId]: {
          ...freshService!,
          items: freshItems ?? [],
        },
      }));

      toast.success("Service saved");
    } catch {
      toast.error("Failed to save service");
    } finally {
      setSaving((prev) => ({ ...prev, [serviceId]: false }));
    }
  }

  async function handleDelete(serviceId: string) {
    if (!confirm("Are you sure you want to delete this service? This cannot be undone.")) {
      return;
    }

    const { error: itemsError } = await supabase
      .from("service_items")
      .delete()
      .eq("service_id", serviceId);

    if (itemsError) {
      toast.error("Failed to delete service items");
      return;
    }

    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      toast.error("Failed to delete service");
      return;
    }

    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    setServiceItems((prev) => prev.filter((item) => item.service_id !== serviceId));
    setEditingData((prev) => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });
    if (expandedId === serviceId) setExpandedId(null);
    toast.success("Service deleted");
  }

  function updateEditing(serviceId: string, updates: Partial<EditingService>) {
    setEditingData((prev) => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], ...updates },
    }));
  }

  function updateItem(serviceId: string, itemIndex: number, text: string) {
    setEditingData((prev) => {
      const editing = prev[serviceId];
      if (!editing) return prev;
      const items = [...editing.items];
      items[itemIndex] = { ...items[itemIndex], text };
      return { ...prev, [serviceId]: { ...editing, items } };
    });
  }

  function removeItem(serviceId: string, itemIndex: number) {
    setEditingData((prev) => {
      const editing = prev[serviceId];
      if (!editing) return prev;
      const items = editing.items.filter((_, i) => i !== itemIndex);
      return { ...prev, [serviceId]: { ...editing, items } };
    });
  }

  function addItem(serviceId: string) {
    setEditingData((prev) => {
      const editing = prev[serviceId];
      if (!editing) return prev;
      const maxOrder = editing.items.reduce((max, item) => Math.max(max, item.sort_order), -1);
      const newItem: ServiceItem = {
        id: `temp-${Date.now()}`,
        service_id: serviceId,
        text: "",
        sort_order: maxOrder + 1,
      };
      return {
        ...prev,
        [serviceId]: { ...editing, items: [...editing.items, newItem] },
      };
    });
  }

  function moveItem(serviceId: string, itemIndex: number, direction: "up" | "down") {
    setEditingData((prev) => {
      const editing = prev[serviceId];
      if (!editing) return prev;
      const items = [...editing.items];
      const swapIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
      if (swapIndex < 0 || swapIndex >= items.length) return prev;
      [items[itemIndex], items[swapIndex]] = [items[swapIndex], items[itemIndex]];
      return { ...prev, [serviceId]: { ...editing, items } };
    });
  }

  async function handleImageUpload(serviceId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      updateEditing(serviceId, { image_url: url });
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to upload image");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Services</h2>
        <Button onClick={handleAddService}>
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {services
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((service) => {
            const items = getItemsForService(service.id);
            const isExpanded = expandedId === service.id;
            const editing = editingData[service.id];

            return (
              <Card key={service.id} className="py-0 overflow-hidden">
                {/* Collapsed header */}
                <button
                  type="button"
                  onClick={() => toggleExpand(service.id)}
                  className="flex w-full items-center gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.image_alt ?? service.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {service.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {items.length} item{items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      service.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {service.is_active ? "Active" : "Inactive"}
                  </span>
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
                            updateEditing(service.id, { title: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Icon Class
                        </label>
                        <Input
                          value={editing.icon_class ?? ""}
                          onChange={(e) =>
                            updateEditing(service.id, {
                              icon_class: e.target.value || null,
                            })
                          }
                          placeholder="e.g. fa-wrench"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Image URL
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={editing.image_url ?? ""}
                            onChange={(e) =>
                              updateEditing(service.id, {
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
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) handleImageUpload(service.id, file);
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
                            updateEditing(service.id, {
                              image_alt: e.target.value || null,
                            })
                          }
                          placeholder="Describe the image"
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
                          updateEditing(service.id, {
                            is_active: !editing.is_active,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          editing.is_active ? "bg-[#8BB63A]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                            editing.is_active ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span className="text-sm font-medium text-gray-700">
                        {editing.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Service items */}
                    <div className="mt-6">
                      <h4 className="mb-3 text-sm font-semibold text-gray-900">
                        Service Items
                      </h4>
                      <div className="flex flex-col gap-2">
                        {editing.items.map((item, index) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <button
                                type="button"
                                onClick={() => moveItem(service.id, index, "up")}
                                disabled={index === 0}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveItem(service.id, index, "down")}
                                disabled={index === editing.items.length - 1}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </div>
                            <Input
                              value={item.text}
                              onChange={(e) =>
                                updateItem(service.id, index, e.target.value)
                              }
                              placeholder="Item text"
                              className="flex-1"
                            />
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => removeItem(service.id, index)}
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
                        onClick={() => addItem(service.id)}
                      >
                        <Plus className="h-3 w-3" />
                        Add Item
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Service
                      </Button>
                      <Button
                        onClick={() => handleSave(service.id)}
                        disabled={saving[service.id]}
                      >
                        <Save className="h-4 w-4" />
                        {saving[service.id] ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}

        {services.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-200 py-12 text-center">
            <p className="text-gray-500">No services yet. Add your first service to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
