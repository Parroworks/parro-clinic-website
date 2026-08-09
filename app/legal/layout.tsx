import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "../../components/Logo";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Top nav */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{ background: "white", borderColor: "#E2E8F0" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo size="sm" noTag />
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {[
              { label: "Privacy", href: "/legal/privacy" },
              { label: "Terms", href: "/legal/terms" },
              { label: "DPDP Policy", href: "/legal/dpdp" },
              { label: "Cookie Policy", href: "/legal/cookies" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hidden sm:inline transition-colors hover:opacity-80"
                style={{ color: "#64748B" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ background: "#0D9488" }}
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {children}
      </main>

      <footer className="border-t mt-16 py-8 text-center text-sm" style={{ borderColor: "#E2E8F0", color: "#94A3B8" }}>
        © {new Date().getFullYear()} ParroConnect. All rights reserved.
      </footer>
    </div>
  );
}
