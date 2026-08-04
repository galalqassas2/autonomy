export const leadFields = ["process", "tools", "contact"] as const;

export type LeadField = typeof leadFields[number];
export type LeadFields = Record<LeadField, string>;
export type LeadErrors = Partial<Record<LeadField, string>>;

export const emptyLeadFields: LeadFields = {
  process: "",
  tools: "",
  contact: "",
};

export function validateLeadField(name: LeadField, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "This field is required.";
  if (name === "contact" && !trimmed.includes("@") && trimmed.replace(/\D/g, "").length < 7) {
    return "Enter an email address or phone number we can use.";
  }
  return "";
}

export function validateLeadFields(fields: LeadFields) {
  return Object.fromEntries(
    leadFields
      .map((name) => [name, validateLeadField(name, fields[name])] as const)
      .filter(([, error]) => Boolean(error)),
  ) as LeadErrors;
}

export function parseLeadFields(input: unknown) {
  const source = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const fields = Object.fromEntries(
    leadFields.map((name) => [name, typeof source[name] === "string" ? source[name].trim() : ""]),
  ) as LeadFields;
  const errors = validateLeadFields(fields);

  return Object.keys(errors).length > 0
    ? { success: false as const, errors }
    : { success: true as const, fields };
}
