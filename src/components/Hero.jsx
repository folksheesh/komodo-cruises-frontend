import React, { useMemo, useState } from 'react';
import heroLocal from '../images/komodo.jpg';
import MiniCalendar from './MiniCalendar';

function nextAllowedDate(base = new Date()) {
  // Return the next Monday or Friday from base date (inclusive if matches)
  const d = new Date(base);
  for (let i = 0; i < 14; i++) {
    const day = d.getDay();
    if (day === 1 || day === 5) return new Date(d);
    d.setDate(d.getDate() + 1);
  }
  return new Date(base);
}

const DESTINATIONS = [
  'Taman Nasional Komodo',
  'Pulau Padar',
  'Pink Beach',
  'Manta Point',
  'Taka Makassar',
  'Pulau Kelor',
  'Siaba',
  'Kanawa',
  'Kalong Island',
];

export default function Hero() {
  const [openMenu, setOpenMenu] = useState(null); // 'destination' | 'date' | null
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(''); // '3D2N' | '4D3N'
  const [selectedDate, setSelectedDate] = useState(''); // ISO YYYY-MM-DD
  const [selectedMonth, setSelectedMonth] = useState(''); // YYYY-MM
  const [dateMode, setDateMode] = useState('dates'); // 'dates' | 'months'
  const [yearCursor, setYearCursor] = useState(new Date().getFullYear());
  const [pickedYear, setPickedYear] = useState(new Date().getFullYear());
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [y, y + 1, y + 2];
  }, []);

  function monthToDate(year, monthIndex) {
    // Choose first allowed date (Mon/Fri) of that month, not in the past
    const today = new Date();
    let d = new Date(year, monthIndex, 1);
    if (d < today) d = new Date(today);
    // find first Mon/Fri within the month
    for (let i = 0; i < 31 && d.getMonth() === monthIndex; i++) {
      const day = d.getDay();
  if (day === 1 || day === 5) return d;
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    }
    return null;
  }
  return (
    <section className="relative w-full">
      <div className="relative h-[72vh] md:h-[82vh] w-full">
      <img
        src={heroLocal}
        alt="Luxury cruise on tropical ocean"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?q=80&w=1600&auto=format&fit=crop';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />

      {/* Left hero copy + CTAs */}
      <div className="relative z-10 h-full flex items-center text-white">
        <div className="max-w-[90rem] mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-[34px] sm:text-[44px] md:text-[56px] leading-[1.05] font-extrabold tracking-tight">
              Extraordinary experience that goes beyond cruising.
            </h1>
            <div className="mt-6 flex items-center gap-3">
              <a href="#offers" className="px-4 py-2.5 rounded-lg bg-white text-[#6A3CF4] font-semibold hover:bg-white/90">Check Offers</a>
              <a href="#booking" className="px-4 py-2.5 rounded-lg bg-[#6A3CF4] text-white font-semibold hover:brightness-110">Start Booking</a>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Search strip / quick filter with mega dropdowns */}
      <div className="relative z-20 -mt-12 md:-mt-20 mb-4">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="rounded-[18px] bg-gradient-to-b from-white to-white/90 backdrop-blur border border-ocean-100 px-6 md:px-10 py-5 md:py-6 shadow-[0_25px_45px_-15px_rgba(0,0,0,0.25)]">
            <div className="text-ocean-900 text-xl md:text-2xl font-semibold mb-4">Explore 208 Cruise Holidays</div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5">
            {/* Destination selector */}
            <div className="relative flex-1">
              <button onClick={() => setOpenMenu(openMenu === 'destination' ? null : 'destination')} className="w-full text-left">
        <div className="text-[11px] md:text-xs uppercase tracking-widest text-ocean-600">TUJUAN</div>
                <div className="text-ocean-800 font-medium text-lg flex items-center gap-2">
                  <span>{destination || 'Pilih Destinasi'}</span>
                  <svg className="w-4 h-4 text-ocean-600" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
                </div>
              </button>
              {openMenu === 'destination' && (
                <div className="absolute left-0 right-0 mt-3 rounded-xl bg-ocean-600 text-white p-6 shadow-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {DESTINATIONS.map((d) => (
                      <button key={d} className="text-left hover:text-gold-200" onClick={() => { setDestination(d); setOpenMenu(null); }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* vertical separator (desktop) */}
            <div className="hidden md:block w-px self-stretch bg-ocean-100" />

            {/* Duration selector styled like others */}
            <div className="relative flex-1">
              <button onClick={() => setOpenMenu(openMenu === 'duration' ? null : 'duration')} className="w-full text-left">
                <div className="text-[11px] md:text-xs uppercase tracking-widest text-ocean-600">DURASI</div>
                <div className="text-ocean-800 font-medium text-lg flex items-center gap-2">
                  <span>{duration || 'Pilih Durasi'}</span>
                  <svg className="w-4 h-4 text-ocean-600" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
                </div>
              </button>
              {openMenu === 'duration' && (
                <div className="absolute left-0 right-0 mt-3 rounded-xl bg-ocean-600 text-white p-6 shadow-2xl">
                  <div className="grid grid-cols-2 gap-3">
                    {['3D2N','4D3N'].map((opt) => (
                      <button
                        key={opt}
                        className={`px-4 py-3 rounded-full border border-white/20 hover:bg-white/10 ${duration===opt ? 'ring-1 ring-white/60' : ''}`}
                        onClick={() => { setDuration(opt); setOpenMenu(null); }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* vertical separator (desktop) */}
            <div className="hidden md:block w-px self-stretch bg-ocean-100" />

            {/* Date selector with calendar */}
            <div className="relative flex-1">
              <button onClick={() => setOpenMenu(openMenu === 'date' ? null : 'date')} className="w-full text-left">
                <div className="text-[11px] md:text-xs uppercase tracking-widest text-ocean-600">KEBERANGKATAN</div>
                <div className="text-ocean-800 font-medium text-lg flex items-center gap-2">
                  <span>
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
                      : selectedMonth
                        ? new Date(`${selectedMonth}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                        : 'Pilih Tanggal (Senin/Jumat)'}
                  </span>
                  <svg className="w-4 h-4 text-ocean-600" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
                </div>
              </button>
              {openMenu === 'date' && (
                <div className="absolute left-0 mt-3 rounded-2xl bg-ocean-600 text-white p-6 shadow-2xl">
                  {/* Tabs */}
                  <div className="flex items-center gap-6 mb-4">
                    <button className={`text-sm ${dateMode==='months' ? 'text-white font-semibold' : 'text-white/80'} pb-1 border-b-2 ${dateMode==='months' ? 'border-white' : 'border-transparent'}`} onClick={() => setDateMode('months')}>
                      Search By Months
                    </button>
                    <button className={`text-sm ${dateMode==='dates' ? 'text-white font-semibold' : 'text-white/80'} pb-1 border-b-2 ${dateMode==='dates' ? 'border-white' : 'border-transparent'}`} onClick={() => setDateMode('dates')}>
                      Search By Dates
                    </button>
                  </div>

                  {dateMode === 'dates' ? (
                    <MiniCalendar
                      initialMonth={selectedDate ? new Date(selectedDate) : new Date()}
                      allowedDays={(d) => [1,5].includes(d.getDay())}
                      selectionStart={selectedDate || undefined}
                      durationDays={duration === '3D2N' ? 3 : duration === '4D3N' ? 4 : 0}
                      minDate={new Date()}
                      onPick={(iso) => {
                        setSelectedMonth('');
                        setSelectedDate(iso);
                        window.dispatchEvent(new CustomEvent('prefill-booking', { detail: { destination: destination || undefined, date: iso, duration: duration || undefined } }));
                        setOpenMenu(null);
                      }}
                    />
                  ) : (
                    <div className="w-[320px] md:w-[380px]">
                      <div className="flex items-center justify-between mb-3">
                        <button className="px-2 py-1 rounded-md bg-white/10 text-white hover:bg-white/20" onClick={() => setYearCursor((y) => y - 1)}>{'<'}</button>
                        <div className="text-white/90 font-semibold text-lg">{yearCursor}</div>
                        <button className="px-2 py-1 rounded-md bg-white/10 text-white hover:bg-white/20" onClick={() => setYearCursor((y) => y + 1)}>{'>'}</button>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        {months.map((m, idx) => {
                          const y = yearCursor;
                          const monthStr = `${y}-${String(idx+1).padStart(2,'0')}`;
                          const firstDay = new Date(y, idx, 1); firstDay.setHours(0,0,0,0);
                          const today = new Date(); today.setHours(0,0,0,0);
                          const isPast = firstDay < new Date(today.getFullYear(), today.getMonth(), 1);
                          return (
                            <button
                              key={m}
                              className={`px-4 py-2.5 rounded-full border ${isPast ? 'bg-white/10 text-white/50 border-white/10 cursor-not-allowed' : 'hover:bg-white/10 border-white/20'} ${selectedMonth===monthStr ? 'ring-1 ring-white/60' : ''}`}
                              onClick={() => {
                                if (isPast) return;
                                setPickedYear(y);
                                const d = monthToDate(y, idx);
                                setSelectedDate('');
                                setSelectedMonth(monthStr);
                                if (d) {
                                  const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                                  window.dispatchEvent(new CustomEvent('prefill-booking', { detail: { destination: destination || undefined, date: iso, month: monthStr, duration: duration || undefined } }));
                                  setOpenMenu(null);
                                }
                              }}
                              disabled={isPast}
                              title={isPast ? 'Tidak available' : ''}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2 text-[12px] text-white/85">Pilih bulan untuk melihat keberangkatan (Senin/Jumat) dalam bulan tersebut.</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                const d = nextAllowedDate();
                const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                setSelectedDate(iso);
                window.dispatchEvent(new CustomEvent('prefill-booking', { detail: { destination: destination || undefined, date: iso, duration: duration || undefined } }));
              }}
              className="bg-[#6A3CF4] hover:brightness-110 text-white font-semibold px-8 md:px-10 py-4 rounded-[14px] shadow-[0_8px_20px_rgba(106,60,244,0.35)] inline-flex items-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2a1 1 0 00-1 1v1H5a3 3 0 00-3 3v11a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3h-1V3a1 1 0 10-2 0v1H8V3a1 1 0 00-1-1zm-3 7a1 1 0 011-1h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V9z"/></svg>
              Find a Cruise
            </button>
            </div>
          </div>

          {/* Secondary filters row */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button className="px-4 py-2 rounded-full bg-white border border-ocean-100 text-ocean-800 hover:bg-ocean-50">Select Ship</button>
          </div>
        </div>
      </div>

      {/* Footnote banner */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-[12px] md:text-[13px] bg-rose-100 text-rose-900/90 rounded-md px-4 py-2 border border-rose-200">
            * Kids Sail Free! Book a cruise for your family, and kids sail free as the 3rd and 4th guests on select trips. Additional kids sail at standard rates. Terms & conditions apply.
          </div>
        </div>
      </div>
    </section>
  );
}
