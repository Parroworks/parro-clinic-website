import { NextRequest, NextResponse } from "next/server";

/**
 * Exchange a Meta Embedded Signup authorization code for an access token.
 * GET https://graph.facebook.com/{version}/oauth/access_token
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = body?.code;

    console.log("\n========== [1/4] Received /api/exchange-token ==========");
    console.log("[exchange-token] Timestamp:", new Date().toISOString());
    console.log(
      "[exchange-token] Authorization code (preview):",
      code ? `${String(code).slice(0, 12)}… (${String(code).length} chars)` : "(missing)"
    );

    if (!code || typeof code !== "string") {
      console.error("[exchange-token] Abort: missing `code`");
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }

    const appId = process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const graphVersion = process.env.META_GRAPH_VERSION || "v20.0";

    if (!appId || !appSecret) {
      console.error(
        "[exchange-token] Abort: META_APP_ID / META_APP_SECRET not configured"
      );
      return NextResponse.json(
        {
          error:
            "Server misconfigured: set META_APP_ID and META_APP_SECRET in environment",
        },
        { status: 500 }
      );
    }

    const tokenUrl = new URL(
      `https://graph.facebook.com/${graphVersion}/oauth/access_token`
    );
    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("code", code);

    console.log("========== [2/4] Calling Meta Graph token exchange ==========");
    console.log(
      "[exchange-token] Endpoint:",
      `https://graph.facebook.com/${graphVersion}/oauth/access_token`
    );
    console.log("[exchange-token] client_id:", appId);

    const graphRes = await fetch(tokenUrl.toString(), { method: "GET" });
    const data = await graphRes.json();

    console.log("========== [3/4] Meta Graph response ==========");
    console.log("[exchange-token] HTTP status:", graphRes.status);

    if (!graphRes.ok || data.error) {
      console.error(
        "[exchange-token] Token exchange FAILED:",
        JSON.stringify(data, null, 2)
      );
      console.log("========== [4/4] Returning error to client ==========\n");
      return NextResponse.json(
        { error: "Meta token exchange failed", details: data },
        { status: graphRes.status || 502 }
      );
    }

    const accessToken = data.access_token as string | undefined;
    const preview = accessToken
      ? `${accessToken.slice(0, 10)}…${accessToken.slice(-6)}`
      : null;

    console.log("[exchange-token] Token exchange SUCCESS");
    console.log("[exchange-token] token_type:", data.token_type);
    console.log("[exchange-token] expires_in:", data.expires_in);
    console.log("[exchange-token] access_token preview:", preview);
    console.log("========== [4/4] Returning success to client ==========\n");

    return NextResponse.json({
      ok: true,
      token_type: data.token_type,
      expires_in: data.expires_in,
      access_token_preview: preview,
    });
  } catch (err) {
    console.error("[exchange-token] Unexpected error:", err);
    return NextResponse.json(
      {
        error: "Unexpected server error during token exchange",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
