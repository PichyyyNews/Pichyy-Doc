import { NextResponse } from "next/server";
import { getAllDocSpaces } from "@/lib/storage";

export async function GET() {
  try {
    const spaces = await getAllDocSpaces();
    return NextResponse.json({ success: true, spaces });
  } catch (error) {
    console.error("Failed to fetch doc spaces:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
