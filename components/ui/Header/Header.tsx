'use client';

import { useEffect, useState } from 'react';
import { HeaderActions } from './HeaderActions';
import { HeaderBrand } from './HeaderBrand';
import { headerNavItems } from './Header.constants';
import { HeaderHamburgerButton } from './HeaderHamburgerButton';
import { HeaderMobileMenu } from './HeaderMobileMenu';

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setIsMenuOpen(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsMenuOpen(false);
			}
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		document.body.style.overflow = isMenuOpen ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	}, [isMenuOpen]);

	return (
		<>
			<header
				className={`fixed top-4 left-4 right-4 z-50 rounded-3xl border border-white/10 backdrop-blur-sm transition-colors duration-300 sm:left-6 sm:right-6 md:left-10 md:right-10 lg:left-14 lg:right-14 lg:border-0 xl:left-24 xl:right-24 ${
					isScrolled ? 'bg-(--helio-bg-primary)/95' : 'bg-helio-hero/80'
				}`}
			>
				<nav className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
					<HeaderBrand />

					<div className="hidden lg:flex">
						<HeaderActions items={headerNavItems} />
					</div>

					<HeaderHamburgerButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(prev => !prev)} />
				</nav>

				<HeaderMobileMenu isOpen={isMenuOpen} items={headerNavItems} onClose={closeMenu} />
			</header>

			<div
				className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
					isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
				}`}
				onClick={closeMenu}
				aria-hidden="true"
			/>
		</>
	);
}
