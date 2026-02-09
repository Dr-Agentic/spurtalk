import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpurTalk - Anti-Guilt Project Management",
  description: "A calming, supportive project management app designed for psychological safety. No shame, no pressure - just possibilities.",
  keywords: ["project management", "productivity", "mental health", "task management", "psychological safety"],
  authors: [{ name: "SpurTalk" }],
  openGraph: {
    title: "SpurTalk - Anti-Guilt Project Management",
    description: "A calming, supportive project management app designed for psychological safety.",
    type: "website",
  },
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
