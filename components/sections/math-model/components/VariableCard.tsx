import { IconBadge } from '@/components/ui/IconBadge';
import { accentClasses, VariableData } from '../math-model.constants';

export function VariableCard({ item }: { item: VariableData }) {
	const accent = accentClasses[item.accent];
	const hoverTitleColor =
		item.accent === 'green' ? 'group-hover:text-helio-green-light' : 'group-hover:text-helio-gold';

	return (
		<div className="group flex items-start gap-4 rounded-2xl border border-[rgb(255_255_255/0.15)] bg-[rgb(255_255_255/0.04)] px-4 py-4 transition-colors duration-300 hover:border-[rgb(255_255_255/0.24)]">
			<IconBadge label={item.symbol} colorVar={accent.colorVar} contentClassName="text-2xl" className="mt-0.5" />
			<div>
				<h3 className={`text-lead font-bold text-primary transition-colors duration-200 ${hoverTitleColor}`}>
					{item.name}
				</h3>
				<p className="text-body text-muted transition-colors duration-200 group-hover:text-primary">
					{item.description}
				</p>
			</div>
		</div>
	);
}
