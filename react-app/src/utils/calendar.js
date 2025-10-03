import { addDays, endOfMonth, formatISO, startOfMonth } from 'date-fns';

export function monthKey(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatISO(d, { representation: 'date' }).slice(0, 7); // YYYY-MM
}

export function buildCalendarDays(date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = [];
  let d = new Date(start);
  while (d <= end) {
    days.push(new Date(d));
    d = addDays(d, 1);
  }
  return days;
}

// availabilityMap: { 'YYYY-MM-DD': { available: true|false|null, cabins: [{type, availableCount}] } }
export function decorateDays(days, availabilityMap) {
  return days.map((d) => {
    const key = formatISO(d, { representation: 'date' });
    const a = availabilityMap?.[key];
    let status = 'unknown';
    if (a) {
      if (a.available === true) status = 'available';
      else if (a.available === false) status = 'full';
      else status = 'partial';
    }
    return { date: d, key, status, detail: a };
  });
}
