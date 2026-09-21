import type { Metadata, Viewport } from "next";
import { Caveat } from "next/font/google";
import { ThemeProvider } from "@/components/kumo/ThemeProvider";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pichyy-Doc - Modern Documentation Platform",
  description: "Modern, high-performance documentation and internal knowledge base platform powered by Next.js 15 and Cloudflare Kumo UI.",
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
      <body className={`min-h-screen bg-kumo-canvas text-kumo-default antialiased ${caveat.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
