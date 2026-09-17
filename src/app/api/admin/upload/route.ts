import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/avif",
    ];

    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only images are permitted." },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Determine extension
    let ext = path.extname(file.name);
    if (!ext) {
      if (file.type === "image/png") ext = ".png";
      else if (file.type === "image/jpeg") ext = ".jpg";
      else if (file.type === "image/gif") ext = ".gif";
      else if (file.type === "image/webp") ext = ".webp";
      else if (file.type === "image/svg+xml") ext = ".svg";
      else ext = ".png";
    }

    const cleanBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^\w-]/g, "")
      .slice(0, 20);

    const filename = `${cleanBaseName || "img"}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url,
      filename,
      originalName: file.name,
    });
  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
