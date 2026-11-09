import type React from "react";
import type { Metadata } from "next";

import { WhatsAppButton } from "@/components/whatsapp-button";
import { ThemeProvider } from "@/components/theme-provider";
import { SaaSProvider } from "@/components/saas-provider";
import { MotionProvider } from "@/components/motion-provider";
import { SiteEntryExperience } from "@/components/site-entry-experience";
import "./globals.css";

export const metadata: Metadata = {
  title: "TONMAG Homes",
  description:
    "Discover Luxury Living with TONMAG Homes - Where Innovation Meets Elegance in Every Detail.",
  generator: "TERRY",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <MotionProvider><SaaSProvider>
            <SiteEntryExperience />
            {children}
            <WhatsAppButton />
          </SaaSProvider></MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
