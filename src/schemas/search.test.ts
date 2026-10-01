import { describe, expect, it } from "vitest";
import { searchParamsSchema } from "./search";

const parse = (input: Record<string, unknown>) => searchParamsSchema.parse(input);

describe("searchParamsSchema", () => {
  it("parses a full search from the bar", () => {
    expect(
      parse({ destination: "Hammamet", date: "2026-10-12", adults: "2", children: "1" }),
    ).toEqual({ destination: "Hammamet", date: "2026-10-12", adults: 2, children: 1 });
  });

  it("accepts an empty query string", () => {
    expect(parse({})).toEqual({});
  });

  it("trims the destination", () => {
    expect(parse({ destination: "  Djerba " }).destination).toBe("Djerba");
  });

  it("drops a malformed date instead of failing", () => {
    expect(parse({ destination: "Hammamet", date: "12/10/2026" })).toEqual({
      destination: "Hammamet",
    });
  });

  it("drops zero adults", () => {
    expect(parse({ adults: "0" }).adults).toBeUndefined();
  });

  it("allows zero children", () => {
    expect(parse({ children: "0" }).children).toBe(0);
  });

  it("drops out-of-range counts", () => {
    expect(parse({ adults: "150", children: "-1" })).toEqual({});
  });

  it("drops a one-character text query", () => {
    expect(parse({ q: "a" }).q).toBeUndefined();
  });
});
