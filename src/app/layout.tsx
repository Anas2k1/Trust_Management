import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trust Management - Database Admin",
  description: "Manage your MongoDB collections with ease"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-900 text-white">{children}</body>
    </html>
  );
}
