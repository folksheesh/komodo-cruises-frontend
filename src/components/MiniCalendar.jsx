import React, { useMemo, useState } from 'react';

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function startOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function fmtISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`; // Local date, no timezone shift
}

export default function MiniCalendar({ initialMonth = new Date(), allowedDays = (d) => true, onPick, selectionStart, durationDays = 0, minDate }) {
  const [month, setMonth] = useState(startOfMonth(initialMonth));
  const [previewStart, setPreviewStart] = useState(null);

  const grid = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = [];
    const startWeekday = (start.getDay() + 6) % 7; // make Monday=0
    for (let i = 0; i < startWeekday; i++) days.push(null);
    let d = new Date(start);
    while (d <= end) { days.push(new Date(d)); d = addDays(d, 1); }
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [month]);

  const start = selectionStart ? new Date(selectionStart) : (previewStart ? new Date(previewStart) : null);
  const end = start && durationDays ? addDays(start, Math.max(0, durationDays - 1)) : null;

  return (
    <div className="w-[320px] md:w-[380px]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-white/95 font-semibold text-lg">{month.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded-md bg-white/10 text-white hover:bg-white/20" onClick={() => setMonth((m) => addMonths(m, -1))}>{'<'}</button>
          <button className="px-2 py-1 rounded-md bg-white/10 text-white hover:bg-white/20" onClick={() => setMonth((m) => addMonths(m, 1))}>{'>'}</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-[11px] text-white/80 mb-1">
        {WEEKDAYS.map((w) => (<div key={w} className="text-center">{w}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {grid.map((d, idx) => {
          if (!d) return <div key={`e${idx}`} />;
          const todayStart = minDate ? new Date(minDate) : new Date();
          todayStart.setHours(0,0,0,0);
          const isAllowed = allowedDays(d) && d >= todayStart;
          const inRange = start && end && d >= start && d <= end;
          const base = 'aspect-square rounded-xl text-sm flex items-center justify-center border';
          const enabled = inRange ? 'bg-emerald-400/90 text-emerald-900 border-emerald-500 hover:bg-emerald-400' : 'bg-white text-ocean-900 border-white hover:bg-white/90';
          const disabled = 'bg-white/10 text-white/60 border-white/20 cursor-not-allowed';
          return (
            <button
              key={fmtISO(d)}
              className={`${base} ${isAllowed ? enabled : disabled}`}
              onMouseEnter={() => { if (isAllowed) setPreviewStart(fmtISO(d)); }}
              onMouseLeave={() => setPreviewStart(null)}
              onClick={() => isAllowed ? onPick?.(fmtISO(d)) : undefined}
              title={isAllowed ? '' : 'Tidak available'}
              disabled={!isAllowed}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-[12px] text-white/85">Hanya hari Senin dan Jumat yang dapat dipilih.</div>
    </div>
  );
}
