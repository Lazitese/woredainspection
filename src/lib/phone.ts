/**
 * Normalise any Ethiopian phone input to E.164 format (+251XXXXXXXXX).
 * Handles: 09…, +2519…, 9…, 2519…, +251 9… (with spaces), etc.
 */
export function normalizePhoneToE164(raw: string): string {
  // Strip all whitespace first
  let phone = raw.trim().replace(/\s+/g, '');
  
  // Strip leading + if present so we work with pure digits
  const hadPlus = phone.startsWith('+');
  if (hadPlus) phone = phone.slice(1);
  
  // Remove any remaining non-digit characters (dashes, parens, etc.)
  const digits = phone.replace(/\D/g, '');
  
  // Extract the last 9 significant digits (Ethiopian local number)
  // Ethiopian numbers are 9 digits after the country code
  let local9: string;
  if (digits.startsWith('251') && digits.length >= 12) {
    // Full international format without +: 2519XXXXXXXX
    local9 = digits.slice(3); // remove 251 prefix
  } else if (digits.startsWith('0') && digits.length >= 10) {
    // Local format: 09XXXXXXXX
    local9 = digits.slice(1); // remove leading 0
  } else if (digits.length === 9) {
    // Bare 9 digits: 9XXXXXXXX
    local9 = digits;
  } else {
    // Fallback: take last 9 digits
    local9 = digits.slice(-9);
  }
  
  return `+251${local9}`;
}
