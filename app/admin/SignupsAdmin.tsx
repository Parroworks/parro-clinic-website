"use client";

import { useEffect, useState } from "react";
import { VERTICALS, VERTICAL_KEYS, type VerticalKey } from "@/lib/verticals";

type Signup = {
  id: string;
  owner_name: string;
  business_name: string;
  email: string;
  mobile: string;
  city?: string;
  status: string;
  display_phone_number?: string;
  phone_status?: string;
  registration_note?: string;
  created_at: string;
  messaging_ready?: boolean;
  setup?: { key: string; label: string; ok: boolean; detail?: string | null }[];
  provisioning?: { templates?: Record<string, string>; error?: string | null; health?: Health };
};

type Part<T> = T & { error?: string };
type Health = {
  checked_at?: string;
  templates_error?: string;
  number?: Part<{ quality_rating?: string; messaging_limit_tier?: string; name_status?: string; status?: string; verified_name?: string }>;
  account?: Part<{ account_review_status?: string; business_verification_status?: string; currency?: string }>;
  usage?: {
    days: number;
    messages?: Part<{ sent?: number; delivered?: number }>;
    cost?: Part<{ total?: number; by_category?: Record<string, { volume: number; cost: number }> }>;
  };
};

const QUALITY_COLOR: Record<string, string> = {
  GREEN: "bg-[var(--teal-light)] text-[var(--teal-dark)]", YELLOW: "bg-amber-50 text-[var(--amber)]", RED: "bg-red-50 text-[var(--coral)]",
};
const tier = (t?: string) => (t ? `${t.replace("TIER_", "")}${t === "UNLIMITED" ? "" : " / 24h"}` : "—");
const ago = (iso?: string) => {
  if (!iso) return "";
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`;
};

type Login = { username: string; pin: string; note: string };

type ClinicBilling = {
  tenant_id: string;
  name: string;
  owner_name: string;
  owner_mobile: string;
  status: string;
  paused: boolean;
  days_left: number | null;
  ends_at: string | null;
  plan: string | null;
  cycle: string | null;
};

const tokenKey = (v: VerticalKey) => `parro_admin_token_${v}`;
const FILTERS = ["pending_approval", "details_submitted", "approved", "rejected"];

export default function SignupsAdmin() {
  const [vertical, setVertical] = useState<VerticalKey>("clinic");
  const [token, setToken] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("");
  const [needsChange, setNeedsChange] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [filter, setFilter] = useState("pending_approval");
  const [rows, setRows] = useState<Signup[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [login, setLogin] = useState<{ clinic: string; login: Login } | null>(null);
  const [billing, setBilling] = useState<ClinicBilling[] | null>(null);

  const signOut = () => {
    try { sessionStorage.removeItem(tokenKey(vertical)); } catch { /* storage unavailable */ }
    setToken(null);
    setRows(null);
    setBilling(null);
    setNeedsChange(false);
  };

  const call = async (path: string, init?: RequestInit, withToken: string | null = token, v: VerticalKey = vertical) => {
    if (!VERTICALS[v].apiUrl) throw new Error(`The ${VERTICALS[v].label} backend URL is not configured on this site`);
    const res = await fetch(`${VERTICALS[v].apiUrl}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(withToken ? { Authorization: `Bearer ${withToken}` } : {}) },
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 403 && data.detail === "password_change_required") {
      setNeedsChange(true);
      throw new Error("Set a new password to continue");
    }
    if (res.status === 401 && withToken) {
      signOut();
      throw new Error("Your session ended. Sign in again.");
    }
    if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Request failed");
    return data;
  };

  const start = (t: string, name: string, mustChange: boolean) => {
    try { sessionStorage.setItem(tokenKey(vertical), t); } catch { /* storage unavailable */ }
    setToken(t);
    setAdminName(name);
    setNeedsChange(mustChange);
    setError(null);
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await call("/api/v1/admin/login", { method: "POST", body: JSON.stringify({ email, password }) }, null);
      setPassword("");
      start(data.token, data.admin.name, data.admin.must_change_password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await call("/api/v1/admin/change-password", { method: "POST", body: JSON.stringify({ current_password: password, new_password: newPassword }) });
      setPassword("");
      setNewPassword("");
      setNeedsChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password");
    }
  };

  // Each business type has its own backend and its own admin logins: switching clears the screen and restores that one's session
  useEffect(() => {
    setToken(null);
    setRows(null);
    setBilling(null);
    setNeedsChange(false);
    setError(null);
    setLogin(null);
    let saved: string | null = null;
    try { saved = sessionStorage.getItem(tokenKey(vertical)); } catch { /* storage unavailable */ }
    if (!saved) return;
    call("/api/v1/admin/me", undefined, saved, vertical)
      .then((d) => start(saved as string, d.admin.name, d.admin.must_change_password))
      .catch(() => signOut());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vertical]);

  useEffect(() => {
    if (token && !needsChange) { void load(); void loadBilling(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, needsChange]);

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
      setBilling(data.tenants);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load billing");
    }
  };

  const adjust = async (c: ClinicBilling, body: object) => {
    setBusyId(c.tenant_id);
    try {
      await call(`/api/v1/admin/billing/${c.tenant_id}`, { method: "POST", body: JSON.stringify(body) });
      await loadBilling();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const refreshStatus = async (s: Signup) => {
    setBusyId(s.id);
    setError(null);
    try {
      const data = await call(`/api/v1/admin/signups/${s.id}/status/refresh`, { method: "POST", body: "{}" });
      setRows((cur) => cur && cur.map((r) => (r.id === s.id ? { ...r, setup: data.setup, provisioning: { ...r.provisioning, templates: data.templates, health: data.health } } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not refresh status");
    } finally {
      setBusyId(null);
    }
  };

  const markPaid = (c: ClinicBilling) => {
    const days = Number(window.prompt(`Mark ${c.name} paid for how many days from today?`, "30"));
    if (!days || days < 1) return;
    void adjust(c, { paid_until: new Date(Date.now() + days * 86_400_000).toISOString() });
  };

  const act = async (s: Signup, action: "approve" | "reject") => {
    let body: string | undefined;
    if (action === "reject") {
      const reason = window.prompt("Reason for rejection (optional)") ?? undefined;
      body = JSON.stringify({ reason });
    } else if (!window.confirm(`Approve ${s.business_name} and start their free trial?`)) {
      return;
    }
    setBusyId(s.id);
    try {
      const data = await call(`/api/v1/admin/signups/${s.id}/${action}`, { method: "POST", body: body ?? "{}" });
      if (action === "approve") setLogin({ clinic: s.business_name, login: data.login });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className={token && !needsChange ? "mx-auto max-w-5xl" : "mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center"}>
      <div className={`mb-4 flex gap-2 ${token && !needsChange ? "" : "justify-center"}`} role="tablist" aria-label="Business type">
        {VERTICAL_KEYS.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={k === vertical} onClick={() => setVertical(k)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${k === vertical ? "bg-[var(--navy)] text-white" : "border border-[var(--border)] bg-white text-[var(--slate)]"}`}>
            {VERTICALS[k].label}
          </button>
        ))}
      </div>
      <h1 className={`font-display text-2xl font-bold text-[var(--navy)] ${token && !needsChange ? "" : "text-center"}`}>
        {!token ? `${VERTICALS[vertical].label} admin login` : needsChange ? "Set your password" : `${VERTICALS[vertical].label} signups`}
      </h1>

      {!token && (
        <form onSubmit={signIn} className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm" />
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm" />
          <button type="submit" className="rounded-lg bg-[var(--teal)] px-4 py-2.5 text-sm font-semibold text-white">Sign in</button>
        </form>
      )}

      {token && needsChange && (
        <form onSubmit={changePassword} className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
          <p className="text-center text-sm text-[var(--slate)]">Choose your own password (at least 10 characters) before continuing.</p>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Temporary password"
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm" />
          <input type="password" required minLength={10} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password"
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="submit" className="rounded-lg bg-[var(--teal)] px-4 py-2 text-sm font-semibold text-white">Save password</button>
            <button type="button" onClick={signOut} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm">Sign out</button>
          </div>
        </form>
      )}

      {token && !needsChange && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--slate)]">Signed in as {adminName}</span>
          <button onClick={signOut} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs">Sign out</button>
          {FILTERS.map((f) => (
            <button key={f} onClick={() => { setFilter(f); void load(f); }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${f === filter ? "bg-[var(--navy)] text-white" : "bg-white text-[var(--slate)] border border-[var(--border)]"}`}>
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      {error && <p role="alert" className={`mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--coral)] ${token && !needsChange ? "" : "text-center"}`}>{error}</p>}

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
                <p className="font-semibold text-[var(--navy)]">{s.business_name} <span className="font-normal text-[var(--slate)]">— {s.owner_name}</span></p>
                <p className="text-sm text-[var(--slate)]">{s.email} · {s.mobile}{s.city ? ` · ${s.city}` : ""}</p>
                <p className="mt-1 text-sm text-[var(--slate)]">
                  WhatsApp: {s.display_phone_number ?? "not connected"}{s.phone_status ? ` (${s.phone_status})` : ""}
                </p>
                {s.registration_note && <p className="mt-1 text-xs text-[var(--amber)]">{s.registration_note}</p>}
                {s.status === "approved" && (() => {
                  const steps = s.setup ?? [];
                  const ready = steps.find((i) => i.key === "ready");
                  const aiSteps = steps.filter((i) => ["business", "project", "waba", "token", "webhook"].includes(i.key));
                  const tplStep = steps.find((i) => i.key === "templates");
                  const h = s.provisioning?.health as Health | undefined;
                  const n = h?.number, a = h?.account, m = h?.usage?.messages, c = h?.usage?.cost;
                  const chip = (i: { key: string; label: string; ok: boolean; detail?: string | null }) => (
                    <span key={i.key} title={i.detail ?? undefined}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${i.ok ? "bg-[var(--teal-light)] text-[var(--teal-dark)]" : "bg-amber-50 text-[var(--amber)]"}`}>
                      {i.ok ? "✓" : "…"} {i.label}{i.key === "templates" && i.detail ? ` ${i.detail}` : ""}
                    </span>
                  );
                  return (
                    <div className="mt-3 space-y-2">
                      {ready && (
                        <p className="text-sm font-medium text-[var(--navy)]">
                          Overall: {ready.ok ? "✓ Messaging ready" : "… Messaging not ready yet"}
                        </p>
                      )}
                      <div className="rounded-lg border border-[var(--border)] p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--slate)]">AiSensy</p>
                        <p className="mt-1.5 flex flex-wrap gap-1.5">{aiSteps.map(chip)}</p>
                        {s.provisioning?.error && <p className="mt-1.5 text-xs text-[var(--coral)]">Setup error: {s.provisioning.error}</p>}
                      </div>
                      <div className="rounded-lg border border-[var(--border)] p-3 text-sm text-[var(--slate)]">
                        <p className="text-xs font-semibold uppercase tracking-wide">Meta (WhatsApp Business)</p>
                        {h ? (
                          <div className="mt-1.5 space-y-1">
                            <p>
                              Number:{" "}
                              {n?.error ? <span className="text-[var(--coral)]">{n.error}</span> : (<>
                                <span className={`mr-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${QUALITY_COLOR[n?.quality_rating ?? ""] ?? "bg-[var(--mist)]"}`}>
                                  quality {n?.quality_rating ?? "—"}</span>
                                limit {tier(n?.messaging_limit_tier)} · {n?.status ?? "—"} · name {n?.name_status ?? "—"}
                              </>)}
                            </p>
                            <p>
                              Account:{" "}
                              {a?.error ? <span className="text-[var(--coral)]">{a.error}</span>
                                : <>review {a?.account_review_status ?? "—"} · business verification {a?.business_verification_status ?? "—"}</>}
                            </p>
                            <p>
                              Last {h.usage?.days ?? 30} days:{" "}
                              {m?.error ? <span className="text-[var(--coral)]">{m.error}</span> : <>{m?.sent ?? 0} sent, {m?.delivered ?? 0} delivered</>}
                              {c?.error ? null : <> · est. cost {c?.total ?? 0}{a?.currency ? ` ${a.currency}` : ""}</>}
                            </p>
                            <p className="text-xs">Checked {ago(h.checked_at)}</p>
                          </div>
                        ) : <p className="mt-1.5 text-xs">Not checked yet — press Refresh status.</p>}
                        <p className="mt-1.5">
                          Templates {tplStep?.detail ? `(${tplStep.detail} approved)` : ""}:{" "}
                          {s.provisioning?.templates && Object.keys(s.provisioning.templates).length ? (
                            Object.entries(s.provisioning.templates).map(([name, status]) => (
                              <span key={name} title={`${name}: ${status}`}
                                className={`mr-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                  status === "APPROVED" ? "bg-[var(--teal-light)] text-[var(--teal-dark)]"
                                  : status === "PENDING" || status === "IN_APPEAL" ? "bg-amber-50 text-[var(--amber)]"
                                  : "bg-red-50 text-[var(--coral)]"}`}>
                                {name.replace(/^parro_/, "")}: {status.startsWith("ERROR") ? "ERROR" : status}
                              </span>
                            ))
                          ) : "none submitted yet"}
                        </p>
                        {h?.templates_error && <p className="text-xs text-[var(--coral)]">Templates: {h.templates_error}</p>}
                      </div>
                    </div>
                  );
                })()}
                <p className="mt-1 text-xs text-[var(--slate)]">{new Date(s.created_at).toLocaleString()}</p>
              </div>
              {s.status === "approved" && (
                <button disabled={busyId === s.id} onClick={() => refreshStatus(s)}
                  className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-50">Refresh status</button>
              )}
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
          <h2 className="font-display text-xl font-bold text-[var(--navy)]">Billing</h2>
          <p className="mt-1 text-sm text-[var(--slate)]">Trial and subscription status. Adjust manually if a clinic pays you outside Razorpay.</p>
          <div className="mt-4 space-y-3">
            {billing.length === 0 && <p className="text-sm text-[var(--slate)]">No businesses on a trial or plan yet.</p>}
            {billing.map((c) => (
              <div key={c.tenant_id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-white p-4">
                <div>
                  <p className="font-semibold text-[var(--navy)]">{c.name} <span className="font-normal text-[var(--slate)]">— {c.owner_name}</span></p>
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
                  <button disabled={busyId === c.tenant_id} onClick={() => adjust(c, { extend_days: 7 })}
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-50">+7 days trial</button>
                  <button disabled={busyId === c.tenant_id} onClick={() => markPaid(c)}
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
