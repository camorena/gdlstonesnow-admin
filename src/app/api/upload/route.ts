import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type "${file.type}". Allowed types: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      const limitMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        { error: `File too large. Maximum size is ${limitMB}MB.` },
        { status: 400 }
      );
    }

    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
