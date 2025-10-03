import React, { useMemo } from 'react';
import boats from '../data/boats.json';

function formatIDR(n) {
  try { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n); }
  catch { return `Rp ${n?.toLocaleString('id-ID')}`; }
}

function nextAllowedDate(base = new Date()) {
  const d = new Date(base);
  for (let i = 0; i < 14; i++) {
    const day = d.getDay(); // 1=Mon, 5=Fri
    if (day === 1 || day === 5) return d;
    d.setDate(d.getDate() + 1);
  }
  return base;
}

export default function SearchResults({ query }) {
  const { destination, date, duration, month } = query || {};

  const departDate = useMemo(() => {
    if (!date) return nextAllowedDate();
    const d = new Date(date);
    return nextAllowedDate(d);
  }, [date]);

  const items = useMemo(() => {
    // Simple filter: all boats operate in Komodo area. Optionally filter by duration key availability.
    const normalized = duration === '4D2N' ? '4D3N' : duration;
    const key = normalized && ['3D2N', '4D3N'].includes(normalized) ? normalized : null;
    return boats
      .filter((b) => (key ? b.prices && b.prices[key] : true))
      .map((b) => {
        const price = key
          ? b.prices[key]
          : Math.min(...Object.values(b.prices || {}));
        return { ...b, fromPrice: price };
      });
  }, [duration]);

  return (
    <section id="results" className="max-w-6xl mx-auto px-4 md:px-6 py-10">
  {/* Heading removed as requested */}

  {/* All cards removed as requested */}
    </section>
  );
}
