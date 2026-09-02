import { describe, expect, it } from "vitest";
import type { Session } from "next-auth";
import { isAdminWorkspaceRole, isApprovedPartner } from "./access";

const partner = (status: string, type = "ARTISAN") =>
  ({
    user: { id: "partner", role: "B2B", b2bStatus: status, b2bType: type },
    expires: "2099-01-01",
  }) as Session;

describe("workspace access", () => {
  it("keeps pending partners out of operational inventory", () => {
    expect(isApprovedPartner(partner("pending"), "ARTISAN")).toBe(false);
    expect(isApprovedPartner(partner("approved"), "ARTISAN")).toBe(true);
    expect(isApprovedPartner(partner("approved", "AGENCY"), "ARTISAN")).toBe(false);
  });

  it("recognizes scoped staff roles without treating customers as staff", () => {
    expect(isAdminWorkspaceRole("CONTENT_MANAGER")).toBe(true);
    expect(isAdminWorkspaceRole("SUPPORT_AGENT")).toBe(true);
    expect(isAdminWorkspaceRole("USER")).toBe(false);
  });
});
