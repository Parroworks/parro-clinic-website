import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, phone, location, message, formType } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subject = formType === "demo"
      ? `📅 Book a Demo Request — ${name}`
      : `🚀 Start Free Trial Request — ${name}`;

    const { error } = await resend.emails.send({
      from: "ParroConnect <onboarding@resend.dev>",
      to: "support@parroconnect.com",
      replyTo: email,
      subject,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
          <div style="background: linear-gradient(135deg, #0F172A 0%, #0D9488 100%); border-radius: 10px; padding: 24px; margin-bottom: 24px;">
            <h1 style="color: white; font-size: 20px; margin: 0 0 4px 0;">${subject}</h1>
            <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0;">Submitted via pra-website-wine.vercel.app</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 16px; background: white; border-bottom: 1px solid #E2E8F0; border-radius: 8px 8px 0 0;">
                <p style="color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Name</p>
                <p style="color: #0F172A; font-size: 15px; font-weight: 600; margin: 0;">${name}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: white; border-bottom: 1px solid #E2E8F0;">
                <p style="color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Email</p>
                <p style="color: #0D9488; font-size: 15px; margin: 0;"><a href="mailto:${email}" style="color: #0D9488; text-decoration: none;">${email}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: white; border-bottom: 1px solid #E2E8F0;">
                <p style="color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Phone</p>
                <p style="color: #0F172A; font-size: 15px; margin: 0;">${phone || "—"}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: white; border-bottom: 1px solid #E2E8F0;">
                <p style="color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 2px 0;">Location / City</p>
                <p style="color: #0F172A; font-size: 15px; margin: 0;">${location || "—"}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; background: white; border-radius: 0 0 8px 8px;">
                <p style="color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Message</p>
                <p style="color: #0F172A; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #F0FDF9; border: 1px solid #99F6E4; border-radius: 8px;">
            <p style="color: #0F766E; font-size: 13px; margin: 0;">
              💡 Reply directly to this email to reach ${name} at <strong>${email}</strong>
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
