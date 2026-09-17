import { NextRequest, NextResponse } from "next/server";
import { deleteDocPage, saveDocPage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = await saveDocPage(body);
    return NextResponse.json({ success: true, page: saved });
  } catch (err) {
    console.error("Error saving doc page:", err);
    return NextResponse.json({ success: false, error: "Failed to save doc page" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const docSpaceId = searchParams.get("docSpaceId");
    const pageId = searchParams.get("pageId");

    if (!docSpaceId || !pageId) {
      return NextResponse.json({ success: false, error: "Missing ids" }, { status: 400 });
    }

    await deleteDocPage(docSpaceId, pageId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting doc page:", err);
    return NextResponse.json({ success: false, error: "Failed to delete doc page" }, { status: 500 });
  }
}
