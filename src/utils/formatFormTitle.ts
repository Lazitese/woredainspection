import { getCurrentFiscalYear } from "@/lib/et-calendar";

/**
 * Dynamically formats a form table title using the report's created year.
 * If no year is provided, it falls back to the current Ethiopian fiscal year.
 *
 * Rules:
 * - General forms: Replaces "{year}" or any 4-digit year like "2018" with the report's year.
 * - Form 19 (external audit of previous fiscal year): Replaces "{prevYear}" or "2017" with `year - 1`.
 *
 * Examples:
 * - "ቅጽ 01፡ በ2018 በጀት ዓመት..." (year: 2019) -> "ቅጽ 01፡ በ2019 በጀት ዓመት..."
 * - "ቅጽ 19፡ በ2017 በጀት ሂሳብ..." (year: 2019) -> "ቅጽ 19፡ በ2018 በጀት ሂሳብ..."
 */
export function formatFormTitle(title: string, year?: number): string {
  if (!title) return "";
  const reportYear = year && !isNaN(year) ? Number(year) : getCurrentFiscalYear();
  const prevYear = reportYear - 1;

  // Form 19: Past fiscal year external audit report
  if (
    title.includes("ቅጽ 19") || 
    title.includes("{prevYear}") || 
    title.includes("በውጭ ኦዲተር") || 
    title.includes("በውጭ ኦዲት")
  ) {
    return title
      .replace(/\{prevYear\}/g, String(prevYear))
      .replace(/\{year\}/g, String(reportYear))
      .replace(/በ\d{4}\s*በጀት\s*ሂሳብ/g, `በ${prevYear} በጀት ሂሳብ`)
      .replace(/በ\d{4}\s*በጀት\s*ዓመት/g, `በ${reportYear} በጀት ዓመት`)
      .replace(/በ\d{4}\s*በጀት/g, `በ${reportYear} በጀት`);
  }

  // Standard report forms
  return title
    .replace(/\{prevYear\}/g, String(prevYear))
    .replace(/\{year\}/g, String(reportYear))
    .replace(/በ\d{4}\s*በጀት\s*ዓመት/g, `በ${reportYear} በጀት ዓመት`)
    .replace(/በ\d{4}\s*በጀት/g, `በ${reportYear} በጀት`);
}
