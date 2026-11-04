// The business types ParroConnect serves. Each has its own backend (its own API and database); the website talks to the
// one the visitor picks. Add a vertical here and set its NEXT_PUBLIC_<NAME>_API_URL.
export type VerticalKey = "clinic" | "salon";

export type Vertical = {
  key: VerticalKey;
  label: string;            // "Clinic"
  chooserHint: string;
  apiUrl: string;           // backend base URL, no trailing slash
  noun: string;             // "clinic"
  people: string;           // what its customers are called: "patients"
  ownerLabel: string;
  ownerPlaceholder: string;
  businessLabel: string;
  businessPlaceholder: string;
  emailPlaceholder: string;
  languageLabel: string;
  panel: { title: string; text: string };
};

const clean = (url: string | undefined) => (url ?? "").replace(/\/$/, "");

export const VERTICALS: Record<VerticalKey, Vertical> = {
  clinic: {
    key: "clinic",
    label: "Clinic",
    chooserHint: "Doctors and clinics: appointments, tokens, reminders and follow-ups",
    apiUrl: clean(process.env.NEXT_PUBLIC_API_URL),
    noun: "clinic",
    people: "patients",
    ownerLabel: "Doctor name",
    ownerPlaceholder: "Dr. Priya Kumar",
    businessLabel: "Clinic name",
    businessPlaceholder: "Sunrise Family Clinic",
    emailPlaceholder: "you@clinic.com",
    languageLabel: "Patients mostly speak",
    panel: {
      title: "Run your clinic on WhatsApp",
      text: "Appointments, reminders and follow-ups handled automatically — right where your patients already chat.",
    },
  },
  salon: {
    key: "salon",
    label: "Salon",
    chooserHint: "Salons and barber shops: bookings, stylists, packages and reminders",
    apiUrl: clean(process.env.NEXT_PUBLIC_SALON_API_URL),
    noun: "salon",
    people: "customers",
    ownerLabel: "Owner name",
    ownerPlaceholder: "Ravi Kumar",
    businessLabel: "Salon or barber shop name",
    businessPlaceholder: "Sunrise Salon",
    emailPlaceholder: "you@salon.com",
    languageLabel: "Customers mostly speak",
    panel: {
      title: "Fill your chairs through WhatsApp",
      text: "Bookings, stylist choice and reminders handled automatically — right where your customers already chat.",
    },
  },
};

export const VERTICAL_KEYS = Object.keys(VERTICALS) as VerticalKey[];

export function isVertical(value: string | null | undefined): value is VerticalKey {
  return !!value && value in VERTICALS;
}
