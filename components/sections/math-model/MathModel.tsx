import { HeroGlow } from '@/components/ui/HeroGlow';
import { IconBadge } from '@/components/ui/IconBadge';

type Accent = 'green' | 'gold';

type EquationCardData = {
	symbol: string;
	title: string;
	subtitle: string;
	formula: string[];
	description: string;
	accent: Accent;
};

type VariableData = {
	symbol: string;
	name: string;
	description: string;
	accent: Accent;
};

const equationCards: EquationCardData[] = [
	{
		symbol: 'α',
		title: 'Elevação Solar',
		subtitle: 'Ângulo vertical do sol',
		formula: ['α = arcsin( sin(δ) · sin(φ) + cos(δ) ·', '        cos(φ) · cos(H) )'],
		description:
			'Calcula o ângulo de elevação do sol acima do horizonte, utilizado para determinar a inclinação vertical do painel lótus.',
		accent: 'green',
	},
	{
		symbol: 'A',
		title: 'Azimute Solar',
		subtitle: 'Ângulo horizontal do sol',
		formula: ['A = arctan( sin(H) / (sin(φ) · cos(H)', '      - cos(φ) · tan(δ)) )'],
		description:
			'Determina a direção horizontal do sol, permitindo que o painel gire para acompanhar o sol ao longo do dia.',
		accent: 'gold',
	},
];

const variables: VariableData[] = [
	{
		symbol: 'α',
		name: 'Elevação Solar',
		description: 'Ângulo do sol acima do horizonte',
		accent: 'green',
	},
	{
		symbol: 'δ',
		name: 'Declinação Solar',
		description: 'Ângulo entre os raios solares e o plano equatorial',
		accent: 'gold',
	},
	{
		symbol: 'φ',
		name: 'Latitude',
		description: 'Latitude do observador na superfície terrestre',
		accent: 'green',
	},
	{
		symbol: 'H',
		name: 'Ângulo Horário',
		description: 'Deslocamento angular do sol em relação ao meridiano local',
		accent: 'gold',
	},
	{
		symbol: 'A',
		name: 'Azimute Solar',
		description: 'Ângulo horizontal do sol medido a partir do norte',
		accent: 'green',
	},
];

const accentClasses: Record<
	Accent,
	{ colorVar: string; cardBorder: string; formulaColor: string; cardGradient: string; formulaSurface: string }
> = {
	green: {
		colorVar: '--helio-green',
		cardBorder: 'border-[rgb(50_205_50/0.28)]',
		formulaColor: 'text-helio-green',
		cardGradient: 'bg-[linear-gradient(145deg,rgba(8,42,20,0.25),rgba(3,20,10,0.22))]',
		formulaSurface: 'bg-[rgb(2_12_7/0.92)] border-[rgb(50_205_50/0.16)]',
	},
	gold: {
		colorVar: '--helio-gold',
		cardBorder: 'border-[rgb(255_215_0/0.28)]',
		formulaColor: 'text-helio-gold',
		cardGradient: 'bg-[linear-gradient(145deg,rgba(48,38,6,0.28),rgba(22,16,4,0.2))]',
		formulaSurface: 'bg-[rgb(12_10_3/0.9)] border-[rgb(255_215_0/0.16)]',
	},
};

export default function MathModel() {
	return (
		<section className="relative bg-helio-bg-secondary py-20">
			<HeroGlow
				className="-top-10 left-1/2 h-80 w-160 -translate-x-1/2"
				color="#228b22"
				opacityClass="opacity-18"
				shape="oval"
			/>

			<div className="relative z-10 mx-auto flex w-full max-w-340 flex-col items-center px-4 md:px-8">
				<h1 className="text-title mb-6">
					O <span className="text-gradient-gold">Modelo Matemático</span>
				</h1>
				<p className="max-w-3xl text-center text-lead text-secondary">
					O rastreamento solar do HelioSync é baseado em equações astronômicas que determinam a posição exata
					do sol a qualquer momento.
				</p>

				<div className="grid w-full mt-8 gap-8 xl:grid-cols-[1.05fr_1fr]">
					<div className="space-y-6">
						{equationCards.map(card => {
							const accent = accentClasses[card.accent];
							const hoverTitleColor =
								card.accent === 'green'
									? 'group-hover:text-helio-green-light'
									: 'group-hover:text-helio-gold';

							return (
								<article
									key={card.symbol}
									className={`group rounded-3xl border ${accent.cardGradient} ${accent.cardBorder} p-8 shadow-[0_20px_45px_-32px_rgba(0,0,0,0.8)] transition-colors duration-300`}
								>
									<div className="mb-7 flex items-start gap-4">
										<IconBadge
											label={card.symbol}
											colorVar={accent.colorVar}
											contentClassName="text-3xl"
										/>
										<div>
											<h3
												className={`text-subtitle text-primary transition-colors duration-200 ${hoverTitleColor}`}
											>
												{card.title}
											</h3>
											<p className="text-body text-muted transition-colors duration-200 group-hover:text-primary">
												{card.subtitle}
											</p>
										</div>
									</div>

									<div className={`rounded-2xl border px-8 py-7 ${accent.formulaSurface}`}>
										{card.formula.map(line => (
											<p
												key={line}
												className={`text-center font-mono text-[1.1rem] leading-[1.55] ${accent.formulaColor}`}
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
						})}
					</div>

					<aside className="rounded-3xl border border-[rgb(255_255_255/0.15)] bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 backdrop-blur-sm">
						<h2 className="flex items-center gap-3 text-lead font-bold text-primary">
							<span className="text-muted">(x)</span>
							Variáveis do Modelo
						</h2>

						<div className="mt-6 space-y-5">
							{variables.map(item => {
								const accent = accentClasses[item.accent];
								const hoverTitleColor =
									item.accent === 'green'
										? 'group-hover:text-helio-green-light'
										: 'group-hover:text-helio-gold';

								return (
									<div
										key={item.symbol + item.name}
										className="group flex items-start gap-4 rounded-2xl border border-[rgb(255_255_255/0.15)] bg-[rgb(255_255_255/0.04)] px-4 py-4 transition-colors duration-300 hover:border-[rgb(255_255_255/0.24)]"
									>
										<IconBadge
											label={item.symbol}
											colorVar={accent.colorVar}
											contentClassName="text-2xl"
											className="mt-0.5"
										/>
										<div>
											<h3
												className={`text-lead font-bold text-primary transition-colors duration-200 ${hoverTitleColor}`}
											>
												{item.name}
											</h3>
											<p className="text-body text-muted transition-colors duration-200 group-hover:text-primary">
												{item.description}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
}
