import React from 'react';

export default function Footer() {
	return (
		<footer className="bg-ocean-900 text-white mt-16">
			<div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
				<div className="text-white/80 text-sm">© {new Date().getFullYear()} Komodo Cruises</div>
				<div className="flex items-center gap-6 text-sm">
					<a className="hover:text-white/90" href="#">Kebijakan Privasi</a>
					<a className="hover:text-white/90" href="#">Syarat & Ketentuan</a>
				</div>
			</div>
		</footer>
	);
}
