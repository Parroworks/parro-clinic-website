import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParroConnect",
  description:
    "WhatsApp-first clinic management for Indian outpatient clinics. Patients book, check queue, and get reminders — all on WhatsApp. No app download needed.",
  keywords:
    "clinic management software india, whatsapp appointment booking, doctor software tamil, clinic queue management",
  openGraph: {
    title: "ParroConnect — Your clinic, on WhatsApp",
    description: "Patients book on WhatsApp. You manage from dashboard.",
    url: "https://praclinic.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
