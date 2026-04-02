import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB (before compression)
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB

const IMAGE_MAX_WIDTH = 1920;
const IMAGE_QUALITY = 80;

async function compressImage(buffer: Buffer, mimeType: string): Promise<{ data: Buffer; extension: string }> {
  let pipeline = sharp(buffer)
    .resize(IMAGE_MAX_WIDTH, undefined, {
      withoutEnlargement: true,
      fit: "inside",
    })
    .rotate(); // Auto-rotate based on EXIF

  if (mimeType === "image/png") {
    // Convert PNG to WebP for better compression while maintaining quality
    pipeline = pipeline.webp({ quality: IMAGE_QUALITY, effort: 4 });
    return { data: await pipeline.toBuffer(), extension: "webp" };
  } else if (mimeType === "image/webp") {
    pipeline = pipeline.webp({ quality: IMAGE_QUALITY, effort: 4 });
    return { data: await pipeline.toBuffer(), extension: "webp" };
  } else {
    // JPEG — compress as JPEG
    pipeline = pipeline.jpeg({ quality: IMAGE_QUALITY, mozjpeg: true });
    return { data: await pipeline.toBuffer(), extension: "jpg" };
  }
}

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
          error: `Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP, MP4, WebM, MOV`,
        },
        { status: 400 }
      );
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      const limitMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        { error: `File too large. Maximum size is ${limitMB}MB.` },
        { status: 400 }
      );
    }

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    let uploadBuffer: Buffer;
    let fileName: string;

    if (isImage) {
      // Compress image with sharp
      const { data, extension } = await compressImage(originalBuffer, file.type);
      uploadBuffer = data;
      // Generate clean filename
      const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-");
      fileName = `${baseName}.${extension}`;

      console.log(
        `Image compressed: ${(file.size / 1024).toFixed(0)}KB → ${(uploadBuffer.length / 1024).toFixed(0)}KB (${((1 - uploadBuffer.length / file.size) * 100).toFixed(0)}% reduction)`
      );
    } else {
      // Videos: upload as-is (client-side compression handles this)
      uploadBuffer = originalBuffer;
      fileName = file.name;
    }

    const blob = await put(fileName, uploadBuffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true,
      contentType: isImage
        ? fileName.endsWith(".webp")
          ? "image/webp"
          : "image/jpeg"
        : file.type,
    });

    return NextResponse.json({
      url: blob.url,
      originalSize: file.size,
      compressedSize: uploadBuffer.length,
      type: isVideo ? "video" : "image",
    });
  } catch (err) {
    console.error("Upload error:", err);
    const message =
      err instanceof Error ? err.message : "Upload failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
