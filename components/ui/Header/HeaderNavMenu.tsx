import type { NavItem } from './Header.types';

type HeaderNavMenuProps = {
	items: readonly NavItem[];
	className?: string;
	itemClassName?: string;
	linkClassName?: string;
	onItemClick?: () => void;
};

export function HeaderNavMenu({ items, className, itemClassName, linkClassName, onItemClick }: HeaderNavMenuProps) {
	const baseLinkClassName =
		'relative inline-flex py-1 text-secondary transition-colors duration-300 hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-helio-green after:transition-transform after:duration-300 hover:after:scale-x-100';

	return (
		<ul className={`flex items-center gap-8 px-6 py-4 text-nav text-secondary ${className ?? ''}`}>
			{items.map((i, index) => (
				<li key={i.label} className={itemClassName} style={{ animationDelay: `${index * 80}ms` }}>
					<a href={i.href} className={linkClassName ?? baseLinkClassName} onClick={onItemClick}>
						{i.label}
					</a>
				</li>
			))}
		</ul>
	);
}
