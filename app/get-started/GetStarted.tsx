"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { ClinicIllustration, ConnectIllustration, DoneIllustration } from "./illustrations";

declare global {
  interface Window {
    FB?: {
      init: (opts: { appId: string; cookie?: boolean; xfbml?: boolean; version: string }) => void;
      login: (cb: (res: FbLoginResponse) => void, opts: Record<string, unknown>) => void;
    };
    fbAsyncInit?: () => void;
  }
}

type FbLoginResponse = { authResponse?: { code?: string } | null; status?: string };
type SessionInfo = { waba_id?: string; phone_number_id?: string };
type Step = "details" | "connect" | "done";

const APP_ID = process.env.NEXT_PUBLIC_META_APP_ID ?? "";
const CONFIG_ID = process.env.NEXT_PUBLIC_META_CONFIG_ID ?? "";
const SOLUTION_ID = process.env.NEXT_PUBLIC_META_SOLUTION_ID ?? "";
const GRAPH_VERSION = process.env.NEXT_PUBLIC_META_GRAPH_VERSION ?? "v20.0";
const API = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
const STORAGE_KEY = "parro_signup_id";

const LANGUAGES = ["English", "Tamil", "Hindi", "Telugu", "Kannada", "Malayalam"];

const inputCls =
  "mt-1 w-full rounded-xl border border-[var(--border)] bg-white px-3.5 py-3 text-base text-[var(--navy)] outline-none transition focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/20";

function store(key: string, value?: string) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — flow still works without resume */
  }
  return null;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data?.detail;
    throw new Error(
      typeof detail === "string" ? detail : "Something went wrong. Please try again."
    );
  }
  return data as T;
}

function Stepper({ step }: { step: Step }) {
  const items: { id: Step; label: string }[] = [
    { id: "details", label: "Clinic details" },
    { id: "connect", label: "Connect WhatsApp" },
    { id: "done", label: "Done" },
  ];
  const idx = items.findIndex((i) => i.id === step);
  return (
    <ol className="mb-8 flex items-center justify-between gap-2" aria-label="Progress">
      {items.map((it, i) => (
        <li key={it.id} className="flex flex-1 items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              i <= idx ? "bg-[var(--teal)] text-white" : "bg-[var(--border)] text-[var(--slate)]"
            }`}
            aria-current={i === idx ? "step" : undefined}
          >
            {i < idx ? "✓" : i + 1}
          </span>
          <span
            className={`hidden text-xs font-medium sm:block ${
              i <= idx ? "text-[var(--navy)]" : "text-[var(--slate)]"
            }`}
          >
            {it.label}
          </span>
          {i < items.length - 1 && <span className="h-px flex-1 bg-[var(--border)]" />}
        </li>
      ))}
    </ol>
  );
}

const PANEL: Record<Step, { title: string; text: string; Art: () => React.JSX.Element }> = {
  details: {
    title: "Run your clinic on WhatsApp",
    text: "Appointments, reminders and follow-ups handled automatically — right where your patients already chat.",
    Art: ClinicIllustration,
  },
  connect: {
    title: "Connect your clinic's number",
    text: "Patients keep messaging the number they already know. We plug in the assistant behind it.",
    Art: ConnectIllustration,
  },
  done: {
    title: "You're almost live",
    text: "We're setting things up for you. You'll hear from us as soon as your clinic is ready.",
    Art: DoneIllustration,
  },
};

const BENEFITS = [
  "30-day free trial, no card needed",
  "Ready in about 3 minutes",
  "Patients can chat in their own language",
];

function VisualPanel({ step }: { step: Step }) {
  const { title, text, Art } = PANEL[step];
  return (
    <aside className="lg:rounded-3xl lg:border lg:border-white/60 lg:bg-white/40 lg:p-10 lg:shadow-sm lg:backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[15rem] sm:max-w-xs lg:max-w-md">
        <Art />
      </div>
      <div className="mt-2 hidden lg:block">
        <h2 className="font-display text-2xl font-bold leading-tight text-[var(--navy)]">{title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--slate)]">{text}</p>
        <ul className="mt-6 space-y-2.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-[var(--navy)]">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--teal)]" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default function GetStarted() {
  const [step, setStep] = useState<Step>("details");
  const [signupId, setSignupId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [result, setResult] = useState<{ clinic_name?: string; display_phone_number?: string; status?: string }>({});
  const [form, setForm] = useState({
    doctor_name: "",
    clinic_name: "",
    email: "",
    mobile: "",
    city: "",
    language: "English",
  });

  const sessionInfo = useRef<SessionInfo>({});
  const cancelled = useRef(false);

  // Resume an in-progress signup after refresh
  useEffect(() => {
    const saved = store(STORAGE_KEY);
    if (!saved) return;
    api<{ status: string; clinic_name: string; display_phone_number?: string }>(
      `/api/v1/onboarding/status/${saved}`
    )
      .then((s) => {
        setSignupId(saved);
        setResult(s);
        setStep(s.status === "details_submitted" ? "connect" : "done");
      })
      .catch(() => {
        /* stale id — start fresh */
      });
  }, []);

  // Facebook SDK init
  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB?.init({ appId: APP_ID, cookie: true, xfbml: false, version: GRAPH_VERSION });
      setSdkReady(true);
    };
    if (window.FB) window.fbAsyncInit();
  }, []);

  // Embedded Signup posts the chosen WABA / phone number back via postMessage
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.facebook.com" && event.origin !== "https://web.facebook.com") return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.type !== "WA_EMBEDDED_SIGNUP") return;
        if (data.event === "CANCEL") {
          cancelled.current = true;
        } else if (data.event === "FINISH" || data.event === "FINISH_ONLY_WABA") {
          sessionInfo.current = {
            waba_id: data.data?.waba_id,
            phone_number_id: data.data?.phone_number_id,
          };
        }
      } catch {
        /* non-JSON message from the Facebook frame */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { signup_id } = await api<{ signup_id: string }>("/api/v1/onboarding/start", {
        method: "POST",
        body: JSON.stringify({ ...form, language: form.language.toLowerCase() }),
      });
      setSignupId(signup_id);
      store(STORAGE_KEY, signup_id);
      setStep("connect");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your details.");
    } finally {
      setBusy(false);
    }
  };

  const complete = useCallback(
    async (code: string) => {
      // The IDs arrive via postMessage, usually just before the login callback. Give them a moment.
      for (let i = 0; i < 12 && !sessionInfo.current.phone_number_id; i++) {
        await new Promise((r) => setTimeout(r, 250));
      }
      try {
        const res = await api<{ status: string; clinic_name: string; display_phone_number: string }>(
          "/api/v1/onboarding/complete",
          {
            method: "POST",
            body: JSON.stringify({ signup_id: signupId, code, ...sessionInfo.current }),
          }
        );
        setResult(res);
        setStep("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "We could not finish connecting WhatsApp.");
      } finally {
        setBusy(false);
      }
    },
    [signupId]
  );

  const launch = () => {
    if (!window.FB || !signupId) return;
    setError(null);
    setBusy(true);
    cancelled.current = false;
    sessionInfo.current = {};

    window.FB.login(
      (response) => {
        const code = response.authResponse?.code;
        if (!code) {
          setBusy(false);
          setError(
            cancelled.current || response.status === "unknown"
              ? "The WhatsApp connection was cancelled. You can try again whenever you're ready."
              : "We didn't receive permission from Facebook. Please try again."
          );
          return;
        }
        void complete(code);
      },
      {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          // Multi-Partner Solution: attaches the partner's (AiSensy) billing to the new WhatsApp account
          setup: SOLUTION_ID ? { solutionID: SOLUTION_ID } : {},
          featureType: "",
          sessionInfoVersion: "3",
        },
      }
    );
  };

  return (
    <>
      <Script src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" crossOrigin="anonymous" />

      <div className="mx-auto w-full max-w-6xl">
        <a href="/" className="mb-4 inline-block lg:mb-8" aria-label="ParroConnect home">
          <Logo size="sm" noTag />
        </a>

        <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <VisualPanel step={step} />

        <div className="mx-auto w-full max-w-xl rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-8 lg:max-w-none">
          <Stepper step={step} />

          {step === "details" && (
            <form onSubmit={submitDetails} className="space-y-4">
              <div>
                <h1 className="font-display text-2xl font-bold text-[var(--navy)]">Start your free trial</h1>
                <p className="mt-1 text-sm text-[var(--slate)]">
                  30 days free. No credit card needed. Takes about 3 minutes.
                </p>
              </div>

              <label className="block text-sm font-medium text-[var(--navy)]">
                Doctor name
                <input required minLength={2} className={inputCls} value={form.doctor_name} autoComplete="name"
                  onChange={(e) => setForm({ ...form, doctor_name: e.target.value })} placeholder="Dr. Priya Kumar" />
              </label>
              <label className="block text-sm font-medium text-[var(--navy)]">
                Clinic name
                <input required minLength={2} className={inputCls} value={form.clinic_name} autoComplete="organization"
                  onChange={(e) => setForm({ ...form, clinic_name: e.target.value })} placeholder="Sunrise Family Clinic" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[var(--navy)]">
                  Email
                  <input required type="email" className={inputCls} value={form.email} autoComplete="email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@clinic.com" />
                </label>
                <label className="block text-sm font-medium text-[var(--navy)]">
                  Your mobile
                  <input required type="tel" inputMode="tel" minLength={8} className={inputCls} value={form.mobile} autoComplete="tel"
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="98765 43210" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-[var(--navy)]">
                  City <span className="font-normal text-[var(--slate)]">(optional)</span>
                  <input className={inputCls} value={form.city} autoComplete="address-level2"
                    onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Chennai" />
                </label>
                <label className="block text-sm font-medium text-[var(--navy)]">
                  Patients mostly speak
                  <select className={inputCls} value={form.language}
                    onChange={(e) => setForm({ ...form, language: e.target.value })}>
                    {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </label>
              </div>

              {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--coral)]">{error}</p>}

              <button type="submit" disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--teal)] px-4 py-3.5 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60">
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Continue
              </button>
              <p className="text-center text-xs text-[var(--slate)]">
                By continuing you agree to our <a className="underline" href="/legal/terms">Terms</a> and{" "}
                <a className="underline" href="/legal/privacy">Privacy Policy</a>.
              </p>
            </form>
          )}

          {step === "connect" && (
            <div className="space-y-5">
              <div>
                <h1 className="font-display text-2xl font-bold text-[var(--navy)]">Connect your WhatsApp</h1>
                <p className="mt-1 text-sm text-[var(--slate)]">
                  Your patients will message the number you connect here. You stay in control of your account.
                </p>
              </div>

              <ul className="space-y-3 rounded-xl bg-[var(--mist)] p-4 text-sm text-[var(--slate)]">
                <li className="flex gap-2"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" />
                  Have your clinic phone number ready — you&apos;ll get a verification code by SMS or call.</li>
                <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" />
                  A Facebook window opens. Log in with the Facebook account that manages your clinic and follow the steps.</li>
                <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--teal)]" />
                  We never see your Facebook password.</li>
              </ul>

              {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--coral)]">{error}</p>}

              <button type="button" onClick={launch} disabled={!sdkReady || busy || !APP_ID || !CONFIG_ID}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--wa-green)] px-4 py-3.5 text-base font-semibold text-[#062812] transition hover:bg-[#1ebe57] disabled:cursor-not-allowed disabled:opacity-60">
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Connecting…</> : sdkReady ? "Connect WhatsApp" : "Loading…"}
              </button>
              <button type="button" onClick={() => { store(STORAGE_KEY, ""); setStep("details"); setError(null); }}
                className="w-full text-center text-sm text-[var(--slate)] underline">
                Edit clinic details
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="space-y-5 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--teal)]" />
              <h1 className="font-display text-2xl font-bold text-[var(--navy)]">
                {result.status === "approved" ? "You're live!" : "WhatsApp connected"}
              </h1>
              <p className="text-sm leading-relaxed text-[var(--slate)]">
                {result.clinic_name && <><strong>{result.clinic_name}</strong>{result.display_phone_number && <> ({result.display_phone_number})</>} is connected. </>}
                {result.status === "approved"
                  ? "Your free trial is active."
                  : "Our team is setting up your clinic — we usually finish within one working day. We'll contact you with your dashboard login as soon as you're approved. Your 30-day free trial starts then."}
              </p>
              <a href="/" className="inline-block rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--navy)]">
                Back to home
              </a>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
}
