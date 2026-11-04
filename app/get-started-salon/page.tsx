import type { Metadata } from "next";
import GetStarted from "../get-started/GetStarted";

export const metadata: Metadata = {
  title: "Start your free trial — ParroConnect for salons",
  description:
    "Connect your salon's WhatsApp number to ParroConnect in a few minutes. Free trial, no credit card required.",
  robots: { index: false, follow: false },
};

export default function GetStartedSalonPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#E1F5EE_0%,_#F7FAFA_55%)] px-4 py-10 sm:py-16">
      <GetStarted vertical="salon" />
    </main>
  );
}
