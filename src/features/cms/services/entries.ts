import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { FieldDefinitionInput } from "@/features/cms/types";

export type StoredFieldDefinition = {
  id?: string;
  key: string;
  label: string;
  type: string;
  required: boolean;
  unique?: boolean;
  defaultValue: unknown;
  validation: unknown;
  options: unknown;
  relation?: unknown;
};

export function toFieldInputs(fields: StoredFieldDefinition[]): FieldDefinitionInput[] {
  return fields.map((field) => ({
    id: field.id,
    key: field.key,
    label: field.label,
    type: field.type as FieldDefinitionInput["type"],
    required: field.required,
    unique: field.unique ?? false,
    defaultValue: field.defaultValue ?? undefined,
    validation: field.validation as FieldDefinitionInput["validation"],
    options: field.options as FieldDefinitionInput["options"],
    relation: field.relation as FieldDefinitionInput["relation"],
  }));
}

export async function validateUniqueValues(
  contentTypeId: string,
  fields: FieldDefinitionInput[],
  data: Record<string, unknown>,
  excludeId?: string,
) {
  const errors: Record<string, string> = {};
  for (const field of fields.filter(
    (item) =>
      item.unique &&
      data[item.key] !== undefined &&
      data[item.key] !== null &&
      data[item.key] !== "",
  )) {
    const duplicate = await prisma.contentEntry.findFirst({
      where: {
        contentTypeId,
        ...(excludeId ? { id: { not: excludeId } } : {}),
        data: { path: `$.${field.key}`, equals: data[field.key] as Prisma.InputJsonValue },
      },
      select: { id: true },
    });
    if (duplicate) errors[field.key] = "Must be unique";
  }
  return errors;
}

export async function validateRelations(
  fields: FieldDefinitionInput[],
  data: Record<string, unknown>,
) {
  const errors: Record<string, string> = {};
  for (const field of fields.filter(
    (item) =>
      item.relation &&
      data[item.key] !== undefined &&
      data[item.key] !== null &&
      data[item.key] !== "",
  )) {
    const target = await prisma.contentType.findUnique({
      where: { slug: field.relation!.contentType },
      select: { id: true, active: true },
    });
    if (!target?.active) {
      errors[field.key] = "Relation target is unavailable";
      continue;
    }
    const values = Array.isArray(data[field.key])
      ? (data[field.key] as unknown[])
      : [data[field.key]];
    if (!values.every((value) => typeof value === "string")) {
      errors[field.key] = "Relations must contain entry IDs";
      continue;
    }
    const count = await prisma.contentEntry.count({
      where: { contentTypeId: target.id, id: { in: values as string[] } },
    });
    if (count !== values.length) errors[field.key] = "One or more related entries do not exist";
  }
  return errors;
}
