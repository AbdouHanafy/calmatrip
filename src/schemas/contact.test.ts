import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact";

const validContact = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Question",
  message: "Hello, I have a question about my booking.",
};

describe("contactSchema", () => {
  it("accepts a valid contact payload", () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...validContact, email: "nope" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty message", () => {
    const result = contactSchema.safeParse({ ...validContact, message: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a message over 5000 characters", () => {
    const result = contactSchema.safeParse({ ...validContact, message: "a".repeat(5001) });
    expect(result.success).toBe(false);
  });

  it("accepts an optional honeypot website field without requiring it", () => {
    const result = contactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });
});
