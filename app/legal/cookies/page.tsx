import { LegalPage, Section, BulletList, Highlight } from "../LegalPage";

export const metadata = { title: "Cookie Policy — ParroConnect" };

export default function CookiePolicy() {
  return (
    <LegalPage
      title="Cookie Policy"
      subtitle="What cookies PRA uses, why, and how you can control them."
      lastUpdated="18 June 2026"
    >
      <Section number="1" title="What Are Cookies?">
        <p>
          Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site.
        </p>
        <p>
          This policy applies to the PRA marketing website (praclinic.in) and the PRA dashboard (app.praclinic.in). It does not apply to the WhatsApp channel, which operates outside the browser environment.
        </p>
      </Section>

      <Section number="2" title="Cookies We Use">
        <p><strong>Strictly Necessary Cookies</strong> — required for the platform to function:</p>
        <BulletList items={[
          "session_id — maintains your login session in the dashboard (expires on browser close)",
          "csrf_token — prevents cross-site request forgery attacks (session-scoped)",
          "consent_given — records that you have acknowledged our cookie notice (1 year)",
        ]} />

        <p className="mt-3"><strong>Functional Cookies</strong> — improve your experience:</p>
        <BulletList items={[
          "pra_clinic_id — remembers the last clinic you accessed so you don't re-select each time (30 days)",
          "ui_theme — stores your dashboard display preferences (1 year)",
          "pra_lang — remembers your language preference (1 year)",
        ]} />

        <p className="mt-3"><strong>Analytics Cookies</strong> — help us understand usage (anonymised):</p>
        <BulletList items={[
          "We use self-hosted Plausible Analytics which does not use cookies or collect personal data",
          "No third-party analytics trackers (no Google Analytics, no Meta Pixel)",
        ]} />

        <Highlight>
          ✅ We deliberately avoid advertising and tracking cookies. We do not share browsing behaviour with any ad networks.
        </Highlight>
      </Section>

      <Section number="3" title="Third-Party Cookies">
        <p>
          The PRA dashboard embeds the following third-party services which may set their own cookies:
        </p>
        <BulletList items={[
          "8x8.vc (online video consultations) — session cookies for video room management; governed by 8x8's own privacy policy",
          "Razorpay / Stripe (payment processing) — payment session cookies; governed by the respective provider's privacy policy",
        ]} />
        <p className="mt-2">
          We do not control these third-party cookies. Refer to their respective policies for details.
        </p>
      </Section>

      <Section number="4" title="How to Control Cookies">
        <p>You can control cookies in the following ways:</p>
        <BulletList items={[
          "Browser settings — all modern browsers allow you to block or delete cookies via Settings → Privacy",
          "Incognito / Private mode — prevents cookies being stored beyond the session",
          "Our cookie banner — when you first visit praclinic.in, you may accept or decline non-essential cookies",
        ]} />
        <p className="mt-2">
          Note: disabling strictly necessary cookies will prevent you from logging into the PRA dashboard.
        </p>
      </Section>

      <Section number="5" title="Updates to This Policy">
        <p>
          We may update this Cookie Policy from time to time. Changes will be reflected by updating the "Last updated" date at the top of this page. Continued use of the platform after changes constitutes acceptance of the updated policy.
        </p>
      </Section>

      <Section number="6" title="Contact">
        <p>For any questions about cookies or tracking:</p>
        <p><strong>Email:</strong> support@parroconnect.com</p>
        <p><strong>DPO:</strong> support@parroconnect.com</p>
      </Section>
    </LegalPage>
  );
}
