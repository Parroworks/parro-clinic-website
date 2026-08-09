import { LegalPage, Section, BulletList, Highlight } from "../LegalPage";

export const metadata = { title: "Privacy Policy — ParroConnect" };

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      subtitle="How PRA collects, uses, and protects your personal information."
      lastUpdated="18 June 2026"
    >
      <Section number="1" title="Who We Are">
        <p>
          ParroConnect is a clinic management platform operated by ParroConnect, registered in India. We provide WhatsApp-based appointment booking, queue management, and patient communication services to outpatient clinics across India.
        </p>
        <p>
          In the context of this policy, <strong>"Clinic"</strong> means the healthcare provider who subscribes to PRA, and <strong>"Patient"</strong> means any individual whose data is processed through our platform.
        </p>
      </Section>

      <Section number="2" title="Information We Collect">
        <p>We collect the following categories of personal data:</p>
        <p><strong>From Patients (via WhatsApp):</strong></p>
        <BulletList items={[
          "Name, age, and date of birth",
          "Mobile number (WhatsApp ID)",
          "Appointment details — date, time, doctor, reason for visit",
          "Basic health information shared voluntarily during consultation queries",
          "Follow-up responses and feedback",
        ]} />
        <p className="mt-2"><strong>From Clinic Staff / Doctors:</strong></p>
        <BulletList items={[
          "Name, designation, and mobile number",
          "Clinic name and address",
          "Prescription and clinical notes entered into the dashboard",
          "Login credentials (email + hashed password)",
        ]} />
      </Section>

      <Section number="3" title="How We Use Your Information">
        <p>We use collected data solely for the following purposes:</p>
        <BulletList items={[
          "Booking and confirming appointments via WhatsApp",
          "Managing live queue and notifying patients of their turn",
          "Sending post-visit follow-up reminders and health tips",
          "Enabling doctors to respond to patient queries through the dashboard",
          "Generating anonymised analytics for the clinic (not shared externally)",
          "Improving PRA's features and user experience",
        ]} />
        <Highlight>
          ✅ We do <strong>not</strong> sell, rent, or share your personal data with third-party advertisers.
        </Highlight>
      </Section>

      <Section number="4" title="Data Sharing">
        <p>We share data only in limited circumstances:</p>
        <BulletList items={[
          "With the clinic whose patient you are — doctors and reception staff can access your records within that clinic's account",
          "With trusted infrastructure providers (cloud hosting, SMS/WhatsApp API) under strict data processing agreements",
          "With law enforcement or regulators when legally required",
        ]} />
      </Section>

      <Section number="5" title="Data Retention">
        <p>
          We retain patient data for as long as the patient's clinic account remains active, or for a minimum of 3 years as required under applicable Indian health regulations.
        </p>
        <p>
          When a clinic terminates their PRA subscription, patient data is anonymised within 90 days and permanently deleted within 12 months unless legally required to retain it.
        </p>
      </Section>

      <Section number="6" title="Your Rights">
        <p>Under India's DPDP Act 2023, you have the right to:</p>
        <BulletList items={[
          "Access — request a copy of personal data we hold about you",
          "Correction — request correction of inaccurate data",
          "Erasure — request deletion of your data where consent has been withdrawn",
          "Grievance — raise a complaint with our Data Protection Officer",
        ]} />
        <p className="mt-2">
          To exercise these rights, contact us at: <strong>support@parroconnect.com</strong>
        </p>
      </Section>

      <Section number="7" title="Security">
        <p>
          We implement industry-standard security measures including AES-256 encryption at rest, TLS 1.3 in transit, role-based access controls, and regular security audits. In the event of a data breach, we will notify affected users and the Data Protection Board of India within 72 hours.
        </p>
      </Section>

      <Section number="8" title="Contact">
        <p>Data Protection Officer: <strong>DPO, ParroConnect</strong></p>
        <p>Email: <strong>support@parroconnect.com</strong></p>
        <p>Address: Chennai, Tamil Nadu, India</p>
      </Section>
    </LegalPage>
  );
}
