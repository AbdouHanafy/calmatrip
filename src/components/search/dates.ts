// Calendar helpers for the search bar. Everything works on local dates and
// "YYYY-MM-DD" strings, never on UTC timestamps, so a day never shifts.

export function toISODate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

/** The Saturday of the coming weekend; if it's already the weekend, the next one. */
export function nextWeekendSaturday(today: Date): Date {
  const day = today.getDay(); // 0 Sun … 6 Sat
  const offset = day === 6 ? 7 : day === 0 ? 6 : 6 - day;
  return addDays(startOfDay(today), offset);
}

/**
 * Month grid with Monday as the first column. Leading blanks are null so the
 * 1st lands under the right weekday.
 */
export function monthGrid(month: Date): (Date | null)[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leading = (first.getDay() + 6) % 7; // Monday = 0
  const cells: (Date | null)[] = Array.from({ length: leading }, () => null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  }
  return cells;
}
