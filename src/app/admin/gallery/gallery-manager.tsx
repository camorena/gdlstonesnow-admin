"use client";
import { revalidatePublicPages } from "@/lib/revalidate";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { GalleryItem, GalleryItemInsert } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ImagePlus,
  Video,
  Pencil,
  Trash2,
  X,
  Upload,
} from "lucide-react";

const CATEGORIES = ["landscaping", "masonry", "snow removal", "general"] as const;

interface GalleryManagerProps {
  initialItems: GalleryItem[];
}

type ModalMode =
  | { kind: "closed" }
  | { kind: "add-image" }
  | { kind: "add-video" }
  | { kind: "edit"; item: GalleryItem };

interface FormState {
  title: string;
  alt_text: string;
  category: string;
  url: string;
}

const emptyForm: FormState = {
  title: "",
  alt_text: "",
  category: "general",
  url: "",
};

export function GalleryManager({ initialItems }: GalleryManagerProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [modal, setModal] = useState<ModalMode>({ kind: "closed" });
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const supabase = createClient();

  function openAddImage() {
    setForm(emptyForm);
    setSelectedFile(null);
    setModal({ kind: "add-image" });
  }

  function openAddVideo() {
    setForm(emptyForm);
    setModal({ kind: "add-video" });
  }

  function openEdit(item: GalleryItem) {
    setForm({
      title: item.title ?? "",
      alt_text: item.alt_text ?? "",
      category: item.category ?? "general",
      url: item.url,
    });
    setSelectedFile(null);
    setModal({ kind: "edit", item });
  }

  function closeModal() {
    setModal({ kind: "closed" });
    setForm(emptyForm);
    setSelectedFile(null);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Upload failed");
    }

    const data = await res.json();
    return data.url;
  }

  function extractYouTubeThumbnail(url: string): string | null {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (modal.kind === "add-image") {
        if (!selectedFile) {
          toast.error("Please select an image file.");
          setSaving(false);
          return;
        }

        setUploading(true);
        const imageUrl = await uploadFile(selectedFile);
        setUploading(false);

        const maxOrder = items.length > 0
          ? Math.max(...items.map((i) => i.sort_order))
          : -1;

        const newItem: GalleryItemInsert = {
          type: "image",
          url: imageUrl,
          thumbnail_url: imageUrl,
          title: form.title || null,
          alt_text: form.alt_text || null,
          category: form.category || null,
          sort_order: maxOrder + 1,
          is_active: true,
        };

        const { data, error } = await supabase
          .from("gallery_items")
          .insert(newItem)
          .select()
          .single();

        if (error) throw error;

        setItems((prev) => [...prev, data]);
        await revalidatePublicPages("/gallery"); toast.success("Image added successfully.");
        closeModal();
      } else if (modal.kind === "add-video") {
        if (!form.url.trim()) {
          toast.error("Please enter a YouTube URL.");
          setSaving(false);
          return;
        }

        const thumbnail = extractYouTubeThumbnail(form.url);
        const maxOrder = items.length > 0
          ? Math.max(...items.map((i) => i.sort_order))
          : -1;

        const newItem: GalleryItemInsert = {
          type: "video",
          url: form.url,
          thumbnail_url: thumbnail,
          title: form.title || null,
          alt_text: form.alt_text || null,
          category: form.category || null,
          sort_order: maxOrder + 1,
          is_active: true,
        };

        const { data, error } = await supabase
          .from("gallery_items")
          .insert(newItem)
          .select()
          .single();

        if (error) throw error;

        setItems((prev) => [...prev, data]);
        await revalidatePublicPages("/gallery"); toast.success("Video added successfully.");
        closeModal();
      } else if (modal.kind === "edit") {
        const editItem = modal.item;
        let url = form.url;
        let thumbnailUrl = editItem.thumbnail_url;

        if (selectedFile) {
          setUploading(true);
          url = await uploadFile(selectedFile);
          thumbnailUrl = url;
          setUploading(false);
        } else if (editItem.type === "video") {
          thumbnailUrl = extractYouTubeThumbnail(form.url) ?? editItem.thumbnail_url;
        }

        const { data, error } = await supabase
          .from("gallery_items")
          .update({
            url,
            thumbnail_url: thumbnailUrl,
            title: form.title || null,
            alt_text: form.alt_text || null,
            category: form.category || null,
          })
          .eq("id", editItem.id)
          .select()
          .single();

        if (error) throw error;

        setItems((prev) =>
          prev.map((i) => (i.id === editItem.id ? data : i))
        );
        await revalidatePublicPages("/gallery"); toast.success("Gallery item updated.");
        closeModal();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      toast.error(message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setItems((prev) => prev.filter((i) => i.id !== id));
      setDeleteConfirm(null);
      await revalidatePublicPages("/gallery"); toast.success("Gallery item deleted.");
    } catch {
      toast.error("Failed to delete item. Please try again.");
    }
  }

  const isModalOpen = modal.kind !== "closed";
  const isEditing = modal.kind === "edit";
  const isImage =
    modal.kind === "add-image" ||
    (modal.kind === "edit" && modal.item.type === "image");

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const selectClass =
    "border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-sm";

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
        <div className="flex gap-2">
          <Button onClick={openAddImage}>
            <ImagePlus className="mr-1.5 h-4 w-4" />
            Add Image
          </Button>
          <Button onClick={openAddVideo} variant="outline">
            <Video className="mr-1.5 h-4 w-4" />
            Add Video
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No gallery items yet. Add an image or video to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden py-0">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-100">
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.alt_text ?? item.title ?? "Gallery item"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    {item.type === "video" ? (
                      <Video className="h-10 w-10" />
                    ) : (
                      <ImagePlus className="h-10 w-10" />
                    )}
                  </div>
                )}
                {/* Type badge */}
                <span
                  className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium text-white ${
                    item.type === "video" ? "bg-blue-600" : "bg-green-600"
                  }`}
                >
                  {item.type}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.title || "Untitled"}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {item.alt_text || "No alt text"}
                </p>
                {item.category && (
                  <span className="mt-1.5 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {item.category}
                  </span>
                )}

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  {deleteConfirm === item.id ? (
                    <div className="flex gap-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteConfirm(item.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {modal.kind === "add-image"
                  ? "Add Image"
                  : modal.kind === "add-video"
                    ? "Add Video"
                    : `Edit ${modal.item.type === "image" ? "Image" : "Video"}`}
              </h3>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File upload for images */}
              {isImage && (
                <div>
                  <Label htmlFor="file-upload" className={labelClass}>
                    {isEditing ? "Replace Image (optional)" : "Image File"}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                    />
                  </div>
                  {selectedFile && (
                    <p className="mt-1 text-xs text-gray-500">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              )}

              {/* YouTube URL for videos */}
              {!isImage && (
                <div>
                  <Label htmlFor="url" className={labelClass}>
                    YouTube URL
                  </Label>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required={!isEditing}
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <Label htmlFor="title" className={labelClass}>
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter a title..."
                />
              </div>

              {/* Alt Text */}
              <div>
                <Label htmlFor="alt_text" className={labelClass}>
                  Alt Text
                </Label>
                <Input
                  id="alt_text"
                  name="alt_text"
                  value={form.alt_text}
                  onChange={handleChange}
                  placeholder="Describe the image for accessibility..."
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className={labelClass}>
                  Category
                </Label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={selectClass}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || uploading}>
                  {uploading ? (
                    <>
                      <Upload className="mr-1.5 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : saving ? (
                    "Saving..."
                  ) : isEditing ? (
                    "Save Changes"
                  ) : (
                    "Add Item"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
