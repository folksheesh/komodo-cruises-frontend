import React from 'react';
import localHero from '../images/komodo.jpg';

// Luxury full-screen hero
export default function Hero({ onOpenPlan }) {
  return (
  <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <picture>
          <source srcSet={localHero} media="(max-width: 640px)" />
          <img
            src={localHero}
            alt="Komodo luxury landscape"
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="font-serif heading-serif text-[2.8rem] md:text-[4.2rem] leading-[1.05] text-luxury-mist drop-shadow-xl mb-6">
          Place of Miracles
        </h1>
        <p className="max-w-2xl mx-auto text-luxury-mist/80 text-base md:text-lg tracking-wide leading-relaxed mb-10">
          Hadirkan perjalanan laut eksklusif menyusuri keajaiban Kepulauan Komodo dengan kapal pilihan kurasi, layanan privat, dan pengalaman autentik bernuansa alam.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={() => onOpenPlan && onOpenPlan()}
            className="px-8 py-3 rounded-full bg-luxury-accent text-white font-medium tracking-wide shadow-[0_8px_30px_-5px_rgba(192,138,91,.5)] hover:bg-luxury-accentDark transition"
          >
            Plan your trip
          </button>
        </div>
      </div>
    </section>
  );
}
