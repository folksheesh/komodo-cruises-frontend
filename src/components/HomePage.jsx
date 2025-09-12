import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import PlanTrip from '../pages/PlanTrip';
import Footer from './Footer';
import SearchResults from './SearchResults';

console.log('[HomePage] Imported Hero type =', typeof Hero, 'value =', Hero);

export default function HomePage() {
  const [query, setQuery] = useState({});
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    if (showPlan) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [showPlan]);

  useEffect(() => {
    function onPrefill(e) {
      const detail = e.detail || {};
      setQuery((q) => ({ ...q, ...detail }));
      const el = document.getElementById('results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.addEventListener('prefill-booking', onPrefill);
    return () => window.removeEventListener('prefill-booking', onPrefill);
  }, []);

  return (
    <main id="top" className="min-h-screen bg-white">      
      <Navbar onOpenPlan={() => setShowPlan(true)} />
      <Hero onOpenPlan={() => setShowPlan(true)} />
      {showPlan && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPlan(false)} />
          <div className="relative flex-1 flex flex-col">
            <div className="flex-1 bg-white/95 backdrop-blur px-0 md:px-0 py-0 overflow-hidden">
              <PlanTrip onClose={() => setShowPlan(false)} />
            </div>
          </div>
        </div>
      )}
      <SearchResults query={query} />
      <Footer />
    </main>
  );
}
