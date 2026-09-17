import type { Metadata } from "next";
import { ThemeProvider } from "@/components/kumo/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kumo UI Documentation & Internal Portal",
  description: "Internal documentation, guides, and engineering knowledge base powered by Cloudflare Kumo UI.",
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
