export function formatIDR(n) {
  if (n === undefined || n === null) return '-';
  try {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
  } catch {
    return `Rp ${Number(n).toLocaleString('id-ID')}`;
  }
}
