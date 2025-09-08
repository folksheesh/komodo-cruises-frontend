import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './Footer';
import SearchResults from './SearchResults';

export default function HomePage() {
	const [query, setQuery] = useState({});

	useEffect(() => {
		function onPrefill(e) {
			const detail = e.detail || {};
			setQuery((q) => ({ ...q, ...detail }));
			// Scroll to results
			const el = document.getElementById('results');
			if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
		window.addEventListener('prefill-booking', onPrefill);
		return () => window.removeEventListener('prefill-booking', onPrefill);
	}, []);

	return (
		<main id="top" className="min-h-screen bg-white">
			<Navbar />
			<Hero />
			<SearchResults query={query} />
			<Footer />
		</main>
	);
}
