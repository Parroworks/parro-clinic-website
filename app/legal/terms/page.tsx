import { LegalPage, Section, BulletList, WarningBox } from "../LegalPage";

export const metadata = { title: "Terms of Service — ParroConnect" };

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      subtitle="The rules and conditions governing use of the PRA platform."
      lastUpdated="18 June 2026"
    >
      <Section number="1" title="Acceptance of Terms">
        <p>
          By accessing or using ParroConnect, you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, do not use the platform.
        </p>
        <p>
          These terms constitute a binding legal agreement between you (the clinic, doctor, or staff member) and ParroConnect
        </p>
      </Section>

      <Section number="2" title="Who May Use PRA">
        <p>PRA is a B2B platform intended for use by:</p>
        <BulletList items={[
          "Licensed medical practitioners registered with the Medical Council of India or equivalent state councils",
          "Clinic administrators and reception staff authorised by a licensed practitioner",
          "Healthcare institutions with valid registration under applicable Indian law",
        ]} />
        <WarningBox>
          ⚠️ PRA is not intended for direct consumer (patient) sign-up. Patients interact only via WhatsApp through their clinic's registered number.
        </WarningBox>
      </Section>

      <Section number="3" title="Permitted Use">
        <p>You may use PRA solely for lawful clinical management purposes, including:</p>
        <BulletList items={[
          "Managing patient appointments and queues",
          "Sending WhatsApp-based reminders and health communications",
          "Recording prescriptions and clinical notes",
          "Responding to patient queries via the dashboard",
        ]} />
      </Section>

      <Section number="4" title="Prohibited Use">
        <p>You must not:</p>
        <BulletList items={[
          "Use PRA to store or process data for purposes unrelated to patient care",
          "Share login credentials with unauthorised individuals",
          "Attempt to reverse-engineer, scrape, or replicate the platform",
          "Send unsolicited commercial messages (spam) through the WhatsApp integration",
          "Use PRA to misrepresent your qualifications or offer unregistered medical services",
        ]} />
      </Section>

      <Section number="5" title="Subscription & Payment">
        <p>
          PRA is offered on monthly and annual subscription plans. Prices are as listed on our Pricing page and are inclusive of GST unless stated otherwise.
        </p>
        <BulletList items={[
          "Subscriptions auto-renew unless cancelled at least 7 days before the renewal date",
          "Refunds are available within 7 days of initial purchase if the platform has not been used",
          "We reserve the right to change pricing with 30 days advance written notice",
        ]} />
      </Section>

      <Section number="6" title="Data Ownership">
        <p>
          You retain full ownership of all patient data entered into PRA. By using the platform, you grant PRA a limited licence to process this data solely to provide the service. We do not claim ownership of any patient records.
        </p>
      </Section>

      <Section number="7" title="Availability & Uptime">
        <p>
          We target 99.5% monthly uptime. Planned maintenance will be communicated at least 24 hours in advance. We are not liable for service interruptions caused by WhatsApp/Meta platform outages, internet connectivity issues, or force majeure events.
        </p>
      </Section>

      <Section number="8" title="Termination">
        <p>
          Either party may terminate the subscription at any time. Upon termination, your access is revoked immediately. Your data remains available for export for 30 days post-termination and is permanently deleted within 12 months.
        </p>
      </Section>

      <Section number="9" title="Limitation of Liability">
        <p>
          PRA is a clinic management tool and does not constitute medical advice. We are not liable for clinical decisions made using the platform. Our total liability to you in any 12-month period shall not exceed the subscription fees paid during that period.
        </p>
      </Section>

      <Section number="10" title="Governing Law">
        <p>
          These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Chennai, Tamil Nadu.
        </p>
        <p>For queries: <strong>support@parroconnect.com</strong></p>
      </Section>
    </LegalPage>
  );
}
