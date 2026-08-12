import type { Metadata } from "next";
import EmbeddedSignup from "./EmbeddedSignup";

export const metadata: Metadata = {
  title: "WhatsApp Embedded Signup — ParroConnect",
  description: "Connect WhatsApp Business via Meta Embedded Signup",
  robots: { index: false, follow: false },
};

export default function WhatsAppSignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#E1F5EE_0%,_#F7FAFA_55%)] px-6 py-16">
      <EmbeddedSignup />
    </main>
  );
}
