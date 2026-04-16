import { Button } from '@/components/ui/Button';

export function HeroActions() {
	return (
		<div className="flex flex-wrap gap-4">
			<Button variant="explore">Explorar</Button>
			<Button variant="createAccount">Criar Conta</Button>
		</div>
	);
}
