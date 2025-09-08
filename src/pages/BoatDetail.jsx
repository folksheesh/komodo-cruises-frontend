import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoats } from '../hooks/useBoats';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { formatIDR } from '../utils/format';

export default function BoatDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useBoats();
  const boat = useMemo(() => (data?.boats || data || []).find((b) => String(b.id) === String(id)), [data, id]);

  const [picked, setPicked] = useState({ date: null, cabinType: null });

  function onSelectDate(dateISO, detail) {
    setPicked((p) => ({ ...p, date: dateISO }));
  }

  if (isLoading) return <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">Loading…</div>;
  if (isError || !boat) return <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 text-rose-700">Boat not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden">
            <img src={boat.mainPhoto || boat.coverImage} alt={boat.name} className="w-full h-auto object-cover" />
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-ocean-900 mt-4">{boat.name}</h1>
          <div className="text-ocean-700">Capacity {boat.capacity}</div>
          <div className="mt-2 text-ocean-900 font-semibold">From {formatIDR(boat.prices?.['3D2N'] || boat.fromPrice)}</div>
          <div className="mt-6">
            <h2 className="font-semibold text-ocean-900 mb-2">Choose your date</h2>
            <AvailabilityCalendar boatId={boat.id} onSelectDate={onSelectDate} />
          </div>
        </div>
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-ocean-100 bg-white shadow-card-xl p-4 sticky top-24">
            <div className="font-semibold text-ocean-900 mb-3">Booking</div>
            <div className="text-sm text-ocean-700">Date: {picked.date || '-'}</div>
            <div className="mt-3">
              <label className="text-sm text-ocean-700">Cabin Type</label>
              <select className="mt-1 w-full px-3 py-2 rounded-lg border border-ocean-200" value={picked.cabinType || ''} onChange={(e) => setPicked({ ...picked, cabinType: e.target.value })}>
                <option value="">Select cabin</option>
                {(boat.cabins || []).map((c) => (
                  <option key={c.type} value={c.type}>{c.type} — {formatIDR(c.price)}</option>
                ))}
              </select>
            </div>
            <button className="mt-4 w-full px-4 py-2 rounded-lg bg-[#6A3CF4] text-white hover:brightness-110 disabled:opacity-50" disabled={!picked.date || !picked.cabinType}>Continue</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
