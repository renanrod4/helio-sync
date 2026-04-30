import { IconBadge } from '@/components/ui/IconBadge';
import { accentClasses, EquationCardData } from '../math-model.constants';

export function EquationCard({ card }: { card: EquationCardData }) {
	const accent = accentClasses[card.accent];
	const hoverTitleColor =
		card.accent === 'green' ? 'group-hover:text-helio-green-light' : 'group-hover:text-helio-gold';

	return (
		<article
			className={`group rounded-3xl border ${accent.cardGradient} ${accent.cardBorder} p-6 shadow-[0_20px_45px_-32px_rgba(0,0,0,0.8)] transition-colors duration-300 sm:p-8`}
		>
			<div className="mb-7 flex items-start gap-4">
				<IconBadge label={card.symbol} colorVar={accent.colorVar} contentClassName="text-3xl" />
				<div>
					<h3 className={`text-subtitle text-primary transition-colors duration-200 ${hoverTitleColor}`}>
						{card.title}
					</h3>
					<p className="text-body text-muted transition-colors duration-200 group-hover:text-primary">
						{card.subtitle}
					</p>
				</div>
			</div>

			<div className={`rounded-2xl border px-4 py-5 sm:px-8 sm:py-7 ${accent.formulaSurface}`}>
				{card.formula.map(line => (
					<p
						key={line}
						className={`text-center font-mono text-base leading-[1.55] sm:text-[1.1rem] ${accent.formulaColor}`}
					>
						{line}
					</p>
				))}
			</div>

			<p className="mt-6 text-body text-secondary transition-colors duration-200 group-hover:text-primary">
				{card.description}
			</p>
		</article>
	);
}
