import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../themes/globals.css";
import { siteConfig } from "@/config/site-config";
import { RootProviders } from "@/providers/root-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-muted`}
      >
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
