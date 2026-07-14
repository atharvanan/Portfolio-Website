import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atharva Nandurkar — Frontend Developer",
  description:
    "Atharva Nandurkar, Frontend Developer with 2+ years of experience building responsive web applications with React.js and Next.js.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Atharva Nandurkar — Frontend Developer",
    description:
      "Frontend Developer with 2+ years of experience building responsive web applications with React.js and Next.js.",
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
      <body className="font-sans antialiased text-ink">{children}</body>
    </html>
  );
}
