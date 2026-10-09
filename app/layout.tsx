import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atharva Nandurkar — Full Stack Developer (MERN)",
  description:
    "Atharva Nandurkar, Full Stack Developer with 2+ years of experience building responsive and scalable web applications using React.js, Next.js, Node.js, Express.js, and MongoDB.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Atharva Nandurkar — Full Stack Developer (MERN)",
    description:
      "Full Stack Developer with 2+ years of experience building responsive and scalable web applications using React.js, Next.js, Node.js, Express.js, and MongoDB.",
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
