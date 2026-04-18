import type { NavItem } from './Header.types';

export const headerNavItems: readonly NavItem[] = [
	{ label: 'Início', href: '#' },
	{ label: 'Funcionalidades', href: '#' },
	{ label: 'Sobre', href: '#' },
	{ label: 'Contato', href: '#' },
] as const;
