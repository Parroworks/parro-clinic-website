"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import ContactModal from "./ContactModal";

const PLANS = [
  {
    name: "Starter",
    price: { monthly: 4999, annual: 4166 },
    desc: "For solo practitioners",
    features: [
      { text: "WhatsApp booking", included: true },
      { text: "Live queue management", included: true },
      { text: "Digital Prescription", included: true },
      { text: "Medicine reminders", included: true },
      { text: "Post-visit followup (WhatsApp)", included: true },
      { text: "Online consultation", included: false },
      { text: "Analytics dashboard", included: false },
      { text: "Multi-doctor access", included: false },
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Growth",
    price: { monthly: 7999, annual: 6666 },
    desc: "For busy clinics",
    badge: "Most popular",
    features: [
      { text: "Everything in Starter", included: true },
      { text: "Online video consultation", included: true },
      { text: "Full analytics dashboard", included: true },
      { text: "Pharmacy stock management", included: true },
      { text: "Post-visit followup (WhatsApp + Voice)", included: true },
      { text: "Lab Integration", included: true },
    ],
    cta: "Start free trial →",
    highlight: true,
  },
  {
    name: "Pro",
    price: { monthly: 9999, annual: 8333 },
    desc: "For multi-doctor clinics",
    features: [
      { text: "Everything in Growth", included: true },
      { text: "Multi-doctor access (up to 3)", included: true },
      { text: "Multi-language support", included: true },
      { text: "Priority support", included: true },
      { text: "Daily Broadcast Health tips to patients", included: true },
    ],
    cta: "Contact us",
    highlight: false,
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [modal, setModal]   = useState<{ open: boolean; type: "demo" | "trial" }>({ open: false, type: "trial" });

  return (
    <section id="pricing" className="py-24" style={{ background: "var(--mist)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "var(--navy)" }}
          >
            Simple pricing for Indian clinics
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--slate)" }}>
            No hidden fees. No per-patient charges. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl" style={{ background: "white", border: "1px solid var(--border)" }}>
            <button
              onClick={() => setAnnual(false)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: !annual ? "var(--teal)" : "transparent",
                color: !annual ? "white" : "var(--slate)",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
              style={{
                background: annual ? "var(--teal)" : "transparent",
                color: annual ? "white" : "var(--slate)",
              }}
            >
              Annual
              <span
                className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: annual ? "rgba(255,255,255,0.2)" : "var(--teal-light)", color: annual ? "white" : "var(--teal)" }}
              >
                2 months free
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`rounded-2xl flex flex-col overflow-hidden ${plan.highlight ? "ring-2" : ""}`}
              style={{
                background: plan.highlight ? "var(--navy)" : "white",
                border: plan.highlight ? "none" : "1px solid var(--border)",
                ringColor: plan.highlight ? "var(--teal)" : undefined,
              } as React.CSSProperties}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {plan.badge && (
                <div
                  className="text-center py-2 text-xs font-bold text-white"
                  style={{ background: "var(--teal)" }}
                >
                  {plan.badge}
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3
                  className="text-xl font-bold mb-1"
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    color: plan.highlight ? "white" : "var(--navy)",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: plan.highlight ? "var(--teal-light)" : "var(--slate)" }}
                >
                  {plan.desc}
                </p>
                <div className="mb-6">
                  <span
                    className="text-4xl font-bold"
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      color: plan.highlight ? "white" : "var(--navy)",
                    }}
                  >
                    ₹{(annual ? plan.price.annual : plan.price.monthly).toLocaleString("en-IN")}
                  </span>
                  <span
                    className="text-sm ml-1"
                    style={{ color: plan.highlight ? "var(--teal-light)" : "var(--slate)" }}
                  >
                    /month
                  </span>
                  {annual && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: plan.highlight ? "var(--teal-light)" : "var(--teal)" }}
                    >
                      Billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <Check
                          size={16}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: plan.highlight ? "var(--wa-green)" : "var(--teal)" }}
                        />
                      ) : (
                        <X size={16} className="flex-shrink-0 mt-0.5 text-gray-300" />
                      )}
                      <span
                        style={{
                          color: f.included
                            ? plan.highlight
                              ? "var(--teal-light)"
                              : "var(--slate)"
                            : "#CBD5E0",
                        }}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {(() => {
                  const cls = "block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90";
                  const style = plan.highlight
                    ? { background: "var(--teal)", color: "white" }
                    : { border: "1px solid var(--border)", color: "var(--navy)", background: "transparent" };
                  return plan.name === "Pro" ? (
                    <button onClick={() => setModal({ open: true, type: "demo" })} className={cls} style={style}>
                      {plan.cta}
                    </button>
                  ) : (
                    <a href="/get-started" className={cls} style={style}>{plan.cta}</a>
                  );
                })()}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm" style={{ color: "var(--slate)" }}>
          All plans include a 30-day free trial. No credit card required.
        </p>
      </div>

      <ContactModal
        open={modal.open}
        formType={modal.type}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
      />
    </section>
  );
}
