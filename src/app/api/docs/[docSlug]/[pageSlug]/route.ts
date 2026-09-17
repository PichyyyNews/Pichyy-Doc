import { NextRequest, NextResponse } from "next/server";
import { getPageBySlug } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ docSlug: string; pageSlug: string }> }
) {
  try {
    const { docSlug, pageSlug } = await params;
    const data = await getPageBySlug(docSlug, pageSlug);

    if (!data) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Failed to fetch page:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
