import { LegalPage, Section, BulletList, Highlight, WarningBox } from "../LegalPage";

export const metadata = { title: "DPDP Compliance Policy — ParroConnect" };

export default function DPDPPolicy() {
  return (
    <LegalPage
      title="DPDP Compliance Policy"
      badge="India's Digital Personal Data Protection Act, 2023"
      subtitle="How PRA complies with India's Digital Personal Data Protection (DPDP) Act, 2023 — and how we help your clinic stay compliant."
      lastUpdated="18 June 2026"
    >
      <Section title="What is DPDP Compliance?">
        <p>
          DPDP compliance refers to the legal requirement for organisations to adhere to India's Digital Personal Data Protection (DPDP) Act, 2023. It dictates how businesses must collect, store, and process the personal data of individuals — ensuring user privacy, robust data security, and heavy penalties for violations.
        </p>
        <p>
          Under this Act, PRA operates as a <strong>Data Fiduciary</strong> (we determine the purpose of processing) and as a <strong>Data Processor</strong> on behalf of clinics (who are themselves Data Fiduciaries for their patients).
        </p>
      </Section>

      <Section number="1" title="Consent & Notice">
        <p>
          Before collecting any personal data, we ensure:
        </p>
        <BulletList items={[
          "Patients receive a clear, itemised notice via WhatsApp explaining what data is being collected and why",
          "Consent is obtained freely, specifically, and unambiguously — patients must affirmatively respond to proceed",
          "No data is collected beyond what is necessary for the stated purpose (data minimisation)",
          "Withdrawal of consent is as easy as providing it — patients can text 'STOP' at any time",
        ]} />
        <Highlight>
          ✅ Every patient interaction begins with an explicit opt-in. Clinics using PRA do not need to separately build consent flows — PRA handles this at the WhatsApp layer.
        </Highlight>
      </Section>

      <Section number="2" title="User Rights Management">
        <p>
          Under the DPDP Act, every Data Principal (patient) has enforceable rights:
        </p>
        <BulletList items={[
          "Right to Access — patients can request a summary of all data PRA holds about them",
          "Right to Correction — inaccurate or incomplete data must be corrected promptly upon request",
          "Right to Erasure — if consent is withdrawn, data is deleted once the original purpose is fulfilled",
          "Right to Grievance — every complaint must receive a timely, documented response",
          "Right to Nominate — patients may nominate a representative to exercise their rights on their behalf",
        ]} />
        <p className="mt-2">
          To exercise any of these rights, patients or clinic administrators may contact: <strong>support@parroconnect.com</strong>
        </p>
      </Section>

      <Section number="3" title="Grievance Redressal">
        <p>
          PRA has appointed a <strong>Data Protection Officer (DPO)</strong> responsible for overseeing compliance and handling grievances.
        </p>
        <BulletList items={[
          "Complaints must be acknowledged within 48 hours",
          "Resolution must be provided within 30 days of receipt",
          "Unresolved complaints may be escalated to the Data Protection Board of India (DPBI)",
        ]} />
        <p className="mt-2">
          DPO Contact: <strong>support@parroconnect.com</strong>
        </p>
      </Section>

      <Section number="4" title="Data Security Safeguards">
        <p>
          PRA implements the following technical and organisational measures as legally mandated:
        </p>
        <BulletList items={[
          "AES-256 encryption for all patient data stored at rest",
          "TLS 1.3 encryption for all data in transit",
          "Role-based access controls — clinic staff see only the data relevant to their role",
          "Multi-factor authentication for all dashboard logins",
          "Regular third-party security audits and penetration testing",
          "Access logs retained for 12 months for audit purposes",
          "Vendor agreements with all sub-processors require equivalent security standards",
        ]} />
      </Section>

      <Section number="5" title="Breach Notification">
        <p>
          In the event of a personal data breach, PRA will:
        </p>
        <BulletList items={[
          "Contain and assess the breach within 24 hours of discovery",
          "Notify the Data Protection Board of India (DPBI) within 72 hours",
          "Notify affected patients and clinics without undue delay",
          "Provide a detailed incident report including nature of breach, data affected, and remediation steps",
        ]} />
        <WarningBox>
          ⚠️ Clinics using PRA are reminded that they remain independently responsible for notifying the DPBI if they independently discover a breach related to data they manage outside of PRA.
        </WarningBox>
      </Section>

      <Section number="6" title="Retention & Erasure">
        <p>
          Personal data is retained only as long as necessary for its original purpose:
        </p>
        <BulletList items={[
          "Active patient records: retained for the duration of the clinic subscription + 3 years (per MCI guidelines)",
          "Appointment logs: 3 years from date of appointment",
          "WhatsApp message logs: 12 months rolling window",
          "Deleted clinic data: anonymised within 90 days, permanently erased within 12 months of account closure",
        ]} />
        <Highlight>
          ✅ Automated erasure pipelines run monthly to delete expired data — no manual intervention required by clinic staff.
        </Highlight>
      </Section>

      <Section number="7" title="How PRA Helps Your Clinic Stay Compliant">
        <p>
          Clinics using PRA benefit from built-in DPDP compliance infrastructure:
        </p>
        <BulletList items={[
          "Consent collection and audit trail — automatically logged at the WhatsApp layer",
          "Patient data export tool — allows you to respond to access/portability requests in minutes",
          "One-click data deletion — trigger erasure for any patient from the dashboard",
          "Grievance log — track and respond to patient complaints within the PRA dashboard",
          "DPA (Data Processing Agreement) — available on request for enterprise subscribers",
        ]} />
      </Section>

      <Section number="8" title="Contact the Data Protection Officer">
        <p><strong>DPO:</strong> Data Protection Officer, ParroConnect</p>
        <p><strong>Email:</strong> support@parroconnect.com</p>
        <p><strong>Address:</strong> Chennai, Tamil Nadu, India — 600 001</p>
        <p><strong>Response SLA:</strong> 48 hours acknowledgement · 30 days resolution</p>
      </Section>
    </LegalPage>
  );
}
