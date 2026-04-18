import { Button } from '../Button';
import { HeaderNavMenu } from './HeaderNavMenu';
import type { NavItem } from './Header.types';

type HeaderMobileMenuProps = {
	isOpen: boolean;
	items: readonly NavItem[];
	onClose: () => void;
};

export function HeaderMobileMenu({ isOpen, items, onClose }: HeaderMobileMenuProps) {
	return (
		<div
			className={`absolute top-[calc(100%+0.65rem)] left-1/2 -translate-x-1/2 w-[min(92vw,30rem)] overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(160deg,rgba(13,40,24,0.98),rgba(6,14,6,0.96))] p-4 shadow-[0_20px_65px_-35px_rgba(0,0,0,0.95)] transition-all duration-350 lg:hidden ${
				isOpen
					? 'pointer-events-auto translate-y-0 opacity-100'
					: 'pointer-events-none -translate-y-3 opacity-0'
			}`}
		>
			<div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_15%_15%,rgba(50,205,50,0.35),transparent_60%)]" />

			<div className="relative z-10 flex flex-col gap-4">
				<HeaderNavMenu
					items={items}
					onItemClick={onClose}
					className="flex flex-col gap-1 px-0 py-0"
					itemClassName="hero-enter"
					linkClassName="block rounded-2xl border border-transparent px-4 py-3 text-base text-primary/90 transition-colors duration-200 hover:border-white/15 hover:bg-white/6 hover:text-primary"
				/>

				<Button variant="enter" className="w-full" onClick={onClose}>
					Entrar
				</Button>
			</div>
		</div>
	);
}
