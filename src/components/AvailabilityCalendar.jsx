import React, { useMemo, useState } from 'react';
import { buildCalendarDays, decorateDays, monthKey } from '../utils/calendar';
import { useAvailability, useAvailabilityRefresh } from '../hooks/useAvailability';
import { addMonths, format, formatISO } from 'date-fns';

export default function AvailabilityCalendar({ boatId, onSelectDate }) {
  const [month, setMonth] = useState(new Date());
  const monthISO = monthKey(month);
  const { data, isLoading, isError, refetch, isFetching } = useAvailability(boatId, monthISO);
  const refresh = useAvailabilityRefresh();

  const days = useMemo(() => buildCalendarDays(month), [month]);
  const decorated = useMemo(() => decorateDays(days, data?.availability), [days, data]);

  return (
    <div className="rounded-2xl border border-ocean-100 bg-white shadow-card-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-ocean-900 font-semibold">{format(month, 'MMMM yyyy')}</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-ocean-200 hover:bg-ocean-50" onClick={() => setMonth((m) => addMonths(m, -1))}>Prev</button>
          <button className="px-3 py-1.5 rounded-lg border border-ocean-200 hover:bg-ocean-50" onClick={() => setMonth((m) => addMonths(m, 1))}>Next</button>
          <button className="px-3 py-1.5 rounded-lg bg-white border border-ocean-200 hover:bg-ocean-50" onClick={() => refetch()} disabled={isFetching}>Reload</button>
          <button className="px-3 py-1.5 rounded-lg bg-luxury-accent text-white hover:bg-luxury-accentDark transition" onClick={() => refresh.mutate()} disabled={refresh.isLoading}>Refresh Sheets</button>
        </div>
      </div>
      {isLoading ? (
        <div className="text-ocean-700">Loading calendar…</div>
      ) : isError ? (
        <div className="text-rose-700">Failed to load availability. Try reload.</div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-2 text-xs text-ocean-700 mb-1">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
              <div key={d} className="text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {decorated.map(({ key, date, status, detail }) => {
              const color = status === 'available' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : status === 'full' ? 'bg-rose-100 text-rose-800 border-rose-200' : status === 'partial' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-ocean-50 text-ocean-700 border-ocean-100';
              return (
                <button
                  key={key}
                  className={`aspect-square rounded-lg border ${color} p-1 flex flex-col items-center justify-center hover:brightness-95`}
                  onClick={() => onSelectDate?.(formatISO(date, { representation: 'date' }), detail)}
                >
                  <div className="text-sm font-semibold">{format(date, 'd')}</div>
                  <div className="text-[10px]">{status}</div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
