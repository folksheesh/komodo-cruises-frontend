import React, { useState, useEffect } from 'react';

export default function Navbar({ onOpenPlan }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 40);
        }
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <header className="fixed top-4 left-0 right-0 z-50">
            <div className="max-w-[90rem] mx-auto px-4 md:px-6">
                <div className={
                    `rounded-2xl h-14 px-4 md:px-6 grid grid-cols-[auto_1fr_auto] items-center transition colors duration-500 ` +
                    (scrolled
                        ? 'backdrop-blur bg-white/85 text-luxury-forest shadow-card-xl'
                        : 'bg-transparent text-white backdrop-blur-[2px]')
                }>
                    <a href="#top" className="flex items-center gap-2 shrink-0">
                        <span className="font-display text-xl tracking-tight">Komodo Cruises</span>
                    </a>
                    {/* Middle links removed per request */}
                    <nav className="hidden md:flex items-center justify-center gap-6 text-[15px]" />
                    <div className="hidden md:flex items-center gap-3 justify-end shrink-0">
                        <button
                            type="button"
                            onClick={() => {
                                const el = document.getElementById('results');
                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                            className="px-5 py-2.5 rounded-full bg-white/70 backdrop-blur text-luxury-forest hover:bg-white transition font-medium"
                        >
                            Search
                        </button>
                        <button className="px-5 py-2.5 rounded-full bg-luxury-forest/80 text-luxury-mist hover:bg-luxury-forest transition font-medium tracking-wide">Menu</button>
                    </div>
                    <button className="md:hidden justify-self-end text-ocean-900" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
                    </button>
                </div>
            </div>
            {open && (
                <div className="md:hidden mt-2 max-w-[90rem] mx-auto px-4 md:px-6">
                    <div className="rounded-2xl bg-white/95 text-ocean-900 shadow-card-xl">
                        <nav className="px-4 py-4 flex flex-col gap-3 text-[16px]">
                            <a href="/plan-trip" onClick={(e) => { e.preventDefault(); window.location.assign('/plan-trip'); }} className="px-4 py-2 rounded-full bg-white/80 backdrop-blur text-luxury-forest">Plan My Cruise</a>
                            <button className="px-4 py-2 rounded-full bg-luxury-forest text-luxury-mist text-center">Menu</button>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
