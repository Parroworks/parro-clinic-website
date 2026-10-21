"use client";

import { useState } from "react";

type Signup = {
  id: string;
  doctor_name: string;
  clinic_name: string;
  email: string;
  mobile: string;
  city?: string;
  status: string;
  display_phone_number?: string;
  phone_status?: string;
  registration_note?: string;
  created_at: string;
};

type Login = { username: string; pin: string; note: string };

type ClinicBilling = {
  doctor_id: string;
  clinic_name: string;
  doctor_name: string;
  mobile: string;
  status: string;
  paused: boolean;
  days_left: number | null;
  ends_at: string | null;
  plan: string | null;
  cycle: string | null;
};

const API = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const FILTERS = ["pending_approval", "details_submitted", "approved", "rejected"];

export default function SignupsAdmin() {
  const [key, setKey] = useState("");
  const [filter, setFilter] = useState("pending_approval");
  const [rows, setRows] = useState<Signup[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [login, setLogin] = useState<{ clinic: string; login: Login } | null>(null);
  const [billing, setBilling] = useState<ClinicBilling[] | null>(null);

  const call = async (path: string, init?: RequestInit) => {
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", "X-Admin-Key": key },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Request failed");
    return data;
  };

  const load = async (f = filter) => {
    setError(null);
    try {
      const data = await call(`/api/v1/admin/signups?status=${f}`);
      setRows(data.signups);
    } catch (e) {
      setRows(null);
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  };

  const loadBilling = async () => {
    try {
      const data = await call("/api/v1/admin/billing");
      setBilling(data.clinics);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load billing");
    }
  };

  const adjust = async (c: ClinicBilling, body: object) => {
    setBusyId(c.doctor_id);
    try {
      await call(`/api/v1/admin/billing/${c.doctor_id}`, { method: "POST", body: JSON.stringify(body) });
      await loadBilling();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const markPaid = (c: ClinicBilling) => {
    const days = Number(window.prompt(`Mark ${c.clinic_name} paid for how many days from today?`, "30"));
    if (!days || days < 1) return;
    void adjust(c, { paid_until: new Date(Date.now() + days * 86_400_000).toISOString() });
  };

  const act = async (s: Signup, action: "approve" | "reject") => {
    let body: string | undefined;
    if (action === "reject") {
      const reason = window.prompt("Reason for rejection (optional)") ?? undefined;
      body = JSON.stringify({ reason });
    } else if (!window.confirm(`Approve ${s.clinic_name} and start their free trial?`)) {
      return;
    }
    setBusyId(s.id);
    try {
      const data = await call(`/api/v1/admin/signups/${s.id}/${action}`, { method: "POST", body: body ?? "{}" });
      if (action === "approve") setLogin({ clinic: s.clinic_name, login: data.login });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-2xl font-bold text-[var(--navy)]">Clinic signups</h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Admin key"
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm" />
        <button onClick={() => { void load(); void loadBilling(); }} disabled={!key}
          className="rounded-lg bg-[var(--teal)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Load</button>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => { setFilter(f); if (key) void load(f); }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${f === filter ? "bg-[var(--navy)] text-white" : "bg-white text-[var(--slate)] border border-[var(--border)]"}`}>
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--coral)]">{error}</p>}

      {login && (
        <div className="mt-4 rounded-xl border border-[var(--teal)]/40 bg-[var(--teal-light)] p-4 text-sm">
          <p className="font-semibold text-[var(--navy)]">{login.clinic} approved — dashboard login (shown once)</p>
          <p className="mt-1 font-mono">username: {login.login.username} &nbsp; PIN: {login.login.pin}</p>
          <p className="mt-1 text-[var(--slate)]">{login.login.note}</p>
          <button onClick={() => setLogin(null)} className="mt-2 text-xs underline">Dismiss</button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {rows?.length === 0 && <p className="text-sm text-[var(--slate)]">Nothing here.</p>}
        {rows?.map((s) => (
          <div key={s.id} className="rounded-xl border border-[var(--border)] bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[var(--navy)]">{s.clinic_name} <span className="font-normal text-[var(--slate)]">— {s.doctor_name}</span></p>
                <p className="text-sm text-[var(--slate)]">{s.email} · {s.mobile}{s.city ? ` · ${s.city}` : ""}</p>
                <p className="mt-1 text-sm text-[var(--slate)]">
                  WhatsApp: {s.display_phone_number ?? "not connected"}{s.phone_status ? ` (${s.phone_status})` : ""}
                </p>
                {s.registration_note && <p className="mt-1 text-xs text-[var(--amber)]">{s.registration_note}</p>}
                <p className="mt-1 text-xs text-[var(--slate)]">{new Date(s.created_at).toLocaleString()}</p>
              </div>
              {s.status === "pending_approval" && (
                <div className="flex gap-2">
                  <button disabled={busyId === s.id} onClick={() => act(s, "approve")}
                    className="rounded-lg bg-[var(--teal)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve</button>
                  <button disabled={busyId === s.id} onClick={() => act(s, "reject")}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--coral)] disabled:opacity-50">Reject</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {billing && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-[var(--navy)]">Clinic billing</h2>
          <p className="mt-1 text-sm text-[var(--slate)]">Trial and subscription status. Adjust manually if a clinic pays you outside Razorpay.</p>
          <div className="mt-4 space-y-3">
            {billing.length === 0 && <p className="text-sm text-[var(--slate)]">No clinics on a trial or plan yet.</p>}
            {billing.map((c) => (
              <div key={c.doctor_id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white p-4">
                <div>
                  <p className="font-semibold text-[var(--navy)]">{c.clinic_name} <span className="font-normal text-[var(--slate)]">— {c.doctor_name}</span></p>
                  <p className="text-sm text-[var(--slate)]">
                    <span className={c.paused ? "font-semibold text-[var(--coral)]" : "font-semibold text-[var(--teal-dark)]"}>
                      {c.paused ? "Paused" : c.status}
                    </span>
                    {c.days_left !== null && ` · ${c.days_left >= 0 ? `${c.days_left} day(s) left` : `ended ${-c.days_left} day(s) ago`}`}
                    {c.ends_at && ` (${new Date(c.ends_at).toLocaleDateString()})`}
                    {c.plan && ` · plan: ${c.plan}${c.cycle ? ` / ${c.cycle}` : ""}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button disabled={busyId === c.doctor_id} onClick={() => adjust(c, { extend_days: 7 })}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-50">+7 days trial</button>
                  <button disabled={busyId === c.doctor_id} onClick={() => markPaid(c)}
                    className="rounded-lg bg-[var(--teal)] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Mark paid</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
