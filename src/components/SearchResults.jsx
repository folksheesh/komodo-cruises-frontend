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
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-ocean-900">{items.length} Cruises available</h3>
          <div className="text-ocean-700 text-sm md:text-base">
            {destination ? `${destination} • ` : ''}
            {month
              ? `Bulan ${new Date(`${month}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
              : `Berangkat ${departDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((b) => (
          <article key={b.id} className="rounded-xl overflow-hidden bg-white border border-ocean-100 shadow-card-xl">
            <div className="aspect-[16/10] bg-ocean-50 overflow-hidden">
              <img src={b.coverImage} alt={b.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <div className="text-ocean-900 font-semibold text-lg">{b.name}</div>
              <div className="text-ocean-700 text-sm">{b.subtitle}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-ocean-700">From</div>
                <div className="text-ocean-900 font-semibold">{formatIDR(b.fromPrice)}</div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-ocean-700">
                  Depart {departDate.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short' })}
                </div>
                <button className="px-3 py-2 rounded-lg bg-[#6A3CF4] text-white text-sm hover:brightness-110">View details</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
