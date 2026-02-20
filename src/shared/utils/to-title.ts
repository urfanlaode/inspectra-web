export const toTitle = (s: string): string => {
  if (!s) return s
  return s
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((w) => (w.length ? w[0]?.toUpperCase() + w.slice(1) : w))
    .join(' ')
}
