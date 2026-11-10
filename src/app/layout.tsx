import type { Metadata } from "next";
import "./globals.css";
import { PageTransitions } from "@/components/sites/L'WebAgentic/page-transitions";

export const metadata: Metadata = {
  title: "L'Web agentic | Social Content, Video's & Animatie",
  description: "Social content, video's & animatie. L'Web agentic brengt je merk in beweging.",
  icons: { icon: "/sites/extrafazant/favicon-32x32.png", apple: "/sites/extrafazant/favicon-180x180.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body><PageTransitions>{children}</PageTransitions></body>
    </html>
  );
}
