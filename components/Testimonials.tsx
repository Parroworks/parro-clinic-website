"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "Before ParroConnect, my receptionist spent 2 hours daily answering booking calls. Now patients book themselves when they want.",
    name: "Dr. Priya Ramesh",
    role: "Paediatrician, Chennai",
    initials: "PR",
    color: "#1D9E75",
  },
  {
    quote:
      "The WhatsApp followup is incredible. I know which patients recovered and which need a callback — without lifting a finger.",
    name: "Dr. Arun Kumar",
    role: "General Practitioner, Coimbatore",
    initials: "AK",
    color: "#3B82F6",
  },
  {
    quote:
      "My patients love that it works in Tamil. Even elderly patients manage it easily.",
    name: "Dr. Meena Sundaram",
    role: "ENT Specialist, Madurai",
    initials: "MS",
    color: "#8B5CF6",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24" style={{ background: "white" }}>
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
            Trusted by clinics across Tamil Nadu
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: "white", border: "1px solid var(--border)" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="flex gap-0.5" style={{ color: "var(--amber)" }}>
                {"⭐".repeat(5)}
              </div>
              <p className="text-base leading-relaxed italic flex-1" style={{ color: "var(--slate)" }}>
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--slate)" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
