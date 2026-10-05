/** Format bulan masa kerja jadi "x tahun y bulan". Null/invalid/negatif jadi "-". */
export const formatTenure = (months: number | null) => {
  if (months === null || !Number.isFinite(months) || months < 0) return "-"
  const total = Math.floor(months)
  const years = Math.floor(total / 12)
  const rest = total % 12
  if (years === 0 && rest === 0) return "0 bulan"
  return [
    years > 0 ? `${years} tahun` : null,
    rest > 0 ? `${rest} bulan` : null,
  ]
    .filter(Boolean)
    .join(" ")
}
