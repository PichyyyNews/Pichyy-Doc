import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();
    const expectedPin = process.env.ADMIN_PIN || "030347";

    if (pin === expectedPin) {
      const cookieStore = await cookies();
      cookieStore.set("kumo_admin_session", "authenticated_030347", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json({ success: true, message: "Authenticated successfully" });
    }

    return NextResponse.json({ success: false, message: "Invalid PIN" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, message: "Bad Request" }, { status: 400 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("kumo_admin_session");
  const isAuthenticated = session?.value === "authenticated_030347";

  return NextResponse.json({ authenticated: isAuthenticated });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("kumo_admin_session");
  return NextResponse.json({ success: true, message: "Logged out" });
}
