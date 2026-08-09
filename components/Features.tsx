"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUEUE_DATA, ANALYTICS_DATA, PHARMACY_ALERTS } from "../lib/constants";

const TABS = ["Queue", "Booking", "Pharmacy", "Online Consultation", "Followup", "Analytics", "Queries"];

function QueueMockup() {
  const morningQueue = QUEUE_DATA.filter((q) => q.status !== "evening");
  const eveningQueue = QUEUE_DATA.filter((q) => q.status === "evening");
  // Start at M3 (index 2) and cycle through morning tokens only
  const [activeIdx, setActiveIdx] = useState(2);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIdx((i) => (i + 1) % morningQueue.length);
    }, 2500);
    return () => clearInterval(t);
  }, [morningQueue.length]);

  // Derive status dynamically from activeIdx
  function getStatus(i: number, isEvening: boolean) {
    if (isEvening) return "evening";
    if (i < activeIdx) return "seen";
    if (i === activeIdx) return "active";
    return "waiting";
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--border)" }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: "var(--navy)" }}>
        <p className="text-white text-sm font-semibold">🏥 TrueCare Family Clinic — Live Queue</p>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--wa-green)", color: "white" }}>
          ● Live
        </span>
      </div>
      <div className="px-4 py-3" style={{ background: "var(--teal-light)" }}>
        <p className="text-sm" style={{ color: "var(--slate)" }}>Now Serving</p>
        <motion.p
          key={morningQueue[activeIdx]?.token}
          className="text-3xl font-bold"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "var(--teal)" }}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {morningQueue[activeIdx]?.token || "—"}
        </motion.p>
        <div className="mt-2 w-full rounded-full h-1.5" style={{ background: "var(--border)" }}>
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${((activeIdx + 1) / morningQueue.length) * 100}%`, background: "var(--teal)" }}
          />
        </div>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {morningQueue.map((q, i) => {
            const status = getStatus(i, false);
            return (
              <tr
                key={q.token}
                className={`border-b transition-all ${status === "active" ? "queue-active" : ""}`}
                style={{ borderColor: "var(--border)", background: status === "active" ? "rgba(29,158,117,0.08)" : "white" }}
              >
                <td className="px-4 py-2.5 font-bold w-12" style={{ color: status === "seen" ? "#9CA3AF" : status === "active" ? "var(--teal)" : "var(--navy)" }}>
                  {q.token}
                </td>
                <td className="px-2 py-2.5" style={{ color: status === "seen" ? "#9CA3AF" : "var(--navy)" }}>
                  {q.name}
                </td>
                <td className="px-2 py-2.5 text-right">
                  {status === "seen" && <span className="text-xs text-gray-400">✅ Seen</span>}
                  {status === "active" && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "var(--teal-light)", color: "var(--teal)" }}>
                      In Progress
                    </span>
                  )}
                  {status === "waiting" && <span className="text-xs" style={{ color: "var(--slate)" }}>Waiting</span>}
                </td>
              </tr>
            );
          })}
          {eveningQueue.map((q) => (
            <tr key={q.token} className="border-b" style={{ borderColor: "var(--border)", background: "white" }}>
              <td className="px-4 py-2.5 font-bold w-12 text-gray-300">{q.token}</td>
              <td className="px-2 py-2.5 text-gray-300">{q.name}</td>
              <td className="px-2 py-2.5 text-right text-xs text-gray-300">Evening</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3">
        <button className="w-full py-2 rounded-xl text-white text-sm font-semibold" style={{ background: "var(--teal)" }}>
          Next →
        </button>
      </div>
    </div>
  );
}

function BookingMockup() {
  return (
    <div className="space-y-2">
      {[
        { text: "Which session?", buttons: ["🌅 Morning", "🌆 Evening"] },
        {
          text: "Morning slots — 17 Jun:",
          buttons: ["⏰ 10:15 AM", "⏰ 10:30 AM", "⏰ 10:45 AM", "See more →"],
        },
        {
          text: "Confirm? Meera Nair · 10:15 AM",
          buttons: ["✅ Confirm", "❌ Cancel"],
        },
      ].map((m, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden"
          style={{ background: "white", border: "1px solid var(--border)" }}
        >
          <p className="px-3 py-2 text-sm text-gray-700">{m.text}</p>
          <div className="border-t border-gray-100">
            {m.buttons.map((b, j) => (
              <div
                key={j}
                className="px-3 py-1.5 text-sm font-medium border-b border-gray-50 last:border-0 text-center"
                style={{ color: "var(--teal)" }}
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PharmacyMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "white", border: "1px solid var(--border)" }}
    >
      <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: "var(--border)" }}>
        <p className="font-semibold" style={{ color: "var(--navy)" }}>💊 Pharmacy Alerts</p>
        <span
          className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold"
          style={{ background: "var(--coral)" }}
        >
          3
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="rounded-xl p-3" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--coral)" }}>
            🔴 Expired — Action Required (1)
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--navy)" }}>
            {PHARMACY_ALERTS.expired[0].name}
          </p>
          <p className="text-xs text-gray-500">
            Batch {PHARMACY_ALERTS.expired[0].batch} · Expired {PHARMACY_ALERTS.expired[0].expiredDate}
          </p>
          <p className="text-xs text-gray-500">{PHARMACY_ALERTS.expired[0].tablets} tablets</p>
          <button className="mt-2 px-3 py-1 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--coral)" }}>
            Write Off
          </button>
        </div>
        <div className="rounded-xl p-3" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--amber)" }}>
            ⚠️ Low Stock (1)
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--navy)" }}>
            {PHARMACY_ALERTS.lowStock[0].name}
          </p>
          <p className="text-xs text-gray-500">
            {PHARMACY_ALERTS.lowStock[0].remaining} tablets left (min: {PHARMACY_ALERTS.lowStock[0].threshold})
          </p>
          <button className="mt-2 px-3 py-1 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--amber)" }}>
            + Add Stock
          </button>
        </div>
        <div className="rounded-xl p-3" style={{ background: "var(--teal-light)", border: "1px solid #A7F3D0" }}>
          <p className="text-xs font-semibold mb-1" style={{ color: "var(--teal-dark)" }}>
            🟡 Expiring Soon (1)
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--navy)" }}>
            {PHARMACY_ALERTS.expiringSoon[0].name}
          </p>
          <p className="text-xs text-gray-500">
            Expires {PHARMACY_ALERTS.expiringSoon[0].expiryDate} · {PHARMACY_ALERTS.expiringSoon[0].tablets} tablets
          </p>
        </div>
      </div>
    </div>
  );
}

function ConsultationMockup() {
  return (
    <div className="space-y-3">
      {/* WhatsApp message — matches real screenshot */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--border)" }}>
        <div className="px-3 py-2.5 space-y-1.5 text-sm text-gray-700">
          <p className="font-medium">🎥 This is an Online Consultation!</p>
          <p className="text-xs text-gray-500">📅 18 Jun 2026 &nbsp;|&nbsp; ⏰ 08:00 PM</p>
          <p className="text-xs text-gray-600">Click the link below to join:</p>
          <p className="text-xs break-all" style={{ color: "var(--teal)" }}>
            https://8x8.vc/vpaas-magic-cookie-f389c6e3.../drkumar-20260618
          </p>
          <div className="pt-1 space-y-0.5 text-xs text-gray-600">
            <p>✅ No download needed</p>
            <p>✅ No login required</p>
            <p>✅ Just click the link at appointment time!</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid var(--border)" }}>
        <div className="px-3 py-2.5 space-y-1 text-sm">
          <p className="font-medium text-gray-800">Online Consultation Confirmed! 🎥✅</p>
          <div className="text-xs text-gray-600 space-y-0.5">
            <p>Patient: Rohan Patel</p>
            <p>Patient Code: <span style={{ color: "var(--teal)" }}>ROH-4259-1984</span></p>
            <p>Date: 18 June 2026</p>
            <p>Time: 8:00 PM &nbsp;·&nbsp; Token: O2</p>
          </div>
          <p className="text-xs text-gray-400 pt-1">You will receive a video join link shortly.</p>
        </div>
      </div>

      {/* Dashboard — dark, matches screenshot */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#1A1A2E", border: "1px solid #2a2a4a" }}>
        <div className="px-3 py-2 border-b border-white/10">
          <p className="text-white text-xs font-semibold">📹 Online Appointments — Today</p>
        </div>
        {[
          { name: "Rohan Patel", time: "8:00 PM", status: "Online · Scheduled" },
          { name: "Ananya Reddy", time: "8:30 PM", status: "Online · Scheduled" },
        ].map((a) => (
          <div key={a.name} className="px-3 py-2.5 border-b border-white/5 last:border-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold text-white" style={{ background: "#3B82F6" }}>Online</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: "rgba(255,255,255,0.1)", color: "#9CA3AF" }}>Scheduled</span>
                </div>
                <p className="text-white text-xs font-medium">{a.name}</p>
                <p className="text-gray-400 text-[10px]">18 Jun 2026, {a.time}</p>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <button className="px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1" style={{ background: "#3B82F6" }}>
                  📹 Join Now
                </button>
                <button className="px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1" style={{ background: "rgba(255,255,255,0.08)", color: "#9CA3AF" }}>
                  Send Link
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FollowupMockup() {
  return (
    <div className="space-y-2">
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "white", border: "1px solid var(--border)" }}
      >
        <div className="px-3 py-2 text-sm text-gray-700">
          How is Aarav feeling today?
          <br />
          <span className="text-xs text-gray-400">(Day after his 5-day course ended)</span>
        </div>
        <div className="border-t border-gray-100">
          {["😊 Doing well", "🤒 Still recovering", "📅 Needs appointment"].map((b) => (
            <div
              key={b}
              className="px-3 py-1.5 text-sm font-medium border-b border-gray-50 last:border-0 text-center"
              style={{ color: "var(--teal)" }}
            >
              {b}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <div
          className="rounded-2xl rounded-tr-sm px-3 py-2 text-sm"
          style={{ background: "#DCF8C6", color: "var(--navy)" }}
        >
          🤒 Still recovering
        </div>
      </div>
      <div
        className="rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-700"
        style={{ background: "white", border: "1px solid var(--border)" }}
      >
        Sorry to hear that. Dr. Kumar will follow up with you shortly. Reply APPT to book a visit.
      </div>
    </div>
  );
}

function AnalyticsMockup() {
  const max = Math.max(...ANALYTICS_DATA.monthlyTrend.map((d) => d.total));
  const w = 360;
  const h = 120;
  const pad = 20;
  const pts = ANALYTICS_DATA.monthlyTrend.map((d, i) => {
    const x = pad + (i / (ANALYTICS_DATA.monthlyTrend.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.total - 100) / (max - 100)) * (h - pad * 2);
    return { x, y, d };
  });
  const newPts = ANALYTICS_DATA.monthlyTrend.map((d, i) => {
    const x = pad + (i / (ANALYTICS_DATA.monthlyTrend.length - 1)) * (w - pad * 2);
    const y = h - pad - (d.new / 80) * (h - pad * 2);
    return { x, y };
  });
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const newPathD = newPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {[
          { v: "187", l: "patients this month", sub: "14.2 avg/day" },
          { v: "4.7/5", l: "satisfaction score", sub: "⭐⭐⭐⭐⭐" },
          { v: "18 min", l: "avg consultation", sub: "↓ 2 min vs last month" },
          { v: "72%", l: "patient retention", sub: "within 30 days" },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded-xl p-3"
            style={{ background: "white", border: "1px solid var(--border)" }}
          >
            <p
              className="text-xl font-bold"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "var(--teal)" }}
            >
              {s.v}
            </p>
            <p className="text-xs" style={{ color: "var(--slate)" }}>{s.l}</p>
            <p className="text-[10px] text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>
      <div
        className="rounded-xl p-3"
        style={{ background: "white", border: "1px solid var(--border)" }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--navy)" }}>
          Patient growth — Jan to Jun 2026
        </p>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
          <path d={pathD} fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d={newPathD} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" strokeDasharray="4 3" />
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--teal)" />
          ))}
          {pts.map((p, i) => (
            <text key={i} x={p.x} y={h - 2} textAnchor="middle" fontSize="8" fill="#9CA3AF">
              {p.d.month}
            </text>
          ))}
        </svg>
        <div className="flex gap-4 mt-1">
          <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--teal)" }}>
            <span className="w-4 border-t-2" style={{ borderColor: "var(--teal)" }} /> Total
          </span>
          <span className="flex items-center gap-1 text-[10px] text-blue-500">
            <span className="w-4 border-t-2 border-dashed border-blue-400" /> New
          </span>
        </div>
      </div>
    </div>
  );
}

function QueriesMockup() {
  const queries = [
    { name: "Aarav Sharma", id: "AAR-8812-2018", q: "My son is still passing loose stools on day 2. Should I bring him in?", unanswered: true },
    { name: "Rohan Patel",  id: "ROH-4259-1984", q: "Is it safe to eat outside food during fever?", unanswered: true },
    { name: "Meera Nair",   id: "MEE-3342-1992", q: "Can I drink fruit juice during this time?", answered: "Yes, please take without sugar and ice 🍹", unanswered: false },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          { v: "3", l: "Unanswered", color: "var(--coral)" },
          { v: "13", l: "Total Queries", color: "var(--amber)" },
          { v: "10", l: "Answered", color: "var(--teal)" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl p-2 text-center" style={{ background: "white", border: "1px solid var(--border)" }}>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: s.color }}>{s.v}</p>
            <p className="text-[10px] text-gray-400">{s.l}</p>
          </div>
        ))}
      </div>
      {queries.map((q) => (
        <div key={q.id} className="rounded-xl p-3" style={{ background: "white", border: `1px solid ${q.unanswered ? "#FECACA" : "var(--border)"}` }}>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: q.unanswered ? "var(--coral)" : "var(--teal)" }}>
              {q.name[0]}
            </div>
            <div>
              <p className="font-semibold text-xs" style={{ color: "var(--navy)" }}>{q.name}</p>
              <p className="text-[9px] text-gray-400">{q.id}</p>
            </div>
          </div>
          <p className="text-xs italic text-gray-600 mb-2">&quot;{q.q}&quot;</p>
          {q.answered ? (
            <div className="rounded-lg px-2 py-1.5 text-xs" style={{ background: "var(--teal-light)", color: "var(--teal-dark)" }}>
              Dr. Kumar: {q.answered}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg px-2 py-1 text-xs border outline-none"
                style={{ borderColor: "var(--border)" }}
                placeholder="Type your reply..."
                readOnly
              />
              <button className="px-3 py-1 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--teal)" }}>Send</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const TAB_DATA = [
  {
    title: "Real-time queue, token by token",
    body: "Morning and evening sessions run independently. M1, M2, M3 for morning. E1, E2, E3 for evening. Doctor taps Next — patient's token advances.",
    bullets: [
      "Patients check their position on WhatsApp",
      "Doctor sees full queue from any device",
      "Cancelled tokens automatically reused",
      "Session transition handled smoothly",
    ],
    mockup: <QueueMockup />,
  },
  {
    title: "Book without calling",
    body: "Interactive buttons replace numbered menus. Patients tap — not type. Works in Tamil, English, and Hindi.",
    bullets: [
      "Interactive list menus",
      "Date and session selection",
      "Slot confirmation before booking",
      "Online or in-clinic choice",
      "Family member management",
    ],
    mockup: <BookingMockup />,
  },
  {
    title: "Stock alerts before you run out",
    body: "Track every medicine by batch and expiry. Auto-deduct when you prescribe. Get alerts before stock runs low.",
    bullets: [
      "FIFO batch management",
      "Expiry alerts 90 days ahead",
      "Auto-deduct on prescription",
      "Supplier and invoice tracking",
    ],
    mockup: <PharmacyMockup />,
  },
  {
    title: "Video consultations, no app needed",
    body: "Set online hours. Patient books via WhatsApp. Gets a link. Clicks it. Joins instantly in their browser — no download, no account.",
    bullets: [
      "8x8 JaaS powered video",
      "Browser-based — no app install",
      "Link sent automatically on booking",
      "Prescription on WhatsApp after call",
      "Consultation history recorded",
    ],
    mockup: <ConsultationMockup />,
  },
  {
    title: "Automated followup, human touch",
    body: "Day after prescription ends, ParroConnect checks on the patient automatically. One tap reply. You only see the ones who need attention.",
    bullets: [
      "Auto-sent on prescription end date",
      "WhatsApp interactive buttons",
      "Voice call fallback if no reply",
      "Sarvam AI Tamil/Hindi voice",
      "Dashboard shows who needs callback",
    ],
    mockup: <FollowupMockup />,
  },
  {
    title: "Know your clinic, grow your practice",
    body: "Patient volume trends. Peak hours. Age distribution. Top conditions. Retention rates. All from real consultation data.",
    bullets: [
      "Monthly patient volume trend",
      "Peak hours heatmap",
      "Top conditions pie chart",
      "Patient retention tracking",
      "Today / This Week / This Month views",
    ],
    mockup: <AnalyticsMockup />,
  },
  {
    title: "Doctor answers on WhatsApp, patients get it instantly",
    body: "Patients send medical questions via WhatsApp. Doctor replies from the dashboard. Patient gets the answer on WhatsApp — no calls, no delays, no dropped messages.",
    bullets: [
      "Patient selects their name from a list",
      "Types question in plain language",
      "Doctor sees all unanswered queries in one view",
      "Reply sent back to patient on WhatsApp immediately",
      "Full query history per patient",
    ],
    mockup: <QueriesMockup />,
  },
];

export default function Features() {
  const [active, setActive] = useState(0);

  return (
    <section id="features" className="py-24" style={{ background: "var(--mist)" }}>
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
            Everything a clinic needs, nothing it doesn&apos;t
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-10 justify-center flex-wrap">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActive(i)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap relative"
              style={{
                background: active === i ? "var(--teal)" : i === 6 ? "var(--navy)" : "white",
                color: active === i ? "white" : i === 6 ? "white" : "var(--slate)",
                border: `1px solid ${active === i ? "var(--teal)" : i === 6 ? "var(--navy)" : "var(--border)"}`,
              }}
            >
              {tab}
              {i === 6 && active !== 6 && (
                <span className="ml-1.5 px-1 py-0.5 rounded text-[9px] font-bold bg-white/20">NEW</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="grid md:grid-cols-2 gap-12 items-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: "var(--teal-light)" }}
              >
                {["🔢", "📅", "💊", "📹", "📞", "📊", "💬"][active]}
              </div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: "var(--navy)" }}
              >
                {TAB_DATA[active].title}
              </h3>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--slate)" }}>
                {TAB_DATA[active].body}
              </p>
              <ul className="space-y-2">
                {TAB_DATA[active].bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm" style={{ color: "var(--slate)" }}>
                    <span style={{ color: "var(--teal)", marginTop: 2 }}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>{TAB_DATA[active].mockup}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
