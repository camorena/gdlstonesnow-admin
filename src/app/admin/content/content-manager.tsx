"use client";
import { revalidatePublicPages } from "@/lib/revalidate";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { ContentBlock, Database } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ContentManagerProps {
  initialBlocks: ContentBlock[];
}

export function ContentManager({ initialBlocks }: ContentManagerProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const textareaClass =
    "border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 md:text-sm";

  // Group blocks by page
  const groupedBlocks = blocks.reduce<Record<string, ContentBlock[]>>(
    (acc, block) => {
      const page = block.page;
      if (!acc[page]) acc[page] = [];
      acc[page].push(block);
      return acc;
    },
    {}
  );

  const pageLabels: Record<string, string> = {
    home: "Home",
    contact: "Contact",
  };

  async function handleSave(block: ContentBlock) {
    setSavingId(block.id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("content_blocks")
        .update({
          heading: block.heading,
          body: block.body,
        })
        .eq("id", block.id);

      if (error) throw error;
      await revalidatePublicPages(); toast.success("Content block saved successfully.");
      setEditingId(null);
    } catch {
      toast.error("Failed to save content block.");
    } finally {
      setSavingId(null);
    }
  }

  function updateBlock(id: string, updates: Partial<ContentBlock>) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Content Blocks</h2>
        <p className="mt-1 text-sm text-gray-500">
          Edit the fixed content sections across your site pages.
        </p>
      </div>

      {Object.keys(groupedBlocks).length === 0 && (
        <p className="text-gray-500">
          No content blocks found. Content blocks are seeded from the current
          site.
        </p>
      )}

      <div className="space-y-8">
        {Object.entries(groupedBlocks).map(([page, pageBlocks]) => (
          <div key={page}>
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              {pageLabels[page] || page.charAt(0).toUpperCase() + page.slice(1)}{" "}
              Page
            </h3>
            <div className="space-y-4">
              {pageBlocks.map((block) => {
                const isEditing = editingId === block.id;
                const bodyPreview = block.body
                  ? block.body.length > 150
                    ? block.body.slice(0, 150) + "..."
                    : block.body
                  : "No content";

                return (
                  <Card key={block.id}>
                    <CardHeader className="flex-row items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {block.section}
                        </CardTitle>
                        <CardDescription>
                          {block.heading || "No heading"}
                        </CardDescription>
                        {!isEditing && (
                          <p className="mt-1 text-sm text-gray-500">
                            {bodyPreview}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() =>
                          setEditingId(isEditing ? null : block.id)
                        }
                      >
                        {isEditing ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CardHeader>

                    {isEditing && (
                      <CardContent className="space-y-4 border-t pt-4">
                        <div>
                          <label className={labelClass}>Heading</label>
                          <Input
                            value={block.heading ?? ""}
                            onChange={(e) =>
                              updateBlock(block.id, {
                                heading: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Body</label>
                          <textarea
                            rows={6}
                            className={textareaClass}
                            value={block.body ?? ""}
                            onChange={(e) =>
                              updateBlock(block.id, {
                                body: e.target.value,
                              })
                            }
                            placeholder="Plain text or simple HTML..."
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleSave(block)}
                            disabled={savingId === block.id}
                          >
                            {savingId === block.id
                              ? "Saving..."
                              : "Save Block"}
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
