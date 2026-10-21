"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

type FormType = "demo" | "trial";

interface Props {
  open: boolean;
  formType: FormType;
  onClose: () => void;
}

const INITIAL = { name: "", email: "", phone: "", location: "", message: "" };

export default function ContactModal({ open, formType, onClose }: Props) {
  const [fields, setFields] = useState(INITIAL);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const title   = formType === "demo" ? "Book a Demo" : "Start Free Trial";
  const subtitle = formType === "demo"
    ? "Schedule a personalised walkthrough for your clinic."
    : "Get 30 days free — no credit card required.";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, formType }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or WhatsApp us directly.");
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => { setStatus("idle"); setFields(INITIAL); }, 300);
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all";
  const inputStyle = { background: "#F8FAFC", border: "1.5px solid #E2E8F0", color: "#0F172A" };
  const focusStyle = { border: "1.5px solid #0D9488" };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200]"
            style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
              style={{ background: "white", boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="px-6 pt-6 pb-5 rounded-t-2xl"
                style={{ background: "linear-gradient(135deg, #0F172A 0%, #0D9488 100%)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                      style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
                    >
                      {formType === "demo" ? "📅 Book Demo" : "🚀 Free Trial"}
                    </div>
                    <h2
                      className="text-2xl font-bold text-white mb-1"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    >
                      {title}
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{subtitle}</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="px-6 py-6">
                {status === "success" ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#F0FDF9" }}>
                      <CheckCircle size={32} style={{ color: "#0D9488" }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "#0F172A" }}>
                      Request received!
                    </h3>
                    <p className="text-sm mb-6" style={{ color: "#64748B" }}>
                      {formType === "demo"
                        ? "We'll reach out within 24 hours to schedule your demo."
                        : "Check your inbox — your free trial details are on the way."}
                    </p>
                    <button
                      onClick={handleClose}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "#0D9488" }}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                          Full Name <span style={{ color: "#EF4444" }}>*</span>
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Dr. Priya Kumar"
                          className={inputClass}
                          style={inputStyle}
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
                        <input
                          required
                          type="email"
                          placeholder="doctor@clinic.com"
                          className={inputClass}
                          style={inputStyle}
                          value={fields.email}
                          onChange={(e) => setFields({ ...fields, email: e.target.value })}
                          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                        />
                      </div>
                    </div>

                    {/* Phone + Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className={inputClass}
                          style={inputStyle}
                          value={fields.phone}
                          onChange={(e) => setFields({ ...fields, phone: e.target.value })}
                          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                          City / Location
                        </label>
                        <input
                          type="text"
                          placeholder="Chennai, Tamil Nadu"
                          className={inputClass}
                          style={inputStyle}
                          value={fields.location}
                          onChange={(e) => setFields({ ...fields, location: e.target.value })}
                          onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#475569" }}>
                        Message <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about your clinic — specialty, number of patients per day, what you're looking for…"
                        className={inputClass}
                        style={{ ...inputStyle, resize: "none" }}
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
                      {status === "loading" ? "Sending…" : formType === "demo" ? "📅 Request Demo" : "🚀 Start Free Trial"}
                    </button>

                    <p className="text-center text-xs" style={{ color: "#94A3B8" }}>
                      We typically respond within 24 hours · No spam, ever
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
