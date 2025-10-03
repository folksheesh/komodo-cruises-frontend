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
  {/* Subtle overlay to reduce excessive brightness while keeping natural color */}
  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-black/5 to-black/40" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="font-serif heading-serif font-normal text-[3.2rem] md:text-[4.8rem] leading-[1.02] text-luxury-mist drop-shadow-xl mb-6">
          Shores of Wonder
        </h1>
        <p className="max-w-2xl mx-auto text-luxury-mist/80 text-base md:text-lg tracking-wide leading-relaxed mb-10">
          Embark on an exclusive voyage through the Komodo Islands with curated vessels, private service, and authentic nature-infused experiences.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={() => onOpenPlan && onOpenPlan()}
            className="font-serif text-white text-xl md:text-2xl underline underline-offset-4 decoration-white hover:opacity-90 transition mt-3"
          >
            Plan your trip
          </button>
        </div>
      </div>
    </section>
  );
}
