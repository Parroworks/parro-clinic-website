"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    FB?: {
      init: (opts: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FbLoginResponse) => void,
        options: Record<string, unknown>
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

type FbLoginResponse = {
  authResponse?: {
    code?: string;
    accessToken?: string;
    userID?: string;
  };
  error?: unknown;
  status?: string;
};

type StatusState = "idle" | "pending" | "success" | "error";

const APP_ID = process.env.NEXT_PUBLIC_META_APP_ID ?? "1705378857162596";
const CONFIG_ID = process.env.NEXT_PUBLIC_META_CONFIG_ID ?? "1373523708243211";
const GRAPH_VERSION = process.env.NEXT_PUBLIC_META_GRAPH_VERSION ?? "v20.0";

function redactAuthResponse(response: FbLoginResponse) {
  const auth = response.authResponse;
  if (!auth) return response;
  return {
    ...response,
    authResponse: {
      ...auth,
      accessToken: auth.accessToken ? "[redacted — unexpected token response]" : undefined,
      code: auth.code ? `${auth.code.slice(0, 12)}…` : undefined,
      userID: auth.userID,
    },
  };
}

export default function EmbeddedSignup() {
  const [sdkReady, setSdkReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<unknown>(null);
  const [status, setStatus] = useState<{ state: StatusState; message: string }>({
    state: "idle",
    message: "Status: waiting for Facebook SDK…",
  });

  // Must be defined before the SDK script finishes loading.
  useEffect(() => {
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: APP_ID,
        cookie: true,
        xfbml: false,
        version: GRAPH_VERSION,
      });
      setSdkReady(true);
      setStatus({
        state: "idle",
        message: "Status: SDK ready — click Launch Embedded Signup",
      });
      console.log("[whatsapp-signup] FB SDK initialized", {
        appId: APP_ID,
        version: GRAPH_VERSION,
        configId: CONFIG_ID,
      });
    };

    if (window.FB) {
      window.fbAsyncInit();
    }
  }, []);

  // Capture WABA / phone IDs from Embedded Signup postMessage events.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      ) {
        return;
      }

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.type !== "WA_EMBEDDED_SIGNUP") return;

        console.log("[whatsapp-signup] Embedded Signup session event", data);
        setSessionInfo(data);

        if (data.event === "FINISH" || data.event === "FINISH_ONLY_WABA") {
          setStatus((prev) => ({
            state: prev.state === "success" ? "success" : "pending",
            message:
              (prev.state === "success" ? prev.message + "\n\n" : "") +
              "Embedded Signup session:\n" +
              JSON.stringify(data, null, 2),
          }));
        }
      } catch {
        // Ignore non-JSON messages from the Facebook frame.
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const exchangeCode = (code: string) => {
    setStatus({
      state: "pending",
      message: "Status: code received — exchanging with backend…",
    });

    fetch("/api/exchange-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({
          error: "Invalid JSON from server",
        }));
        if (!res.ok) {
          throw Object.assign(new Error(data.error || "Token exchange failed"), {
            details: data,
          });
        }
        return data;
      })
      .then((data) => {
        setBusy(false);
        setStatus({
          state: "success",
          message:
            "Status: success — token exchange completed\n" +
            JSON.stringify(
              {
                token_type: data.token_type,
                expires_in: data.expires_in,
                access_token_preview: data.access_token_preview,
                session_info: sessionInfo,
              },
              null,
              2
            ),
        });
        console.log("[whatsapp-signup] Token exchange success", data);
      })
      .catch((err: Error & { details?: unknown }) => {
        setBusy(false);
        setStatus({
          state: "error",
          message:
            "Status: exchange failed\n" +
            (err.message || String(err)) +
            (err.details ? "\n" + JSON.stringify(err.details, null, 2) : ""),
        });
        console.error("[whatsapp-signup] Token exchange error", err);
      });
  };

  const launch = () => {
    if (!window.FB) {
      setStatus({ state: "error", message: "Status: Facebook SDK not loaded" });
      return;
    }

    setBusy(true);
    setSessionInfo(null);
    setStatus({ state: "pending", message: "Status: opening Embedded Signup…" });
    console.log("[whatsapp-signup] Invoking FB.login with config_id", CONFIG_ID);

    window.FB.login(
      (response) => {
        console.log("[whatsapp-signup] FB.login response", redactAuthResponse(response));

        if (!response || response.error) {
          setBusy(false);
          setStatus({
            state: "error",
            message:
              "Status: login failed\n" +
              JSON.stringify(response?.error ?? response, null, 2),
          });
          return;
        }

        const code = response.authResponse?.code;
        if (!code) {
          setBusy(false);
          const gotToken = Boolean(response.authResponse?.accessToken);
          setStatus({
            state: "error",
            message:
              "Status: no authorization code returned\n" +
              (gotToken
                ? "Facebook returned a normal user accessToken instead of an Embedded Signup code.\n" +
                  "That usually means config_id was ignored (wrong Configuration ID) or the WhatsApp Embedded Signup flow did not run.\n" +
                  "Verify Configuration ID in Meta → WhatsApp → Embedded Signup, then try again.\n"
                : "") +
              JSON.stringify(redactAuthResponse(response), null, 2),
          });
          return;
        }

        exchangeCode(code);
      },
      {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: "",
          sessionInfoVersion: "3",
        },
      }
    );
  };

  const statusColor =
    status.state === "success"
      ? "text-[var(--teal-dark)] border-[var(--teal)]/30 bg-[var(--teal-light)]"
      : status.state === "error"
        ? "text-[var(--coral)] border-[var(--coral)]/30 bg-red-50"
        : status.state === "pending"
          ? "text-[var(--amber)] border-[var(--amber)]/30 bg-amber-50"
          : "text-[var(--slate)] border-[var(--border)] bg-white";

  return (
    <>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--teal)]">
          ParroConnect
        </p>
        <h1 className="font-display text-2xl font-bold text-[var(--navy)]">
          WhatsApp Embedded Signup
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--slate)]">
          Connect a WhatsApp Business account for PRA Clinic Demo.
        </p>

        <div className="mt-4 rounded-lg bg-[var(--mist)] px-3 py-2 font-mono-custom text-[11px] leading-relaxed text-[var(--slate)]">
          App ID: {APP_ID}
          <br />
          Config ID: {CONFIG_ID}
        </div>

        <button
          type="button"
          onClick={launch}
          disabled={!sdkReady || busy}
          className="mt-6 w-full rounded-xl bg-[var(--wa-green)] px-4 py-3.5 text-base font-semibold text-[#062812] transition hover:bg-[#1ebe57] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {!sdkReady
            ? "Waiting for Facebook SDK…"
            : busy
              ? "Working…"
              : "Launch Embedded Signup"}
        </button>

        <pre
          className={`mt-5 min-h-12 whitespace-pre-wrap break-words rounded-xl border px-3.5 py-3 text-sm leading-relaxed ${statusColor}`}
        >
          {status.message}
        </pre>
      </div>
    </>
  );
}
