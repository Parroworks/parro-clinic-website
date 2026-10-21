import type { Metadata } from "next";
import SignupsAdmin from "./SignupsAdmin";

export const metadata: Metadata = {
  title: "Signups — ParroConnect admin",
  robots: { index: false, follow: false },
};

export default function SignupsAdminPage() {
  return (
    <main className="min-h-screen bg-[var(--mist)] px-4 py-10">
      <SignupsAdmin />
    </main>
  );
}
