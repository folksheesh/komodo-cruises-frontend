import React, { useState } from 'react';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    return (
        <header className="fixed top-4 left-0 right-0 z-50">
            <div className="max-w-[90rem] mx-auto px-4 md:px-6">
                <div className="backdrop-blur bg-white/90 text-ocean-900 rounded-2xl border border-white/70 shadow-card-xl h-14 px-4 md:px-6 grid grid-cols-[auto_1fr_auto] items-center">
                    <a href="#top" className="flex items-center gap-2 shrink-0">
                        <span className="font-display text-xl tracking-tight">Komodo Cruises</span>
                    </a>
                    <nav className="hidden md:flex items-center justify-center gap-6 text-[15px]">
                        <a href="#packages" className="hover:text-ocean-600">Destinasi</a>
                        <a href="#packages" className="hover:text-ocean-600">Grup</a>
                        <a href="#packages" className="hover:text-ocean-600">Blog</a>
                    </nav>
                    <div className="hidden md:flex items-center gap-3 justify-end shrink-0">
                        <a href="#booking" className="px-4 py-2 rounded-full bg-white text-ocean-900 border border-ocean-100 hover:bg-ocean-50 transition">Plan My Cruise</a>
                        <a href="#offers" className="px-4 py-2 rounded-full bg-[#6A3CF4] text-white hover:brightness-110 transition inline-flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2l2.39 4.84L18 7.27l-3.9 3.8.92 5.36L10 14.77 5.98 16.43l.92-5.36L3 7.27l5.61-.43L10 2z"/></svg>
                            Offers
                        </a>
                    </div>
                    <button className="md:hidden justify-self-end text-ocean-900" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
                    </button>
                </div>
            </div>
            {open && (
                <div className="md:hidden mt-2 max-w-[90rem] mx-auto px-4 md:px-6">
                    <div className="rounded-2xl bg-white/95 text-ocean-900 border border-white/70 shadow-card-xl">
                        <nav className="px-4 py-4 flex flex-col gap-3 text-[16px]">
                            <a href="#packages" className="py-1">Destinasi</a>
                            <a href="#packages" className="py-1">Grup</a>
                            <a href="#packages" className="py-1">Blog</a>
                            <div className="pt-2 border-t border-ocean-100 mt-2" />
                            <a href="#booking" className="px-4 py-2 rounded-full bg-white border border-ocean-100">Plan My Cruise</a>
                            <a href="#offers" className="px-4 py-2 rounded-full bg-[#6A3CF4] text-white text-center">Offers</a>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
