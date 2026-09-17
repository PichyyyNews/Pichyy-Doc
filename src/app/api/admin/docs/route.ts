import { NextRequest, NextResponse } from "next/server";
import { deleteDocSpace, saveDocSpace } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = await saveDocSpace(body);
    return NextResponse.json({ success: true, docSpace: saved });
  } catch (err) {
    console.error("Error saving doc space:", err);
    return NextResponse.json({ success: false, error: "Failed to save doc space" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing space id" }, { status: 400 });
    }
    await deleteDocSpace(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting doc space:", err);
    return NextResponse.json({ success: false, error: "Failed to delete doc space" }, { status: 500 });
  }
}
