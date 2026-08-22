import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = { title: "Innovatio Academy", description: "Full-stack Software Engineering" };

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
      <link
        href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
        rel="stylesheet"
        precedence="default"
      />
      <body>{children}</body>
    </html>
  );
}
