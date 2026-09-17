import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/kumo/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kumo UI Documentation & Internal Portal",
  description: "Internal documentation, guides, and engineering knowledge base powered by Cloudflare Kumo UI.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-kumo-canvas text-kumo-default antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
