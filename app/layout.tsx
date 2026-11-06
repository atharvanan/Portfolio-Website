import type { Metadata } from "next";
import "./globals.css";
import { siteMetadata } from "@/lib/data";

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.siteUrl),
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          defer
          src="https://fieldwork-rum.vercel.app/rum.min.js"
          data-key="rum_d5097549c82b39bd397e9983f26a3529"
          data-release="1.0.0"
        />
      </head>
      <body className="font-sans antialiased text-ink">{children}</body>
    </html>
  );
}
