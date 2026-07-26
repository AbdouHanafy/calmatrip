import { describe, expect, it } from "vitest";
import { registerSchema } from "./auth";

describe("registerSchema", () => {
  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({
      name: "Jane Doe",
      email: "Jane@Example.com",
      password: "abc12345",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // email is trimmed + lowercased
      expect(result.data.email).toBe("jane@example.com");
      // accountType defaults to "user" when omitted
      expect(result.data.accountType).toBe("user");
    }
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({
      name: "J",
      email: "jane@example.com",
      password: "abc12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = registerSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      password: "abc12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password without a letter", () => {
    const result = registerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "12345678",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password without a digit", () => {
    const result = registerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "abcdefgh",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "ab12",
    });
    expect(result.success).toBe(false);
  });

  it("accepts artisan/agency account types", () => {
    for (const accountType of ["artisan", "agency"] as const) {
      const result = registerSchema.safeParse({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "abc12345",
        accountType,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects an unknown account type", () => {
    const result = registerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "abc12345",
      accountType: "admin",
    });
    expect(result.success).toBe(false);
  });
});
