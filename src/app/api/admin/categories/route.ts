import { NextRequest, NextResponse } from "next/server";
import { deleteCategory, saveCategory } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = await saveCategory(body);
    return NextResponse.json({ success: true, category: saved });
  } catch (err) {
    console.error("Error saving category:", err);
    return NextResponse.json({ success: false, error: "Failed to save category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const docSpaceId = searchParams.get("docSpaceId");
    const categoryId = searchParams.get("categoryId");

    if (!docSpaceId || !categoryId) {
      return NextResponse.json({ success: false, error: "Missing ids" }, { status: 400 });
    }

    await deleteCategory(docSpaceId, categoryId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting category:", err);
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
