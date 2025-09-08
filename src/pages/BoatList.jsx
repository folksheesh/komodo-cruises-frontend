import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoats } from '../hooks/useBoats';
import { formatIDR } from '../utils/format';

export default function BoatList() {
  const [filters, setFilters] = useState({ q: '', min: '', max: '', capacity: '' });
  const { data, isLoading, isError } = useBoats();

  const boats = data?.boats || data || [];

  const filtered = useMemo(() => {
    return boats.filter((b) => {
      const matchQ = filters.q ? (b.name || '').toLowerCase().includes(filters.q.toLowerCase()) : true;
      const min = filters.min ? Number(filters.min) : 0;
      const max = filters.max ? Number(filters.max) : Infinity;
      const cap = filters.capacity ? Number(filters.capacity) : 0;
      const price = b.fromPrice || b.prices?.['3D2N'] || 0;
      return matchQ && price >= min && price <= max && (!cap || (b.capacity || 0) >= cap);
    });
  }, [boats, filters]);

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-ocean-900 mb-4">Boats Catalogue</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <input className="px-3 py-2 rounded-lg border border-ocean-200" placeholder="Search name" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <input className="px-3 py-2 rounded-lg border border-ocean-200" placeholder="Min Price" value={filters.min} onChange={(e) => setFilters({ ...filters, min: e.target.value })} />
        <input className="px-3 py-2 rounded-lg border border-ocean-200" placeholder="Max Price" value={filters.max} onChange={(e) => setFilters({ ...filters, max: e.target.value })} />
        <input className="px-3 py-2 rounded-lg border border-ocean-200" placeholder="Min Capacity" value={filters.capacity} onChange={(e) => setFilters({ ...filters, capacity: e.target.value })} />
      </div>

      {isLoading ? <div>Loading…</div> : isError ? <div className="text-rose-700">Failed to load boats.</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <Link key={b.id} to={`/boats/${b.id}`} className="rounded-xl overflow-hidden bg-white border border-ocean-100 shadow-card-xl hover:shadow-lg">
              <div className="aspect-[16/10] bg-ocean-50">
                <img src={b.coverImage} alt={b.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="text-ocean-900 font-semibold text-lg">{b.name}</div>
                <div className="text-ocean-700 text-sm">Capacity {b.capacity}</div>
                <div className="mt-2 text-ocean-900 font-semibold">{formatIDR(b.fromPrice || b.prices?.['3D2N'])}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
