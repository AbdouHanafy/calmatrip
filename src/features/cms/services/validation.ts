import { sanitizeHtml } from "@/lib/sanitize";
import type { FieldDefinitionInput, SafeCondition } from "../types";

const isEmpty = (value: unknown) =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

export function evaluateCondition(rule: SafeCondition, data: Record<string, unknown>): boolean {
  const actual = data[rule.field];
  let matches = false;
  if (rule.operator === "IS_EMPTY") matches = isEmpty(actual);
  if (rule.operator === "IS_NOT_EMPTY") matches = !isEmpty(actual);
  if (rule.operator === "EQUALS") matches = actual === rule.value;
  if (rule.operator === "NOT_EQUALS") matches = actual !== rule.value;
  if (rule.operator === "IN")
    matches = Array.isArray(rule.value) && rule.value.includes(actual as never);
  if (rule.operator === "NOT_IN")
    matches = Array.isArray(rule.value) && !rule.value.includes(actual as never);
  return rule.action === "HIDE" ? !matches : matches;
}

function safeUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function validDate(value: unknown, withTime = false): boolean {
  if (typeof value !== "string") return false;
  const shape = withTime ? /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/ : /^\d{4}-\d{2}-\d{2}$/;
  return shape.test(value) && !Number.isNaN(Date.parse(value));
}

export type ValidationResult =
  | { success: true; data: Record<string, unknown> }
  | { success: false; errors: Record<string, string> };

export function validateDynamicData(
  fields: FieldDefinitionInput[],
  input: Record<string, unknown>,
): ValidationResult {
  const allowed = new Set(fields.map((field) => field.key));
  const output: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = input[field.key] ?? field.defaultValue;
    if (field.required && isEmpty(value)) {
      errors[field.key] = "Required";
      continue;
    }
    if (isEmpty(value)) continue;
    if (field.type === "NUMBER" && typeof value !== "number")
      errors[field.key] = "Must be a number";
    if (
      [
        "EMAIL",
        "URL",
        "PHONE",
        "TEXT",
        "TEXTAREA",
        "RICH_TEXT",
        "SLUG",
        "COLOR",
        "DATE",
        "DATETIME",
        "IMAGE",
        "FILE",
        "RELATION",
        "SELECT",
        "RADIO",
        "TIME",
        "HIDDEN",
      ].includes(field.type) &&
      typeof value !== "string"
    )
      errors[field.key] = "Must be text";
    if (
      field.type === "EMAIL" &&
      typeof value === "string" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    )
      errors[field.key] = "Invalid email";
    if (field.type === "URL" && !safeUrl(value)) errors[field.key] = "Invalid URL";
    if (
      field.type === "SLUG" &&
      typeof value === "string" &&
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
    )
      errors[field.key] = "Invalid slug";
    if (field.type === "COLOR" && typeof value === "string" && !/^#[0-9a-f]{6}$/i.test(value))
      errors[field.key] = "Use a 6-digit hex color";
    if (field.type === "DATE" && !validDate(value)) errors[field.key] = "Invalid date";
    if (field.type === "DATETIME" && !validDate(value, true))
      errors[field.key] = "Invalid date and time";
    if (["MULTI_SELECT", "GALLERY", "MULTI_RELATION"].includes(field.type) && !Array.isArray(value))
      errors[field.key] = "Must be a list";
    if (["BOOLEAN", "CHECKBOX"].includes(field.type) && typeof value !== "boolean")
      errors[field.key] = "Must be true or false";
    const optionValues = new Set((field.options ?? []).map((option) => option.value));
    if (
      ["SELECT", "RADIO"].includes(field.type) &&
      typeof value === "string" &&
      !optionValues.has(value)
    )
      errors[field.key] = "Invalid option";
    if (
      field.type === "MULTI_SELECT" &&
      Array.isArray(value) &&
      !value.every((item) => typeof item === "string" && optionValues.has(item))
    )
      errors[field.key] = "Contains an invalid option";
    if (field.validation?.pattern && typeof value === "string") {
      try {
        if (!new RegExp(field.validation.pattern).test(value)) errors[field.key] = "Invalid format";
      } catch {
        errors[field.key] = "Invalid validation pattern";
      }
    }
    const size =
      typeof value === "string" || Array.isArray(value)
        ? value.length
        : typeof value === "number"
          ? value
          : undefined;
    if (size !== undefined && field.validation?.min !== undefined && size < field.validation.min)
      errors[field.key] = `Minimum is ${field.validation.min}`;
    if (size !== undefined && field.validation?.max !== undefined && size > field.validation.max)
      errors[field.key] = `Maximum is ${field.validation.max}`;
    if (!errors[field.key])
      output[field.key] = field.type === "RICH_TEXT" ? sanitizeHtml(value as string) : value;
  }
  for (const unknownKey of Object.keys(input))
    if (!allowed.has(unknownKey)) errors[unknownKey] = "Unknown field";
  return Object.keys(errors).length ? { success: false, errors } : { success: true, data: output };
}
