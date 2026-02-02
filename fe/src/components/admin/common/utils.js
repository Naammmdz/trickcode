export const parseCsvUpper = (text) =>
  (text || '')
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)
    .map((r) => r.toUpperCase());
