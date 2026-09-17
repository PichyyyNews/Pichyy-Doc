import { NextRequest, NextResponse } from "next/server";
import { searchDocs } from "@/lib/storage";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const results = await searchDocs(query);
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 });
  }
}
