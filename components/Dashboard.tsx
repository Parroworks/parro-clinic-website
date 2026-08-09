"use client";

import { motion } from "framer-motion";

const APPTS = [
  { token: "M1", name: "Aarav Sharma",  time: "10:00 AM", type: "In Clinic", status: "seen"    },
  { token: "M2", name: "Meera Nair",    time: "10:15 AM", type: "In Clinic", status: "seen"    },
  { token: "M3", name: "Rajkumar",      time: "10:30 AM", type: "In Clinic", status: "seen"    },
  { token: "M4", name: "Ananya Reddy",  time: "10:45 AM", type: "In Clinic", status: "active"  },
  { token: "M5", name: "Rohan Patel",   time: "11:00 AM", type: "In Clinic", status: "waiting" },
  { token: "M6", name: "Aarav Sharma",  time: "11:15 AM", type: "In Clinic", status: "waiting" },
  { token: "O1", name: "Rohan Patel",   time: "8:00 PM",  type: "Online",    status: "online"  },
  { token: "O2", name: "Meera Nair",    time: "8:30 PM",  type: "Online",    status: "online"  },
];

const NEEDS_ATTENTION = [
  { name: "Meera Nair",   sub: "Follow-up pending",    action: "Call",  kind: "call"  },
  { name: "Ananya Reddy", sub: "Follow-up pending",    action: "Call",  kind: "call"  },
  { name: "Rohan Patel",  sub: "Follow-up pending",    action: "Call",  kind: "call"  },
  { name: "Aarav Sharma", sub: "Query awaiting reply", action: "Reply", kind: "reply" },
  { name: "Rajkumar",     sub: "Query awaiting reply", action: "Reply", kind: "reply" },
  { name: "Ananya Reddy", sub: "Query awaiting reply", action: "Reply", kind: "reply" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "seen")    return <span className="text-[9px]" style={{ color: "#9CA3AF" }}>✅ Seen</span>;
  if (status === "active")  return <span className="px-2 py-0.5 rounded-full text-[9px] font-medium" style={{ background: "rgba(29,158,117,0.12)", color: "var(--teal)" }}>In Progress</span>;
  if (status === "waiting") return <span className="text-[9px]" style={{ color: "var(--slate)" }}>Waiting</span>;
  if (status === "online")  return <span className="px-2 py-0.5 rounded-full text-[9px] font-medium" style={{ background: "#EFF6FF", color: "#3B82F6" }}>Scheduled</span>;
  return null;
}

function DashboardUI() {
  return (
    <div className="flex text-xs" style={{ height: 560 }}>
      {/* Sidebar */}
      <div
        className="w-44 flex-shrink-0 flex flex-col py-3 px-2.5 gap-0.5"
        style={{ background: "#0F0F1F", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-1.5 mb-3 px-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/parro-logo-notag-white.png" alt="" width={110} height={29} style={{ height: 28, width: "auto" }} />
        </div>
        <div className="rounded-lg p-2 mb-2" style={{ background: "rgba(255,255,255,0.05)" }}>
          <p className="text-white font-medium text-[10px]">TrueCare Family Clinic</p>
          <p className="text-gray-400 text-[9px]">Dr. Rajkumar · Paediatrics</p>
        </div>
        <button className="w-full py-1.5 rounded-lg text-[10px] font-semibold text-white mb-1" style={{ background: "var(--wa-green)" }}>+ New Appointment</button>
        <button className="w-full py-1 rounded-lg text-[10px] font-medium mb-2" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "var(--teal-light)" }}>Register Patient</button>

        <p className="text-gray-500 text-[9px] px-1 mb-1 uppercase tracking-wider">Main</p>
        {[
          { label: "Overview",      active: true },
          { label: "Appointments",  badge: "1" },
          { label: "Availability" },
          { label: "Queue" },
          { label: "Patients" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between px-2 py-1 rounded-lg"
            style={{ background: item.active ? "var(--teal)" : "transparent", color: item.active ? "white" : "#9CA3AF" }}>
            <span className="text-[10px]">{item.label}</span>
            {item.badge && <span className="w-3.5 h-3.5 rounded-full text-[8px] flex items-center justify-center font-bold text-white" style={{ background: "var(--amber)" }}>{item.badge}</span>}
          </div>
        ))}

        <p className="text-gray-500 text-[9px] px-1 mt-2 mb-1 uppercase tracking-wider">Clinical</p>
        {[
          { label: "Prescriptions" },
          { label: "Consultations", badge: "2" },
          { label: "Medicines" },
          { label: "Dispensary" },
          { label: "Lab Reports" },
          { label: "Queries",       badge: "3" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between px-2 py-1 rounded-lg" style={{ color: "#9CA3AF" }}>
            <span className="text-[10px]">{item.label}</span>
            {item.badge && <span className="w-3.5 h-3.5 rounded-full text-[8px] flex items-center justify-center font-bold text-white" style={{ background: "var(--coral)" }}>{item.badge}</span>}
          </div>
        ))}

        <p className="text-gray-500 text-[9px] px-1 mt-2 mb-1 uppercase tracking-wider">Outreach</p>
        {[
          { label: "Follow-ups", badge: "18" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between px-2 py-1 rounded-lg" style={{ color: "#9CA3AF" }}>
            <span className="text-[10px]">{item.label}</span>
            {item.badge && <span className="w-3.5 h-3.5 rounded-full text-[8px] flex items-center justify-center font-bold text-white" style={{ background: "var(--coral)" }}>{item.badge}</span>}
          </div>
        ))}

        {/* User */}
        <div className="mt-auto pt-2 flex items-center gap-2 px-1 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "var(--teal)" }}>RK</div>
          <div>
            <p className="text-white text-[9px] font-medium leading-none">Dr. Rajkumar</p>
            <p className="text-gray-500 text-[8px]">Admin · Reception</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col" style={{ background: "var(--mist)", minWidth: 0 }}>
        {/* Topbar */}
        <div className="flex items-center justify-between px-4 py-2" style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
          <div>
            <h1 className="font-bold text-sm" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "var(--navy)" }}>Overview</h1>
            <p className="text-gray-400 text-[9px]">Thursday, 18 June 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg text-[10px] text-gray-400" style={{ background: "#F3F4F6", border: "1px solid var(--border)" }}>🔍 Search patients…</div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold text-white" style={{ background: "var(--wa-green)" }}>● Live</span>
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-[10px]">🔔</div>
          </div>
        </div>

        {/* Alert */}
        <div className="mx-3 mt-2 px-3 py-1.5 rounded-xl text-[10px] font-medium flex items-center justify-between" style={{ background: "#FFFBEB", color: "var(--amber)", border: "1px solid #FDE68A" }}>
          <span>⚠️ 15 follow-ups pending — patients awaiting response</span>
          <span style={{ color: "#D97706" }}>✕</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mx-3 mt-2">
          {["Today", "This Week", "This Month"].map((t, i) => (
            <button key={t} className="px-3 py-1 rounded-lg text-[10px] font-medium"
              style={{ background: i === 0 ? "var(--teal)" : "white", color: i === 0 ? "white" : "var(--slate)", border: `1px solid ${i === 0 ? "var(--teal)" : "var(--border)"}` }}>
              {t}
            </button>
          ))}
        </div>

        {/* Stat cards row 1 */}
        <div className="grid grid-cols-4 gap-2 mx-3 mt-2">
          {[
            { title: "TODAY'S APPOINTMENTS", val: "8",   sub: "3 Completed · 5 Remaining", icon: "📅", accent: "var(--teal)" },
            { title: "LIVE QUEUE",            val: "M4",  sub: "8 tokens today · 3 done",    icon: "#",  accent: "var(--teal)", tag: "LIVE QUEUE" },
            { title: "TOTAL PATIENTS",        val: "187", sub: "15 follow-ups pending",       icon: "📞", accent: "var(--coral)" },
            { title: "PHARMACY ALERTS",       val: "3",   sub: "1 expired · 1 low stock",     icon: "💊", accent: "var(--amber)" },
          ].map((s) => (
            <div key={s.title} className="rounded-xl p-2.5" style={{ background: "white", border: "1px solid var(--border)", borderTop: `3px solid ${s.accent}` }}>
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-gray-400 text-[8px] uppercase tracking-wider">{s.icon} {s.title}</p>
                {s.tag && <span className="text-[7px] font-bold px-1 py-0.5 rounded" style={{ background: "rgba(29,158,117,0.1)", color: "var(--teal)" }}>{s.tag}</span>}
              </div>
              <p className="text-xl font-bold leading-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "var(--navy)" }}>{s.val}</p>
              <p className="text-[8px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Stat cards row 2 */}
        <div className="grid grid-cols-3 gap-2 mx-3 mt-2">
          {[
            { title: "POST-VISIT FOLLOW-UPS", val: "15 pending",    sub: "Awaiting response",     icon: "📞" },
            { title: "LAB REPORTS",           val: "4 pending",     sub: "2 reviewed · 2 new",    icon: "🔬" },
            { title: "PATIENT QUERIES",       val: "3 unanswered",  sub: "13 total this month",   icon: "💬" },
          ].map((s) => (
            <div key={s.title} className="rounded-xl p-2.5" style={{ background: "white", border: "1px solid var(--border)" }}>
              <p className="text-gray-400 text-[8px] uppercase tracking-wider mb-0.5">{s.icon} {s.title}</p>
              <p className="font-bold text-[11px]" style={{ color: "var(--navy)" }}>{s.val}</p>
              <p className="text-[8px] text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Appointments table */}
        <div className="mx-3 mt-2 rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid var(--border)" }}>
          <div className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <p className="font-semibold text-[11px]" style={{ color: "var(--navy)" }}>Today Appointments — 8 active</p>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold text-white" style={{ background: "var(--wa-green)" }}>● Live</span>
          </div>
          <table className="w-full text-[9px]" style={{ tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "14%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "22%" }} />
            </colgroup>
            <thead>
              <tr style={{ background: "var(--mist)" }}>
                {["TOKEN", "PATIENT", "TIME", "TYPE", "STATUS"].map((h) => (
                  <th key={h} className="px-3 py-1.5 text-left font-semibold" style={{ color: "var(--slate)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPTS.map((row) => (
                <tr key={row.token} className="border-b last:border-0" style={{ borderColor: "var(--border)", background: row.status === "active" ? "rgba(29,158,117,0.04)" : "white" }}>
                  <td className="px-3 py-1.5 font-bold" style={{ color: row.status === "seen" ? "#9CA3AF" : row.status === "active" ? "var(--teal)" : "var(--navy)" }}>{row.token}</td>
                  <td className="px-3 py-1.5 truncate" style={{ color: row.status === "seen" ? "#9CA3AF" : "var(--navy)" }}>{row.name}</td>
                  <td className="px-3 py-1.5 text-gray-400">{row.time}</td>
                  <td className="px-3 py-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold"
                      style={row.type === "Online" ? { background: "#EFF6FF", color: "#3B82F6" } : { background: "rgba(29,158,117,0.1)", color: "var(--teal-dark)" }}>
                      {row.type}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-right"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-44 flex-shrink-0 flex flex-col" style={{ background: "white", borderLeft: "1px solid var(--border)" }}>
        <div className="px-3 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
          <p className="font-semibold text-[11px]" style={{ color: "var(--navy)" }}>Needs Attention</p>
          <span className="w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold text-white" style={{ background: "var(--coral)" }}>18</span>
        </div>
        <div className="flex flex-col">
          {NEEDS_ATTENTION.map((f) => (
            <div key={f.name} className="px-3 py-2 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: f.kind === "reply" ? "var(--amber)" : "var(--coral)" }} />
                <div className="min-w-0">
                  <p className="font-medium text-[9px] truncate" style={{ color: "var(--navy)" }}>{f.name}</p>
                  <p className="text-[8px] text-gray-400 truncate">{f.sub}</p>
                </div>
              </div>
              <button className="px-1.5 py-0.5 rounded text-[8px] font-semibold flex-shrink-0 ml-1"
                style={{ background: f.kind === "reply" ? "rgba(29,158,117,0.1)" : "#FEF2F2", color: f.kind === "reply" ? "var(--teal)" : "var(--coral)" }}>
                {f.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <section id="dashboard" className="py-20" style={{ background: "#F8FAFC", borderTop: "4px solid var(--teal)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-4xl font-bold mb-3"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "var(--navy)" }}
          >
            The command centre for your clinic
          </h2>
          <p className="text-lg" style={{ color: "var(--slate)" }}>
            Everything in one view. Nothing to configure.
          </p>
        </motion.div>

        {/* ── MOBILE: stat card grid ── */}
        <motion.div
          className="lg:hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { icon: "📅", title: "Today's Appointments", val: "8",   sub: "3 done · 5 remaining",   accent: "var(--teal)" },
              { icon: "#",  title: "Live Queue",            val: "M4",  sub: "8 tokens · 3 done",      accent: "var(--teal)" },
              { icon: "👥", title: "Total Patients",        val: "187", sub: "15 follow-ups pending",  accent: "var(--coral)" },
              { icon: "💊", title: "Pharmacy Alerts",       val: "3",   sub: "1 expired · 1 low stock",accent: "var(--amber)" },
            ].map((s) => (
              <div key={s.title} className="rounded-xl p-4" style={{ background: "white", border: "1px solid var(--border)", borderTop: `3px solid ${s.accent}` }}>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">{s.icon} {s.title}</p>
                <p className="text-2xl font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "var(--navy)" }}>{s.val}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Appointments list */}
          <div className="rounded-xl overflow-hidden mb-4" style={{ background: "white", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: "var(--border)" }}>
              <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Today's Appointments</p>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: "var(--wa-green)" }}>● Live</span>
            </div>
            {APPTS.map((row) => (
              <div key={row.token} className="px-4 py-3 flex items-center justify-between border-b last:border-0" style={{ borderColor: "var(--border)", background: row.status === "active" ? "rgba(29,158,117,0.04)" : "white" }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold w-8" style={{ color: row.status === "seen" ? "#9CA3AF" : row.status === "active" ? "var(--teal)" : "var(--navy)" }}>{row.token}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: row.status === "seen" ? "#9CA3AF" : "var(--navy)" }}>{row.name}</p>
                    <p className="text-[10px] text-gray-400">{row.time} · {row.type}</p>
                  </div>
                </div>
                <StatusBadge status={row.status} />
              </div>
            ))}
          </div>

          {/* Needs attention */}
          <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
              <p className="font-semibold text-sm" style={{ color: "var(--navy)" }}>Needs Attention</p>
              <span className="w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-bold text-white" style={{ background: "var(--coral)" }}>18</span>
            </div>
            {NEEDS_ATTENTION.slice(0, 4).map((f) => (
              <div key={f.name} className="px-4 py-3 border-b last:border-0 flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: f.kind === "reply" ? "var(--amber)" : "var(--coral)" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--navy)" }}>{f.name}</p>
                    <p className="text-[10px] text-gray-400">{f.sub}</p>
                  </div>
                </div>
                <button className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: f.kind === "reply" ? "rgba(29,158,117,0.1)" : "#FEF2F2", color: f.kind === "reply" ? "var(--teal)" : "var(--coral)" }}>
                  {f.action}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── DESKTOP: full browser mockup ── */}
        <motion.div
          className="hidden lg:block mx-auto overflow-hidden rounded-2xl"
          style={{ maxWidth: "95%", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.13)" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#2D2D2D" }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
            </div>
            <div className="flex-1 mx-4 px-3 py-1 rounded-lg text-xs text-gray-400 text-center" style={{ background: "#1A1A1A" }}>
              praclinic.in/overview
            </div>
          </div>
          <DashboardUI />
        </motion.div>

        {/* Callouts */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            { icon: "⚡", title: "Live updates",       body: "Queue and appointments update in real time",                     bg: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)", iconBg: "rgba(255,255,255,0.15)" },
            { icon: "💬", title: "WhatsApp connected",  body: "All patient communication flows through one number",             bg: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)", iconBg: "rgba(255,255,255,0.15)" },
            { icon: "📱", title: "Multi-device",        body: "Works on phone, tablet, and desktop",                           bg: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)", iconBg: "rgba(255,255,255,0.15)" },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              className="text-center p-7 rounded-2xl"
              style={{ background: c.bg, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                style={{ background: c.iconBg }}>
                {c.icon}
              </div>
              <h3 className="font-semibold text-white mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                {c.title}
              </h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
