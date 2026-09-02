import type { FieldDefinitionInput } from "@/features/cms/types";
import { validateDynamicData } from "@/features/cms/services/validation";

type ExistingField = FieldDefinitionInput & { id: string };

export type EntryEvolutionResult =
  | { success: true; data: Record<string, unknown> }
  | { success: false; errors: Record<string, string> };

export function evolveEntryData(
  data: Record<string, unknown>,
  previousFields: ExistingField[],
  nextFields: FieldDefinitionInput[],
): EntryEvolutionResult {
  const evolved = { ...data };
  const previousById = new Map(previousFields.map((field) => [field.id, field]));

  for (const field of nextFields) {
    if (!field.id) continue;
    const previous = previousById.get(field.id);
    if (!previous || previous.key === field.key || !(previous.key in evolved)) continue;
    evolved[field.key] = evolved[previous.key];
    delete evolved[previous.key];
  }

  const nextKeys = new Set(nextFields.map((field) => field.key));
  const projected = Object.fromEntries(
    Object.entries(evolved).filter(([key]) => nextKeys.has(key)),
  );
  const validation = validateDynamicData(nextFields, projected);
  if (!validation.success) return validation;

  return { success: true, data: { ...evolved, ...validation.data } };
}
