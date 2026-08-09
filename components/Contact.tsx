"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const INITIAL = { name: "", email: "", phone: "", location: "", message: "" };

export default function Contact() {
  const [fields, setFields] = useState(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, formType: "contact" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setFields(INITIAL);
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or WhatsApp us directly.");
    }
  }

  const inputBase = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
  const inputStyle: React.CSSProperties = { background: "white", border: "1.5px solid #E2E8F0", color: "#0F172A" };
  const focusStyle: React.CSSProperties = { border: "1.5px solid #0D9488" };

  return (
    <section id="contact" className="py-20" style={{ background: "var(--mist)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold mb-6"
              style={{ background: "rgba(13,148,136,0.1)", color: "var(--teal-dark)", border: "1px solid rgba(13,148,136,0.25)" }}
            >
              ✉️ Get in touch
            </div>
            <h2
              className="text-4xl font-bold mb-4 leading-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "var(--navy)" }}
            >
              Let&apos;s get your clinic<br />
              <span style={{ color: "var(--teal)" }}>on WhatsApp.</span>
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--slate)" }}>
              Have questions about ParroConnect? Want a personalised demo? Fill the form and we&apos;ll get back to you within 24 hours.
            </p>

            <div className="space-y-4">
              {[
                { icon: "💬", title: "Chat on WhatsApp", sub: "Fastest way to reach us", href: "https://wa.me/918438055569" },
                { icon: "📧", title: "Email us", sub: "support@parroconnect.com", href: "mailto:support@parroconnect.com" },
                { icon: "📍", title: "Based in", sub: "Chennai, Tamil Nadu, India", href: null },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: "white", border: "1px solid var(--border)" }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        className="font-semibold text-sm hover:opacity-80 transition-opacity" style={{ color: "var(--navy)" }}>
                        {item.title}
                      </a>
                    ) : (
                      <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>{item.title}</p>
                    )}
                    <p className="text-sm" style={{ color: "var(--slate)" }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="rounded-2xl p-6 sm:p-8" style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid var(--border)" }}>
              {status === "success" ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#F0FDF9" }}>
                    <CheckCircle size={32} style={{ color: "#0D9488" }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "#0F172A" }}>
                    Message sent!
                  </h3>
                  <p className="text-sm mb-6" style={{ color: "#64748B" }}>
                    We&apos;ll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: "#0D9488" }}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                        Full Name <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input required type="text" placeholder="Dr. Priya Kumar"
                        className={inputBase} style={inputStyle}
                        value={fields.name}
                        onChange={(e) => setFields({ ...fields, name: e.target.value })}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                        Email <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input required type="email" placeholder="doctor@clinic.com"
                        className={inputBase} style={inputStyle}
                        value={fields.email}
                        onChange={(e) => setFields({ ...fields, email: e.target.value })}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>Phone Number</label>
                      <input type="tel" placeholder="+91 98765 43210"
                        className={inputBase} style={inputStyle}
                        value={fields.phone}
                        onChange={(e) => setFields({ ...fields, phone: e.target.value })}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>City / Location</label>
                      <input type="text" placeholder="Chennai, Tamil Nadu"
                        className={inputBase} style={inputStyle}
                        value={fields.location}
                        onChange={(e) => setFields({ ...fields, location: e.target.value })}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                      Message <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <textarea required rows={4}
                      placeholder="Tell us about your clinic — specialty, patients per day, what you need…"
                      className={inputBase} style={{ ...inputStyle, resize: "none" } as React.CSSProperties}
                      value={fields.message}
                      onChange={(e) => setFields({ ...fields, message: e.target.value })}
                      onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                      onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-sm px-3 py-2 rounded-lg" style={{ background: "#FEF2F2", color: "#DC2626" }}>
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: "var(--teal)" }}
                  >
                    {status === "loading" ? "Sending…" : "Send Message →"}
                  </button>

                  <p className="text-center text-xs" style={{ color: "#94A3B8" }}>
                    We typically respond within 24 hours · No spam, ever
                  </p>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
