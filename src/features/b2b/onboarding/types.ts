import type { PartnerType, SocialPlatform } from "@/lib/partners/constants";

export interface SocialProfileValue {
  platform: SocialPlatform;
  url: string;
}

export interface PartnerProfileDTO {
  id: string;
  userId: string;
  partnerType: PartnerType;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
  currentStep: number;
  organizationName: string | null;
  contactFirstName: string | null;
  contactLastName: string | null;
  phone: string | null;
  countryCode: string | null;
  city: string | null;
  currency: string | null;
  website: string | null;
  rejectionReason: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  interests: { category: string }[];
  socialProfiles: SocialProfileValue[];
}

export interface OnboardingFormState {
  partnerType: PartnerType | null;
  organizationName: string;
  contactFirstName: string;
  contactLastName: string;
  phone: string;
  countryCode: string;
  city: string;
  cityOther: string;
  currency: string;
  website: string;
  interests: string[];
  socialProfiles: SocialProfileValue[];
}

export const EMPTY_FORM_STATE: OnboardingFormState = {
  partnerType: null,
  organizationName: "",
  contactFirstName: "",
  contactLastName: "",
  phone: "",
  countryCode: "",
  city: "",
  cityOther: "",
  currency: "",
  website: "",
  interests: [],
  socialProfiles: [],
};
