import { describe, expect, it } from "vitest";
import { addMonths, fromISODate, monthGrid, nextWeekendSaturday, toISODate } from "./dates";

describe("toISODate / fromISODate", () => {
  it("round-trips a local date without shifting the day", () => {
    expect(toISODate(fromISODate("2026-10-05"))).toBe("2026-10-05");
  });

  it("pads month and day", () => {
    expect(toISODate(new Date(2026, 0, 3))).toBe("2026-01-03");
  });
});

describe("nextWeekendSaturday", () => {
  it("returns this Saturday from a Wednesday", () => {
    expect(toISODate(nextWeekendSaturday(new Date(2026, 8, 30)))).toBe("2026-10-03");
  });

  it("returns the following Saturday when today is Saturday", () => {
    expect(toISODate(nextWeekendSaturday(new Date(2026, 9, 3)))).toBe("2026-10-10");
  });

  it("returns the following Saturday when today is Sunday", () => {
    expect(toISODate(nextWeekendSaturday(new Date(2026, 9, 4)))).toBe("2026-10-10");
  });
});

describe("addMonths", () => {
  it("rolls over the year", () => {
    expect(toISODate(addMonths(new Date(2026, 11, 15), 1))).toBe("2027-01-01");
  });
});

describe("monthGrid", () => {
  it("starts on Monday: October 2026 begins on a Thursday (3 blanks)", () => {
    const grid = monthGrid(new Date(2026, 9, 1));
    expect(grid.slice(0, 3)).toEqual([null, null, null]);
    expect(toISODate(grid[3]!)).toBe("2026-10-01");
    expect(grid.filter(Boolean)).toHaveLength(31);
  });

  it("has no blanks when the 1st is a Monday (June 2026)", () => {
    expect(toISODate(monthGrid(new Date(2026, 5, 1))[0]!)).toBe("2026-06-01");
  });

  it("handles leap-year February", () => {
    expect(monthGrid(new Date(2028, 1, 1)).filter(Boolean)).toHaveLength(29);
  });
});
