// Static ISO reference data for the B2B partner onboarding wizard.
// No network access to install a country/currency package in this
// environment, and none was already a dependency — this module keeps that
// data out of components per the onboarding spec, structured and typed
// rather than a magic array inline in a form.

export interface Country {
  name: string;
  /** ISO 3166-1 alpha-2 */
  code: string;
  /** International dialing prefix, e.g. "+216" */
  callingCode: string;
}

// A practical, real subset: Tunisia (the platform's home market) first,
// then the countries CalmaTrip's traveler/partner base most plausibly comes
// from (Maghreb, Western Europe, North America, Gulf). Not a full ISO-3166
// list of ~250 countries — extending this to full global coverage is a
// scope call for the business, not something to silently expand.
export const COUNTRIES: Country[] = [
  { name: "Tunisia", code: "TN", callingCode: "+216" },
  { name: "Algeria", code: "DZ", callingCode: "+213" },
  { name: "Morocco", code: "MA", callingCode: "+212" },
  { name: "Libya", code: "LY", callingCode: "+218" },
  { name: "Egypt", code: "EG", callingCode: "+20" },
  { name: "France", code: "FR", callingCode: "+33" },
  { name: "Belgium", code: "BE", callingCode: "+32" },
  { name: "Switzerland", code: "CH", callingCode: "+41" },
  { name: "Germany", code: "DE", callingCode: "+49" },
  { name: "Italy", code: "IT", callingCode: "+39" },
  { name: "Spain", code: "ES", callingCode: "+34" },
  { name: "United Kingdom", code: "GB", callingCode: "+44" },
  { name: "Ireland", code: "IE", callingCode: "+353" },
  { name: "Netherlands", code: "NL", callingCode: "+31" },
  { name: "Luxembourg", code: "LU", callingCode: "+352" },
  { name: "Portugal", code: "PT", callingCode: "+351" },
  { name: "Canada", code: "CA", callingCode: "+1" },
  { name: "United States", code: "US", callingCode: "+1" },
  { name: "United Arab Emirates", code: "AE", callingCode: "+971" },
  { name: "Saudi Arabia", code: "SA", callingCode: "+966" },
  { name: "Qatar", code: "QA", callingCode: "+974" },
  { name: "Turkey", code: "TR", callingCode: "+90" },
];

export const COUNTRY_CODES = COUNTRIES.map((c) => c.code);

export function findCountry(code: string | null | undefined): Country | undefined {
  if (!code) return undefined;
  return COUNTRIES.find((c) => c.code === code);
}

export interface Currency {
  code: string; // ISO 4217
  symbol: string;
}

// ISO 4217 codes actually relevant to this platform's transactions and
// partner base — not the full ~180-code ISO list.
export const CURRENCIES: Currency[] = [
  { code: "TND", symbol: "DT" },
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "CHF", symbol: "CHF" },
  { code: "CAD", symbol: "$" },
  { code: "AED", symbol: "AED" },
  { code: "SAR", symbol: "SAR" },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

// Real cities already used for Tunisia elsewhere in the app
// (src/lib/explore/places.ts STATIC_CITIES), reused rather than duplicated.
export const TUNISIA_CITIES = [
  "Tunis",
  "Kairouan",
  "Douz",
  "Tozeur",
  "Carthage",
  "Sidi Bou Said",
  "Hammamet",
  "Sousse",
  "Djerba",
  "Nabeul",
  "Monastir",
  "Bizerte",
];

/** Sentinel value the UI uses to reveal a free-text "Other city" field. */
export const OTHER_CITY_VALUE = "__other__";

export function citiesForCountry(countryCode: string | null | undefined): string[] {
  return countryCode === "TN" ? TUNISIA_CITIES : [];
}
