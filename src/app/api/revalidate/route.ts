import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path } = body;

    if (path) {
      revalidatePath(path);
    } else {
      // Revalidate all public pages
      revalidatePath("/");
      revalidatePath("/services");
      revalidatePath("/gallery");
      revalidatePath("/promotions");
      revalidatePath("/contact");
    }

    return NextResponse.json({ revalidated: true });
  } catch {
    return NextResponse.json({ revalidated: false }, { status: 500 });
  }
}
