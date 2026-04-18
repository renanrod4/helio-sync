import { Button } from '../Button';
import { HeaderNavMenu } from './HeaderNavMenu';
import type { NavItem } from './Header.types';

type HeaderActionsProps = {
	items: readonly NavItem[];
};

export function HeaderActions({ items }: HeaderActionsProps) {
	return (
		<div className="flex items-center gap-6">
			<HeaderNavMenu items={items} />
			<Button variant="enter">Entrar</Button>
		</div>
	);
}
