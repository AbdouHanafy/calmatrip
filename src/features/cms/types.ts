export const CMS_LOCALES = ["fr", "en", "ar"] as const;
export type CmsLocale = (typeof CMS_LOCALES)[number];

export const CONTENT_STATUSES = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const FIELD_TYPES = [
  "TEXT",
  "TEXTAREA",
  "RICH_TEXT",
  "NUMBER",
  "BOOLEAN",
  "DATE",
  "DATETIME",
  "EMAIL",
  "PHONE",
  "URL",
  "SELECT",
  "MULTI_SELECT",
  "RADIO",
  "CHECKBOX",
  "IMAGE",
  "GALLERY",
  "FILE",
  "COLOR",
  "RELATION",
  "MULTI_RELATION",
  "JSON",
  "SLUG",
] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export const FORM_FIELD_TYPES = [
  "TEXT",
  "TEXTAREA",
  "EMAIL",
  "PHONE",
  "NUMBER",
  "DATE",
  "TIME",
  "SELECT",
  "MULTI_SELECT",
  "CHECKBOX",
  "RADIO",
  "FILE",
  "IMAGE",
  "URL",
  "HIDDEN",
  "COUNTRY",
  "CITY",
  "CURRENCY",
] as const;

export type LocalizedText = Partial<Record<CmsLocale, string>>;

export type SafeCondition = {
  field: string;
  operator: "EQUALS" | "NOT_EQUALS" | "IN" | "NOT_IN" | "IS_EMPTY" | "IS_NOT_EMPTY";
  value?: string | number | boolean | Array<string | number>;
  action?: "SHOW" | "HIDE";
};

export type FieldDefinitionInput = {
  id?: string;
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  unique?: boolean;
  localized?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  position?: number;
  placeholder?: LocalizedText;
  helpText?: LocalizedText;
  defaultValue?: unknown;
  validation?: { min?: number; max?: number; pattern?: string };
  options?: Array<{ label: LocalizedText; value: string }>;
  relation?: { contentType: string; multiple?: boolean };
  visibility?: { hidden?: boolean; readOnly?: boolean };
};
